"use client";
import React from "react";
import * as DS from "./ds";
import * as UI from "./icons";
/* AppShell — the dashboard chrome: one white sidebar and a top bar, both flat with
   one-pixel rules, matching the landing page. Search and help sit in the top bar. */

function TopIcon({ children, onClick, label }) {
  return (
    <button onClick={onClick} title={label} aria-label={label}
      style={{ width: 34, height: 34, display: "grid", placeItems: "center", border: "1px solid var(--border-default)", borderRadius: 8, background: "var(--surface-card)", cursor: "pointer", color: "var(--text-secondary)" }}>
      {children}
    </button>
  );
}

function AppShell({ nav, current, onNavigate, org, user, children, breadcrumb, onSearch, onHelp }) {
  const initial = (user?.name || org || "P").trim().charAt(0).toUpperCase();
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff", fontFamily: "var(--font-sans)" }}>
      {/* Nav sidebar */}
      <aside style={{ width: 232, flexShrink: 0, background: "var(--surface-card)", borderRight: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderBottom: "1px solid var(--border-subtle)" }}>
          <UI.Logo size={26} />
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
          <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11.5, color: "var(--text-tertiary)" }}>Plan</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-900)", marginTop: 2 }}>Diagnostic · Trial</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{ position: "sticky", top: 0, zIndex: 30, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "var(--surface-card)", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ minWidth: 0 }}>
            {breadcrumb ? <DS.Breadcrumb items={breadcrumb} /> : <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-900)" }}>{org}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-secondary)", marginRight: 2 }}><UI.IClock size={13} /> 14 days left in trial</span>
            <DS.Button variant="brand" size="sm">Upgrade</DS.Button>
            <TopIcon label="Search" onClick={onSearch}><UI.ISearch size={17} /></TopIcon>
            <TopIcon label="Help" onClick={onHelp}><UI.IHelp size={17} /></TopIcon>
            <TopIcon label="Notifications"><UI.IBell size={17} /></TopIcon>
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--green-100)", color: "var(--green-700)", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>{initial}</span>
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
      {item.soon && <span style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text-tertiary)", background: "var(--surface-sunken)", padding: "2px 6px", borderRadius: 4 }}>Soon</span>}
    </button>
  );
}




export { AppShell };
