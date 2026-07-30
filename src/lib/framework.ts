// src/lib/framework.ts
// Principled Futures 8×8 Governance Maturity Framework — v1.0
// Equal-weighted. UK/EU regulatory basis current as of 22 July 2026.

export const BAND_LABELS = ["Initial", "Developing", "Defined", "Managed", "Leading"] as const;
export type Level = 0 | 1 | 2 | 3 | 4; // UI scale 0–4 = Bands 1–5

export interface Criterion {
  id: string;          // e.g. "1.1"
  title: string;
  question: string;
  leading: string;     // "Leading looks like" guidance panel
  levels: [string, string, string, string, string];
}

export interface Domain {
  id: number;
  key: string;
  name: string;
  description: string;
  criteria: Criterion[];
}

export const framework: Domain[] = [
  {
    id: 1, key: "governance", name: "Governance & accountability",
    description: "Who is answerable for AI outcomes, and the evidence trail that makes that accountability defensible.",
    criteria: [
      { id: "1.1", title: "Board mandate", question: "Is AI oversight an explicit, minuted board or committee responsibility?",
        leading: "Oversight is externally assured and benchmarked; improvement is continuous and minuted.",
        levels: [
          "No board ownership; AI decisions sit with individuals or IT.",
          "AI reaches the board only reactively — an incident or client question.",
          "Named board or committee responsibility, recorded in terms of reference.",
          "Regular metric-backed board reporting against thresholds, acted on and minuted.",
          "Oversight externally assured and benchmarked against peers and standards."] },
      { id: "1.2", title: "Roles and decision rights", question: "Is there a named accountable owner for AI decisions, with clear escalation?",
        leading: "Accountability is unambiguous at every level, tested in practice, and independently reviewed.",
        levels: [
          "Nobody owns AI decisions; adoption is ungoverned.",
          "Informal ownership by whoever introduced the tool.",
          "Documented RACI for AI decisions with named owner and escalation route.",
          "Ownership operates in practice; escalations logged and reviewed.",
          "Decision rights independently reviewed and refined on evidence."] },
      { id: "1.3", title: "Policy architecture", question: "Are approved AI use, acceptable-use and escalation policies in place and current?",
        leading: "Policies are current, understood, measured for adherence, and improved on evidence.",
        levels: [
          "No AI policies exist.",
          "Draft or borrowed policies, unapproved or unread.",
          "Board-approved policy set covering use, escalation and exceptions; owner named.",
          "Adherence monitored; policies refreshed on regulatory or operational change.",
          "Policy effectiveness independently assessed; a model others copy."] },
      { id: "1.4", title: "AI inventory and register", question: "Is there a complete, maintained register of AI in use — including procured and embedded systems?",
        leading: "The register is assured, always current, and a due-diligence asset in deals.",
        levels: [
          "Nobody can list the AI in use.",
          "Partial, stale list held informally.",
          "Complete register with purpose, owner, data and risk tier per system.",
          "Register currency tracked; changes trigger review.",
          "Register independently assured; reused commercially in due diligence."] },
      { id: "1.5", title: "Third-party and procurement governance", question: "Is due diligence performed on AI vendors and models before and during use?",
        leading: "Contractual obligations with audit rights; vendor performance tracked through life.",
        levels: [
          "Tools adopted on marketing claims alone.",
          "Occasional questions asked; answers unexamined.",
          "Documented pre-adoption due diligence covering security, fairness and documentation.",
          "Vendors reassessed on change; findings tracked to closure.",
          "Contractual obligations with audit rights; exit plans for critical dependencies."] },
      { id: "1.6", title: "Regulatory horizon scanning", question: "Is there a process to track UK and EU regulatory change and act on it?",
        leading: "Changes are anticipated before they land; clients and the board are briefed ahead of time.",
        levels: [
          "Regulatory change discovered when it bites.",
          "Individuals follow the news; nothing systematic.",
          "Defined scanning process with named owner, cadence and a change log.",
          "Changes trigger impact assessment and documented action within set timescales.",
          "Anticipates change pre-enactment; briefs stakeholders before deadlines land."] },
      { id: "1.7", title: "Independent assurance", question: "Is the AI governance system independently reviewed or audited?",
        leading: "Regular independent assurance whose findings demonstrably change practice.",
        levels: [
          "No independent eyes on AI governance.",
          "Internal self-review only.",
          "Periodic independent review scoped and scheduled; findings recorded.",
          "Findings tracked to closure; assurance scope risk-driven.",
          "Continuous assurance cycle; results shared with stakeholders."] },
      { id: "1.8", title: "Documentation and records", question: "Is there a defensible evidence trail behind AI decisions?",
        leading: "Records withstand regulator-grade scrutiny without preparation.",
        levels: [
          "Nothing written down.",
          "Scattered records of some decisions.",
          "Defined record-keeping standard; decisions, approvals and reviews filed per system.",
          "Record currency and completeness monitored.",
          "Evidence trail withstands external scrutiny unprepared; s172 considerations minuted throughout."] },
    ],
  },
  {
    id: 2, key: "risk", name: "Risk management",
    description: "Identifying, assessing, treating and monitoring AI risk within a defined appetite, proportionate to your role as deployer or provider.",
    criteria: [
      { id: "2.1", title: "Risk identification and classification", question: "Are AI systems classified by risk tier, including procured tools?",
        leading: "Classification is independently reviewed and regulatory changes are pre-assessed before they land.",
        levels: [
          "No view of which AI carries what risk.",
          "Obvious high-risk uses informally recognised; no method.",
          "Documented classification aligned to AI Act tiers, covering embedded and procured AI.",
          "Classification refreshed on change and reported via telemetry.",
          "Independently reviewed; horizon changes pre-assessed."] },
      { id: "2.2", title: "Risk appetite", question: "Has the board defined what AI risk it will and won't accept?",
        leading: "Appetite is benchmarked externally and revisited on a set cadence with evidence.",
        levels: [
          "No stated appetite; case-by-case decisions.",
          "Implicit red lines, nothing written.",
          "Board-approved appetite statement with tolerances per use category.",
          "Appetite operationalised as telemetry thresholds; breaches escalate.",
          "Benchmarked against peers and standards; revisited on cadence."] },
      { id: "2.3", title: "Impact assessments", question: "Are data-protection and fundamental-rights impacts assessed before deployment?",
        leading: "Assessments are assured or published, and reused as evidence in bids and due diligence.",
        levels: [
          "No impact assessment before deployment.",
          "Sporadic DPIAs where privacy risk is obvious.",
          "DPIA screening on every deployment; FRIA process ready where in scope.",
          "Assessments updated on change; findings tracked to closure, board-visible.",
          "Independently assured; templates reused in bids and diligence."] },
      { id: "2.4", title: "Deployer operational controls", question: "Is AI used per provider instructions, with input-data checks, monitoring and log retention?",
        leading: "Controls are audited and lessons feed back into procurement and vendor management.",
        levels: [
          "Tools used however staff see fit.",
          "Some usage rules in some teams; no input-data control.",
          "Documented use per instructions; input data checked; logs retained six months minimum.",
          "Controls monitored via telemetry; deviations corrected.",
          "Controls audited; lessons feed vendors and procurement."] },
      { id: "2.5", title: "Risk treatment", question: "Are identified risks actively mitigated, transferred, or accepted with sign-off?",
        leading: "Treatment strategies are independently reviewed; near-misses drive pre-emptive change.",
        levels: [
          "Risks noticed are lived with.",
          "Ad hoc fixes after problems occur.",
          "Every identified risk carries a treatment decision with named sign-off and dates.",
          "Treatment effectiveness measured; residual risk reported against appetite.",
          "Independently reviewed; near-misses drive pre-emptive change."] },
      { id: "2.6", title: "Incident readiness and suspension", question: "Can you detect, suspend, and report a misbehaving system?",
        leading: "Response is integrated with cyber IR, tested end-to-end, and reviews change practice.",
        levels: [
          "No ability to detect or stop a misbehaving system.",
          "Informal 'turn it off' knowledge held by one or two people.",
          "Documented suspension procedure with provider notification; reporting windows understood.",
          "Detection monitored; suspension rehearsed; incidents board-visible.",
          "Integrated with cyber IR and tested end-to-end; reviews change practice."] },
      { id: "2.7", title: "Ongoing monitoring", question: "Is risk reassessed through the lifecycle, not just at adoption?",
        leading: "Monitoring outputs are benchmarked, assured, and feed horizon scanning.",
        levels: [
          "Risk considered only at purchase, if at all.",
          "Occasional re-checks after problems.",
          "Scheduled lifecycle reviews with defined out-of-cycle triggers.",
          "Continuous telemetry monitoring against thresholds; reviews minuted.",
          "Benchmarked and assured; feeds horizon scanning."] },
      { id: "2.8", title: "Proportionality and documentation", question: "Is the risk approach scaled to your size and context, and evidenced?",
        leading: "Documentation withstands external audit and wins bids as a trust asset.",
        levels: [
          "Nothing written down.",
          "Scattered records; effort mismatched to risk.",
          "Proportionate documentation using simplified formats where the regime allows; a file per system.",
          "Documentation currency tracked; gaps surfaced.",
          "Withstands audit; reused commercially as a trust asset."] },
    ],
  },
  {
    id: 3, key: "ethics", name: "Ethics & fairness",
    description: "Preventing discriminatory or harmful outcomes — and being able to prove it. Deployer liability makes this yours, not your vendor's.",
    criteria: [
      { id: "3.1", title: "Discrimination risk awareness", question: "Are protected characteristics mapped against your AI uses?",
        leading: "Mapping is independently reviewed and shapes design before deployment, not after.",
        levels: [
          "No awareness that AI can discriminate.",
          "Awareness in HR only.",
          "Documented mapping of AI uses to protected characteristics; owner named.",
          "Mapping refreshed on change; exposure reported to board.",
          "Independently reviewed; informs design up front."] },
      { id: "3.2", title: "Bias in data", question: "Is data screened for historical bias, including proxy variables, before it drives decisions?",
        leading: "Screening methodology is assured; bias-detection processing is used deliberately and lawfully.",
        levels: [
          "Data used as found.",
          "Known-bad fields removed ad hoc.",
          "Documented screening step including proxies before any decision use.",
          "Screening results logged and monitored over time.",
          "Methodology assured; lawful bias-detection carve-out used deliberately."] },
      { id: "3.3", title: "Bias testing", question: "Are outcomes tested for disparate impact across groups?",
        leading: "Testing is independently audited and methods are published to buyers as a trust asset.",
        levels: [
          "No outcome testing; complaints are the only detector.",
          "One-off checks without thresholds or records.",
          "Defined disparate-impact testing at deployment; thresholds set; results recorded.",
          "Recurring, telemetry-tracked; breaches escalate.",
          "Independently audited; methods published to buyers."] },
      { id: "3.4", title: "Special-category data controls", question: "Are restrictions on sensitive-data automated decisions enforced?",
        leading: "Controls are assured, exceptions carry justification, and the board reviews the register.",
        levels: [
          "Sensitive data flows into automated decisions unchecked.",
          "Informal avoidance without rules.",
          "Documented rule: no solely-automated significant decisions on sensitive data absent explicit consent or legal authorisation.",
          "Controls technically enforced and monitored.",
          "Assured; exceptions register reviewed by board."] },
      { id: "3.5", title: "Meaningful human review", question: "Do reviewers have competence, authority, and access to the system's reasoning?",
        leading: "Review effectiveness is independently tested and feeds training and redesign.",
        levels: [
          "Rubber-stamping; reviewers approve what the system says.",
          "Review exists but reviewers cannot access reasoning.",
          "Reviewers documented as competent, authorised to override, with reasoning access.",
          "Override rates and review quality monitored.",
          "Effectiveness independently tested; feeds redesign."] },
      { id: "3.6", title: "Ethical review", question: "Is there a gate where ethical concerns can stop a deployment?",
        leading: "External ethics input; learnings shared and demonstrably change decisions.",
        levels: [
          "No ethical gate exists.",
          "Concerns raised informally with no route to a decision.",
          "Defined review step with power to require changes or refuse deployment.",
          "Reviews minuted, tracked, board-visible.",
          "External input or assurance; learnings published internally."] },
      { id: "3.7", title: "Vendor fairness assurance", question: "Are supplier fairness claims verified rather than accepted?",
        leading: "Contractual fairness obligations with audit rights; vendor performance tracked.",
        levels: [
          "Vendor claims taken on trust.",
          "Fairness asked about; answers unexamined.",
          "Procurement requires documented fairness evidence before adoption.",
          "Evidence periodically re-verified.",
          "Contractual obligations with audit rights; performance tracked."] },
      { id: "3.8", title: "Remediation and redress", question: "When unfairness is found, is it fixed and are affected people made whole?",
        leading: "Redress is independently assessed and a publicly stated commitment honoured in practice.",
        levels: [
          "No route to fix unfair outcomes.",
          "Fixes made quietly; affected individuals not told.",
          "Documented process: correct the system, review affected decisions, remediate individuals.",
          "Timeliness measured; recurrence tracked.",
          "Independently assessed; public commitment honoured."] },
    ],
  },
  {
    id: 4, key: "transparency", name: "Transparency & explainability",
    description: "Making AI use, logic and limits visible — to the people affected, the regulator, and the board.",
    criteria: [
      { id: "4.1", title: "AI-interaction disclosure", question: "Do people know when they are interacting with a machine?",
        leading: "Disclosure is user-tested and exceeds the legal floor across every channel.",
        levels: [
          "Chatbots pose as humans by silence.",
          "Disclosure only where someone thought of it.",
          "Documented disclosure standard for all interactive AI; wording approved.",
          "Coverage monitored across channels.",
          "User-tested; exceeds the legal floor."] },
      { id: "4.2", title: "Synthetic-content marking", question: "Is generated content machine-readably marked and labelled where required?",
        leading: "Marking aligns to the Transparency Code of Practice with detection capability maintained.",
        levels: [
          "No marking of generated content.",
          "Visible labels only; no machine-readable layer.",
          "Layered marking (metadata plus watermarking) for in-scope systems; legacy deadline planned.",
          "Robustness tested; compliance tracked.",
          "Code-of-practice aligned; detection maintained."] },
      { id: "4.3", title: "Decision-specific explanation", question: "Can you explain this decision to this person, beyond boilerplate?",
        leading: "Explanation types are systematised and tested with the people they are written for.",
        levels: [
          "'The computer said no.'",
          "Generic privacy-notice language only.",
          "Capability to state main factors and logic per significant decision, in plain language.",
          "Explanation quality sampled and measured.",
          "Systematised explanation types, user-tested."] },
      { id: "4.4", title: "Contestability", question: "Can people make representations, obtain human intervention, and contest decisions?",
        leading: "Routes are independently assessed and learnings feed system improvement.",
        levels: [
          "No route to challenge automated outcomes.",
          "Complaints channel exists, disconnected from the decision system.",
          "All four safeguards operational: inform, representations, intervention, contest.",
          "Volumes, outcomes and turnaround measured.",
          "Independently assessed; learnings drive improvement."] },
      { id: "4.5", title: "Explainability by design", question: "Is explainability a procurement and build requirement, not an afterthought?",
        leading: "Contractual explainability obligations; transparency records kept beyond mandate.",
        levels: [
          "Black boxes bought blind.",
          "Explainability a nice-to-have in selection.",
          "Procurement requires documentation sufficient to meet explanation duties before adoption.",
          "Vendor documentation currency tracked.",
          "Contractual obligations; records kept beyond mandate."] },
      { id: "4.6", title: "Internal transparency", question: "Does the organisation itself know what its AI does?",
        leading: "The register is assured and functions as a due-diligence asset.",
        levels: [
          "Nobody can describe what the AI does.",
          "Partial understanding held by individuals.",
          "Complete register with purpose, logic summary, data and owner per system.",
          "Register currency tracked via telemetry.",
          "Assured; a due-diligence asset."] },
      { id: "4.7", title: "Notification of automated decisions", question: "Are people told when significant automated decisions affect them?",
        leading: "Proactive plain-language notification that measurably builds trust.",
        levels: [
          "People affected unknowingly.",
          "Notification buried in terms and conditions.",
          "Documented practice of informing individuals subject to significant automated decisions.",
          "Notification coverage measured.",
          "Proactive and plain-language; trust measured."] },
      { id: "4.8", title: "External reporting honesty", question: "Do public claims about your AI match technical reality?",
        leading: "External AI reporting is independently assured — the antidote to AI-washing exposure.",
        levels: [
          "Marketing writes cheques the technology cannot cash.",
          "Claims published unreviewed.",
          "Public AI claims verified against reality before publication; sign-off named.",
          "Claims audited periodically; corrections issued.",
          "Independently assured."] },
    ],
  },
  {
    id: 5, key: "data", name: "Data governance & privacy",
    description: "Lawful, well-governed data across the AI lifecycle — where UK law now has its sharpest teeth.",
    criteria: [
      { id: "5.1", title: "Automated-decision scoping", question: "Do you know which decisions are significant and solely automated?",
        leading: "Scoping is tested against final guidance and future regulations are pre-tracked.",
        levels: [
          "No concept of automated-decision scope.",
          "Obvious cases spotted informally.",
          "Documented scoping: significance test plus meaningful-involvement test, applied to all systems.",
          "Scoping refreshed on change; register-linked.",
          "Tested against guidance as it finalises; regulations pre-tracked."] },
      { id: "5.2", title: "Safeguards implementation", question: "Are the four statutory safeguards genuinely operational?",
        leading: "Safeguards are independently assessed as effective and shape product design.",
        levels: [
          "No safeguards exist.",
          "Safeguards on paper with no mechanism.",
          "All four rights operational with processes, wording and owners.",
          "Usage and turnaround measured via telemetry.",
          "Independently assessed; drive design."] },
      { id: "5.3", title: "Lawful basis", question: "Is there a valid basis for training, inputs and outputs?",
        leading: "Basis analysis is assured and withstands regulator scrutiny.",
        levels: [
          "Basis never considered for AI processing.",
          "Blanket legitimate-interests claim, untested.",
          "Documented basis per purpose with balancing tests; excluded bases never used for automated decisions.",
          "Bases reviewed on change of purpose; drift caught.",
          "Assured; withstands scrutiny."] },
      { id: "5.4", title: "DPIA discipline", question: "Are DPIAs triggered, done well, and acted on?",
        leading: "DPIAs are assured and reused as bid and due-diligence evidence.",
        levels: [
          "No impact assessments.",
          "DPIAs as retrospective paperwork.",
          "Screening on all AI; full DPIA for automated decisions and profiling; mitigations closed.",
          "Currency and action-closure tracked.",
          "Assured; reused as evidence."] },
      { id: "5.5", title: "Special-category handling", question: "Are prohibitions and narrow exceptions for sensitive data correctly applied?",
        leading: "Independently assured with a zero-surprise posture.",
        levels: [
          "Sensitive data in automated decisions unchecked.",
          "Informal avoidance.",
          "Documented compliance: default prohibition, narrow exceptions, technical enforcement where possible.",
          "Monitored; exceptions logged with justification.",
          "Independently assured; zero surprises."] },
      { id: "5.6", title: "Data quality and minimisation", question: "Is AI fed relevant, representative, minimal data?",
        leading: "The quality regime is assured and feeds fairness testing.",
        levels: [
          "Everything in; quality unknown.",
          "Cleansing only where errors bite commercially.",
          "Documented relevance, representativeness and minimisation standards for controlled data.",
          "Quality metrics tracked; degradation alerts.",
          "Assured; feeds fairness testing."] },
      { id: "5.7", title: "Rights readiness", question: "Can access, erasure and objection requests be honoured where AI is involved?",
        leading: "Rights readiness is assured and a stated trust commitment.",
        levels: [
          "Rights requests break where AI is involved.",
          "Manual heroics per request.",
          "Documented processes covering AI contexts within statutory timescales.",
          "Turnaround and completeness measured.",
          "Assured; a stated commitment."] },
      { id: "5.8", title: "Records and accountability", question: "Does the data trail evidence all of the above?",
        leading: "Files withstand assessment-notice-grade scrutiny without scramble.",
        levels: [
          "No records kept.",
          "Scattered records.",
          "A defensible accountability file per system: scoping, basis, DPIA, safeguards, decisions.",
          "File currency tracked via telemetry.",
          "Withstands regulator-grade scrutiny unprepared."] },
    ],
  },
  {
    id: 6, key: "security", name: "Security & resilience",
    description: "Protecting AI from attack and ensuring it fails safely — containment as a designed, rehearsed capability.",
    criteria: [
      { id: "6.1", title: "AI threat awareness", question: "Are AI-specific attacks understood and mapped for your systems?",
        leading: "Systems are red-teamed and findings drive design.",
        levels: [
          "AI treated as ordinary software.",
          "Generic cyber awareness only.",
          "Documented AI threat model: poisoning, adversarial inputs, injection, theft, leakage.",
          "Refreshed against live intelligence; monitored.",
          "Red-teamed; findings drive design."] },
      { id: "6.2", title: "Secure development and procurement", question: "Is AI built and bought to secure-by-design standards?",
        leading: "Independently assessed with contractual security obligations and audit rights.",
        levels: [
          "No security bar for AI.",
          "Vendor questionnaires with unread answers.",
          "Documented standards aligned to national secure-AI guidance for build and procurement.",
          "Compliance verified, not assumed.",
          "Independently assessed; contractual obligations."] },
      { id: "6.3", title: "Access and change control", question: "Who can touch models, prompts and data pipelines — and is it logged?",
        leading: "Privileged AI access is treated and assured as crown-jewel access.",
        levels: [
          "Anyone can change anything.",
          "Basic access control without AI-specific scope.",
          "Defined control over models, prompts, training data and pipelines; changes attributable.",
          "Anomalies monitored; reviews scheduled.",
          "Assured; crown-jewel treatment."] },
      { id: "6.4", title: "Containment and kill-switch", question: "Can any AI system be stopped quickly by people with authority to do it?",
        leading: "Containment is tested under realistic conditions; agentic systems get explicit containment design before deployment.",
        levels: [
          "No off switch; nobody knows how to stop it.",
          "One person could, informally.",
          "Documented procedure: triggers, authorised roles, dual authorisation, rollback, business fallback.",
          "Rehearsed; time-to-contain measured.",
          "Tested end-to-end; agentic containment designed pre-deployment."] },
      { id: "6.5", title: "Incident response integration", question: "Does AI failure route into rehearsed incident response?",
        leading: "Fully integrated and exercised, with a closed post-incident learning loop.",
        levels: [
          "AI incidents invisible to incident response.",
          "Response would improvise.",
          "AI failure modes in the IR plan; reporting duties mapped with windows understood.",
          "Scenarios exercised; detection-to-response measured.",
          "Integrated and tested; learning loop closes."] },
      { id: "6.6", title: "Resilience and recovery", question: "Can the business operate when the AI cannot?",
        leading: "Resilience is assured and concentration risk actively managed.",
        levels: [
          "AI down means business down, unplanned.",
          "Workarounds exist in people's heads.",
          "Documented continuity per material dependency: fallback, degraded mode, recovery.",
          "Fallbacks tested; recovery objectives measured.",
          "Assured; concentration risk managed."] },
      { id: "6.7", title: "Supply-chain security", question: "Are model, API and vendor dependencies security-assessed?",
        leading: "Supply-chain assurance is contractual, with exit plans for critical dependencies.",
        levels: [
          "Dependencies unknown.",
          "Known but unassessed.",
          "Documented assessment before adoption; dependency map maintained.",
          "Reassessed on change; vendor incidents tracked.",
          "Contractual assurance; exit plans exist."] },
      { id: "6.8", title: "Board-level security assurance", question: "Can the board honestly make its material-controls declaration for AI?",
        leading: "The declaration is independently assured and defensible under regulator-grade challenge.",
        levels: [
          "Board unaware AI is in declaration scope.",
          "Aware, but without evidence.",
          "AI formally within the material-controls framework; declaration evidence assembled.",
          "Effectiveness telemetry-fed; declaration rests on data.",
          "Independently assured; defensible under challenge."] },
    ],
  },
  {
    id: 7, key: "workforce", name: "Workforce & human oversight",
    description: "Augmentation-first adoption, capable oversight, and honest treatment of the people AI affects.",
    criteria: [
      { id: "7.1", title: "AI literacy", question: "Can staff and contractors use AI competently — and can you evidence it?",
        leading: "Effectiveness is measured, not just attendance; literacy shapes hiring and development.",
        levels: [
          "No training; tools in use anyway.",
          "Ad hoc sessions without records.",
          "Documented programme proportionate to roles, covering staff and contractors; records kept.",
          "Coverage and currency tracked; refreshed as tools change.",
          "Effectiveness measured; a hiring and development criterion."] },
      { id: "7.2", title: "Oversight capability", question: "Are human overseers trained, resourced and empowered — not just present?",
        leading: "Capability is independently assessed and oversight roles carry career weight.",
        levels: [
          "Oversight is nominal.",
          "Overseers assigned without training or time.",
          "Overseers documented as competent, trained, authorised and supported.",
          "Quality measured via override rates and sampled reviews.",
          "Independently assessed; roles carry weight."] },
      { id: "7.3", title: "Oversight by design", question: "Are systems configured so humans can intervene effectively?",
        leading: "Oversight design is user-tested and feeds procurement standards.",
        levels: [
          "Systems present faits accomplis.",
          "Intervention technically possible, practically ignored.",
          "Deployment standard requires intervention points, reasoning visibility and time to act.",
          "Intervention usage monitored; zero-intervention systems investigated.",
          "User-tested; feeds procurement."] },
      { id: "7.4", title: "Workforce impact assessment", question: "Is job-change impact assessed and minuted before adoption?",
        leading: "Methodology is assured and informs strategy, not just compliance.",
        levels: [
          "Adopt first, discover impact later.",
          "Impact discussed, nothing recorded.",
          "Documented assessment before adoption; stakeholder consideration minuted.",
          "Predicted versus actual impact tracked.",
          "Assured; informs strategy."] },
      { id: "7.5", title: "Worker information and consultation", question: "Are workers and representatives informed before workplace AI goes live?",
        leading: "Co-designed with the workforce, with measurably higher trust for it.",
        levels: [
          "Workers find out when it arrives.",
          "Announcement, not consultation.",
          "Documented practice of informing workers and representatives before service.",
          "Feedback tracked and demonstrably considered.",
          "Co-design; trust measurably higher."] },
      { id: "7.6", title: "Augmentation-first strategy", question: "Is the default job redesign over elimination, measured accordingly?",
        leading: "An externally credible track record that attracts talent.",
        levels: [
          "AI framed internally as headcount reduction.",
          "Mixed messages without metrics.",
          "Stated augmentation-first policy; metrics shifted to throughput and quality.",
          "Augmentation outcomes measured and reported.",
          "Externally credible; a talent asset."] },
      { id: "7.7", title: "Acceptable use and shadow AI", question: "Do people know what they may use, and is unsanctioned use surfaced?",
        leading: "The sanctioned catalogue is good enough that shadow use approaches zero.",
        levels: [
          "Shadow AI everywhere, invisibly.",
          "Policy exists, unread.",
          "Clear acceptable-use policy with a sanctioned request route; shadow use surfaced safely.",
          "Detection tracked; policy iterated on findings.",
          "Catalogue so good shadow use approaches zero."] },
      { id: "7.8", title: "Skill sustainability", question: "Does AI use build capability rather than hollow it out?",
        leading: "A capability strategy under which the organisation gets more capable as AI use deepens.",
        levels: [
          "Deskilling unnoticed.",
          "Anecdotal concern without response.",
          "Retained-capability decisions documented: what stays human, and how it stays sharp.",
          "Capability retention monitored; wellbeing surveyed.",
          "Assured; capability grows with AI use."] },
    ],
  },
  {
    id: 8, key: "esg", name: "ESG & sustainability",
    description: "The environmental accountability of AI itself, plus the sustainability readiness that wins contracts.",
    criteria: [
      { id: "8.1", title: "Value-chain position", question: "Do you know which customers' reporting duties reach you, and what they may ask?",
        leading: "Requests are anticipated before they arrive; you are positioned as the easy supplier.",
        levels: [
          "Requests arrive as surprises.",
          "Big customers known; obligations unknown.",
          "Documented map of client reporting duties and legitimate data requests.",
          "Map refreshed as clients and thresholds change.",
          "Anticipates requests; the easy supplier."] },
      { id: "8.2", title: "Basic sustainability data", question: "Can you produce the Basic Module data set on request?",
        leading: "The basic report is published proactively as a standing sales asset.",
        levels: [
          "No sustainability data.",
          "Fragments — energy bills somewhere.",
          "Basic data assembled and refreshable: energy, emissions, waste, workforce, safety, pay, conduct.",
          "Collection systematised; refresh cadence tracked.",
          "Published proactively; a sales asset."] },
      { id: "8.3", title: "Comprehensive readiness", question: "Can you meet comprehensive-module requests where finance or major clients require it?",
        leading: "Assured comprehensive data that opens finance and enterprise doors on its own.",
        levels: [
          "Comprehensive requests unanswerable.",
          "Answered by heroics per request.",
          "Capability where warranted: strategy, value-chain emissions, targets, climate risks, human rights.",
          "Maintained continuously, not rebuilt per request.",
          "Assured; opens doors on its own."] },
      { id: "8.4", title: "The protected-undertaking line", question: "Do you know what you may lawfully refuse — and do you?",
        leading: "The line is held confidently, cited by basis, and the burden measurably contained.",
        levels: [
          "Every request answered, however excessive.",
          "Grumbling compliance.",
          "Documented refusal position: beyond-scope requests declined with legal basis stated.",
          "Requests and refusals logged; patterns tracked.",
          "Held confidently; burden contained."] },
      { id: "8.5", title: "AI environmental footprint", question: "Is the energy and resource cost of your AI use known and managed?",
        leading: "Footprint disclosed; efficiency a stated selection criterion — a credible Twin Transition story.",
        levels: [
          "AI footprint never considered.",
          "Vague awareness compute costs something.",
          "Documented estimate of material AI energy use, from disclosures or compute proxies.",
          "Tracked over time; efficiency weighs in vendor choices.",
          "Disclosed; efficiency a selection criterion."] },
      { id: "8.6", title: "Sustainability data quality", question: "Is ESG data collected once, well, and reusably?",
        leading: "An assured single dataset with near-zero marginal cost per new request.",
        levels: [
          "Data reinvented per request.",
          "Spreadsheet archaeology.",
          "Single dataset with owners and refresh cycles, mapped to standard disclosures.",
          "Quality and currency tracked via telemetry.",
          "Assured; near-zero marginal cost."] },
      { id: "8.7", title: "Sustainability governance", question: "Is someone senior accountable, with board visibility?",
        leading: "Integrated into strategy and remuneration; externally credible.",
        levels: [
          "Nobody owns sustainability.",
          "Owned by whoever was asked last.",
          "Named senior accountability with defined board reporting.",
          "Board reviews performance on cadence with metrics.",
          "Integrated into strategy and pay."] },
      { id: "8.8", title: "Commercial leverage", question: "Is ESG readiness converted into won contracts and better finance terms?",
        leading: "A demonstrable revenue and capital-access advantage — the case study others cite.",
        levels: [
          "ESG treated as pure cost.",
          "Used reactively when a bid demands it.",
          "Readiness deployed deliberately: bid libraries, client summaries, finance conversations.",
          "Win-loss and finance-term impact tracked.",
          "Demonstrable advantage; the cited case study."] },
    ],
  },
];

// ——— Scoring (equal-weighted v1) ———

export type Answers = Record<string, Level>; // criterion id → 0–4

export function domainScore(d: Domain, a: Answers): number | null {
  const done = d.criteria.filter(c => a[c.id] !== undefined);
  if (done.length === 0) return null;
  const sum = done.reduce((s, c) => s + a[c.id], 0);
  return Math.round((sum / (done.length * 4)) * 100);
}

export function overallScore(a: Answers): number | null {
  const scores = framework.map(d => domainScore(d, a)).filter((s): s is number => s !== null);
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
}

export function band(score: number): string {
  if (score < 20) return BAND_LABELS[0];
  if (score < 40) return BAND_LABELS[1];
  if (score < 60) return BAND_LABELS[2];
  if (score < 80) return BAND_LABELS[3];
  return BAND_LABELS[4];
}

export function progress(a: Answers): { answered: number; total: number } {
  return { answered: Object.keys(a).length, total: 64 };
}

export function domainProgress(d: Domain, a: Answers): { answered: number; total: number } {
  return { answered: d.criteria.filter(c => a[c.id] !== undefined).length, total: 8 };
}
