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
