"use client";

/* Ask the guide about one criterion. The reader describes their situation; the
   answer comes only from the approved brief, reading list and links, with numbered
   citations. Always labelled as AI, never as advice. Top plan only. */

import React from "react";
import * as DS from "@/components/ds";
import { askGuide, type GuideAnswer } from "@/lib/guide";

export function GuidePanel({ criterionId, title, plan, onSelect }: { criterionId: string; title: string; plan: string | null | undefined; onSelect?: (id: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [reply, setReply] = React.useState<GuideAnswer | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // A different criterion is a different conversation.
  React.useEffect(() => { setOpen(false); setQuestion(""); setReply(null); setError(null); }, [criterionId]);

  const wrap: React.CSSProperties = { marginTop: 16, border: "1px solid var(--border-default)", borderRadius: 10, padding: "14px 16px" };
  const small: React.CSSProperties = { fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.5 };

  if (plan !== "governance_plus") {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>Ask the guide</div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 3 }}>
          Describe your situation on this criterion and get an answer drawn from the evidence brief. Included in the Governance+ plan. <a href="/dashboard/settings/" style={{ color: "var(--text-link)", fontWeight: 600, textDecoration: "none" }}>See plans</a>
        </p>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim().length < 8 || busy) return;
    setBusy(true); setError(null); setReply(null);
    const r = await askGuide(criterionId, question.trim());
    setBusy(false);
    if (r.ok) setReply(r.data); else setError(r.error);
  };

  if (!open) {
    return (
      <div style={wrap}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>Ask the guide</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>What does this mean for us, and what would we do first?</div>
          </div>
          <DS.Button variant="outline" size="sm" onClick={() => setOpen(true)}>Ask about {title.length > 26 ? "this criterion" : title}</DS.Button>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <form onSubmit={submit}>
        <label htmlFor="guide-question" style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>Ask the guide about {title}</label>
        <p style={{ ...small, margin: "3px 0 8px" }}>Describe your situation in a sentence or two. Leave out names and anything confidential.</p>
        <DS.Textarea id="guide-question" rows={3} value={question} maxLength={1500} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
          placeholder="For example: we use a supplier's screening tool in recruitment and nobody on the board has been asked to sign it off. Where do we start?" />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
          <DS.Button type="submit" variant="primary" size="sm" disabled={busy || question.trim().length < 8}>{busy ? "Reading the brief…" : "Ask"}</DS.Button>
          <span style={small}>An AI guide. It answers only from the approved brief and its sources. Not legal advice.</span>
        </div>
      </form>

      {error && <p style={{ fontSize: 13, color: "var(--status-danger)", marginTop: 12 }}>{error}</p>}

      {reply && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
          {!reply.covered && <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--status-warning)", marginBottom: 6 }}>The brief does not cover this fully</div>}
          {reply.answer.split(/\n\n+/).map((p, i) => <p key={i} style={{ fontSize: 14, color: "var(--ink-900)", lineHeight: 1.6, marginTop: i ? 10 : 0 }}>{p}</p>)}

          {reply.sources.length > 0 && (
            <ol style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 4 }}>
              {reply.sources.map((s) => (
                <li key={s.n} style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <span className="pf-tnum" style={{ fontWeight: 600, color: "var(--ink-900)" }}>[{s.n}]</span>{" "}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-link)", textDecoration: "none" }}>{s.title}</a>{s.locator ? `, ${s.locator}` : ""}. {s.publisher}, {s.year}.
                </li>
              ))}
            </ol>
          )}

          {reply.related.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginTop: 12 }}>
              <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>Connected:</span>
              {reply.related.map((r) => (
                <button key={r.id} type="button" onClick={() => onSelect?.(r.id)}
                  style={{ border: "1px solid var(--border-default)", borderRadius: 999, background: "var(--surface-card)", padding: "4px 11px", fontSize: 12.5, fontWeight: 500, color: "var(--ink-900)", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                  <span className="pf-tnum" style={{ color: "var(--green-700)", fontWeight: 700 }}>{r.id}</span> {r.title}
                </button>
              ))}
            </div>
          )}

          <p style={{ ...small, marginTop: 12 }}>
            Generated by AI from the Principled Futures evidence brief for {criterionId}{reply.checked ? `, sources last checked ${new Date(reply.checked).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}.
            It is guidance to help a board ask better questions, not legal advice, and it is kept on record. <a href={`/dashboard/research/${criterionId}/`} style={{ color: "var(--text-link)", textDecoration: "none", fontWeight: 600 }}>Read the full brief</a>
          </p>
        </div>
      )}
    </div>
  );
}
