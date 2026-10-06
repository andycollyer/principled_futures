/* Client profile weighting (approved by Andy 6 Oct 2026).
   Five yes/no facts about the organisation. Each "yes" raises the priority of the
   criteria that fact makes more pressing. A legal trigger (a duty in statute or
   regulator rules that applies because of the answer) weighs more than a practical
   one. This changes the ORDER of priorities only; scores stay equal-weighted. */

export type ProfileKey = "eu" | "decisions" | "special" | "regulated" | "bought";
export type Profile = Partial<Record<ProfileKey, boolean>>;

export interface ProfileQuestion {
  key: ProfileKey;
  question: string;
  /** Mid-sentence form, after "because": used on the report. */
  because: string;
  legal: boolean;
  basis: string;
  criteria: string[];
}

export const LEGAL_FACTOR = 2;       // a legal trigger doubles a criterion's weight
export const PRACTICAL_FACTOR = 1.5; // a practical one raises it by half
export const MAX_FACTOR = 3;         // however many apply, never more than three times

export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  { key: "eu", legal: true, question: "Do you sell to, or make decisions about, people in the EU?",
    because: "you sell to, or make decisions about, people in the EU", basis: "EU AI Act deployer and transparency duties",
    criteria: ["1.6", "2.1", "2.4", "4.1", "4.2"] },
  { key: "decisions", legal: true, question: "Does AI make or strongly shape decisions about individuals, such as hiring, credit, eligibility or pricing?",
    because: "AI makes or strongly shapes decisions about individuals", basis: "UK GDPR, Articles 22A to 22C",
    criteria: ["3.5", "4.3", "4.4", "4.7", "5.1", "5.2"] },
  { key: "special", legal: true, question: "Do you use AI on special-category data, such as health, ethnicity or biometrics?",
    because: "you use AI on special-category data", basis: "UK GDPR, Article 9; Data Protection Act 2018, Schedule 1",
    criteria: ["3.2", "3.4", "5.4", "5.5"] },
  { key: "regulated", legal: true, question: "Are you regulated by the FCA or PRA, or are you a public body?",
    because: "you are a regulated firm or a public body", basis: "FCA and PRA rules and supervisory statements; the public sector equality duty",
    criteria: ["1.1", "1.7", "2.2", "6.6", "6.8"] },
  { key: "bought", legal: false, question: "Is most of your AI bought in from suppliers, not built in-house?",
    because: "most of your AI is bought in from suppliers", basis: "controls have to be secured through contracts",
    criteria: ["1.5", "3.7", "4.5", "6.7"] },
];

export const profileComplete = (p: Profile | null | undefined): boolean => !!p && PROFILE_QUESTIONS.every((q) => typeof p[q.key] === "boolean");

/** The questions answered "yes" that raise this criterion. */
export const raisedBy = (p: Profile | null | undefined, criterionId: string): ProfileQuestion[] =>
  p ? PROFILE_QUESTIONS.filter((q) => p[q.key] === true && q.criteria.includes(criterionId)) : [];

/** The multiplier the profile applies to a criterion's weight (1 when nothing applies). */
export function profileFactor(p: Profile | null | undefined, criterionId: string): number {
  return Math.min(MAX_FACTOR, raisedBy(p, criterionId).reduce((f, q) => f * (q.legal ? LEGAL_FACTOR : PRACTICAL_FACTOR), 1));
}
