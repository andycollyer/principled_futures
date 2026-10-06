"use client";

/* Who owns it — the three circles of review and a named owner for each measure.
   Moved here from the old Telemetry screen when it was folded into the overview.
   It shows what to track and who answers for it; it shows no figures, because
   none are connected yet. */

import React from "react";
import * as DS from "@/components/ds";
import { framework } from "@/lib/framework";
import { MEASURES } from "@/lib/measures";
import { useOwners, type MetricOwner } from "@/lib/telemetry-owners";

const RINGS = [
  { short: "The measures", name: "The measures", cadence: "what you track",
    body: "Eleven things a board should be able to ask for, each with a threshold. They are not connected to your systems yet, so no figures are shown: start by naming who answers for each one." },
  { short: "Run it", name: "Run it — the people using AI daily", cadence: "daily · weekly",
    body: "In your organisation: operations, IT, team leads. They watch the measures, fix what drifts, and raise what they can't fix." },
  { short: "Steer it", name: "Steer it — the people who set the rules", cadence: "monthly · quarterly",
    body: "In your organisation: senior management, the risk owner, the board. They set the thresholds, act on breaches, and own the decisions the numbers demand." },
  { short: "Check it", name: "Check it — the outside eyes", cadence: "yearly",
    body: "In your organisation: your accountant, auditor or an external reviewer. They confirm the other two circles did what the records say — so the board's sign-off rests on proof, not trust." },
];
const RING_SIZES = [104, 204, 304, 404];

function OwnerChip({ owner, onClick }: { owner: MetricOwner | undefined; onClick: () => void }) {
  const base: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 7, borderRadius: 999, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 500 };
  if (!owner) {
    return <button onClick={onClick} style={{ ...base, padding: "5px 12px", border: "1px dashed var(--status-warning)", background: "transparent", color: "var(--status-warning)" }}>Name an owner</button>;
  }
  return (
    <button onClick={onClick} title={`${owner.role || "No role given"} · ${RINGS[owner.ring].short}`}
      style={{ ...base, padding: "4px 11px 4px 4px", border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--ink-900)" }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--green-100)", color: "var(--green-700)", display: "grid", placeItems: "center", fontSize: 10.5, fontWeight: 600 }}>{owner.personName.trim().charAt(0).toUpperCase()}</span>
      {owner.personName}<span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>· {RINGS[owner.ring].short}</span>
    </button>
  );
}

export function Ownership() {
  const { owners, assignOwner, ready } = useOwners();
  const [assigning, setAssigning] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [ring, setRing] = React.useState<1 | 2 | 3>(2);

  const open = (id: string) => {
    const o = owners[id];
    setName(o?.personName ?? ""); setRole(o?.role ?? ""); setRing(o?.ring ?? 2); setAssigning(id);
  };
  const confirm = () => {
    if (assigning && name.trim()) { assignOwner(assigning, name.trim(), role.trim(), ring); setAssigning(null); }
  };

  const unowned = ready ? MEASURES.filter((m) => !owners[m.id]).length : 0;
  const ownedIn = (r: number) => MEASURES.filter((m) => owners[m.id]?.ring === r).length;

  return (
    <DS.Card style={{ padding: 28 }}>
      <h2 style={{ fontSize: 19, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.011em" }}>Who owns it</h2>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4, maxWidth: 720, lineHeight: 1.55 }}>
        A score tells you where you stand. It only improves when someone is answerable. One set of measures, three circles of people, three rhythms of review.
      </p>

      <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "410px 1fr", gap: 28, alignItems: "center", marginTop: 22 }}>
        <div className="pf-r-hide" style={{ position: "relative", width: 404, height: 404, margin: "0 auto" }}>
          {[3, 2, 1, 0].map((idx) => {
            const centre = idx === 0;
            return (
              <div key={idx} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: RING_SIZES[idx], height: RING_SIZES[idx], borderRadius: "50%",
                background: centre ? "var(--green-600)" : "var(--surface-card)", border: centre ? "none" : "1px solid var(--border-default)",
                display: "flex", alignItems: centre ? "center" : "flex-start", justifyContent: "center" }}>
                <div style={{ textAlign: "center", paddingTop: centre ? 0 : 11 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: centre ? "#fff" : "var(--ink-900)" }}>{RINGS[idx].short}</div>
                  <div style={{ fontSize: 10.5, color: centre ? "rgba(255,255,255,0.82)" : "var(--text-tertiary)", marginTop: 1 }}>{RINGS[idx].cadence}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RINGS.map((r, i) => (
            <div key={r.name} style={{ border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "13px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)" }}>{r.name}</span>
                <span className="pf-tnum" style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
                  {i === 0 ? `${MEASURES.length} measures${ready ? ` · ${unowned} without an owner` : ""}` : `${r.cadence} · ${ownedIn(i)} owned`}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 5 }}>{r.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 26, borderTop: "1px solid var(--border-subtle)" }}>
        {framework.map((d) => {
          const list = MEASURES.filter((m) => m.domainId === d.id);
          if (!list.length) return null;
          return list.map((m, i) => (
            <div key={m.id} className="pf-r-stack" style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span style={{ width: 210, flexShrink: 0, fontSize: 12.5, color: "var(--text-tertiary)" }}>{i === 0 ? <><span className="pf-tnum" style={{ fontWeight: 700, color: "var(--green-700)" }}>{d.id}</span> {d.name}</> : ""}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--ink-900)" }}>{m.name}</span>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--text-secondary)", marginTop: 1 }}>Threshold: {m.threshold} · reviewed {m.rhythm.toLowerCase()}</span>
              </span>
              <OwnerChip owner={owners[m.id]} onClick={() => open(m.id)} />
            </div>
          ));
        })}
      </div>

      <p style={{ marginTop: 18, fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>
        The rule that makes it work: every measure belongs to one named person in one circle. If a number has no name, it isn&rsquo;t governed — it&rsquo;s just displayed.
      </p>

      <DS.Modal open={assigning != null} onClose={() => setAssigning(null)} title="Name an owner" size="sm"
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <DS.Button variant="ghost" onClick={() => setAssigning(null)}>Cancel</DS.Button>
            <DS.Button variant="primary" disabled={!name.trim()} onClick={confirm}>Save</DS.Button>
          </div>
        }>
        {assigning && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{MEASURES.find((m) => m.id === assigning)?.name} — one named person, in one circle.</div>
            <DS.FormField label="Person" required>
              <DS.Input placeholder="Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
            </DS.FormField>
            <DS.FormField label="Role" hint="e.g. CISO, Finance Director, External auditor">
              <DS.Input placeholder="Role" value={role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)} />
            </DS.FormField>
            <DS.FormField label="Circle">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {([1, 2, 3] as const).map((r) => (
                  <DS.Radio key={r} name="pf-ring" label={RINGS[r].short} description={RINGS[r].cadence} checked={ring === r} onChange={() => setRing(r)} />
                ))}
              </div>
            </DS.FormField>
          </div>
        )}
      </DS.Modal>
    </DS.Card>
  );
}
