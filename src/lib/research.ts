// src/lib/research.ts
// The research library catalogue. To add a paper: drop the PDF into
// assets/research/, run `npm run upload:papers`, and add one entry here.
// The PDFs are NOT public — they live in a private Storage bucket and are
// issued, watermarked, by the issue-paper function. Categories in the filter
// bar are derived from this list automatically.

export interface Paper {
  file: string;   // object name in the private "research" bucket
  cat: string;
  title: string;
  desc: string;
  read: string;   // e.g. "14 min"
  tone: "brand" | "neutral" | "success" | "warning" | "danger" | "info";
}

export const FEATURED = {
  file: "global-frameworks.pdf",
  cat: "Governance",
  title: "Principled Futures: Global Frameworks for Board-Level AI Governance",
  desc: "The flagship reference — mapping OECD, the EU AI Act, UNESCO and Gartner into a single board-ready governance framework. The intellectual foundation of the 8×8 assessment and the telemetry dashboard.",
  read: "24 min",
  pages: "38 pages",
};

export const PAPERS: Paper[] = [
  { file: "ai-esg-nexus.pdf", cat: "ESG", title: "The AI–ESG Nexus: Principles for Ethical Governance", desc: "The manifesto and five commitments — Human-Centricity, Environmental Accountability, Radical Transparency, Collective Literacy, the 10% Pledge.", read: "14 min", tone: "brand" },
  { file: "agentic-board.pdf", cat: "Governance", title: "The Agentic Board: Governance in the Era of Autonomous Systems", desc: "Governing at the orchestration level as AI moves from generative to agentic — and what that demands of directors.", read: "18 min", tone: "neutral" },
  { file: "architecting-trust.pdf", cat: "Governance", title: "Architecting Trust Through AI Governance", desc: "Caremark fiduciary duties applied to AI oversight: pleading ignorance is not a defensible legal strategy.", read: "12 min", tone: "neutral" },
  { file: "architectures-of-fairness.pdf", cat: "Ethics & Fairness", title: "Architectures of Fairness: Systematic AI Governance & Bias Mitigation", desc: "Disparate-impact testing, the 0.8–1.25 parity band, model cards and independent audit.", read: "16 min", tone: "warning" },
  { file: "boardroom-gap.pdf", cat: "Boardroom", title: "Bridging the AI Boardroom Gap for Small Organizations", desc: "The lone-expert vulnerability and the case for fractional, outsourced oversight in the mid-market.", read: "11 min", tone: "info" },
  { file: "strategic-telemetry.pdf", cat: "Telemetry", title: "Strategic AI Telemetry: The Board's Real-Time Oversight Hub", desc: "From point-in-time audits to continuous telemetry — the architecture of live board oversight.", read: "15 min", tone: "success" },
  { file: "boardroom-compass.pdf", cat: "Telemetry", title: "The Boardroom Compass: Real-Time Metrics for AI Governance", desc: "The metric set that turns periodic review into evidence-based, continuous oversight.", read: "13 min", tone: "success" },
  { file: "telemetry-table.pdf", cat: "Telemetry", title: "Telemetry Dashboard — Metric Reference Table", desc: "The full reference table mapping each metric to its threshold, owner and cadence.", read: "6 min", tone: "success" },
  { file: "kill-switch-protocols.pdf", cat: "Security", title: "Autonomous Agent Kill-Switch Protocols", desc: "Dual-authorisation containment, explicit triggers, rollback and incident-response integration.", read: "14 min", tone: "danger" },
  { file: "augmentation-first.pdf", cat: "Workforce", title: "The Augmentation-First Workforce Strategy", desc: "Job redesign over elimination; metrics that shift from headcount cuts to system throughput.", read: "12 min", tone: "info" },
];

/** Filter-bar categories: the design's canonical order, plus any new
 *  categories found in the catalogue appended automatically. */
const BASE_ORDER = ["Governance", "Telemetry", "Ethics & Fairness", "Security", "Workforce", "ESG", "Boardroom"];
const inUse = new Set(PAPERS.map((p) => p.cat));
export const CATEGORIES: string[] = [
  "All",
  ...BASE_ORDER.filter((c) => inUse.has(c)),
  ...Array.from(inUse).filter((c) => !BASE_ORDER.includes(c)),
];
