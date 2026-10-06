// src/lib/reviews.ts
// Adviser review of the advisory report (migration 0012). A client asks for a
// review; an adviser approves a frozen copy of the answers; the client then
// sees the report built from that approved copy.
"use client";

import React from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";
import type { Answers } from "./framework";
import type { MetricOwner } from "./telemetry-owners";
import type { OrgDetails } from "./org";

export interface Review {
  id: string; status: "requested" | "approved" | "changes";
  requested_at: string; reviewed_at: string | null; reviewer_name: string | null; note: string | null;
  overall: number | null; answers?: Answers;
}
export interface QueueItem extends Review { org: string; sector: string | null; size: string | null; requested_by: string | null; job_title: string | null }
export interface ReviewPack { review: Review & { answers: Answers }; org: OrgDetails; owners: Record<string, MetricOwner> }

export const sameAnswers = (a: Answers, b: Answers): boolean => {
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => a[k] === b[k]);
};
export const longDate = (iso: string | null | undefined): string =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

/** The signed-in client's view: is this an adviser, and where does my organisation's report stand? */
export function useReportReview() {
  const { ready: authReady, session, orgId } = useAuth();
  const [state, setState] = React.useState<{ ready: boolean; isTeam: boolean; latest: Review | null; approved: (Review & { answers: Answers }) | null }>({ ready: false, isTeam: false, latest: null, approved: null });

  const load = React.useCallback(async () => {
    if (!supabase || !session || !orgId) { setState({ ready: true, isTeam: false, latest: null, approved: null }); return; }
    const [team, mine] = await Promise.all([supabase.rpc("is_team"), supabase.rpc("my_report_review")]);
    setState({ ready: true, isTeam: team.data === true, latest: mine.data?.latest ?? null, approved: mine.data?.approved ?? null });
  }, [session, orgId]);

  React.useEffect(() => { if (authReady) void load(); }, [authReady, load]);

  const request = React.useCallback(async (overall: number): Promise<string | null> => {
    if (!supabase) return "Not connected.";
    const { error } = await supabase.rpc("request_report_review", { p_overall: overall });
    if (error) return error.message;
    await load();
    return null;
  }, [load]);

  return { ...state, request, reload: load };
}

export async function fetchQueue(): Promise<QueueItem[]> {
  if (!supabase) return [];
  const { data } = await supabase.rpc("review_queue");
  return (data ?? []) as QueueItem[];
}
export async function fetchReviewPack(id: string): Promise<ReviewPack | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("review_get", { p_id: id });
  if (error || !data) return null;
  return { review: data.review, owners: data.owners ?? {}, org: { ...data.org, ...(data.reader ?? { fullName: "", jobTitle: "" }) } };
}
export async function decideReview(id: string, status: "approved" | "changes", note: string): Promise<string | null> {
  if (!supabase) return "Not connected.";
  const { error } = await supabase.rpc("review_decide", { p_id: id, p_status: status, p_note: note });
  return error ? error.message : null;
}
