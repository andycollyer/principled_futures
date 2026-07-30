"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Login } from "@/components/Login";
import { shouldRedirectToMobile } from "@/lib/device";
import { safeNext } from "@/lib/next-url";

export default function LoginPage() {
  const router = useRouter();

  // On a phone-sized screen, send sign-in to the mobile front door — unless
  // the visitor has opted into the desktop version this session.
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (shouldRedirectToMobile()) { router.replace("/mobile/login"); return; }
    setReady(true);
  }, [router]);
  if (!ready) return null;

  return (
    <Login
      onAuth={() => {
        // New sign-in: telemetry entrance animations play once per session.
        try { window.sessionStorage.removeItem("pf-telemetry-animated"); } catch {}
        router.push(safeNext("/dashboard"));
      }}
      onDemo={() => router.push("/dashboard/assessment")}
      onBack={() => router.push("/")}
    />
  );
}
