"use client";
import React from "react";

/**
 * Textarea — multi-line text field.
 */
export function Textarea({ invalid = false, disabled = false, rows = 4, style = {}, ...props }) {
  const [focus, setFocus] = React.useState(false);
  const borderColor = invalid ? "var(--status-danger)" : focus ? "var(--border-focus)" : "var(--border-default)";
  return (
    <textarea
      rows={rows}
      disabled={disabled}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: "100%",
        padding: "10px 13px",
        background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--radius-md)",
        boxShadow: focus ? (invalid ? "0 0 0 3px color-mix(in srgb, var(--status-danger) 22%, transparent)" : "var(--ring)") : "none",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-base)",
        color: "var(--text-primary)",
        lineHeight: "var(--leading-normal)",
        outline: "none",
        resize: "vertical",
        transition: "border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      {...props}
    />
  );
}

