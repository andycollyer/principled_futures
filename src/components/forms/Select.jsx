"use client";
import React from "react";

/**
 * Select — native dropdown styled to match Input.
 */
export function Select({ size = "md", invalid = false, disabled = false, style = {}, children, ...props }) {
  const heights = { sm: 34, md: 40, lg: 46 };
  const [focus, setFocus] = React.useState(false);
  const borderColor = invalid ? "var(--status-danger)" : focus ? "var(--border-focus)" : "var(--border-default)";
  return (
    <div style={{ position: "relative", display: "inline-flex", width: "100%", ...style }}>
      <select
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          width: "100%",
          height: heights[size],
          padding: "0 38px 0 13px",
          background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
          border: `1px solid ${borderColor}`,
          borderRadius: "var(--radius-md)",
          boxShadow: focus ? "var(--ring)" : "none",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-base)",
          color: "var(--text-primary)",
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
          opacity: disabled ? 0.6 : 1,
        }}
        {...props}
      >
        {children}
      </select>
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <path d="m4 6 4 4 4-4" />
      </svg>
    </div>
  );
}

