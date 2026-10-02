#!/usr/bin/env python3
"""Rolling source review for Principled Futures (stage 1: no database).

Re-reads the documents behind the approved briefs and records what it finds in
content/sources/. It never edits a brief or a reading list: a person decides
every change. Method: docs/source-review-protocol.md.

  python3 scripts/source_check.py --directory   rebuild directory.json and the coverage report only
  python3 scripts/source_check.py --all         check every source (first run sets the baseline)
  python3 scripts/source_check.py               today's batch (one fourteenth) + all anchors + the watch list

Three kinds of check, in order of how much they matter:
  1. Anchors   the exact words a brief quotes, and the words behind each figure, are still on the page.
  2. Watch     known moving parts (draft guidance, "under review" banners, pending renames).
  3. Drift     the document still loads, and how much of its text has changed since last time.

Stores fingerprints and short labels only, never copies of the sources.
"""
import glob, hashlib, html, io, json, os, re, subprocess, sys, datetime

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = os.path.join(ROOT, "content", "sources")
LIB = os.path.join(ROOT, "content", "library", "1.0.0")
CYCLE_DAYS = 14          # every source is re-read at least this often
DECIDE_DAYS = 14         # a queued item must be decided within this many days
CHANGE_THRESHOLD = 0.05  # share of passages added or removed before drift is queued
MIN_PASSAGE = 80         # shorter passages are menus, dates and captions
TARGET_PER_CRITERION = 12
TARGET_TOTAL = 500
UA = "PrincipledFutures-SourceCheck/1.0 (+https://principledfutures.com; source freshness check, one request per document per fortnight)"
TODAY = datetime.date.today().isoformat()


def load(name, fallback):
    p = os.path.join(SRC, name)
    return json.load(open(p)) if os.path.exists(p) else fallback


def save(name, value):
    with open(os.path.join(SRC, name), "w") as f:
        json.dump(value, f, indent=2, ensure_ascii=False)
        f.write("\n")


def key_of(url):
    return url.split("#")[0].rstrip("/")


def norm(t):
    for a, b in (("’", "'"), ("‘", "'"), ("“", '"'), ("”", '"'), (" ", " ")):
        t = t.replace(a, b)
    return " ".join(t.split())


def fetch(url):
    """Return (status, text). PDFs are read from the file itself, never a summary."""
    out = subprocess.run(["curl", "-sL", "-m", "60", "-A", UA, "-w", "\n%{http_code}", url], capture_output=True).stdout
    body, _, code = out.rpartition(b"\n")
    try:
        status = int(code)
    except ValueError:
        status = 0
    if body[:5] == b"%PDF-":
        try:
            from pypdf import PdfReader
            text = " ".join(norm(p.extract_text() or "") for p in PdfReader(io.BytesIO(body)).pages)
        except Exception:
            return status, ""
        return status, text
    raw = body.decode("utf-8", "ignore")
    passages = re.sub(r"<script.*?</script>|<style.*?</style>", "", raw, flags=re.S)
    return status, norm(html.unescape(re.sub(r"<[^>]+>", " ", passages)))


def passages(text):
    parts = [p.strip() for p in re.split(r"(?<=[.!?])\s+", text)]
    return {hashlib.sha256(p.encode()).hexdigest()[:16] for p in parts if len(p) >= MIN_PASSAGE}


# ── The directory: every document once, with the criteria that rely on it ──

def build_directory():
    rows, per = {}, {}
    for f in sorted(glob.glob(os.path.join(LIB, "*.json"))):
        d = json.load(open(f))
        cid = d.get("criterion") or os.path.basename(f)[:-5]
        per[cid] = {"items": len(d["items"]), "status": d.get("status", "draft")}
        for it in d["items"]:
            k = key_of(it["url"])
            r = rows.setdefault(k, {"key": k, "url": it["url"], "title": it["title"], "publisher": it.get("publisher"),
                                    "year": it.get("year"), "tier": it.get("tier"), "access": it.get("access"),
                                    "criteria": [], "locators": {}, "last_checked": it.get("last_checked")})
            if cid not in r["criteria"]:
                r["criteria"].append(cid)
            if it.get("locator"):
                r["locators"][cid] = it["locator"]
            for field in ("jurisdiction", "type", "quote", "published"):
                if it.get(field) and field not in r:
                    r[field] = it[field]
    directory = sorted(rows.values(), key=lambda r: (r.get("publisher") or "", r["title"]))
    save("directory.json", {"built": TODAY, "count": len(directory), "sources": directory})
    short = sorted(c for c, v in per.items() if v["items"] < TARGET_PER_CRITERION)
    tiers = {}
    for r in directory:
        tiers[r.get("tier") or "unset"] = tiers.get(r.get("tier") or "unset", 0) + 1
    missing = {f: sum(1 for r in directory if not r.get(f)) for f in ("quote", "jurisdiction", "type", "published")}
    report = {"built": TODAY, "distinct_documents": len(directory), "target_total": TARGET_TOTAL,
              "criteria_with_a_reading_list": len(per), "criteria_total": 64,
              "reading_list_entries": sum(v["items"] for v in per.values()),
              "target_per_criterion": TARGET_PER_CRITERION, "criteria_below_target": short,
              "by_tier": tiers, "citation_fields_missing": missing}
    save("coverage.json", report)
    return directory, report


# ── The checks ──

def run(check_all):
    directory, report = build_directory()
    state = load("state.json", {})
    prints = load("fingerprints.json", {})
    queue = load("queue.json", {"items": []})
    open_keys = {(q["type"], q["key"]) for q in queue["items"] if not q.get("decision")}
    cache, new_items = {}, []

    def get(url):
        if url not in cache:
            cache[url] = fetch(url)
        return cache[url]

    def enqueue(kind, key, title, criteria, detail):
        if (kind, key) in open_keys:
            return
        open_keys.add((kind, key))
        n = sum(1 for q in queue["items"] if q["id"].startswith("R-" + TODAY.replace("-", ""))) + len(new_items) + 1
        due = (datetime.date.today() + datetime.timedelta(days=DECIDE_DAYS)).isoformat()
        new_items.append({"id": f"R-{TODAY.replace('-', '')}-{n:02d}", "type": kind, "key": key, "title": title,
                          "criteria": criteria, "detail": detail, "found": TODAY, "decide_by": due})

    # 1. Anchors: checked on every run.
    anchors = load("anchors.json", {})
    a_ok = a_bad = 0
    for cid, items in anchors.items():
        if cid.startswith("_"):
            continue
        for a in items:
            status, text = get(a["url"])
            if norm(a["text"]) in text:
                a_ok += 1
            else:
                a_bad += 1
                why = f"HTTP {status}" if status != 200 or not text else "the words are no longer on the page"
                enqueue("anchor", f"{cid}|{a['text'][:60]}", f"{a['kind'].capitalize()} in {cid}", [cid],
                        f"{why}: \"{a['text'][:140]}\" at {a['url']}")

    # 2. Watch list: checked on every run.
    watch = load("watch.json", {"items": []})
    w_changed = 0
    for w in watch["items"]:
        status, text = get(w["url"])
        present = norm(w["banner"]).lower() in text.lower()
        prev = state.get("watch:" + w["id"], {}).get("present")
        state["watch:" + w["id"]] = {"present": present, "status": status, "checked": TODAY}
        if status == 200 and text and not present and prev is not False:
            w_changed += 1
            enqueue("watch", w["id"], w["what"], w["affects"], w["when_gone"])

    # 3. Drift: a fourteenth of the directory a day, oldest first; everything with --all.
    def last(r):
        return state.get(r["key"], {}).get("checked", "")
    due = sorted(directory, key=last)
    batch = due if check_all else [r for r in due if not last(r)] + [r for r in due if last(r)][: max(1, len(due) // CYCLE_DAYS)]
    seen, loaded, blocked, drifted = set(), 0, 0, 0
    for r in batch:
        if r["key"] in seen:
            continue
        seen.add(r["key"])
        status, text = get(r["url"])
        fp = sorted(passages(text))
        old = prints.get(r["key"])
        entry = {"title": r["title"], "criteria": r["criteria"], "status": status, "checked": TODAY, "passages": len(fp)}
        if status != 200 or not text:
            blocked += 1
            entry["note"] = "did not load for the script; read by hand"
            if old is not None or status in (404, 410):
                enqueue("unreachable", r["key"], r["title"], r["criteria"], f"HTTP {status} at {r['url']}")
        else:
            loaded += 1
            if old and fp:
                a, b = set(old), set(fp)
                change = len(a ^ b) / max(1, len(a | b))
                entry["change"] = round(change, 3)
                if change > CHANGE_THRESHOLD:
                    drifted += 1
                    enqueue("changed", r["key"], r["title"], r["criteria"],
                            f"{round(change * 100)}% of passages differ from the last reading at {r['url']}")
            if fp:
                prints[r["key"]] = fp
        state[r["key"]] = entry

    queue["items"].extend(new_items)
    save("state.json", state)
    save("fingerprints.json", prints)
    save("queue.json", queue)
    summary = {"run": TODAY, "mode": "all" if check_all else "batch", "anchors_ok": a_ok, "anchors_failed": a_bad,
               "watch_items": len(watch["items"]), "watch_changed": w_changed, "sources_checked": len(seen),
               "loaded": loaded, "did_not_load": blocked, "drifted": drifted, "queued_today": len(new_items),
               "open_queue": sum(1 for q in queue["items"] if not q.get("decision")), "directory": report["distinct_documents"]}
    save("last-run.json", summary)
    with open(os.path.join(SRC, "history.jsonl"), "a") as f:
        f.write(json.dumps(summary) + "\n")
    return summary


if __name__ == "__main__":
    if "--directory" in sys.argv:
        _, rep = build_directory()
        print(json.dumps(rep, indent=2))
    else:
        print(json.dumps(run("--all" in sys.argv), indent=2))
