"use client";
import React from "react";

/**
 * FormField — label + control wrapper with help / error text.
 */
export function FormField({ label, htmlFor, required = false, hint = null, error = null, style = {}, children, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }} {...props}>
      {label && (
        <label htmlFor={htmlFor} style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--text-primary)" }}>
          {label}
          {required && <span style={{ color: "var(--status-danger)", marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span style={{ fontSize: "var(--text-sm)", color: "var(--status-danger)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{hint}</span>
      ) : null}
    </div>
  );
}

