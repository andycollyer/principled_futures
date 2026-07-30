// src/lib/stripe.ts
// Stripe checkout via Payment Links. A drag-and-drop static site can't create
// Checkout Sessions server-side (that needs a server + the secret key, which
// must never live in the site), so each paid plan points at a Stripe-hosted
// Payment Link. We append the organisation id as client_reference_id so the
// Supabase webhook (supabase/functions/stripe-webhook) can upgrade the right
// organisation the moment payment completes.
//
// To go live: create one Payment Link per paid plan in Stripe
// (Product → Payment link), then paste the URLs below and rebuild.
// Empty string = not configured yet → CTAs fall back to the contact flow.

export const PAYMENT_LINKS: Record<string, string> = {
  governance: "https://buy.stripe.com/aFa28q3ZmfjZcbp95GfjG00",        // £480/mo — verified: "Governance Membership £480.00 per month"
  "governance-plus": "https://buy.stripe.com/cNibJ0cvS5Jp3ET0zafjG01", // £1,250/mo — verified: "Governance + £1,250.00 per month"
};

/** The raw Payment Link for a plan, or null if not configured. */
export function paymentLinkFor(planId: string): string | null {
  const url = PAYMENT_LINKS[planId];
  return url && url.startsWith("http") ? url : null;
}

/**
 * A ready-to-open checkout URL for a plan. When we know the caller's
 * organisation (in-app checkout) we attach client_reference_id so the webhook
 * can upgrade exactly that org; we also pre-fill their email. On the public
 * pricing page neither is known — Stripe collects the email and the webhook
 * reconciles by email at next sign-in. Returns null if no link is configured.
 */
export function checkoutUrl(
  planId: string,
  opts: { orgId?: string | null; email?: string | null } = {},
): string | null {
  const base = paymentLinkFor(planId);
  if (!base) return null;
  const u = new URL(base);
  // Carry BOTH the organisation and the plan through the checkout, joined by
  // "__" (client_reference_id allows only letters, digits, - and _).
  //
  // The plan travels explicitly rather than being inferred from the amount
  // paid, because the amount is not a reliable signal: a discount code, a
  // free trial or a future price change all break amount-matching, and a
  // 100%-off coupon bills £0, which matches no tier at all.
  if (opts.orgId) {
    u.searchParams.set("client_reference_id", `${opts.orgId}__${planId.replace(/-/g, "_")}`);
  }
  if (opts.email) u.searchParams.set("prefilled_email", opts.email);
  return u.toString();
}
