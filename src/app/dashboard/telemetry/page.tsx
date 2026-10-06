"use client";

/* Telemetry was folded into the Overview on 6 Oct 2026 (ownership section).
   This address is kept so existing links and bookmarks still land somewhere useful. */

import React from "react";
import { useRouter } from "next/navigation";

export default function TelemetryRedirect() {
  const router = useRouter();
  React.useEffect(() => { router.replace("/dashboard/#owners"); }, [router]);
  return null;
}
