// src/lib/supabase.ts
// The browser Supabase client. Uses the publishable (client-safe) key — the
// database's row-level security is what actually protects data, so this key
// living in the browser is by design. The app works with or without this
// configured: unconfigured (or signed out) it runs on local storage, exactly
// as the prototype always has.
"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;
if (isSupabaseConfigured) {
  client = createClient(url as string, key as string, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

export const supabase = client;

/**
 * Return the client only once its auth session is attached, so background
 * writes never race sign-in and go out unauthenticated (which RLS silently
 * drops). Resolves to null when signed out or unconfigured.
 */
export async function authedClient(): Promise<SupabaseClient | null> {
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session ? client : null;
}
