/* The approved dependencies between criteria, and what follows from them:
   what a criterion holds back, what it depends on, and where to start. */

import { LINKS, type CriterionLink } from "@/lib/content-meta";
import { framework, BAND_LABELS, type Answers, type Criterion, type Domain } from "@/lib/framework";
import { profileFactor, type Profile } from "@/lib/profile";

export const CRITERIA: Record<string, { criterion: Criterion; domain: Domain }> = Object.fromEntries(
  framework.flatMap((d) => d.criteria.map((c) => [c.id, { criterion: c, domain: d }])),
);

/** Links out of a criterion: the criteria it holds back when it is weak. */
export const holdsBack = (id: string): CriterionLink[] => LINKS.filter((l) => l.from === id);
/** Links into a criterion: the criteria it depends on. */
export const dependsOn = (id: string): CriterionLink[] => LINKS.filter((l) => l.to === id);

export const levelLabel = (a: Answers, id: string): string | null => (a[id] === undefined ? null : BAND_LABELS[a[id]]);

export interface Priority {
  id: string; level: number;
  holds: number;      // criteria this one holds back
  exposed: number;    // of those, how many are answered at a higher level than this one can support
  factor: number;     // multiplier from the client profile (1 when nothing applies)
  weight: number;
}

/** How far a dependent criterion is answered above the criterion it rests on (0 when it is not). */
export const overreach = (a: Answers, from: string, to: string): number =>
  a[from] === undefined || a[to] === undefined ? 0 : Math.max(0, a[to] - a[from]);

/** Where to start. Each answer below the top level is weighted by the organisation's own responses:

      weight = levels short of the top × (1 + Σ over the criteria it holds back of (1 + overreach)) × profile factor

    so a weak answer counts for more when more depends on it, and more again when what depends on
    it has been answered at a higher level than the foundation supports. The profile factor (profile.ts)
    raises criteria that the organisation's own circumstances make more pressing, legal triggers most. Scores stay
    equal-weighted (framework 1.0.0); this ranks priorities only. */
export function priorities(a: Answers, n = 3, profile?: Profile | null): Priority[] {
  return Object.keys(CRITERIA)
    .filter((id) => a[id] !== undefined && a[id] < 4)
    .map((id) => {
      const out = holdsBack(id);
      const reach = out.map((l) => overreach(a, id, l.to));
      const factor = profileFactor(profile, id);
      return { id, level: a[id], holds: out.length, exposed: reach.filter((r) => r > 0).length, factor,
        weight: (4 - a[id]) * (1 + reach.reduce((sum, r) => sum + 1 + r, 0)) * factor };
    })
    .sort((x, y) => y.weight - x.weight || x.level - y.level || x.id.localeCompare(y.id, undefined, { numeric: true }))
    .slice(0, n);
}
