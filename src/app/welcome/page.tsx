"use client";

/* The holding page shown at "/" while the site is private.

   Deliberately spare: it says what the product is and takes a wait-list
   sign-up. It shows no pricing, no assessment questions, no scoring model and
   no briefing text — the point of going private is that the substance is not
   on display while it is being built out.

   This is interim. The full landing-page redesign comes after the content
   programme, and replaces this. */

import React from "react";
import * as UI from "@/components/icons";

const PROOF = [
  { icon: <UI.IScale size={18} />, t: "Built on the instruments", b: "The UK Corporate Governance Code, the EU AI Act, the Data (Use and Access) Act 2025 and the OECD principles — read, cited and kept current." },
  { icon: <UI.IShield size={18} />, t: "Evidence, not opinion", b: "Every criterion carries a sourced brief and a reading list, reviewed on a fixed cycle rather than written once." },
  { icon: <UI.IUsers size={18} />, t: "An augmented service", b: "Software scores and drafts; a named Salveus adviser reviews and approves every report before a board sees it." },
];

export default function WelcomePage() {
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({ name: "", email: "", org: "", role: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = form.name.trim() !== "" && EMAIL.test(form.email.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    try {
      // Netlify Forms: posted as urlencoded to the page itself, matched to the
      // static form in public/__forms.html by the form-name field.
      const body = new URLSearchParams({ "form-name": "pf-waitlist", ...form });
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
    } catch {
      setError("That didn't send. Please email support@principledfutures.com and we'll add you.");
    } finally {
      setBusy(false);
    }
  };

  const field: React.CSSProperties = {
    width: "100%", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--ink-900)",
    border: "1px solid var(--border-default)", borderRadius: 8, padding: "11px 13px",
    outline: "none", background: "var(--surface-card)",
  };
  const label: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)", marginBottom: 6 };

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "var(--surface-canvas)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <section style={{ position: "relative", overflow: "hidden", background: "var(--green-600)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <header style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 28px", height: 68, display: "flex", alignItems: "center", gap: 10 }}>
            <UI.Logo inverse size={28} />
            <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: "-0.012em" }}>Principled Futures</span>
          </div>
        </header>

        <div style={{ position: "relative", maxWidth: 1040, margin: "0 auto", padding: "40px 28px 64px" }}>
          <div className="pf-r-col-2" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 44, alignItems: "start" }}>
            <div>
              <h1 className="pf-r-h1" style={{ fontSize: 42, fontWeight: 700, color: "#fff", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
                Board-level governance of AI, built on the evidence.
              </h1>
              <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.84)", lineHeight: 1.6, marginTop: 18, maxWidth: 520 }}>
                Principled Futures is an augmented advisory service from Salveus Labs: a structured
                assessment of how well a board governs its use of artificial intelligence, scored against
                a published model and reviewed by a named adviser.
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.68)", lineHeight: 1.6, marginTop: 16, maxWidth: 520 }}>
                We are deepening the research behind every criterion before we open it up again.
                Join the wait list and we will come to you first.
              </p>
            </div>

            <div style={{ background: "var(--surface-card)", borderRadius: 14, padding: 26, boxShadow: "0 18px 48px -16px rgba(20,36,29,0.45)" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "18px 4px" }}>
                  <span style={{ display: "inline-flex", width: 44, height: 44, borderRadius: 11, background: "var(--green-100)", color: "var(--green-600)", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <UI.ICheckCircle size={22} />
                  </span>
                  <h2 className="pf-display" style={{ fontSize: 19, color: "var(--ink-900)" }}>You&rsquo;re on the list</h2>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
                    We&rsquo;ll be in touch at <strong style={{ color: "var(--ink-900)" }}>{form.email}</strong> before we reopen.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} name="pf-waitlist" data-netlify="true">
                  <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)" }}>Join the wait list</h2>
                  <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, margin: "6px 0 18px" }}>
                    No charge, no obligation. We&rsquo;ll only write about Principled Futures.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                    <div><label style={label} htmlFor="w-name">Your name</label>
                      <input id="w-name" name="name" style={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Name" /></div>
                    <div><label style={label} htmlFor="w-email">Work email</label>
                      <input id="w-email" name="email" type="email" style={field} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@organisation.com" /></div>
                    <div><label style={label} htmlFor="w-org">Organisation <span style={{ fontWeight: 400, color: "var(--text-tertiary)" }}>(optional)</span></label>
                      <input id="w-org" name="org" style={field} value={form.org} onChange={(e) => set("org", e.target.value)} placeholder="Organisation name" /></div>
                    <div><label style={label} htmlFor="w-role">Your role <span style={{ fontWeight: 400, color: "var(--text-tertiary)" }}>(optional)</span></label>
                      <input id="w-role" name="role" style={field} value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Board director, CEO, General Counsel…" /></div>

                    {error && <p style={{ fontSize: 12.5, color: "var(--danger, #b3261e)", lineHeight: 1.5 }}>{error}</p>}

                    <button type="submit" disabled={!valid || busy}
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, height: 44, borderRadius: 8, border: "none",
                        cursor: valid && !busy ? "pointer" : "not-allowed", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600,
                        background: valid && !busy ? "var(--brand)" : "var(--ink-400)", color: "#fff", marginTop: 2 }}>
                      {busy ? "Sending…" : "Join the wait list"} {!busy && <UI.IArrowRight size={16} />}
                    </button>
                    <p style={{ fontSize: 11.5, color: "var(--text-tertiary)", lineHeight: 1.5 }}>
                      We use these details only to contact you about Principled Futures. See our{" "}
                      <a href="/privacy/" style={{ color: "var(--text-link)" }}>privacy policy</a>.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1040, width: "100%", margin: "0 auto", padding: "40px 28px 8px" }}>
        <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {PROOF.map((r) => (
            <div key={r.t} style={{ display: "flex", gap: 12, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 18 }}>
              <span style={{ flexShrink: 0, display: "inline-flex", width: 34, height: 34, borderRadius: 9, background: "var(--green-100)", color: "var(--green-600)", alignItems: "center", justifyContent: "center" }}>{r.icon}</span>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>{r.t}</h3>
                <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 3 }}>{r.b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ background: "var(--surface-card)", borderTop: "1px solid var(--border-subtle)", padding: "24px 0", marginTop: "auto" }}>
        <div className="pf-r-stack" style={{ maxWidth: 1040, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>© 2026 Salveus Labs Ltd · Company no. 16939567 · Registered in England &amp; Wales</span>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="/privacy/" style={{ fontSize: 12.5, color: "var(--text-tertiary)", textDecoration: "none" }}>Privacy</a>
            <a href="/terms/" style={{ fontSize: 12.5, color: "var(--text-tertiary)", textDecoration: "none" }}>Terms</a>
            <a href="/gdpr/" style={{ fontSize: 12.5, color: "var(--text-tertiary)", textDecoration: "none" }}>GDPR</a>
            <a href="/team/" style={{ fontSize: 12.5, color: "var(--text-tertiary)", textDecoration: "none" }}>Team</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
