# Stripe setup — Principled Futures

How card checkout is wired, and the few one-time steps to make paid plans
upgrade an organisation automatically.

## How it works

The site is a static export you drag onto Netlify, so it can't run checkout
itself. Instead:

1. **Payment Links** — each paid plan (Governance £480/mo, Governance+
   £1,250/mo) is a Stripe-hosted checkout page. The site's buttons open it.
   The URLs live in `src/lib/stripe.ts`.
2. **The webhook** — a small function on Supabase
   (`supabase/functions/stripe-webhook`) listens for "payment succeeded" and
   sets that organisation's `plan` to `governance` / `governance_plus`. No
   secret keys ever sit in the website.

When a signed-in user pays from **Settings → Billing**, we attach their
organisation id to the checkout, so the right org is upgraded exactly. A cold
buyer from the public **/pricing** page is matched by email at next sign-in.

## One-time setup

### 1. Confirm the two Payment Link URLs
In `src/lib/stripe.ts`, check the two links are on the correct plan:
- `governance` → the **£480/mo** link
- `governance-plus` → the **£1,250/mo** link

Each Payment Link (Stripe → Product → Payment link) must have **"Let customers
adjust quantity" OFF** and be set to a **subscription** price.

### 2. Deploy the webhook (Supabase CLI)
```bash
# from the app folder, once:
supabase login
supabase link --project-ref iizrsxtptbfpgthbgkba

# ONE secret only — the webhook never calls Stripe, so it holds no API key:
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx

# deploy — --no-verify-jwt lets Stripe call it without a user login:
supabase functions deploy stripe-webhook --no-verify-jwt
```
The function URL is:
`https://iizrsxtptbfpgthbgkba.supabase.co/functions/v1/stripe-webhook`

### 3. Point Stripe at the webhook
Stripe → Developers → Webhooks → **Add endpoint**:
- Endpoint URL: the function URL above
- Event to send: **`checkout.session.completed`**
- Copy the endpoint's **Signing secret** (`whsec_...`) → set it as
  `STRIPE_WEBHOOK_SECRET` (step 2) and re-deploy.

### 4. Test
Use Stripe **test mode** first (test keys + a test Payment Link). Pay with card
`4242 4242 4242 4242`, any future date/CVC. Confirm the org's `plan` flips in
the Supabase table editor. Then switch the links/keys to live.

## Status (29 July 2026)

DONE and verified live: webhook deployed, signing secret set, event destination
registered in Stripe for `checkout.session.completed`. Tested end to end —
a signed £480 event upgraded a test organisation to `governance`, a signed
£1,250 event to `governance_plus`, and tampered/replayed events were refused.

## Notes
- The webhook decides the plan from the **amount paid** (£480 vs £1,250), so
  the price ids don't need to be hard-coded.
- It holds **no Stripe API key** — only the signing secret, which can verify a
  message but cannot charge, refund or read customers. Signature checking is
  done directly (HMAC-SHA256) rather than via the Stripe SDK.
- Downgrades/cancellations aren't handled yet — add a
  `customer.subscription.deleted` handler when you want auto-downgrade.
- The Supabase **secret key** exposed in chat earlier should be rotated before
  going live; it must only ever live in Supabase/Netlify server settings.
