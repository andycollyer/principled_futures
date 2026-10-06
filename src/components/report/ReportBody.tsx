"use client";

/* The advisory report's content. Everything here is derived from this
   organisation's own answers, the owners it has named, the approved links
   between criteria, and the reading lists behind the briefs. Nothing is generic
   filler and nothing is invented: where the product has no data it says so. */

import React from "react";
import * as DS from "@/components/ds";
import { framework, overallScore, domainScore, band, BAND_LABELS, type Answers } from "@/lib/framework";
import { LIBRARY_STATS, LINKS } from "@/lib/content-meta";
import { CRITERIA, holdsBack, overreach, priorities, type Priority } from "@/lib/links";
import { fetchBriefingBody, type BriefingSource } from "@/lib/content";
import { MapSvg, LEVEL_COLORS } from "@/components/overview/LiveMap";
import type { MetricOwner } from "@/lib/telemetry-owners";
import type { OrgDetails } from "@/lib/org";
import { raisedBy, PROFILE_QUESTIONS } from "@/lib/profile";

const BAND_COLORS: Record<string, string> = { Initial: LEVEL_COLORS[0], Developing: LEVEL_COLORS[1], Defined: LEVEL_COLORS[2], Managed: LEVEL_COLORS[3], Leading: LEVEL_COLORS[4] };
const HORIZON = ["0 to 30 days", "30 to 90 days", "30 to 90 days", "90 to 180 days", "90 to 180 days"];

function Section({ n, title, sub, children, newPage = false }: { n: number; title: string; sub?: string; children: React.ReactNode; newPage?: boolean }) {
  return (
    <section className={newPage ? "pf-report-page" : undefined}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: sub ? 4 : 14 }}>
        <span className="pf-tnum" style={{ fontSize: 13, fontWeight: 700, color: "var(--green-700)" }}>{n}</span>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>{title}</h2>
      </div>
      {sub && <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, margin: "0 0 14px 25px", maxWidth: 700 }}>{sub}</p>}
      {children}
    </section>
  );
}

function Lvl({ v }: { v: number | undefined }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: v === undefined ? "var(--text-tertiary)" : "var(--ink-900)", whiteSpace: "nowrap" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: v === undefined ? "var(--ink-300)" : LEVEL_COLORS[v] }} />{v === undefined ? "Not answered" : BAND_LABELS[v]}
    </span>
  );
}

const label: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)" };
const para: React.CSSProperties = { fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6 };
const box: React.CSSProperties = { border: "1px solid var(--border-default)", borderRadius: 10, background: "var(--surface-card)" };

/** Lower-case a title for use mid-sentence, leaving acronyms such as "AI" and "DPIA" alone. */
const mid = (t: string): string => (/^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

function list(items: string[]): string {
  return items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function ReportBody({ answers, owners, details, trends, headline }: {
  answers: Answers; owners: Record<string, MetricOwner>; details: OrgDetails | null;
  trends: Record<string, number | null>; headline: string;
}) {
  const score = overallScore(answers) as number;
  const org = details?.orgName || "Your organisation";
  const profile = details?.profile ?? null;
  const top: Priority[] = priorities(answers, 5, profile);
  const scored = framework.map((d) => ({ d, s: domainScore(d, answers) })).filter((x): x is { d: typeof x.d; s: number } => x.s != null);
  const strongest = scored.length ? scored.reduce((a, b) => (b.s > a.s ? b : a)) : null;
  const weakest = scored.length ? scored.reduce((a, b) => (b.s < a.s ? b : a)) : null;
  const answered = Object.keys(CRITERIA).filter((id) => answers[id] !== undefined).length;

  const ownerOf = (criterionId: string): string | null => {
    const o = owners[`criterion-${criterionId}`] ?? owners[`domain-${criterionId.split(".")[0]}`];
    return o ? `${o.personName}${o.role ? `, ${o.role}` : ""}` : null;
  };
  const domainOwner = (id: number): string | null => { const o = owners[`domain-${id}`]; return o ? `${o.personName}${o.role ? `, ${o.role}` : ""}` : null; };

  // The reading list behind each priority, read at the moment of display (withheld by plan in the database).
  const [reading, setReading] = React.useState<Record<string, { sources: BriefingSource[]; checked: string | null }>>({});
  const topIds = top.map((p) => p.id).join(",");
  React.useEffect(() => {
    let live = true;
    Promise.all(topIds.split(",").filter(Boolean).map(async (id) => [id, await fetchBriefingBody(id)] as const)).then((rows) => {
      if (!live) return;
      setReading(Object.fromEntries(rows.filter(([, b]) => b.state === "ok").map(([id, b]) => [id, { sources: (b.sources ?? []).slice(0, 3), checked: b.checked ?? null }])));
    });
    return () => { live = false; };
  }, [topIds]);

  const first3 = top.slice(0, 3);
  return (
    <>
      {/* Executive summary */}
      <div style={{ ...box, padding: 28 }}>
        <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 28, alignItems: "center" }}>
          <div style={{ display: "grid", placeItems: "center" }}>
            <DS.ScoreGauge score={score} size={150} bandLabel={band(score)} bandColor={BAND_COLORS[band(score)]} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>Executive summary</div>
            <h1 className="pf-display" style={{ fontSize: 24, color: "var(--ink-900)", marginTop: 6, lineHeight: 1.25 }}>{headline}</h1>
            <p style={{ ...para, fontSize: 14.5, marginTop: 10 }}>
              {org} scores {score} out of 100 ({band(score)}){answered < 64 ? `, on ${answered} of 64 questions answered` : ""}.
              {trends.overall ? ` That is ${trends.overall > 0 ? "up" : "down"} ${Math.abs(trends.overall)} since the previous assessment.` : ""}
              {strongest && weakest && strongest.d.id !== weakest.d.id ? ` The strongest domain is ${strongest.d.name} (${strongest.s}); the weakest is ${weakest.d.name} (${weakest.s}).` : ""}
            </p>
            {first3.length > 0 && (
              <p style={{ ...para, fontSize: 14.5, marginTop: 8 }}>
                The board&rsquo;s attention should go first to {list(first3.map((p) => mid(CRITERIA[p.id].criterion.title)))}.
                These are not simply the lowest scores: each is weak and has other parts of your governance resting on it
                {first3.some((p) => p.exposed) ? ", including areas you have rated more highly than their foundations support" : ""}.
                The reasoning for each is set out below.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Priorities */}
      <Section n={1} title="Priorities" sub="Ranked from your own answers: how far each is from the top level, how many other criteria it holds back, whether those have been rated higher than this one can support, and the facts you gave about how you use AI.">
        <div style={{ display: "grid", gap: 14 }}>
          {top.map((p, i) => {
            const { criterion: c, domain: d } = CRITERIA[p.id];
            const held = holdsBack(p.id);
            const r = reading[p.id];
            const owner = ownerOf(p.id);
            return (
              <div key={p.id} className="pf-report-keep" style={{ ...box, padding: "20px 22px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 14, minWidth: 0 }}>
                    <span className="pf-tnum" style={{ fontSize: 22, fontWeight: 700, color: "var(--green-700)", lineHeight: 1.1 }}>{i + 1}</span>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)" }}>{c.title}</h3>
                      <div style={{ fontSize: 12.5, color: "var(--text-tertiary)", marginTop: 2 }}><span className="pf-tnum">{p.id}</span> · {d.name}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Lvl v={p.level} />
                    <div style={{ fontSize: 12.5, color: owner ? "var(--text-secondary)" : "var(--status-warning)", marginTop: 3 }}>{owner ? `Owner: ${owner}` : "No owner named"}</div>
                  </div>
                </div>

                <p style={{ ...para, marginTop: 12, color: "var(--ink-900)" }}>{c.question}</p>
                <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 10 }}>
                  <div><div style={label}>Where you are: {BAND_LABELS[p.level]}</div><p style={{ ...para, marginTop: 3 }}>{c.levels[p.level]}</p></div>
                  <div><div style={label}>What {BAND_LABELS[p.level + 1]} requires</div><p style={{ ...para, marginTop: 3 }}>{c.levels[p.level + 1]}</p></div>
                </div>

                {raisedBy(profile, p.id).map((q) => (
                  <p key={q.key} style={{ ...para, fontSize: 13, marginTop: 12, paddingLeft: 12, borderLeft: "2px solid var(--green-600)" }}>
                    <span style={{ color: "var(--ink-900)", fontWeight: 500 }}>Raised for {org}</span> because {q.because}. {q.legal ? "Legal basis" : "Reason"}: {q.basis}.
                  </p>
                ))}
                {held.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={label}>Why this comes first: it holds back {held.length} other {held.length === 1 ? "criterion" : "criteria"}</div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0", display: "grid", gap: 7 }}>
                      {held.map((l) => {
                        const over = overreach(answers, l.from, l.to);
                        return (
                          <li key={l.to} style={{ ...para, fontSize: 13, paddingLeft: 12, borderLeft: `2px solid ${over ? "var(--status-warning)" : "var(--border-default)"}` }}>
                            <span style={{ color: "var(--ink-900)", fontWeight: 500 }}><span className="pf-tnum">{l.to}</span> {CRITERIA[l.to].criterion.title}</span>
                            {answers[l.to] !== undefined && <span> ({BAND_LABELS[answers[l.to]]}{over ? ", rated above what this supports" : ""})</span>}. {l.reason}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
                  <div style={label}>Evidence</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: "5px 0 0", display: "grid", gap: 3 }}>
                    {(r?.sources ?? []).map((s) => (
                      <li key={s.url} style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>{s.title}{s.locator ? `, ${s.locator}` : ""}. {s.publisher}, {s.year}.</li>
                    ))}
                    {!r && [...new Set(held.map((l) => l.source))].slice(0, 2).map((s) => (
                      <li key={s} style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>{s}</li>
                    ))}
                  </ul>
                  <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 5 }}>
                    {r ? `From the evidence brief for ${p.id}${r.checked ? `, sources last checked ${new Date(r.checked).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}. The full brief and reading list are in the library.` : `The full evidence brief and reading list for ${p.id} are in the library.`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Plan */}
      <Section n={2} title="A 180-day plan" sub="One step per priority: the move to the next level, in the framework's own description of that level.">
        <div style={{ ...box }}>
          {top.map((p, i) => {
            const c = CRITERIA[p.id].criterion; const owner = ownerOf(p.id);
            return (
              <div key={p.id} className="pf-report-keep pf-r-stack" style={{ display: "flex", gap: 18, padding: "14px 20px", borderTop: i ? "1px solid var(--border-subtle)" : "none" }}>
                <span style={{ width: 110, flexShrink: 0, fontSize: 12.5, fontWeight: 600, color: "var(--green-700)" }}>{HORIZON[i]}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)" }}>Move {mid(c.title)} from {BAND_LABELS[p.level]} to {BAND_LABELS[p.level + 1]}</span>
                  <span style={{ display: "block", ...para, marginTop: 2 }}>{c.levels[p.level + 1]}</span>
                </span>
                <span style={{ width: 170, flexShrink: 0, fontSize: 12.5, color: owner ? "var(--text-secondary)" : "var(--status-warning)", textAlign: "right" }}>{owner ?? "No owner named"}</span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Position */}
      <Section n={3} title="Your position" sub={`All 64 criteria, coloured by your answer, with the ${LINKS.length} links between them. A line joins two criteria where one has to be in place for the other to work.`} newPage>
        <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)", gap: 26, alignItems: "center" }}>
          <div>
            <MapSvg answers={answers} still />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 12px", marginTop: 6 }}>
              {BAND_LABELS.map((b, i) => <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--text-tertiary)" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: LEVEL_COLORS[i] }} />{b}</span>)}
            </div>
          </div>
          <div style={{ ...box }}>
            {framework.map((d, i) => {
              const s = domainScore(d, answers); const t = trends[String(d.id)]; const o = domainOwner(d.id);
              return (
                <div key={d.id} style={{ display: "grid", gridTemplateColumns: "20px 1fr auto 34px", gap: 10, alignItems: "center", padding: "10px 16px", borderTop: i ? "1px solid var(--border-subtle)" : "none" }}>
                  <span className="pf-tnum" style={{ fontSize: 12.5, fontWeight: 700, color: "var(--green-700)" }}>{d.id}</span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "var(--ink-900)" }}>{d.name}</span>
                    <span style={{ display: "block", fontSize: 11.5, color: "var(--text-tertiary)" }}>{o ?? "No owner named"}{t ? ` · ${t > 0 ? "up" : "down"} ${Math.abs(t)}` : ""}</span>
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s == null ? "" : band(s)}</span>
                  <span className="pf-tnum" style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)", textAlign: "right" }}>{s ?? "—"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Appendix */}
      <Section n={4} title="All 64 answers" newPage>
        <div style={{ columns: "2 320px", columnGap: 26 }}>
          {framework.map((d) => (
            <div key={d.id} className="pf-report-keep" style={{ breakInside: "avoid", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)", paddingBottom: 5, borderBottom: "1px solid var(--border-default)" }}><span className="pf-tnum" style={{ color: "var(--green-700)" }}>{d.id}</span> {d.name}</div>
              {d.criteria.map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "4px 0", borderBottom: "1px solid var(--border-subtle)", fontSize: 12.5 }}>
                  <span style={{ color: "var(--text-secondary)" }}><span className="pf-tnum">{c.id}</span> {c.title}</span><Lvl v={answers[c.id]} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* Method */}
      <Section n={5} title="Method and evidence">
        <div style={{ ...box, padding: "18px 22px" }}>
          <p style={para}>
            <span style={label}>Scoring.</span> The Principled Futures framework (version 1.0.0) has eight domains of eight criteria. Each criterion is answered on five described levels, from Initial to Leading. A domain score is the average of its answered criteria as a percentage; the overall score is the average of the domain scores. All criteria carry equal weight in the score.
          </p>
          <p style={{ ...para, marginTop: 8 }}>
            <span style={label}>Priorities.</span> The ranking uses your own answers. Each answer below the top level is weighted by the number of levels it is short, by the number of criteria that depend on it, and by how far any of those have been rated above it. It is then raised by the facts you gave about your organisation: a criterion that a legal duty makes pressing for you counts double, and one raised for a practical reason counts one and a half times.{profile ? ` You answered yes to ${PROFILE_QUESTIONS.filter((q) => profile[q.key] === true).length} of the ${PROFILE_QUESTIONS.length} questions.` : ""} This affects the order of priorities only, never the score. The {LINKS.length} dependencies between criteria each have a stated reason and a named source, reviewed and approved by Principled Futures.
          </p>
          <p style={{ ...para, marginTop: 8 }}>
            <span style={label}>Evidence.</span> Every criterion rests on an evidence brief and a reading list. The library holds {LIBRARY_STATS.documents.toLocaleString("en-GB")} documents: legislation, regulator guidance, codes and standards, court and tribunal decisions, official reports and research. Quoted passages are re-checked against their sources daily.
          </p>
          <p style={{ ...para, marginTop: 8 }}>
            <span style={label}>Limits.</span> The report reflects the answers given by {org} and has not been verified against documents or systems. It is governance guidance, not legal advice.
          </p>
        </div>
      </Section>
    </>
  );
}
