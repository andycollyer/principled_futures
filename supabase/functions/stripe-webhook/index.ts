// supabase/functions/stripe-webhook/index.ts
// Stripe webhook → upgrade an organisation's plan when a subscription is paid.
// Runs on Supabase Edge (Deno). Stripe calls it directly with no user session,
// so it must be deployed WITHOUT JWT verification:
//
//   supabase functions deploy stripe-webhook --no-verify-jwt
//
// It verifies the Stripe signature, then on `checkout.session.completed` sets
// organisations.plan (+ stripe_customer_id). It finds the organisation by, in
// order of preference:
//   1. client_reference_id — the org id we attach for in-app checkouts (exact)
//   2. the customer's email — for cold purchases from the public pricing page
//
// ONE secret is required (see STRIPE_SETUP.md):
//   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
//   (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.)
//
// Deliberately NOT a Stripe API key: this never calls Stripe, so it holds only
// the signing secret — which can verify a message but cannot move money.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

/**
 * Verify a Stripe signature without the Stripe SDK — and, deliberately,
 * without a Stripe API key.
 *
 * This function only ever needs to answer "did Stripe really send this?" and
 * then update a row. It never calls the Stripe API, so holding a secret API
 * key here would be pure downside: a key that can charge cards and issue
 * refunds, sitting in a service that has no use for it. The signing secret
 * can verify messages and nothing else, so that is all this holds.
 *
 * Stripe signs `${timestamp}.${rawBody}` with HMAC-SHA256 and sends
 *   Stripe-Signature: t=<unix>,v1=<hex>[,v1=<hex>]
 */
async function verifyStripeSignature(
  rawBody: string,
  header: string | null,
  secret: string,
  toleranceSeconds = 300,
): Promise<boolean> {
  if (!header || !secret) return false;

  const parts = Object.create(null) as Record<string, string[]>;
  for (const piece of header.split(",")) {
    const [k, v] = piece.split("=", 2);
    if (!k || !v) continue;
    (parts[k.trim()] ??= []).push(v.trim());
  }

  const timestamp = parts["t"]?.[0];
  const signatures = parts["v1"] ?? [];
  if (!timestamp || signatures.length === 0) return false;

  // Reject replays of an old, genuinely-signed event.
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > toleranceSeconds) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`),
  );
  const expected = [...new Uint8Array(mac)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time compare against each offered signature (there are two during
  // a secret rotation), so a wrong guess leaks nothing through timing.
  return signatures.some((sig) => {
    if (sig.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    return diff === 0;
  });
}

/** Only the fields of a Checkout Session this function actually reads. */
interface StripeSession {
  id?: string;
  amount_total?: number | null;
  client_reference_id?: string | null;
  customer?: string | null;
  customer_details?: { email?: string | null } | null;
}

const VALID_PLANS = new Set(["governance", "governance_plus"]);

/**
 * Split the client_reference_id we attached at checkout: "<orgId>__<plan>".
 *
 * The plan is carried explicitly because the amount charged is not a reliable
 * signal — a discount code, a free trial or a price change all break
 * amount-matching, and a 100%-off coupon bills £0, which matches no tier.
 * Older references without a plan suffix still parse, and fall back below.
 */
function parseReference(ref: string | null): { orgId: string | null; plan: string | null } {
  if (!ref) return { orgId: null, plan: null };
  const i = ref.indexOf("__");
  if (i === -1) return { orgId: ref, plan: null };
  const plan = ref.slice(i + 2);
  return { orgId: ref.slice(0, i), plan: VALID_PLANS.has(plan) ? plan : null };
}

// Fallback only: infer the tier from the amount charged (in pence) when no
// plan came through the reference. £480 → governance, £1,250 → governance_plus.
function planFromAmount(amount: number | null): string | null {
  if (amount == null) return null;
  if (amount >= 40000 && amount < 90000) return "governance";       // ~£480
  if (amount >= 90000) return "governance_plus";                    // ~£1,250
  return null;
}

// Cold public purchase (no org id attached): find the org via the buyer's
// email → their auth user → their profile's organisation.
async function orgIdForEmail(email: string): Promise<string | null> {
  const { data } = await supabase.auth.admin.listUsers();
  const user = data?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("organisation_id")
    .eq("id", user.id)
    .single();
  return profile?.organisation_id ?? null;
}

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!(await verifyStripeSignature(body, sig, webhookSecret))) {
    // Either not from Stripe, tampered with, or a replay of an old event.
    return new Response("Bad signature", { status: 400 });
  }

  let event: { type?: string; data?: { object?: StripeSession } };
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data?.object as StripeSession;

    // Prefer the plan we sent through checkout; fall back to the amount paid.
    const ref = parseReference(s.client_reference_id ?? null);
    const plan = ref.plan ?? planFromAmount(s.amount_total ?? null);

    let orgId = ref.orgId;
    if (!orgId && s.customer_details?.email) {
      orgId = await orgIdForEmail(s.customer_details.email);
    }

    if (orgId && plan) {
      const { error } = await supabase
        .from("organisations")
        .update({
          plan,
          stripe_customer_id: typeof s.customer === "string" ? s.customer : null,
        })
        .eq("id", orgId);
      if (error) {
        console.error("org upgrade failed:", error.message);
        return new Response(`DB update failed: ${error.message}`, { status: 500 });
      }
      console.log(`Upgraded org ${orgId} → ${plan}`);
    } else {
      // Payment succeeded but we couldn't tie it to an org (e.g. a cold buyer
      // with no account yet). Logged, not failed — 200 so Stripe won't retry.
      console.warn(`Unmatched payment: session ${s.id}, email ${s.customer_details?.email ?? "?"}, amount ${s.amount_total}`);
    }
  }

  return new Response("ok", { status: 200 });
});
