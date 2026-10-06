"use client";

/* The criteria map, live: eight domains on a ring, 64 criteria coloured by the
   organisation's own answers, joined by the approved links. Select a criterion to
   see what it holds back and what it depends on. Same geometry as the landing-page
   map (components/landing/Visuals.jsx); here it draws once and then responds. */

import React from "react";
import { framework, BAND_LABELS, type Answers } from "@/lib/framework";
import { LINKS } from "@/lib/content-meta";
import { CRITERIA, holdsBack, dependsOn, priorities } from "@/lib/links";
import { OwnerChip } from "@/components/overview/Owners";

export const LEVEL_COLORS = ["var(--status-danger)", "var(--status-warning)", "var(--status-info)", "var(--status-success)", "var(--green-600)"];

const SIZE = 1000, MID = 500, RING = 300, CLUSTER = 78, NODE = 15, PAD = 78;
const rad = (deg: number) => (deg * Math.PI) / 180;
const domainAngle = (i: number) => -90 + i * 45;
const domainCentre = (i: number) => ({ x: MID + RING * Math.cos(rad(domainAngle(i))), y: MID + RING * Math.sin(rad(domainAngle(i))) });
const nodeAt = (i: number, n: number) => {
  const c = domainCentre(i), a = rad(domainAngle(i) + 180 + (n - 1) * 45);
  return { x: c.x + CLUSTER * Math.cos(a), y: c.y + CLUSTER * Math.sin(a) };
};
type P = { x: number; y: number };
function linkPath(a: P, b: P, pull: P, strength: number) {
  const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const ctrl = { x: m.x + (pull.x - m.x) * strength, y: m.y + (pull.y - m.y) * strength };
  const trim = (p: P, to: P, by: number) => { const dx = to.x - p.x, dy = to.y - p.y, len = Math.hypot(dx, dy) || 1; return { x: p.x + (dx / len) * by, y: p.y + (dy / len) * by }; };
  const s = trim(a, ctrl, NODE + 2), e = trim(b, ctrl, NODE + 4);
  return `M${s.x.toFixed(1)} ${s.y.toFixed(1)}Q${ctrl.x.toFixed(1)} ${ctrl.y.toFixed(1)} ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
}
const POS: Record<string, P> = Object.fromEntries(framework.flatMap((d, i) => d.criteria.map((c, j) => [c.id, nodeAt(i, j + 1)])));
const dom = (id: string) => Number(id.split(".")[0]) - 1;

const small: React.CSSProperties = { fontSize: 12.5, color: "var(--text-tertiary)" };
const linkStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--text-link)", textDecoration: "none" };

function Level({ answers, id }: { answers: Answers; id: string }) {
  const v = answers[id];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: v === undefined ? "var(--text-tertiary)" : "var(--ink-900)", whiteSpace: "nowrap" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: v === undefined ? "var(--ink-300)" : LEVEL_COLORS[v] }} />
      {v === undefined ? "Not answered" : BAND_LABELS[v]}
    </span>
  );
}

function LinkList({ title, empty, items, answers, pick, onSelect }: {
  title: string; empty: string; items: { from: string; to: string; reason: string; source: string }[];
  answers: Answers; pick: "from" | "to"; onSelect: (id: string) => void;
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>{title}{items.length ? ` (${items.length})` : ""}</div>
      {!items.length && <p style={{ ...small, marginTop: 4 }}>{empty}</p>}
      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        {items.map((l) => {
          const other = l[pick];
          return (
            <button key={`${l.from}-${l.to}`} onClick={() => onSelect(other)}
              style={{ textAlign: "left", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "9px 11px", background: "var(--surface-card)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
              <span style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}><span className="pf-tnum" style={{ color: "var(--green-700)" }}>{other}</span> {CRITERIA[other].criterion.title}</span>
                <Level answers={answers} id={other} />
              </span>
              <span style={{ display: "block", fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 3 }}>{l.reason}</span>
              <span style={{ display: "block", fontSize: 11.5, color: "var(--text-tertiary)", lineHeight: 1.45, marginTop: 3 }}>Source: {l.source}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LiveMap({ answers, selected, onSelect }: { answers: Answers; selected: string | null; onSelect: (id: string | null) => void }) {
  const out = selected ? new Set(holdsBack(selected).map((l) => l.to)) : new Set<string>();
  const inn = selected ? new Set(dependsOn(selected).map((l) => l.from)) : new Set<string>();
  const top = priorities(answers);
  const sel = selected ? CRITERIA[selected] : null;
  const v = selected ? answers[selected] : undefined;

  return (
    <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(0, 1fr)", gap: 28, alignItems: "start", marginTop: 16 }}>
      <div>
        <svg viewBox={`${PAD} ${PAD} ${SIZE - 2 * PAD} ${SIZE - 2 * PAD}`} role="img" aria-label="Map of the 64 criteria and the links between them" style={{ width: "100%", height: "auto", display: "block" }}>
          {framework.map((d, i) => {
            const c = domainCentre(i);
            return (
              <g key={d.id}>
                <circle cx={c.x} cy={c.y} r={CLUSTER + NODE + 12} fill="var(--ink-50)" stroke="var(--ink-200)" />
                <text x={c.x} y={c.y + 11} textAnchor="middle" style={{ fontSize: 32, fontWeight: 700, fill: "var(--ink-400)", fontFamily: "var(--font-sans)" }}>{d.id}</text>
              </g>
            );
          })}
          <g fill="none" strokeLinecap="round">
            {LINKS.map((l, i) => {
              const same = dom(l.from) === dom(l.to);
              const isOut = selected === l.from, isIn = selected === l.to;
              const on = isOut || isIn;
              return (
                <path key={`${l.from}-${l.to}`} d={linkPath(POS[l.from], POS[l.to], same ? domainCentre(dom(l.from)) : { x: MID, y: MID }, same ? 0.7 : 0.55)}
                  pathLength={1} className="pf-map-draw" style={isIn ? { strokeDasharray: "0.035 0.03", animation: "none" } : { animationDelay: `${(i * 11) % 900}ms` }}
                  stroke={isOut ? "var(--green-600)" : isIn ? "var(--ink-700)" : "var(--ink-400)"}
                  strokeWidth={on ? 4 : 1.5}
                  opacity={selected ? (on ? 1 : 0.1) : 0.38} />
              );
            })}
          </g>
          {Object.entries(POS).map(([id, p]) => {
            const a = answers[id];
            const isSel = id === selected, related = out.has(id) || inn.has(id);
            const fill = a === undefined ? "var(--surface-card)" : LEVEL_COLORS[a];
            return (
              <g key={id} onClick={() => onSelect(isSel ? null : id)} style={{ cursor: "pointer" }} opacity={selected && !isSel && !related ? 0.35 : 1}>
                <title>{`${id} ${CRITERIA[id].criterion.title} — ${a === undefined ? "not answered" : BAND_LABELS[a]}`}</title>
                {isSel && <circle cx={p.x} cy={p.y} r={NODE + 9} fill="none" stroke="var(--ink-900)" strokeWidth="3" />}
                <circle cx={p.x} cy={p.y} r={isSel ? NODE + 2 : NODE - 1} fill={fill} stroke={a === undefined ? "var(--ink-300)" : fill} strokeWidth="2.5" />
                <circle cx={p.x} cy={p.y} r={NODE + 12} fill="transparent" />
              </g>
            );
          })}
        </svg>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 6 }}>
          {BAND_LABELS.map((b, i) => (
            <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 6, ...small }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: LEVEL_COLORS[i] }} />{b}</span>
          ))}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, ...small }}><span style={{ width: 9, height: 9, borderRadius: "50%", border: "1.5px solid var(--ink-300)" }} />Not answered</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 6 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, ...small }}><span style={{ width: 18, height: 0, borderTop: "3px solid var(--green-600)" }} />Holds back</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, ...small }}><span style={{ width: 18, height: 0, borderTop: "3px dashed var(--ink-700)" }} />Depends on</span>
        </div>
        <ol style={{ listStyle: "none", margin: "12px 0 0", padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 14px" }}>
          {framework.map((d) => (
            <li key={d.id} style={{ ...small, display: "flex", gap: 6 }}><span className="pf-tnum" style={{ fontWeight: 700, color: "var(--ink-900)" }}>{d.id}</span>{d.name}</li>
          ))}
        </ol>
      </div>

      <div style={{ minWidth: 0 }}>
        {!sel || !selected ? (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>Where to start</div>
            {top.length === 0 ? (
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 6 }}>
                Answer the assessment and the three criteria that would move you furthest appear here. Until then, select any point on the map to see what it connects to.
              </p>
            ) : (
              <>
                <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 4 }}>
                  Ranked by how far each answer is from the top level and how many other criteria it holds back. Select one to see why.
                </p>
                <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                  {top.map((p, i) => (
                    <button key={p.id} onClick={() => onSelect(p.id)}
                      style={{ textAlign: "left", border: "1px solid var(--border-default)", borderRadius: 10, padding: "12px 14px", background: "var(--surface-card)", cursor: "pointer", fontFamily: "var(--font-sans)", display: "grid", gridTemplateColumns: "22px 1fr", gap: 10 }}>
                      <span className="pf-tnum" style={{ fontSize: 15, fontWeight: 700, color: "var(--green-700)" }}>{i + 1}</span>
                      <span>
                        <span style={{ display: "block", fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)" }}>{CRITERIA[p.id].criterion.title}</span>
                        <span style={{ display: "block", fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>
                          {p.id} · {CRITERIA[p.id].domain.name} · {BAND_LABELS[p.level]}{p.holds ? ` · holds back ${p.holds} other${p.holds === 1 ? "" : "s"}` : ""}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
            <p style={{ ...small, lineHeight: 1.5, marginTop: 14 }}>
              Each line joins two criteria where one has to be in place for the other to work. There are {LINKS.length}, each with a stated reason and source.
            </p>
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <div>
                <div style={small}><span className="pf-tnum">{selected}</span> · {sel.domain.name}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-900)", marginTop: 2, letterSpacing: "-0.01em" }}>{sel.criterion.title}</h3>
              </div>
              <button onClick={() => onSelect(null)} aria-label="Clear selection" style={{ border: "1px solid var(--border-default)", borderRadius: 8, background: "var(--surface-card)", width: 30, height: 30, cursor: "pointer", color: "var(--text-secondary)", flexShrink: 0 }}>✕</button>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 6 }}>{sel.criterion.question}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
              <Level answers={answers} id={selected} />
              <OwnerChip ownerKey={`criterion-${selected}`} label={sel.criterion.title} quiet />
            </div>
            {v !== undefined && (
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 10 }}>
                <span style={{ color: "var(--ink-900)", fontWeight: 500 }}>{v < 4 ? `${BAND_LABELS[v + 1]} looks like this.` : "Holding the top level looks like this."}</span>{" "}
                {v < 4 ? sel.criterion.levels[v + 1] : sel.criterion.leading}
              </p>
            )}
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 10 }}>
              <a href={`/dashboard/research/${selected}/`} style={linkStyle}>Read the evidence brief</a>
              <a href={`/dashboard/assessment/?q=${selected}`} style={linkStyle}>{v === undefined ? "Answer this question" : "Change this answer"}</a>
            </div>
            <LinkList title="Holds back" empty="Nothing depends directly on this criterion." items={holdsBack(selected)} answers={answers} pick="to" onSelect={onSelect} />
            <LinkList title="Depends on" empty="This criterion does not depend directly on another." items={dependsOn(selected)} answers={answers} pick="from" onSelect={onSelect} />
          </>
        )}
      </div>
    </div>
  );
}
