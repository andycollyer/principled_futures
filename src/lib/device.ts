// src/lib/device.ts
// Device-class helpers for the mobile/desktop split. The app is a static
// export (no server, no middleware), so the split is decided client-side by
// viewport width — a narrow desktop window counts as "mobile" too, which is
// the behaviour we want. A per-session "prefer desktop" flag lets a phone user
// opt out of the redirect without getting bounced straight back (no loops).
"use client";

const PREFER_DESKTOP = "pf-prefer-desktop";

/** True on phone-sized viewports (portrait phones, narrow windows). */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

/** Has the visitor asked to stay on the desktop version this session? */
export function prefersDesktop(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(PREFER_DESKTOP) === "1";
  } catch {
    return false;
  }
}

/** Record (or clear) the desktop preference for this session. */
export function setPreferDesktop(v: boolean): void {
  try {
    if (v) window.sessionStorage.setItem(PREFER_DESKTOP, "1");
    else window.sessionStorage.removeItem(PREFER_DESKTOP);
  } catch {
    /* storage unavailable — fall back to no preference */
  }
}

/** Should a small-screen visitor be sent to the mobile route right now? */
export function shouldRedirectToMobile(): boolean {
  return isMobileViewport() && !prefersDesktop();
}
