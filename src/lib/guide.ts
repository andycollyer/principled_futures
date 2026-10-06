// src/lib/guide.ts
// Asks the guide (supabase/functions/guide). The function does the work and
// holds the rules; this only sends the question and shapes the reply.
"use client";

import { authedClient } from "./supabase";

export interface GuideSource { n: number; title: string; publisher: string; year: number; url: string; locator?: string }
export interface GuideAnswer { answer: string; covered: boolean; sources: GuideSource[]; related: { id: string; title: string }[]; checked: string | null; model?: string }
export type GuideResult = { ok: true; data: GuideAnswer } | { ok: false; code: string; error: string };

export async function askGuide(criterion: string, question: string, model?: string): Promise<GuideResult> {
  const db = await authedClient();
  const { data: s } = db ? await db.auth.getSession() : { data: { session: null } };
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!db || !s.session || !base || !key) return { ok: false, code: "signin", error: "Sign in to use the guide." };
  try {
    const res = await fetch(`${base}/functions/v1/guide`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${s.session.access_token}` },
      body: JSON.stringify(model ? { criterion, question, model } : { criterion, question }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, code: body.code ?? String(res.status), error: body.error ?? "The guide could not answer just now." };
    return { ok: true, data: body as GuideAnswer };
  } catch {
    return { ok: false, code: "network", error: "The guide could not be reached. Check your connection and try again." };
  }
}
