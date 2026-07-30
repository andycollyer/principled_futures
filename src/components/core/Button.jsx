"use client";
import React from "react";

const SIZES = {
  sm: { height: 32, padding: "0 12px", fontSize: "var(--text-sm)", gap: 6, icon: 15 },
  md: { height: 38, padding: "0 16px", fontSize: "var(--text-base)", gap: 8, icon: 16 },
  lg: { height: 44, padding: "0 22px", fontSize: "var(--text-md)", gap: 8, icon: 18 },
};

function palette(variant) {
  switch (variant) {
    case "primary": // ink/navy — the serious corporate default
      return { background: "var(--action-primary)", color: "var(--action-primary-text)", border: "1px solid var(--action-primary)", hover: "var(--action-primary-hover)" };
    case "brand": // brand green — for affirmative/primary-path actions
      return { background: "var(--brand)", color: "var(--text-on-brand)", border: "1px solid var(--brand)", hover: "var(--brand-hover)" };
    case "soft":
      return { background: "var(--green-100)", color: "var(--green-700)", border: "1px solid transparent", hover: "var(--green-200)" };
    case "outline":
      return { background: "var(--surface-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)", hover: "var(--surface-sunken)" };
    case "ghost":
      return { background: "transparent", color: "var(--text-primary)", border: "1px solid transparent", hover: "var(--surface-sunken)" };
    case "danger":
      return { background: "var(--status-danger)", color: "var(--white)", border: "1px solid var(--status-danger)", hover: "var(--danger-700)" };
    case "link":
      return { background: "transparent", color: "var(--text-link)", border: "1px solid transparent", hover: "transparent" };
    default:
      return palette("primary");
  }
}

/**
 * Button — the primary corporate action control.
 */
export function Button({
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  type = "button",
  style = {},
  children,
  ...props
}) {
  const s = SIZES[size] || SIZES.md;
  const p = palette(variant);
  const [hover, setHover] = React.useState(false);
  const isLink = variant === "link";

  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: block ? "flex" : "inline-flex",
        width: block ? "100%" : "auto",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: isLink ? "auto" : s.height,
        padding: isLink ? 0 : s.padding,
        fontFamily: "var(--font-sans)",
        fontSize: s.fontSize,
        fontWeight: "var(--weight-medium)",
        lineHeight: 1,
        color: p.color,
        background: hover && !disabled ? p.hover : p.background,
        border: p.border,
        borderRadius: isLink ? 0 : "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        textDecoration: isLink && hover ? "underline" : "none",
        transition: "background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...props}
    >
      {iconLeft && <span style={{ display: "inline-flex", width: s.icon, height: s.icon }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: "inline-flex", width: s.icon, height: s.icon }}>{iconRight}</span>}
    </button>
  );
}

