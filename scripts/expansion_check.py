#!/usr/bin/env python3
"""Check expansion files before anything is merged.   python3 scripts/expansion_check.py [prefix] [--merge]
Every added quote is 25 words or fewer and found at its link; required fields present; no document the criterion
already has. --merge writes passing additions (and back-fill) into the reading lists and stamps them "added"."""
import glob, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import source_check as sc
EXP = os.path.join(sc.ROOT, "content", "research", "expansion")
REQ = ["title", "publisher", "year", "url", "access", "tier", "type", "jurisdiction", "locator", "quote", "why"]
args = [a for a in sys.argv[1:] if not a.startswith("--")]
prefix = args[0] if args else ""
merge = "--merge" in sys.argv
cache = {}
def get(u):
    if u not in cache: cache[u] = sc.fetch(u)
    return cache[u]
tot_ok = tot_bad = 0
for f in sorted(glob.glob(os.path.join(EXP, prefix + "*.json"))):
    cid = os.path.basename(f)[:-5]
    d = json.load(open(f)); libp = os.path.join(sc.LIB, cid + ".json"); lib = json.load(open(libp))
    have = {sc.key_of(i["url"]) for i in lib["items"]}
    good, bad = [], []
    for it in d.get("additions", []):
        why = []
        miss = [k for k in REQ if it.get(k) in (None, "")]
        if miss: why.append("missing " + ",".join(miss))
        if sc.key_of(it.get("url", "")) in have: why.append("already on the list")
        if it.get("quote"):
            if len(it["quote"].split()) > 25: why.append("quote over 25 words")
            st, text = get(it["url"])
            if sc.norm(it["quote"]) not in text: why.append(f"quote not found (HTTP {st})")
        (bad if why else good).append((it, why))
    fills = 0
    for url, patch in (d.get("backfill") or {}).items():
        for it in lib["items"]:
            if sc.key_of(it["url"]) == sc.key_of(url):
                q = patch.get("quote")
                if q and (len(q.split()) > 25 or sc.norm(q) not in get(it["url"])[1]):
                    patch = {k: v for k, v in patch.items() if k != "quote"}
                if merge:
                    for k, v in patch.items():
                        if v not in (None, "") and not it.get(k): it[k] = v
                fills += 1
    tot_ok += len(good); tot_bad += len(bad)
    print(f"{cid}: {len(lib['items'])} now, +{len(good)} pass, {len(bad)} fail, {fills} back-filled")
    for it, why in bad: print(f"    ! {it.get('title','?')[:60]}: {'; '.join(why)}")
    if merge:
        for it, _ in good:
            it = dict(it); it["added"] = "expansion"; it.setdefault("last_checked", sc.TODAY)
            lib["items"].append(it); have.add(sc.key_of(it["url"]))
        json.dump(lib, open(libp, "w"), indent=2, ensure_ascii=False)
print(f"\n{tot_ok} additions pass, {tot_bad} fail")
