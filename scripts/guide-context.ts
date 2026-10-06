/* Writes supabase/functions/guide/context.json: the framework wording and the approved
   links the guide may draw on. Run after the framework or links change, then redeploy
   the function.   npx tsx scripts/guide-context.ts */
import { writeFileSync } from "node:fs";
import { framework } from "../src/lib/framework";
import { LINKS } from "../src/lib/content-meta";

const criteria = Object.fromEntries(framework.flatMap((d) => d.criteria.map((c) => [c.id, {
  title: c.title, question: c.question, levels: c.levels, leading: c.leading, domain: d.name,
}])));
writeFileSync("supabase/functions/guide/context.json", JSON.stringify({ version: "1.0.0", criteria, links: LINKS }));
console.log(`guide context: ${Object.keys(criteria).length} criteria, ${LINKS.length} links`);
