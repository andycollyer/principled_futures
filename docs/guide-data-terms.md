# The guide: what happens to what a client types

Checked against Anthropic's published pages on 6 October 2026 (raw page text, not a summary).
Andy reports the same check was made when building SLG³; no written record of that was found, so this is the record.

## What Anthropic says (commercial products, including the API)

- **Retention.** "For Anthropic API users, we automatically delete inputs and outputs on our backend within 30 days of receipt or generation", except where a longer-retention service is used, where otherwise agreed (for example a zero data retention agreement), where needed to enforce the Usage Policy, or to comply with the law.
  Source: privacy.claude.com, "How long do you store my organization's data?"
- **Flagged content.** Inputs and outputs flagged by automated trust and safety systems as violating the Usage Policy may be kept for up to 2 years, and classification scores for up to 7 years. Same source.
- **Training.** "By default, we will not use your inputs or outputs from our commercial products (e.g. Claude for Work, Anthropic API, Claude Gov, etc.) to train our models", unless feedback is explicitly submitted or the customer otherwise chooses to allow it.
  Source: privacy.claude.com, "Is my data used for model training?"

## Not yet confirmed

- Where the processing takes place, and the transfer mechanism for UK personal data. Needs Anthropic's Commercial Terms, Data Processing Addendum and sub-processor list read, and the DPA accepted on the account.
- Whether a zero data retention agreement is available to an account of this size.
- The "Covered Models" note on the retention page (limited retention and review for some models): confirm whether it applies to the models used.

## What the product itself keeps

- Every question and answer is stored in `guide_log` against the organisation, with the model and token counts, so that what the AI told a client can be reviewed. Readable only by Principled Futures advisers.
- The guide is sent: the criterion, its level descriptions, the approved brief and reading list, the approved links, the client's answer levels for that criterion and the linked ones, the client's sector and size, and the client's question. It is not sent the organisation's name, the reader's name or email, or named owners.
- The form asks the client to leave out names and anything confidential.

## Before the guide is offered to a paying client

1. Accept Anthropic's DPA on the product's account and record the date here.
2. Add the wording in `../Guide-privacy-wording-for-approval.md` to the privacy, terms and GDPR pages (solicitor review).
3. Decide how long `guide_log` is kept. Proposal: 24 months, as for enquiries.
