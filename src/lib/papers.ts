// src/lib/papers.ts
// Fetches a board paper through the issue-paper function rather than linking
// to a public file. The reader's identity is stamped into every page, so a
// copy that turns up elsewhere points back at the account that took it.

import { supabase, isSupabaseConfigured } from "./supabase";

export interface IssueResult {
  ok: boolean;
  error?: string;
  upgrade?: boolean;   // refused because the plan doesn't include it
  signin?: boolean;    // refused because nobody is signed in
}

/**
 * Open a board paper in a new tab, watermarked for this reader.
 *
 * The bytes come back through the function and are handed to the browser as a
 * blob, so the storage object itself is never given a public address.
 */
export async function openPaper(file: string): Promise<IssueResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: "The library is unavailable at the moment." };
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) return { ok: false, signin: true, error: "Sign in to open this paper." };

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let res: Response;
  try {
    res = await fetch(`${base}/functions/v1/issue-paper`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ file }),
    });
  } catch {
    return { ok: false, error: "Couldn't reach the library. Please try again." };
  }

  if (!res.ok) {
    let payload: { error?: string; upgrade?: boolean } = {};
    try { payload = await res.json(); } catch { /* non-JSON error body */ }
    return {
      ok: false,
      upgrade: payload.upgrade,
      signin: res.status === 401,
      error: payload.error ?? "That paper couldn't be opened.",
    };
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  // Give the new tab time to take the blob before revoking it.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return { ok: true };
}
