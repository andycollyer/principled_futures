# Source library expansion: method (all domains)

You are adding verified sources to the reading lists of Principled Futures, a UK board-level AI governance
assessment (64 criteria, eight domains). The approach follows SLG³'s expansion pass; the code and data are not shared.

Repo: /Users/andycollyer/Desktop/Salveus Technology Group Projects/Principled Futures Advisory/principled-futures-app
READ ONLY for you, except the one output file per criterion named below.

For each of your criteria read:
- the criterion in `src/lib/framework.ts` (question, "leading" text, level descriptions)
- its approved brief `content/briefs/1.0.0/<id>.md` and current reading list `content/library/1.0.0/<id>.json`
- the domain research log `content/research/notebooks/D<n>.md` (sources already tried, rejected or blocked, and why)
- `content/research/METHOD.md` (rules, lessons, citation fields)

## Goal
Bring each criterion to at least 13 distinct documents: find (13 − current count) NEW documents, and never fewer
than 4, that pass the quality bar. The founder wants the library to show command of legislation, regulation,
standards and reporting frameworks as well as research. Across old + new, wherever a genuinely relevant one exists:
- LEGISLATION or binding rules bearing on the criterion (UK first; EU where it reaches UK firms).
- REGULATOR guidance, enforcement decisions and audit findings (Information Commission/ICO, FCA, PRA, CMA, Ofcom,
  EHRC, HSE, FRC, ASA; sector regulators where relevant).
- CODES and STANDARDS: government codes of practice; NCSC; ISO/IEC, BSI, ETSI, IEEE, NIST. Many standards are sold:
  cite only what the standard-setter's own free page, free summary or free standard states, and set `access`.
- REPORTING FRAMEWORKS where relevant (UK SRS, IFRS S1/S2, TCFD, GHG Protocol, the EU voluntary SME standard).
- at least two PEER-REVIEWED or working-paper research sources with an open original (publisher open access, arXiv,
  SSRN, NBER, an author's or institution's repository). Meta-analyses and UK samples preferred.
- at least one source dated 2024 or later.
- one INTERNATIONAL COMPARATOR if a good one exists (OECD, UNESCO, Council of Europe AI Framework Convention,
  Singapore Model AI Governance Framework, Canada, Australia, US NIST or state law). Set `"comparator": true`.
- where relevant, a finding from an OFFICIAL INQUIRY, court or tribunal (Post Office Horizon IT Inquiry, the
  Australian Robodebt Royal Commission, the Dutch childcare benefits inquiry, A-level grading 2020 (Ofqual/OSR),
  NAO and Public Accounts Committee reports, UK court and tribunal judgments such as Bridges v South Wales Police).
Only include a source that really speaks to THIS criterion. Relevance beats count: do not pad. A document other
criteria already use is fine, but not one this criterion already has, and use a different passage from any quote
already recorded for that document elsewhere if you can.

## Quality bar (all five, or drop it)
1. The ORIGINAL: the publisher's own page, the journal's own copy, or the author's or institution's repository.
   Never a third-party copy, summary site, course site or archive copy of paywalled work.
2. You OPENED it and found the passage. Record section, paragraph or page, and an EXACT quote of 25 words or fewer
   copied character for character from the raw text (curl with tags stripped, or text extracted from the PDF
   itself; a summarising fetch is not a reading). It will be machine-checked against the link.
3. The right kind of evidence for what it is cited for (a statute for a duty, a study for an effect).
4. Limits stated in `why`: draft, under review, consultation, superseded, voluntary, sector-specific, non-UK,
   preprint, small sample, not peer reviewed.
5. Reachable today without a log-in. Never bypass a block, CAPTCHA or paywall; record it and move on.

## Output: exactly one file per criterion, `content/research/expansion/<id>.json`
```json
{
  "criterion": "3.1",
  "current_count": 6,
  "additions": [
    { "title": "", "publisher": "", "year": 2025, "published": "2025-03-14 or null", "url": "", "access": "free",
      "tier": "official | research | professional | practitioner",
      "type": "legislation | regulator guidance | code or standard | reporting framework | official report | court or tribunal | research | professional",
      "jurisdiction": "UK | EU | International | US | other", "locator": "", "quote": "", "why": "",
      "comparator": false, "last_checked": "YYYY-MM-DD" }
  ],
  "backfill": { "<url of an EXISTING reading-list item lacking them>": { "type": "", "jurisdiction": "", "published": null, "quote": "" } },
  "rejected": [ { "title": "", "url": "", "reason": "" } ],
  "brief_check": "one or two lines: does anything you read contradict or date the approved brief? If so, what and where."
}
```
`backfill` applies only where existing items lack `type`, `jurisdiction` or `quote` (Domains 3 and 4): supply them,
with an exact quote read today from that document. Elsewhere leave it `{}`.
Do not edit briefs, reading lists, anchors or any other file. Do not commit.

## Final message
Raw data, not prose: per criterion, the number of additions, the count by type, anything that contradicts the
approved brief, and sources that blocked you.
