"use client";
import React from "react";
import * as UI from "./icons";
import { BRIEFINGS } from "@/lib/briefing-content";

/* BriefingPage — the localised AI Act timeline lead magnet. Green hero with
   6% grid, timeline cards, danger callout, three numbered moves, ink CTA
   band, date-stamp footer. Language switcher + email capture. */

const TONE = {
  success: { fg: "var(--status-success)", bg: "var(--status-success-bg)" },
  warning: { fg: "var(--status-warning)", bg: "var(--status-warning-bg)" },
  info: { fg: "var(--status-info)", bg: "var(--status-info-bg)" },
  danger: { fg: "var(--status-danger)", bg: "var(--status-danger-bg)" },
};

export function BriefingPage({ b }) {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Root layout renders <html lang="en-GB">; set the correct document
  // language for this localised page so assistive tech reads it right.
  React.useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = b.lang;
    return () => { document.documentElement.lang = prev; };
  }, [b.lang]);

  const capture = (e) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) return;
    // No capture backend yet — persist to the local store seam so the lead is
    // not lost, and confirm. Replaces with a real endpoint in the email phase.
    try {
      const key = "pf-briefing-leads-v1";
      const prev = JSON.parse(window.localStorage.getItem(key) || "[]");
      prev.push({ email: email.trim(), lang: b.lang, path: b.path });
      window.localStorage.setItem(key, JSON.stringify(prev));
    } catch {}
    setSent(true);
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "var(--surface-canvas)", minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--green-600)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div style={{ position: "relative", maxWidth: 860, margin: "0 auto", padding: "20px 28px 56px" }}>
          {/* Top row: brand + language switcher */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 48 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <UI.Logo inverse size={26} />
              <span style={{ fontSize: 14.5, fontWeight: 600, color: "#fff", letterSpacing: "-0.012em" }}>Principled Futures</span>
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {BRIEFINGS.map((o) => (
                o.lang === b.lang
                  ? <span key={o.lang} style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{o.switcherLabel}</span>
                  : <a key={o.lang} href={`${o.path}/`} hrefLang={o.lang} style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>{o.switcherLabel}</a>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.72)", marginBottom: 14 }}>{b.meta}</div>
            <h1 className="pf-r-h1" style={{ fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1.12, letterSpacing: "-0.02em", maxWidth: 720 }}>{b.h1}</h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.6, marginTop: 18, maxWidth: 620 }}>{b.sub}</p>
          </div>
        </div>
      </section>

      {/* Email capture row */}
      <div style={{ maxWidth: 860, margin: "-28px auto 0", padding: "0 28px", position: "relative", zIndex: 2 }}>
        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 14, boxShadow: "var(--shadow-md)", padding: "18px 20px" }}>
          {sent ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500, color: "var(--green-700)" }}>
              <UI.ICheckCircle size={18} /> {b.captureThanks}
            </div>
          ) : (
            <form onSubmit={capture} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <label htmlFor="pf-capture" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)", flexShrink: 0 }}>{b.captureLabel}</label>
              <div style={{ display: "flex", gap: 8, flex: 1, minWidth: 260 }}>
                <input id="pf-capture" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={b.capturePlaceholder}
                  style={{ flex: 1, height: 40, border: "1px solid var(--border-default)", borderRadius: 8, padding: "0 12px", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink-900)", outline: "none" }} />
                <button type="submit" style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 40, padding: "0 16px", border: "none", borderRadius: 8, background: "var(--ink-900)", color: "#fff", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>{b.captureButton}</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Timeline */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "44px 28px 8px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {b.timeline.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 18, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, boxShadow: "var(--shadow-card)", padding: "18px 20px" }}>
              <div className="pf-tnum" style={{ flexShrink: 0, width: 96, fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>{t.date}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.35 }}>{t.title}</h3>
                  <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 600, color: TONE[t.tone].fg, background: TONE[t.tone].bg, borderRadius: 999, padding: "3px 10px" }}>{t.badge}</span>
                </div>
                <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 6 }}>{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Danger callout */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "16px 28px" }}>
        <div style={{ display: "flex", gap: 16, background: "var(--status-danger-bg)", border: "1px solid var(--status-danger)", borderRadius: 12, padding: "20px 22px" }}>
          <UI.IAlert size={22} color="var(--status-danger)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--status-danger)", letterSpacing: "-0.008em" }}>{b.calloutTitle}</h3>
            <p style={{ fontSize: 14, color: "var(--ink-800, var(--ink-900))", lineHeight: 1.6, marginTop: 8 }}>{b.calloutBody}</p>
          </div>
        </div>
      </section>

      {/* Three moves */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "28px 28px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-tertiary)", marginBottom: 16 }}>{b.movesLabel}</div>
        <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {b.moves.map((m) => (
            <div key={m.n} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, boxShadow: "var(--shadow-card)", padding: 22 }}>
              <span className="pf-tnum" style={{ display: "inline-grid", placeItems: "center", width: 30, height: 30, borderRadius: 8, background: "var(--green-100)", color: "var(--green-700)", fontSize: 14, fontWeight: 700 }}>{m.n}</span>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", marginTop: 12, lineHeight: 1.35 }}>{m.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 6 }}>{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ink CTA band */}
      <section style={{ background: "var(--ink-900)", padding: "56px 0", textAlign: "center", marginTop: 16 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 28px" }}>
          <h2 className="pf-display" style={{ fontSize: 30, color: "#fff", letterSpacing: "-0.012em" }}>{b.ctaTitle}</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.6, marginTop: 14, maxWidth: 500, marginInline: "auto" }}>{b.ctaBody}</p>
          <a href="/dashboard/assessment/" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 46, padding: "0 26px", marginTop: 24, fontSize: 15, fontWeight: 600, color: "var(--green-700)", background: "#fff", borderRadius: 10, textDecoration: "none" }}>{b.ctaButton} <UI.IArrowRight size={16} /></a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--surface-card)", borderTop: "1px solid var(--border-subtle)", padding: "24px 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 28px" }}>
          <p style={{ fontSize: 12.5, color: "var(--text-tertiary)", lineHeight: 1.6 }}>{b.footer}</p>
        </div>
      </footer>
    </div>
  );
}
