"use client";
import React from "react";

/**
 * Dropdown — click-to-open menu anchored to a trigger.
 */
export function Dropdown({ trigger, items = [], align = "left", style = {}, ...props }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex", ...style }} {...props}>
      <span onClick={() => setOpen((v) => !v)} style={{ display: "inline-flex", cursor: "pointer" }}>{trigger}</span>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            [align]: 0,
            minWidth: 200,
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            padding: 6,
            zIndex: 80,
            animation: "pf-menu 0.14s var(--ease-out)",
          }}
        >
          <style>{"@keyframes pf-menu{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}"}</style>
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} style={{ height: 1, background: "var(--border-subtle)", margin: "5px 0" }} />
            ) : item.header ? (
              <div key={i} style={{ padding: "6px 10px 4px", fontSize: "var(--text-2xs)", fontWeight: "var(--weight-semibold)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-tertiary)" }}>{item.header}</div>
            ) : (
              <button
                key={i}
                role="menuitem"
                onClick={() => { setOpen(false); item.onClick && item.onClick(); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "8px 10px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--weight-medium)",
                  color: item.danger ? "var(--status-danger)" : "var(--text-primary)",
                  background: "transparent",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-sunken)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {item.icon && <span style={{ display: "inline-flex", width: 16, height: 16, color: item.danger ? "var(--status-danger)" : "var(--text-tertiary)" }}>{item.icon}</span>}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </span>
  );
}

