/* The eleven measures a board should be able to ask for, each tied to the
   domain it gives evidence for. Names, thresholds and rhythms only: no values.
   Nothing here is connected to a customer's systems yet, so the product shows
   what to track and who owns it, and never a figure it does not hold. */

export interface Measure {
  id: string;        // also the key owners are stored under (telemetry-owners.ts)
  domainId: number;  // framework domain 1–8
  name: string;
  threshold: string;
  rhythm: string;
}

export const MEASURES: Measure[] = [
  { id: "scaling-status", domainId: 1, name: "Scaling status", threshold: "More than 40% of AI projects scaled", rhythm: "Quarterly" },
  { id: "realised-roi", domainId: 1, name: "Realised return", threshold: "Above 1.0x of the business case", rhythm: "Quarterly" },
  { id: "model-drift", domainId: 2, name: "Model drift", threshold: "Under 2% deviation", rhythm: "Continuous" },
  { id: "hallucination-rate", domainId: 2, name: "Hallucination rate", threshold: "Under 1% of outputs", rhythm: "Weekly" },
  { id: "bias-impact", domainId: 3, name: "Bias and disparate impact", threshold: "Parity ratio between 0.8 and 1.25", rhythm: "Monthly" },
  { id: "explainability", domainId: 4, name: "Explainability", threshold: "100% of high-risk decisions explainable", rhythm: "Monthly" },
  { id: "regulatory-readiness", domainId: 5, name: "Regulatory readiness", threshold: "Records ready for audit", rhythm: "Monthly" },
  { id: "kill-switch", domainId: 6, name: "Kill-switch readiness", threshold: "Tested and working", rhythm: "Weekly" },
  { id: "shadow-ai", domainId: 7, name: "Unsanctioned AI in use", threshold: "None", rhythm: "Monthly" },
  { id: "speak-up", domainId: 7, name: "Speak-up concerns resolved", threshold: "100% escalated and closed", rhythm: "Monthly" },
  { id: "carbon-footprint", domainId: 8, name: "AI carbon footprint", threshold: "Within the organisation's cap", rhythm: "Quarterly" },
];
