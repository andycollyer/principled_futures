"use client";
import React from "react";
import * as DSlog from "./ds";
import * as UI from "./icons";
import { useAuth } from "@/lib/auth";
/* Login — split corporate auth screen. Real magic-link sign-in when the
   backend is configured; a demo-mode path always available so the prototype
   is never gated behind a login. */

function Login({ onAuth, onBack, onDemo, mode = "signin" }) {
  const signup = mode === "signup";
  const { configured, signInPassword, signUpPassword } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [notice, setNotice] = React.useState(null);
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // One combined flow: enter email + password and Continue. If an account
  // exists we sign in; if not, we create it (the password you pick becomes
  // your account password). No modes, no "create first" step to remember.
  const submit = async () => {
    if (!EMAIL.test(email.trim())) { setError("Enter a valid work email."); return; }
    if (password.length < 8) { setError("Pick a password of at least 8 characters."); return; }
    setBusy(true); setError(null); setNotice(null);
    const signIn = await signInPassword(email.trim(), password);
    if (signIn.error && /don't match/i.test(signIn.error)) {
      // No account yet (or wrong password) — try to create one.
      const created = await signUpPassword(email.trim(), password);
      if (!created.error) { onAuth(); return; } // new account, signed in
      setBusy(false);
      setError(/already exists|already registered/i.test(created.error)
        ? "That password doesn't match the account for this email."
        : created.error);
      return;
    }
    setBusy(false);
    if (signIn.error) setError(signIn.error); else onAuth();
  };

  const forgot = () => {
    if (!EMAIL.test(email.trim())) { setError("Enter your email above first."); return; }
    setError(null);
    setNotice("Password reset by email is being set up. For now, use the password you chose — or continue in demo mode.");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
      {/* Brand panel */}
      <div style={{ position: "relative", background: "var(--green-600)", padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={onBack}>
          <UI.Logo inverse size={30} />
          <span style={{ fontSize: 16, fontWeight: 600, color: "#fff", letterSpacing: "-0.012em" }}>Principled Futures</span>
        </div>
        <div style={{ position: "relative", maxWidth: 420 }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em" }}>We do not just predict the future; we govern it.</h2>
          <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.78)", marginTop: 16, lineHeight: 1.6 }}>Board-level oversight of ESG performance and Ethical AI — bridging the gap between policy and practice.</p>
        </div>
        <span style={{ position: "relative", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>A Salveus Labs Product</span>
      </div>

      {/* Form */}
      <div style={{ display: "grid", placeItems: "center", padding: 48, background: "var(--surface-card)" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>{signup ? "Create your account" : "Sign in or create an account"}</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6, marginBottom: 28 }}>
            {signup
              ? "Choose a password and your account is created instantly \u2014 no confirmation email to wait for. Already have one? Enter it below and you\u2019ll simply be signed in."
              : "Enter your email and a password. New here? Your account is created automatically."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <DSlog.FormField label="Work email">
              <DSlog.Input type="email" placeholder="director@acme.com" value={email} onChange={(e) => setEmail(e.target.value)} invalid={!!error}
                onKeyDown={(e) => { if (e.key === "Enter" && configured) submit(); }} />
            </DSlog.FormField>
            <DSlog.FormField label="Password" error={error}>
              <DSlog.Input type="password" placeholder="At least 8 characters" value={password} invalid={!!error}
                iconRight={<UI.ILock size={15} />} onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && configured) submit(); }} />
            </DSlog.FormField>

            {notice && (
              <div style={{ fontSize: 12.5, color: "var(--text-secondary)", background: "var(--surface-sunken)", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 }}>{notice}</div>
            )}

            {configured ? (
              <>
                <DSlog.Button variant="primary" block disabled={busy} onClick={submit}>
                  {busy ? "Please wait…" : "Continue"}
                </DSlog.Button>
                <div style={{ textAlign: "center" }}>
                  <button onClick={forgot} style={{ fontSize: 13, color: "var(--text-link)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", padding: 0 }}>Forgot your password?</button>
                </div>
              </>
            ) : (
              <DSlog.Button variant="primary" block onClick={onAuth}>Sign in</DSlog.Button>
            )}

            <DSlog.Divider label="OR" />
            <DSlog.Button variant="outline" block onClick={onDemo || onAuth}>Try the first domain without an account</DSlog.Button>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", textAlign: "center", lineHeight: 1.5 }}>
              Answer the first eight questions on this device. Create an account to see your score, keep your answers and open the library.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Login };
