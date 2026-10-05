"use client";

/* Landing-page visuals, drawn from the product's own structure and counts so
   they stay accurate. They show shape, not content: no question wording, no
   brief text, no scoring model, no pricing. The organisation is fictional. */

import React from "react";
import { framework } from "@/lib/framework";
import { LIBRARY_STATS, CRITERION_LINKS } from "@/lib/content-meta";

const card = { background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 10, padding: 18 };
const cap = { fontSize: 11.5, fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: ".02em" };

/* The criteria map: the Salveus signature. Eight domains on a ring, eight criteria round each, and
   the links between criteria drawn one after another. A link joins two criteria whose evidence rests
   on the same documents (CRITERION_LINKS, generated from the reading lists), so the picture is the
   research itself and carries no wording. Green crosses domains; grey stays within one. */
const SIZE = 1000, MID = 500, RING = 300, CLUSTER = 76, NODE = 15, PAD = 85;
const rad = (deg) => (deg * Math.PI) / 180;
const domainAngle = (i) => -90 + i * 45;
const domainCentre = (i) => ({ x: MID + RING * Math.cos(rad(domainAngle(i))), y: MID + RING * Math.sin(rad(domainAngle(i))) });
/* Criterion 1 faces the middle of the map; the rest follow clockwise. */
const nodeAt = (i, n) => {
  const c = domainCentre(i), a = rad(domainAngle(i) + 180 + (n - 1) * 45);
  return { x: c.x + CLUSTER * Math.cos(a), y: c.y + CLUSTER * Math.sin(a) };
};
/* A curve bowed towards the domain centre (same domain) or the map centre (across domains). */
function linkPath(a, b, pull, strength) {
  const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const ctrl = { x: m.x + (pull.x - m.x) * strength, y: m.y + (pull.y - m.y) * strength };
  const trim = (p, to, by) => { const dx = to.x - p.x, dy = to.y - p.y, len = Math.hypot(dx, dy) || 1; return { x: p.x + (dx / len) * by, y: p.y + (dy / len) * by }; };
  const s = trim(a, ctrl, NODE + 2), e = trim(b, ctrl, NODE + 5);
  return `M${s.x.toFixed(1)} ${s.y.toFixed(1)}Q${ctrl.x.toFixed(1)} ${ctrl.y.toFixed(1)} ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
}

export function CriteriaMap() {
  const pos = new Map(framework.flatMap((d, i) => d.criteria.map((c, j) => [c.id, nodeAt(i, j + 1)])));
  const dom = (id) => Number(id.split(".")[0]) - 1;
  return (
    <div style={{ ...card, padding: 12 }}>
      <svg viewBox={`${PAD} ${PAD} ${SIZE - 2 * PAD} ${SIZE - 2 * PAD}`} aria-hidden="true" style={{ width: "100%", height: "auto", display: "block" }}>
        {framework.map((d, i) => {
          const c = domainCentre(i);
          return (
            <g key={d.id}>
              <circle cx={c.x} cy={c.y} r={CLUSTER + NODE + 10} fill="var(--ink-50)" stroke="var(--ink-200)" />
              <text x={c.x} y={c.y + 11} textAnchor="middle" style={{ fontSize: 32, fontWeight: 700, fill: "var(--green-700)", fontFamily: "var(--font-sans)" }}>{d.id}</text>
            </g>
          );
        })}
        <g fill="none" strokeLinecap="round">
          {CRITERION_LINKS.map(([from, to, weight], i) => {
            const same = dom(from) === dom(to);
            const pull = same ? domainCentre(dom(from)) : { x: MID, y: MID };
            return (
              <path key={`${from}-${to}`} d={linkPath(pos.get(from), pos.get(to), pull, same ? 0.7 : 0.55)} pathLength={1}
                className="pf-l-draw" style={{ animationDelay: `${(i * 37) % 4000}ms` }}
                stroke={same ? "var(--ink-400)" : "var(--green-600)"} strokeWidth={weight >= 5 ? 2.75 : 1.75} opacity={0.55} />
            );
          })}
        </g>
        {[...pos.entries()].map(([id, p], i) => (
          <circle key={id} cx={p.x} cy={p.y} r={NODE - 3} fill="#fff" stroke="var(--green-600)" strokeWidth="2" className="pf-l-pop" style={{ animationDelay: `${i * 18}ms` }} />
        ))}
      </svg>
      <ol style={{ listStyle: "none", margin: "8px 6px 4px", padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 14px" }}>
        {framework.map((d) => (
          <li key={d.id} style={{ fontSize: 11.5, color: "var(--text-secondary)", display: "flex", gap: 6 }}>
            <span className="pf-tnum" style={{ fontWeight: 700, color: "var(--green-700)" }}>{d.id}</span>{d.name}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* An illustrative result for a fictional organisation. */
const SAMPLE = [61, 48, 44, 57, 66, 52, 39, 35];
export function ScoreCard() {
  const overall = Math.round(SAMPLE.reduce((a, b) => a + b, 0) / SAMPLE.length);
  return (
    <div style={card}>
      <div style={cap}>Governance position · illustrative</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "6px 0 12px" }}>
        <span className="pf-tnum" style={{ fontSize: 38, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>{overall}</span>
        <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>/100 · Defined</span>
      </div>
      <div style={{ display: "grid", gap: 7 }}>
        {framework.map((d, i) => (
          <div key={d.id} style={{ display: "grid", gridTemplateColumns: "14px 1fr 24px", alignItems: "center", gap: 8 }}>
            <span className="pf-tnum" style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)" }}>{d.id}</span>
            <span style={{ height: 6, borderRadius: 3, background: "var(--ink-100)", overflow: "hidden" }}>
              <span className="pf-l-bar" style={{ display: "block", height: "100%", width: `${SAMPLE[i]}%`, background: "var(--green-500)", borderRadius: 3, animationDelay: `${i * 90}ms` }} />
            </span>
            <span className="pf-tnum" style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-900)", textAlign: "right" }}>{SAMPLE[i]}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 10 }}>Fictional organisation.</p>
    </div>
  );
}

/* What the evidence base is made of: real counts from the reading lists. */
const KINDS = [
  ["legislation", "Legislation and binding rules"],
  ["regulator guidance", "Regulator guidance"],
  ["research", "Research"],
  ["official report", "Official reports and inquiries"],
  ["code or standard", "Codes and standards"],
  ["enforcement decision", "Enforcement decisions"],
  ["court or tribunal", "Court and tribunal judgments"],
];
export function EvidencePanel() {
  const max = Math.max(...KINDS.map(([k]) => LIBRARY_STATS.byType[k] || 0));
  return (
    <div style={card}>
      <div style={cap}>The evidence base</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "6px 0 12px" }}>
        <span className="pf-tnum" style={{ fontSize: 38, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>{LIBRARY_STATS.documents}</span>
        <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>documents</span>
      </div>
      <div style={{ display: "grid", gap: 7 }}>
        {KINDS.map(([k, name], i) => {
          const n = LIBRARY_STATS.byType[k] || 0;
          return (
            <div key={k}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11.5, color: "var(--text-secondary)", marginBottom: 3 }}>
                <span>{name}</span><span className="pf-tnum" style={{ fontWeight: 600, color: "var(--ink-900)" }}>{n}</span>
              </div>
              <span style={{ display: "block", height: 5, borderRadius: 3, background: "var(--ink-100)", overflow: "hidden" }}>
                <span className="pf-l-bar" style={{ display: "block", height: "100%", width: `${(n / max) * 100}%`, background: "var(--ink-700)", borderRadius: 3, animationDelay: `${i * 90}ms` }} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* The shape of an evidence brief: six parts, one quotation, a reading list. No wording. */
export function BriefShape() {
  const parts = ["What it measures", "Why it matters", "The UK position", "What good looks like", "Reading the answer", "A defensible figure"];
  const widths = [[96, 70], [100, 92, 58], [100, 97, 88, 40], [94, 76], [90, 52], [72]];
  return (
    <div style={card}>
      <div style={cap}>An evidence brief · the shape of one</div>
      <div style={{ display: "grid", gap: 11, marginTop: 12 }}>
        {parts.map((p, i) => (
          <div key={p}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-900)", marginBottom: 5 }}>{p}</div>
            <div style={{ display: "grid", gap: 4, paddingLeft: i === 1 ? 10 : 0, borderLeft: i === 1 ? "2px solid var(--green-500)" : "none" }}>
              {widths[i].map((w, j) => <span key={j} style={{ display: "block", height: 6, width: `${w}%`, borderRadius: 3, background: "var(--ink-200)" }} />)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", gap: 10, fontSize: 11.5, color: "var(--text-tertiary)" }}>
        <span>Reading list: 15 to 23 documents</span><span>Checked against its sources</span>
      </div>
    </div>
  );
}
