#!/usr/bin/env python3
"""Write the plain-English approval document for one domain's criteria links.
Usage: python3 scripts/links_doc.py 1   ->  ../Links-domain-1-for-approval.md
Also checks every link names two real criteria and a source."""
import json, re, sys
n = sys.argv[1]
d = json.load(open(f"content/links/1.0.0/domain-{n}.json"))
fw = open("src/lib/framework.ts").read()
crit = dict(re.findall(r'id: "(\d\.\d)", title: "([^"]+)"', fw))
dom = dict(re.findall(r'id: (\d), key: "[^"]+", name: "([^"]+)"', fw))
bad = [l for l in d["links"] + d.get("proposed", []) if l["from"] not in crit or l["to"] not in crit or not l.get("reason") or not l.get("source")]
if bad: sys.exit(f"Broken entries: {bad}")
keep = [l for l in d["links"] if l["verdict"] == "keep"]; drop = [l for l in d["links"] if l["verdict"] == "drop"]
out = [f"# Links for approval: domain {n}, {dom[n]}", "",
       f"Drafted {d['drafted']}. {len(d['links'])} links found automatically from shared sources; I recommend keeping {len(keep)} and dropping {len(drop)}, and propose {len(d.get('proposed', []))} that the automatic method missed.", "",
       "How to read each line: **the first criterion has to be in place for the second to work.** On the dashboard, a weak answer on the first will be shown as holding back the second.", "",
       "To approve: reply \"approved\", or list the numbers you want changed, dropped or reversed.", "", "## Recommended to keep", ""]
def line(i, l): return f"{i}. **{l['from']} {crit[l['from']]} → {l['to']} {crit[l['to']]}**  \n   {l['reason']}  \n   *Source: {l['source']}*"
i = 0
for l in keep: i += 1; out += [line(i, l), ""]
out += ["## Recommended to drop", ""]
for l in drop: i += 1; out += [line(i, l), ""]
if d.get("proposed"):
    out += ["## Proposed additions", "", "These were not found automatically because the two reading lists do not share enough documents. If you approve them, I will confirm a source for each before they go live.", ""]
    for l in d["proposed"]: i += 1; out += [line(i, l), ""]
open(f"../Links-domain-{n}-for-approval.md", "w").write("\n".join(out))
print(f"domain {n}: keep {len(keep)}, drop {len(drop)}, proposed {len(d.get('proposed', []))}")
