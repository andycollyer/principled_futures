# Principled Futures — handoff

Read this first. Single source of truth for where the product stands; loaded into every session via CLAUDE.md.
Last updated: 5 October 2026. Process: `~/Projects/slg3-app/docs/product-build-playbook.md` (copy the approach,
never SLG³'s code, accounts or data).

## What it is
A board-level assessment of how well an organisation governs its use of AI: 8 domains × 8 criteria, each scored
0–4 against described maturity levels. An augmented advisory service from Salveus Labs. AI ethics is the thread
through all eight domains (decision 1 Oct 2026: keep 8×8, deepen the evidence everywhere).

## Live
| What | Where |
| --- | --- |
| Public site | https://principledfutures.com — **private**: landing page + wait list at `/` (animated criteria map); `/privacy`, `/terms`, `/gdpr`, `/team` open; everything else needs the team passcode |
| Netlify | project `principled-futures-v5` (id `4edf72ca-49d4-46c9-a82a-af10a685da0c`), Salveus team. **Not linked to GitHub**: deploy by hand with `netlify deploy --prod --dir=out.nosync --site=<id>` (the build now lands in `out.nosync`, which iCloud leaves alone; never chain build and deploy in one step) |
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
| `src/app/welcome`, `src/app/team` | Public landing page with wait list (`src/components/landing/`); passcode entry |
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
- [x] Wait-list form tested on the live site 5 Oct 2026 (Netlify form detection was OFF on this site, so no sign-up could ever have been stored; now on; form `pf-waitlist` registered with name, email, organisation, role; one TEST ENTRY stored). Posts to `/__forms.html`
- [ ] Email alert for new wait-list sign-ups to support@principledfutures.com (awaiting Andy's go-ahead)
- [x] Landing page approved by Andy and public 5 Oct 2026 at `/welcome` (served at `/` by the gate); interim holding page deleted; privacy page now covers the wait list (wording is Claude's, for Andy and the solicitor to confirm)
- [ ] Obtain EHRC guidance on AI and the public sector equality duty (site blocked automated reading)
- [ ] Link the Netlify project to GitHub so the live site follows `main`
- [ ] Before selling: Supabase Pro; set `STRIPE_WEBHOOK_SECRET`; re-point the Stripe event destination to the new project; test a real purchase
- [ ] Rotate the old Supabase secret key pasted in chat in July (old project is gone; confirm nothing reuses it)
- [ ] Solicitor review of privacy, terms and GDPR pages; ICO registration before any sale
- [ ] Score-history trend recording (known gap since July)
- [x] Front-end redesign done and live 5 Oct 2026. Whole app restyled flat to match the landing page: white ground, one-pixel borders, no shadows on resting surfaces (shadow tokens set to none; only menus and dialogs keep one), no green patterned header blocks, one action colour (primary buttons now brand green), dark icon rail removed (search and help moved to the top bar). `/mobile` untouched.
- [x] Signature criteria map on the landing page (`CriteriaMap` in `src/components/landing/Visuals.jsx`): eight domains on a ring, 64 criteria, links drawn on a 16-second loop. Links are `CRITERION_LINKS` in `content-meta.ts`, generated by `seed-content.mjs` from documents shared between reading lists (145 links, 93 across domains). They are derived, not yet typed or approved one by one (playbook stage 3 still open)
- [ ] Old public landing (`src/app/page.tsx` → `components/Landing.jsx`) and `/pricing` are still in the old style; unseen while private. Before reopening, decide whether `/` becomes the new landing page
- [ ] Inner screens were checked in a preview build without sign-in; not yet checked signed in on the live site
- [x] Team access simplified 5 Oct 2026: the passcode goes straight to `/dashboard` (no options screen); old `/welcome-next` redirects to `/`. Migration 0009: `team_emails` table (andy@andycollyer.com) and `provision_org` gives listed addresses the `governance_plus` plan on first sign-in. Plan label in the product chrome now reads the real plan. Review the team list before reopening
- [x] Plan loophole closed 5 Oct 2026 (migration 0010): browser roles can only read `organisations`; plans change server-side only
- [x] Sign-in fixed 5 Oct 2026: the Netlify deploy step REBUILDS the site using Netlify's own stored settings, which still held the deleted database's address. Settings corrected; `check-bundle` now fails any build whose database address differs from `.env.local`. If the database ever moves again, update the Netlify settings too
- [ ] Sign-up has no email confirmation, so a team address could be claimed by whoever registers it first. Turn confirmation on before reopening
- [x] Overview and Telemetry merged 6 Oct 2026: one page (`src/app/dashboard/page.tsx`) reading where you stand → domain by domain (meaning + next step) → who owns it (`src/components/overview/Ownership.tsx`). Demo telemetry figures removed everywhere on desktop; `/dashboard/telemetry` redirects to `/dashboard/#owners`; measures list in `src/lib/measures.ts` (names, thresholds, rhythms, no values). Placeholder "Acme Holdings PLC / Director" replaced by the signed-in email
- [x] Guidance wording and measure names approved by Andy 6 Oct 2026
- [ ] Next on the overview: the live criteria map driven by the customer's answers (needs typed, approved links); then the guide agent; then eight domain videos
- [ ] The phone version (`/mobile`) still shows the old telemetry demo figures
- [x] Roadmap phase 1 built 6 Oct 2026: first sign-in asks organisation name, sector, size, reader's name and role (`/onboarding`, `src/lib/org.tsx`, migration 0011 `save_org_details`); product footer on every dashboard page; report addressed to the organisation and reader, demo benchmark removed; password reset by email (`/reset`, Supabase allow-list set). Score history was already being recorded from the assessment page
- [ ] Password reset uses Supabase's built-in email sender (limit about 2 an hour, plain sender name). Needs a proper email provider before customers. `/reset` is behind the passcode gate while the site is private
- [ ] Guide agent data terms: Andy says Anthropic's retention policy was checked when building SLG³; no written record found in the SLG³ files. Re-confirm current terms and record them before launch
- [x] Roadmap phase 2 done 6 Oct 2026: all eight domains' links approved by Andy. 144 directional links ("from" has to be in place for "to" to work), 12 dropped, every criterion connected. Data `content/links/1.0.0/domain-N.json`; approval docs `../Links-domain-N-for-approval.md`; tools `scripts/links_dump.py`, `links_doc.py`, `links_approve.py`. `seed-content.mjs` writes the approved links to `content-meta.ts` as `LINKS` (and the automatic pairs to `content/links/derived.json`, drafting material only). Direction and wording are Claude's judgement, approved by Andy, not re-read against each source word for word. Three links held for want of a shared source: 3.3→3.8, 5.3→5.4, 5.8→5.7
- [x] Roadmap phase 3 built 6 Oct 2026: live map on the overview (`src/components/overview/LiveMap.tsx`, `src/lib/links.ts`): 64 points coloured by the client's answers, select one to see what it holds back and depends on, with reasons and sources; "Where to start" ranks answers by levels short of the top × (1 + criteria held back); each domain row opens to its eight answers with "Show on map" and a deep link into the assessment (`?q=4.1`); owners can be named for domains and criteria as well as measures (`Owners.tsx`, keys `domain-N`, `criterion-N.N`); the report prefers the domain's named owner
- [x] Roadmap phase 4a built 6 Oct 2026: report rewritten (`src/components/report/ReportBody.tsx`): summary naming the three priorities; five priorities each with the answer given, what the next level requires, the criteria it holds back with reasons, owner, and evidence from the brief's reading list with date last checked; a 180-day plan with a distinct step per priority; position map and domain table; all 64 answers; method. Print page breaks set. Priority ranking now weighted from the client's own answers (`src/lib/links.ts`): shortfall × (1 + Σ over held-back criteria of (1 + how far each is rated above it)). Scores stay equal-weighted
- [x] RESOLVED 6 Oct 2026 (Andy added credits). Was: Netlify refused new deploys ("Account credit usage exceeded") on the Salveus team's credit-based Pro plan. Live site is on the 10:44 deploy (phase 3). Phase 4a report and response-weighted ranking are committed (ce763fb4) but NOT live. Andy to add credits or raise the limit; then run the deploy. Every production deploy uses credits, so batch changes and check in a local preview first; this blocks deploys for every site on the team, not only this one
- [x] Roadmap phase 4b built 6 Oct 2026: adviser sign-off (migration 0012 `report_reviews`; functions `is_team`, `request_report_review`, `my_report_review`, `review_queue`, `review_get`, `review_decide`; `src/lib/reviews.ts`; adviser page `/dashboard/review`, shown in the menu to team addresses only). A client sees no report until an adviser approves one, then sees the report built from the approved copy of their answers, carrying "Reviewed by Dr Andrew Collyer" and the date; if answers change it says so and offers a new review. Advisers see live answers. Advisers reach a client's answers and owners only through those functions. Database steps dry-run as Andy's account in a rolled-back transaction; the screens are not yet tested signed in
- [ ] No email tells the adviser a review is waiting, or the client that it is approved; both check the product for now
- [x] Client profile weighting built 6 Oct 2026, approved by Andy with the instruction that a legal trigger weighs more (`src/lib/profile.ts`, migration 0013 `organisations.profile`, `save_org_profile`). Five yes/no questions at first sign-in (EU exposure, decisions about individuals, special-category data, regulated or public body, mostly bought-in AI). A "yes" multiplies the ranking weight of the mapped criteria: legal trigger ×2, practical ×1.5, capped at ×3. The first four are treated as legal triggers, the fifth as practical. Shown on the map and under each report priority with its legal basis. Order of priorities only; scores unchanged. The criteria mapping is Claude's judgement, approved by Andy as proposed, not checked against the briefs line by line. Existing accounts are asked the five questions on next sign-in
- [ ] Weighting, further options discussed with Andy 6 Oct 2026, not built: client profile questions (EU exposure, automated decisions about people, regulated sector, public sector) that raise the relevance of specific criteria; strength grades on links; legal weight from the share of binding sources per criterion. Each needs Andy's sign-off on the mapping
- [ ] Seven 1.1.0 brief revisions in `content/briefs/next/` still await Andy's explicit sign-off

## Product roadmap (agreed 6 Oct 2026)
Roadmap artifact: https://claude.ai/artifact/CJR81jRejLMxwPhHHvTLej. Phases: 1 identity and brand; 2 criteria links with reasons, approved by Andy; 3 connected dashboard (live map); 4 personalised report; 5 guide agent; 6 proof and reach.
Andy's decisions 6 Oct 2026:
- First sign-in captures organisation name, sector, size, reader's name and role.
- A named adviser reviews every report before the client sees it; initially Dr Andrew Collyer. Phase 4 needs a review queue and sign-off.
- Guide agent runs on a Claude model; Andy leans to Haiku 4.5 for cost. Claude's advice: pilot Haiku and a larger model on the same test questions and choose on accuracy (not yet settled).
- The guide is for the highest plan only (`governance_plus`).
- The five band sentences (`guidance.ts`) and the measure names (`measures.ts`) are approved.

## Working rules
- Verify end to end before reporting; say what was and was not tested.
- Published content is versioned, never edited. Andy signs off content and anything public.
- Never commit secrets. Secrets reach Claude through a file Andy fills in, never through chat.
- Andy is not a developer: lead with "I'll do it", plain UK English, no tool names.
- Briefs: about 250 words, limit 290, one quotation, no internal question numbers, original sources only, no paywall workarounds.
