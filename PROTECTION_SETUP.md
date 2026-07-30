# Protection release — what to do to switch it on

Three steps. The first is required (the library will be empty without it);
the second and third can follow within the day.

## 1. Apply the database changes  ·  ~2 minutes

Supabase → **SQL Editor** → **New query** → paste the whole of
`supabase/APPLY_THIS.sql` → **Run**.

That creates the content tables, loads all 64 briefings, 86 glossary terms and
8 guides into them, adds the enquiries table, and creates the private bucket
for the board papers. Safe to run more than once.

## 2. Upload the board papers  ·  ~2 minutes

The 11 board papers are no longer part of the website, so they need putting
into your locked storage. Until this is done, the board papers in the library
won't open (everything else works).

Run this one command:

```bash
cd "/Users/andycollyer/Desktop/Salveus Technology Group Projects/Principled Futures Advisory/principled-futures-app" && npm run upload:papers
```

It will ask you for your Supabase service key. To get it:

**Supabase → your project → Settings → API → service_role → Copy**

Paste it at the prompt and press Enter. It stays hidden as you paste, is used
only for the upload, and is never written to a file or saved anywhere. You
should see 11 ticks.

Never paste that key into a chat window — it is a master password for your
database.

## 3. Deploy the two functions  ·  ~5 minutes

```bash
npx supabase login
npx supabase link --project-ref iizrsxtptbfpgthbgkba
npx supabase functions deploy issue-paper
npx supabase functions deploy stripe-webhook --no-verify-jwt
```

`issue-paper` hands out watermarked board papers. `stripe-webhook` upgrades an
organisation when it pays — see `STRIPE_SETUP.md` for its two secrets.

## Then

Drag **dist 29** onto Netlify.

---

## What changes for visitors

| Who | What they get |
|---|---|
| Anonymous | Marketing pages, and the first domain of the assessment (8 questions) |
| Free account | Their score, all 64 questions, 8 sample briefings, the glossary, the featured board paper |
| Governance / Governance+ | The full library — 64 briefings and all 11 board papers, watermarked to them |

## Notes

- Free samples are the opening briefing of each domain. To change which ones,
  edit `SAMPLES` in `scripts/seed-content.mjs`, re-run `npm run seed:content`,
  and apply the regenerated `0005_seed_content.sql`.
- `npm run build` now fails if library prose ever gets back into the shipped
  files. That check is the thing that keeps this from quietly regressing.
- Still outstanding: rotate the Supabase secret key that was pasted in chat,
  and have a solicitor read the updated privacy/terms/GDPR pages.
