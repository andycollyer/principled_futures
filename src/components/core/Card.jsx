"use client";
import React from "react";

/**
 * Card — the primary surface container. White, one-pixel border, flat.
 */
export function Card({
  padding = "md",
  hover = false,
  as: Tag = "div",
  style = {},
  children,
  ...props
}) {
  const pad = { none: 0, sm: 16, md: 20, lg: 28 }[padding] ?? 20;
  const [h, setH] = React.useState(false);
  return (
    <Tag
      onMouseEnter={hover ? () => setH(true) : undefined}
      onMouseLeave={hover ? () => setH(false) : undefined}
      style={{
        background: "var(--surface-card)",
        border: `1px solid ${h ? "var(--border-strong)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-lg)",
        padding: pad,
        transition: "border-color var(--duration-base) var(--ease-out)",
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Card.Header — title row with optional action slot. */
export function CardHeader({ title, subtitle, action, style = {}, ...props }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16, ...style }} {...props}>
      <div style={{ minWidth: 0 }}>
        {title && <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", color: "var(--text-primary)", letterSpacing: "var(--tracking-snug)" }}>{title}</div>}
        {subtitle && <div style={{ marginTop: 2, fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{subtitle}</div>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

