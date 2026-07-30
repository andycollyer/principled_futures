import type { Metadata } from "next";
import { BriefingPage } from "@/components/BriefingPage";
import { BRIEFING_BY_LANG } from "@/lib/briefing-content";

const ALT = {
  languages: {
    "en": "/briefing/ai-act-timeline/",
    "fr": "/fr/briefing/calendrier-ai-act/",
    "de": "/de/briefing/ki-verordnung-zeitplan/",
    "x-default": "/briefing/ai-act-timeline/",
  },
};

export const metadata: Metadata = {
  title: "Die Fristen der KI-Verordnung wurden verschoben. Ihre Pflichten nicht. | Principled Futures",
  description: "Ein Governance-Briefing für Führungskräfte europäischer KMU.",
  alternates: ALT,
};

export default function Page() {
  return <BriefingPage b={BRIEFING_BY_LANG.de} />;
}
