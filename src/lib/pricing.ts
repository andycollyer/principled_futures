// src/lib/pricing.ts
// The three billing tiers. Copy is verbatim from the handoff and is the
// source of truth — do not paraphrase. Stripe price ids are wired in the
// Supabase/backend phase; the current static release cannot create live
// checkout sessions (no server), so paid CTAs route to the contact flow.

export interface Tier {
  id: string;
  name: string;
  price: number | null;
  period: "month" | null;
  blurb: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export const TIERS: Tier[] = [
  {
    id: "diagnostic",
    name: "Diagnostic",
    price: 0,
    period: null,
    blurb: "See where you stand.",
    features: [
      "The full 8×8 assessment (64 criteria)",
      "Overall score and maturity band",
      "Your top three gaps, summarised",
      "Basic research library access",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    id: "governance",
    name: "Governance",
    price: 480,
    period: "month",
    blurb: "Continuous oversight, board-ready.",
    features: [
      "Full 64-criterion breakdown",
      "Board-ready Advisory Report (PDF)",
      "Telemetry dashboard — all 11 measures, with owner assignment",
      "The complete research library, framework and templates",
      "Quarterly reassessment",
      "Regulatory horizon alerts",
    ],
    cta: "Choose Governance",
    highlighted: true,
  },
  {
    id: "governance-plus",
    name: "Governance+",
    price: 1250,
    period: "month",
    blurb: "Fractional governance leadership, productised.",
    features: [
      "Everything in Governance",
      "Quarterly expert review call (board-prep format)",
      "Sector regulatory-impact briefs",
      "Peer benchmark positioning",
      "Multi-entity support",
      "Annual declaration evidence pack (Provision 29)",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];
