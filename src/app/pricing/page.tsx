"use client";

/* Public pricing page — the three tiers on the marketing side, landing
   styling. Self-contained and removable: delete this file + the /pricing
   nav links to remove it. Tiers come from the shared src/lib/pricing.ts. */

import React from "react";
import { useRouter } from "next/navigation";
import * as UI from "@/components/icons";
import { ContactModal } from "@/components/ContactModal";
import { TIERS, type Tier } from "@/lib/pricing";
import { checkoutUrl } from "@/lib/stripe";
import { useAuth } from "@/lib/auth";

function PriceCard({ tier, onStart, onBuy, onContact }: { tier: Tier; onStart: () => void; onBuy: (t: Tier) => void; onContact: () => void }) {
  // Diagnostic → start free. Governance → Stripe checkout when its Payment Link
  // is live (else contact). Governance+ is consultative ("Talk to us") → contact.
  const canBuy = tier.id !== "diagnostic" && tier.cta !== "Talk to us" && checkoutUrl(tier.id) != null;
  const onCta = tier.id === "diagnostic" ? onStart : canBuy ? () => onBuy(tier) : onContact;
  return (
    <div style={{ display: "flex", flexDirection: "column", background: "var(--surface-card)", borderRadius: 14, padding: 28, height: "100%",
      border: tier.highlighted ? "1px solid var(--green-600)" : "1px solid var(--border-subtle)",
      boxShadow: tier.highlighted ? "0 12px 32px -10px rgba(20,36,29,0.18)" : "var(--shadow-card)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)" }}>{tier.name}</h3>
        {tier.highlighted && <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--green-700)", background: "var(--green-100)", borderRadius: 999, padding: "3px 10px" }}>Recommended</span>}
      </div>
      <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.5, minHeight: 40 }}>{tier.blurb}</p>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "16px 0 22px" }}>
        <span className="pf-tnum" style={{ fontSize: 38, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>
          {tier.price === 0 ? "£0" : `£${(tier.price as number).toLocaleString("en-GB")}`}
        </span>
        {tier.period && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-tertiary)" }}>/ month</span>}
      </div>

      <button onClick={onCta}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", height: 44, borderRadius: 8, border: "none", cursor: "pointer",
          fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
          background: tier.highlighted ? "var(--brand)" : "var(--ink-900)", color: "#fff", marginBottom: 22 }}>
        {tier.cta} <UI.IArrowRight size={15} />
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {tier.features.map((f) => (
          <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <UI.ICheck size={16} color="var(--green-600)" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [contactOpen, setContactOpen] = React.useState(false);
  const start = () => router.push("/dashboard/assessment");
  // Buying needs an account first: the checkout carries the organisation id so
  // the webhook can upgrade exactly the right org. Sending an anonymous buyer
  // straight to Stripe would leave the payment to be reconciled by email later,
  // which is guesswork we don't need. Signed-in buyers go straight through.
  const { configured, session, orgId, user } = useAuth();
  const buy = (t: Tier) => {
    if (configured && !session) {
      router.push(`/signup/?next=${encodeURIComponent("/dashboard/settings")}`);
      return;
    }
    const url = checkoutUrl(t.id, { orgId, email: user?.email ?? null });
    if (url) window.location.href = url;
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: "var(--surface-canvas)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--green-600)" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <header style={{ position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <UI.Logo inverse size={28} />
              <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: "-0.012em" }}>Principled Futures</span>
            </a>
            <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <a href="/#platform" className="pf-r-hide" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>Platform</a>
              <a href="/pricing/" style={{ fontSize: 13.5, color: "#fff", fontWeight: 600, textDecoration: "none" }}>Pricing</a>
              <a href="/login/" className="pf-r-hide" style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", textDecoration: "none" }}>Sign in</a>
              <button onClick={start} style={{ fontSize: 13.5, fontWeight: 600, color: "var(--green-700)", background: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontFamily: "var(--font-sans)" }}>Begin assessment</button>
            </nav>
          </div>
        </header>
        <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto", padding: "48px 28px 40px", textAlign: "center" }}>
          <h1 className="pf-r-h1" style={{ fontSize: 44, fontWeight: 700, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em" }}>Governance you can put on the balance sheet.</h1>
          <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.82)", lineHeight: 1.6, marginTop: 18, maxWidth: 560, marginInline: "auto" }}>
            Start free and see where you stand. Move up when you need continuous, board-ready oversight.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section style={{ maxWidth: 1080, width: "100%", margin: "-24px auto 0", padding: "0 28px", position: "relative", zIndex: 2 }}>
        <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, alignItems: "stretch" }}>
          {TIERS.map((t) => <PriceCard key={t.id} tier={t} onStart={start} onBuy={buy} onContact={() => setContactOpen(true)} />)}
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 18, textAlign: "center" }}>Prices exclude VAT. Cancel any time. No card required to start.</p>
      </section>

      {/* Reassurance strip */}
      <section style={{ maxWidth: 1080, width: "100%", margin: "0 auto", padding: "44px 28px 8px" }}>
        <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { icon: <UI.IShield size={18} />, t: "Your data stays yours", b: "Board-level answers, held securely and never sold. See our privacy policy." },
            { icon: <UI.IClock size={18} />, t: "Board-ready in under an hour", b: "The full 64-criterion assessment, scored to a maturity baseline as you go." },
            { icon: <UI.IDoc size={18} />, t: "Grounded in the frameworks", b: "OECD, the EU AI Act, the UK Corporate Governance Code — current to July 2026." },
          ].map((r) => (
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

      {/* CTA band */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--ink-900)", padding: "56px 0", textAlign: "center", marginTop: 44 }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto", padding: "0 28px" }}>
          <h2 className="pf-display" style={{ fontSize: 32, color: "#fff", letterSpacing: "-0.012em" }}>Not sure which tier fits?</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", marginTop: 14, maxWidth: 460, marginInline: "auto", lineHeight: 1.6 }}>Start the assessment free — it costs nothing to see your governance position. Or talk to us about Governance+.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
            <button onClick={start} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 46, padding: "0 26px", fontSize: 15, fontWeight: 600, color: "var(--green-700)", background: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font-sans)" }}>Begin your assessment <UI.IArrowRight size={16} /></button>
            <button onClick={() => setContactOpen(true)} style={{ height: 46, padding: "0 24px", fontSize: 15, fontWeight: 500, color: "#fff", background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font-sans)" }}>Talk to us</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--surface-card)", borderTop: "1px solid var(--border-subtle)", padding: "24px 0", marginTop: "auto" }}>
        <div className="pf-r-stack" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>© 2026 Salveus Labs Ltd · Company no. 16939567 · Registered in England &amp; Wales</span>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="/privacy/" style={{ fontSize: 12.5, color: "var(--text-tertiary)", textDecoration: "none" }}>Privacy</a>
            <a href="/terms/" style={{ fontSize: 12.5, color: "var(--text-tertiary)", textDecoration: "none" }}>Terms</a>
            <a href="/gdpr/" style={{ fontSize: 12.5, color: "var(--text-tertiary)", textDecoration: "none" }}>GDPR</a>
          </div>
        </div>
      </footer>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} intent="I'm interested in the Governance+ plan." />}
    </div>
  );
}
