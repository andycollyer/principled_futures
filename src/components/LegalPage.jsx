"use client";
import React from "react";
import * as UI from "./icons";

/* LegalPage — shared shell for Privacy / Terms / GDPR: light chrome, reading
   column, consistent footer. */

export function LegalSection({ title, children }) {
  return (
    <section style={{ marginTop: 34 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.011em" }}>{title}</h2>
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </section>
  );
}

export function P({ children }) {
  return <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>{children}</p>;
}

export function LI({ children }) {
  return (
    <li style={{ display: "flex", gap: 10, fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.65 }}>
      <span style={{ flexShrink: 0, width: 5, height: 5, borderRadius: "50%", background: "var(--green-600)", marginTop: 9 }} />
      <span>{children}</span>
    </li>
  );
}

export function UL({ children }) {
  return <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>{children}</ul>;
}

export function LegalPage({ title, updated, children }) {
  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "var(--surface-canvas)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ background: "var(--surface-card)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <UI.Logo size={26} />
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>Principled Futures</span>
          </a>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 500, color: "var(--text-link)", textDecoration: "none" }}>
            <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><UI.IArrowRight size={14} /></span> Back to the site
          </a>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 760, width: "100%", margin: "0 auto", padding: "48px 28px 72px" }}>
        <h1 className="pf-display" style={{ fontSize: 32, color: "var(--ink-900)" }}>{title}</h1>
        <p className="pf-tnum" style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 8 }}>Last updated {updated}</p>
        {children}
      </main>

      <footer style={{ background: "var(--surface-card)", borderTop: "1px solid var(--border-subtle)", padding: "28px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>© 2026 Salveus Labs Ltd · Company no. 16939567 · 3rd Floor, 86–90 Paul Street, London EC2A 4NE</span>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="/privacy/" style={{ fontSize: 12.5, color: "var(--text-tertiary)", textDecoration: "none" }}>Privacy</a>
            <a href="/terms/" style={{ fontSize: 12.5, color: "var(--text-tertiary)", textDecoration: "none" }}>Terms</a>
            <a href="/gdpr/" style={{ fontSize: 12.5, color: "var(--text-tertiary)", textDecoration: "none" }}>GDPR</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
