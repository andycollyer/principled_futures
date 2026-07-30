"use client";

/* Help — the product guides: short plain-English articles on how the
   product works, anchored for direct linking from search. */

import React from "react";
import * as DS from "@/components/ds";
import { GUIDE_META as GUIDES } from "@/lib/content-meta";
import { fetchGuideBody } from "@/lib/content";

export default function HelpPage() {
  // Guide text is held in the database and returned to signed-in accounts only,
  // so it is not part of the public download.
  const [bodies, setBodies] = React.useState<Record<string, string[]>>({});
  const [locked, setLocked] = React.useState(false);
  React.useEffect(() => {
    let active = true;
    Promise.all(GUIDES.map((g) => fetchGuideBody(g.id).then((r) => [g.id, r] as const))).then((rows) => {
      if (!active) return;
      const next: Record<string, string[]> = {};
      let anyLocked = false;
      for (const [id, r] of rows) {
        if (r.state === "ok") next[id] = r.body;
        else anyLocked = true;
      }
      setBodies(next);
      setLocked(anyLocked && Object.keys(next).length === 0);
    });
    return () => { active = false; };
  }, []);

  return (
    <div style={{ padding: 28, maxWidth: 780, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
        <div>
          <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>Help</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>How the product works, in plain English. Press ⌘K anywhere to search everything.</p>
        </div>
        <DS.Badge tone="warning" pill={false}>Draft copy — awaiting sign-off</DS.Badge>
      </div>

      {/* Contents */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "16px 0 26px" }}>
        {GUIDES.map((g) => (
          <a key={g.id} href={`#${g.id}`} style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-secondary)", background: "var(--surface-card)", border: "1px solid var(--border-default)", borderRadius: 999, padding: "6px 13px", textDecoration: "none" }}>{g.title}</a>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {GUIDES.map((g) => (
          <div key={g.id} id={g.id} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, boxShadow: "var(--shadow-card)", padding: "22px 24px", scrollMarginTop: 76 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.011em" }}>{g.title}</h2>
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
              {(bodies[g.id] ?? []).map((p, i) => (
                <p key={i} style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.65 }}>{p}</p>
              ))}
              {!bodies[g.id] && (
                <p style={{ fontSize: 13, color: "var(--text-tertiary)", lineHeight: 1.65, fontStyle: "italic" }}>
                  {locked ? "Sign in to read this guide." : "Loading\u2026"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
