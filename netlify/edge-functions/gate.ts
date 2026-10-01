// netlify/edge-functions/gate.ts
// The privacy gate. Off by default; set SITE_PRIVATE=1 in Netlify to switch on.
//
// The app is a static export, so there is no server to guard it — this edge
// function is the only thing between a visitor and the product. When private:
//
//   "/"                      serves the holding page (rewritten to /welcome/)
//   /welcome /privacy /terms /gdpr /team     public
//   static assets            public (they carry no product content)
//   everything else          needs the team cookie, or you land on /team/
//
// The cookie stores a hash of the passcode, never the passcode, so changing
// TEAM_PASSCODE signs everyone out. Unlocking happens on /team/?key=… and the
// key is dropped immediately: we set the cookie and redirect to a clean path,
// because a key left in a URL ends up in history, logs and shared links.

import type { Context } from "https://edge.netlify.com";

const COOKIE = "pf_team";

/** Paths a visitor may reach without the team cookie. */
const PUBLIC_EXACT = new Set([
  "/", "/welcome", "/welcome/",
  "/privacy", "/privacy/",
  "/terms", "/terms/",
  "/gdpr", "/gdpr/",
  "/team", "/team/",
]);

/** Prefixes that carry no product content — styles, scripts, icons, crawler files. */
const PUBLIC_PREFIXES = [
  "/_next/", "/icon.svg", "/favicon", "/robots.txt", "/sitemap", "/__forms.html",
];

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time compare, so a wrong guess leaks nothing through timing. */
function sameHash(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export default async function gate(request: Request, context: Context) {
  if (Deno.env.get("SITE_PRIVATE") !== "1") return; // open site — do nothing

  const url = new URL(request.url);
  const path = url.pathname;

  if (PUBLIC_PREFIXES.some((p) => path.startsWith(p))) return;

  const passcode = Deno.env.get("TEAM_PASSCODE") ?? "";
  const expected = passcode ? await sha256(passcode) : "";

  // Unlock: /team/?key=…  → set the cookie, then bounce to a clean URL.
  if ((path === "/team" || path === "/team/") && url.searchParams.has("key")) {
    const offered = url.searchParams.get("key") ?? "";
    if (expected && sameHash(await sha256(offered), expected)) {
      const home = new URL("/dashboard/", url.origin);
      return new Response(null, {
        status: 302,
        headers: {
          Location: home.toString(),
          "Set-Cookie": `${COOKIE}=${expected}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }
    // Wrong key: back to the passcode page without it, so it never sticks.
    return new Response(null, { status: 302, headers: { Location: "/team/?bad=1" } });
  }

  // The front door shows the holding page while the site is private.
  if (path === "/") return context.rewrite(new URL("/welcome/", url.origin));

  if (PUBLIC_EXACT.has(path)) return;

  const cookies = request.headers.get("cookie") ?? "";
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([a-f0-9]{64})`));
  if (expected && match && sameHash(match[1], expected)) return;

  return new Response(null, { status: 302, headers: { Location: "/team/" } });
}

export const config = { path: "/*" };
