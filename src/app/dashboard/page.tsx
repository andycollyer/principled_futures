"use client";

/* Overview — one page, read top to bottom: where you stand, domain by domain
   (what each score means and the next step), then who owns it. The old
   Telemetry screen is folded in here; its demo figures are gone, because the
   product must not show a customer numbers it does not hold. */

import React from "react";
import { useRouter } from "next/navigation";
import * as DS from "@/components/ds";
import * as UI from "@/components/icons";
import { framework, overallScore, band, domainScore, progress } from "@/lib/framework";
import { useAnswers } from "@/lib/store";
import { BAND_MEANING, nextStep } from "@/lib/guidance";
import { MEASURES } from "@/lib/measures";
import { Ownership } from "@/components/overview/Ownership";
import { OwnersProvider, OwnerChip, useOverviewOwners } from "@/components/overview/Owners";
import { LiveMap, LEVEL_COLORS } from "@/components/overview/LiveMap";
import { BAND_LABELS } from "@/lib/framework";
import { LINKS } from "@/lib/content-meta";

const BAND_COLORS: Record<string, string> = {
  Initial: "var(--status-danger)",
  Developing: "var(--status-warning)",
  Defined: "var(--status-info)",
  Managed: "var(--status-success)",
  Leading: "var(--green-600)",
};

const h2: React.CSSProperties = { fontSize: 19, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.011em" };
const link: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--text-link)", textDecoration: "none", whiteSpace: "nowrap" };

function BandTag({ label }: { label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--ink-900)" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: BAND_COLORS[label] }} />{label}
    </span>
  );
}

export default function DashboardPage() {
  return <OwnersProvider><Overview /></OwnersProvider>;
}

function Overview() {
  const router = useRouter();
  const { answers, ready } = useAnswers();
  const { owners, ready: ownersReady } = useOverviewOwners();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [openDomain, setOpenDomain] = React.useState<number | null>(null);
  const showOnMap = (id: string) => { setSelected(id); document.getElementById("map")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const score = ready ? overallScore(answers) : null;
  const done = ready ? progress(answers) : { answered: 0, total: 64 };
  const complete = done.answered === done.total;

  // Arriving from an old Telemetry link lands on the ownership section.
  React.useEffect(() => {
    if (ready && window.location.hash === "#owners") document.getElementById("owners")?.scrollIntoView();
  }, [ready]);

  return (
    <div style={{ padding: 28, maxWidth: 1080, margin: "0 auto" }}>
      <div className="pf-r-stack" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 22 }}>
        <div>
          <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>Overview</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Where your board stands on governing AI, what it means, and what to do next.</p>
        </div>
        <DS.Button variant="primary" size="sm" iconLeft={<UI.IFile size={15} />} onClick={() => router.push("/dashboard/report")}>Advisory report</DS.Button>
      </div>

      {/* 1 — Where you stand */}
      <DS.Card style={{ padding: 28 }}>
        <h2 style={h2}>Where you stand</h2>
        {score == null ? (
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 640 }}>
              Nothing answered yet. The assessment is 64 questions across eight domains. You can stop and return at any point, and your position appears here as soon as you answer the first one.
            </p>
            <div style={{ marginTop: 16 }}><DS.Button variant="primary" onClick={() => router.push("/dashboard/assessment")}>Start the assessment</DS.Button></div>
          </div>
        ) : (
          <div className="pf-r-col" style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 28, alignItems: "center", marginTop: 14 }}>
            <DS.ScoreGauge score={score} size={150} bandLabel={band(score)} bandColor={BAND_COLORS[band(score)]} />
            <div>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>What this means</p>
              <p style={{ fontSize: 17, color: "var(--ink-900)", lineHeight: 1.5, marginTop: 4, maxWidth: 620 }}>
                <strong>{band(score)}.</strong> {BAND_MEANING[band(score)]}
              </p>
              <p className="pf-tnum" style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 12, maxWidth: 620 }}>
                {complete
                  ? "All 64 questions answered. The score is the average of the eight domains below, each out of 100."
                  : `${done.answered} of ${done.total} questions answered, so this is a partial position: it covers only what you have answered so far.`}
              </p>
              {!complete && <div style={{ marginTop: 14 }}><DS.Button variant="primary" size="sm" onClick={() => router.push("/dashboard/assessment")}>Continue the assessment</DS.Button></div>}
            </div>
          </div>
        )}
      </DS.Card>

      {/* 2 — How it connects */}
      <div id="map" style={{ marginTop: 16, scrollMarginTop: 80 }}>
        <DS.Card style={{ padding: 28 }}>
          <h2 style={h2}>How it connects</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4, maxWidth: 720, lineHeight: 1.55 }}>
            Your 64 answers, coloured by level, and the {LINKS.length} links between them. A weak answer rarely stays in its own domain: select any point to see what it holds back and what it depends on.
          </p>
          <LiveMap answers={ready ? answers : {}} selected={selected} onSelect={setSelected} />
        </DS.Card>
      </div>

      {/* 3 — Domain by domain */}
      <DS.Card style={{ padding: 28, marginTop: 16 }}>
        <h2 style={h2}>Domain by domain</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4, maxWidth: 720, lineHeight: 1.55 }}>
          Each domain is scored out of 100 from its eight questions. Under each score: what it means, and the single step that would move your weakest answer up a level.
        </p>
        <div style={{ marginTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
          {framework.map((d) => {
            const s = ready ? domainScore(d, answers) : null;
            const step = ready ? nextStep(d, answers) : null;
            const mine = MEASURES.filter((m) => m.domainId === d.id);
            const unowned = ownersReady ? mine.filter((m) => !owners[m.id]).length : 0;
            return (
              <div key={d.id} style={{ padding: "18px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <span className="pf-tnum" style={{ width: 26, height: 26, borderRadius: 7, background: "var(--green-100)", color: "var(--green-700)", display: "grid", placeItems: "center", fontSize: 12.5, fontWeight: 700, flexShrink: 0 }}>{d.id}</span>
                  <span style={{ flex: 1, minWidth: 180, fontSize: 15, fontWeight: 600, color: "var(--ink-900)" }}>{d.name}</span>
                  <OwnerChip ownerKey={`domain-${d.id}`} label={d.name} quiet />
                  {s != null && <BandTag label={band(s)} />}
                  <span style={{ width: 150 }}><DS.Progress value={s ?? 0} tone={s == null ? "neutral" : "brand"} /></span>
                  <span className="pf-tnum" style={{ width: 34, textAlign: "right", fontSize: 15, fontWeight: 600, color: s == null ? "var(--text-tertiary)" : "var(--ink-900)" }}>{s == null ? "—" : s}</span>
                </div>
                <div style={{ paddingLeft: 40, marginTop: 8, maxWidth: 820 }}>
                  {s == null || !step ? (
                    <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55 }}>
                      Not answered yet. {d.description}{" "}
                      <a href={`/dashboard/assessment/?q=${d.id}.1`} style={link}>Answer this domain</a>
                    </p>
                  ) : (
                    <>
                      <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55 }}>
                        <span style={{ color: "var(--ink-900)", fontWeight: 500 }}>What this means.</span> {BAND_MEANING[band(s)]}
                      </p>
                      <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.55, marginTop: 6 }}>
                        <span style={{ color: "var(--ink-900)", fontWeight: 500 }}>Next step.</span>{" "}
                        {step.targetLabel
                          ? <>Your weakest answer is <span style={{ color: "var(--ink-900)" }}>{step.criterion.title}</span>, at {step.currentLabel}. {step.targetLabel} looks like this: {step.target}</>
                          : <>Every answer here is at the top level. Holding it looks like this: {step.target}</>}{" "}
                        <a href={`/dashboard/research/${step.criterion.id}/`} style={link}>Read the evidence brief</a>
                      </p>
                    </>
                  )}
                  <button onClick={() => setOpenDomain(openDomain === d.id ? null : d.id)} aria-expanded={openDomain === d.id}
                    style={{ ...link, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-sans)", marginTop: 8, display: "inline-block" }}>
                    {openDomain === d.id ? "Hide the eight answers" : "Show the eight answers"}
                  </button>
                  {openDomain === d.id && (
                    <div style={{ display: "grid", gap: 0, marginTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
                      {d.criteria.map((c) => {
                        const a = ready ? answers[c.id] : undefined;
                        return (
                          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border-subtle)", flexWrap: "wrap" }}>
                            <span className="pf-tnum" style={{ width: 28, fontSize: 12.5, fontWeight: 700, color: "var(--green-700)" }}>{c.id}</span>
                            <span style={{ flex: 1, minWidth: 160, fontSize: 13.5, color: "var(--ink-900)" }}>{c.title}</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: a === undefined ? "var(--text-tertiary)" : "var(--ink-900)", width: 110 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: a === undefined ? "var(--ink-300)" : LEVEL_COLORS[a] }} />{a === undefined ? "Not answered" : BAND_LABELS[a]}
                            </span>
                            <button onClick={() => showOnMap(c.id)} style={{ ...link, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-sans)" }}>Show on map</button>
                            <a href={`/dashboard/assessment/?q=${c.id}`} style={link}>{a === undefined ? "Answer" : "Change"}</a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {mine.length > 0 && (
                    <p className="pf-tnum" style={{ fontSize: 12.5, color: "var(--text-tertiary)", marginTop: 6 }}>
                      {mine.length === 1 ? "1 measure" : `${mine.length} measures`} to track: {mine.map((m) => m.name.toLowerCase()).join(", ")}
                      {ownersReady && unowned > 0 ? ` · ${unowned} without an owner. ` : ". "}
                      <a href="#owners" style={{ ...link, fontSize: 12.5 }}>Who owns it</a>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DS.Card>

      {/* 4 — Who owns it */}
      <div id="owners" style={{ marginTop: 16, scrollMarginTop: 80 }}><Ownership /></div>
    </div>
  );
}
