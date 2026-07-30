"use client";
import React from "react";
import { useAuth } from "@/lib/auth";

/* MobileLogin — the phone front door. Single-column, phone-framed so it flows
   straight into the /mobile app. Mirrors the desktop auth: one combined
   email + password flow (sign in, or create on first use), a demo-mode path
   that never gates the prototype, and an escape link to the desktop version. */

const LOGO = (
  <svg width="30" height="30" viewBox="0 0 64 64" fill="none" role="img" aria-label="Principled Futures" style={{ flexShrink: 0 }}>
    <circle cx="32" cy="32" r="30" fill="#20521A" />
    <path d="M32 12 L44 32 L32 52 L20 32 Z" fill="#ffffff" />
    <path d="M32 12 L44 32 L32 32 Z" fill="#20521A" fillOpacity="0.28" />
  </svg>
);

function Field({ label, children }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: "var(--ink-500)", marginBottom: 7 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  height: 50,
  padding: "0 14px",
  border: "1px solid var(--ink-300)",
  borderRadius: 8,
  fontSize: 15,
  fontFamily: "var(--font-sans)",
  color: "var(--ink-900)",
  background: "var(--surface-card)",
  boxSizing: "border-box",
  outline: "none",
};

export function MobileLogin({ onAuth, onDesktop }) {
  const { configured, signInPassword, signUpPassword } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(null);
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // One combined flow: enter email + password and Continue. If an account
  // exists we sign in; if not, we create it. No modes to remember.
  const submit = async () => {
    if (!EMAIL.test(email.trim())) { setError("Enter a valid work email."); return; }
    if (password.length < 8) { setError("Pick a password of at least 8 characters."); return; }
    setBusy(true); setError(null);
    const signIn = await signInPassword(email.trim(), password);
    if (signIn.error && /don't match/i.test(signIn.error)) {
      const created = await signUpPassword(email.trim(), password);
      if (!created.error) { onAuth(); return; }
      setBusy(false);
      setError(/already exists|already registered/i.test(created.error)
        ? "That password doesn't match the account for this email."
        : created.error);
      return;
    }
    setBusy(false);
    if (signIn.error) setError(signIn.error); else onAuth();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", background: "#e7e9ea", fontFamily: "var(--font-sans)" }}>
      <div style={{ width: 420, maxWidth: "100%", minHeight: "100vh", background: "var(--surface-card)", borderLeft: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column" }}>

        {/* Brand bar */}
        <div style={{ flexShrink: 0, height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 22px", borderBottom: "1px solid var(--ink-300)" }}>
          {LOGO}
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.014em" }}>Principled Futures</span>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "28px 22px 40px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink-900)", margin: 0, letterSpacing: "-0.022em", lineHeight: 1.2 }}>Board oversight, in your pocket.</h1>
          <p style={{ fontSize: 13.5, color: "var(--ink-500)", margin: "8px 0 26px", lineHeight: 1.5 }}>Sign in, or enter a new email and password to create your account.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Work email">
              <input type="email" inputMode="email" autoComplete="email" placeholder="director@acme.com" value={email}
                onChange={(e) => setEmail(e.target.value)} style={inputStyle}
                onKeyDown={(e) => { if (e.key === "Enter" && configured) submit(); }} />
            </Field>
            <Field label="Password">
              <input type="password" autoComplete="current-password" placeholder="At least 8 characters" value={password}
                onChange={(e) => setPassword(e.target.value)} style={inputStyle}
                onKeyDown={(e) => { if (e.key === "Enter" && configured) submit(); }} />
            </Field>

            {error && <div style={{ fontSize: 12.5, color: "var(--status-danger)", lineHeight: 1.5 }}>{error}</div>}

            {configured ? (
              <button onClick={submit} disabled={busy} style={{ height: 52, border: "none", borderRadius: 8, background: "var(--ink-900)", color: "#fff", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}>
                {busy ? "Please wait…" : "Continue"}
              </button>
            ) : (
              <button onClick={onAuth} style={{ height: 52, border: "none", borderRadius: 8, background: "var(--ink-900)", color: "#fff", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Sign in
              </button>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "2px 0" }}>
              <span style={{ flex: 1, height: 1, background: "var(--ink-200)" }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "var(--ink-400)" }}>OR</span>
              <span style={{ flex: 1, height: 1, background: "var(--ink-200)" }} />
            </div>

            <button onClick={onAuth} style={{ height: 52, border: "1px solid var(--ink-300)", borderRadius: 8, background: "var(--surface-card)", color: "var(--ink-900)", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>
              Continue in demo mode
            </button>
            <p style={{ fontSize: 12, color: "var(--ink-400)", textAlign: "center", lineHeight: 1.5, margin: 0 }}>
              Demo mode keeps your work on this device only.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 22px 24px", borderTop: "1px solid var(--ink-200)" }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-400)" }}>A Salveus Labs product</span>
          <button onClick={onDesktop} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 500, color: "var(--green-700)" }}>
            Use the desktop version
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
