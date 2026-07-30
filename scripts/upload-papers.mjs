// scripts/upload-papers.mjs
// Uploads the board papers from assets/research/ into the private Storage
// bucket, so the app can issue them without them ever being public.
//
// The service key is read from the environment and never stored in the repo:
//
//   export SUPABASE_SERVICE_KEY='...'      # from Supabase → Settings → API
//   node scripts/upload-papers.mjs
//
// Re-running is safe: existing objects are replaced (upsert).

import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "assets/research");
const BUCKET = "research";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://iizrsxtptbfpgthbgkba.supabase.co";

/**
 * Ask for the service key without echoing it and without it touching the
 * environment, a file, or shell history. It exists only in memory for the
 * length of this upload.
 */
function askForKey() {
  return new Promise((resolve, reject) => {
    process.stdout.write(
      "\nThis needs your Supabase service key (a master password for your database).\n" +
      "Get it from: Supabase → your project → Settings → API → service_role → Copy\n\n" +
      "Paste it here and press Enter (it stays hidden and is not saved): ",
    );
    const stdin = process.stdin;
    if (!stdin.isTTY) { reject(new Error("no terminal available")); return; }
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let buf = "";
    const onData = (ch) => {
      if (ch === "\r" || ch === "\n") {
        stdin.setRawMode(false); stdin.pause(); stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(buf.trim());
      } else if (ch === "") {              // Ctrl-C
        stdin.setRawMode(false); process.stdout.write("\n"); process.exit(130);
      } else if (ch === "" || ch === "\b") { // backspace
        buf = buf.slice(0, -1);
      } else {
        buf += ch;
      }
    };
    stdin.on("data", onData);
  });
}

let key = process.env.SUPABASE_SERVICE_KEY;
if (!key) {
  try { key = await askForKey(); }
  catch { console.error("\nCouldn't prompt for the key. Run this in a terminal window."); process.exit(1); }
}
if (!key) { console.error("\nNo key entered — nothing uploaded."); process.exit(1); }
if (!/^(sb_secret_|eyJ|sbp_)/.test(key)) {
  console.error("\nThat doesn't look like a service key. It should start with \"sb_secret_\" or \"eyJ\".");
  console.error("Check you copied the service_role key, not the publishable/anon one.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

let files;
try {
  files = (await readdir(dir)).filter((f) => f.toLowerCase().endsWith(".pdf"));
} catch {
  console.error(`No such directory: ${path.relative(root, dir)}`);
  process.exit(1);
}

if (!files.length) {
  console.error(`No PDFs found in ${path.relative(root, dir)}`);
  process.exit(1);
}

console.log(`Uploading ${files.length} papers to the private "${BUCKET}" bucket…\n`);
let ok = 0;
for (const file of files) {
  const bytes = await readFile(path.join(dir, file));
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(file, bytes, { contentType: "application/pdf", upsert: true });
  if (error) console.error(`  ✗ ${file} — ${error.message}`);
  else { console.log(`  ✓ ${file} (${Math.round(bytes.length / 1024)}KB)`); ok++; }
}

console.log(`\n${ok}/${files.length} uploaded.`);
if (ok < files.length) {
  console.error("Some uploads failed. If the bucket does not exist, apply supabase/migrations/0007_research_storage.sql first.");
  process.exit(1);
}
