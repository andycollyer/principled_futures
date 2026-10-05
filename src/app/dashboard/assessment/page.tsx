"use client";

/* Assessment — the 8×8 maturity engine: category rail + question + scale.
   Wired to src/lib/framework.ts (source of truth) via src/lib/store.ts. */

import React from "react";
import * as DS from "@/components/ds";
import * as UI from "@/components/icons";
import {
  framework,
  BAND_LABELS,
  progress,
  domainProgress,
} from "@/lib/framework";
import { useAnswers } from "@/lib/store";
import { articleFor } from "@/lib/content-meta";
import { recordSnapshot } from "@/lib/history";
import { overallScore, domainScore, band } from "@/lib/framework";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

// Taste, then gate: an anonymous visitor may answer the first domain — eight
// questions — and is then asked to create an account. Their answers are held
// locally and carry over, so nothing they typed is lost at the wall.
const FREE_QUESTIONS = 8;

// Flat list of all 64 criteria so Previous/Next crosses domain boundaries.
const FLAT = framework.flatMap((domain) =>
  domain.criteria.map((criterion, qIndex) => ({ domain, criterion, qIndex }))
);

export default function AssessmentPage() {
  const router = useRouter();
  const { orgId } = useAuth();
  const { answers, setAnswer, ready } = useAnswers();
  const { configured, session } = useAuth();
  const anon = configured && !session;

  const [index, setIndex] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const wall = anon && index >= FREE_QUESTIONS;   // reached the end of the free run
  const { domain, criterion, qIndex } = FLAT[index];
  const totalDone = ready ? progress(answers).answered : 0;
  const complete = ready && totalDone === 64;
  const score = ready ? overallScore(answers) : null;

  // Score history: snapshot on every change, coalesced per day (cloud when
  // signed in, local otherwise).
  React.useEffect(() => {
    if (ready) recordSnapshot(answers, orgId);
  }, [answers, ready, orgId]);

  // Completion modal: fires once, on the transition from incomplete → 64/64.
  // A ref tracks the previous count so revisiting a finished assessment does
  // not re-trigger it; a session flag persists that across reloads.
  const [showComplete, setShowComplete] = React.useState(false);
  const prevDone = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (!ready) return;
    const before = prevDone.current;
    prevDone.current = totalDone;
    const alreadyCelebrated = typeof window !== "undefined" && window.sessionStorage.getItem("pf-assessment-celebrated") === "true";
    if (totalDone === 64 && before !== null && before < 64 && !alreadyCelebrated) {
      setShowComplete(true);
      try { window.sessionStorage.setItem("pf-assessment-celebrated", "true"); } catch {}
    }
  }, [totalDone, ready]);

  const copyBoardSummary = async () => {
    if (score == null) return;
    const rows = framework
      .map((d) => {
        const s = domainScore(d, answers);
        return `  ${d.name}: ${s == null ? "—" : `${s}/100 (${band(s)})`}`;
      })
      .join("\n");
    const text = `AI & ESG governance assessment — board summary\n\nOverall: ${score}/100 (${band(score)})\nCompleted: all 64 criteria across 8 domains\n\nBy domain:\n${rows}\n\nFull advisory report and continuous telemetry available in Principled Futures.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  const goToDomain = (domainId: number) => {
    if (anon && domainId !== 1) { setIndex(FREE_QUESTIONS); return; }   // show the wall
    const first = FLAT.findIndex((f) => f.domain.id === domainId);
    if (first >= 0) setIndex(first);
  };

  return (
    <div style={{ padding: 28, maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>Situational assessment</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>64 board-level dimensions across ESG performance and Ethical AI. Autosaved as you go.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, maxWidth: 520 }}>
          <DS.Progress value={totalDone} max={64} tone="brand" style={{ flex: 1 }} />
          <span className="pf-tnum" style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)", whiteSpace: "nowrap" }}>{totalDone} / 64</span>
        </div>
      </div>

      {/* Completion moment: the assessment is done — download, distribute, assign. */}
      {complete && score != null && (
        <div style={{ position: "relative", overflow: "hidden", background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 16, padding: "26px 28px", marginBottom: 20 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ display: "inline-flex", width: 44, height: 44, borderRadius: "50%", background: "var(--green-100)", color: "var(--green-600)", alignItems: "center", justifyContent: "center" }}><UI.ICheckCircle size={24} /></span>
              <div>
                <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-0.011em" }}>Assessment complete</h2>
                <p className="pf-tnum" style={{ fontSize: 13.5, color: "var(--text-secondary)", marginTop: 3 }}>All 64 criteria answered · overall {score}/100 · {band(score)}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => setShowComplete(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 38, padding: "0 18px", fontSize: 13.5, fontWeight: 600, color: "#fff", background: "var(--brand)", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-sans)" }}>View next steps <UI.IArrowRight size={15} /></button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
        {/* Category rail */}
        <DS.Card padding="sm">
          {framework.map((d) => {
            const on = d.id === domain.id;
            const done = ready ? domainProgress(d, answers).answered : 0;
            const complete = done === 8;
            const lockedDomain = anon && d.id !== 1;
            return (
              <button key={d.id} onClick={() => goToDomain(d.id)}
                title={lockedDomain ? "Create a free account to continue past the first domain" : undefined}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 12px", border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left", marginBottom: 2,
                  background: on ? "var(--green-100)" : "transparent", transition: "background .12s" }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600,
                  background: complete ? "var(--green-600)" : on ? "var(--surface-card)" : "var(--surface-sunken)",
                  border: complete ? "none" : `1.5px solid ${on ? "var(--green-600)" : "var(--border-default)"}`,
                  color: complete ? "#fff" : on ? "var(--green-700)" : "var(--text-tertiary)" }}>
                  {complete ? <UI.ICheck size={14} /> : d.id}
                </span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: on ? 600 : 500, color: on ? "var(--green-700)" : "var(--ink-900)" }}>{d.name}</span>
                {lockedDomain
                  ? <UI.ILock size={13} color="var(--text-tertiary)" />
                  : <span className="pf-tnum" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{done}/8</span>}
              </button>
            );
          })}
        </DS.Card>

        {/* Question panel — or the wall, for anonymous visitors past the free run */}
        {wall ? <AssessmentWall done={totalDone} /> : (
        <DS.Card padding="lg">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <DS.Badge tone="neutral" pill={false}>Category {domain.id} · Question {qIndex + 1} of 8</DS.Badge>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.35, margin: "10px 0 8px", letterSpacing: "-0.011em" }}>
            {criterion.question}
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: articleFor(criterion.id) ? 10 : 22 }}>
            <strong style={{ color: "var(--ink-900)", fontWeight: 600 }}>Leading looks like:</strong> {criterion.leading}
          </p>
          {articleFor(criterion.id) && (
            <a href={`/dashboard/research/${criterion.id}/`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-link)", textDecoration: "none", marginBottom: 22 }}>
              <UI.IDoc size={14} /> Read the briefing for this criterion <UI.IArrowRight size={13} />
            </a>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {criterion.levels.map((detail, level) => {
              const on = ready && answers[criterion.id] === level;
              return (
                <button key={level} onClick={() => setAnswer(criterion.id, level)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderRadius: 10, cursor: "pointer", textAlign: "left", width: "100%",
                    border: `1.5px solid ${on ? "var(--green-600)" : "var(--border-subtle)"}`,
                    background: on ? "var(--green-50)" : "var(--surface-card)", transition: "all .12s" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700,
                    border: `1.5px solid ${on ? "var(--green-600)" : "var(--border-default)"}`, background: on ? "var(--green-600)" : "transparent", color: on ? "#fff" : "var(--text-tertiary)" }}>{level}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>{BAND_LABELS[level]}</span>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", marginLeft: 8 }}>{detail}</span>
                  </span>
                  {on && <UI.ICheck size={18} color="var(--green-600)" />}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <DS.Button variant="ghost" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>Previous</DS.Button>
            <DS.Button variant="brand" disabled={index === FLAT.length - 1} iconRight={<UI.IArrowRight size={15} />}
              onClick={() => setIndex((i) => Math.min(anon ? FREE_QUESTIONS : FLAT.length - 1, i + 1))}>Next question</DS.Button>
          </div>
        </DS.Card>
        )}
      </div>

      {showComplete && score != null && (
        <CompletionModal
          score={score}
          copied={copied}
          onClose={() => setShowComplete(false)}
          onBoardPack={() => { setShowComplete(false); router.push("/dashboard/report?print=1"); }}
          onReport={() => { setShowComplete(false); router.push("/dashboard/report"); }}
          onCopy={copyBoardSummary}
          onOwners={() => { setShowComplete(false); router.push("/dashboard/telemetry"); }}
          onOverview={() => { setShowComplete(false); router.push("/dashboard"); }}
        />
      )}
    </div>
  );
}

/* The wall an anonymous visitor meets after the first domain. Their eight
   answers are already on this device and are carried into the account, so
   creating one costs them nothing and loses nothing. */
function AssessmentWall({ done }: { done: number }) {
  return (
    <DS.Card padding="lg">
      <div style={{ textAlign: "center", padding: "18px 8px" }}>
        <span style={{ display: "inline-flex", width: 46, height: 46, borderRadius: 12, background: "var(--green-100)", color: "var(--green-600)", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <UI.ICheckCircle size={22} />
        </span>
        <h2 className="pf-display" style={{ fontSize: 22, color: "var(--ink-900)" }}>That&rsquo;s the first domain done</h2>
        <p className="pf-tnum" style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 10, maxWidth: 420, marginInline: "auto" }}>
          You&rsquo;ve answered {done} of 64 criteria. Create a free account to see your score, carry on through the remaining seven domains, and open the research library.
        </p>
        <p style={{ fontSize: 13, color: "var(--text-tertiary)", lineHeight: 1.6, marginTop: 10, maxWidth: 420, marginInline: "auto" }}>
          Your answers are saved on this device and come with you — nothing is lost.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
          <a href="/signup/?next=%2Fdashboard%2Fassessment" style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 42, padding: "0 20px", background: "var(--brand)", color: "var(--text-on-brand)", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Create a free account <UI.IArrowRight size={15} />
          </a>
          <a href="/login/?next=%2Fdashboard%2Fassessment" style={{ display: "inline-flex", alignItems: "center", height: 42, padding: "0 18px", border: "1px solid var(--border-default)", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none" }}>
            I already have one
          </a>
        </div>
      </div>
    </DS.Card>
  );
}

function CompletionModal({ score, copied, onClose, onBoardPack, onReport, onCopy, onOwners, onOverview }: {
  score: number; copied: boolean; onClose: () => void;
  onBoardPack: () => void; onReport: () => void; onCopy: () => void; onOwners: () => void; onOverview: () => void;
}) {
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setEntered(true); return; }
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const EASE = "cubic-bezier(0.16,1,0.3,1)";
  const NEXT: { icon: React.ReactNode; title: string; sub: string; onClick: () => void; primary?: boolean }[] = [
    { icon: <UI.IDownload size={18} />, title: "Download the board pack", sub: "A print-ready PDF: score, priority risks, roadmap.", onClick: onBoardPack, primary: true },
    { icon: <UI.IFile size={18} />, title: "Read the advisory report", sub: "The full board-ready report, on screen.", onClick: onReport },
    { icon: <UI.IUsers size={18} />, title: "Assign metric owners", sub: "Put a named person against each telemetry measure.", onClick: onOwners },
    { icon: <UI.IPulse size={18} />, title: "See your governance overview", sub: "Live posture, category maturity and telemetry.", onClick: onOverview },
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(17,27,22,0.5)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "8vh", opacity: entered ? 1 : 0, transition: `opacity 160ms ${EASE}`, overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Assessment complete"
        style={{ width: "calc(100% - 40px)", maxWidth: 560, background: "var(--surface-card)", borderRadius: 18, border: "1px solid var(--border-subtle)", boxShadow: "0 28px 72px -18px rgba(20,36,29,0.4)", overflow: "hidden", marginBottom: "8vh",
          transform: entered ? "none" : "translateY(-10px) scale(0.98)", opacity: entered ? 1 : 0, transition: `transform 200ms ${EASE}, opacity 200ms ${EASE}` }}>

        {/* Celebratory header */}
        <div style={{ position: "relative", overflow: "hidden", background: "var(--surface-card)", borderBottom: "1px solid var(--border-subtle)", padding: "30px 28px 26px", textAlign: "center" }}>
          <div style={{ position: "relative" }}>
            <span style={{ display: "inline-flex", width: 56, height: 56, borderRadius: "50%", background: "var(--green-100)", color: "var(--green-600)", alignItems: "center", justifyContent: "center", marginBottom: 14 }}><UI.ICheckCircle size={30} /></span>
            <h2 className="pf-display" style={{ fontSize: 24, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>Assessment complete</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6, maxWidth: 380, marginInline: "auto", lineHeight: 1.5 }}>All 64 criteria answered across eight domains. Here is your governance position, and what you can do with it.</p>
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: 8, marginTop: 16, background: "var(--green-100)", borderRadius: 12, padding: "10px 18px" }}>
              <span className="pf-tnum" style={{ fontSize: 30, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>/ 100</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)", textTransform: "uppercase", letterSpacing: "0.05em", marginLeft: 6 }}>{band(score)}</span>
            </div>
          </div>
        </div>

        {/* Next actions */}
        <div style={{ padding: "18px 18px 10px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-tertiary)", padding: "0 6px 8px" }}>Next steps</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {NEXT.map((n) => (
              <button key={n.title} onClick={n.onClick}
                style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 12, cursor: "pointer", fontFamily: "var(--font-sans)",
                  border: n.primary ? "1.5px solid var(--green-600)" : "1px solid var(--border-subtle)",
                  background: n.primary ? "var(--green-50)" : "var(--surface-card)", transition: "border-color 120ms, background 120ms" }}
                onMouseEnter={(e) => { if (!n.primary) e.currentTarget.style.background = "var(--surface-sunken)"; }}
                onMouseLeave={(e) => { if (!n.primary) e.currentTarget.style.background = "var(--surface-card)"; }}>
                <span style={{ flexShrink: 0, display: "inline-flex", width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center", background: n.primary ? "var(--green-600)" : "var(--green-100)", color: n.primary ? "#fff" : "var(--green-600)" }}>{n.icon}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)" }}>{n.title}</span>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--text-secondary)", marginTop: 1 }}>{n.sub}</span>
                </span>
                <UI.IArrowRight size={16} color={n.primary ? "var(--green-600)" : "var(--text-tertiary)"} />
              </button>
            ))}
          </div>
        </div>

        {/* Footer: copy summary + dismiss */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 20px", borderTop: "1px solid var(--border-subtle)", background: "var(--surface-sunken)" }}>
          <button onClick={onCopy} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 500, color: copied ? "var(--green-700)" : "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
            {copied ? <><UI.ICheck size={15} /> Summary copied</> : <><UI.IFile size={15} /> Copy board summary</>}
          </button>
          <button onClick={onClose} style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Continue reviewing answers</button>
        </div>
      </div>
    </div>
  );
}
