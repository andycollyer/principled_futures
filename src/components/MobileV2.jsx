"use client";
import React from "react";
import { ScoreGauge } from "./data/ScoreGauge";

/* Principled Futures — Mobile v2
   Faithful port of "Principled Futures Mobile v2.dc.html" (Claude Design).

   v2 status system — colour is an exception signal, not decoration.
     within  → no colour at all (ink only, no left rule)
     watch   → amber TYPE + hairline amber rule
     breach  → brick TYPE + 3px brick rule                            */
const TONE = {
  success: { color: "var(--ink-500)", rule: "transparent", label: "Within", strong: "var(--ink-900)" },
  warning: { color: "var(--status-warning)", rule: "var(--status-warning)", label: "Watch", strong: "var(--status-warning)" },
  danger: { color: "var(--status-danger)", rule: "var(--status-danger)", label: "Breach", strong: "var(--status-danger)" },
};

const METRICS = [
  { id: "scaling", cat: "Strategy & ROI", metric: "Scaling Status", value: "42", unit: "%", threshold: "> 40% scaled", owner: "CEO / CAIO", freq: "Quarterly", tone: "success", spark: [28, 31, 34, 33, 38, 40, 42], note: "Scaled deployments now exceed the 40% board threshold — the pacing problem is narrowing." },
  { id: "roi", cat: "Strategy & ROI", metric: "Realised ROI", value: "1.3", unit: "x", threshold: "> 1.0x yield", owner: "CFO", freq: "Quarterly", tone: "success", spark: [0.9, 1.0, 1.05, 1.1, 1.2, 1.25, 1.3], note: "Realised yield is ahead of the business case for the third consecutive quarter." },
  { id: "drift", cat: "Model Health", metric: "Model Drift", value: "1.4", unit: "%", threshold: "< 2% deviation", owner: "CTO / Data Science", freq: "Real-time", tone: "success", note: "Deviation remains inside tolerance; retraining cadence is unchanged.", spark: [1.1, 1.0, 1.3, 1.2, 1.5, 1.3, 1.4] },
  { id: "bias", cat: "Ethics & Fairness", metric: "Bias / Disparate Impact", value: "1.31", unit: "", threshold: "0.8 – 1.25 parity", owner: "Ethics Officer / CHRO", freq: "Monthly", tone: "warning", spark: [1.1, 1.15, 1.2, 1.22, 1.26, 1.29, 1.31], note: "The disparate-impact ratio has drifted outside the parity band on a customer-facing model, with no documented remediation playbook." },
  { id: "explain", cat: "Ethics & Fairness", metric: "Explainability Score", value: "96", unit: "%", threshold: "100% high-risk", owner: "CLO / Compliance", freq: "Monthly", tone: "warning", spark: [88, 90, 91, 93, 94, 95, 96], note: "Coverage is improving but falls short of the full high-risk estate required under EU AI Act Article 13." },
  { id: "halluc", cat: "Ethics & Fairness", metric: "Hallucination Rate", value: "0.7", unit: "%", threshold: "< 1% occurrence", owner: "Product Owner", freq: "Weekly", tone: "success", spark: [1.2, 1.0, 0.9, 0.95, 0.8, 0.75, 0.7], note: "Occurrence has fallen steadily since grounding was introduced." },
  { id: "shadow", cat: "Security & Resilience", metric: "Shadow AI Detection", value: "3", unit: "", threshold: "0 (zero tolerance)", owner: "CISO", freq: "Monthly scans", tone: "danger", spark: [0, 1, 1, 2, 2, 3, 3], note: "Three unsanctioned tools were detected against a zero-tolerance policy, with no DLP controls on data entering public models. This is the board's most urgent exposure." },
  { id: "killswitch", cat: "Security & Resilience", metric: "Kill-Switch Readiness", value: "Active", unit: "", threshold: "100% tested", owner: "CISO & CTO", freq: "Weekly", tone: "success", spark: [1, 1, 1, 1, 1, 1, 1], note: "Dual-authorisation containment was last exercised seven days ago." },
  { id: "speakup", cat: "Workforce & Culture", metric: "Speak-Up Resolution", value: "100", unit: "%", threshold: "100% escalated", owner: "CHRO / Ethics Cttee", freq: "Monthly", tone: "success", spark: [82, 88, 90, 94, 96, 99, 100], note: "Every raised concern has been escalated and closed within the published service level." },
  { id: "regready", cat: "Compliance", metric: "Regulatory Readiness", value: "Audit-ready", unit: "", threshold: "EU AI Act Art. 12/14", owner: "CCO", freq: "Monthly", tone: "success", spark: [1, 1, 1, 1, 1, 1, 1], note: "Logging and human-oversight evidence is current and independently reviewable." },
  { id: "carbon", cat: "Environmental / ESG", metric: "AI Carbon Footprint", value: "Within", unit: "", threshold: "Within ESG cap", owner: "Sustainability Lead", freq: "Quarterly", tone: "success", spark: [1, 1, 1, 1, 1, 1, 1], note: "Green AI consumption sits inside the ESG cap disclosed to investors." },
];

const CATEGORIES = [
  { title: "AI Governance & Oversight", short: "Governance", score: 78, done: 8, band: "Established", tone: "success" },
  { title: "Ethics & Fairness", short: "Ethics", score: 64, done: 8, band: "Established", tone: "success" },
  { title: "Security & Resilience", short: "Security", score: 38, done: 5, band: "Critical", tone: "danger" },
  { title: "Model Health & Data", short: "Model health", score: 71, done: 0, band: "Established", tone: "success" },
  { title: "Regulatory & 3rd-Party", short: "Regulatory", score: 82, done: 0, band: "Leading", tone: "success" },
  { title: "Strategy, Value & ROI", short: "Strategy", score: 69, done: 0, band: "Established", tone: "success" },
  { title: "Workforce & Culture", short: "Workforce", score: 59, done: 0, band: "Developing", tone: "warning" },
  { title: "Environmental & Social", short: "Environmental", score: 74, done: 0, band: "Established", tone: "success" },
];

const HEATMAP = [
  { label: "Strategy & ROI", tone: "success" },
  { label: "Model Health", tone: "success" },
  { label: "Ethics & Fairness", tone: "warning" },
  { label: "Security & Resilience", tone: "danger" },
  { label: "Workforce & Culture", tone: "success" },
  { label: "Compliance & 3rd-Party", tone: "success" },
  { label: "Green AI", tone: "success" },
];

const KEY_FIGURES = [
  { label: "Scaling status", note: "vs last quarter", value: "42%", delta: "+6", tone: "success" },
  { label: "Realised ROI", note: "vs business case", value: "1.3x", delta: "+0.2", tone: "success" },
  { label: "Shadow AI detections", note: "zero-tolerance policy", value: "3", delta: "+2", tone: "danger" },
  { label: "Kill-switch readiness", note: "tested weekly", value: "Active", delta: "—", tone: "success" },
];

const SCALE = [
  { level: 0, label: "Absent", detail: "No awareness or action." },
  { level: 1, label: "Ad hoc", detail: "Reactive, informal, undocumented." },
  { level: 2, label: "Defined", detail: "Documented, but inconsistently applied." },
  { level: 3, label: "Managed", detail: "Consistently applied and monitored." },
  { level: 4, label: "Leading", detail: "Optimised, benchmarked, board-assured." },
];

const RISKS = [
  { sev: "danger", title: "Shadow AI is uncontrolled", body: "Three unsanctioned tools detected against a zero-tolerance policy. No DLP controls on data entering public models.", owner: "CISO", band: "Critical" },
  { sev: "warning", title: "Bias ratio outside tolerance", body: "Disparate-impact ratio of 1.31 exceeds the 0.8–1.25 band on a customer-facing model with no documented remediation playbook.", owner: "Ethics Officer", band: "Watch" },
  { sev: "warning", title: "Workforce literacy lagging", body: "Role-based AI literacy training sits at 59% completion; speak-up resolution is consistent but reskilling is unfunded.", owner: "CHRO", band: "Watch" },
];

const BREAKDOWN = [
  { title: "AI Governance & Oversight", score: 78, band: "Established", tone: "success", trend: "+6" },
  { title: "Ethics & Fairness", score: 64, band: "Established", tone: "success", trend: "+2" },
  { title: "Security & Resilience", score: 38, band: "Critical", tone: "danger", trend: "-4" },
  { title: "Model Health & Data", score: 71, band: "Established", tone: "success", trend: "+3" },
  { title: "Regulatory & 3rd-Party", score: 82, band: "Leading", tone: "success", trend: "+5" },
  { title: "Strategy, Value & ROI", score: 69, band: "Established", tone: "success", trend: "+8" },
  { title: "Workforce & Culture", score: 59, band: "Developing", tone: "warning", trend: "+1" },
  { title: "Environmental & Social", score: 74, band: "Established", tone: "success", trend: "+4" },
];

const BENCH = [["Your organisation", 67, true], ["Sector median", 54, false], ["Top quartile", 81, false]];

const ROADMAP = [
  { h: "0–30 days", t: "Stand up Shadow-AI detection & DLP", b: "Deploy monitoring for unsanctioned tools and block PII/IP entering public models.", owner: "CISO" },
  { h: "30–90 days", t: "Establish a fairness remediation gate", b: "Set quantitative thresholds, document a playbook, and add a pre-deployment ethics review.", owner: "Ethics Officer" },
  { h: "90–180 days", t: "Fund role-based reskilling", b: "Close the literacy gap with a tracked programme and an augmentation-first narrative.", owner: "CHRO" },
];

const SOURCES = ["OECD AI Principles", "EU AI Act (Art. 12)", "UNESCO AI Ethics", "Gartner AI Maturity", "PwC 2025 Responsible AI", "ISS STOXX Governance Gap", "Diligent Boards & AI", "IoD / ICAEW"];

const RULE = "1px solid var(--ink-200)";

function sparkPoints(points, w, h, pad) {
  const max = Math.max.apply(null, points);
  const min = Math.min.apply(null, points);
  const span = max - min || 1;
  const step = points.length > 1 ? w / (points.length - 1) : 0;
  const xs = points.map((p, i) => [i * step, h - ((p - min) / span) * (h - pad * 2) - pad]);
  return { d: xs.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" "), cx: xs[xs.length - 1][0], cy: xs[xs.length - 1][1] };
}

function reportBody(n) {
  if (n === 1)
    return (
      <div>
        {RISKS.map((r, i) => (
          <div key={r.title} style={{ paddingLeft: 13, borderLeft: "3px solid var(--status-" + r.sev + ")", paddingBottom: 14, paddingTop: i === 0 ? 2 : 14, borderTop: i === 0 ? "none" : RULE }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)", margin: 0, lineHeight: 1.3 }}>{r.title}</h3>
              <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: TONE[r.sev].strong }}>{r.band}</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-500)", lineHeight: 1.6, margin: "6px 0 0" }}>{r.body}</p>
            <div style={{ fontSize: 11.5, color: "var(--ink-400)", marginTop: 8 }}>
              Accountable owner: <strong style={{ color: "var(--ink-900)", fontWeight: 600 }}>{r.owner}</strong>
            </div>
          </div>
        ))}
      </div>
    );

  if (n === 2)
    return (
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, paddingBottom: 7, borderBottom: "1px solid var(--ink-300)" }}>
          <span style={{ flex: 1, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Category</span>
          <span style={{ width: 32, textAlign: "right", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Score</span>
          <span style={{ width: 74, textAlign: "right", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Band</span>
          <span style={{ width: 30, textAlign: "right", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Δ</span>
        </div>
        {BREAKDOWN.map((c) => (
          <div key={c.title} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "11px 0", borderBottom: RULE }}>
            <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 500, color: "var(--ink-900)", lineHeight: 1.3 }}>{c.title}</span>
            <span className="pf-tnum" style={{ width: 32, textAlign: "right", fontSize: 14, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.02em" }}>{c.score}</span>
            <span style={{ width: 74, textAlign: "right", fontSize: 11.5, fontWeight: 500, color: TONE[c.tone].color }}>{c.band}</span>
            <span className="pf-tnum" style={{ width: 30, textAlign: "right", fontSize: 12.5, fontWeight: 500, color: c.trend.charAt(0) === "-" ? "var(--status-danger)" : "var(--ink-500)" }}>{c.trend}</span>
          </div>
        ))}
      </div>
    );

  if (n === 3)
    return (
      <div>
        {BENCH.map(([label, val, mine]) => (
          <div key={label} style={{ padding: "12px 0", borderBottom: RULE }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: mine ? 600 : 500, color: mine ? "var(--ink-900)" : "var(--ink-500)" }}>{label}</span>
              <span className="pf-tnum" style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.02em" }}>{val}</span>
            </div>
            <div style={{ height: 3, background: "var(--ink-200)", position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: val + "%", background: mine ? "var(--green-600)" : "var(--ink-400)" }} />
            </div>
          </div>
        ))}
        <p style={{ fontSize: 12.5, color: "var(--ink-400)", lineHeight: 1.6, margin: "12px 0 0" }}>Acme leads the sector median by 13 points but trails the top quartile — the gap is almost entirely the security category.</p>
      </div>
    );

  if (n === 4)
    return (
      <div>
        {ROADMAP.map((r) => (
          <div key={r.t} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: RULE }}>
            <span className="pf-tnum" style={{ flexShrink: 0, width: 74, fontSize: 11.5, fontWeight: 600, color: "var(--ink-400)", paddingTop: 2 }}>{r.h}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)", margin: 0, lineHeight: 1.3 }}>{r.t}</h3>
              <p style={{ fontSize: 12.5, color: "var(--ink-500)", lineHeight: 1.6, margin: "5px 0 0" }}>{r.b}</p>
              <div style={{ fontSize: 11.5, color: "var(--ink-400)", marginTop: 7 }}>
                Owner: <strong style={{ color: "var(--ink-900)", fontWeight: 600 }}>{r.owner}</strong>
              </div>
            </span>
          </div>
        ))}
      </div>
    );

  return (
    <div>
      <div>
        {SOURCES.map((s, i) => (
          <div key={s} style={{ fontSize: 12.5, color: "var(--ink-900)", padding: "9px 0", borderBottom: RULE, borderTop: i === 0 ? "1px solid var(--ink-300)" : "none" }}>{s}</div>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: "var(--ink-400)", lineHeight: 1.6, margin: "14px 0 0" }}>Scores derive from the 8×8 framework (64 board-level dimensions, 0–4 maturity scale), weighted by your stated priorities and mapped to the eleven telemetry categories for continuous oversight.</p>
    </div>
  );
}

function Icon({ path, size = 17, sw = 1.6 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
}

export function MobileV2() {
  const [tab, setTab] = React.useState("overview");
  const [sheet, setSheet] = React.useState(null);
  const [alertOpen, setAlertOpen] = React.useState(true);
  const [actionAssigned, setActionAssigned] = React.useState(false);
  const [lastSync, setLastSync] = React.useState("2h ago");
  const [pull, setPull] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [activeCat, setActiveCat] = React.useState(2);
  const [answer, setAnswer] = React.useState(2);
  const [qIndex, setQIndex] = React.useState(6);
  const [openSection, setOpenSection] = React.useState(1);

  const scrollerRef = React.useRef(null);
  const startYRef = React.useRef(null);
  const timerRef = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const changeTab = (t) => { setTab(t); setSheet(null); };
  const assign = () => { setSheet(null); setActionAssigned(true); setAlertOpen(false); setTab("overview"); };

  const onPullStart = (ev) => {
    const el = scrollerRef.current;
    if (!el || el.scrollTop > 0 || refreshing) return;
    startYRef.current = ev.clientY;
    setDragging(true);
  };
  const onPullMove = (ev) => {
    if (!dragging || startYRef.current == null) return;
    const dy = ev.clientY - startYRef.current;
    if (dy <= 0) { if (pull !== 0) setPull(0); return; }
    setPull(Math.min(dy * 0.45, 76));
  };
  const onPullEnd = () => {
    if (!dragging) return;
    startYRef.current = null;
    if (pull > 44) {
      setDragging(false);
      setRefreshing(true);
      setPull(48);
      timerRef.current = setTimeout(() => { setRefreshing(false); setPull(0); setLastSync("just now"); }, 1400);
    } else {
      setDragging(false);
      setPull(0);
    }
  };

  const overallScore = 72;
  const on = "var(--green-700)";
  const off = "var(--ink-400)";
  const uOn = "inset 0 2px 0 0 var(--green-600)";
  const uOff = "none";
  const counts = METRICS.reduce((a, m) => ((a[m.tone]++, a)), { success: 0, warning: 0, danger: 0 });
  const answeredCount = CATEGORIES.reduce((n, c) => n + c.done, 0);
  const answeredPct = Math.round((answeredCount / 64) * 100) + "%";
  const sheetM = sheet ? METRICS.find((m) => m.id === sheet) : null;
  const sheetSpark = sheetM ? sparkPoints(sheetM.spark, 320, 76, 6) : null;

  const sections = [
    { n: 1, title: "Priority risk areas", sub: "Ranked by severity and board exposure" },
    { n: 2, title: "Category breakdown", sub: "The 8×8 framework, scored 0–100" },
    { n: 3, title: "Peer benchmark", sub: "vs Financial Services, mid-market" },
    { n: 4, title: "Recommended roadmap", sub: "Sequenced by horizon, each with an owner" },
    { n: 5, title: "Methodology & sources", sub: "Grounded in recognised frameworks" },
  ];

  const alertShown = alertOpen && !actionAssigned;

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", background: "#e7e9ea", fontFamily: "var(--font-sans)" }}>
      <div style={{ width: 420, maxWidth: "100%", height: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--surface-canvas)", borderLeft: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)" }}>

        {/* Header */}
        <header style={{ flexShrink: 0, height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: "var(--surface-card)", borderBottom: "1px solid var(--ink-300)", zIndex: 20 }}>
          <svg width="24" height="24" viewBox="0 0 64 64" fill="none" role="img" aria-label="Principled Futures" style={{ flexShrink: 0 }}>
            <circle cx="32" cy="32" r="30" fill="#20521A" />
            <path d="M32 12 L44 32 L32 52 L20 32 Z" fill="#ffffff" />
            <path d="M32 12 L44 32 L32 32 Z" fill="#20521A" fillOpacity="0.28" />
          </svg>
          <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.014em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Principled Futures</span>
          <button aria-label="Notifications" style={{ width: 30, height: 30, display: "grid", placeItems: "center", border: "none", background: "transparent", color: "var(--ink-500)", cursor: "pointer" }}>
            <Icon path={<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>} />
          </button>
          <span style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid var(--ink-300)", color: "var(--ink-900)", display: "grid", placeItems: "center", fontSize: 11.5, fontWeight: 600, flexShrink: 0 }}>A</span>
        </header>

        {/* Org bar */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, padding: "9px 18px 10px", background: "var(--surface-card)", borderBottom: "1px solid var(--ink-300)" }}>
          <span style={{ fontSize: 12.5, color: "var(--ink-900)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Acme Holdings PLC</span>
          <span style={{ fontSize: 11.5, color: "var(--ink-400)", whiteSpace: "nowrap", letterSpacing: "0.01em" }}>Synced {lastSync}</span>
        </div>

        {/* Scroll area */}
        <div
          className="pf-scroll"
          ref={scrollerRef}
          onPointerDown={onPullStart}
          onPointerMove={onPullMove}
          onPointerUp={onPullEnd}
          onPointerCancel={onPullEnd}
          style={{ flex: 1, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
        >
          {/* Pull-to-refresh indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", height: (refreshing ? 48 : pull) + "px", transition: dragging ? "none" : "height .24s cubic-bezier(0.16,1,0.3,1)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 500, color: "var(--ink-400)", letterSpacing: "0.02em" }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ animation: refreshing ? "pf-spin .8s linear infinite" : "none" }}>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" />
              </svg>
              {refreshing ? "Syncing telemetry" : pull > 44 ? "Release to sync" : "Pull to sync"}
            </span>
          </div>

          {/* ---------- Overview ---------- */}
          {tab === "overview" && (
            <div style={{ padding: "20px 0 96px" }}>
              <div style={{ padding: "0 18px 18px" }}>
                <h1 style={{ fontSize: 21, fontWeight: 700, color: "var(--ink-900)", margin: 0, letterSpacing: "-0.022em" }}>Governance overview</h1>
                <p style={{ fontSize: 13, color: "var(--ink-500)", margin: "5px 0 0", lineHeight: 1.5 }}>Continuous oversight for Acme Holdings PLC.</p>
              </div>

              <div style={{ background: "var(--surface-card)", borderTop: "1px solid var(--ink-300)", borderBottom: "1px solid var(--ink-300)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 18px 20px" }}>
                  <ScoreGauge score={overallScore} size={132} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Overall</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ink-900)", marginTop: 4, letterSpacing: "-0.022em" }}>Established</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 6, lineHeight: 1.5 }}>Up 6 points this quarter.<br />8 categories · 64 dimensions</div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--ink-200)" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "9px 18px 8px", borderBottom: "1px solid var(--ink-200)" }}>
                    <span style={{ flex: 1, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Key figures</span>
                    <span style={{ width: 62, textAlign: "right", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Value</span>
                    <span style={{ width: 52, textAlign: "right", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Δ</span>
                  </div>
                  {KEY_FIGURES.map((k) => (
                    <div key={k.label} style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--ink-200)" }}>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "var(--ink-900)", lineHeight: 1.3 }}>{k.label}</span>
                        <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-400)", marginTop: 2 }}>{k.note}</span>
                      </span>
                      <span className="pf-tnum" style={{ width: 62, textAlign: "right", fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", color: k.tone === "danger" ? "var(--status-danger)" : "var(--ink-900)" }}>{k.value}</span>
                      <span className="pf-tnum" style={{ width: 52, textAlign: "right", fontSize: 12.5, fontWeight: 500, color: k.tone === "danger" ? "var(--status-danger)" : "var(--ink-400)" }}>{k.delta}</span>
                    </div>
                  ))}
                </div>
              </div>

              {alertShown && (
                <div style={{ margin: "18px 18px 0", background: "var(--surface-card)", border: "1px solid var(--ink-300)", borderLeft: "3px solid var(--status-danger)", padding: "16px 16px 14px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--status-danger)" }}>Breach</span>
                    <span style={{ fontSize: 11.5, color: "var(--ink-400)" }}>Raised 3 days ago</span>
                  </div>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", margin: "8px 0 0", letterSpacing: "-0.012em", lineHeight: 1.35 }}>Shadow AI threshold breached</h2>
                  <p style={{ fontSize: 13, color: "var(--ink-500)", lineHeight: 1.6, margin: "6px 0 0", textWrap: "pretty" }}>Three unsanctioned AI tools were detected this month against a zero-tolerance policy. Accountable owner: CISO.</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 14, paddingTop: 13, borderTop: "1px solid var(--ink-200)" }}>
                    <button onClick={() => { setTab("telemetry"); setSheet("shadow"); }} style={{ display: "inline-flex", alignItems: "center", gap: 7, border: "none", background: "transparent", padding: "6px 0", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-900)", cursor: "pointer", minHeight: 36 }}>
                      Review breach
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                    </button>
                    <button onClick={() => setAlertOpen(false)} style={{ border: "none", background: "transparent", padding: "6px 0", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--ink-400)", cursor: "pointer", minHeight: 36 }}>Dismiss</button>
                  </div>
                </div>
              )}

              {actionAssigned && (
                <div style={{ margin: "18px 18px 0", background: "var(--surface-card)", border: "1px solid var(--ink-300)", borderLeft: "3px solid var(--green-600)", padding: 16 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--green-700)" }}>Assigned</span>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", margin: "8px 0 0", letterSpacing: "-0.012em" }}>Action assigned to the CISO</h2>
                  <p style={{ fontSize: 13, color: "var(--ink-500)", lineHeight: 1.6, margin: "6px 0 0" }}>Shadow AI remediation is due within 14 days and will appear in the next board pack.</p>
                </div>
              )}

              <div style={{ marginTop: 22, background: "var(--surface-card)", borderTop: "1px solid var(--ink-300)", borderBottom: "1px solid var(--ink-300)" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, padding: "15px 18px 12px", borderBottom: "1px solid var(--ink-300)" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>Category maturity</span>
                  <span style={{ fontSize: 11.5, color: "var(--ink-400)" }}>8×8 framework</span>
                </div>
                {CATEGORIES.map((c) => {
                  const barColor = c.tone === "danger" ? "var(--status-danger)" : c.tone === "warning" ? "var(--status-warning)" : "var(--ink-900)";
                  return (
                    <button key={c.title} onClick={() => changeTab("report")} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "12px 18px 12px 15px", background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", minHeight: 52, border: "none", borderBottom: "1px solid var(--ink-200)", borderLeft: "3px solid " + TONE[c.tone].rule }}>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: 13.5, fontWeight: 500, color: "var(--ink-900)", lineHeight: 1.3 }}>{c.title}</span>
                        <span style={{ display: "block", fontSize: 11.5, marginTop: 3, color: TONE[c.tone].color }}>{c.band}</span>
                      </span>
                      <span style={{ width: 70, flexShrink: 0, height: 3, background: "var(--ink-200)", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: barColor, width: c.score + "%" }} />
                      </span>
                      <span className="pf-tnum" style={{ width: 24, textAlign: "right", fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)", flexShrink: 0, letterSpacing: "-0.02em" }}>{c.score}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------- Assessment ---------- */}
          {tab === "assessment" && (
            <div style={{ padding: "20px 0 96px" }}>
              <div style={{ padding: "0 18px 16px" }}>
                <h1 style={{ fontSize: 21, fontWeight: 700, color: "var(--ink-900)", margin: 0, letterSpacing: "-0.022em" }}>Situational assessment</h1>
                <p style={{ fontSize: 13, color: "var(--ink-500)", margin: "5px 0 0", lineHeight: 1.5 }}>64 board-level dimensions across ESG performance and Ethical AI. Autosaved as you go.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
                  <span style={{ flex: 1, height: 3, background: "var(--ink-200)", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: "var(--green-600)", width: answeredPct }} />
                  </span>
                  <span className="pf-tnum" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)", whiteSpace: "nowrap" }}>{answeredCount} / 64</span>
                </div>
              </div>

              <div className="pf-scroll" style={{ display: "flex", gap: 0, overflowX: "auto", background: "var(--surface-card)", borderTop: "1px solid var(--ink-300)", borderBottom: "1px solid var(--ink-300)" }}>
                {CATEGORIES.map((c, i) => {
                  const sel = i === activeCat;
                  return (
                    <button key={c.title} onClick={() => setActiveCat(i)} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3, padding: "11px 16px 10px", cursor: "pointer", fontFamily: "var(--font-sans)", whiteSpace: "nowrap", minHeight: 52, background: "transparent", border: "none", borderRight: "1px solid var(--ink-200)", borderBottom: "2px solid " + (sel ? "var(--green-600)" : "transparent") }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: sel ? "var(--ink-900)" : "var(--ink-500)" }}>{c.short}</span>
                      <span className="pf-tnum" style={{ fontSize: 11, color: "var(--ink-400)" }}>{c.done} / 8</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ background: "var(--surface-card)", borderBottom: "1px solid var(--ink-300)", padding: "20px 18px 22px", marginTop: 18, borderTop: "1px solid var(--ink-300)" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>{"Category " + (activeCat + 1) + " · Question " + qIndex + " of 8"}</span>
                  <span style={{ fontSize: 11.5, color: "var(--ink-400)" }}>Ethical AI</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.38, margin: "12px 0 10px", letterSpacing: "-0.014em", textWrap: "pretty" }}>Is there a tested kill-switch or containment capability, with dual-authorisation, to halt a harmful AI system?</h2>
                <p style={{ fontSize: 13, color: "var(--ink-500)", lineHeight: 1.6, margin: "0 0 20px", paddingLeft: 12, borderLeft: "2px solid var(--ink-200)", textWrap: "pretty" }}>
                  <strong style={{ color: "var(--ink-900)", fontWeight: 600 }}>Leading looks like:</strong> a tested kill-switch with dual authorisation (e.g. CISO/CTO) and defined trigger criteria, part of the incident-response playbook.
                </p>

                <div style={{ borderTop: "1px solid var(--ink-300)" }}>
                  {SCALE.map((o) => {
                    const sel = o.level === answer;
                    return (
                      <button key={o.level} onClick={() => setAnswer(o.level)} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "13px 14px 13px 12px", cursor: "pointer", textAlign: "left", width: "100%", fontFamily: "var(--font-sans)", minHeight: 56, background: sel ? "var(--ink-50)" : "transparent", border: "none", borderBottom: "1px solid var(--ink-200)", borderLeft: "3px solid " + (sel ? "var(--green-600)" : "transparent") }}>
                        <span className="pf-tnum" style={{ width: 20, flexShrink: 0, fontSize: 13, fontWeight: 700, color: sel ? "var(--green-700)" : "var(--ink-400)", paddingTop: 1 }}>{o.level}</span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>{o.label}</span>
                          <span style={{ display: "block", fontSize: 12.5, color: "var(--ink-500)", marginTop: 2, lineHeight: 1.45 }}>{o.detail}</span>
                        </span>
                        <span style={{ flexShrink: 0, paddingTop: 2, color: sel ? "var(--green-600)" : "transparent" }}>
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
                  <button onClick={() => setQIndex(Math.max(1, qIndex - 1))} style={{ flex: 1, border: "1px solid var(--ink-300)", borderRadius: 4, background: "var(--surface-card)", color: "var(--ink-500)", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500, padding: 12, cursor: "pointer", minHeight: 48 }}>Previous</button>
                  <button onClick={() => setQIndex(Math.min(8, qIndex + 1))} style={{ flex: 1.4, border: "none", borderRadius: 4, background: "var(--ink-900)", color: "#fff", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, padding: 12, cursor: "pointer", minHeight: 48 }}>Next question</button>
                </div>
              </div>
            </div>
          )}

          {/* ---------- Report ---------- */}
          {tab === "report" && (
            <div style={{ padding: "20px 0 96px" }}>
              <div style={{ padding: "0 18px 16px" }}>
                <h1 style={{ fontSize: 21, fontWeight: 700, color: "var(--ink-900)", margin: 0, letterSpacing: "-0.022em" }}>Advisory Report — Q1 2026</h1>
                <p style={{ fontSize: 12.5, color: "var(--ink-400)", margin: "5px 0 0" }}>Acme Holdings PLC · generated 14 March 2026</p>
                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  <button style={{ flex: 1, border: "1px solid var(--ink-300)", borderRadius: 4, background: "var(--surface-card)", color: "var(--ink-900)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, padding: 11, cursor: "pointer", minHeight: 46 }}>Download PDF</button>
                  <button style={{ flex: 1, border: "none", borderRadius: 4, background: "var(--ink-900)", color: "#fff", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, padding: 11, cursor: "pointer", minHeight: 46 }}>Share with board</button>
                </div>
              </div>

              <div style={{ background: "var(--surface-card)", borderTop: "1px solid var(--ink-300)", borderBottom: "1px solid var(--ink-300)", padding: "22px 18px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <ScoreGauge score={67} size={132} />
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Executive summary</div>
                    <div className="pf-tnum" style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 8, lineHeight: 1.5 }}>67 / 100<br />Established<br />+6 q-o-q</div>
                  </div>
                </div>
                <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--ink-900)", margin: "20px 0 0", lineHeight: 1.3, letterSpacing: "-0.022em", textWrap: "pretty" }}>An established governance posture, undermined by a critical security gap.</h2>
                <p style={{ fontSize: 13.5, color: "var(--ink-500)", lineHeight: 1.65, margin: "10px 0 0", textWrap: "pretty" }}>Acme scores <strong style={{ color: "var(--ink-900)", fontWeight: 600 }}>67/100 (Established)</strong>, up six points this quarter. Governance, compliance and strategy are strengths. The board’s most urgent exposure is uncontrolled Shadow AI in Security &amp; Resilience — a potential balance-sheet event that should be remediated before the next meeting.</p>
              </div>

              <div style={{ marginTop: 18, background: "var(--surface-card)", borderTop: "1px solid var(--ink-300)" }}>
                {sections.map((sec) => {
                  const open = openSection === sec.n;
                  return (
                    <div key={sec.n} style={{ borderBottom: "1px solid var(--ink-300)" }}>
                      <button onClick={() => setOpenSection(open ? null : sec.n)} style={{ display: "flex", alignItems: "flex-start", gap: 14, width: "100%", padding: "16px 18px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", minHeight: 56 }}>
                        <span className="pf-tnum" style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-400)", flexShrink: 0, paddingTop: 2, width: 14 }}>{sec.n}</span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>{sec.title}</span>
                          <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-400)", marginTop: 3, lineHeight: 1.4 }}>{sec.sub}</span>
                        </span>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--ink-400)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .16s cubic-bezier(0.16,1,0.3,1)" }}><path d="m6 9 6 6 6-6" /></svg>
                      </button>
                      {open && <div style={{ padding: "0 18px 20px" }}>{reportBody(sec.n)}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------- Telemetry ---------- */}
          {tab === "telemetry" && (
            <div style={{ padding: "20px 0 96px" }}>
              <div style={{ padding: "0 18px 18px" }}>
                <h1 style={{ fontSize: 21, fontWeight: 700, color: "var(--ink-900)", margin: 0, letterSpacing: "-0.022em" }}>Telemetry</h1>
                <p style={{ fontSize: 13, color: "var(--ink-500)", margin: "5px 0 0", lineHeight: 1.5 }}>Continuous oversight for the agentic era — point-in-time audits replaced by a live register.</p>
              </div>

              <div style={{ background: "var(--surface-card)", borderTop: "1px solid var(--ink-300)", borderBottom: "1px solid var(--ink-300)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 18px" }}>
                  <ScoreGauge score={overallScore} size={132} />
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Posture</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ink-900)", marginTop: 4, letterSpacing: "-0.022em" }}>Established</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 6, lineHeight: 1.5 }}>11 metrics<br />4 accountability tiers</div>
                  </div>
                </div>
                <div style={{ display: "flex", borderTop: "1px solid var(--ink-200)" }}>
                  {[
                    { n: counts.success, label: "Within threshold", color: "var(--ink-900)" },
                    { n: counts.warning, label: "On watch", color: "var(--status-warning)" },
                    { n: counts.danger, label: "Breached", color: "var(--status-danger)" },
                  ].map((p) => (
                    <div key={p.label} style={{ flex: 1, padding: "13px 16px 14px", borderRight: "1px solid var(--ink-200)" }}>
                      <span className="pf-tnum" style={{ display: "block", fontSize: 21, fontWeight: 700, letterSpacing: "-0.024em", lineHeight: 1, color: p.color }}>{p.n}</span>
                      <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-400)", marginTop: 6, lineHeight: 1.3 }}>{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 22, background: "var(--surface-card)", borderTop: "1px solid var(--ink-300)", borderBottom: "1px solid var(--ink-300)" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, padding: "15px 18px 12px", borderBottom: "1px solid var(--ink-300)" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>Category posture</span>
                  <span style={{ fontSize: 11.5, color: "var(--ink-400)" }}>Seven categories</span>
                </div>
                {HEATMAP.map((h) => (
                  <div key={h.label} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, padding: "12px 18px 12px 15px", borderBottom: "1px solid var(--ink-200)", borderLeft: "3px solid " + TONE[h.tone].rule }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink-900)" }}>{h.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: TONE[h.tone].color, whiteSpace: "nowrap" }}>{TONE[h.tone].label}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 22, background: "var(--surface-card)", borderTop: "1px solid var(--ink-300)", borderBottom: "1px solid var(--ink-300)" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, padding: "15px 18px 12px", borderBottom: "1px solid var(--ink-300)" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>Metric register</span>
                  <span style={{ fontSize: 11.5, color: "var(--ink-400)" }}>Live · 11 metrics</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "8px 18px 8px 15px", borderBottom: "1px solid var(--ink-300)", background: "var(--ink-50)" }}>
                  <span style={{ flex: 1, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Metric</span>
                  <span style={{ width: 68, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Trend</span>
                  <span style={{ width: 80, textAlign: "right", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Value</span>
                </div>
                {METRICS.map((m) => {
                  const sp = sparkPoints(m.spark, 68, 22, 3);
                  const numeric = !isNaN(parseFloat(m.value));
                  return (
                    <button key={m.id} onClick={() => setSheet(m.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", fontFamily: "var(--font-sans)", background: "transparent", cursor: "pointer", padding: "13px 18px 13px 15px", minHeight: 62, border: "none", borderBottom: "1px solid var(--ink-200)", borderLeft: "3px solid " + TONE[m.tone].rule }}>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.3 }}>{m.metric}</span>
                        <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-400)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.owner} · {m.freq}</span>
                      </span>
                      <svg width="68" height="22" viewBox="0 0 68 22" fill="none" style={{ flexShrink: 0 }}>
                        <polyline points={sp.d} stroke="var(--ink-300)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx={sp.cx} cy={sp.cy} r="2" fill={m.tone === "success" ? "var(--ink-900)" : TONE[m.tone].strong} />
                      </svg>
                      <span style={{ width: 80, flexShrink: 0, textAlign: "right" }}>
                        <span className="pf-tnum" style={{ display: "block", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--ink-900)", whiteSpace: "nowrap", fontSize: numeric ? 17 : 13 }}>{m.value + m.unit}</span>
                        <span style={{ display: "block", fontSize: 11, marginTop: 3, color: TONE[m.tone].color }}>{TONE[m.tone].label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <nav style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "var(--surface-card)", borderTop: "1px solid var(--ink-300)", paddingBottom: 6, zIndex: 20 }}>
          {[
            { id: "overview", label: "Overview", path: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></> },
            { id: "assessment", label: "Assessment", path: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="3.5" cy="6" r="1" /><circle cx="3.5" cy="12" r="1" /><circle cx="3.5" cy="18" r="1" /></> },
            { id: "report", label: "Report", path: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></> },
            { id: "telemetry", label: "Telemetry", path: <path d="M3 12h4l2-6 4 12 2-6h6" /> },
          ].map((item) => {
            const active = tab === item.id;
            return (
              <button key={item.id} onClick={() => changeTab(item.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, padding: "9px 0 5px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 600, minHeight: 52, boxShadow: active ? uOn : uOff, transition: "color .12s cubic-bezier(0.16,1,0.3,1)", color: active ? on : off }}>
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{item.path}</svg>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Metric detail sheet */}
        {sheetM && (
          <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div onClick={() => setSheet(null)} style={{ position: "absolute", inset: 0, background: "rgba(28,38,48,.45)", backdropFilter: "blur(2px)", animation: "pf-fade-in .16s ease-out" }} />
            <div className="pf-scroll" style={{ position: "relative", background: "var(--surface-card)", maxHeight: "88%", overflowY: "auto", animation: "pf-sheet-in .22s cubic-bezier(0.16,1,0.3,1)", borderTop: "3px solid " + (sheetM.tone === "success" ? "var(--ink-900)" : TONE[sheetM.tone].strong) }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "18px 18px 16px", borderBottom: "1px solid var(--ink-300)" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>{sheetM.cat}</div>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-900)", margin: "6px 0 0", letterSpacing: "-0.014em", lineHeight: 1.3 }}>{sheetM.metric}</h2>
                </div>
                <button onClick={() => setSheet(null)} aria-label="Close" style={{ flexShrink: 0, width: 32, height: 32, display: "grid", placeItems: "center", border: "none", background: "transparent", color: "var(--ink-400)", cursor: "pointer" }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, padding: "20px 18px 18px", borderBottom: "1px solid var(--ink-300)" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <span className="pf-tnum" style={{ fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-0.026em", lineHeight: 1, fontSize: isNaN(parseFloat(sheetM.value)) ? 26 : 42 }}>{sheetM.value}</span>
                  <span style={{ fontSize: 20, fontWeight: 600, color: "var(--ink-400)", lineHeight: 1.2 }}>{sheetM.unit}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: TONE[sheetM.tone].strong }}>{TONE[sheetM.tone].label}</span>
              </div>

              <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid var(--ink-300)" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--ink-400)" }}>Last seven periods</span>
                  <span className="pf-tnum" style={{ fontSize: 11.5, color: "var(--ink-400)" }}>{Math.min.apply(null, sheetM.spark) + " – " + Math.max.apply(null, sheetM.spark)}</span>
                </div>
                <svg width="100%" height="76" viewBox="0 0 320 76" fill="none" preserveAspectRatio="none">
                  <line x1="0" y1="75" x2="320" y2="75" stroke="var(--ink-200)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  <polyline points={sheetSpark.d} stroke="var(--ink-900)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>

              {[
                { k: "Threshold", v: sheetM.threshold },
                { k: "Accountable owner", v: sheetM.owner },
                { k: "Frequency", v: sheetM.freq },
              ].map((row) => (
                <div key={row.k} style={{ display: "flex", justifyContent: "space-between", gap: 14, padding: "13px 18px", borderBottom: "1px solid var(--ink-200)" }}>
                  <span style={{ fontSize: 12.5, color: "var(--ink-400)", flexShrink: 0 }}>{row.k}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink-900)", textAlign: "right" }}>{row.v}</span>
                </div>
              ))}

              <p style={{ fontSize: 13, color: "var(--ink-500)", lineHeight: 1.65, margin: 0, padding: "16px 18px 0", textWrap: "pretty" }}>{sheetM.note}</p>

              <div style={{ display: "flex", gap: 12, padding: "18px 18px 26px" }}>
                <button onClick={() => setSheet(null)} style={{ flex: 1, border: "1px solid var(--ink-300)", borderRadius: 4, background: "var(--surface-card)", color: "var(--ink-500)", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500, padding: 12, cursor: "pointer", minHeight: 48 }}>View evidence</button>
                <button onClick={assign} style={{ flex: 1.3, border: "none", borderRadius: 4, background: "var(--ink-900)", color: "#fff", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, padding: 12, cursor: "pointer", minHeight: 48 }}>{sheetM.tone === "success" ? "Add to board pack" : "Assign action"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
