"use client";

/* Research — the evidence base / library. Search + category filter + a
   featured paper + a card grid. Catalogue lives in src/lib/research.ts;
   PDFs in public/research/. */

import React from "react";
import * as DS from "@/components/ds";
import * as UI from "@/components/icons";
import { PAPERS, FEATURED, CATEGORIES, type Paper } from "@/lib/research";
import { ARTICLE_META as ARTICLES, type ArticleMeta as Article } from "@/lib/content-meta";
import { openPaper } from "@/lib/papers";

function BriefingCard({ a }: { a: Article }) {
  return (
    <a href={`/dashboard/research/${a.id}/`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, boxShadow: "var(--shadow-card)", padding: 20, transition: "border-color var(--duration-base) var(--ease-out)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ display: "inline-flex", gap: 6 }}>
          <DS.Badge tone="brand" pill={false}>{a.category}</DS.Badge>
          <DS.Badge tone="neutral" pill={false}>{a.id}</DS.Badge>
        </span>
        <span style={{ display: "inline-flex", width: 34, height: 34, borderRadius: 9, background: "var(--surface-sunken)", color: "var(--text-tertiary)", alignItems: "center", justifyContent: "center" }}><UI.IDoc size={17} /></span>
      </div>
      <h3 style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.35, letterSpacing: "-0.008em" }}>{a.title}</h3>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 8, flex: 1 }}>{a.extract}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-tertiary)" }}><UI.IClock size={13} /> {a.read} read</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: "var(--green-700)" }}>Read <UI.IArrowRight size={14} /></span>
      </div>
    </a>
  );
}

function PaperCard({ p, onOpen }: { p: Paper; onOpen: (file: string) => void }) {
  return (
    <a href={`/research/${p.file}`} onClick={(e) => { e.preventDefault(); onOpen(p.file); }} style={{ textDecoration: "none", display: "flex", flexDirection: "column", cursor: "pointer", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, boxShadow: "var(--shadow-card)", padding: 20, transition: "border-color var(--duration-base) var(--ease-out)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <DS.Badge tone={p.tone} pill={false}>{p.cat}</DS.Badge>
        <span style={{ display: "inline-flex", width: 34, height: 34, borderRadius: 9, background: "var(--surface-sunken)", color: "var(--text-tertiary)", alignItems: "center", justifyContent: "center" }}><UI.IFile size={17} /></span>
      </div>
      <h3 style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1.35, letterSpacing: "-0.008em" }}>{p.title}</h3>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 8, flex: 1 }}>{p.desc}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-tertiary)" }}><UI.IClock size={13} /> {p.read} read · PDF</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: "var(--green-700)" }}>Read <UI.IArrowRight size={14} /></span>
      </div>
    </a>
  );
}

const ALL_CATEGORIES = [
  ...CATEGORIES,
  ...Array.from(new Set(ARTICLES.map((a) => a.category))).filter((c) => !CATEGORIES.includes(c)),
];

export default function ResearchPage() {
  const [cat, setCat] = React.useState("All");
  const [q, setQ] = React.useState("");

  // Papers are issued by the backend, watermarked for the reader — so opening
  // one can fail (not signed in, or not on a plan that includes it). Say so
  // rather than leaving a click that appears to do nothing.
  const [paperError, setPaperError] = React.useState<{ msg: string; upgrade?: boolean } | null>(null);
  const [opening, setOpening] = React.useState(false);
  const openWithFeedback = async (file: string) => {
    if (opening) return;
    setOpening(true);
    setPaperError(null);
    const r = await openPaper(file);
    setOpening(false);
    if (!r.ok) setPaperError({ msg: r.error ?? "That paper couldn't be opened.", upgrade: r.upgrade });
  };
  const filtered = PAPERS.filter((p) => (cat === "All" || p.cat === cat) && (q === "" || (p.title + p.desc).toLowerCase().includes(q.toLowerCase())));
  const briefings = ARTICLES.filter((a) => (cat === "All" || a.category === cat) && (q === "" || (a.title + a.extract).toLowerCase().includes(q.toLowerCase())));
  return (
    <div style={{ padding: 28, maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 22, flexWrap: "wrap" }}>
        <div>
          <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>Library</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4, maxWidth: 640 }}>The evidence base behind the assessment, the telemetry dashboard and every advisory report. Board-level papers, grounded in recognised global frameworks.</p>
        </div>
        <a href="/dashboard/research/glossary/" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 38, padding: "0 16px", fontSize: 13.5, fontWeight: 500, color: "var(--ink-900)", background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 8, textDecoration: "none" }}>Glossary <UI.IArrowRight size={14} /></a>
      </div>

      {opening && (
        <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 12 }}>Preparing your copy&hellip;</p>
      )}
      {paperError && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--green-100)", border: "1px solid var(--green-600)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, flexWrap: "wrap" }}>
          <UI.ILock size={16} color="var(--green-700)" />
          <span style={{ fontSize: 13.5, color: "var(--green-700)", flex: 1, minWidth: 200 }}>{paperError.msg}</span>
          {paperError.upgrade && (
            <a href="/dashboard/settings/" style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--brand)", borderRadius: 8, padding: "7px 14px", textDecoration: "none" }}>See plans</a>
          )}
        </div>
      )}

      {/* Featured */}
      <a href={`/research/${FEATURED.file}`} onClick={(e) => { e.preventDefault(); openWithFeedback(FEATURED.file); }} style={{ textDecoration: "none", display: "block", marginBottom: 26, cursor: "pointer" }}>
        <div style={{ position: "relative", overflow: "hidden", background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 16, padding: 36, display: "grid", gridTemplateColumns: "1fr auto", gap: 28, alignItems: "center" }}>
          <div style={{ position: "relative", maxWidth: 620 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "var(--green-700)", background: "var(--green-100)" }}>Featured · Flagship framework</span>
            <h2 className="pf-display" style={{ fontSize: 28, color: "var(--ink-900)", marginTop: 14, lineHeight: 1.2 }}>{FEATURED.title}</h2>
            <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 12 }}>{FEATURED.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 20 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 20px", background: "var(--brand)", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 600 }}>Read the framework <UI.IArrowRight size={15} /></span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{FEATURED.read} read · {FEATURED.pages}</span>
            </div>
          </div>
          <div style={{ position: "relative", width: 120, height: 120, borderRadius: 20, background: "var(--green-100)", display: "grid", placeItems: "center" }}>
            <UI.IFile size={52} color="var(--green-600)" />
          </div>
        </div>
      </a>

      {/* Filter bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ALL_CATEGORIES.map((c) => {
            const on = c === cat;
            return <button key={c} onClick={() => setCat(c)} style={{ padding: "7px 14px", borderRadius: 999, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, cursor: "pointer", border: `1px solid ${on ? "var(--ink-900)" : "var(--border-default)"}`, background: on ? "var(--ink-900)" : "var(--surface-card)", color: on ? "#fff" : "var(--text-secondary)", transition: "color .12s" }}>{c}</button>;
          })}
        </div>
        <div style={{ width: 240 }}>
          <DS.Input size="sm" placeholder="Search papers" value={q} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)} iconLeft={<UI.ISearch size={15} />} />
        </div>
      </div>

      {/* Criterion briefings */}
      {briefings.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.011em" }}>Criterion briefings</h2>
            <span className="pf-tnum" style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>{briefings.length} of 64 · one per assessment criterion</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {briefings.map((a) => <BriefingCard key={a.id} a={a} />)}
          </div>
        </div>
      )}

      {/* Board papers */}
      {filtered.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.011em" }}>Board papers</h2>
            <span className="pf-tnum" style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>{filtered.length} papers · PDF</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {filtered.map((p) => <PaperCard key={p.file} p={p} onOpen={openWithFeedback} />)}
          </div>
        </div>
      )}

      {!filtered.length && !briefings.length && (
        <DS.Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 14, color: "var(--text-tertiary)" }}>No papers match &ldquo;{q}&rdquo;.</div>
        </DS.Card>
      )}
    </div>
  );
}
