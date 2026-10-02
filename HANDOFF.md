# Principled Futures — handoff

Read this first. Single source of truth for where the product stands; loaded into every session via CLAUDE.md.
Last updated: 2 October 2026. Process: `~/Projects/slg3-app/docs/product-build-playbook.md` (copy the approach,
never SLG³'s code, accounts or data).

## What it is
A board-level assessment of how well an organisation governs its use of AI: 8 domains × 8 criteria, each scored
0–4 against described maturity levels. An augmented advisory service from Salveus Labs. AI ethics is the thread
through all eight domains (decision 1 Oct 2026: keep 8×8, deepen the evidence everywhere).

## Live
| What | Where |
| --- | --- |
| Public site | https://principledfutures.com — **private**: holding page + wait list at `/`; `/privacy`, `/terms`, `/gdpr`, `/team` open; everything else needs the team passcode |
| Netlify | project `principled-futures-v5` (id `4edf72ca-49d4-46c9-a82a-af10a685da0c`), Salveus team. **Not linked to GitHub**: deploy by hand with `netlify deploy --prod --dir=out --site=<id>` |
| Code | github.com/andycollyer/principled_futures (private), branch `main` |
| Database | Supabase `zmjkubaokuhzdddtejke`, London (eu-west-2), free plan. Pro before selling again |
| Functions | `issue-paper` (watermarked board papers), `stripe-webhook` (plan upgrade; signing secret NOT set on this project) |
| Wait list | Netlify form `pf-waitlist` (field names mirrored in `public/__forms.html`) |
| Selling | **Off.** `PAYMENT_LINKS` in `src/lib/stripe.ts` emptied; conditions for restoring are in that file |

Netlify settings: `SITE_PRIVATE=1`, `TEAM_PASSCODE` (also in `../TEAM-PASSCODE.txt`). Unset `SITE_PRIVATE` and redeploy to reopen.

## Code map
| Path | What |
| --- | --- |
| `src/lib/framework.ts` | The 64 criteria, bank 1.0.0. Source of truth; never edit wording, publish a new version |
| `src/lib/articles.ts`, `glossary.ts`, `guides.ts` | Briefings, glossary, guides: source of truth, **never imported by the app** |
| `scripts/seed-content.mjs` | Generates `src/lib/content-meta.ts` (titles only) and `supabase/migrations/0005_seed_content.sql` |
| `scripts/check-bundle.mjs` | Fails the build if library prose reaches the shipped files |
| `src/lib/content.ts`, `papers.ts` | Fetch briefing bodies and board papers per reader, gated by plan in the database |
| `netlify/edge-functions/gate.ts` | The privacy gate |
| `src/app/welcome`, `src/app/team` | Holding page with wait list; passcode entry |
| `supabase/migrations/` | 0001–0007: schema, RLS, content tables, enquiries, private paper bucket |
| `content/briefs/1.0.0/`, `content/library/1.0.0/` | Evidence briefs and reading lists per criterion; `status: draft` until Andy approves |
| `content/research/notebooks/` | Research log per domain |
| `content/research/CORRECTIONS.md` | Wording corrections held for the next version |
| `assets/research/` | The 11 board-paper PDFs (uploaded to the private bucket by `npm run upload:papers`) |

## Content programme
- Format approved by Andy 2 Oct 2026 (pilot 3.1). Decision: the new briefs REPLACE the legacy briefings in the product, domain by domain, on approval.
- Domain 3 (3.1–3.8) approved by Andy 2 Oct 2026 and live in the product: `scripts/seed-content.mjs` uses any brief with `status: approved` in place of the legacy briefing (title, body, reading list, checked date; migration 0008). Legacy briefings still serve the other 56 and are labelled "awaiting evidence review".
- Domain 4 research in progress (2 Oct 2026).
- To publish an approved domain: set `status: approved` in the brief and library files, run `npm run seed:content`, apply 0005 to the database, build, deploy.
- Method: `content/research/METHOD.md`. One researcher per criterion; the lead re-reads every quotation and figure against raw source text.
- Then: Domain 3, then the other seven domains, approved domain by domain. One NotebookLM notebook per domain, named `Principled Futures · D<n> <domain>`.
- The 64 existing briefings carry no citations. Each gets the same claim-by-claim check.

## Open items
- [ ] Establish whether the Information Commission has formally replaced the ICO (UK GDPR Art. 36 reads "the Commission" from 30 Sep 2026) and rename across briefs
- [ ] Read the EU AI Act from an original source (EUR-Lex returned empty pages)
- [ ] Wait-list form: submit a test entry on the live site; add an email alert to support@principledfutures.com
- [ ] Obtain EHRC guidance on AI and the public sector equality duty (site blocked automated reading)
- [ ] Link the Netlify project to GitHub so the live site follows `main`
- [ ] Before selling: Supabase Pro; set `STRIPE_WEBHOOK_SECRET`; re-point the Stripe event destination to the new project; test a real purchase
- [ ] Rotate the old Supabase secret key pasted in chat in July (old project is gone; confirm nothing reuses it)
- [ ] Solicitor review of privacy, terms and GDPR pages; ICO registration before any sale
- [ ] Score-history trend recording (known gap since July)
- [ ] Front-end redesign and final landing page, after the content programme

## Working rules
- Verify end to end before reporting; say what was and was not tested.
- Published content is versioned, never edited. Andy signs off content and anything public.
- Never commit secrets. Secrets reach Claude through a file Andy fills in, never through chat.
- Andy is not a developer: lead with "I'll do it", plain UK English, no tool names.
- Briefs: about 250 words, limit 290, one quotation, no internal question numbers, original sources only, no paywall workarounds.
