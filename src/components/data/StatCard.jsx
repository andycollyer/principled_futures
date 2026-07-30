"use client";
import React from "react";

/**
 * StatCard — KPI / metric tile with optional trend delta.
 */
export function StatCard({ label, value, unit = null, delta = null, deltaDirection = "up", icon = null, footnote = null, style = {}, ...props }) {
  const positive = deltaDirection === "up";
  const deltaColor = delta == null ? "var(--text-tertiary)" : positive ? "var(--status-success)" : "var(--status-danger)";
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-card)",
        padding: 20,
        ...style,
      }}
      {...props}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--text-secondary)" }}>{label}</span>
        {icon && <span style={{ display: "inline-flex", width: 18, height: 18, color: "var(--text-tertiary)" }}>{icon}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 10 }}>
        <span className="pf-tnum" style={{ fontSize: "var(--text-4xl)", fontWeight: "var(--weight-bold)", color: "var(--text-primary)", letterSpacing: "var(--tracking-tight)", lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", color: "var(--text-tertiary)" }}>{unit}</span>}
      </div>
      {(delta != null || footnote) && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
          {delta != null && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: deltaColor }}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: positive ? "none" : "rotate(180deg)" }}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              {delta}
            </span>
          )}
          {footnote && <span style={{ fontSize: "var(--text-sm)", color: "var(--text-tertiary)" }}>{footnote}</span>}
        </div>
      )}
    </div>
  );
}

