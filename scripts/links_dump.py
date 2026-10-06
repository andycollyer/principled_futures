#!/usr/bin/env python3
"""List the automatically derived links for a domain (skipping pairs already drafted with a
lower-numbered domain), with questions and shared sources. Also: --pair A B lists any documents
two criteria share.  Usage: python3 scripts/links_dump.py 2 | --pair 1.4 2.1"""
import json, re, glob, os, sys
links = json.load(open("content/links/derived.json"))
fw = open("src/lib/framework.ts").read()
crit = {i: (t, q) for i, t, q in re.findall(r'id: "(\d\.\d)", title: "([^"]+)", question: "([^"]+)"', fw)}
lib = {}
for f in glob.glob("content/library/1.0.0/*.json"):
    d = json.load(open(f)); items = d if isinstance(d, list) else d.get("sources") or d.get("items") or d.get("reading_list") or []
    lib[os.path.basename(f)[:-5]] = {(x.get("url") or x.get("title")): x for x in items}
def shared(a, b): return [lib[a][k] for k in lib.get(a, {}) if k in lib.get(b, {})]
def show(a, b, w=None):
    print(f"## {a} {crit[a][0]} <-> {b} {crit[b][0]}" + (f" (shared {w})" if w else ""))
    print(f"   Q{a}: {crit[a][1]}\n   Q{b}: {crit[b][1]}")
    for x in shared(a, b)[:6]: print(f"   - {x.get('title','')[:95]} ({x.get('publisher','')[:28]}, {x.get('year','')}) [{x.get('type','')}]")
    print()
if sys.argv[1] == "--pair":
    for i in range(2, len(sys.argv), 2): show(sys.argv[i], sys.argv[i + 1])
else:
    n = int(sys.argv[1]); dn = lambda c: int(c[0])
    mine = [l for l in links if n in (dn(l[0]), dn(l[1])) and min(dn(l[0]), dn(l[1])) >= n]
    print(len(mine), "links to draft for domain", n, "\n")
    for a, b, w in sorted(mine): show(a, b, w)
