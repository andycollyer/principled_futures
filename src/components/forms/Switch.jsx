"use client";
import React from "react";

const SIZES = { sm: { w: 32, h: 18, k: 14 }, md: { w: 40, h: 22, k: 18 } };

/**
 * Switch — on/off toggle (controlled or uncontrolled).
 */
export function Switch({ checked, defaultChecked = false, disabled = false, size = "md", label = null, onChange, style = {}, ...props }) {
  const [on, setOn] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const value = isControlled ? checked : on;
  const s = SIZES[size] || SIZES.md;
  const toggle = (e) => {
    if (disabled) return;
    if (!isControlled) setOn((v) => !v);
    onChange && onChange(!value, e);
  };
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.55 : 1, ...style }}>
      <span
        role="switch"
        aria-checked={value}
        onClick={toggle}
        style={{
          position: "relative",
          width: s.w,
          height: s.h,
          flexShrink: 0,
          borderRadius: "var(--radius-pill)",
          background: value ? "var(--brand)" : "var(--ink-300)",
          transition: "background var(--duration-base) var(--ease-out)",
        }}
        {...props}
      >
        <span
          style={{
            position: "absolute",
            top: (s.h - s.k) / 2,
            left: value ? s.w - s.k - (s.h - s.k) / 2 : (s.h - s.k) / 2,
            width: s.k,
            height: s.k,
            borderRadius: "50%",
            background: "var(--white)",
            boxShadow: "var(--shadow-xs)",
            transition: "left var(--duration-base) var(--ease-out)",
          }}
        />
      </span>
      {label && <span style={{ fontSize: "var(--text-base)", color: "var(--text-primary)", fontWeight: "var(--weight-medium)" }}>{label}</span>}
    </label>
  );
}

