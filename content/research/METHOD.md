# Research method (all domains)

One researcher per criterion; the lead re-checks every figure and quotation before anything goes to Andy.

## Inputs
- The criterion: `src/lib/framework.ts` (question, "leading" text, five level descriptions). Never edit it.
- The legacy briefing: `src/lib/articles.ts`, same id. It has no citations; treat every factual claim as unverified.
- The worked example: `content/briefs/1.0.0/3.1.md`, `content/library/1.0.0/3.1.json`, the 3.1 section of
  `content/research/notebooks/D3.md`, and `content/research/CORRECTIONS.md`.

## Steps
1. List every factual, legal or regulatory claim in the legacy briefing.
2. Find the original source for each (statute on legislation.gov.uk, regulator's own page, the standard body,
   the official report). Read the source text itself. Record section, paragraph or page.
3. Mark each claim: supported / partly / wrong / not found. Never mark supported from memory.
4. Write the brief, the reading list and the log.

## Brief (`content/briefs/1.0.0/<id>.md`)
- Front matter: criterion, bank "1.0.0", status draft, checked date.
- Title = the criterion title. Six bold-led paragraphs, in this order: What it measures. Why it matters.
  The UK position. What good looks like. Reading the answer. A defensible figure.
- About 250 words of body, hard limit 290. Exactly one quotation, verbatim from a source you read.
- "A defensible figure" is a number you saw in the source with its page or section, or the plain sentence
  "No defensible figure was found."
- AI ethics is the thread: say what the ethical harm is, to whom, in plain words.
- UK English, plain, no hype, no exclamation marks, no internal criterion numbers ("3.2", "1.4"), no product names
  of registered methods or tools.

## Reading list (`content/library/1.0.0/<id>.json`)
3 to 6 items, same fields as 3.1.json: title, publisher, year, tier (official / research / professional /
practitioner), url, access, locator, why. Only sources actually read in this pass.

## Log (`content/research/notebooks/D<n>-<id>.md`)
Sources read and kept; sources tried and not used (and why); a table of every legacy claim with its finding;
proposed corrections in the CORRECTIONS.md table format; anything you could not verify.

## Rules
- Originals only. No archive or third-party copies of paywalled work; cite the free abstract or drop it.
- Never bypass a block, CAPTCHA or log-in. If a publisher refuses, record it and move on.
- Never send personal data to any service.
- Law changes: the Data (Use and Access) Act 2025 amended UK GDPR (Article 22 replaced by Articles 22A-22D).
  Check the current text; note any "under review" banner on regulator guidance.
- Do not edit any file outside the three outputs for your criterion.

## Lessons from Domain 3 (apply from Domain 4)
- A fetch tool that summarises is not a reading. Before quoting or citing a number, confirm the words in the raw
  page text (for example `curl -sL <url>` with the tags stripped, or text extracted from the PDF itself).
- Do not reuse a quotation or a figure that another brief in the same domain is likely to use. If the only figure
  you have is generic, write "No defensible figure was found."
- EU law: EUR-Lex HTML has returned empty pages. Try the Official Journal PDF on EUR-Lex. Failing that, the
  European Commission's own pages (AI Act Service Desk, digital-strategy.ec.europa.eu) count as official, but say
  in the reading list that it is the Commission's copy and note any "not yet updated" notice. Third-party copies
  are not cited. If no official text can be read, the brief makes no EU claim.
- EU AI Act dates moved in 2026 (the Digital Omnibus). Never state an application date from memory or from the
  legacy briefing; state it only from an official source read in this pass, and name that source in the log.
- UK automated decision-making law is UK GDPR Articles 22A-22D (in force 5 February 2026, S.I. 2026/82). ICO
  guidance on AI is "under review" and its new automated decision-making guidance is a consultation draft: say so
  in the reading list when you rely on either.
- Name the regulator as its own source names it. (Open question: statute reads "the Commission" from 30 Sep 2026.)
- Where a report contradicts itself, use the more precise passage and record both in the log.
- In the log, give proposed corrections as table rows starting `| <id>-a |`, `| <id>-b |` and so on.

## Citations for the source directory (apply from Domain 5)
The reading lists feed a directory of 500+ documents that is machine-checked every fortnight
(`docs/source-review-protocol.md`). So every reading-list item must be a complete citation:
- `title`, `publisher`, `year`, `published` (the date shown on the document, or null), `url`, `access`, `tier`
- `type`: legislation | regulator guidance | code or standard | reporting framework | official report |
  court or tribunal | research | professional
- `jurisdiction`: UK | EU | International | US | other
- `locator`: section, paragraph or page
- `quote`: an exact passage of 25 words or fewer, copied character for character from the raw text you read
  (it is machine-checked against the page; a paraphrase will fail)
- `why`, and `last_checked` (today's date)
Aim for 8 to 10 items per criterion in the first pass: the binding rule, the regulator's guidance, a standard or
framework, an official report or inquiry, research where it exists, and one international comparator where
relevant. Relevance beats count; do not pad. In the log, also give the anchors for the lead: the brief's
quotation and each figure as exact strings with the URL where each was read.
- The UK data protection regulator is now the Information Commission (Data (Use and Access) Act 2025 s.117;
  its site is titled "Information Commission's Office"). In brief text write "the Information Commission (ICO)".
  In reading lists keep the publisher name printed on the document.

- Update, 2 October 2026 (afternoon): the Commission's AI Act Service Desk copy now states it is "based on the
  EUR-Lex consolidated version of the AI Act as at 27 July 2026" and marks Digital Omnibus changes NEW or AMENDED.
  It may be cited for EU provisions and dates, named as the Commission's copy of the consolidated text, with the
  consolidation date in the reading-list note. Still read the article page itself in raw text.
