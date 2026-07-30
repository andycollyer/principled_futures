// src/lib/telemetry-owners.ts
// Owner assignment for telemetry metrics: every measure belongs to one named
// person in one accountability ring. Persists via the same localStorage seam
// as assessment answers (Supabase later). Read by the Telemetry screen and,
// in the report phase, by the Advisory Report's accountable-owner fields.
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase, authedClient } from "./supabase";
import { useAuth } from "./auth";

export interface MetricOwner {
  metricId: string;
  personName: string;
  role: string;
  ring: 1 | 2 | 3;
  assignedAt: string; // ISO date
}

const KEY = "pf-telemetry-owners-v1";

export function loadOwners(): Record<string, MetricOwner> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const out: Record<string, MetricOwner> = {};
      for (const [k, v] of Object.entries(parsed)) {
        const o = v as MetricOwner;
        if (
          o &&
          typeof o.personName === "string" &&
          typeof o.role === "string" &&
          (o.ring === 1 || o.ring === 2 || o.ring === 3)
        ) {
          out[k] = { ...o, metricId: k };
        }
      }
      return out;
    }
  } catch {
    // corrupt storage — treat as unassigned
  }
  return {};
}

export function saveOwners(owners: Record<string, MetricOwner>): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(owners));
  } catch {
    // storage unavailable — assignments stay in memory for the session
  }
}

/**
 * Metric owner assignments with persistence. `ready` is false until the
 * client has hydrated from localStorage.
 */
export function useOwners(): {
  owners: Record<string, MetricOwner>;
  assignOwner: (metricId: string, personName: string, role: string, ring: 1 | 2 | 3) => void;
  ready: boolean;
} {
  const { orgId, ready: authReady } = useAuth();
  const [owners, setOwners] = useState<Record<string, MetricOwner>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    if (!authReady) return;
    (async () => {
      const db = orgId ? await authedClient() : null;
      if (orgId && db) {
        const { data } = await db
          .from("metric_owners")
          .select("metric_id, person_name, role, ring, assigned_at")
          .eq("organisation_id", orgId);
        const out: Record<string, MetricOwner> = {};
        for (const r of data ?? []) {
          out[r.metric_id as string] = {
            metricId: r.metric_id as string,
            personName: r.person_name as string,
            role: (r.role as string) ?? "",
            ring: r.ring as 1 | 2 | 3,
            assignedAt: (r.assigned_at as string) ?? new Date(0).toISOString(),
          };
        }
        // First sign-in: import local owner assignments if the account is empty.
        if (Object.keys(out).length === 0) {
          const local = loadOwners();
          if (Object.keys(local).length > 0) {
            await db.from("metric_owners").upsert(
              Object.values(local).map((o) => ({ organisation_id: orgId, metric_id: o.metricId, person_name: o.personName, role: o.role, ring: o.ring })),
              { onConflict: "organisation_id,metric_id" }
            );
            if (active) { setOwners(local); setReady(true); }
            return;
          }
        }
        if (active) { setOwners(out); setReady(true); }
      } else {
        if (active) { setOwners(loadOwners()); setReady(true); }
      }
    })();
    return () => { active = false; };
  }, [orgId, authReady]);

  const assignOwner = useCallback(
    (metricId: string, personName: string, role: string, ring: 1 | 2 | 3) => {
      const entry: MetricOwner = { metricId, personName, role, ring, assignedAt: new Date().toISOString() };
      setOwners((prev) => {
        const next = { ...prev, [metricId]: entry };
        if (orgId && supabase) {
          void (async () => {
            const db = await authedClient();
            if (!db) return;
            const { error } = await db.from("metric_owners").upsert(
              { organisation_id: orgId, metric_id: metricId, person_name: personName, role, ring, assigned_at: entry.assignedAt },
              { onConflict: "organisation_id,metric_id" }
            );
            if (error) console.warn("metric_owners upsert:", error.message);
          })();
        } else {
          saveOwners(next);
        }
        return next;
      });
    },
    [orgId]
  );

  return { owners, assignOwner, ready };
}
