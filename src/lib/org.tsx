// src/lib/org.tsx
// Who the client is: organisation (name, sector, size, plan) and the reader
// (name, role). Asked once at first sign-in, then used by the chrome and the
// report. One fetch per session, shared through context.
"use client";

import React from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import { profileComplete, type Profile } from "./profile";

export interface OrgDetails {
  orgName: string; sector: string; size: string; plan: string | null;
  fullName: string; jobTitle: string;
  profile: Profile;
}
export const SECTORS = [
  "Financial services", "Professional services", "Technology and software", "Healthcare and life sciences",
  "Public sector", "Education", "Charity and not-for-profit", "Retail and consumer", "Manufacturing and engineering",
  "Energy and utilities", "Media and communications", "Property and construction", "Transport and logistics", "Other",
];
export const SIZES = ["1 to 49 people", "50 to 249 people", "250 to 999 people", "1,000 to 4,999 people", "5,000 or more people"];

interface OrgState {
  ready: boolean;              // resolved (or nothing to resolve: signed out / no backend)
  details: OrgDetails | null;  // null when signed out
  complete: boolean;           // the first-sign-in questions have been answered
  save: (d: Omit<OrgDetails, "plan">) => Promise<string | null>; // error message, or null
}

const Ctx = React.createContext<OrgState | null>(null);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { ready: authReady, orgId, session } = useAuth();
  const [details, setDetails] = React.useState<OrgDetails | null>(null);
  const [ready, setReady] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!supabase || !orgId || !session?.user) { setDetails(null); return; }
    const [o, p] = await Promise.all([
      supabase.from("organisations").select("name, sector, size, plan, profile").eq("id", orgId).single(),
      supabase.from("profiles").select("full_name, job_title").eq("id", session.user.id).single(),
    ]);
    setDetails({
      orgName: o.data?.name ?? "", sector: o.data?.sector ?? "", size: o.data?.size ?? "", plan: o.data?.plan ?? null,
      fullName: p.data?.full_name ?? "", jobTitle: p.data?.job_title ?? "",
      profile: (o.data?.profile ?? {}) as Profile,
    });
  }, [orgId, session]);

  React.useEffect(() => {
    if (!authReady) return;
    let live = true;
    setReady(false);
    load().finally(() => { if (live) setReady(true); });
    return () => { live = false; };
  }, [authReady, load]);

  const save = React.useCallback(async (d: Omit<OrgDetails, "plan">) => {
    if (!supabase) return "Not connected.";
    const { error } = await supabase.rpc("save_org_details", {
      p_org_name: d.orgName, p_sector: d.sector, p_size: d.size, p_full_name: d.fullName, p_job_title: d.jobTitle,
    });
    if (error) return error.message;
    const { error: profileError } = await supabase.rpc("save_org_profile", { p_profile: d.profile });
    if (profileError) return profileError.message;
    await load();
    return null;
  }, [load]);

  const complete = !!details && !!details.orgName && !!details.sector && !!details.size && !!details.fullName && !!details.jobTitle && profileComplete(details.profile);
  return <Ctx.Provider value={{ ready, details, complete, save }}>{children}</Ctx.Provider>;
}

export function useOrg(): OrgState {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useOrg must be used inside OrgProvider");
  return v;
}
