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
  title: "The AI Act deadlines have been delayed. Your obligations have not. | Principled Futures",
  description: "A governance briefing for the leaders of European SMEs — what the AI Act requires now, not just in 2027.",
  alternates: ALT,
};

export default function Page() {
  return <BriefingPage b={BRIEFING_BY_LANG.en} />;
}
