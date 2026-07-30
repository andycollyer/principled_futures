// supabase/functions/issue-paper/index.ts
// Issues a board paper to an entitled reader, stamped with who they are.
//
// The PDFs used to sit at public URLs under /research/ — 2.4MB of branded
// research downloadable by anyone who guessed a filename, with no account and
// no trace. Now they live in a private Storage bucket and are only ever handed
// out by this function, which:
//
//   1. verifies the caller's session (no session, no paper);
//   2. checks their plan — free accounts get the featured paper, paid plans
//      get the full set;
//   3. stamps every page with the reader's email, organisation and the date;
//   4. returns the bytes directly, so the storage object is never exposed.
//
// The stamp is the point: a leaked PDF names the account it was issued to.
//
// Deploy (JWT verification stays ON — we want the caller's identity):
//   supabase functions deploy issue-paper

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const BUCKET = "research";

// What a free (diagnostic) account may take. Everything else needs a paid plan.
const FREE_PAPERS = new Set(["global-frameworks.pdf"]);

const PAID = new Set(["governance", "governance_plus"]);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Sign in to download this paper." }), {
      status: 401, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // A client bound to the caller's token: auth.getUser() and any RLS read below
  // are evaluated as them, not as us.
  const asCaller = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: userData, error: userErr } = await asCaller.auth.getUser();
  if (userErr || !userData.user) {
    return new Response(JSON.stringify({ error: "Your session has expired. Please sign in again." }), {
      status: 401, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  const user = userData.user;

  let file = "";
  try {
    const body = await req.json();
    file = String(body.file ?? "");
  } catch {
    return new Response(JSON.stringify({ error: "Bad request." }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Filename discipline: a plain PDF name, nothing that walks the bucket.
  if (!/^[a-z0-9][a-z0-9-]*\.pdf$/.test(file)) {
    return new Response(JSON.stringify({ error: "Unknown paper." }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // The caller's plan and organisation name, read through their own session.
  const { data: profile } = await asCaller
    .from("profiles")
    .select("organisation_id, organisations(name, plan)")
    .eq("id", user.id)
    .maybeSingle();

  const org = (profile?.organisations ?? {}) as { name?: string; plan?: string };
  const plan = org.plan ?? "diagnostic";

  if (!PAID.has(plan) && !FREE_PAPERS.has(file)) {
    return new Response(JSON.stringify({ error: "This paper is included with Governance.", upgrade: true }), {
      status: 403, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Service role only to read the private bucket — never to bypass the checks
  // above, which have already been made as the caller.
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: blob, error: dlErr } = await admin.storage.from(BUCKET).download(file);
  if (dlErr || !blob) {
    return new Response(JSON.stringify({ error: "That paper could not be found." }), {
      status: 404, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Stamp every page.
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let out: Uint8Array;
  try {
    const pdf = await PDFDocument.load(bytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const issued = new Date().toISOString().slice(0, 10);
    const who = org.name ? `${user.email} · ${org.name}` : String(user.email);
    const line = `Issued to ${who} on ${issued} · Licensed to one organisation · Not for redistribution`;

    for (const page of pdf.getPages()) {
      const { width } = page.getSize();
      const size = 6.5;
      const w = font.widthOfTextAtSize(line, size);
      page.drawText(line, {
        x: Math.max(18, (width - w) / 2),
        y: 14,
        size,
        font,
        color: rgb(0.45, 0.47, 0.45),
      });
    }
    out = await pdf.save();
  } catch {
    out = bytes; // never withhold a paid paper because the stamp failed
  }

  return new Response(out, {
    status: 200,
    headers: {
      ...cors,
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${file}"`,
      "Cache-Control": "private, no-store",
    },
  });
});
