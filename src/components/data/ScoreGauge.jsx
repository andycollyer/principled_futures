"use client";
import React from "react";

const BANDS = {
  risk:  { color: "var(--status-danger)", label: "Critical" },
  warn:  { color: "var(--status-warning)", label: "Developing" },
  ok:    { color: "var(--status-success)", label: "Established" },
  lead:  { color: "var(--green-600)", label: "Leading" },
};

function bandFor(score) {
  if (score < 40) return "risk";
  if (score < 60) return "warn";
  if (score < 80) return "ok";
  return "lead";
}

/**
 * ScoreGauge — circular maturity-score dial (0–100) with band label.
 */
export function ScoreGauge({ score = 0, size = 132, label = null, bandLabel = null, bandColor = null, style = {}, ...props }) {
  const auto = BANDS[bandFor(score)];
  const band = { color: bandColor || auto.color, label: bandLabel || auto.label };
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, score)) / 100);
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8, ...style }} {...props}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ink-200)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={band.color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset var(--duration-slow) var(--ease-out)" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span className="pf-tnum" style={{ fontSize: size * 0.3, fontWeight: "var(--weight-bold)", color: "var(--text-primary)", letterSpacing: "var(--tracking-tight)", lineHeight: 1 }}>{Math.round(score)}</span>
          <span style={{ fontSize: "var(--text-2xs)", fontWeight: "var(--weight-semibold)", textTransform: "uppercase", letterSpacing: "0.06em", color: band.color, marginTop: 2 }}>{band.label}</span>
        </div>
      </div>
      {label && <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontWeight: "var(--weight-medium)" }}>{label}</span>}
    </div>
  );
}

