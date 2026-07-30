"use client";
import React from "react";

const SIZES = { sm: 32, md: 38, lg: 44 };
const ICON = { sm: 16, md: 18, lg: 20 };

/**
 * IconButton — square icon-only action (toolbar, rail, table rows).
 */
export function IconButton({
  variant = "ghost",
  size = "md",
  disabled = false,
  label,
  style = {},
  children,
  ...props
}) {
  const dim = SIZES[size] || SIZES.md;
  const [hover, setHover] = React.useState(false);
  const styles = {
    ghost: { bg: "transparent", fg: "var(--text-secondary)", hover: "var(--surface-sunken)", border: "transparent" },
    outline: { bg: "var(--surface-card)", fg: "var(--text-primary)", hover: "var(--surface-sunken)", border: "var(--border-default)" },
    solid: { bg: "var(--action-primary)", fg: "var(--white)", hover: "var(--action-primary-hover)", border: "var(--action-primary)" },
    brand: { bg: "var(--brand)", fg: "var(--white)", hover: "var(--brand-hover)", border: "var(--brand)" },
  }[variant] || {};
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim,
        height: dim,
        color: styles.fg,
        background: hover && !disabled ? styles.hover : styles.bg,
        border: `1px solid ${styles.border}`,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background var(--duration-fast) var(--ease-out)",
        ...style,
      }}
      {...props}
    >
      <span style={{ display: "inline-flex", width: ICON[size], height: ICON[size] }}>{children}</span>
    </button>
  );
}

