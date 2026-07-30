// scripts/check-bundle.mjs
// Fails the build if library prose has leaked back into the shipped output.
//
// The protection in 0004_content_tables.sql only holds while nothing in the
// app imports src/lib/{articles,glossary,guides}.ts. One stray import would
// silently re-publish 20,000 words of briefings to anyone who opens the
// network tab — and nothing would look wrong on screen.
//
// So we check the artefact rather than trusting the intent: take real
// sentences from the source content, search everything in out/, and refuse to
// ship if any of them are found. Runs automatically as part of `npm run build`.

import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");

/** A handful of distinctive phrases drawn from the content we must not ship. */
async function canaries() {
  const out = [];
  const articles = await readFile(path.join(root, "src/lib/articles.ts"), "utf8");
  // Sentences from briefing bodies: long, distinctive, and quoted in the source.
  const bodyLines = articles.match(/^      "[^"]{80,200}",$/gm) ?? [];
  for (const line of bodyLines.slice(0, 40)) {
    const text = line.trim().replace(/^"/, "").replace(/",$/, "");
    // Take an interior slice so we're matching prose, not a common opener.
    out.push({ source: "articles.ts", phrase: text.slice(20, 70) });
  }
  const glossary = await readFile(path.join(root, "src/lib/glossary.ts"), "utf8");
  const defs = glossary.match(/def: "[^"]{80,200}"/g) ?? [];
  for (const d of defs.slice(0, 20)) {
    out.push({ source: "glossary.ts", phrase: d.replace(/^def: "/, "").slice(20, 70) });
  }
  return out.filter((c) => c.phrase.length > 30);
}

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

try {
  await stat(outDir);
} catch {
  console.log("check-bundle: no out/ directory — skipping (nothing built).");
  process.exit(0);
}

const probes = await canaries();
if (!probes.length) {
  console.error("check-bundle: could not derive any probe phrases — refusing to pass vacuously.");
  process.exit(1);
}

const files = (await walk(outDir)).filter((f) => /\.(js|html|json|txt|map)$/i.test(f));
const leaks = [];

for (const file of files) {
  let text;
  try { text = await readFile(file, "utf8"); } catch { continue; }
  for (const probe of probes) {
    if (text.includes(probe.phrase)) {
      leaks.push({ file: path.relative(root, file), ...probe });
      break; // one hit per file is enough to condemn it
    }
  }
}

if (leaks.length) {
  console.error("\n✗ check-bundle FAILED — library prose is in the shipped output:\n");
  for (const l of leaks.slice(0, 10)) {
    console.error(`  ${l.file}`);
    console.error(`    contains ${l.source} text: "${l.phrase.trim()}…"`);
  }
  if (leaks.length > 10) console.error(`  …and ${leaks.length - 10} more files`);
  console.error(`\n  Something is importing src/lib/articles.ts, glossary.ts or guides.ts.`);
  console.error(`  App code must import src/lib/content-meta.ts (metadata) and fetch`);
  console.error(`  bodies through src/lib/content.ts instead.\n`);
  process.exit(1);
}

console.log(`✓ check-bundle: ${probes.length} probes, ${files.length} files — no library prose in the bundle.`);
