"use client";

/* Settings → Billing. The three pricing tiers from src/lib/pricing.ts.
   Paid CTAs open Stripe checkout (via a Payment Link, src/lib/stripe.ts),
   attaching the caller's organisation id so the Supabase webhook upgrades the
   right org on payment. Until the Payment Links are configured, the CTAs fall
   back to the contact flow. */

import React from "react";
import { useRouter } from "next/navigation";
import * as DS from "@/components/ds";
import * as UI from "@/components/icons";
import { TIERS, type Tier } from "@/lib/pricing";
import { useAuth } from "@/lib/auth";
import { checkoutUrl } from "@/lib/stripe";

function PriceCard({ tier, onCta }: { tier: Tier; onCta: (t: Tier) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", background: "var(--surface-card)", borderRadius: 12, padding: 26,
      border: tier.highlighted ? "1px solid var(--green-600)" : "1px solid var(--border-subtle)",
      boxShadow: tier.highlighted ? "0 8px 24px -8px rgba(20,36,29,0.14)" : "var(--shadow-card)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-900)" }}>{tier.name}</h3>
        {tier.highlighted && <DS.Badge tone="brand" pill>Recommended</DS.Badge>}
      </div>
      <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.5, minHeight: 40 }}>{tier.blurb}</p>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "14px 0 20px" }}>
        <span className="pf-tnum" style={{ fontSize: 34, fontWeight: 700, color: "var(--ink-900)", letterSpacing: "-0.02em", lineHeight: 1 }}>
          {tier.price == null ? "POA" : tier.price === 0 ? "£0" : `£${tier.price.toLocaleString("en-GB")}`}
        </span>
        {tier.period && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-tertiary)" }}>/ month</span>}
      </div>

      <button onClick={() => onCta(tier)}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", height: 42, borderRadius: 8, border: "none", cursor: "pointer",
          fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
          background: tier.highlighted ? "var(--brand)" : "var(--action-primary, var(--ink-900))",
          color: "#fff", marginBottom: 22 }}>
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

export default function SettingsPage() {
  const router = useRouter();
  const { orgId, user } = useAuth();
  const [notice, setNotice] = React.useState<string | null>(null);

  const onCta = (t: Tier) => {
    if (t.id === "diagnostic") {
      router.push("/dashboard/assessment");
      return;
    }
    // Paid plan → Stripe checkout, tagged with this organisation so the webhook
    // upgrades the right org on payment. Falls back to the contact flow until
    // the Payment Link for this plan is configured.
    const url = checkoutUrl(t.id, { orgId, email: user?.email ?? null });
    if (url) { window.location.href = url; return; }
    setNotice(t.name);
  };

  return (
    <div style={{ padding: 28, maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>Settings</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Billing and plan. Organisation, members and integrations arrive with accounts.</p>
      </div>

      <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)", marginBottom: 16 }}>Plan &amp; billing</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "start" }}>
        {TIERS.map((t) => <PriceCard key={t.id} tier={t} onCta={onCta} />)}
      </div>

      <p style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 16 }}>Prices exclude VAT. Cancel any time.</p>

      {notice && (
        <div onClick={() => setNotice(null)} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(17,27,22,0.5)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "16vh" }}>
          <div onClick={(e) => e.stopPropagation()} role="dialog" style={{ width: "calc(100% - 40px)", maxWidth: 440, background: "var(--surface-card)", borderRadius: 16, border: "1px solid var(--border-subtle)", boxShadow: "0 28px 72px -18px rgba(20,36,29,0.4)", overflow: "hidden" }}>
            <div style={{ padding: "22px 24px 18px" }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)" }}>Set up {notice}</h3>
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
                Secure card checkout is being finalised. In the meantime, tell us you&rsquo;d like {notice} and we&rsquo;ll set your organisation up directly — usually within a working day.
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 24px", borderTop: "1px solid var(--border-subtle)", background: "var(--surface-sunken)" }}>
              <DS.Button variant="ghost" onClick={() => setNotice(null)}>Not now</DS.Button>
              <DS.Button variant="primary" iconLeft={<UI.IMail size={15} />} onClick={() => { window.location.href = `mailto:support@principledfutures.com?subject=${encodeURIComponent(`Set up ${notice} — Principled Futures`)}&body=${encodeURIComponent(`I'd like to set up the ${notice} plan for my organisation.`)}`; }}>Email us</DS.Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
