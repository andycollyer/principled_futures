/* The approved dependencies between criteria, and what follows from them:
   what a criterion holds back, what it depends on, and where to start. */

import { LINKS, type CriterionLink } from "@/lib/content-meta";
import { framework, BAND_LABELS, type Answers, type Criterion, type Domain } from "@/lib/framework";

export const CRITERIA: Record<string, { criterion: Criterion; domain: Domain }> = Object.fromEntries(
  framework.flatMap((d) => d.criteria.map((c) => [c.id, { criterion: c, domain: d }])),
);

/** Links out of a criterion: the criteria it holds back when it is weak. */
export const holdsBack = (id: string): CriterionLink[] => LINKS.filter((l) => l.from === id);
/** Links into a criterion: the criteria it depends on. */
export const dependsOn = (id: string): CriterionLink[] => LINKS.filter((l) => l.to === id);

export const levelLabel = (a: Answers, id: string): string | null => (a[id] === undefined ? null : BAND_LABELS[a[id]]);

export interface Priority { id: string; level: number; holds: number; weight: number }

/** Where to start: answers below the top level, ranked by how weak they are and how many
    other criteria they hold back. Weight = levels short of the top × (1 + criteria held back). */
export function priorities(a: Answers, n = 3): Priority[] {
  return Object.keys(CRITERIA)
    .filter((id) => a[id] !== undefined && a[id] < 4)
    .map((id) => { const holds = holdsBack(id).length; return { id, level: a[id], holds, weight: (4 - a[id]) * (1 + holds) }; })
    .sort((x, y) => y.weight - x.weight || x.level - y.level || x.id.localeCompare(y.id, undefined, { numeric: true }))
    .slice(0, n);
}
