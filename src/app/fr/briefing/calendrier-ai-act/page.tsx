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
  title: "Les échéances de l’AI Act ont été reportées. Pas vos obligations. | Principled Futures",
  description: "Une note de gouvernance à l’attention des dirigeants de PME européennes.",
  alternates: ALT,
};

export default function Page() {
  return <BriefingPage b={BRIEFING_BY_LANG.fr} />;
}
