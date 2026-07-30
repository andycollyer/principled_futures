// src/lib/content.ts
// Reads library prose from the database at the moment it is displayed.
//
// Why this exists: the app is a static export, so anything imported into a
// page is downloadable by anyone — a login screen hides the interface but not
// the data. Keeping briefing bodies and glossary definitions out of the bundle
// and behind row-level security is the only way to actually withhold them.
//
// The gate is enforced in Postgres (see 0004_content_tables.sql), not here.
// This module just asks, and turns "no rows" into a state the UI can render.

import { authedClient, isSupabaseConfigured } from "./supabase";
import { articleFor } from "./content-meta";

export type ContentState = "ok" | "signin" | "upgrade" | "unavailable";

export interface BriefingBody {
  state: ContentState;
  body: string[];
}

/**
 * The paragraphs of a criterion briefing.
 *
 * Returns "signin" for anonymous readers, "upgrade" when a free account asks
 * for a briefing outside the free samples, and "unavailable" if the backend
 * isn't reachable. RLS is what actually withholds the rows; we only interpret
 * the silence.
 */
export async function fetchBriefingBody(criterionId: string): Promise<BriefingBody> {
  if (!isSupabaseConfigured) return { state: "unavailable", body: [] };

  const supabase = await authedClient();
  if (!supabase) return { state: "signin", body: [] };

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return { state: "signin", body: [] };

  const { data, error } = await supabase
    .from("briefings")
    .select("body")
    .eq("criterion_id", criterionId)
    .maybeSingle();

  if (error) return { state: "unavailable", body: [] };
  if (data?.body) return { state: "ok", body: data.body as string[] };

  // Signed in but no row came back: the policy declined it. That means a free
  // plan reaching past the samples — unless the briefing genuinely isn't there.
  return { state: articleFor(criterionId) ? "upgrade" : "unavailable", body: [] };
}

/** Glossary definitions keyed by term. Any signed-in user; empty when signed out. */
export async function fetchGlossaryDefs(): Promise<{ state: ContentState; defs: Record<string, string> }> {
  if (!isSupabaseConfigured) return { state: "unavailable", defs: {} };

  const supabase = await authedClient();
  if (!supabase) return { state: "signin", defs: {} };

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return { state: "signin", defs: {} };

  const { data, error } = await supabase.from("glossary_terms").select("term, def");
  if (error) return { state: "unavailable", defs: {} };

  const defs: Record<string, string> = {};
  for (const row of data ?? []) defs[row.term as string] = row.def as string;
  return { state: "ok", defs };
}

/** The paragraphs of a product guide. Any signed-in user. */
export async function fetchGuideBody(id: string): Promise<BriefingBody> {
  if (!isSupabaseConfigured) return { state: "unavailable", body: [] };

  const supabase = await authedClient();
  if (!supabase) return { state: "signin", body: [] };

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return { state: "signin", body: [] };

  const { data, error } = await supabase.from("guides").select("body").eq("id", id).maybeSingle();
  if (error) return { state: "unavailable", body: [] };
  if (data?.body) return { state: "ok", body: data.body as string[] };
  return { state: "unavailable", body: [] };
}
