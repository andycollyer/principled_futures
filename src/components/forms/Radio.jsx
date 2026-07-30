"use client";
import React from "react";

/**
 * Radio — single-choice control with label.
 */
export function Radio({ label = null, description = null, checked, defaultChecked, disabled = false, name, value, style = {}, ...props }) {
  return (
    <label style={{ display: "inline-flex", alignItems: description ? "flex-start" : "center", gap: 10, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.55 : 1, ...style }}>
      <span style={{ position: "relative", width: 18, height: 18, flexShrink: 0, marginTop: description ? 2 : 0 }}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            width: 18,
            height: 18,
            margin: 0,
            border: "1.5px solid var(--border-strong)",
            borderRadius: "50%",
            background: "var(--surface-card)",
            cursor: "inherit",
          }}
          ref={(el) => {
            if (el) {
              el.style.borderColor = el.checked ? "var(--brand)" : "var(--border-strong)";
              el.style.borderWidth = el.checked ? "5px" : "1.5px";
            }
          }}
          {...props}
        />
      </span>
      {(label || description) && (
        <span>
          {label && <span style={{ fontSize: "var(--text-base)", color: "var(--text-primary)", fontWeight: "var(--weight-medium)" }}>{label}</span>}
          {description && <span style={{ display: "block", fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: 1 }}>{description}</span>}
        </span>
      )}
    </label>
  );
}

