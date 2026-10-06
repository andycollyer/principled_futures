/* Plain-English guidance shown beside scores. This is reading help for the
   overview, not assessment copy: the questions and level wording stay in
   framework.ts. Wording drafted 6 Oct 2026, for Andy's sign-off. */

import { BAND_LABELS, type Answers, type Criterion, type Domain, type Level } from "@/lib/framework";

/** What a band means, in one sentence. Used for the overall score and for each domain. */
export const BAND_MEANING: Record<string, string> = {
  Initial: "Little is written down and nobody is clearly answerable. Decisions about AI are made case by case.",
  Developing: "Some controls exist, but they are reactive and depend on particular people remembering to apply them.",
  Defined: "Responsibilities and policies are written down. They are not yet tested or measured.",
  Managed: "Controls are measured, reported to the board against thresholds, and acted on.",
  Leading: "Governance is independently assured and improves on evidence.",
};

export interface NextStep {
  criterion: Criterion;
  current: Level;
  currentLabel: string;
  /** null when the criterion is already at the top level. */
  targetLabel: string | null;
  /** The framework's own description of the level to reach (or of holding the top level). */
  target: string;
}

/** The weakest answered criterion in a domain, and the framework's description of the next level up. */
export function nextStep(d: Domain, a: Answers): NextStep | null {
  const answered = d.criteria.filter((c) => a[c.id] !== undefined);
  if (!answered.length) return null;
  const criterion = answered.reduce((low, c) => (a[c.id] < a[low.id] ? c : low), answered[0]);
  const current = a[criterion.id];
  if (current >= 4) {
    return { criterion, current, currentLabel: BAND_LABELS[4], targetLabel: null, target: criterion.leading };
  }
  return { criterion, current, currentLabel: BAND_LABELS[current], targetLabel: BAND_LABELS[current + 1], target: criterion.levels[current + 1] };
}
