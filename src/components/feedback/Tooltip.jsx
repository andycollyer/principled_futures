"use client";
import React from "react";

/**
 * Tooltip — hover hint. CSS-only show/hide on hover/focus.
 */
export function Tooltip({ label, placement = "top", style = {}, children, ...props }) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    left: { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
    right: { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
  }[placement];
  return (
    <span
      style={{ position: "relative", display: "inline-flex", ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      {...props}
    >
      {children}
      <span
        role="tooltip"
        style={{
          position: "absolute",
          ...pos,
          padding: "6px 9px",
          background: "var(--ink-900)",
          color: "var(--white)",
          fontSize: "var(--text-xs)",
          fontWeight: "var(--weight-medium)",
          lineHeight: 1.4,
          borderRadius: "var(--radius-sm)",
          whiteSpace: "nowrap",
          boxShadow: "var(--shadow-md)",
          opacity: show ? 1 : 0,
          visibility: show ? "visible" : "hidden",
          transition: "opacity var(--duration-fast) var(--ease-out)",
          pointerEvents: "none",
          zIndex: 60,
        }}
      >
        {label}
      </span>
    </span>
  );
}

