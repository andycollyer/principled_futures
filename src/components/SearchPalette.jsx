"use client";
import React from "react";
import { search } from "@/lib/search";
import * as UI from "./icons";

/* SearchPalette — the ⌘K command palette: one search across briefings,
   criteria, glossary, guides, board papers and pages. Keyboard-first,
   borderless input, icon tiles, match highlighting. */

const TYPE_ICON = {
  Page: UI.IGrid,
  Briefing: UI.IDoc,
  Criterion: UI.IList,
  Glossary: UI.ISparkle,
  Guide: UI.IHelp,
  "Board paper": UI.IFile,
};

const QUICK_LINKS = [
  { icon: UI.IList, title: "Assessment", sub: "64 criteria · 8 domains", href: "/dashboard/assessment/" },
  { icon: UI.IPulse, title: "Telemetry", sub: "Continuous oversight", href: "/dashboard/telemetry/" },
  { icon: UI.IFile, title: "Advisory Report", sub: "Board-ready draft", href: "/dashboard/report/" },
  { icon: UI.ISparkle, title: "Glossary", sub: "86 terms, plain English", href: "/dashboard/research/glossary/" },
];

const SUGGESTIONS = ["kill switch", "DPIA", "shadow AI", "Provision 29", "watermarking"];

/** Bold the first match of the query inside the title. */
function Highlight({ text, query }) {
  const q = query.trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ color: "var(--green-700)", fontWeight: 650 }}>{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  );
}

export function SearchPalette({ open, onClose }) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [entered, setEntered] = React.useState(false);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);
  const hits = React.useMemo(() => search(query), [query]);
  const showQuick = query.trim().length < 2;

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setEntered(false);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) setEntered(true);
      else requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  React.useEffect(() => { setActive(0); }, [query]);

  React.useEffect(() => {
    const el = listRef.current?.querySelector("[data-active='true']");
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = React.useCallback((href) => {
    if (!href) return;
    onClose();
    if (href.endsWith(".pdf")) window.open(href, "_blank", "noopener");
    else window.location.href = href;
  }, [onClose]);

  const rows = showQuick ? QUICK_LINKS.map((l) => ({ ...l, type: "Page" })) : hits;

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(rows.length - 1, a + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
      else if (e.key === "Enter") { e.preventDefault(); go(rows[active]?.href); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, rows, active, go, onClose]);

  if (!open) return null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(17,27,22,0.44)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "11vh", opacity: entered ? 1 : 0, transition: "opacity 160ms cubic-bezier(0.16,1,0.3,1)" }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search"
        style={{ width: "calc(100% - 40px)", maxWidth: 620, background: "var(--surface-card)", borderRadius: 16, border: "1px solid var(--border-subtle)",
          boxShadow: "0 24px 64px -16px rgba(20,36,29,0.35), 0 4px 16px -4px rgba(20,36,29,0.15)",
          overflow: "hidden",
          transform: entered ? "none" : "translateY(-8px) scale(0.985)", opacity: entered ? 1 : 0,
          transition: "transform 180ms cubic-bezier(0.16,1,0.3,1), opacity 180ms cubic-bezier(0.16,1,0.3,1)" }}>

        {/* Input row — borderless, seamless */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "17px 20px 15px" }}>
          <UI.ISearch size={19} color="var(--green-600)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search briefings, criteria, glossary, guides…"
            style={{ flex: 1, border: "none", outline: "none", boxShadow: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 16.5, fontWeight: 450, color: "var(--ink-900)", padding: 0, caretColor: "var(--green-600)" }}
          />
          <button onClick={onClose} className="pf-tnum" style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 600, letterSpacing: ".03em", color: "var(--text-tertiary)", border: "1px solid var(--border-subtle)", background: "var(--surface-sunken)", borderRadius: 6, padding: "3px 7px", cursor: "pointer", fontFamily: "var(--font-sans)" }}>ESC</button>
        </div>
        <div style={{ height: 1, background: "var(--border-subtle)" }} />

        {/* Results / quick links */}
        <div ref={listRef} style={{ maxHeight: 400, overflowY: "auto", padding: "8px 8px 10px" }}>
          {showQuick && (
            <div style={{ padding: "8px 12px 6px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-tertiary)" }}>Quick links</div>
          )}
          {!showQuick && rows.length === 0 && (
            <div style={{ padding: "26px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-900)" }}>Nothing matches &ldquo;{query}&rdquo;</div>
              <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 4 }}>Try a regulation, a term, or a criterion number.</div>
            </div>
          )}
          {rows.map((r, i) => {
            const Icon = r.icon || TYPE_ICON[r.type] || UI.IDoc;
            const on = i === active;
            return (
              <button key={`${r.type}-${r.title}`} data-active={on ? "true" : "false"} onClick={() => go(r.href)} onMouseEnter={() => setActive(i)}
                style={{ position: "relative", display: "flex", alignItems: "center", gap: 13, width: "100%", textAlign: "left", padding: "10px 12px", border: "none", cursor: "pointer", borderRadius: 10, fontFamily: "var(--font-sans)",
                  background: on ? "var(--green-100)" : "transparent", transition: "background 100ms" }}>
                <span style={{ flexShrink: 0, display: "inline-flex", width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center",
                  background: on ? "var(--green-600)" : "var(--surface-sunken)", color: on ? "#fff" : "var(--text-tertiary)", transition: "background 100ms, color 100ms" }}>
                  <Icon size={16} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--ink-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <Highlight text={r.title} query={showQuick ? "" : query} />
                  </span>
                  <span style={{ display: "block", fontSize: 12, color: "var(--text-tertiary)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.sub}</span>
                </span>
                <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", color: on ? "var(--green-700)" : "var(--ink-400)" }}>{r.type}</span>
              </button>
            );
          })}
          {showQuick && (
            <>
              <div style={{ padding: "12px 12px 6px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-tertiary)" }}>Try searching</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "0 12px 8px" }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => setQuery(s)}
                    style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-secondary)", background: "var(--surface-sunken)", border: "1px solid transparent", borderRadius: 999, padding: "5px 12px", cursor: "pointer", fontFamily: "var(--font-sans)" }}>{s}</button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer hints */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 18px", borderTop: "1px solid var(--border-subtle)", background: "var(--surface-sunken)" }}>
          {[["↑↓", "navigate"], ["↵", "open"], ["esc", "close"]].map(([k, l]) => (
            <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--text-tertiary)" }}>
              <span className="pf-tnum" style={{ fontSize: 10.5, fontWeight: 600, border: "1px solid var(--border-subtle)", borderRadius: 4, padding: "1px 5px", background: "var(--surface-card)" }}>{k}</span> {l}
            </span>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-400)" }}>Search everything with <span className="pf-tnum" style={{ fontWeight: 600 }}>⌘K</span></span>
        </div>
      </div>
    </div>
  );
}
