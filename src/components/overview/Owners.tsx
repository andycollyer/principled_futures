"use client";

/* Named owners, shared across the overview: one fetch, one dialog. An owner can be
   named for a measure, a domain ("domain-3") or a single criterion ("criterion-4.1");
   all are stored the same way (telemetry-owners.ts). */

import React from "react";
import * as DS from "@/components/ds";
import { useOwners, type MetricOwner } from "@/lib/telemetry-owners";

export const CIRCLES = [
  { short: "The measures", cadence: "what you track" },
  { short: "Run it", cadence: "daily · weekly" },
  { short: "Steer it", cadence: "monthly · quarterly" },
  { short: "Check it", cadence: "yearly" },
];

interface OwnersState {
  owners: Record<string, MetricOwner>;
  ready: boolean;
  open: (key: string, label: string) => void;
}
const Ctx = React.createContext<OwnersState | null>(null);
export function useOverviewOwners(): OwnersState {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useOverviewOwners must be used inside OwnersProvider");
  return v;
}

export function OwnersProvider({ children }: { children: React.ReactNode }) {
  const { owners, assignOwner, ready } = useOwners();
  const [target, setTarget] = React.useState<{ key: string; label: string } | null>(null);
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [ring, setRing] = React.useState<1 | 2 | 3>(2);

  const open = React.useCallback((key: string, label: string) => {
    const o = owners[key];
    setName(o?.personName ?? ""); setRole(o?.role ?? ""); setRing(o?.ring ?? 2); setTarget({ key, label });
  }, [owners]);
  const confirm = () => {
    if (target && name.trim()) { assignOwner(target.key, name.trim(), role.trim(), ring); setTarget(null); }
  };

  return (
    <Ctx.Provider value={{ owners, ready, open }}>
      {children}
      <DS.Modal open={target != null} onClose={() => setTarget(null)} title="Name an owner" size="sm"
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <DS.Button variant="ghost" onClick={() => setTarget(null)}>Cancel</DS.Button>
            <DS.Button variant="primary" disabled={!name.trim()} onClick={confirm}>Save</DS.Button>
          </div>
        }>
        {target && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{target.label} — one named person, in one circle.</div>
            <DS.FormField label="Person" required>
              <DS.Input id="owner-name" placeholder="Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
            </DS.FormField>
            <DS.FormField label="Role" hint="e.g. CISO, Finance Director, External auditor">
              <DS.Input id="owner-role" placeholder="Role" value={role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)} />
            </DS.FormField>
            <DS.FormField label="Circle">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {([1, 2, 3] as const).map((r) => (
                  <DS.Radio key={r} name="pf-ring" label={CIRCLES[r].short} description={CIRCLES[r].cadence} checked={ring === r} onChange={() => setRing(r)} />
                ))}
              </div>
            </DS.FormField>
          </div>
        )}
      </DS.Modal>
    </Ctx.Provider>
  );
}

/** The chip that shows an owner, or invites one. */
export function OwnerChip({ ownerKey, label, quiet = false }: { ownerKey: string; label: string; quiet?: boolean }) {
  const { owners, open } = useOverviewOwners();
  const owner = owners[ownerKey];
  const base: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 7, borderRadius: 999, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap" };
  if (!owner) {
    return <button onClick={() => open(ownerKey, label)} style={{ ...base, padding: "5px 12px", border: `1px dashed ${quiet ? "var(--border-strong)" : "var(--status-warning)"}`, background: "transparent", color: quiet ? "var(--text-secondary)" : "var(--status-warning)" }}>Name an owner</button>;
  }
  return (
    <button onClick={() => open(ownerKey, label)} title={`${owner.role || "No role given"} · ${CIRCLES[owner.ring].short}`}
      style={{ ...base, padding: "4px 11px 4px 4px", border: "1px solid var(--border-default)", background: "var(--surface-card)", color: "var(--ink-900)" }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--green-100)", color: "var(--green-700)", display: "grid", placeItems: "center", fontSize: 10.5, fontWeight: 600 }}>{owner.personName.trim().charAt(0).toUpperCase()}</span>
      {owner.personName}{owner.role ? <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>· {owner.role}</span> : null}
    </button>
  );
}
