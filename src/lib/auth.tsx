// src/lib/auth.tsx
// Auth context: magic-link sign-in, session, and the caller's organisation.
// Signed out (or Supabase not configured) the app runs on local storage —
// the prototype is never gated behind login.
"use client";

import React from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  ready: boolean;              // resolved the initial session check
  configured: boolean;         // Supabase env present
  session: Session | null;
  user: User | null;
  orgId: string | null;        // the caller's organisation
  authError: string | null;    // e.g. an expired sign-in link
  signInPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

/** Read and clear an auth error left in the URL hash by a failed redirect. */
function takeHashError(): string | null {
  if (typeof window === "undefined") return null;
  const h = window.location.hash;
  if (!h.includes("error")) return null;
  const p = new URLSearchParams(h.replace(/^#/, ""));
  const code = p.get("error_code");
  const desc = p.get("error_description")?.replace(/\+/g, " ");
  // Clean the hash so it doesn't linger in the URL.
  try { window.history.replaceState(null, "", window.location.pathname + window.location.search); } catch {}
  if (!p.get("error")) return null;
  if (code === "otp_expired") return "That sign-in link had expired. Sign-in links last about an hour — request a fresh one below.";
  return desc || "Sign-in didn't complete. Please request a new link.";
}

const Ctx = React.createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(!isSupabaseConfigured);
  const [session, setSession] = React.useState<Session | null>(null);
  const [orgId, setOrgId] = React.useState<string | null>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);

  // Capture an expired/failed-link error from the redirect hash on first load.
  React.useEffect(() => { setAuthError(takeHashError()); }, []);

  // Ensure the signed-in user has a profile + organisation; return the org id.
  const ensureOrg = React.useCallback(async (user: User): Promise<string | null> => {
    if (!supabase) return null;
    // provision_org (a SECURITY DEFINER function) atomically returns the
    // caller's organisation, creating it + their profile on first sign-in.
    // This sidesteps the RLS chicken-and-egg: a brand-new user has no profile
    // yet, so ordinary policies can't resolve their org during creation.
    const { data, error } = await supabase.rpc("provision_org", {
      org_name: user.email?.split("@")[1] ?? "My organisation",
    });
    if (error) { console.warn("provision_org:", error.message); return null; }
    return (data as string) ?? null;
  }, []);

  React.useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) setOrgId(await ensureOrg(data.session.user));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      setSession(s);
      setOrgId(s?.user ? await ensureOrg(s.user) : null);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [ensureOrg]);

  const signInPassword = React.useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: "Backend not configured." };
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (!error) return { error: null };
    return { error: /invalid login credentials/i.test(error.message) ? "That email and password don't match." : error.message };
  }, []);

  const signUpPassword = React.useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: "Backend not configured." };
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    if (!error) return { error: null };
    return { error: /already registered/i.test(error.message) ? "An account already exists for that email — sign in instead." : error.message };
  }, []);

  const signOut = React.useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setOrgId(null);
  }, []);

  const value: AuthState = {
    ready,
    configured: isSupabaseConfigured,
    session,
    user: session?.user ?? null,
    orgId,
    authError,
    signInPassword,
    signUpPassword,
    signOut,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
