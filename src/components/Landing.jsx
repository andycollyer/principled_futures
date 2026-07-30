"use client";
import React from "react";
import * as DSl from "./ds";
import * as UI from "./icons";
import { ContactModal } from "./ContactModal";
/* Landing — overhauled corporate marketing page. No kicker eyebrows. */


const PILLARS = [
  { icon: <UI.ILeaf size={20} />, k: "ESG Performance", body: "Environmental stewardship, social responsibility and governance integrity — scored against your sector and scale.",
    points: ["Green-AI carbon caps", "Social equity, DEI & wellbeing", "Board governance & transparency", "Supply-chain accountability"] },
  { icon: <UI.IShield size={20} />, k: "Ethical AI Adoption", body: "How responsibly your organisation deploys and governs AI — from the boardroom to the model.",
    points: ["AI governance & board oversight", "Bias detection & fairness auditing", "Shadow-AI & kill-switch readiness", "Transparency & explainability"] },
];

const JOURNEY = [
  { n: "01", t: "Situational Assessment", b: "Sector, size, maturity and priorities tune the framework before a single question is asked." },
  { n: "02", t: "Data Integration", b: "Connect Companies House for automated filing analysis, or upload your own disclosures." },
  { n: "03", t: "The 8×8 Assessment", b: "64 board-level dimensions across ESG and AI ethics, scored to a maturity baseline." },
  { n: "04", t: "Advisory Report", b: "A board-ready report: scores, risk flags, peer benchmarks and a prioritised roadmap." },
];

const PLATFORM = [
  { icon: "IList", t: "The 8×8 assessment", b: "Sixty-four board-level criteria across eight domains, each scored 0–4 against defined maturity bands — Initial to Leading — and autosaved as you go.", stat: "64 criteria · 8 domains" },
  { icon: "IFile", t: "The advisory report", b: "A board-ready draft assembled from your scores: executive summary, priority risks with accountable owners, quarter-on-quarter movement, and a sequenced roadmap. Downloadable as a board pack.", stat: "5 sections · print-ready" },
  { icon: "IPulse", t: "Continuous telemetry", b: "Eleven governance measures with thresholds, breach alerts and 30-day trends — point-in-time audits replaced by a live register your board can actually read.", stat: "11 measures · live thresholds" },
  { icon: "IUsers", t: "Named accountability", b: "Every measure belongs to one named person in one of three rings — run it, steer it, check it. If a number has no name, it isn't governed — it's just displayed.", stat: "3 rings · every measure owned" },
  { icon: "IDoc", t: "The research library", b: "Sixty-four criterion briefings — one for every assessment question — alongside twelve board papers. UK and EU regulatory position current to July 2026.", stat: "64 briefings · 12 papers" },
  { icon: "IClock", t: "The regulatory horizon", b: "Article 50 disclosure, watermarking deadlines and the DUAA's automated-decision regime, tracked to the day — the countdown sits inside your telemetry, not in a newsletter.", stat: "Deadlines counted down, daily" },
];

/* Minimal scroll-reveal: fade + rise once, 280ms, honours prefers-reduced-motion. */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) { setOn(true); return; }
    const el = ref.current;
    if (!el) { setOn(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setOn(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(12px)", transition: `opacity 280ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 280ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function LandingNav({ onEnter }) {
  return (
    <header style={{ position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <UI.Logo inverse size={28} />
          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: "-0.012em" }}>Principled Futures</span>
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <span className="pf-r-hide" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <a href="#approach" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", cursor: "pointer", textDecoration: "none" }}>Approach</a>
            <a href="#platform" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", cursor: "pointer", textDecoration: "none" }}>Platform</a>
            <a href="#journey" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", cursor: "pointer", textDecoration: "none" }}>How it works</a>
            <a href="/pricing/" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", cursor: "pointer", textDecoration: "none" }}>Pricing</a>
            <button onClick={onEnter} style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", background: "none", border: "none", cursor: "pointer" }}>Sign in</button>
          </span>
          <button onClick={onEnter} style={{ fontSize: 13.5, fontWeight: 600, color: "var(--green-700)", background: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer", whiteSpace: "nowrap" }}>Begin assessment</button>
        </nav>
      </div>
    </header>
  );
}

function Landing({ onEnter }) {
  const [contactOpen, setContactOpen] = React.useState(false);
  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "var(--surface-canvas)" }}>
      {/* Hero */}
      <section style={{ position: "relative", background: "var(--green-600)", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <LandingNav onEnter={onEnter} />
        <div className="pf-r-hero-pad" style={{ position: "relative", maxWidth: 1120, margin: "0 auto", padding: "64px 28px 150px" }}>
          <div style={{ maxWidth: 720 }}>
            <h1 className="pf-r-h1" style={{ fontSize: 56, fontWeight: 700, color: "#fff", lineHeight: 1.06, letterSpacing: "-0.02em" }}>Govern AI like it&rsquo;s on your balance sheet.</h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", lineHeight: 1.55, marginTop: 22, maxWidth: 560 }}>
              AI governance is the steering and suspension that lets your board move faster — and more safely. Assess, report and continuously oversee responsible AI, without needing a Chief AI Officer.
            </p>
            <div className="pf-r-wrap" style={{ display: "flex", gap: 12, marginTop: 30 }}>
              <button onClick={onEnter} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, padding: "0 26px", fontSize: 15, fontWeight: 600, color: "var(--green-700)", background: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }}>Begin your assessment <UI.IArrowRight size={16} /></button>
              <button onClick={onEnter} style={{ height: 48, padding: "0 26px", fontSize: 15, fontWeight: 500, color: "#fff", background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, cursor: "pointer" }}>See how it works</button>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 22 }}>Board-ready in under an hour · No technical setup · Grounded in OECD &amp; the EU AI Act</p>
          </div>
        </div>
      </section>

      {/* Floating product card */}
      <div style={{ maxWidth: 1120, margin: "-110px auto 0", padding: "0 28px", position: "relative", zIndex: 2 }}>
        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, boxShadow: "var(--shadow-xl)", overflow: "hidden", maxWidth: 880, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green-600)" }} /> Telemetry — Acme Holdings PLC</span>
            <DSl.Badge tone="success" dot>Live</DSl.Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr" }}>
            <div style={{ padding: 22 }}>
              {[["Scaling Status","42%","success"],["Model Drift","1.4%","success"],["Bias / Disparate Impact","1.31","warning"],["Shadow AI Detected","3","danger"],["Kill-Switch Readiness","Active","success"]].map(([k,v,t]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--text-secondary)" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: `var(--status-${t})` }} /> {k}</span>
                  <span className="pf-tnum" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "var(--surface-canvas)", display: "grid", placeItems: "center", padding: 22 }}>
              <DSl.ScoreGauge score={72} size={140} label="Governance score" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 28px 24px" }}>
        <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 36 }}>
          {[["8%","of board directors have real AI expertise — the lowest of any boardroom metric."],["73%","of mid-market IT leaders have already hit an AI security incident or near-miss."],["94%","of mid-market firms use generative AI — but few can scale it safely."]].map(([n,l]) => (
            <div key={n} style={{ borderLeft: "2px solid var(--green-600)", paddingLeft: 18 }}>
              <div className="pf-tnum" style={{ fontSize: 48, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>{n}</div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 12, lineHeight: 1.55 }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section id="approach" style={{ background: "var(--surface-card)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", padding: "72px 0", marginTop: 40 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
          <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "end", marginBottom: 36 }}>
            <h2 className="pf-display" style={{ fontSize: 36, color: "var(--ink-900)" }}>Two pillars that define responsible enterprise.</h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>An AI-led advisory assessment across the twin challenges facing every board — ESG performance and the ethical adoption of AI.</p>
          </div>
          <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {PILLARS.map((p) => (
              <div key={p.k} style={{ background: "var(--surface-canvas)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: 30 }}>
                <span style={{ display: "inline-flex", width: 44, height: 44, borderRadius: 11, background: "var(--green-100)", color: "var(--green-600)", alignItems: "center", justifyContent: "center" }}>{p.icon}</span>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--ink-900)", marginTop: 16 }}>{p.k}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 8 }}>{p.body}</p>
                <ul style={{ listStyle: "none", margin: "18px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.points.map((pt) => (
                    <li key={pt} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--text-secondary)" }}><UI.ICheck size={15} color="var(--green-600)" /> {pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The full platform */}
      <section id="platform" style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 28px 8px" }}>
        <Reveal>
          <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "end", marginBottom: 36 }}>
            <h2 className="pf-display" style={{ fontSize: 36, color: "var(--ink-900)" }}>Everything a board needs to govern AI.</h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>One platform: assess your maturity, evidence it, report it to the board, and keep watching it — with every measure owned by a named person.</p>
          </div>
        </Reveal>
        <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {PLATFORM.map((p, i) => {
            const Icon = UI[p.icon];
            return (
              <Reveal key={p.t} delay={(i % 3) * 70}>
                <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: 26, boxShadow: "var(--shadow-card)", height: "100%", display: "flex", flexDirection: "column" }}>
                  <span style={{ display: "inline-flex", width: 40, height: 40, borderRadius: 10, background: "var(--green-100)", color: "var(--green-600)", alignItems: "center", justifyContent: "center" }}><Icon size={19} /></span>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)", marginTop: 14 }}>{p.t}</h3>
                  <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 7, flex: 1 }}>{p.b}</p>
                  <div className="pf-tnum" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--green-700)", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>{p.stat}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Journey */}
      <section id="journey" style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 28px" }}>
        <Reveal>
          <h2 className="pf-display" style={{ fontSize: 36, color: "var(--ink-900)", maxWidth: 520 }}>From context to clarity.</h2>
        </Reveal>
        <div className="pf-r-col-2" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 36 }}>
          {JOURNEY.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 22, boxShadow: "var(--shadow-card)", height: "100%" }}>
                <div className="pf-tnum" style={{ fontSize: 14, fontWeight: 700, color: "var(--green-600)" }}>{s.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-900)", marginTop: 8 }}>{s.t}</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 6 }}>{s.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--ink-900)", padding: "80px 0", textAlign: "center" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto", padding: "0 28px" }}>
          <h2 className="pf-display" style={{ fontSize: 40, color: "#fff" }}>Ready to lead with principle?</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 16, maxWidth: 440, marginInline: "auto" }}>Begin your organisation&rsquo;s ESG and Ethical AI assessment. Board-ready advisory insight, in under an hour.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <button onClick={onEnter} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, padding: "0 28px", fontSize: 15, fontWeight: 600, color: "var(--green-700)", background: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }}>Begin your assessment <UI.IArrowRight size={16} /></button>
            <button onClick={() => setContactOpen(true)} style={{ height: 48, padding: "0 26px", fontSize: 15, fontWeight: 500, color: "#fff", background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, cursor: "pointer" }}>Talk to us</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--surface-card)", borderTop: "1px solid var(--border-subtle)", padding: "40px 0 28px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
          <div className="pf-r-stack" style={{ display: "flex", justifyContent: "space-between", gap: 40, flexWrap: "wrap", paddingBottom: 28, borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ maxWidth: 340 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <UI.Logo size={26} />
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>Principled Futures</span>
              </span>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 12 }}>Board-level AI and ESG governance — assess, report and continuously oversee responsible AI. A Salveus Labs product.</p>
            </div>
            <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-tertiary)", marginBottom: 12 }}>Product</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  <a href="#platform" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>Platform</a>
                  <a href="/pricing/" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>Pricing</a>
                  <a href="#journey" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>How it works</a>
                  <button onClick={onEnter} style={{ fontSize: 13, color: "var(--text-secondary)", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-sans)", textAlign: "left" }}>Begin assessment</button>
                  <button onClick={() => setContactOpen(true)} style={{ fontSize: 13, color: "var(--text-secondary)", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-sans)", textAlign: "left" }}>Talk to us</button>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-tertiary)", marginBottom: 12 }}>Legal</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  <a href="/privacy/" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>Privacy policy</a>
                  <a href="/terms/" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>Terms of use</a>
                  <a href="/gdpr/" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>GDPR statement</a>
                </div>
              </div>
              <div style={{ maxWidth: 220 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-tertiary)", marginBottom: 12 }}>Salveus Labs Ltd</div>
                <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  3rd Floor, 86–90 Paul Street,<br />London, England, EC2A 4NE<br />
                  <span style={{ color: "var(--text-tertiary)" }}>Company no. 16939567</span>
                </p>
              </div>
            </div>
          </div>
          <div className="pf-r-stack" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>© 2026 Salveus Labs Ltd. All rights reserved. Principled Futures is a product of Salveus Labs Ltd.</span>
            <span style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>Registered in England &amp; Wales.</span>
          </div>
        </div>
      </footer>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}

export { Landing };
