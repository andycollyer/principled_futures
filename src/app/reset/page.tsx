"use client";

/* Set a new password. Reached from the link in the password-reset email, which
   signs the person in for this one purpose. */

import React from "react";
import { useRouter } from "next/navigation";
import * as DS from "@/components/ds";
import * as UI from "@/components/icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export default function ResetPage() {
  const router = useRouter();
  const { ready, session, authError } = useAuth();
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Pick a password of at least 8 characters."); return; }
    if (!supabase) return;
    setBusy(true); setError(null);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  };

  const expired = ready && !session;
  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "#fff", minHeight: "100vh", display: "grid", placeItems: "center", padding: 28 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
          <UI.Logo size={28} />
          <span style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>Principled Futures</span>
        </div>
        <h1 className="pf-display" style={{ fontSize: 24, color: "var(--ink-900)" }}>Choose a new password</h1>
        {!ready ? null : expired ? (
          <>
            <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.55, margin: "8px 0 20px" }}>
              {authError ?? "This reset link has expired or has already been used."} Ask for a new one from the sign-in page.
            </p>
            <DS.Button variant="primary" block onClick={() => router.push("/login")}>Back to sign in</DS.Button>
          </>
        ) : done ? (
          <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 8 }}>Password changed. Taking you in…</p>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
            <DS.FormField label="New password" error={error}>
              <DS.Input id="reset-password" type="password" placeholder="At least 8 characters" value={password} invalid={!!error}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
            </DS.FormField>
            <DS.Button type="submit" variant="primary" block disabled={busy}>{busy ? "Saving…" : "Save new password"}</DS.Button>
          </form>
        )}
      </div>
    </div>
  );
}
