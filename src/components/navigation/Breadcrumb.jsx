"use client";
import React from "react";

/**
 * Breadcrumb — hierarchical location trail.
 */
export function Breadcrumb({ items = [], style = {}, ...props }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, ...style }} {...props}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {item.href && !last ? (
              <a href={item.href} style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", textDecoration: "none", fontWeight: "var(--weight-medium)" }}>{item.label}</a>
            ) : (
              <span style={{ fontSize: "var(--text-sm)", color: last ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: last ? "var(--weight-semibold)" : "var(--weight-medium)" }} aria-current={last ? "page" : undefined}>{item.label}</span>
            )}
            {!last && (
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
            )}
          </span>
        );
      })}
    </nav>
  );
}

