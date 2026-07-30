// src/lib/history.ts
// Score history: a dated snapshot of overall + domain scores. Dual-mode —
// local storage when signed out (prototype), the cloud when signed in. Feeds
// telemetry trends and the report's quarter-on-quarter movement.
"use client";

import { framework, overallScore, domainScore, progress, type Answers } from "./framework";
import { supabase, authedClient } from "./supabase";

export interface Snapshot {
  date: string; // YYYY-MM-DD
  overall: number | null;
  domains: Record<number, number | null>;
  answered: number;
}

const KEY = "pf-score-history-v1";
const MAX_SNAPSHOTS = 400;

export function loadHistory(): Snapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((s) => s && typeof s.date === "string");
  } catch {
    // corrupt storage — start fresh
  }
  return [];
}

function snapshotFrom(answers: Answers): Snapshot | null {
  const p = progress(answers);
  if (p.answered === 0) return null;
  const today = new Date().toISOString().slice(0, 10);
  return {
    date: today,
    overall: overallScore(answers),
    domains: Object.fromEntries(framework.map((d) => [d.id, domainScore(d, answers)])),
    answered: p.answered,
  };
}

/** Record today's scores; same-day snapshots are replaced, not appended. */
export function recordSnapshot(answers: Answers, orgId?: string | null): void {
  if (typeof window === "undefined") return;
  const snap = snapshotFrom(answers);
  if (!snap) return;

  if (orgId && supabase) {
    void (async () => {
      const db = await authedClient();
      if (!db) return;
      const { error } = await db.from("score_history").upsert(
        { organisation_id: orgId, snapshot_date: snap.date, overall: snap.overall, domains: snap.domains, answered: snap.answered },
        { onConflict: "organisation_id,snapshot_date" }
      );
      if (error) console.warn("score_history upsert:", error.message);
    })();
    return;
  }

  const history = loadHistory();
  const next = history[history.length - 1]?.date === snap.date ? [...history.slice(0, -1), snap] : [...history, snap];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next.slice(-MAX_SNAPSHOTS)));
  } catch {
    // storage unavailable — skip
  }
}

/** Load history from the cloud (signed in) or local storage. */
export async function loadHistoryAsync(orgId?: string | null): Promise<Snapshot[]> {
  const db = orgId ? await authedClient() : null;
  if (orgId && db) {
    const { data } = await db
      .from("score_history")
      .select("snapshot_date, overall, domains, answered")
      .eq("organisation_id", orgId)
      .order("snapshot_date", { ascending: true });
    return (data ?? []).map((r) => ({
      date: r.snapshot_date as string,
      overall: r.overall as number | null,
      domains: (r.domains as Record<number, number | null>) ?? {},
      answered: (r.answered as number) ?? 0,
    }));
  }
  return loadHistory();
}

/**
 * Movement since the previous distinct day, computed from a history array.
 * +n / -n, or null when there is nothing earlier to compare. domainId
 * omitted = overall.
 */
export function trendFrom(history: Snapshot[], domainId?: number): number | null {
  if (history.length < 2) return null;
  const latest = history[history.length - 1];
  const previous = history[history.length - 2];
  const pick = (s: Snapshot) => (domainId == null ? s.overall : s.domains[domainId]);
  const a = pick(previous), b = pick(latest);
  if (a == null || b == null) return null;
  return b - a;
}

/** Local-only convenience kept for the prototype path. */
export function trend(domainId?: number): number | null {
  return trendFrom(loadHistory(), domainId);
}
