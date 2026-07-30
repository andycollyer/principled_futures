"use client";
import React from "react";

const TONES = {
  neutral: { bg: "var(--ink-100)", border: "var(--ink-200)", icon: "var(--ink-500)", title: "var(--ink-800)" },
  brand:   { bg: "var(--green-100)", border: "var(--green-200)", icon: "var(--green-600)", title: "var(--green-800)" },
  success: { bg: "var(--status-success-bg)", border: "var(--success-500)", icon: "var(--status-success)", title: "var(--success-700)" },
  warning: { bg: "var(--status-warning-bg)", border: "var(--warning-500)", icon: "var(--status-warning)", title: "var(--warning-700)" },
  danger:  { bg: "var(--status-danger-bg)", border: "var(--danger-500)", icon: "var(--status-danger)", title: "var(--danger-700)" },
  info:    { bg: "var(--status-info-bg)", border: "var(--info-500)", icon: "var(--status-info)", title: "var(--info-700)" },
};

const ICONS = {
  success: "M9 12l2 2 4-4M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  warning: "M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0z",
  danger: "M12 9v4m0 4h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  info: "M12 16v-4m0-4h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  brand: "M12 16v-4m0-4h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  neutral: "M12 16v-4m0-4h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
};

/**
 * Alert — inline contextual message.
 */
export function Alert({ tone = "info", title = null, onDismiss = null, icon = true, style = {}, children, ...props }) {
  const t = TONES[tone] || TONES.info;
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: "var(--radius-lg)",
        ...style,
      }}
      {...props}
    >
      {icon && (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={t.icon} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d={ICONS[tone]} />
        </svg>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-semibold)", color: t.title }}>{title}</div>}
        {children && <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: title ? 2 : 0, lineHeight: "var(--leading-normal)" }}>{children}</div>}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss" style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: 0, display: "inline-flex" }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}

