"use client";

/* Dashboard / Overview — governance overview wired to real assessment scores.
   Telemetry register and KPI cards remain prototype mock data (out of scope
   until the telemetry phase). */

import React from "react";
import { useRouter } from "next/navigation";
import * as DS from "@/components/ds";
import * as UI from "@/components/icons";
import { framework, overallScore, band, domainScore } from "@/lib/framework";
import { useAnswers } from "@/lib/store";

const TELEMETRY_ROWS = [
  { metric: "Scaling Status", owner: "CEO / CAIO", value: "42%", tone: "success", band: "On track" },
  { metric: "Realised ROI", owner: "CFO", value: "1.3x", tone: "success", band: "Positive" },
  { metric: "Model Drift", owner: "CTO", value: "1.4%", tone: "success", band: "Within" },
  { metric: "Bias / Disparate Impact", owner: "Ethics Officer", value: "1.31", tone: "warning", band: "Watch" },
  { metric: "Hallucination Rate", owner: "Product Lead", value: "0.7%", tone: "success", band: "Within" },
  { metric: "Shadow AI Detection", owner: "CISO", value: "3", tone: "danger", band: "Breach" },
  { metric: "Kill-Switch Readiness", owner: "CISO & CTO", value: "Active", tone: "success", band: "Tested" },
  { metric: "Regulatory Readiness", owner: "CCO", value: "Audit-ready", tone: "success", band: "Compliant" },
  { metric: "AI Carbon Footprint", owner: "ESG Cttee", value: "Within cap", tone: "success", band: "Within" },
];

const DOMAIN_ICONS = [
  <UI.IScale size={16} key="1" />,
  <UI.IUsers size={16} key="2" />,
  <UI.IShield size={16} key="3" />,
  <UI.IPulse size={16} key="4" />,
  <UI.IDoc size={16} key="5" />,
  <UI.ITrend size={16} key="6" />,
  <UI.IUsers size={16} key="7" />,
  <UI.ILeaf size={16} key="8" />,
];

const BAND_COLORS: Record<string, string> = {
  Initial: "var(--status-danger)",
  Developing: "var(--status-warning)",
  Defined: "var(--status-info)",
  Managed: "var(--status-success)",
  Leading: "var(--green-600)",
};

function CategoryRow({ label, score, icon }: { label: string; score: number | null; icon: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 0", borderBottom: "1px solid var(--border-subtle)" }}>
      <span style={{ display: "inline-flex", width: 30, height: 30, borderRadius: 8, background: "var(--green-100)", color: "var(--green-600)", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: "var(--ink-900)" }}>{label}</span>
      <div style={{ width: 140 }}>
        <DS.Progress value={score ?? 0} tone={score == null ? "neutral" : score < 40 ? "danger" : score < 60 ? "warning" : "brand"} />
      </div>
      <span className="pf-tnum" style={{ width: 34, textAlign: "right", fontSize: 14, fontWeight: 600, color: score == null ? "var(--text-tertiary)" : "var(--ink-900)" }}>{score == null ? "—" : score}</span>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { answers, ready } = useAnswers();
  const toneBadge: Record<string, string> = { success: "success", warning: "warning", danger: "danger" };

  const score = ready ? overallScore(answers) : null;

  return (
    <div style={{ padding: 28, maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 22 }}>
        <div>
          <h1 className="pf-display" style={{ fontSize: 26, color: "var(--ink-900)" }}>Governance overview</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>Continuous oversight for Acme Holdings PLC.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <DS.Button variant="outline" size="sm" iconLeft={<UI.IDownload size={15} />}>Export</DS.Button>
          <DS.Button variant="primary" size="sm" iconLeft={<UI.IFile size={15} />} onClick={() => router.push("/dashboard/report")}>Generate report</DS.Button>
        </div>
      </div>

      {/* Top row: gauge + KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, marginBottom: 16 }}>
        <DS.Card style={{ display: "grid", placeItems: "center" }}>
          {score == null ? (
            <div style={{ textAlign: "center", padding: "18px 8px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)" }}>Assessment not started</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "6px 0 14px" }}>Your governance score appears once you begin.</p>
              <DS.Button variant="brand" size="sm" onClick={() => router.push("/dashboard/assessment")}>Start assessment</DS.Button>
            </div>
          ) : (
            <DS.ScoreGauge score={score} size={150} label="Overall governance" bandLabel={band(score)} bandColor={BAND_COLORS[band(score)]} />
          )}
        </DS.Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <DS.StatCard label="Scaling status" value="42" unit="%" delta="+6 pts" footnote="vs last quarter" icon={<UI.ITrend size={17} />} />
          <DS.StatCard label="Realised ROI" value="1.3" unit="x" delta="+0.2x" footnote="vs business case" icon={<UI.ITrend size={17} />} />
          <DS.StatCard label="Shadow AI" value="3" delta="2 new" deltaDirection="down" footnote="zero-tolerance" icon={<UI.IAlert size={17} />} />
          <DS.StatCard label="Kill-switch" value="Active" footnote="tested weekly" icon={<UI.IShield size={17} />} />
        </div>
      </div>

      {/* Risk alert */}
      <div style={{ marginBottom: 16 }}>
        <DS.Alert tone="danger" title="Shadow AI threshold breached">
          3 unsanctioned AI tools detected this month against a zero-tolerance policy. Owner: CISO. Review the security category before the next board meeting.
        </DS.Alert>
      </div>

      {/* Two columns: category breakdown + telemetry table */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16 }}>
        <DS.Card>
          <DS.CardHeader title="Category maturity" subtitle="8×8 framework" />
          {framework.map((d, i) => (
            <CategoryRow key={d.id} label={d.name} score={ready ? domainScore(d, answers) : null} icon={DOMAIN_ICONS[i]} />
          ))}
          <div style={{ paddingTop: 12 }}>
            <DS.Button variant="link" iconRight={<UI.IChevronRight size={15} />} onClick={() => router.push("/dashboard/assessment")}>View full assessment</DS.Button>
          </div>
        </DS.Card>

        <DS.Card padding="none">
          <div style={{ padding: "20px 20px 14px" }}>
            <DS.CardHeader title="Telemetry register" subtitle="Continuous oversight · demo values" action={<DS.Badge tone="neutral" dot>Demo data</DS.Badge>} style={{ marginBottom: 0 }} />
          </div>
          <DS.Table
            dense
            style={{ border: "none", borderRadius: 0 }}
            columns={[
              { key: "metric", header: "Metric" },
              { key: "owner", header: "Owner" },
              { key: "value", header: "Value", align: "right" },
              { key: "status", header: "Status", align: "right" },
            ]}
            rows={TELEMETRY_ROWS.map((r) => ({
              metric: <span style={{ fontWeight: 500 }}>{r.metric}</span>,
              owner: <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{r.owner}</span>,
              value: <span className="pf-tnum" style={{ fontWeight: 600 }}>{r.value}</span>,
              status: <DS.Badge tone={toneBadge[r.tone]} dot>{r.band}</DS.Badge>,
            }))}
          />
        </DS.Card>
      </div>
    </div>
  );
}
