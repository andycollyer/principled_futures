/* Criterion briefing — static shell only.

   The page is prerendered for every criterion id so the routes exist in the
   static export, but it carries no prose: the body is fetched per-reader by
   BriefingReader and withheld by row-level security from anyone not entitled
   to it. This file must never import src/lib/articles.ts — doing so would put
   all 64 briefings back into the public bundle (scripts/check-bundle.mjs
   fails the build if it happens). */

import { ARTICLE_META } from "@/lib/content-meta";
import { BriefingReader } from "@/components/BriefingReader";

export function generateStaticParams() {
  return ARTICLE_META.map((a) => ({ id: a.id }));
}

export default async function BriefingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BriefingReader id={id} />;
}
