# Source review protocol

How Principled Futures keeps its briefs accurate and current. Modelled on SLG³'s 14-day review
(`~/Projects/slg3-app`, "source library: growing to 500+ and the 14-day review"); the approach is copied, the
code and data are not. Written 2 October 2026 from what Domains 3 and 4 taught us.

## The rule
Machines re-read; a person decides. Nothing a client sees changes without Andy's decision, and every check and
decision is kept, dated. Approved briefs are never edited in place: a decision produces the next version.

## What is checked (`scripts/source_check.py`, files in `content/sources/`)
| Check | Every | What it catches | Why it exists |
| --- | --- | --- | --- |
| **Anchors** (`anchors.json`) | run | The exact words a brief quotes, and the words behind each figure, are no longer on the page | A brief is only as good as its one quotation and one figure. 35 anchors across 16 briefs at baseline |
| **Watch list** (`watch.json`) | run | A known moving part has moved: draft guidance finalised, an "under review" banner gone, a body renamed | Domains 3 and 4 rest on two draft or under-review ICO guidance sets and an EU text mid-amendment |
| **Quotes** (reading lists) | 14 days per document | The passage a reading list cites from a document is no longer in it | Every citation in the directory carries an exact quotation of 25 words or fewer |
| **Drift** (`fingerprints.json`) | 14 days per document | The document no longer loads, or 30% or more of its passages changed | Guidance is rewritten without notice. Smaller drift is recorded, not queued: on 2 Oct 2026 seven ICO pages shifted 5 to 29% within hours while every cited passage stayed put, so a low threshold only makes noise |
| **Coverage** (`coverage.json`) | run | Criteria below 12 documents; citation fields missing | Tracks progress to the 500-document directory |

Anything found goes to `queue.json` with a decide-by date 14 days out. `history.jsonl` keeps every run.

## The cycle
1. **Daily, automatic:** all anchors, the whole watch list, and a fourteenth of the directory.
2. **Queue:** each item says what changed, which criteria it touches and what the proposed action is.
3. **Decision, within 14 days, by Andy:** keep / reword in next version / replace source / withdraw claim.
   Recorded on the queue item with the date and a note.
4. **New version:** agreed rewording goes into `content/research/CORRECTIONS.md`, then the next brief set.
5. **Reviewer:** Andy Collyer alone while the product is being built (decision 5 October 2026). The lead re-check is the second pair of eyes. Name a second reviewer before selling.

## Triggers outside the cycle (re-read the affected briefs at once)
- A statute cited by a brief shows new "outstanding effects" or a new commencement order on legislation.gov.uk.
- A regulator publishes final guidance where a brief quotes a draft.
- A new enforcement action, judgment or official inquiry on a brief's subject.
- A source contradicts another brief (found while researching a different criterion).

## Lessons already built in
- **A summarising fetch is not a reading.** A summary tool told us the regulator's site still said "Information
  Commissioner's Office"; the raw page title said "Information Commission's Office". Checks use raw text only.
- **Reports contradict themselves.** One ICO report says "all accepted" on p.4 and "97% accepted" on p.12; another
  says "over 30 employers" on its landing page and "37" in its introduction. Use the precise passage; log both.
- **Draft and "under review" guidance must be labelled** in the reading list and put on the watch list.
- **EU law is moving.** EUR-Lex has returned empty pages; the Commission's copy says it is not yet updated for the
  2026 amendments. No EU date is stated from memory, and every EU date is on the watch list.
- **Legacy briefings cannot be trusted on who owes a duty.** The commonest error in Domains 3 and 4 was assigning a
  duty to the wrong party (provider vs deployer; statute vs guidance). Every "must" names its source and its subject.
- **One quotation and one figure per brief, never reused within a domain.**

## The directory (target 500+ distinct documents, at least 12 per criterion)
`content/sources/directory.json` lists every document once, with the criteria that rely on it and the passage
each uses. First-pass research gives about 6 per criterion; a second "expansion" pass per criterion (as SLG³ ran)
adds legislation, codes, standards, reporting frameworks, peer-reviewed research, official inquiries and one
international comparator where a relevant one exists. Relevance beats count.

A complete citation has: title, publisher, year, publication date where shown, type, jurisdiction, tier, link,
access, locator (section, paragraph or page), an exact quotation of 25 words or fewer, and the date last checked.

## Not yet done
- Scheduling the daily run on the Mac (needs Andy's go-ahead; SLG³ runs at 07:30).
- A review page in the product for deciding queue items (SLG³ has `/review`).
- Citation fields `quote`, `type`, `jurisdiction`, `published` for the 69 documents from Domains 3 and 4.
