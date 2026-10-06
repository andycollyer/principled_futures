"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { AppShell } from "@/components/AppShell";
import { SearchPalette } from "@/components/SearchPalette";
import * as UI from "@/components/icons";
import { shouldRedirectToMobile } from "@/lib/device";
import { useAuth } from "@/lib/auth";
import { useOrg } from "@/lib/org";
import { gateUrl } from "@/lib/next-url";

/* The only area an anonymous visitor may reach: the assessment, and only its
   first domain (the page itself stops them at question eight). Everything
   else — score, library, report, telemetry, settings — needs an account. */
const ANONYMOUS_OK = "/dashboard/assessment";

const NAV = [
  { id: "overview", label: "Overview", icon: <UI.IGrid size={17} />, path: "/dashboard" },
  { id: "assessment", label: "Assessment", icon: <UI.IList size={17} />, path: "/dashboard/assessment" },
  { id: "report", label: "Advisory Report", icon: <UI.IFile size={17} />, path: "/dashboard/report" },
  { id: "research", label: "Library", icon: <UI.IDoc size={17} />, path: "/dashboard/research" },
  { id: "settings", label: "Settings", icon: <UI.ICog size={17} />, path: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();

  // The dashboard chrome is desktop-first. On a phone-sized screen, hand off
  // to the mobile app — unless the visitor has opted into desktop this session.
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (shouldRedirectToMobile()) { router.replace("/mobile"); return; }
    setReady(true);
  }, [router]);

  // The gate. Note this guards the *interface*, not the data — the library's
  // prose is withheld by row-level security in the database, because in a
  // static export anything shipped to the browser is downloadable regardless
  // of what the screen shows.
  const { ready: authReady, configured, session } = useAuth();
  const gated = configured && authReady && !session && !pathname.startsWith(ANONYMOUS_OK);
  React.useEffect(() => {
    if (gated) router.replace(gateUrl("/signup/", pathname));
  }, [gated, pathname, router]);

  // First sign-in: ask who the client is before showing the product.
  const { ready: orgReady, details, complete } = useOrg();
  const needsDetails = configured && !!session && orgReady && !!details && !complete;
  React.useEffect(() => {
    if (needsDetails) router.replace("/onboarding");
  }, [needsDetails, router]);

  const current = pathname.startsWith("/dashboard/assessment")
    ? "assessment"
    : pathname.startsWith("/dashboard/research")
      ? "research"
      : pathname.startsWith("/dashboard/telemetry")
        ? "overview"
        : pathname.startsWith("/dashboard/report")
          ? "report"
          : pathname.startsWith("/dashboard/help")
            ? "help"
            : pathname.startsWith("/dashboard/settings")
              ? "settings"
              : "overview";

  const [searchOpen, setSearchOpen] = React.useState(false);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!ready) return null;
  if (gated || needsDetails) return null;   // redirecting — don't flash gated content
  if (configured && session && !orgReady) return null;

  return (
    <AppShell
      nav={NAV}
      current={current}
      plan={details?.plan ?? null}
      onNavigate={(id: string) => {
        const item = NAV.find((n) => n.id === id);
        if (item?.path) router.push(item.path);
      }}
      org={details?.orgName || "Principled Futures"}
      user={{ name: details?.fullName || session?.user?.email || "P" }}
      onSearch={() => setSearchOpen(true)}
      onHelp={() => router.push("/dashboard/help")}
    >
      {children}
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </AppShell>
  );
}
