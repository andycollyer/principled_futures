"use client";

/* BriefingReader — the reading view for a criterion briefing.
   The heading, standfirst and criterion link render from local metadata; the
   prose itself is fetched per-reader from the database and is withheld from
   anyone not entitled to it. Signed-out readers get the standfirst and a
   sign-in prompt; free accounts get the eight samples and an upgrade prompt
   for the rest. */

import React from "react";
import * as DS from "./ds";
import * as UI from "./icons";
import { articleFor } from "@/lib/content-meta";
import { framework } from "@/lib/framework";
import { fetchBriefingBody } from "@/lib/content";

/** Render a paragraph, interpreting *asterisk* spans as emphasis. */
function withEmphasis(text) {
  const parts = text.split(/\*([^*]+)\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part));
}

/** The locked state: explains what's behind the wall and how to open it. */
function Locked({ mode, title }) {
  const signin = mode === "signin";
  return (
    <div style={{ marginTop: 28, border: "1px solid var(--border-subtle)", borderRadius: 12, background: "var(--surface-sunken)", padding: 28, textAlign: "center" }}>
      <span style={{ display: "inline-flex", width: 40, height: 40, borderRadius: 10, background: "var(--green-100)", color: "var(--green-600)", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <UI.ILock size={19} />
      </span>
      <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)" }}>
        {signin ? "Sign in to read this briefing" : "Included with Governance"}
      </h2>
      <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 8, maxWidth: 460, marginInline: "auto" }}>
        {signin
          ? "The research library is available to account holders. Creating an account is free, and eight briefings — one from each domain — are included."
          : `Your free plan includes one briefing from each of the eight domains. “${title}” is part of the full library that comes with Governance.`}
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
        <a href={signin ? "/signup/" : "/dashboard/settings/"}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 40, padding: "0 18px", background: "var(--brand)", color: "var(--text-on-brand)", borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
          {signin ? "Create a free account" : "See plans"} <UI.IArrowRight size={15} />
        </a>
        {signin && (
          <a href="/login/" style={{ display: "inline-flex", alignItems: "center", height: 40, padding: "0 16px", border: "1px solid var(--border-default)", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none" }}>
            Sign in
          </a>
        )}
      </div>
    </div>
  );
}

export function BriefingReader({ id }) {
  const article = articleFor(id);
  const [state, setState] = React.useState("loading");
  const [body, setBody] = React.useState([]);

  React.useEffect(() => {
    let active = true;
    fetchBriefingBody(id).then((r) => {
      if (!active) return;
      setState(r.state);
      setBody(r.body);
    });
    return () => { active = false; };
  }, [id]);

  if (!article) {
    return (
      <div style={{ padding: 28, maxWidth: 880, margin: "0 auto" }}>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>That briefing could not be found.</p>
      </div>
    );
  }

  const domain = framework.find((d) => d.id === Number(id.split(".")[0]));
  const criterion = domain?.criteria.find((c) => c.id === id);

  return (
    <div style={{ padding: 28, maxWidth: 880, margin: "0 auto" }}>
      <a href="/dashboard/research/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--text-link)", textDecoration: "none", marginBottom: 18 }}>
        <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><UI.IArrowRight size={14} /></span> Research library
      </a>

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, boxShadow: "var(--shadow-card)", padding: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <DS.Badge tone="brand" pill={false}>{article.category}</DS.Badge>
          <DS.Badge tone="neutral" pill={false}>Criterion {article.id}</DS.Badge>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-tertiary)" }}><UI.IClock size={13} /> {article.read} read</span>
          {article.isSample && <DS.Badge tone="neutral" pill>Free sample</DS.Badge>}
        </div>

        <h1 className="pf-display" style={{ fontSize: 30, color: "var(--ink-900)", lineHeight: 1.2 }}>{article.title}</h1>

        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16, paddingLeft: 16, borderLeft: "3px solid var(--green-600)", fontStyle: "italic" }}>
          &ldquo;{article.extract}&rdquo;
        </p>

        {state === "loading" && (
          <p style={{ marginTop: 28, fontSize: 14, color: "var(--text-tertiary)" }}>Loading the briefing&hellip;</p>
        )}

        {state === "ok" && (
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 18 }}>
            {body.map((para, i) => (
              <p key={i} style={{ fontSize: 14.5, color: "var(--ink-700, var(--text-primary))", lineHeight: 1.7 }}>{withEmphasis(para)}</p>
            ))}
          </div>
        )}

        {(state === "signin" || state === "upgrade") && <Locked mode={state} title={article.title} />}

        {state === "unavailable" && (
          <p style={{ marginTop: 28, fontSize: 14, color: "var(--text-secondary)" }}>
            This briefing can&rsquo;t be loaded at the moment. Please try again shortly.
          </p>
        )}

        {state === "ok" && (
          <p style={{ marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--border-subtle)", fontSize: 12.5, color: "var(--text-tertiary)" }}>
            Regulatory position current as of 22 July 2026.
          </p>
        )}

        {criterion && domain && (
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-tertiary)", marginBottom: 8 }}>Assess this criterion</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>{criterion.title} · {domain.name}</div>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", marginTop: 4, marginBottom: 14 }}>{criterion.question}</p>
            <a href="/dashboard/assessment/" style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 38, padding: "0 16px", background: "var(--brand)", color: "var(--text-on-brand)", borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              Open the assessment <UI.IArrowRight size={15} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
