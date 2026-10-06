"use client";

/* Guide pilot (advisers only). Puts the same thirty questions to both candidate
   models, shows the answers side by side, and lets the adviser mark each as
   passing or failing the test for its kind. Marks are kept in this browser. */

import React from "react";
import * as DS from "@/components/ds";
import { useReportReview } from "@/lib/reviews";
import { askGuide, type GuideAnswer } from "@/lib/guide";
import { PILOT_QUESTIONS, PILOT_MODELS, KIND_TEST } from "@/lib/guide-pilot";

type Cell = { reply?: GuideAnswer; error?: string; mark?: "pass" | "fail" };
type Results = Record<string, Cell>; // key: `${questionId}:${modelId}`
const STORE = "pf-guide-pilot-v1";

export default function GuidePilotPage() {
  const { ready, isTeam } = useReportReview();
  const [results, setResults] = React.useState<Results>({});
  const [running, setRunning] = React.useState<string | null>(null);
  const stop = React.useRef(false);

  React.useEffect(() => { try { setResults(JSON.parse(window.localStorage.getItem(STORE) || "{}")); } catch {} }, []);
  const save = (next: Results) => { setResults(next); try { window.localStorage.setItem(STORE, JSON.stringify(next)); } catch {} };

  const run = async () => {
    stop.current = false;
    let current = { ...results };
    for (const q of PILOT_QUESTIONS) {
      for (const m of PILOT_MODELS) {
        const key = `${q.id}:${m.id}`;
        if (stop.current) { setRunning(null); return; }
        if (current[key]?.reply) continue;
        setRunning(`Question ${q.id} of ${PILOT_QUESTIONS.length} · ${m.name}`);
        const r = await askGuide(q.criterion, q.question, m.id);
        current = { ...current, [key]: r.ok ? { reply: r.data } : { error: r.error } };
        save(current);
        if (!r.ok && (r.code === "off" || r.code === "limit" || r.code === "pilot" || r.code === "plan")) { setRunning(null); return; }
      }
    }
    setRunning(null);
  };
  const mark = (key: string, value: "pass" | "fail") => save({ ...results, [key]: { ...results[key], mark: results[key]?.mark === value ? undefined : value } });

  if (!ready) return <div style={{ padding: 28 }} />;
  if (!isTeam) return <div style={{ padding: 28 }}><p style={{ fontSize: 14.5, color: "var(--text-secondary)" }}>This page is for Principled Futures advisers.</p></div>;

  const tally = (modelId: string) => {
    const cells = PILOT_QUESTIONS.map((q) => results[`${q.id}:${modelId}`]);
    return { answered: cells.filter((c) => c?.reply).length, pass: cells.filter((c) => c?.mark === "pass").length, fail: cells.filter((c) => c?.mark === "fail").length };
  };
  const firstError = Object.values(results).find((c) => c.error)?.error;

  return (
    <div style={{ padding: 28, maxWidth: 1180, margin: "0 auto" }}>
      <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>Guide pilot</h1>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4, maxWidth: 760, lineHeight: 1.55 }}>
        Thirty questions on Transparency &amp; explainability, put to both models. Each question has a test. Mark each answer pass or fail against that test; the model that passes is the one to use. Sixty answers cost a few pence in total.
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", margin: "18px 0" }}>
        <DS.Button variant="primary" disabled={!!running} onClick={run}>{running ? "Running…" : Object.keys(results).length ? "Run the remaining questions" : "Run the pilot"}</DS.Button>
        {running && <DS.Button variant="ghost" onClick={() => { stop.current = true; }}>Stop</DS.Button>}
        {Object.keys(results).length > 0 && !running && <DS.Button variant="ghost" onClick={() => save({})}>Clear all answers and marks</DS.Button>}
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{running ?? ""}</span>
      </div>
      {firstError && !running && <p style={{ fontSize: 13.5, color: "var(--status-danger)", marginBottom: 14 }}>{firstError}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
        {PILOT_MODELS.map((m) => { const t = tally(m.id); return (
          <div key={m.id} style={{ border: "1px solid var(--border-default)", borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>{m.name}</div>
            <div className="pf-tnum" style={{ fontSize: 13.5, color: "var(--text-secondary)", marginTop: 3 }}>{t.answered} of {PILOT_QUESTIONS.length} answered · {t.pass} passed · {t.fail} failed</div>
          </div>
        ); })}
      </div>

      {PILOT_QUESTIONS.map((q) => (
        <div key={q.id} style={{ borderTop: "1px solid var(--border-default)", padding: "18px 0" }}>
          <div style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}><span className="pf-tnum">{q.id}</span> · criterion {q.criterion} · test: {KIND_TEST[q.kind]}</div>
          <p style={{ fontSize: 15, fontWeight: 500, color: "var(--ink-900)", lineHeight: 1.5, marginTop: 4, maxWidth: 860 }}>{q.question}</p>
          <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 10 }}>
            {PILOT_MODELS.map((m) => {
              const key = `${q.id}:${m.id}`; const c = results[key];
              return (
                <div key={m.id} style={{ border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "12px 14px", minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)" }}>{m.name}{c?.reply && !c.reply.covered ? " · said not covered" : ""}</span>
                    {c?.reply && (
                      <span style={{ display: "inline-flex", gap: 6 }}>
                        {(["pass", "fail"] as const).map((v) => (
                          <button key={v} onClick={() => mark(key, v)}
                            style={{ border: "1px solid var(--border-default)", borderRadius: 7, padding: "3px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)",
                              background: c.mark === v ? (v === "pass" ? "var(--status-success)" : "var(--status-danger)") : "var(--surface-card)", color: c.mark === v ? "#fff" : "var(--text-secondary)" }}>{v === "pass" ? "Pass" : "Fail"}</button>
                        ))}
                      </span>
                    )}
                  </div>
                  {!c && <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 6 }}>Not run yet.</p>}
                  {c?.error && <p style={{ fontSize: 13, color: "var(--status-danger)", marginTop: 6 }}>{c.error}</p>}
                  {c?.reply && (
                    <>
                      {c.reply.answer.split(/\n\n+/).map((p, i) => <p key={i} style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 6 }}>{p}</p>)}
                      <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 8, lineHeight: 1.5 }}>
                        {c.reply.sources.length ? `Cited: ${c.reply.sources.map((s) => `[${s.n}] ${s.title}`).join("; ")}` : "No sources cited."}
                        {c.reply.related.length ? ` · Connected: ${c.reply.related.map((r) => r.id).join(", ")}` : ""}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
