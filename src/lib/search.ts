// src/lib/search.ts
// Client-side search across the whole knowledge layer: briefings, criteria,
// glossary, guides, board papers and app pages. Zero dependencies — the
// index builds in memory from the content modules at first use. Upgrades to
// server-side full-text (and "Ask the library") in the Supabase phase.
"use client";

import { ARTICLE_META as ARTICLES, GLOSSARY_META as GLOSSARY, GUIDE_META as GUIDES } from "./content-meta";
import { framework } from "./framework";
import { PAPERS, FEATURED } from "./research";

export interface SearchHit {
  type: "Page" | "Briefing" | "Criterion" | "Glossary" | "Guide" | "Board paper";
  title: string;
  sub: string;
  href: string;
}

interface IndexEntry extends SearchHit {
  text: string;
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

let INDEX: IndexEntry[] | null = null;

function buildIndex(): IndexEntry[] {
  const entries: IndexEntry[] = [];

  // App pages — quick navigation.
  const pages: [string, string, string][] = [
    ["Overview", "Governance overview", "/dashboard/"],
    ["Assessment", "The 8×8 assessment — 64 criteria", "/dashboard/assessment/"],
    ["Advisory Report", "Board-ready report", "/dashboard/report/"],
    ["Telemetry", "Continuous oversight", "/dashboard/telemetry/"],
    ["Library", "Briefings, board papers and glossary", "/dashboard/research/"],
    ["Glossary", "Terms defined in plain English", "/dashboard/research/glossary/"],
    ["Help", "How the product works", "/dashboard/help/"],
  ];
  for (const [title, sub, href] of pages) {
    entries.push({ type: "Page", title, sub, href, text: `${title} ${sub}` });
  }

  for (const a of ARTICLES) {
    entries.push({
      type: "Briefing",
      title: a.title,
      sub: `Criterion ${a.id} · ${a.category} · ${a.read} read`,
      href: `/dashboard/research/${a.id}/`,
      text: `${a.title} ${a.extract}`.toLowerCase(),
    });
  }

  for (const d of framework) {
    for (const c of d.criteria) {
      entries.push({
        type: "Criterion",
        title: `${c.id} ${c.title}`,
        sub: `Assessment · ${d.name}`,
        href: "/dashboard/assessment/",
        text: `${c.question} ${c.leading} ${c.levels.join(" ")}`.toLowerCase(),
      });
    }
  }

  for (const g of GLOSSARY) {
    entries.push({
      type: "Glossary",
      title: g.term,
      sub: g.source ? `Glossary · ${g.source}` : "Glossary",
      href: `/dashboard/research/glossary/#${slugify(g.term)}`,
      text: g.term.toLowerCase(),
    });
  }

  for (const g of GUIDES) {
    entries.push({
      type: "Guide",
      title: g.title,
      sub: "Help · product guide",
      href: `/dashboard/help/#${g.id}`,
      text: g.title.toLowerCase(),
    });
  }

  for (const p of [{ ...FEATURED, tone: "brand" as const }, ...PAPERS]) {
    entries.push({
      type: "Board paper",
      title: p.title,
      sub: `Board paper · ${p.cat} · PDF`,
      href: `/research/${p.file}`,
      text: (p as { desc?: string }).desc?.toLowerCase() ?? "",
    });
  }

  return entries;
}

/** Ranked search: every query token must match somewhere; titles outrank body text. */
export function search(query: string, limit = 12): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  if (!INDEX) INDEX = buildIndex();
  const tokens = q.split(/\s+/).filter(Boolean);

  const scored: { hit: IndexEntry; score: number }[] = [];
  for (const e of INDEX) {
    const title = e.title.toLowerCase();
    const sub = e.sub.toLowerCase();
    let score = 0;
    let allMatch = true;
    if (title.includes(q)) score += 50;
    if (title.startsWith(q)) score += 20;
    for (const t of tokens) {
      let tokenScore = 0;
      if (title.includes(t)) tokenScore += 14;
      if (sub.includes(t)) tokenScore += 5;
      if (e.text.includes(t)) tokenScore += 2;
      if (tokenScore === 0) { allMatch = false; break; }
      score += tokenScore;
    }
    if (allMatch && score > 0) scored.push({ hit: e, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.hit);
}
