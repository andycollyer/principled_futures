"use client";
import React from "react";

/**
 * ListGroup — vertical list of rows with optional icon, meta, and chevron.
 */
export function ListGroup({ items = [], style = {}, ...props }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-xl)", overflow: "hidden", ...style }} {...props}>
      {items.map((item, i) => {
        const clickable = !!item.onClick || !!item.href;
        const Row = item.href ? "a" : "div";
        return (
          <Row
            key={i}
            href={item.href}
            onClick={item.onClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 16px",
              borderBottom: i < items.length - 1 ? "1px solid var(--border-subtle)" : "none",
              textDecoration: "none",
              color: "inherit",
              cursor: clickable ? "pointer" : "default",
              transition: "background var(--duration-fast) var(--ease-out)",
            }}
            onMouseEnter={clickable ? (e) => (e.currentTarget.style.background = "var(--surface-canvas)") : undefined}
            onMouseLeave={clickable ? (e) => (e.currentTarget.style.background = "transparent") : undefined}
          >
            {item.icon && <span style={{ display: "inline-flex", width: 18, height: 18, color: "var(--text-tertiary)", flexShrink: 0 }}>{item.icon}</span>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-medium)", color: "var(--text-primary)" }}>{item.label}</div>
              {item.description && <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: 1 }}>{item.description}</div>}
            </div>
            {item.meta && <span style={{ fontSize: "var(--text-sm)", color: "var(--text-tertiary)", flexShrink: 0 }}>{item.meta}</span>}
            {clickable && (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="m9 6 6 6-6 6" /></svg>
            )}
          </Row>
        );
      })}
    </div>
  );
}

