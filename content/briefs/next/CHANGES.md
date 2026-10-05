# Next-version drafts (bank 1.1.0): what changed and why

Checked 5 October 2026. Seven drafts, each superseding the approved 1.0.0 brief of the same number. Nothing in
`content/briefs/1.0.0/`, the reading lists or `anchors.json` was edited.

Every string in the last column was found today in the raw text of the page or PDF at the address given
(`scripts/source_check.py` `fetch` and `norm`: tags stripped, or text extracted from the PDF itself). These are the
proposed anchors.

All seven bodies are 290 words, with one quotation each (unchanged from 1.0.0) and the six paragraphs in the same
order. Because each approved brief was already within 13 words of the limit, every addition had to be paid for by a
cut. Rows marked **Trim** are those cuts: they remove or shorten wording that is still correct and add no new claim.
They are listed so each can be accepted or reversed.

---

## 3.8 Remediation and redress

| Old sentence (1.0.0) | New sentence (draft) | Source and locator | Exact string(s) confirmed in raw text, with address |
| --- | --- | --- | --- |
| None of the provisions read requires an organisation to seek out affected people unprompted; that is a commitment the board chooses. | For most organisations, no provision read requires seeking out affected people unprompted; that is the board's choice. FCA-regulated firms must identify and remedy systemic problems in handling complaints (DISP 1.3.3R), should consider contacting customers who have not complained (DISP 1.3.6G) and must act to rectify harm caused (Consumer Duty guidance FG22/5, paragraph 5.15). | FCA Handbook, DISP 1.3.3R (rule) and DISP 1.3.6G (guidance); FCA FG22/5, para 5.15, PDF pp. 30-31 | `identifies and remedies any recurring or systemic problems` and `undertake proactively a redress or remediation exercise, which may include contacting customers who have not complained` at https://handbook.fca.org.uk/handbook/DISP/1/3.html ; `the firm must act in good faith by taking appropriate action to rectify the` at https://www.fca.org.uk/publication/finalised-guidance/fg22-5.pdf (the sentence runs over a page break in the PDF, so the anchor stops at "rectify the") |
| Under the Equality Act, a tribunal can award compensation and recommend steps to reduce the adverse effect on the complainant. | Under the Equality Act a court or tribunal can award compensation; an employment tribunal can also recommend steps to reduce the adverse effect on the complainant. | Equality Act 2010 s.124(1)-(3) (employment tribunal); s.119(1)-(4) (county court or sheriff, services) | `This section applies if an employment tribunal finds` and `make an appropriate recommendation` at https://www.legislation.gov.uk/ukpga/2010/15/section/124 ; `An award of damages may include compensation for injured feelings` at https://www.legislation.gov.uk/ukpga/2010/15/section/119 (the word "recommend" does not appear in the body of s.119) |
| Since 19 June 2026 controllers must also respond to data protection complaints and report the outcome. (UK position) and A controller must acknowledge a data protection complaint within 30 days of receipt (Data Protection Act 2018, section 164A(3)). (figure) | **Trim.** UK-position sentence removed; its date moved into the figure: Since 19 June 2026 a controller must acknowledge a data protection complaint within 30 days of receipt (Data Protection Act 2018, section 164A(3)). | Data Protection Act 2018 s.164A(3); note F1 for the date | `19.6.2026 in so far as not already in force` at https://www.legislation.gov.uk/ukpga/2018/12/section/164A ; existing figure anchor unchanged |
| A quiet fix leaves the cost of the error with the people least able to detect it. | **Trim.** Sentence removed. | none | none |
| For a significant decision taken solely by automated processing, the person must be given information and be able to make representations, obtain human intervention and contest it. | **Trim.** After a significant, solely automated decision, the person must be told and be able to make representations, obtain human intervention and contest it. | unchanged (UK GDPR Art. 22C) | existing |
| Anyone who suffers damage from a data protection infringement has a right to compensation. | **Trim.** Damage from a data protection infringement brings a right to compensation. | unchanged (UK GDPR Art. 82) | existing |

Notes. DISP 1.3.3R is a rule on "respondents" and is framed around complaints handling, so the draft says "in
handling complaints". DISP 1.3.6G is guidance ("should"). FG22/5 para 5.15 says a firm must act to rectify harm it
identifies; it does not itself mention customers who have not complained, so the draft does not attribute that to it.

---

## 3.7 Vendor fairness assurance

| Old sentence (1.0.0) | New sentence (draft) | Source and locator | Exact string(s) confirmed in raw text, with address |
| --- | --- | --- | --- |
| Whether a software supplier counts as their agent is untested, so buying a tool should not be assumed to move the duty. | Whether a software supplier counts as their agent is undecided, so buying a tool should not be assumed to move the duty. For public bodies and public functions only, a court has gone further: in Bridges v South Wales Police [2020] EWCA Civ 1058 (paragraphs 199-201), a force that relied on the manufacturer without independent verification of bias breached the public sector equality duty. | R (Bridges) v Chief Constable of South Wales Police [2020] EWCA Civ 1058, paras 199-201 (PDF pp. 42-43) and declaration 3 at para 210; Equality Act 2010 s.149(1)-(2) for who the duty binds | `SWP have never sought to satisfy themselves, either directly or by way of independent verification, that the software program in this case does not have an unacceptable bias on grounds of race or sex` ; `SWP have not done all that they reasonably could to fulfil the PSED` ; `The Respondent did not comply with the Public Sector Equality Duty in section 149 of the Equality Act 2010` ; `Neutral Citation Number: [2020] EWCA Civ 1058` , all at https://www.judiciary.uk/wp-content/uploads/2020/08/R-Bridges-v-CC-South-Wales-ors-Judgment.pdf ; `A person who is not a public authority but who exercises public functions must, in the exercise of those functions, have due regard` at https://www.legislation.gov.uk/ukpga/2010/15/section/149 |
| Data protection law requires a controller to be able to demonstrate fair processing, to use only processors giving sufficient guarantees, and to hold a contract allowing audits and inspections. That audit right covers data protection compliance; a wider fairness warranty has to be negotiated. | **Trim.** Data protection law allows only processors giving sufficient guarantees, under a contract allowing audits and inspections of data protection compliance; a fairness warranty has to be negotiated. (The clause on demonstrating fair processing is dropped.) | unchanged (UK GDPR Art. 28(1), 28(3)(h)) | `the controller shall use only processors providing sufficient guarantees to implement appropriate technical and organisational measures` and `allow for and contribute to audits, including inspections, conducted by the controller or another auditor mandated by the controller` at https://www.legislation.gov.uk/eur/2016/679/article/28 |
| The people affected are applicants, customers and staff scored or filtered by a tool the organisation did not build and cannot see inside. If the tool treats a group worse, they bear the harm, and they have no dealings with the supplier. The evidence sits with the vendor; the decision sits with the buyer. | **Trim.** Applicants, customers and staff are scored or filtered by a tool the organisation did not build and cannot see inside. If it treats a group worse, they bear the harm and have no dealings with the supplier. | none | none |
| The Equality Act 2010 places the duty not to discriminate on the employer and the service provider. | **Trim.** The Equality Act puts the duty not to discriminate on the employer and service provider. | unchanged | existing |
| Government guidance adds a pilot on the organisation's own data before deployment. | **Trim.** Government guidance adds a pilot on the organisation's own data. | unchanged | existing |
| A high answer needs someone able to judge the test results, and a record of what was done when the supplier last changed the model. | **Trim.** "the test results" becomes "the results". | none | none |

Notes. "Breached" rests on the court's own declaration that the force "did not comply" with the duty. The judgment
calls the duty "non-delegable" (para 199). The 296 / 97% / 3% figure and the quotation are unchanged and both anchors
still pass today.

---

## 6.4 Containment and kill-switch

| Old sentence (1.0.0) | New sentence (draft) | Source and locator | Exact string(s) confirmed in raw text, with address |
| --- | --- | --- | --- |
| No general UK law requires an off switch for AI. One sector has such a rule: firms engaged in algorithmic trading must be able to cancel unexecuted orders immediately in an emergency. | No UK law requires an off switch for AI as such. Employers in Great Britain must ensure, where appropriate, that work equipment, including AI-driven machinery, has readily accessible emergency stop controls (Provision and Use of Work Equipment Regulations 1998, regulation 16). Algorithmic trading firms must be able to cancel unexecuted orders immediately in an emergency. | S.I. 1998/2306 reg. 16(1); reg. 2(1) definition of work equipment; extent England, Wales and Scotland. Trading rule unchanged (Regulation 2017/589 Art. 12(1)) | `Every employer shall ensure that, where appropriate, work equipment is provided with one or more readily accessible emergency stop controls` and `Emergency stop controls E+W+S` at https://www.legislation.gov.uk/uksi/1998/2306/regulation/16 ; `"work equipment" means any machinery, appliance, apparatus, tool or installation for use at work` at https://www.legislation.gov.uk/uksi/1998/2306/regulation/2 ; `An investment firm shall be able to cancel immediately, as an emergency measure, any or all of its unexecuted orders` at https://www.legislation.gov.uk/eur/2017/589/article/12 |
| The government's voluntary Code of Practice on AI cyber security says developers and operators shall create, test and maintain incident and recovery plans, and that operators should be able to restore a known good state. | National Cyber Security Centre interim advice (20 August 2026) says organisations should always be able to halt autonomous AI agent activity immediately. (The Code sentence is removed to make room: **Trim**. The Code has no stop wording; it stays on the reading list.) | NCSC blog "Managing the cyber risk of agentic AI", consideration 7; publication date in the page footer | `you should always be able to 'pull the plug' and halt autonomous AI agent activity immediately` ; `Published 20 August 2026` ; `the NCSC is sharing interim practical advice` , all at https://www.ncsc.gov.uk/blogs/managing-the-cyber-risk-of-agentic-ai |
| against people who have no means of stopping it themselves | **Trim.** against people who cannot stop it themselves | none | none |
| examining 177,436 publicly available tools for AI agents, found that tools which take actions rose | **Trim.** examining 177,436 public tools for AI agents, found those which take actions rose | unchanged | existing figure anchors still pass |

Notes. The NCSC words are paraphrased, not quoted, so the brief keeps one quotation (the EU "stop button" text, still
on the Commission's page today). "Including AI-driven machinery" is this draft's reading of the definition of work
equipment, not words in the Regulations: regulation 16 does not mention AI or software. The Regulations extend to
Great Britain, so the draft says so. The Regulation 2017/589 page still lists a revocation by the Financial Services
and Markets Act 2023 as not yet applied.

---

## 6.2 Secure development and procurement

| Old sentence (1.0.0) | New sentence (draft) | Source and locator | Exact string(s) confirmed in raw text, with address |
| --- | --- | --- | --- |
| The government's Code of Practice of January 2025 builds on them, and an ETSI specification of April 2025 carries the same provisions. | The government's January 2025 Code of Practice builds on them; ETSI carried its provisions into a specification (April 2025) and a European Standard, EN 304 223 V2.1.1 (December 2025). | ETSI EN 304 223 V2.1.1, title page and Foreword (PDF p. 4); provision 5.1.2-7 (PDF p. 11); ETSI TS 104 223 V1.1.1 title page | `ETSI EN 304 223 V2.1.1 (2025-12)` ; `This European Standard (EN) has been produced by ETSI Technical Committee Securing Artificial Intelligence (SAI)` ; `Date of adoption of this EN: 8 December 2025` ; `they shall undertake a due diligence assessment and should ensure that the provider is adhering to the present document` , all at https://www.etsi.org/deliver/etsi_en/304200_304299/304223/02.01.01_60/en_304223v020101p.pdf ; `ETSI TS 104 223 V1.1.1 (2025-04)` at https://www.etsi.org/deliver/etsi_ts/104200_104299/104223/01.01.01_60/ts_104223v010101p.pdf |
| The binding rule is narrower: where personal data is processed, UK GDPR requires security appropriate to the risk, regularly tested. | The binding rules cover personal data only: UK GDPR Article 32 requires security appropriate to the risk, regularly tested, and Article 28, closest to buying, allows only processors giving sufficient guarantees, under a contract permitting audits and inspections. | UK GDPR Art. 28(1) and 28(3)(h); Art. 32(1)(d) | `the controller shall use only processors providing sufficient guarantees to implement appropriate technical and organisational measures` and `allow for and contribute to audits, including inspections, conducted by the controller or another auditor mandated by the controller` at https://www.legislation.gov.uk/eur/2016/679/article/28 ; `a process for regularly testing, assessing and evaluating` at https://www.legislation.gov.uk/eur/2016/679/article/32 |
| A Cyber Security and Resilience Bill is before Parliament and is not yet law. | **Trim.** A Cyber Security and Resilience Bill is before Parliament. | Parliament's bills data, read today: House of Lords, report stage, next sitting 26 October 2026, not an Act | `"isAct": false` and `"description": "Report stage"` in the record returned by https://bills-api.parliament.uk/api/v1/Bills?SearchTerm=Cyber%20Security%20and%20Resilience (a data feed, not a page; not suitable as a standing anchor) |
| Many organisations buy their AI rather than build it. ... carry a risk nobody examined. They did not choose the supplier and cannot inspect it. | **Trim.** Many organisations buy AI rather than build it. ... carry a risk nobody examined. They cannot inspect the supplier. | none | none |
| On buying, the Code says an organisation that works with an external provider | **Trim.** On buying, the Code says an organisation using an external provider | unchanged | quotation anchor still passes |
| Security requirements written into development practice and into contracts. ... Systems are tested before release and again when the model changes; consequential ones are tested independently. | **Trim.** Security requirements written into development practice and contracts. ... Systems are tested before release and when the model changes; consequential ones independently. | none | none |
| A supplier questionnaire that nobody reads is the common weak answer. | **Trim.** A supplier questionnaire nobody reads is the common weak answer. | none | none |
| 47% of those already using it had no cyber security practices specifically for AI. | **Trim.** 47% of those using it had no cyber security practices specific to AI. | unchanged | existing figure anchor still passes |

Notes. The quotation is still the UK Code's wording ("this Code of Practice"); the European Standard says "the
present document" instead, so the Code remains the quotation's source. The Standard is voluntary; the draft keeps the
approved sentence "The Code is voluntary" and does not add a separate statement about the Standard.

---

## 6.5 Incident response integration

| Old sentence (1.0.0) | New sentence (draft) | Source and locator | Exact string(s) confirmed in raw text, with address |
| --- | --- | --- | --- |
| The EU AI Act obliges providers of high-risk systems to report serious incidents to authorities, and deployers to tell the provider first; that text is being amended. | Under the EU AI Act, providers of high-risk systems must report a serious incident within 15 days of awareness (10 after a death; two for a widespread infringement or irreversible disruption of critical infrastructure); deployers tell the provider first. The Commission's consolidated copy of 27 July 2026 shows that article unamended and gives 2 August 2026 as the general application date, with later dates for high-risk requirements. | Regulation (EU) 2024/1689, Art. 73(1)-(4); Art. 3(49)(b); Art. 26(5); Art. 113. All from the Commission's AI Act Service Desk copy of the EUR-Lex consolidated text as at 27 July 2026 | At https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-73 : `Providers of high-risk AI systems placed on the Union market shall report any serious incident to the market surveillance authorities of the Member States where that incident occurred` ; `based on the EUR-Lex consolidated version of the AI Act as at 27 July 2026` ; `not later than 15 days after the provider or, where applicable, the deployer, becomes aware of the serious incident` ; `not later than two days after the provider or, where applicable, the deployer becomes aware of that incident` ; `not later than 10 days after the date on which the provider or, where applicable, the deployer becomes aware of the serious incident` ; `Chapter IX: Post-Market Monitoring` . At https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-113 : `It shall apply from 2 August 2026` and `Chapter III, Sections 1, 2, and 3, with the exception of Article 6(5), shall apply from` . At https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-26 : `they shall also immediately inform first the provider` . At https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-3 : `a serious and irreversible disruption of the management or operation of critical infrastructure` |
| Its governance code asks boards to see the plan exercised at least annually. | **Trim.** Sentence removed ("an AI scenario exercised yearly" remains under What good looks like; the code stays on the reading list). | none | none |
| ... are not told and not put right, and the same fault harms the next person. | **Trim.** ... are not told and not put right. | none | none |
| and to the individuals when the risk to them is high | **Trim.** and to individuals when the risk to them is high | unchanged | existing 72-hour anchor still passes |
| The government's voluntary code for AI security says | **Trim.** The government's voluntary AI security code says | unchanged | quotation anchor still passes |
| each incident reviewed and the lessons applied | **Trim.** each incident reviewed and lessons applied | none | none |
| The government's 2025/2026 breaches survey found that 25% of UK businesses had a formal incident response plan, and 45% had none of the response measures it asked about. | **Trim.** The 2025/2026 government breaches survey found 25% of UK businesses had a formal incident response plan, and 45% had none of the response measures listed. | unchanged | both existing figure anchors still pass |

Notes on the EU position, as the text reads today.
- The Article 73 page carries no "not yet updated" notice. The words "NEW" and "AMENDED" each appear once on it, in
  the standing explanation of the markers, and nowhere against the article's paragraphs. So Article 73 is shown
  unamended, and the 15, 10 and two-day limits stand.
- Whose duty: the provider's (Art. 73(1)). The deployer informs the provider first, then others (Art. 26(5)); if the
  deployer cannot reach the provider, Article 73 applies to the deployer.
- Application date: Article 113 does not name Article 73 or its chapter (Chapter IX). The only date that text gives
  for it is the general one, "It shall apply from 2 August 2026". Article 113(c), marked AMENDED, gives later dates
  for Chapter III Sections 1 to 3 (the high-risk requirements, which include the deployer's duty in Article 26). The
  draft reports those two facts and does not say whether the reporting duty bites in practice before the high-risk
  requirements apply; that is a legal question the text does not answer.
- Overlap to decide: the three day-count strings are already the figure anchors for the brief on incident readiness
  and suspension. Here they sit in the UK position paragraph, as instructed, and are not this brief's figure. If they
  are not to be anchored twice, anchor this brief on the first two strings in the row above and the Article 113 string.
- The draft does not state 2 December 2027, which three other briefs use as a figure; it says only "later dates".

---

## 5.7 Rights readiness

| Old sentence (1.0.0) | New sentence (draft) | Source and locator | Exact string(s) confirmed in raw text, with address |
| --- | --- | --- | --- |
| No UK figure was found. In Europe, 764 controllers answered the European Data Protection Board's 2025 coordinated action on erasure; the first recurring issue was no documented, current procedure for handling requests (report, pages 2 and 3). | An ICO enforcement notice against Bristol City Council (27 August 2025) records 189 overdue access requests in February 2024, up from 170, which the council said would take 50 months to clear (paragraphs 13-15). It is one council and not about AI. | ICO Enforcement Notice, Bristol City Council, dated 27 August 2025, paras 13 and 15 (PDF pp. 4-5) | `they had a backlog of 170 overdue SARs` ; `BCC's SAR backlog had increased to 189 outstanding cases` ; `take 50 months (over 3 years) to complete the SAR backlog` ; `DATED: 27 August 2025` , all at https://ico.org.uk/media2/tacptiie/bristol-city-council-enforcement-notice.pdf |
| (no sentence) | Since 19 June 2026 controllers must handle individuals' complaints (Data Protection Act 2018, section 164A). | Data Protection Act 2018 s.164A(1)-(4); note F1 for the date | `A controller must facilitate the making of complaints under this section` ; `inform the complainant of the outcome of the complaint` ; `19.6.2026 in so far as not already in force` , all at https://www.legislation.gov.uk/ukpga/2018/12/section/164A |
| The UK GDPR gives rights of access, rectification, erasure and objection, with no exception for AI. ... Erasure and objection are not absolute, except objection to direct marketing. | **Trim.** The UK GDPR gives rights of access, rectification, erasure and objection, with limits but no exception for AI. (The separate sentence on limits is folded into two words.) | unchanged (UK GDPR Arts 17 and 21) | existing |
| access extends to what a reasonable and proportionate search can find | **Trim.** access covers what a reasonable and proportionate search can find | unchanged | existing |
| The regulator has said output filters may not be enough, because they do not remove data from a model. | **Trim.** The regulator says output filters may not be enough: they leave data in the model. | unchanged | existing |

Notes. The European figure (764 controllers) is dropped for length, so the existing figure anchor
`a total of 764 controllers responded to the questionnaire` should be retired for this brief if the draft is
approved. The 170 figure is for March 2023 (para 13) and 189 for February 2024 (para 15). The same notice also
records that the council answered 400 of 961 requests (42%) within the legal time limit in the year to 31 March 2024
(para 18); not used, available if a rate is preferred to a backlog. The notice was issued by the Information
Commissioner, as the regulator was then named. The 30-day acknowledgement period is not stated here; it remains the
figure for the brief on remediation and redress. The one-month period for answering requests is also not stated; it
is another brief's figure.

---

## 4.3 Decision-specific explanation

| Old sentence (1.0.0) | New sentence (draft) | Source and locator | Exact string(s) confirmed in raw text, with address |
| --- | --- | --- | --- |
| Research for the explanation guidance used two citizens' juries, 36 people in all; most thought explanations important in recruitment and criminal justice, less so in healthcare (interim report, pages 10 and 15). | In the 2024 Bank of England and Financial Conduct Authority survey of 118 financial firms, 81% of those using AI employed some explainability method (section 2.7): a method, not an explanation to the person affected. | Bank of England and FCA, "Artificial intelligence in UK financial services - 2024" (21 November 2024), section 2.7 "Explainability"; section 1.2 and Chart 1 for the number of firms | `A high proportion of firms currently using AI (81%) employ some kind of explainability method.` and `A total of 118 firms responded to the survey` at https://www.bankofengland.co.uk/report/2024/artificial-intelligence-in-uk-financial-services-2024 |

Notes. Source wording is "some kind of explainability method"; the draft shortens it to "some explainability method"
and does not quote it. The 81% is of firms currently using AI, not of all 118 respondents (the report says 75% of
respondents were using AI). The survey covers regulated financial firms and is self-reported. The "46% partial
understanding" figure from the same report is not used; nor are the third-party figures from the same page that two
other briefs rely on. No other sentence in this brief was changed.

---

## Not verified, or left for a decision

- No statement in the seven drafts was left unverified. Every new sentence rests on a string in the tables above.
- "Undecided" (vendor fairness): that no court has ruled on whether a software supplier is the buyer's agent under
  section 109 is a negative carried over from the approved brief and the expansion note. It was not, and cannot be,
  confirmed from a single source.
- Whether the EU reporting duty has practical effect from 2 August 2026, before the high-risk requirements apply, is
  not settled by the text read. The draft states the dates the text gives and no more.
- Northern Ireland: the work equipment regulations cited extend to Great Britain. Whether Northern Ireland has an
  equivalent was not checked; the draft says "in Great Britain".
- Reading-list notes that are now out of date and need changing when these drafts are approved (not edited here):
  the entries for AI Act Article 73 (incident response) and Article 14 (containment) still say the page carries a
  "not yet updated" notice. Neither page carries it today; both show the consolidated text as at 27 July 2026.
