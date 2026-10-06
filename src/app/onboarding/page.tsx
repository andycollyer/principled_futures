"use client";

/* First sign-in: who the client is. Five answers, asked once, used across the
   product and on the report. Also reachable from Settings to change them. */

import React from "react";
import { useRouter } from "next/navigation";
import * as DS from "@/components/ds";
import * as UI from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { useOrg, SECTORS, SIZES } from "@/lib/org";

export default function OnboardingPage() {
  const router = useRouter();
  const { ready: authReady, configured, session } = useAuth();
  const { ready, details, complete, save } = useOrg();
  const [form, setForm] = React.useState({ orgName: "", sector: "", size: "", fullName: "", jobTitle: "" });
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const editing = React.useRef(false);

  React.useEffect(() => {
    if (authReady && (!configured || !session)) router.replace("/signup/?next=%2Fonboarding%2F");
  }, [authReady, configured, session, router]);

  React.useEffect(() => {
    if (!details) return;
    editing.current = complete;
    // An organisation starts out named after the email domain; don't offer that back as if it were chosen.
    const placeholderName = !details.sector && details.orgName.includes(".");
    setForm({ orgName: placeholderName ? "" : details.orgName, sector: details.sector, size: details.size, fullName: details.fullName, jobTitle: details.jobTitle });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  if (!authReady || !ready || !session) return null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = Object.values(form).every((v) => v.trim() !== "");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true); setError(null);
    const err = await save(form);
    setBusy(false);
    if (err) { setError("That didn't save. Please try again, or email support@principledfutures.com."); return; }
    router.push(editing.current ? "/dashboard/settings" : "/dashboard");
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "#fff", minHeight: "100vh", display: "grid", placeItems: "center", padding: 28 }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
          <UI.Logo size={28} />
          <span style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>Principled Futures</span>
        </div>
        <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>{editing.current ? "Your organisation" : "Tell us who this is for"}</h1>
        <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.55, margin: "8px 0 24px" }}>
          Your assessment and report are written for your organisation and addressed to you. These details appear on the report your board reads.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <DS.FormField label="Organisation name" required>
            <DS.Input id="ob-org" value={form.orgName} onChange={set("orgName")} placeholder="As it should appear on the report" />
          </DS.FormField>
          <DS.FormField label="Sector" required>
            <DS.Select id="ob-sector" value={form.sector} onChange={set("sector")}>
              <option value="">Choose a sector</option>
              {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
            </DS.Select>
          </DS.FormField>
          <DS.FormField label="Size" required>
            <DS.Select id="ob-size" value={form.size} onChange={set("size")}>
              <option value="">Choose a size</option>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </DS.Select>
          </DS.FormField>
          <DS.FormField label="Your name" required>
            <DS.Input id="ob-name" value={form.fullName} onChange={set("fullName")} placeholder="Name" />
          </DS.FormField>
          <DS.FormField label="Your role" required hint="e.g. Chair, Non-executive director, Chief Executive, General Counsel">
            <DS.Input id="ob-role" value={form.jobTitle} onChange={set("jobTitle")} placeholder="Role" />
          </DS.FormField>
          {error && <p style={{ fontSize: 13, color: "var(--status-danger)" }}>{error}</p>}
          <DS.Button type="submit" variant="primary" block disabled={!valid || busy}>{busy ? "Saving…" : editing.current ? "Save" : "Continue"}</DS.Button>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--text-tertiary)", lineHeight: 1.5, marginTop: 16 }}>
          Used to address your report and, in time, to compare you with similar organisations. See our <a href="/privacy/" style={{ color: "var(--text-link)" }}>privacy policy</a>.
        </p>
      </form>
    </div>
  );
}
