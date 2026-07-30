"use client";
import React from "react";

/**
 * Modal — centered dialog with backdrop.
 */
export function Modal({ open = false, onClose, title = null, footer = null, size = "md", style = {}, children, ...props }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const maxW = { sm: 400, md: 520, lg: 680 }[size] || 520;
  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "color-mix(in srgb, var(--ink-950) 45%, transparent)",
        backdropFilter: "blur(2px)",
        animation: "pf-fade 0.18s var(--ease-out)",
      }}
    >
      <style>{"@keyframes pf-fade{from{opacity:0}to{opacity:1}}@keyframes pf-pop{from{opacity:0;transform:translateY(8px) scale(0.98)}to{opacity:1;transform:none}}"}</style>
      <div
        style={{
          width: "100%",
          maxWidth: maxW,
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--shadow-xl)",
          overflow: "hidden",
          animation: "pf-pop 0.2s var(--ease-out)",
          ...style,
        }}
        {...props}
      >
        {title && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 22px", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", color: "var(--text-primary)" }}>{title}</div>
            {onClose && (
              <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "inline-flex", padding: 4, margin: -4 }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        )}
        <div style={{ padding: "20px 22px", overflowY: "auto", fontSize: "var(--text-base)", color: "var(--text-secondary)", lineHeight: "var(--leading-normal)" }}>{children}</div>
        {footer && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 22px", borderTop: "1px solid var(--border-subtle)", background: "var(--surface-canvas)" }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

