"use client";
import React from "react";
import * as UI from "./icons";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/* ContactModal — the "Talk to us" enquiry form: name/email + sector, role and
   organisation-size dropdowns. Shared by the landing and pricing pages.
   Sends straight to our database and confirms on screen. Enquiries are
   write-only from the browser (see 0006_enquiries.sql) — they can be lodged
   but never read back out. If the backend is unreachable we fall back to the
   visitor's email client rather than losing the enquiry. */

export const SECTORS = ["Financial services", "Professional services", "Technology & software", "Healthcare & life sciences", "Manufacturing & industrials", "Retail & consumer", "Energy & utilities", "Public sector & education", "Charity & non-profit", "Other"];
export const ROLES = ["Board director / Non-executive", "Chief Executive", "Chief Financial Officer", "Chief Risk / Compliance Officer", "Chief Technology / AI Officer", "General Counsel / Legal", "Company Secretary", "Consultant / Adviser", "Other"];
export const ORG_SIZES = ["Under 50 employees", "50–250 employees", "250–1,000 employees", "Over 1,000 employees"];

export function ContactModal({ onClose, intent = "" }) {
  const [form, setForm] = React.useState({ name: "", email: "", org: "", sector: "", role: "", size: "", message: intent });
  const [entered, setEntered] = React.useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setEntered(true);
    else requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = form.name.trim() && EMAIL.test(form.email.trim());
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [sendError, setSendError] = React.useState("");

  const mailtoFallback = () => {
    const body = [
      `Name: ${form.name}`, `Email: ${form.email}`, form.org && `Organisation: ${form.org}`,
      form.sector && `Sector: ${form.sector}`, form.role && `Role: ${form.role}`, form.size && `Organisation size: ${form.size}`,
      "", form.message || "(no message)",
    ].filter((l) => l !== false && l !== "").join("\n");
    window.location.href = `mailto:support@principledfutures.com?subject=${encodeURIComponent("Enquiry — Principled Futures")}&body=${encodeURIComponent(body)}`;
  };

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setSendError("");
    if (!isSupabaseConfigured || !supabase) { mailtoFallback(); onClose(); return; }
    const { error } = await supabase.from("enquiries").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      org: form.org.trim() || null,
      sector: form.sector || null,
      role: form.role || null,
      org_size: form.size || null,
      message: form.message.trim() || null,
      intent: intent || null,
      source: typeof window !== "undefined" ? window.location.pathname : null,
    });
    setBusy(false);
    if (error) { setSendError("We couldn't send that just now."); return; }
    setSent(true);
  };

  const EASE = "cubic-bezier(0.16,1,0.3,1)";
  const label = { display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)", marginBottom: 6 };
  const field = { width: "100%", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink-900)", border: "1px solid var(--border-default)", borderRadius: 8, padding: "9px 12px", outline: "none", background: "var(--surface-card)" };
  const select = { ...field, appearance: "none", WebkitAppearance: "none", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235b6470' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32, cursor: "pointer" };

  const Field = ({ k, children }) => (
    <div>
      <label style={label}>{children}</label>
      <select value={form[k]} onChange={(e) => set(k, e.target.value)} style={select}>
        <option value="">Select…</option>
        {(k === "sector" ? SECTORS : k === "role" ? ROLES : ORG_SIZES).map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  if (sent) {
    return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(17,27,22,0.5)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "14vh", overflowY: "auto" }}>
        <div onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Enquiry sent"
          style={{ width: "calc(100% - 40px)", maxWidth: 460, background: "var(--surface-card)", borderRadius: 16, border: "1px solid var(--border-subtle)", boxShadow: "0 28px 72px -18px rgba(20,36,29,0.4)", overflow: "hidden", textAlign: "center", padding: "34px 28px 28px" }}>
          <span style={{ display: "inline-flex", width: 48, height: 48, borderRadius: 12, background: "var(--green-100)", color: "var(--green-600)", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <UI.ICheckCircle size={24} />
          </span>
          <h2 className="pf-display" style={{ fontSize: 21, color: "var(--ink-900)" }}>Thank you — that&rsquo;s with us</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 10 }}>
            We&rsquo;ve received your enquiry and will reply to <strong style={{ color: "var(--ink-900)" }}>{form.email}</strong>, usually within one working day.
          </p>
          <button onClick={onClose} style={{ marginTop: 20, height: 40, padding: "0 20px", fontSize: 14, fontWeight: 500, color: "#fff", background: "var(--ink-900)", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-sans)" }}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(17,27,22,0.5)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "7vh", opacity: entered ? 1 : 0, transition: `opacity 160ms ${EASE}`, overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Contact us"
        style={{ width: "calc(100% - 40px)", maxWidth: 560, background: "var(--surface-card)", borderRadius: 16, border: "1px solid var(--border-subtle)", boxShadow: "0 28px 72px -18px rgba(20,36,29,0.4)", overflow: "hidden", marginBottom: "7vh",
          transform: entered ? "none" : "translateY(-10px) scale(0.98)", opacity: entered ? 1 : 0, transition: `transform 200ms ${EASE}, opacity 200ms ${EASE}` }}>
        <div style={{ position: "relative", overflow: "hidden", background: "var(--green-600)", padding: "22px 24px" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 className="pf-display" style={{ fontSize: 21, color: "#fff", letterSpacing: "-0.012em" }}>Talk to us</h2>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.82)", marginTop: 4, maxWidth: 400, lineHeight: 1.5 }}>Tell us a little about your organisation and we&rsquo;ll be in touch.</p>
            </div>
            <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, display: "grid", placeItems: "center", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, background: "transparent", cursor: "pointer", color: "#fff" }}>✕</button>
          </div>
        </div>

        <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={label}>Your name</label><input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Name" style={field} /></div>
            <div><label style={label}>Work email</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@organisation.com" style={field} /></div>
          </div>
          <div><label style={label}>Organisation <span style={{ fontWeight: 400, color: "var(--text-tertiary)" }}>(optional)</span></label><input value={form.org} onChange={(e) => set("org", e.target.value)} placeholder="Organisation name" style={field} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field k="sector">Your sector</Field>
            <Field k="role">Your role</Field>
          </div>
          <Field k="size">Organisation size</Field>
          <div><label style={label}>Message <span style={{ fontWeight: 400, color: "var(--text-tertiary)" }}>(optional)</span></label>
            <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={3} placeholder="What would you like to know?" style={{ ...field, resize: "vertical", lineHeight: 1.5 }} /></div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "var(--surface-sunken)", borderRadius: 8, padding: "10px 12px" }}>
            <UI.ILock size={14} color="var(--text-tertiary)" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>We&rsquo;ll use these details to reply to your enquiry and for nothing else. See our <a href="/privacy/" style={{ color: "var(--text-link)" }}>privacy policy</a>.</p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 24px", borderTop: "1px solid var(--border-subtle)", background: "var(--surface-sunken)" }}>
          <button onClick={onClose} style={{ height: 38, padding: "0 16px", fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", background: "transparent", border: "1px solid var(--border-default)", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-sans)" }}>Cancel</button>
          {sendError && <span style={{ fontSize: 12.5, color: "var(--danger, #b3261e)", marginRight: "auto", alignSelf: "center" }}>{sendError} <button onClick={() => { mailtoFallback(); onClose(); }} style={{ color: "var(--text-link)", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 12.5, textDecoration: "underline" }}>Email us instead</button></span>}
          <button onClick={submit} disabled={!valid || busy} style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 38, padding: "0 18px", fontSize: 14, fontWeight: 500, color: "#fff", background: valid && !busy ? "var(--ink-900)" : "var(--ink-400)", border: "none", borderRadius: 8, cursor: valid && !busy ? "pointer" : "not-allowed", fontFamily: "var(--font-sans)" }}>{busy ? "Sending\u2026" : "Send enquiry"} {!busy && <UI.IArrowRight size={15} />}</button>
        </div>
      </div>
    </div>
  );
}
