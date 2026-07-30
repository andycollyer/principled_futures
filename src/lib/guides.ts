// src/lib/guides.ts
// Product guides: short "how this works" articles for the Help page and
// search. STATUS: DRAFT copy — awaiting Andy's sign-off. UK English.

export interface Guide {
  id: string;
  title: string;
  body: string[]; // paragraphs
}

export const GUIDES: Guide[] = [
  {
    id: "how-scoring-works",
    title: "How scoring works",
    body: [
      "Every one of the 64 assessment criteria is answered on a 0–4 scale, where each level is a described maturity state — not a feeling. Your answer for a criterion is the level whose description best matches your organisation today.",
      "A domain's score is the average of its answered criteria, converted to 0–100. Your overall score is the average of your domain scores, so each of the eight domains carries equal weight in version 1.0 of the framework.",
      "Scores map to maturity bands at fixed thresholds: 0–19 Initial, 20–39 Developing, 40–59 Defined, 60–79 Managed, 80–100 Leading. The same bands appear everywhere — assessment, telemetry, report — so a number always means the same thing.",
      "Unanswered criteria are never counted as zero. A domain you have not started shows no score at all, and your overall score reflects only what you have actually assessed.",
    ],
  },
  {
    id: "running-the-assessment",
    title: "Running the assessment",
    body: [
      "The assessment is 64 questions across eight domains, and everything autosaves as you go — leave and return whenever suits. The rail on the left shows each domain's progress, and a green check appears when a domain's eight criteria are complete.",
      "Answer honestly rather than aspirationally: the framework rewards knowing where you are, and every criterion links to a briefing explaining what leading practice looks like and why it matters.",
      "Many boards split the work by domain — the finance director takes ESG, the operations lead takes security — using the category rail to jump directly to their section. The picture assembles as each section completes.",
      "When all 64 are answered, the completion banner offers your three next moves: download the board pack, copy a board summary, and assign owners to the telemetry measures.",
    ],
  },
  {
    id: "maturity-bands",
    title: "The five maturity bands",
    body: [
      "Initial means the practice is absent — no awareness or action. Developing means it happens, but reactively and informally, dependent on individuals rather than process.",
      "Defined means the practice is documented: a policy, a register, a procedure with a named owner. This is the band where most obligations start being defensible, because what is written down can be evidenced.",
      "Managed means the documented practice is measured — adherence monitored, results tracked, deviations corrected. Leading means it is externally assured, benchmarked, and improving on evidence: the band where governance becomes a commercial asset.",
      "The bands deliberately describe how work is done, not how much. A small organisation can be Leading; a large one can be Initial. Maturity is a property of discipline, not headcount.",
    ],
  },
  {
    id: "assigning-owners",
    title: "Assigning metric owners",
    body: [
      "Every telemetry measure should belong to one named person in one accountability ring. On the Telemetry page, each metric card carries an owner chip — click it to assign a name, a role and a ring.",
      "The three rings carry different rhythms: Run it is the people using AI daily, watching the measures week by week. Steer it is senior management and the board, setting thresholds and acting on breaches. Check it is the outside eyes — your accountant, auditor or reviewer — confirming annually that the records reflect reality.",
      "Assignments persist and flow through the product: the advisory report's priority risks name the owner of each affected area, and the rings section shows how many measures each circle owns.",
      "The rule that makes it work: if a number has no name, it isn't governed — it's just displayed. The warning above the register counts your unowned measures until they reach zero.",
    ],
  },
  {
    id: "reading-the-report",
    title: "Reading the advisory report",
    body: [
      "The report assembles itself from your assessment: an executive summary with your overall score and band, priority risk areas for domains scoring under 60, the full category breakdown with movement since your last snapshot, a peer benchmark, and a sequenced roadmap.",
      "Priority areas name their weakest criteria — the specific questions dragging the score — and each links to the accountable owner you assigned in Telemetry, or tells you plainly that the area is unowned.",
      "Download PDF produces a print-ready board pack; Share with board opens a pre-drafted email. Both carry only what you choose to send — nothing is transmitted to us.",
      "The current report is a draft template: scores and structure are live, and the written narrative will be generated when the reporting phase completes. The draft badge stays until then.",
    ],
  },
  {
    id: "demo-data",
    title: "What demo data means",
    body: [
      "Anything labelled Demo data is illustrative: the telemetry metric readings, the overview's KPI figures, and the peer benchmark values. They show how the product behaves, not facts about your organisation.",
      "Everything derived from your own assessment is real: your scores, bands, domain heatmap, history and report content. The two are never mixed without a label.",
      "Live metric feeds replace the demo values when integrations arrive. Until then, treat demo numbers as furniture in a show home — accurate about the room, silent about your life.",
    ],
  },
  {
    id: "regulatory-countdown",
    title: "The regulatory countdown",
    body: [
      "The Telemetry page's countdown tracks the regulatory deadlines that matter to AI-deploying organisations — currently Article 50's transparency duties (2 August 2026) and the synthetic-content watermarking deadline for legacy systems (2 December 2026).",
      "Each counter turns amber inside 30 days and red inside 7, and disappears once the date has passed. The values compute from today's date every time you load the page.",
      "The countdown is a prompt, not a compliance calendar: the briefings for criteria 4.1 and 4.2 explain what each deadline actually requires of you.",
    ],
  },
  {
    id: "your-data",
    title: "Where your data lives",
    body: [
      "Everything you enter — answers, score history, owner names — is stored in your browser, on your device. It is not transmitted to us, and we cannot see it. Clearing your browser's site data deletes it permanently.",
      "This also means your data does not follow you between devices or browsers yet. Cloud accounts, with sign-in and per-organisation storage, are the next phase — and will arrive with an updated privacy policy before anything changes.",
      "The full detail is in the Privacy policy and GDPR statement, linked in the footer. The short version: we practise the data minimisation our own briefings preach.",
    ],
  },
];
