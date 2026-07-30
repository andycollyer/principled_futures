"use client";
import React from "react";
import * as DS from "./ds";
import * as UI from "./icons";
/* AppShell — the dashboard chrome: dark icon rail + light nav sidebar + topbar.
   Overhauled corporate green. Consumes the design-system bundle. */



function RailIcon({ children, active, onClick, label }) {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} title={label} aria-label={label}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: 9, border: "none", cursor: "pointer",
        background: active ? "rgba(255,255,255,0.14)" : h ? "rgba(255,255,255,0.08)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.6)", transition: "all .12s" }}>
      {children}
    </button>
  );
}

function AppShell({ nav, current, onNavigate, org, user, children, breadcrumb, onSearch, onHelp }) {
  const initial = (user?.name || org || "P").trim().charAt(0).toUpperCase();
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface-canvas)", fontFamily: "var(--font-sans)" }}>
      {/* Icon rail */}
      <div style={{ width: 56, flexShrink: 0, background: "var(--rail)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "12px 0" }}>
        <div style={{ marginBottom: 4 }}><UI.Logo size={34} /></div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <RailIcon label="Search" onClick={onSearch}><UI.ISearch size={19} /></RailIcon>
          <RailIcon label="Help" onClick={onHelp}><UI.IHelp size={19} /></RailIcon>
        </div>
        <span style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.12)", color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>{initial}</span>
      </div>

      {/* Nav sidebar */}
      <aside style={{ width: 224, flexShrink: 0, background: "var(--surface-card)", borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 18px", borderBottom: "1px solid var(--border-subtle)" }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.012em" }}>Principled Futures</span>
        </div>
        <nav style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map((item) => {
            const active = item.id === current;
            return (
              <NavRow key={item.id} item={item} active={active} onClick={() => !item.soon && onNavigate(item.id)} />
            );
          })}
        </nav>
        <div style={{ padding: 12, borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ background: "var(--surface-sunken)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--text-tertiary)" }}>Plan</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-900)", marginTop: 2 }}>Diagnostic · Trial</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{ position: "sticky", top: 0, zIndex: 30, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "var(--surface-card)", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ minWidth: 0 }}>
            {breadcrumb ? <DS.Breadcrumb items={breadcrumb} /> : <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-900)" }}>{org}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface-sunken)", borderRadius: 999, padding: "5px 12px", fontSize: 12, color: "var(--text-secondary)" }}><UI.IClock size={13} /> 14 days left in trial</span>
            <DS.Button variant="brand" size="sm">Upgrade</DS.Button>
            <button aria-label="Notifications" style={{ width: 34, height: 34, display: "grid", placeItems: "center", border: "1px solid var(--border-subtle)", borderRadius: 8, background: "var(--surface-card)", cursor: "pointer", color: "var(--text-secondary)" }}><UI.IBell size={17} /></button>
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--ink-900)", color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>{initial}</span>
          </div>
        </header>
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}

function NavRow({ item, active, onClick }) {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: "relative", display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", cursor: item.soon ? "default" : "pointer",
        fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500, textAlign: "left",
        background: active ? "var(--green-100)" : h && !item.soon ? "var(--surface-sunken)" : "transparent",
        color: item.soon ? "var(--text-tertiary)" : active ? "var(--green-700)" : "var(--text-secondary)", transition: "color var(--duration-fast) var(--ease-out)" }}>
      {active && <span style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, borderRadius: "0 3px 3px 0", background: "var(--green-600)" }} />}
      <span style={{ display: "inline-flex", color: active ? "var(--green-600)" : "inherit" }}>{item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.soon && <span style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--text-tertiary)", background: "var(--surface-sunken)", padding: "2px 6px", borderRadius: 4 }}>Soon</span>}
    </button>
  );
}




export { AppShell };
