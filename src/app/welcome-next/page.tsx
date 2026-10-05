"use client";

/* The landing page (draft, team-only at /welcome-next until Andy approves it;
   then it replaces /welcome, which the privacy gate serves at "/").

   Same shape as SLG³'s landing page: a headline, a wait-list form, the product
   shown in motion without readable content, proof points, how early access
   works. Every figure comes from the product's own data (LIBRARY_STATS), so the
   page cannot claim more than the product holds. No pricing, no question
   wording, no brief text. Flat: one action colour, no gradients or glows. */

import React from "react";
import * as UI from "@/components/icons";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { DomainRing, ScoreCard, EvidencePanel, BriefShape } from "@/components/landing/Visuals";
import { LIBRARY_STATS } from "@/lib/content-meta";

const wrap: React.CSSProperties = { maxWidth: 1120, margin: "0 auto", padding: "0 28px" };
const n = (v: number) => v.toLocaleString("en-GB");

export default function LandingPage() {
  const points = [
    { figure: "64", text: "criteria across eight domains, from board accountability to security, workforce and sustainability" },
    { figure: n(LIBRARY_STATS.documents), text: "published sources read and cited behind them: legislation, regulators, standards, court judgments and research" },
    { figure: n(LIBRARY_STATS.anchors), text: "quotations and figures re-read against their sources every day, so a brief is corrected when the law moves" },
  ];
  const steps = [
    { title: "Join the list", text: "Tell us who you are and which organisation you would assess." },
    { title: "We open places in small groups", text: "Early organisations complete the assessment first and help us calibrate it." },
    { title: "Your board sees where it stands", text: "A scored position across eight domains, with the evidence behind every criterion." },
  ];
  const btn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 7, height: 38, padding: "0 16px", borderRadius: 8, background: "var(--brand)", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" };

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ ...wrap, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <UI.Logo size={28} />
            <span style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>Principled Futures</span>
          </span>
          <a href="#wait-list" style={btn}>Join the wait list</a>
        </div>
      </header>

      <main id="main" style={{ flex: 1 }}>
        <section style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="pf-l-hero" style={{ ...wrap, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", paddingTop: 52, paddingBottom: 56 }}>
            <div>
              <h1 className="pf-l-h1" style={{ fontSize: 44, fontWeight: 700, color: "var(--ink-900)", lineHeight: 1.12, letterSpacing: "-0.022em" }}>
                Know how well your board governs its AI
              </h1>
              <p style={{ fontSize: 17.5, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 18, maxWidth: 520 }}>
                Principled Futures is a 64-criterion assessment for boards, from Salveus Labs. Each criterion rests on
                an evidence brief checked against the law, the regulators and the research. We are opening to a small
                number of organisations first.
              </p>
              <div style={{ marginTop: 28 }}><WaitlistForm /></div>
              <div style={{ marginTop: 20 }}><BriefShape /></div>
            </div>

            <figure style={{ margin: 0, display: "grid", gap: 16 }}>
              <DomainRing />
              <div className="pf-l-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
                <ScoreCard />
                <EvidencePanel />
              </div>
              <figcaption style={{ fontSize: 13, color: "var(--text-tertiary)", lineHeight: 1.5 }}>
                From the product: the structure of the assessment, an illustrative result for a fictional organisation,
                and the make-up of the evidence base.
              </figcaption>
            </figure>
          </div>
        </section>

        <section style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--surface-canvas)" }}>
          <ul className="pf-l-three" style={{ ...wrap, listStyle: "none", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, paddingTop: 52, paddingBottom: 52 }}>
            {points.map((p) => (
              <li key={p.text}>
                <p className="pf-tnum" style={{ fontSize: 36, fontWeight: 700, color: "var(--green-600)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>{p.figure}</p>
                <p style={{ fontSize: 15.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 8 }}>{p.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div style={{ ...wrap, paddingTop: 60, paddingBottom: 64 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-0.015em" }}>How early access works</h2>
            <ol className="pf-l-three" style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {steps.map((s, i) => (
                <li key={s.title} style={{ border: "1px solid var(--border-default)", borderRadius: 10, padding: 20, background: "#fff" }}>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-tertiary)" }}>Step {i + 1}</p>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-900)", marginTop: 4 }}>{s.title}</h3>
                  <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 4 }}>{s.text}</p>
                </li>
              ))}
            </ol>
            <a href="#wait-list" style={{ ...btn, height: 44, padding: "0 20px", fontSize: 15, marginTop: 28 }}>Join the wait list <UI.IArrowRight size={16} /></a>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="pf-r-stack" style={{ ...wrap, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14, paddingTop: 22, paddingBottom: 22, fontSize: 13, color: "var(--text-tertiary)" }}>
          <p>© 2026 Salveus Labs Ltd · Company no. 16939567 · London</p>
          <nav aria-label="Footer" style={{ display: "flex", gap: 20 }}>
            <a href="/privacy/" style={{ color: "inherit", textDecoration: "none" }}>Privacy</a>
            <a href="/terms/" style={{ color: "inherit", textDecoration: "none" }}>Terms</a>
            <a href="/gdpr/" style={{ color: "inherit", textDecoration: "none" }}>GDPR</a>
            <a href="/team/" style={{ color: "inherit", textDecoration: "none" }}>Team log-in</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
