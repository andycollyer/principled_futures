"use client";
import React from "react";

/**
 * Divider — horizontal or vertical rule, optionally with a centered label.
 */
export function Divider({ orientation = "horizontal", label = null, style = {}, ...props }) {
  if (orientation === "vertical") {
    return <span style={{ display: "inline-block", width: 1, alignSelf: "stretch", background: "var(--border-subtle)", ...style }} {...props} />;
  }
  if (label) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }} {...props}>
        <span style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", fontWeight: "var(--weight-medium)", whiteSpace: "nowrap" }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
      </div>
    );
  }
  return <hr style={{ border: "none", height: 1, background: "var(--border-subtle)", margin: 0, ...style }} {...props} />;
}

