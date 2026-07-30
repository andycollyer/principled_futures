"use client";
import React from "react";

/**
 * Stepper — horizontal progress through a multi-step flow.
 */
export function Stepper({ steps = [], current = 0, style = {}, ...props }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", ...style }} {...props}>
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        const circleBg = state === "done" ? "var(--brand)" : state === "active" ? "var(--brand)" : "var(--surface-card)";
        const circleBorder = state === "todo" ? "var(--border-default)" : "var(--brand)";
        const circleColor = state === "todo" ? "var(--text-tertiary)" : "var(--white)";
        const last = i === steps.length - 1;
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: "0 0 auto", width: 120 }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: circleBg, border: `1.5px solid ${circleBorder}`, color: circleColor, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", flexShrink: 0 }}>
                {state === "done" ? (
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                ) : i + 1}
              </span>
              <span style={{ marginTop: 8, fontSize: "var(--text-sm)", fontWeight: state === "active" ? "var(--weight-semibold)" : "var(--weight-medium)", color: state === "todo" ? "var(--text-tertiary)" : "var(--text-primary)" }}>{step.label}</span>
              {step.description && <span style={{ marginTop: 2, fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>{step.description}</span>}
            </div>
            {!last && (
              <span style={{ flex: 1, height: 2, background: i < current ? "var(--brand)" : "var(--border-subtle)", marginTop: 14, minWidth: 24 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

