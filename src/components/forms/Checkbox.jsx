"use client";
import React from "react";

/**
 * Checkbox — green-filled checkbox with label.
 */
export function Checkbox({ label = null, description = null, checked, defaultChecked, disabled = false, style = {}, ...props }) {
  return (
    <label style={{ display: "inline-flex", alignItems: description ? "flex-start" : "center", gap: 10, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.55 : 1, ...style }}>
      <input
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          width: 18,
          height: 18,
          flexShrink: 0,
          marginTop: description ? 2 : 0,
          border: "1.5px solid var(--border-strong)",
          borderRadius: "var(--radius-xs)",
          background: "var(--surface-card)",
          display: "grid",
          placeItems: "center",
          cursor: "inherit",
          backgroundImage: "var(--pf-check-bg, none)",
          transition: "background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)",
        }}
        onChange={props.onChange}
        ref={(el) => {
          if (el) {
            const on = el.checked;
            el.style.background = on ? "var(--brand)" : "var(--surface-card)";
            el.style.borderColor = on ? "var(--brand)" : "var(--border-strong)";
            el.style.backgroundImage = on
              ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 8 3.5 3.5L13 5'/%3E%3C/svg%3E\")"
              : "none";
            el.style.backgroundSize = "13px";
            el.style.backgroundRepeat = "no-repeat";
            el.style.backgroundPosition = "center";
          }
        }}
        {...props}
      />
      {(label || description) && (
        <span>
          {label && <span style={{ fontSize: "var(--text-base)", color: "var(--text-primary)", fontWeight: "var(--weight-medium)" }}>{label}</span>}
          {description && <span style={{ display: "block", fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: 1 }}>{description}</span>}
        </span>
      )}
    </label>
  );
}

