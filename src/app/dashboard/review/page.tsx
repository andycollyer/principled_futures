"use client";

/* Adviser review. Advisers only (the database refuses everyone else). The queue
   of reports clients have asked to have reviewed; open one to read the report
   exactly as the client will see it, then approve it or ask for changes. */

import React from "react";
import * as DS from "@/components/ds";
import { overallScore, band } from "@/lib/framework";
import { ReportBody } from "@/components/report/ReportBody";
import { useReportReview, fetchQueue, fetchReviewPack, decideReview, longDate, type QueueItem, type ReviewPack } from "@/lib/reviews";

const STATUS: Record<string, { label: string; tone: string }> = {
  requested: { label: "Awaiting review", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  changes: { label: "Changes requested", tone: "neutral" },
};

export default function ReviewPage() {
  const { ready, isTeam } = useReportReview();
  const [queue, setQueue] = React.useState<QueueItem[] | null>(null);
  const [pack, setPack] = React.useState<ReviewPack | null>(null);
  const [note, setNote] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadQueue = React.useCallback(() => { fetchQueue().then(setQueue); }, []);
  React.useEffect(() => { if (ready && isTeam) loadQueue(); }, [ready, isTeam, loadQueue]);

  const open = async (id: string) => { setError(null); const p = await fetchReviewPack(id); setPack(p); setNote(p?.review.note ?? ""); window.scrollTo(0, 0); };
  const decide = async (status: "approved" | "changes") => {
    if (!pack) return;
    setBusy(true);
    const err = await decideReview(pack.review.id, status, note);
    setBusy(false);
    if (err) { setError(err); return; }
    setPack(null); loadQueue();
  };

  if (!ready) return <div style={{ padding: 28 }} />;
  if (!isTeam) {
    return (
      <div style={{ padding: 28, maxWidth: 720, margin: "0 auto" }}>
        <h1 className="pf-display" style={{ fontSize: 24, color: "var(--ink-900)" }}>Adviser review</h1>
        <p style={{ fontSize: 14.5, color: "var(--text-secondary)", marginTop: 8 }}>This page is for Principled Futures advisers.</p>
      </div>
    );
  }

  if (pack) {
    const score = overallScore(pack.review.answers);
    return (
      <div style={{ background: "#fff" }}>
        <div style={{ position: "sticky", top: 64, zIndex: 20, background: "var(--surface-card)", borderBottom: "1px solid var(--border-subtle)", padding: "14px 28px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <label htmlFor="review-note" style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)", marginBottom: 5 }}>
                Adviser&rsquo;s note to {pack.org.orgName} <span style={{ fontWeight: 400, color: "var(--text-tertiary)" }}>(shown on the report; optional when approving)</span>
              </label>
              <DS.Textarea id="review-note" rows={2} value={note} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)} placeholder="What the board should take from this report, or what needs to change before it can be approved." />
            </div>
            <DS.Button variant="ghost" onClick={() => setPack(null)}>Back to queue</DS.Button>
            <DS.Button variant="outline" disabled={busy || !note.trim()} onClick={() => decide("changes")}>Ask for changes</DS.Button>
            <DS.Button variant="primary" disabled={busy} onClick={() => decide("approved")}>Approve report</DS.Button>
          </div>
          {error && <p style={{ maxWidth: 880, margin: "8px auto 0", fontSize: 13, color: "var(--status-danger)" }}>{error}</p>}
        </div>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px 28px 56px", display: "flex", flexDirection: "column", gap: 34 }}>
          <div style={{ paddingBottom: 16, borderBottom: "2px solid var(--green-600)" }}>
            <div className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>{pack.org.orgName}</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
              {[pack.org.sector, pack.org.size].filter(Boolean).join(" · ")} · requested by {[pack.org.fullName, pack.org.jobTitle].filter(Boolean).join(", ") || "the account holder"} on {longDate(pack.review.requested_at)}
            </div>
          </div>
          {score == null
            ? <p style={{ fontSize: 14.5, color: "var(--text-secondary)" }}>This request holds no answers.</p>
            : <ReportBody answers={pack.review.answers} owners={pack.owners} details={pack.org} trends={{}} headline={`${pack.org.orgName}: ${band(score)} at ${score} out of 100`} />}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 28, maxWidth: 960, margin: "0 auto" }}>
      <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>Adviser review</h1>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4, maxWidth: 640, lineHeight: 1.55 }}>
        Reports clients have asked to have reviewed. A client sees their report only once you approve it, and it then carries your name and the date.
      </p>
      <p style={{ fontSize: 13.5, marginTop: 8 }}><a href="/dashboard/guide-pilot/" style={{ color: "var(--text-link)", fontWeight: 600, textDecoration: "none" }}>Guide pilot: compare the two models</a></p>
      <div style={{ marginTop: 20, border: "1px solid var(--border-default)", borderRadius: 10 }}>
        {queue == null && <p style={{ padding: 20, fontSize: 14, color: "var(--text-tertiary)" }}>Loading…</p>}
        {queue?.length === 0 && <p style={{ padding: 20, fontSize: 14, color: "var(--text-secondary)" }}>Nothing is waiting. Requests appear here when a client asks for review from their report page.</p>}
        {queue?.map((q, i) => (
          <div key={q.id} className="pf-r-stack" style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderTop: i ? "1px solid var(--border-subtle)" : "none" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>{q.org}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>
                {[q.sector, q.size].filter(Boolean).join(" · ")}{q.requested_by ? ` · ${q.requested_by}${q.job_title ? `, ${q.job_title}` : ""}` : ""} · requested {longDate(q.requested_at)}
                {q.reviewed_at ? ` · ${q.status === "approved" ? "approved" : "returned"} ${longDate(q.reviewed_at)}` : ""}
              </div>
            </div>
            <span className="pf-tnum" style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>{q.overall ?? "—"}</span>
            <DS.Badge tone={STATUS[q.status].tone} pill={false}>{STATUS[q.status].label}</DS.Badge>
            <DS.Button variant={q.status === "requested" ? "primary" : "outline"} size="sm" onClick={() => open(q.id)}>{q.status === "requested" ? "Review" : "Open"}</DS.Button>
          </div>
        ))}
      </div>
    </div>
  );
}
