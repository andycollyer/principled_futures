"use client";

/* Create an account. Same one-step flow as sign-in (enter an email and a
   password and you're in), with copy written for someone arriving new — and
   it honours ?next= so the gate never costs anyone their place. */

import React from "react";
import { useRouter } from "next/navigation";
import { Login } from "@/components/Login";
import { shouldRedirectToMobile } from "@/lib/device";
import { safeNext } from "@/lib/next-url";

export default function SignupPage() {
  const router = useRouter();

  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (shouldRedirectToMobile()) { router.replace("/mobile/login"); return; }
    setReady(true);
  }, [router]);
  if (!ready) return null;

  return (
    <Login
      mode="signup"
      onAuth={() => {
        try { window.sessionStorage.removeItem("pf-telemetry-animated"); } catch {}
        router.push(safeNext("/dashboard"));
      }}
      onDemo={() => router.push("/dashboard/assessment")}
      onBack={() => router.push("/")}
    />
  );
}
