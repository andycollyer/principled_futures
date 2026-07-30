"use client";

/* Glossary — every term of art in the framework and briefings, defined in
   plain English and linked back to the criteria where it matters. */

import React from "react";
import * as DS from "@/components/ds";
import * as UI from "@/components/icons";
import { GLOSSARY_META as GLOSSARY, glossaryGroups } from "@/lib/content-meta";
import { slugify } from "@/lib/search";
import { articleFor } from "@/lib/content-meta";
import { fetchGlossaryDefs } from "@/lib/content";

export default function GlossaryPage() {
  const [q, setQ] = React.useState("");

  // Definitions are held in the database, not the bundle: an anonymous visitor
  // gets the term list and nothing else. Any signed-in account sees them all.
  const [defs, setDefs] = React.useState<Record<string, string>>({});
  const [state, setState] = React.useState<string>("loading");
  React.useEffect(() => {
    let active = true;
    fetchGlossaryDefs().then((r) => { if (!active) return; setDefs(r.defs); setState(r.state); });
    return () => { active = false; };
  }, []);

  const groups = React.useMemo(() => {
    const all = glossaryGroups();
    if (!q.trim()) return all;
    const needle = q.toLowerCase();
    return all
      .map((g) => ({ ...g, entries: g.entries.filter((e) => (e.term + " " + (defs[e.term] ?? "") + " " + (e.source ?? "")).toLowerCase().includes(needle)) }))
      .filter((g) => g.entries.length);
  }, [q, defs]);

  return (
    <div style={{ padding: 28, maxWidth: 880, margin: "0 auto" }}>
      <a href="/dashboard/research/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--text-link)", textDecoration: "none", marginBottom: 18 }}>
        <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><UI.IArrowRight size={14} /></span> Library
      </a>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
        <div>
          <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>Glossary</h1>
          <p className="pf-tnum" style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>{GLOSSARY.length} terms, defined in plain English and linked to the criteria where they matter.</p>
        </div>
        <DS.Badge tone="warning" pill={false}>Draft copy — awaiting sign-off</DS.Badge>
      </div>

      {state === "signin" && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--green-100)", border: "1px solid var(--green-600)", borderRadius: 10, padding: "12px 16px", margin: "14px 0 4px", flexWrap: "wrap" }}>
          <UI.ILock size={16} color="var(--green-700)" />
          <span style={{ fontSize: 13.5, color: "var(--green-700)", flex: 1, minWidth: 220 }}>
            Definitions are available to account holders. Creating an account is free.
          </span>
          <a href="/signup/" style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--brand)", borderRadius: 8, padding: "7px 14px", textDecoration: "none" }}>Create an account</a>
        </div>
      )}

      <div style={{ maxWidth: 320, margin: "14px 0 24px" }}>
        <DS.Input size="sm" placeholder="Filter terms" value={q} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)} iconLeft={<UI.ISearch size={15} />} />
      </div>

      {groups.length === 0 ? (
        <DS.Card style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 14, color: "var(--text-tertiary)" }}>No terms match &ldquo;{q}&rdquo;.</div>
        </DS.Card>
      ) : (
        groups.map((g) => (
          <div key={g.letter} style={{ marginBottom: 26 }}>
            <div className="pf-tnum" style={{ fontSize: 13, fontWeight: 700, color: "var(--green-600)", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid var(--border-subtle)" }}>{g.letter}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {g.entries.map((e) => (
                <div key={e.term} id={slugify(e.term)} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, boxShadow: "var(--shadow-card)", padding: "16px 18px", scrollMarginTop: 76 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink-900)" }}>{e.term}</h2>
                    {e.source && <span style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>{e.source}</span>}
                  </div>
                  {defs[e.term] ? (
                    <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 6 }}>{defs[e.term]}</p>
                  ) : (
                    <p style={{ fontSize: 13, color: "var(--text-tertiary)", lineHeight: 1.6, marginTop: 6, fontStyle: "italic" }}>
                      {state === "loading" ? "Loading\u2026" : "Definition available to account holders."}
                    </p>
                  )}
                  {e.related && e.related.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                      {e.related.map((id) => (
                        <a key={id} href={articleFor(id) ? `/dashboard/research/${id}/` : "/dashboard/assessment/"}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--green-700)", background: "var(--green-100)", borderRadius: 999, padding: "3px 10px", textDecoration: "none" }}>
                          Criterion {id}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
