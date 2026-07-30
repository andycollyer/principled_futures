"use client";

/* Telemetry — continuous-oversight hub. 11-metric register with owner
   assignment, domain heatmap wired to real assessment scores, accountability
   rings, regulatory countdown, and session-gated motion per the handoff
   addendum. Metric values are the design's sample set until live feeds land. */

import React from "react";
import * as DS from "@/components/ds";
import * as UI from "@/components/icons";
import { framework, overallScore, band, domainScore } from "@/lib/framework";
import { useAnswers } from "@/lib/store";
import { useOwners, type MetricOwner } from "@/lib/telemetry-owners";

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const TONE_HEX: Record<string, string> = { success: "var(--status-success)", warning: "var(--status-warning)", danger: "var(--status-danger)" };
const TONE_LABEL: Record<string, string> = { success: "Within", warning: "Watch", danger: "Breach" };
const BAND_COLORS: Record<string, string> = {
  Initial: "var(--status-danger)",
  Developing: "var(--status-warning)",
  Defined: "var(--status-info)",
  Managed: "var(--status-success)",
  Leading: "var(--green-600)",
};

interface Metric {
  id: string;
  domainId: number; // maps to framework domain for heatmap filtering
  cat: string;
  metric: string;
  value: string;
  unit: string;
  threshold: string;
  thresholdValue: number | null; // numeric line on the sparkline, where meaningful
  freq: string;
  tone: "success" | "warning" | "danger";
  spark: number[];
}

const METRICS: Metric[] = [
  { id: "scaling-status", domainId: 1, cat: "Strategy & ROI", metric: "Scaling Status", value: "42", unit: "%", threshold: "> 40% scaled", thresholdValue: 40, freq: "Quarterly", tone: "success", spark: [28, 31, 34, 33, 38, 40, 42] },
  { id: "realised-roi", domainId: 1, cat: "Strategy & ROI", metric: "Realised ROI", value: "1.3", unit: "x", threshold: "> 1.0x yield", thresholdValue: 1.0, freq: "Quarterly", tone: "success", spark: [0.9, 1.0, 1.05, 1.1, 1.2, 1.25, 1.3] },
  { id: "model-drift", domainId: 2, cat: "Model Health", metric: "Model Drift", value: "1.4", unit: "%", threshold: "< 2% deviation", thresholdValue: 2, freq: "Real-time", tone: "success", spark: [1.1, 1.0, 1.3, 1.2, 1.5, 1.3, 1.4] },
  { id: "bias-impact", domainId: 3, cat: "Ethics & Fairness", metric: "Bias / Disparate Impact", value: "1.31", unit: "", threshold: "0.8 – 1.25 parity", thresholdValue: 1.25, freq: "Monthly", tone: "warning", spark: [1.1, 1.15, 1.2, 1.22, 1.26, 1.29, 1.31] },
  { id: "explainability", domainId: 4, cat: "Ethics & Fairness", metric: "Explainability Score", value: "96", unit: "%", threshold: "100% high-risk", thresholdValue: 100, freq: "Monthly", tone: "warning", spark: [88, 90, 91, 93, 94, 95, 96] },
  { id: "hallucination-rate", domainId: 2, cat: "Ethics & Fairness", metric: "Hallucination Rate", value: "0.7", unit: "%", threshold: "< 1% occurrence", thresholdValue: 1, freq: "Weekly", tone: "success", spark: [1.2, 1.0, 0.9, 0.95, 0.8, 0.75, 0.7] },
  { id: "shadow-ai", domainId: 7, cat: "Security & Resilience", metric: "Shadow AI Detection", value: "3", unit: "", threshold: "0 (zero tolerance)", thresholdValue: 0, freq: "Monthly scans", tone: "danger", spark: [0, 1, 1, 2, 2, 3, 3] },
  { id: "kill-switch", domainId: 6, cat: "Security & Resilience", metric: "Kill-Switch Readiness", value: "Active", unit: "", threshold: "100% tested", thresholdValue: null, freq: "Weekly", tone: "success", spark: [1, 1, 1, 1, 1, 1, 1] },
  { id: "speak-up", domainId: 7, cat: "Workforce & Culture", metric: "Speak-Up Resolution", value: "100", unit: "%", threshold: "100% escalated", thresholdValue: 100, freq: "Monthly", tone: "success", spark: [82, 88, 90, 94, 96, 99, 100] },
  { id: "regulatory-readiness", domainId: 5, cat: "Compliance", metric: "Regulatory Readiness", value: "Audit-ready", unit: "", threshold: "EU AI Act Art. 12/14", thresholdValue: null, freq: "Monthly", tone: "success", spark: [1, 1, 1, 1, 1, 1, 1] },
  { id: "carbon-footprint", domainId: 8, cat: "Environmental / ESG", metric: "AI Carbon Footprint", value: "Within", unit: "", threshold: "Within ESG cap", thresholdValue: null, freq: "Quarterly", tone: "success", spark: [1, 1, 1, 1, 1, 1, 1] },
];

// ——— Copy deck (verbatim) ———
const RINGS_COPY = [
  { name: "Live measures", cadence: "continuous", body: "The eleven numbers themselves — refreshed automatically, thresholds attached, nobody's opinion required." },
  { name: "Run it — the people using AI daily", cadence: "daily · weekly", body: "In your organisation: operations, IT, team leads. They watch the measures, fix what drifts, and raise what they can't fix." },
  { name: "Steer it — the people who set the rules", cadence: "monthly · quarterly", body: "In your organisation: senior management, the risk owner, the board. They set the thresholds, act on breaches, and own the decisions the numbers demand." },
  { name: "Check it — the outside eyes", cadence: "yearly", body: "In your organisation: your accountant, auditor or an external reviewer. They confirm the other two circles did what the records say — so the board's sign-off rests on proof, not trust." },
];
const RINGS_FOOTER = "The rule that makes it work: every measure belongs to one named person in one ring. If a number has no name, it isn't governed — it's just displayed.";
const RING_SHORT = ["Live measures", "Run it", "Steer it", "Check it"];

const MILESTONES = [
  { label: "Art 50", date: "2026-08-02" },
  { label: "Watermark", date: "2026-12-02" },
];

/** Expand the design's 7-point trend into a deterministic 30-day series. */
function expandSpark(spark: number[], n = 30): number[] {
  const max = Math.max(...spark), min = Math.min(...spark);
  const range = max - min;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * (spark.length - 1);
    const lo = Math.floor(t), hi = Math.min(spark.length - 1, Math.ceil(t));
    const base = spark[lo] + (spark[hi] - spark[lo]) * (t - lo);
    const wobble = range === 0 ? 0 : Math.sin(i * 2.7 + spark[0] * 7) * range * 0.05;
    out.push(base + wobble);
  }
  return out;
}

/** rAF count-up that respects the animation gate. */
function useCountUp(target: number, animate: boolean, duration = 240): number {
  const [value, setValue] = React.useState(animate ? 0 : target);
  React.useEffect(() => {
    if (!animate) { setValue(target); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, animate, duration]);
  return value;
}

function Sparkline({ metric, animate, delay }: { metric: Metric; animate: boolean; delay: number }) {
  const width = 96, height = 30;
  const points = React.useMemo(() => expandSpark(metric.spark), [metric]);
  let max = Math.max(...points), min = Math.min(...points);
  if (metric.thresholdValue != null) { max = Math.max(max, metric.thresholdValue); min = Math.min(min, metric.thresholdValue); }
  const span = max - min || 1;
  const y = (p: number) => height - ((p - min) / span) * (height - 4) - 2;
  const step = width / (points.length - 1);
  const d = points.map((p, i) => `${(i * step).toFixed(2)},${y(p).toFixed(2)}`).join(" ");
  const last = points[points.length - 1];
  const [drawn, setDrawn] = React.useState(!animate);
  React.useEffect(() => {
    if (!animate) { setDrawn(true); return; }
    const t = setTimeout(() => setDrawn(true), 30 + delay);
    return () => clearTimeout(t);
  }, [animate, delay]);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ overflow: "visible", flexShrink: 0 }}>
      {metric.thresholdValue != null && (
        <line x1={0} x2={width} y1={y(metric.thresholdValue)} y2={y(metric.thresholdValue)} stroke="var(--ink-300)" strokeWidth="1" strokeDasharray="3 3" />
      )}
      <polyline
        points={d}
        pathLength={1}
        stroke={TONE_HEX[metric.tone]}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={animate ? { strokeDasharray: 1, strokeDashoffset: drawn ? 0 : 1, transition: `stroke-dashoffset 280ms ${EASE} ${delay}ms` } : undefined}
      />
      <circle cx={(points.length - 1) * step} cy={y(last)} r="2.4" fill={TONE_HEX[metric.tone]} style={animate ? { opacity: drawn ? 1 : 0, transition: `opacity 120ms ${EASE} ${delay + 220}ms` } : undefined} />
    </svg>
  );
}

function OwnerChip({ owner, onClick }: { owner: MetricOwner | undefined; onClick: () => void }) {
  if (owner) {
    return (
      <button onClick={onClick} title={`${owner.role} · ${RING_SHORT[owner.ring]}`}
        style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 10px 4px 4px", borderRadius: 999, border: "1px solid transparent", background: "var(--ink-100)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
        <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--ink-900)", color: "#fff", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 600 }}>
          {owner.personName.trim().charAt(0).toUpperCase()}
        </span>
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-900)" }}>{owner.personName}</span>
      </button>
    );
  }
  return (
    <button onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 999, border: "1.5px dashed var(--status-warning)", background: "transparent", color: "var(--status-warning)", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)" }}>
      Assign owner
    </button>
  );
}

function CountdownStrip() {
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => { setNow(Date.now()); }, []);
  if (now == null) return <div style={{ height: 34 }} />;
  const items = MILESTONES.map((m) => ({ ...m, days: Math.ceil((Date.parse(m.date + "T00:00:00") - now) / 86400000) })).filter((m) => m.days >= 0);
  if (!items.length) return null;
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {items.map((m) => {
        const color = m.days <= 7 ? "var(--status-danger)" : m.days <= 30 ? "var(--status-warning)" : "var(--text-secondary)";
        return (
          <span key={m.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border-subtle)", background: "var(--surface-card)" }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{m.label}</span>
            <span className="pf-tnum" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color }}>{m.days}d</span>
          </span>
        );
      })}
    </div>
  );
}

function relativeLabel(ms: number): string {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  return `${mins} min ago`;
}

export default function TelemetryPage() {
  const { answers, ready } = useAnswers();
  const { owners, assignOwner, ready: ownersReady } = useOwners();

  // ——— Animation gate: once per sign-in, never under reduced motion ———
  const [animate, setAnimate] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const played = window.sessionStorage.getItem("pf-telemetry-animated") === "true";
    // A hidden tab can't run rAF-driven motion — render finals and keep the
    // once-per-session animation for the first visible load.
    if (!reduced && !played && !document.hidden) {
      setAnimate(true);
      try { window.sessionStorage.setItem("pf-telemetry-animated", "true"); } catch {}
    }
    setMounted(true);
  }, []);

  // ——— Breach pulse: only on transition into breach ———
  const [pulseIds, setPulseIds] = React.useState<string[]>([]);
  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stored: Record<string, string> = {};
    try { stored = JSON.parse(window.localStorage.getItem("pf-telemetry-status-v1") || "{}"); } catch {}
    const entering = METRICS.filter((m) => m.tone === "danger" && stored[m.id] && stored[m.id] !== "danger").map((m) => m.id);
    if (!reduced && entering.length) setPulseIds(entering);
    const current: Record<string, string> = {};
    for (const m of METRICS) current[m.id] = m.tone;
    try { window.localStorage.setItem("pf-telemetry-status-v1", JSON.stringify(current)); } catch {}
  }, []);

  // ——— Last refreshed ———
  const [refreshedAt] = React.useState(() => Date.now());
  const [, forceTick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  // ——— Owner alert dismissal (per session) ———
  const [alertDismissed, setAlertDismissed] = React.useState(true);
  React.useEffect(() => {
    setAlertDismissed(window.sessionStorage.getItem("pf-owner-alert-dismissed") === "true");
  }, []);
  const dismissAlert = () => {
    setAlertDismissed(true);
    try { window.sessionStorage.setItem("pf-owner-alert-dismissed", "true"); } catch {}
  };

  // ——— Domain filter via heatmap ———
  const [filterDomain, setFilterDomain] = React.useState<number | null>(null);
  const shown = filterDomain == null ? METRICS : METRICS.filter((m) => m.domainId === filterDomain);

  // ——— Modal state ———
  const [assigning, setAssigning] = React.useState<string | null>(null);
  const [formName, setFormName] = React.useState("");
  const [formRole, setFormRole] = React.useState("");
  const [formRing, setFormRing] = React.useState<1 | 2 | 3>(2);
  const openAssign = (metricId: string) => {
    const existing = owners[metricId];
    setFormName(existing?.personName ?? "");
    setFormRole(existing?.role ?? "");
    setFormRing(existing?.ring ?? 2);
    setAssigning(metricId);
  };
  const confirmAssign = () => {
    if (assigning && formName.trim()) {
      assignOwner(assigning, formName.trim(), formRole.trim(), formRing);
      setAssigning(null);
    }
  };

  const counts = METRICS.reduce((a, m) => ((a[m.tone] += 1), a), { success: 0, warning: 0, danger: 0 } as Record<string, number>);
  const score = ready ? overallScore(answers) : null;
  const gaugeScore = useCountUp(score ?? 0, animate && score != null);
  const within = useCountUp(counts.success, animate, 90 * counts.success);
  const watch = useCountUp(counts.warning, animate, Math.max(90, 90 * counts.warning));
  const breach = useCountUp(counts.danger, animate, Math.max(90, 90 * counts.danger));

  const unassigned = ownersReady ? METRICS.filter((m) => !owners[m.id]) : [];
  const ringOwned = (ring: number) => Object.values(owners).filter((o) => o.ring === ring && METRICS.some((m) => m.id === o.metricId)).length;

  // Rings entrance
  const [ringsIn, setRingsIn] = React.useState(false);
  React.useEffect(() => {
    if (!mounted) return;
    if (!animate) { setRingsIn(true); return; }
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setRingsIn(true)));
    return () => cancelAnimationFrame(raf);
  }, [mounted, animate]);

  const gaugeBand = score != null ? band(score) : null;
  const gaugeColor = gaugeBand ? BAND_COLORS[gaugeBand] : "var(--ink-200)";
  const gaugeSize = 92, gaugeStroke = 8;
  const gaugeR = (gaugeSize - gaugeStroke) / 2;
  const gaugeC = 2 * Math.PI * gaugeR;

  const RING_SIZES = [120, 212, 304, 396];

  return (
    <div style={{ padding: 28, maxWidth: 1180, margin: "0 auto" }}>
      <style>{`@keyframes pfBreachPulse { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-danger) 45%, transparent); } 70% { box-shadow: 0 0 0 9px color-mix(in srgb, var(--status-danger) 0%, transparent); } 100% { box-shadow: 0 0 0 0 transparent; } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 22 }}>
        <div>
          <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>Telemetry</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
            Continuous oversight · last refreshed {mounted ? relativeLabel(Date.now() - refreshedAt) : "just now"}
          </p>
        </div>
        <CountdownStrip />
      </div>

      {/* Posture strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        <DS.Card style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {score == null ? (
            <div style={{ padding: "6px 2px" }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>Governance posture</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-900)", marginTop: 4 }}>Assessment not started</div>
              <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 2 }}>Your posture appears once you begin.</div>
            </div>
          ) : (
            <>
              <div style={{ position: "relative", width: gaugeSize, height: gaugeSize, flexShrink: 0 }}>
                <svg width={gaugeSize} height={gaugeSize} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx={gaugeSize / 2} cy={gaugeSize / 2} r={gaugeR} fill="none" stroke="var(--ink-200)" strokeWidth={gaugeStroke} />
                  <circle cx={gaugeSize / 2} cy={gaugeSize / 2} r={gaugeR} fill="none" stroke={gaugeColor} strokeWidth={gaugeStroke} strokeLinecap="round"
                    strokeDasharray={gaugeC}
                    strokeDashoffset={gaugeC * (1 - (animate ? gaugeScore : score) / 100)}
                    style={animate ? { transition: `stroke-dashoffset 240ms ${EASE}` } : undefined} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                  <span className="pf-tnum" style={{ fontSize: 26, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-0.02em" }}>{animate ? gaugeScore : score}</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>Governance posture</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ink-900)", marginTop: 2 }}>{gaugeBand}</div>
                <div className="pf-tnum" style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 2 }}>11 metrics · 4 accountability tiers</div>
              </div>
            </>
          )}
        </DS.Card>
        <DS.StatCard label="Within threshold" value={within} unit="/ 11" icon={<UI.ICheck size={17} />} />
        <DS.StatCard label="On watch" value={watch} unit="/ 11" icon={<UI.IClock size={17} />} />
        <DS.StatCard label="Breached" value={breach} unit="/ 11" icon={<UI.IAlert size={17} />} />
      </div>

      {/* Domain heatmap */}
      <DS.Card style={{ marginBottom: 16 }}>
        <DS.CardHeader title="Domain heatmap" subtitle="The eight framework domains at a glance — click a tile to filter the register" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {framework.map((d) => {
            const s = ready ? domainScore(d, answers) : null;
            const tone = s == null ? null : s < 40 ? "danger" : s < 60 ? "warning" : "success";
            const on = filterDomain === d.id;
            return (
              <button key={d.id} onClick={() => setFilterDomain(on ? null : d.id)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                style={{ textAlign: "left", cursor: "pointer", borderRadius: 10, padding: "12px 12px 14px", fontFamily: "var(--font-sans)",
                  border: on ? `1.5px solid var(--ink-900)` : `1px solid ${tone ? TONE_HEX[tone] : "var(--border-default)"}`,
                  background: tone ? `color-mix(in srgb, ${TONE_HEX[tone]} 8%, var(--surface-card))` : "var(--surface-card)",
                  transition: `transform 180ms ${EASE}` }}>
                <span style={{ display: "block", width: 9, height: 9, borderRadius: "50%", background: tone ? TONE_HEX[tone] : "var(--ink-300)", marginBottom: 10 }} />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.3, display: "block" }}>{d.name}</span>
                <span className="pf-tnum" style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 4, display: "block" }}>{s == null ? "No data" : `${s} · ${band(s)}`}</span>
              </button>
            );
          })}
        </div>
      </DS.Card>

      {/* Governance nudge */}
      {ownersReady && unassigned.length > 0 && !alertDismissed && (
        <div style={{ marginBottom: 16 }}>
          <DS.Alert tone="warning" title={`${unassigned.length} ${unassigned.length === 1 ? "measure has" : "measures have"} no named owner.`} onDismiss={dismissAlert}>
            Unowned measures are displayed, not governed.
          </DS.Alert>
        </div>
      )}

      {/* Metric register */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "26px 0 14px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)" }}>Metric register</h2>
        {filterDomain != null ? (
          <button onClick={() => setFilterDomain(null)} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "var(--green-100)", color: "var(--green-700)", borderRadius: 999, padding: "5px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            {framework.find((d) => d.id === filterDomain)?.name} · Clear
          </button>
        ) : (
          <DS.Badge tone="neutral" dot>Demo data · live feeds arrive with integrations</DS.Badge>
        )}
      </div>
      {shown.length === 0 ? (
        <DS.Card style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 14, color: "var(--text-tertiary)" }}>No measures mapped to this domain yet.</div>
        </DS.Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {shown.map((m, i) => {
            const isNumeric = /^[\d.]+$/.test(m.value);
            const pulsing = pulseIds.includes(m.id);
            return (
              <div key={m.id} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, boxShadow: "var(--shadow-card)", padding: 18,
                borderLeft: m.tone === "danger" ? "3px solid var(--status-danger)" : "1px solid var(--border-subtle)",
                animation: pulsing ? `pfBreachPulse 600ms ${EASE} 2` : undefined }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-tertiary)" }}>{m.cat}</div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)", marginTop: 2 }}>{m.metric}</div>
                  </div>
                  <DS.Badge tone={m.tone} dot>{TONE_LABEL[m.tone]}</DS.Badge>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, margin: "14px 0 14px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                    <span className="pf-tnum" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isNumeric ? 30 : 20, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>{m.value}</span>
                    {m.unit && <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-tertiary)" }}>{m.unit}</span>}
                  </div>
                  <Sparkline metric={m} animate={animate} delay={i * 60} />
                </div>
                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 11, display: "flex", flexDirection: "column", gap: 6 }}>
                  {([["Threshold", m.threshold], ["Owner", owners[m.id]?.personName ?? "—"], ["Frequency", m.freq]] as [string, string][]).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{k}</span>
                      <span className="pf-tnum" style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 6 }}>
                    <OwnerChip owner={owners[m.id]} onClick={() => openAssign(m.id)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Accountability rings */}
      <DS.Card style={{ marginTop: 16, padding: 28 }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.011em" }}>Who watches what, and when</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>One set of measures. Three circles of people. Three rhythms of review.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 28, alignItems: "center" }}>
          <div style={{ position: "relative", width: 396, height: 396, margin: "0 auto" }}>
            {RING_SIZES.map((size, i) => {
              const idx = RING_SIZES.length - 1 - i; // render outermost first
              const s = RING_SIZES[idx];
              const centre = idx === 0;
              return (
                <div key={idx} style={{ position: "absolute", left: "50%", top: "50%",
                  width: s, height: s, borderRadius: "50%",
                  background: centre ? "var(--green-600)" : "var(--surface-card)",
                  border: centre ? "none" : "1px solid var(--border-subtle)",
                  boxShadow: centre ? "var(--shadow-md)" : "none",
                  display: "flex", alignItems: centre ? "center" : "flex-start", justifyContent: "center",
                  zIndex: RING_SIZES.length - idx,
                  transform: `translate(-50%,-50%) scale(${ringsIn ? 1 : 0.85})`,
                  opacity: ringsIn ? 1 : 0,
                  transition: animate ? `transform 240ms ${EASE} ${idx * 120}ms, opacity 240ms ${EASE} ${idx * 120}ms` : "none" }}>
                  <div style={{ textAlign: "center", paddingTop: centre ? 0 : 13 }}>
                    <div style={{ fontSize: centre ? 13 : 12, fontWeight: 600, color: centre ? "#fff" : "var(--ink-900)" }}>{RING_SHORT[idx]}</div>
                    <div style={{ fontSize: 10.5, color: centre ? "rgba(255,255,255,0.8)" : "var(--text-tertiary)", marginTop: 1 }}>{RINGS_COPY[idx].cadence}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {RINGS_COPY.map((r, i) => {
              const ownedCount = i === 0 ? null : ringOwned(i);
              return (
                <div key={r.name} style={{ border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 16px",
                  opacity: ringsIn ? 1 : 0, transform: ringsIn ? "none" : "translateY(8px)",
                  transition: animate ? `opacity 240ms ${EASE} ${i * 120}ms, transform 240ms ${EASE} ${i * 120}ms` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{r.name}</span>
                    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                      <DS.Badge tone="neutral" pill>{r.cadence}</DS.Badge>
                      {i === 0 ? (
                        <DS.Badge tone="brand" pill>
                          <span className="pf-tnum">11 live measures{ownersReady && unassigned.length > 0 ? ` · ${unassigned.length} unowned` : ""}</span>
                        </DS.Badge>
                      ) : (
                        <DS.Badge tone={ownedCount ? "brand" : "neutral"} pill>
                          <span className="pf-tnum">{ownedCount} {ownedCount === 1 ? "measure" : "measures"} owned</span>
                        </DS.Badge>
                      )}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 6 }}>{r.body}</p>
                </div>
              );
            })}
          </div>
        </div>
        <p style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {RINGS_FOOTER}
        </p>
      </DS.Card>

      {/* Assign-owner modal */}
      <DS.Modal open={assigning != null} onClose={() => setAssigning(null)} title="Assign owner" size="sm"
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <DS.Button variant="ghost" onClick={() => setAssigning(null)}>Cancel</DS.Button>
            <DS.Button variant="primary" disabled={!formName.trim()} onClick={confirmAssign}>Assign</DS.Button>
          </div>
        }>
        {assigning && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {METRICS.find((m) => m.id === assigning)?.metric} — every measure belongs to one named person in one ring.
            </div>
            <DS.FormField label="Person" required>
              <DS.Input placeholder="Name" value={formName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)} />
            </DS.FormField>
            <DS.FormField label="Role" hint="e.g. CISO, Finance Director, External auditor">
              <DS.Input placeholder="Role" value={formRole} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormRole(e.target.value)} />
            </DS.FormField>
            <DS.FormField label="Ring">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[1, 2, 3].map((r) => (
                  <DS.Radio key={r} name="pf-ring" label={RING_SHORT[r]} description={RINGS_COPY[r].cadence}
                    checked={formRing === r} onChange={() => setFormRing(r as 1 | 2 | 3)} />
                ))}
              </div>
            </DS.FormField>
          </div>
        )}
      </DS.Modal>
    </div>
  );
}
