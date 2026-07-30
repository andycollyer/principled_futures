// src/lib/next-url.ts
// Where to send someone after they sign in.
//
// The gate bounces people to /signup?next=/dashboard/report (say), and we
// return them there once they have an account, so the gate never costs anyone
// their place. Read from window.location rather than useSearchParams: in a
// static export the hook forces a client-side bailout and a Suspense boundary
// for no benefit here.

/** Only same-site paths are honoured — never an absolute URL from the query. */
export function safeNext(fallback = "/dashboard"): string {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = new URLSearchParams(window.location.search).get("next");
    if (!raw) return fallback;
    // Must be a site-relative path: rejects "//evil.com" and "https://evil.com".
    if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
    return raw;
  } catch {
    return fallback;
  }
}

/** Build a gate URL that remembers where the visitor was trying to go. */
export function gateUrl(base: "/login/" | "/signup/", intended: string): string {
  return `${base}?next=${encodeURIComponent(intended)}`;
}
