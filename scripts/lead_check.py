#!/usr/bin/env python3
"""Lead re-check of a domain's briefs before they go to Andy.

  python3 scripts/lead_check.py 5        check every brief whose id starts "5."
  python3 scripts/lead_check.py 5 --add  also record each brief's quotation in content/sources/anchors.json

For each brief: the one quotation is found word for word in a document on its own reading list; every
reading-list `quote` is found at its link; the body is within 290 words with exactly one quotation and no
internal criterion numbers; no quotation is shared with another brief. Raw text only (see source_check.fetch).
"""
import glob, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import source_check as sc

ROOT = sc.ROOT
BRIEFS = os.path.join(ROOT, "content", "briefs", "1.0.0")
REQUIRED = ["title", "publisher", "year", "url", "access", "tier", "type", "jurisdiction", "locator", "quote", "why", "last_checked"]


def body_of(path):
    md = open(path).read()
    return md.split("\n# ", 1)[1].split("\n", 1)[1] if "\n# " in md else md


def quotation(body):
    m = re.findall(r'["“]([^"“”]{15,})["”]', body)
    return m[0] if m else None


def main():
    prefix = sys.argv[1] + "."
    add = "--add" in sys.argv
    cache, problems = {}, []
    def get(url):
        if url not in cache:
            cache[url] = sc.fetch(url)
        return cache[url]
    every = {os.path.basename(f)[:-3]: sc.norm(quotation(body_of(f)) or "") for f in glob.glob(os.path.join(BRIEFS, "*.md"))}
    anchors = sc.load("anchors.json", {})
    for f in sorted(glob.glob(os.path.join(BRIEFS, prefix + "*.md"))):
        cid = os.path.basename(f)[:-3]
        body = body_of(f)
        words = len(body.split())
        marks = len(re.findall(r'["“”]', body))
        internal = re.findall(r"\(\s*[1-8]\.[1-8][^)]*\)|[Cc]riterion [1-8]\.[1-8]|Band [0-5]\b", body)
        lib = json.load(open(os.path.join(sc.LIB, cid + ".json")))
        q = quotation(body)
        where = None
        if q:
            for it in lib["items"]:
                st, text = get(it["url"])
                if sc.norm(q) in text:
                    where = it["url"]; break
        bad_quotes, missing = [], set()
        for it in lib["items"]:
            for k in REQUIRED:
                if it.get(k) in (None, ""): missing.add(k)
            if it.get("quote"):
                st, text = get(it["url"])
                if sc.norm(it["quote"]) not in text:
                    bad_quotes.append(f"{it['title'][:50]} (HTTP {st})")
                if len(it["quote"].split()) > 25:
                    bad_quotes.append(f"{it['title'][:50]} (quote over 25 words)")
        dup = [o for o, t in every.items() if o != cid and t and t == sc.norm(q or "")]
        line = f"{cid}: {words} words, {len(lib['items'])} sources, quotation {'FOUND' if where else 'NOT FOUND on its reading list'}"
        issues = []
        if words > 290: issues.append(f"over limit ({words})")
        if marks != 2: issues.append(f"{marks} quote marks (want 2)")
        if internal: issues.append(f"internal references {internal}")
        if not where: issues.append("quotation not verified")
        if bad_quotes: issues.append("library quotes not found: " + "; ".join(bad_quotes))
        if missing: issues.append("citation fields missing: " + ", ".join(sorted(missing)))
        if dup: issues.append("quotation shared with " + ", ".join(dup))
        print(line + ("" if not issues else "\n    ! " + "\n    ! ".join(issues)))
        problems += issues
        if add and where:
            entry = {"kind": "quotation", "url": where, "text": q}
            cur = [a for a in anchors.get(cid, []) if a.get("kind") != "quotation"]
            anchors[cid] = [entry] + cur
    if add:
        sc.save("anchors.json", anchors)
    print(f"\n{len(problems)} issue(s)")


if __name__ == "__main__":
    main()
