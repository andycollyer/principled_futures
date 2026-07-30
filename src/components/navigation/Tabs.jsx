"use client";
import React from "react";

/**
 * Tabs — horizontal tab navigation (underline or pill).
 */
export function Tabs({ items = [], value, defaultValue, onChange, variant = "underline", style = {}, ...props }) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.id);
  const active = value !== undefined ? value : internal;
  const select = (id) => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };
  const isPill = variant === "pill";
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        gap: isPill ? 4 : 2,
        padding: isPill ? 4 : 0,
        background: isPill ? "var(--surface-sunken)" : "transparent",
        borderRadius: isPill ? "var(--radius-lg)" : 0,
        borderBottom: isPill ? "none" : "1px solid var(--border-subtle)",
        ...style,
      }}
      {...props}
    >
      {items.map((item) => {
        const on = item.id === active;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={on}
            onClick={() => select(item.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: isPill ? "7px 14px" : "10px 4px",
              margin: isPill ? 0 : "0 12px 0 0",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-base)",
              fontWeight: "var(--weight-medium)",
              color: on ? (isPill ? "var(--text-primary)" : "var(--brand)") : "var(--text-secondary)",
              background: isPill && on ? "var(--surface-card)" : "transparent",
              border: "none",
              borderBottom: isPill ? "none" : `2px solid ${on ? "var(--brand)" : "transparent"}`,
              borderRadius: isPill ? "var(--radius-md)" : 0,
              boxShadow: isPill && on ? "var(--shadow-xs)" : "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color var(--duration-fast) var(--ease-out)",
            }}
          >
            {item.icon && <span style={{ display: "inline-flex", width: 16, height: 16 }}>{item.icon}</span>}
            {item.label}
            {item.count != null && (
              <span style={{ fontSize: "var(--text-2xs)", fontWeight: "var(--weight-semibold)", color: on ? "var(--brand)" : "var(--text-tertiary)", background: on ? "var(--green-100)" : "var(--surface-sunken)", padding: "1px 6px", borderRadius: "var(--radius-pill)" }}>{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

