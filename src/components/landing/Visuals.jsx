"use client";

/* Landing-page visuals, drawn from the product's own structure and counts so
   they stay accurate. They show shape, not content: no question wording, no
   brief text, no scoring model, no pricing. The organisation is fictional. */

import React from "react";
import { framework } from "@/lib/framework";
import { LIBRARY_STATS } from "@/lib/content-meta";

const card = { background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 10, padding: 18 };
const cap = { fontSize: 11.5, fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: ".02em" };

/* Eight domains on a ring, eight criteria each: the structure of the assessment. */
export function DomainRing() {
  const R = 118, r = 150, cx = 190, cy = 178;
  return (
    <div style={{ ...card, padding: 14 }}>
      <svg viewBox="0 0 380 356" role="img" aria-label="The assessment's eight domains, each with eight criteria" style={{ width: "100%", height: "auto", display: "block" }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--ink-200)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r="44" fill="var(--green-50)" stroke="var(--green-200)" strokeWidth="1" />
        <text x={cx} y={cy - 3} textAnchor="middle" style={{ fontSize: 22, fontWeight: 700, fill: "var(--green-700)", fontFamily: "var(--font-sans)" }}>64</text>
        <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontSize: 10, fontWeight: 600, fill: "var(--text-tertiary)", fontFamily: "var(--font-sans)" }}>criteria</text>
        {framework.map((d, i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
          return (
            <g key={d.id}>
              <line x1={cx + Math.cos(a) * 44} y1={cy + Math.sin(a) * 44} x2={x} y2={y} stroke="var(--ink-200)" strokeWidth="1" />
              {d.criteria.map((c, j) => {
                const b = a + ((j - 3.5) / 8) * 0.62;
                return <circle key={c.id} className="pf-l-dot" style={{ animationDelay: `${(i * 8 + j) * 55}ms` }} cx={cx + Math.cos(b) * r} cy={cy + Math.sin(b) * r} r="3.2" />;
              })}
              <circle cx={x} cy={y} r="13" fill="var(--green-600)" />
              <text x={x} y={y + 4} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 700, fill: "#fff", fontFamily: "var(--font-sans)" }}>{d.id}</text>
            </g>
          );
        })}
      </svg>
      <ol style={{ listStyle: "none", margin: "6px 4px 2px", padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 14px" }}>
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
