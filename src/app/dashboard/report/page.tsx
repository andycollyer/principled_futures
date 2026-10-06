"use client";

/* Advisory Report — the board-ready output, draft template. Layout per the
   design handoff; scores, bands and trends are real (assessment + history);
   accountable owners read from telemetry-owners; peer benchmark is labelled
   demo data. The Claude-written narrative arrives with the API phase. */

import React from "react";
import * as DS from "@/components/ds";
import * as UI from "@/components/icons";
import { framework, overallScore, domainScore, band, type Domain } from "@/lib/framework";
import { useAnswers } from "@/lib/store";
import { useOwners } from "@/lib/telemetry-owners";
import { loadHistoryAsync, trendFrom } from "@/lib/history";
import { useAuth } from "@/lib/auth";
import { useOrg } from "@/lib/org";

const SOURCES = ["OECD AI Principles", "EU AI Act (Art. 12)", "UNESCO AI Ethics", "Gartner AI Maturity", "PwC 2025 Responsible AI", "ISS STOXX Governance Gap", "Diligent Boards & AI", "IoD / ICAEW"];

// Which telemetry metrics inform which domain — used to surface an
// accountable owner per priority risk (mirrors the telemetry mapping).
const DOMAIN_METRICS: Record<number, string[]> = {
  1: ["scaling-status", "realised-roi"],
  2: ["model-drift", "hallucination-rate", "regulatory-readiness"],
  3: ["bias-impact"],
  4: ["explainability"],
  5: ["regulatory-readiness"],
  6: ["kill-switch"],
  7: ["shadow-ai", "speak-up"],
  8: ["carbon-footprint"],
};

function SectionTitle({ n, sub, children }: { n: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="pf-tnum" style={{ width: 24, height: 24, borderRadius: 6, background: "var(--ink-900)", color: "#fff", fontSize: 12, fontWeight: 700, display: "grid", placeItems: "center" }}>{n}</span>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.011em" }}>{children}</h2>
      </div>
      {sub && <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 6, marginLeft: 34 }}>{sub}</p>}
    </div>
  );
}

const BAND_COLORS: Record<string, string> = {
  Initial: "var(--status-danger)",
  Developing: "var(--status-warning)",
  Defined: "var(--status-info)",
  Managed: "var(--status-success)",
  Leading: "var(--green-600)",
};

function toneFor(score: number): "success" | "warning" | "danger" {
  return score < 40 ? "danger" : score < 60 ? "warning" : "success";
}

/** Draft summary copy, deterministic from the scores. */
function draftSummary(score: number, strongest: Domain | null, weakest: { d: Domain; s: number } | null, overallTrend: number | null) {
  const headline =
    score >= 80 ? "A leading governance posture — the task now is holding it."
    : score >= 60 ? `A managed governance posture${weakest && weakest.s < 60 ? `, with clear ground to make up in ${weakest.d.name.toLowerCase()}` : ""}.`
    : score >= 40 ? `A defined governance posture — foundations in place, consistency still to build.`
    : score >= 20 ? "A developing governance posture — the priorities below deserve board attention this quarter."
    : "An initial governance posture — the board's first task is to establish the foundations below.";
  const movement = overallTrend == null ? "" : overallTrend === 0 ? " Position unchanged since the last snapshot." : ` ${overallTrend > 0 ? "Up" : "Down"} ${Math.abs(overallTrend)} point${Math.abs(overallTrend) === 1 ? "" : "s"} since the last snapshot.`;
  const body = `Your organisation scores ${score}/100 (${band(score)}).${movement}${strongest ? ` The strongest domain is ${strongest.name}.` : ""}${weakest ? ` The most urgent exposure sits in ${weakest.d.name}, scoring ${weakest.s} (${band(weakest.s)}) — addressed in the priority areas below.` : ""}`;
  return { headline, body };
}

export default function ReportPage() {
  const { answers, ready } = useAnswers();
  const { owners, ready: ownersReady } = useOwners();
  const { orgId, user } = useAuth();
  const { details } = useOrg();
  const orgName = details?.orgName || "your organisation";
  const reader = details?.fullName ? `${details.fullName}${details.jobTitle ? `, ${details.jobTitle}` : ""}` : (user?.email ?? "this device");
  const [mounted, setMounted] = React.useState(false);
  const [trends, setTrends] = React.useState<Record<string, number | null>>({});
  const [shareOpen, setShareOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // ?print=1 — arrived via "Download board pack": open the print dialog.
    if (window.location.search.includes("print=1")) {
      setTimeout(() => window.print(), 700);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    loadHistoryAsync(orgId).then((history) => {
      if (!active) return;
      const t: Record<string, number | null> = { overall: trendFrom(history) };
      for (const d of framework) t[String(d.id)] = trendFrom(history, d.id);
      setTrends(t);
    });
    return () => { active = false; };
  }, [orgId]);

  const score = ready ? overallScore(answers) : null;
  const scored = ready ? framework.map((d) => ({ d, s: domainScore(d, answers) })) : [];
  const withScores = scored.filter((x): x is { d: Domain; s: number } => x.s != null);
  const strongest = withScores.length ? withScores.reduce((a, b) => (b.s > a.s ? b : a)).d : null;
  const weakestList = [...withScores].sort((a, b) => a.s - b.s);
  const weakest = weakestList[0] ?? null;
  const priorities = weakestList.filter((x) => x.s < 60).slice(0, 3);
  const risks = priorities.length ? priorities : weakestList.slice(0, 1);

  const ownerFor = (domainId: number): string => {
    if (!ownersReady) return "Unassigned";
    for (const metricId of DOMAIN_METRICS[domainId] ?? []) {
      const o = owners[metricId];
      if (o) return `${o.personName}${o.role ? ` (${o.role})` : ""}`;
    }
    return "No owner named yet — add one on the Overview";
  };

  const lowestCriteria = (d: Domain, n = 2) =>
    d.criteria
      .map((c) => ({ c, v: answers[c.id] as number | undefined }))
      .filter((x) => x.v != null)
      .sort((a, b) => (a.v as number) - (b.v as number))
      .slice(0, n)
      .map((x) => x.c.title);

  const HORIZONS = ["0–30 days", "30–90 days", "90–180 days"];
  const today = mounted ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

  if (!ready || !mounted) return <div style={{ padding: 28 }} />;

  if (score == null) {
    return (
      <div style={{ padding: 28, maxWidth: 880, margin: "0 auto" }}>
        <DS.Card padding="lg" style={{ textAlign: "center", padding: 48 }}>
          <h1 className="pf-display" style={{ fontSize: 22, color: "var(--ink-900)" }}>No report yet</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 8, marginBottom: 20 }}>The advisory report is generated from your assessment. Answer the 64 criteria and it assembles itself.</p>
          <DS.Button variant="brand" onClick={() => (window.location.href = "/dashboard/assessment/")}>Start the assessment</DS.Button>
        </DS.Card>
      </div>
    );
  }

  const summary = draftSummary(score, strongest, weakest ?? null, trends["overall"] ?? null);

  const boardBody = (recipientNote: string) => {
    const rows = framework.map((d) => {
      const s = domainScore(d, answers);
      return `  • ${d.name}: ${s == null ? "—" : `${s}/100 (${band(s)})`}`;
    }).join("\n");
    return `${recipientNote ? recipientNote + "\n\n" : ""}AI & ESG governance — advisory report (draft)\n\nOverall governance posture: ${score}/100 (${band(score)})\n\nBy domain:\n${rows}\n\nPriority areas and the full board-ready report — executive summary, priority risks with owners, roadmap — are available in Principled Futures. The board pack can be downloaded as a PDF from the report.\n\nGenerated ${today} · Principled Futures Advisory, a Salveus Labs product.`;
  };

  return (
    <div id="pf-report" style={{ background: "var(--surface-canvas)", minHeight: "100%" }}>
      <style>{`@media print { body * { visibility: hidden; } #pf-report, #pf-report * { visibility: visible; } #pf-report { position: absolute; left: 0; top: 0; width: 100%; } #pf-report .pf-noprint { display: none; } }`}</style>

      {/* Action bar */}
      <div className="pf-noprint" style={{ background: "var(--surface-card)", borderBottom: "1px solid var(--border-subtle)", padding: "16px 28px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-flex", width: 36, height: 36, borderRadius: 9, background: "var(--green-100)", color: "var(--green-600)", alignItems: "center", justifyContent: "center" }}><UI.IFile size={19} /></span>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)" }}>Advisory Report — Draft</div>
              <div style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>{orgName}{details?.sector ? ` · ${details.sector}` : ""} · generated {today}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <DS.Badge tone="warning" pill={false}>Draft — narrative generation arrives with the API phase</DS.Badge>
            <DS.Button variant="outline" size="sm" iconLeft={<UI.IDownload size={15} />} onClick={() => window.print()}>Download PDF</DS.Button>
            <DS.Button variant="primary" size="sm" iconLeft={<UI.IUsers size={15} />} onClick={() => setShareOpen(true)}>Share with board</DS.Button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px 28px 56px", display: "flex", flexDirection: "column", gap: 26 }}>
        {/* Masthead — printed as well as shown, so the PDF names who it is for. */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", paddingBottom: 18, borderBottom: "2px solid var(--green-600)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}><UI.Logo size={22} /> Principled Futures</div>
            <div className="pf-display" style={{ fontSize: 28, color: "var(--ink-900)", marginTop: 14, lineHeight: 1.15 }}>{details?.orgName || "AI governance"}</div>
            <div style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 4 }}>AI governance advisory report{details?.sector ? ` · ${details.sector}` : ""}{details?.size ? ` · ${details.size}` : ""}</div>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, textAlign: "right" }}>
            <div>Prepared for <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{reader}</span></div>
            <div>{today} · draft, not yet reviewed by an adviser</div>
          </div>
        </div>

        {/* Executive summary */}
        <DS.Card padding="lg">
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 28, alignItems: "center" }}>
            <div style={{ display: "grid", placeItems: "center" }}>
              <DS.ScoreGauge score={score} size={150} bandLabel={band(score)} bandColor={BAND_COLORS[band(score)]} />
            </div>
            <div>
              <DS.Badge tone="neutral" pill={false}>Executive summary</DS.Badge>
              <h1 className="pf-display" style={{ fontSize: 24, color: "var(--ink-900)", marginTop: 10, lineHeight: 1.25 }}>{summary.headline}</h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 10 }}>{details?.orgName ? summary.body.replace("Your organisation", details.orgName) : summary.body}</p>
            </div>
          </div>
        </DS.Card>

        {/* Priority risk areas */}
        <div>
          <SectionTitle n="1" sub="Ranked by severity and board exposure — owners are the people you named on the Overview">Priority risk areas</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {risks.map(({ d, s }) => {
              const sev = toneFor(s) === "success" ? "warning" : toneFor(s);
              const low = lowestCriteria(d);
              return (
                <div key={d.id} style={{ display: "flex", gap: 14, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderLeft: `3px solid var(--status-${sev})`, borderRadius: 12, boxShadow: "var(--shadow-card)", padding: 18 }}>
                  <span style={{ flexShrink: 0, display: "inline-flex", width: 34, height: 34, borderRadius: 9, background: `var(--status-${sev}-bg)`, color: `var(--status-${sev})`, alignItems: "center", justifyContent: "center" }}><UI.IAlert size={18} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>{d.name} scores {s} ({band(s)})</h3>
                      <DS.Badge tone={sev}>{sev === "danger" ? "Critical" : "Watch"}</DS.Badge>
                    </div>
                    <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 5 }}>
                      {d.description}{low.length ? ` Weakest criteria: ${low.join("; ")}.` : ""}
                    </p>
                    <div style={{ fontSize: 12.5, color: "var(--text-tertiary)", marginTop: 8 }}>Accountable owner: <strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{ownerFor(d.id)}</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div>
          <SectionTitle n="2" sub="The 8×8 framework, scored 0–100 with movement since your last snapshot">Category breakdown</SectionTitle>
          <DS.Card padding="none">
            {framework.map((d, i) => {
              const s = domainScore(d, answers);
              const t = trends[String(d.id)];
              return (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: i < framework.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "var(--ink-900)" }}>{d.name}</span>
                  <span style={{ width: 130 }}><DS.Progress value={s ?? 0} tone={s == null ? "neutral" : toneFor(s) === "success" ? "brand" : toneFor(s)} /></span>
                  <span className="pf-tnum" style={{ width: 30, textAlign: "right", fontSize: 14, fontWeight: 600, color: s == null ? "var(--text-tertiary)" : "var(--ink-900)" }}>{s == null ? "—" : s}</span>
                  <span style={{ width: 100, textAlign: "right" }}>{s == null ? <DS.Badge tone="neutral">No data</DS.Badge> : <DS.Badge tone={toneFor(s)}>{band(s)}</DS.Badge>}</span>
                  <span className="pf-tnum" style={{ width: 36, textAlign: "right", fontSize: 13, fontWeight: 600, color: t == null ? "var(--text-tertiary)" : t < 0 ? "var(--status-danger)" : "var(--status-success)" }}>{t == null ? "—" : `${t > 0 ? "+" : ""}${t}`}</span>
                </div>
              );
            })}
          </DS.Card>
        </div>

        {/* Roadmap */}
        <div>
          <SectionTitle n="3" sub="Sequenced by horizon, each with a named accountable owner">Recommended roadmap</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {risks.map(({ d, s }, i) => {
              const low = lowestCriteria(d, 1);
              const target = band(Math.min(100, s + 20));
              return (
                <div key={d.id} style={{ display: "flex", gap: 16, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, boxShadow: "var(--shadow-card)", padding: 18 }}>
                  <div style={{ flexShrink: 0, width: 96 }}>
                    <DS.Badge tone="brand">{HORIZONS[i] ?? "180+ days"}</DS.Badge>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>Lift {d.name} from {band(s)} towards {target}</h3>
                    <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 4 }}>
                      {low.length ? `Start with the weakest criterion: ${low[0]}. ` : ""}The criterion briefing in the Research library sets out what leading practice looks like and the evidence to build.
                    </p>
                  </div>
                  <div style={{ flexShrink: 0, alignSelf: "center", fontSize: 12.5, color: "var(--text-tertiary)", textAlign: "right", maxWidth: 140 }}>{ownerFor(d.id)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sources */}
        <div>
          <SectionTitle n="4" sub="This assessment is grounded in recognised governance frameworks">Methodology &amp; sources</SectionTitle>
          <DS.Card padding="lg">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SOURCES.map((s) => <DS.Badge key={s} tone="neutral" variant="outline" pill={false}>{s}</DS.Badge>)}
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text-tertiary)", marginTop: 14, lineHeight: 1.55 }}>
              Scores derive from the 8×8 framework (64 board-level dimensions, 0–4 maturity scale), equal-weighted in v1.0. Regulatory position current as of 22 July 2026.
            </p>
            {/* Attribution line — carried into the printed board pack so a
                circulated copy names the account it was produced for. */}
            <p style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border-subtle)", lineHeight: 1.5 }}>
              Prepared for {reader}{details?.orgName ? `, ${details.orgName}` : ""} on {today}. © 2026 Salveus Labs Ltd. Licensed to one organisation for internal governance use — not for redistribution.
            </p>
          </DS.Card>
        </div>
      </div>

      {shareOpen && (
        <ShareModal
          score={score}
          bandLabel={band(score)}
          onClose={() => setShareOpen(false)}
          buildBody={boardBody}
        />
      )}
    </div>
  );
}

function ShareModal({ score, bandLabel, onClose, buildBody }: {
  score: number; bandLabel: string; onClose: () => void; buildBody: (note: string) => string;
}) {
  const [recipients, setRecipients] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState("");
  const [subject, setSubject] = React.useState("AI & ESG governance — advisory report (draft)");
  const [note, setNote] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [entered, setEntered] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setEntered(true);
    else requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const commit = (raw: string) => {
    const parts = raw.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
    const valid = parts.filter((p) => EMAIL.test(p) && !recipients.includes(p));
    if (valid.length) setRecipients((r) => [...r, ...valid]);
    setDraft("");
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === ";" || (e.key === " " && draft.includes("@"))) {
      e.preventDefault(); commit(draft);
    } else if (e.key === "Backspace" && !draft && recipients.length) {
      setRecipients((r) => r.slice(0, -1));
    }
  };
  const draftLooksValid = EMAIL.test(draft.trim());
  const all = draft.trim() ? [...recipients, ...(draftLooksValid ? [draft.trim()] : [])] : recipients;

  const openMail = () => {
    const to = all.join(",");
    const body = buildBody(note);
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    onClose();
  };
  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${all.join(", ")}\nSubject: ${subject}\n\n${buildBody(note)}`);
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const EASE = "cubic-bezier(0.16,1,0.3,1)";
  const fieldStyle: React.CSSProperties = { width: "100%", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink-900)", border: "1px solid var(--border-default)", borderRadius: 8, padding: "9px 12px", outline: "none", background: "var(--surface-card)" };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(17,27,22,0.5)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "9vh", opacity: entered ? 1 : 0, transition: `opacity 160ms ${EASE}`, overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Share with board"
        style={{ width: "calc(100% - 40px)", maxWidth: 520, background: "var(--surface-card)", borderRadius: 16, border: "1px solid var(--border-subtle)", boxShadow: "0 28px 72px -18px rgba(20,36,29,0.4)", overflow: "hidden", marginBottom: "8vh",
          transform: entered ? "none" : "translateY(-10px) scale(0.98)", opacity: entered ? 1 : 0, transition: `transform 200ms ${EASE}, opacity 200ms ${EASE}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.011em" }}>Share with the board</h2>
            <p className="pf-tnum" style={{ fontSize: 12.5, color: "var(--text-tertiary)", marginTop: 2 }}>Overall {score}/100 · {bandLabel}</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, display: "grid", placeItems: "center", border: "1px solid var(--border-subtle)", borderRadius: 8, background: "var(--surface-card)", cursor: "pointer", color: "var(--text-tertiary)" }}>✕</button>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Recipients */}
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)", marginBottom: 6 }}>Recipients</label>
            <div onClick={() => inputRef.current?.focus()} style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", border: "1px solid var(--border-default)", borderRadius: 8, padding: "6px 8px", background: "var(--surface-card)", cursor: "text", minHeight: 40 }}>
              {recipients.map((r) => (
                <span key={r} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--green-100)", color: "var(--green-700)", borderRadius: 999, padding: "3px 6px 3px 10px", fontSize: 12.5, fontWeight: 500 }}>
                  {r}
                  <button onClick={(e) => { e.stopPropagation(); setRecipients((x) => x.filter((y) => y !== r)); }} aria-label={`Remove ${r}`} style={{ display: "grid", placeItems: "center", width: 16, height: 16, borderRadius: "50%", border: "none", background: "var(--green-200, #cfe3c7)", color: "var(--green-700)", cursor: "pointer", fontSize: 10, lineHeight: 1 }}>✕</button>
                </span>
              ))}
              <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown} onBlur={() => draftLooksValid && commit(draft)}
                placeholder={recipients.length ? "" : "director@acme.com, chair@acme.com…"}
                style={{ flex: 1, minWidth: 140, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink-900)", padding: "3px 2px" }} />
            </div>
            <p style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 5 }}>Enter, comma or semicolon to add each address.</p>
          </div>

          {/* Subject */}
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)", marginBottom: 6 }}>Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} style={fieldStyle} />
          </div>

          {/* Note */}
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)", marginBottom: 6 }}>Message <span style={{ fontWeight: 400, color: "var(--text-tertiary)" }}>(optional)</span></label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="A line for the board — e.g. 'Ahead of Thursday's meeting, our governance baseline.'"
              style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.5 }} />
            <p style={{ fontSize: 11.5, color: "var(--text-tertiary)", marginTop: 5 }}>The domain-by-domain summary is appended automatically.</p>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "var(--surface-sunken)", borderRadius: 8, padding: "10px 12px" }}>
            <UI.IAlert size={15} color="var(--text-tertiary)" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>This opens your own email app with everything filled in — you review and send. Nothing leaves your device until you do. Automated sending arrives with accounts.</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 20px", borderTop: "1px solid var(--border-subtle)", background: "var(--surface-sunken)" }}>
          <button onClick={copyAll} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 500, color: copied ? "var(--green-700)" : "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            {copied ? <><UI.ICheck size={15} /> Copied</> : <><UI.IFile size={15} /> Copy instead</>}
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <DS.Button variant="ghost" onClick={onClose}>Cancel</DS.Button>
            <DS.Button variant="primary" disabled={all.length === 0} iconLeft={<UI.IMail size={15} />} onClick={openMail}>Open in email{all.length ? ` (${all.length})` : ""}</DS.Button>
          </div>
        </div>
      </div>
    </div>
  );
}
