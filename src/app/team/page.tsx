"use client";

/* Team entry. While the site is private this is how Salveus people get in.
   The passcode is checked by the edge function (netlify/edge-functions/gate.ts),
   never here — this page only hands it over. On success the gate sets a cookie
   and sends you back here with a clean URL, so the passcode is not left
   sitting in your history. */

import React from "react";
import * as UI from "@/components/icons";

export default function TeamPage() {
  const [key, setKey] = React.useState("");
  const [bad, setBad] = React.useState(false);
  const [inside, setInside] = React.useState(false);

  React.useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      setBad(q.has("bad"));
      setInside(q.has("in"));
    } catch {}
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    window.location.href = `/team/?key=${encodeURIComponent(key.trim())}`;
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "#fff", minHeight: "100vh", display: "grid", placeItems: "center", padding: 28 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 22 }}>
          <UI.Logo size={30} />
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>Principled Futures</span>
        </div>

        {inside && (
          <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 10, padding: 26 }}>
            <h1 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)" }}>You&rsquo;re in</h1>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, margin: "6px 0 16px" }}>
              This browser can see the private site for the next 30 days.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                ["/signup/?next=%2Fdashboard", "The product", "Assessment, library and report. It has its own account: create one, or sign in."],
                ["/", "Public landing page", "What visitors see today, with the wait list."],
              ].map(([href, title, sub]) => (
                <a key={href} href={href} style={{ display: "block", border: "1px solid var(--border-default)", borderRadius: 10, padding: "12px 14px", textDecoration: "none" }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14.5, fontWeight: 600, color: "var(--ink-900)" }}>{title} <UI.IArrowRight size={15} /></span>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2, lineHeight: 1.5 }}>{sub}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {!inside && <form onSubmit={submit} style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 10, padding: 26 }}>
          <h1 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)" }}>Team access</h1>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, margin: "6px 0 18px" }}>
            The product is private while we build it out. Enter the team passcode to continue.
          </p>

          <input
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setBad(false); }}
            placeholder="Passcode"
            autoFocus
            style={{ width: "100%", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--ink-900)",
              border: `1px solid ${bad ? "var(--danger, #b3261e)" : "var(--border-default)"}`, borderRadius: 8,
              padding: "11px 13px", outline: "none", background: "var(--surface-card)" }}
          />
          {bad && <p style={{ fontSize: 12.5, color: "var(--danger, #b3261e)", marginTop: 8 }}>That passcode wasn&rsquo;t right.</p>}

          <button type="submit" disabled={!key.trim()}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", height: 42,
              borderRadius: 8, border: "none", cursor: key.trim() ? "pointer" : "not-allowed", fontFamily: "var(--font-sans)",
              fontSize: 15, fontWeight: 600, background: key.trim() ? "var(--brand)" : "var(--ink-400)", color: "#fff", marginTop: 14 }}>
            Continue <UI.IArrowRight size={16} />
          </button>

          <p style={{ fontSize: 12, color: "var(--text-tertiary)", textAlign: "center", lineHeight: 1.5, marginTop: 14 }}>
            Not on the team? <a href="/" style={{ color: "var(--text-link)" }}>Join the wait list</a>.
          </p>
        </form>}
      </div>
    </div>
  );
}
