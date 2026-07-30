"use client";
import React from "react";

const SIZES = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };
const FONTS = { xs: 10, sm: 12, md: 14, lg: 16, xl: 22 };

/**
 * Avatar — user / organisation identity token.
 */
export function Avatar({
  size = "md",
  src = null,
  alt = "",
  initials = "",
  shape = "circle",
  status = null,
  style = {},
  ...props
}) {
  const dim = SIZES[size] || SIZES.md;
  const radius = shape === "square" ? "var(--radius-md)" : "var(--radius-pill)";
  const statusColor = { online: "var(--status-success)", busy: "var(--status-danger)", away: "var(--status-warning)", offline: "var(--ink-400)" }[status];
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0, ...style }} {...props}>
      <span
        style={{
          width: dim,
          height: dim,
          borderRadius: radius,
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--green-600)",
          color: "var(--white)",
          fontFamily: "var(--font-sans)",
          fontSize: FONTS[size],
          fontWeight: "var(--weight-semibold)",
          letterSpacing: "0.01em",
          userSelect: "none",
        }}
      >
        {src ? (
          <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          initials.slice(0, 2).toUpperCase()
        )}
      </span>
      {status && (
        <span
          style={{
            position: "absolute",
            right: -1,
            bottom: -1,
            width: Math.max(8, dim * 0.26),
            height: Math.max(8, dim * 0.26),
            borderRadius: "50%",
            background: statusColor,
            border: "2px solid var(--surface-card)",
          }}
        />
      )}
    </span>
  );
}

