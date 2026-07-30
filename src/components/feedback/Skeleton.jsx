"use client";
import React from "react";

/**
 * Skeleton — content placeholder while loading.
 */
export function Skeleton({ width = "100%", height = 14, radius = "var(--radius-sm)", circle = false, style = {}, ...props }) {
  return (
    <span
      style={{
        display: "block",
        width: circle ? height : width,
        height,
        borderRadius: circle ? "50%" : radius,
        background: "linear-gradient(90deg, var(--ink-100) 25%, var(--ink-200) 37%, var(--ink-100) 63%)",
        backgroundSize: "400% 100%",
        animation: "pf-shimmer 1.4s ease infinite",
        ...style,
      }}
      {...props}
    >
      <style>{"@keyframes pf-shimmer{0%{background-position:100% 50%}100%{background-position:0 50%}}"}</style>
    </span>
  );
}

