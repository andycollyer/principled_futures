// src/lib/store.ts
// Assessment answers, keyed by criterion id "1.1".."8.8", values 0-4.
// Dual-mode: signed out (or backend not configured) it reads/writes local
// storage — the prototype, unchanged. Signed in, it reads/writes the cloud,
// and imports any local prototype answers into the account on first sign-in.
"use client";

import { useCallback, useEffect, useState } from "react";
import type { Answers, Level } from "./framework";
import { supabase, authedClient } from "./supabase";
import { useAuth } from "./auth";

const KEY = "pf-answers-v1";

export function loadAnswers(): Answers {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const out: Answers = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 4) out[k] = v as Level;
      }
      return out;
    }
  } catch {
    // corrupt storage — treat as unanswered
  }
  return {};
}

export function saveAnswers(answers: Answers): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    // storage unavailable — answers stay in memory for the session
  }
}

async function cloudLoad(orgId: string): Promise<Answers> {
  const db = await authedClient();
  if (!db) return {};
  const { data } = await db.from("answers").select("criterion_id, value").eq("organisation_id", orgId);
  const out: Answers = {};
  for (const row of data ?? []) out[row.criterion_id as string] = row.value as Level;
  return out;
}

async function cloudUpsert(orgId: string, id: string, value: Level): Promise<void> {
  const db = await authedClient();
  if (!db) return;
  const { error } = await db.from("answers").upsert(
    { organisation_id: orgId, criterion_id: id, value, updated_at: new Date().toISOString() },
    { onConflict: "organisation_id,criterion_id" }
  );
  if (error) console.warn("answers upsert:", error.message);
}

/**
 * Assessment answers with persistence. `ready` is false until the source
 * (local or cloud) has resolved.
 */
export function useAnswers(): {
  answers: Answers;
  setAnswer: (id: string, value: number) => void;
  ready: boolean;
} {
  const { orgId, ready: authReady } = useAuth();
  const [answers, setAnswers] = useState<Answers>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    if (!authReady) return;
    (async () => {
      if (orgId && supabase) {
        let cloud = await cloudLoad(orgId);
        // First sign-in: import local prototype answers if the account is empty.
        if (Object.keys(cloud).length === 0) {
          const local = loadAnswers();
          if (Object.keys(local).length > 0) {
            const db = await authedClient();
            if (db) await db.from("answers").upsert(
              Object.entries(local).map(([criterion_id, value]) => ({ organisation_id: orgId, criterion_id, value })),
              { onConflict: "organisation_id,criterion_id" }
            );
            cloud = local;
          }
        }
        if (active) { setAnswers(cloud); setReady(true); }
      } else {
        if (active) { setAnswers(loadAnswers()); setReady(true); }
      }
    })();
    return () => { active = false; };
  }, [orgId, authReady]);

  const setAnswer = useCallback((id: string, value: number) => {
    const v = value as Level;
    setAnswers((prev) => {
      const next = { ...prev, [id]: v };
      if (orgId && supabase) { void cloudUpsert(orgId, id, v); }
      else { saveAnswers(next); }
      return next;
    });
  }, [orgId]);

  return { answers, setAnswer, ready };
}
