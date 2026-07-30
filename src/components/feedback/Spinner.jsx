"use client";
import React from "react";

/**
 * Spinner — indeterminate loading indicator.
 */
export function Spinner({ size = 20, tone = "brand", style = {}, ...props }) {
  const color = { brand: "var(--brand)", ink: "var(--ink-500)", white: "var(--white)" }[tone] || "var(--brand)";
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `${Math.max(2, size / 10)}px solid color-mix(in srgb, ${color} 22%, transparent)`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "pf-spin 0.7s linear infinite",
        ...style,
      }}
      {...props}
    >
      <style>{"@keyframes pf-spin{to{transform:rotate(360deg)}}"}</style>
    </span>
  );
}

