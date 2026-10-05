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
- Domain 4 (4.1–4.8) approved and live 2 Oct 2026 (71 corrections on file). 16 of 64 briefs are now evidence briefs.
- Source review: `docs/source-review-protocol.md`; `python3 scripts/source_check.py` (anchors, watch list, drift, coverage) writes to `content/sources/`. State 2 Oct 2026: 167/167 anchors found; 329 documents, 561 reading-list entries; 2 open queue items (regulator renamed; EU AI Act copy updated, dates confirmed). Checks: anchors, watch list, reading-list quotes, drift (30%). Not yet scheduled.
- Domains 1, 2, 5, 6, 7 and 8 (48 briefs) researched and lead re-checked 2 Oct 2026; awaiting Andy's sign-off. Pack: `../SIGN-OFF-PACK.md` and `../Domain-N-for-approval.md`. All 64 criteria now have an evidence brief and reading list; 510 corrections to the legacy briefings are on file.
- Andy's instruction 2 Oct 2026: run research, re-check and compilation unattended; he reviews and signs off once at the end. Pipeline per domain: researchers → `lead_check.py N --add` → figure anchors → `finalize_domain.py N "Name"` → `source_check.py`.
- Expansion pass done and approved 5 Oct 2026: 589 sources added (method `content/research/expansion/METHOD.md`, checker `scripts/expansion_check.py`). Directory now 660 documents, 15 to 23 per criterion. Citation type `enforcement decision` added. All 64 briefs are approved and live; Andy is sole reviewer; daily check scheduled 08:23 (task `principled-futures-source-review`).
- Next version (1.1.0) drafts for seven briefs flagged by the expansion (3.7, 3.8, 4.3, 5.7, 6.2, 6.4, 6.5) are in `content/briefs/next/` for Andy's sign-off; notes in `../Expansion-notes-on-published-briefs.md`.
- To publish an approved domain: set `status: approved` in the brief and library files, run `npm run seed:content`, apply 0005 to the database, build, deploy.
- Method: `content/research/METHOD.md`. One researcher per criterion; the lead re-reads every quotation and figure against raw source text.
- Then: Domain 3, then the other seven domains, approved domain by domain. One NotebookLM notebook per domain, named `Principled Futures · D<n> <domain>`.
- The 64 existing briefings carry no citations. Each gets the same claim-by-claim check.

## Open items
- [ ] Andy to decide queue item R-20261002-02: rename the regulator to "the Information Commission (ICO)" in six approved briefs (confirmed: DUAA s.117; site retitled)
- [ ] Andy to decide: update 3.5 figure to the precise 37 / 16
- [ ] Schedule the daily source check; name a second reviewer; build a review page
- [ ] Expansion pass to 12+ documents per criterion; back-fill quote/type/jurisdiction/published on Domains 3 and 4
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
