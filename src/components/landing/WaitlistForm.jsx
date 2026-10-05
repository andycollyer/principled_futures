"use client";

/* Wait-list sign-up. Submissions go to Netlify Forms (form "pf-waitlist"),
   registered by the static copy in public/__forms.html, which must list the
   same field names. Posts to that file, not to "/", because while the site is
   private "/" is rewritten by the gate. Moves to the database later. */

import React from "react";
import * as UI from "@/components/icons";

export const WAITLIST_FORM = "pf-waitlist";

export function WaitlistForm() {
  const [state, setState] = React.useState("idle"); // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    try {
      const data = new FormData(form);
      data.set("form-name", WAITLIST_FORM);
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  const box = { background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 10, padding: 22, boxShadow: "0 1px 2px rgba(20,36,29,0.05)" };
  const label = { display: "grid", gap: 5, fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" };
  const input = { height: 40, borderRadius: 6, border: "1px solid var(--border-default)", background: "#fff", padding: "0 11px", fontSize: 14.5, fontWeight: 400, color: "var(--ink-900)", fontFamily: "var(--font-sans)", width: "100%" };

  if (state === "sent") {
    return (
      <div id="wait-list" role="status" style={{ ...box, borderColor: "var(--green-300)", background: "var(--green-50)" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-900)" }}>You are on the list</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.55 }}>Thank you. We will be in touch when a place opens.</p>
      </div>
    );
  }

  return (
    <form id="wait-list" onSubmit={onSubmit} style={{ ...box, display: "grid", gap: 14, scrollMarginTop: 90 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-900)" }}>Join the wait list</h2>
      <p hidden><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
      <div className="pf-l-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <label style={label}>Name<input name="name" required autoComplete="name" style={input} /></label>
        <label style={label}>Work email<input name="email" type="email" required autoComplete="email" style={input} /></label>
        <label style={label}>Organisation<input name="organisation" required autoComplete="organization" style={input} /></label>
        <label style={label}>Role<input name="role" required autoComplete="organization-title" placeholder="e.g. Chair, General Counsel" style={input} /></label>
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
        <input type="checkbox" name="consent" value="yes" required style={{ marginTop: 2, width: 16, height: 16, accentColor: "var(--green-600)" }} />
        <span>Salveus Labs may contact me about Principled Futures. See the <a href="/privacy/" style={{ color: "var(--text-link)" }}>privacy page</a>.</span>
      </label>
      {state === "error" && (
        <p role="alert" style={{ fontSize: 13, color: "var(--danger, #b3261e)", lineHeight: 1.5 }}>
          That did not send. Please try again, or write to support@principledfutures.com.
        </p>
      )}
      <button type="submit" disabled={state === "sending"}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, height: 42, padding: "0 18px", borderRadius: 8, border: "none",
          cursor: state === "sending" ? "default" : "pointer", fontFamily: "var(--font-sans)", fontSize: 14.5, fontWeight: 600,
          background: "var(--brand)", color: "#fff", justifySelf: "start", opacity: state === "sending" ? 0.7 : 1 }}>
        {state === "sending" ? "Sending…" : "Join the wait list"} {state !== "sending" && <UI.IArrowRight size={15} />}
      </button>
    </form>
  );
}
