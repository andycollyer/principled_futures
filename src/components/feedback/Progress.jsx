"use client";
import React from "react";

const TONES = { brand: "var(--brand)", success: "var(--status-success)", warning: "var(--status-warning)", danger: "var(--status-danger)", ink: "var(--ink-700)" };

/**
 * Progress — horizontal progress / score bar.
 */
export function Progress({ value = 0, max = 100, tone = "brand", size = "md", showLabel = false, style = {}, ...props }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const height = { sm: 6, md: 8, lg: 12 }[size] || 8;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, ...style }} {...props}>
      <div style={{ flex: 1, height, background: "var(--ink-200)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: TONES[tone] || TONES.brand,
            borderRadius: "var(--radius-pill)",
            transition: "width var(--duration-slow) var(--ease-out)",
          }}
        />
      </div>
      {showLabel && <span className="pf-tnum" style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-primary)", minWidth: 38, textAlign: "right" }}>{Math.round(pct)}%</span>}
    </div>
  );
}

