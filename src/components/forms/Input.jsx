"use client";
import React from "react";

const SIZES = {
  sm: { height: 34, padding: "0 11px", fontSize: "var(--text-sm)" },
  md: { height: 40, padding: "0 13px", fontSize: "var(--text-base)" },
  lg: { height: 46, padding: "0 15px", fontSize: "var(--text-md)" },
};

/**
 * Input — single-line text field with optional leading/trailing adornments.
 */
export function Input({
  size = "md",
  invalid = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...props
}) {
  const s = SIZES[size] || SIZES.md;
  const [focus, setFocus] = React.useState(false);
  const borderColor = invalid ? "var(--status-danger)" : focus ? "var(--border-focus)" : "var(--border-default)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: s.height,
        padding: s.padding,
        background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--radius-md)",
        boxShadow: focus ? (invalid ? "0 0 0 3px color-mix(in srgb, var(--status-danger) 22%, transparent)" : "var(--ring)") : "none",
        transition: "border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {iconLeft && <span style={{ display: "inline-flex", width: 16, height: 16, color: "var(--text-tertiary)", flexShrink: 0 }}>{iconLeft}</span>}
      <input
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "var(--font-sans)",
          fontSize: s.fontSize,
          color: "var(--text-primary)",
        }}
        {...props}
      />
      {iconRight && <span style={{ display: "inline-flex", width: 16, height: 16, color: "var(--text-tertiary)", flexShrink: 0 }}>{iconRight}</span>}
    </div>
  );
}

