"use client";
import React from "react";

const TONES = {
  neutral: { bg: "var(--ink-100)", fg: "var(--ink-600)", border: "var(--ink-200)", solid: "var(--ink-700)" },
  brand:   { bg: "var(--green-100)", fg: "var(--green-700)", border: "var(--green-200)", solid: "var(--green-600)" },
  success: { bg: "var(--status-success-bg)", fg: "var(--status-success)", border: "var(--success-500)", solid: "var(--status-success)" },
  warning: { bg: "var(--status-warning-bg)", fg: "var(--status-warning)", border: "var(--warning-500)", solid: "var(--status-warning)" },
  danger:  { bg: "var(--status-danger-bg)", fg: "var(--status-danger)", border: "var(--danger-500)", solid: "var(--status-danger)" },
  info:    { bg: "var(--status-info-bg)", fg: "var(--status-info)", border: "var(--info-500)", solid: "var(--status-info)" },
};

const SIZES = {
  sm: { fontSize: "var(--text-2xs)", padding: "2px 7px", dot: 5 },
  md: { fontSize: "var(--text-xs)", padding: "3px 9px", dot: 6 },
};

/**
 * Badge — compact status / category label.
 */
export function Badge({
  tone = "neutral",
  variant = "soft",
  size = "md",
  pill = true,
  dot = false,
  style = {},
  children,
  ...props
}) {
  const t = TONES[tone] || TONES.neutral;
  const s = SIZES[size] || SIZES.md;
  const isSolid = variant === "solid";
  const isOutline = variant === "outline";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: s.padding,
        fontFamily: "var(--font-sans)",
        fontSize: s.fontSize,
        fontWeight: "var(--weight-medium)",
        lineHeight: 1.3,
        color: isSolid ? "var(--white)" : t.fg,
        background: isSolid ? t.solid : isOutline ? "transparent" : t.bg,
        border: `1px solid ${isOutline ? t.border : "transparent"}`,
        borderRadius: pill ? "var(--radius-pill)" : "var(--radius-sm)",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...props}
    >
      {dot && (
        <span style={{ width: s.dot, height: s.dot, borderRadius: "50%", background: isSolid ? "var(--white)" : t.solid, flexShrink: 0 }} />
      )}
      {children}
    </span>
  );
}

