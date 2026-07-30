"use client";
import React from "react";

/**
 * Pagination — page navigation control.
 */
export function Pagination({ page = 1, total = 1, onChange, style = {}, ...props }) {
  const go = (p) => { if (p >= 1 && p <= total && p !== page) onChange && onChange(p); };
  const pages = [];
  const add = (p) => pages.push(p);
  add(1);
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) add("…");
  for (let p = start; p <= end; p++) add(p);
  if (end < total - 1) add("…");
  if (total > 1) add(total);

  const btn = (content, opts = {}) => {
    const { active, disabled, onClick, key, label } = opts;
    return (
      <button
        key={key}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        style={{
          minWidth: 34,
          height: 34,
          padding: "0 8px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--weight-medium)",
          color: active ? "var(--white)" : disabled ? "var(--text-tertiary)" : "var(--text-primary)",
          background: active ? "var(--action-primary)" : "transparent",
          border: `1px solid ${active ? "var(--action-primary)" : "var(--border-subtle)"}`,
          borderRadius: "var(--radius-md)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {content}
      </button>
    );
  };

  return (
    <nav aria-label="Pagination" style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }} {...props}>
      {btn(<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>, { key: "prev", disabled: page === 1, onClick: () => go(page - 1), label: "Previous" })}
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`e${i}`} style={{ minWidth: 20, textAlign: "center", color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>…</span>
          : btn(p, { key: p, active: p === page, onClick: () => go(p), label: `Page ${p}` })
      )}
      {btn(<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>, { key: "next", disabled: page === total, onClick: () => go(page + 1), label: "Next" })}
    </nav>
  );
}

