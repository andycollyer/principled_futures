"use client";
import React from "react";

/**
 * Kbd — keyboard key hint.
 */
export function Kbd({ style = {}, children, ...props }) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 20,
        height: 20,
        padding: "0 6px",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-2xs)",
        fontWeight: "var(--weight-medium)",
        color: "var(--text-secondary)",
        background: "var(--surface-card)",
        border: "1px solid var(--border-default)",
        borderBottomWidth: 2,
        borderRadius: "var(--radius-sm)",
        ...style,
      }}
      {...props}
    >
      {children}
    </kbd>
  );
}

