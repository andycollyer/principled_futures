#!/usr/bin/env python3
"""Record Andy's approval of a domain's links: proposed additions become kept links.
Usage: python3 scripts/links_approve.py 2 2026-10-06"""
import json, sys
n, day = sys.argv[1], sys.argv[2]
p = f"content/links/1.0.0/domain-{n}.json"; d = json.load(open(p))
for l in d.pop("proposed", []):
    if "To be confirmed" in l["source"]: sys.exit(f"No source yet for {l['from']}>{l['to']}")
    l["verdict"] = "keep"; l["added"] = True; d["links"].append(l)
d.update(status="approved", approved=day, approved_by="Andy Collyer")
json.dump(d, open(p, "w"), indent=2, ensure_ascii=False)
print(f"domain {n} approved: {sum(l['verdict']=='keep' for l in d['links'])} kept")
