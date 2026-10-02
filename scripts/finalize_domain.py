#!/usr/bin/env python3
"""After the lead re-check: fold a domain's per-criterion logs into one domain log, file its corrections,
and compile the approval document.   python3 scripts/finalize_domain.py 5 "Data governance & privacy" """
import glob, json, os, re, sys, datetime
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
n, name = sys.argv[1], sys.argv[2]
nb = os.path.join(ROOT, "content/research/notebooks")
today = datetime.date.today().strftime("%-d %B %Y")
dom_path = os.path.join(nb, f"D{n}.md")
dom = open(dom_path).read() if os.path.exists(dom_path) else f"# Domain {n}, {name}: research log\n"
cor_path = os.path.join(ROOT, "content/research/CORRECTIONS.md")
cor = open(cor_path).read(); total = 0
for p in sorted(glob.glob(os.path.join(nb, f"D{n}-{n}.*.md"))):
    cid = os.path.basename(p)[len(f"D{n}-"):-3]
    t = open(p).read()
    dom += "\n\n---\n\n" + re.sub(r"^# .*\n", f"## {cid} (researcher log, lead re-checked {today})\n", t, count=1)
    rows = [l for l in t.splitlines() if re.match(r"\|\s*`?%s-[a-z]" % re.escape(cid), l)]
    total += len(rows)
    if rows and f"\n## {cid}\n" not in cor:
        cor += f"\n## {cid}\n| # | Current wording | Problem | Proposed |\n| --- | --- | --- | --- |\n" + "\n".join(rows) + "\n"
    os.remove(p)
open(dom_path, "w").write(dom); open(cor_path, "w").write(cor)
out = [f"# Domain {n} — {name}: eight briefs for approval", "", f"Checked {today}. Every quotation and every reading-list citation re-read against the source.", ""]
for i in range(1, 9):
    cid = f"{n}.{i}"
    body = open(os.path.join(ROOT, f"content/briefs/1.0.0/{cid}.md")).read().split("\n# ", 1)[1]
    lib = json.load(open(os.path.join(ROOT, f"content/library/1.0.0/{cid}.json")))
    out += [f"## {cid} {body.strip()}", "", "**Reading list**", ""]
    out += [f"- {x['title']} — {x['publisher']}, {x['year']} ({x.get('locator','')})" for x in lib["items"]] + ["", "---", ""]
open(os.path.join(ROOT, "..", f"Domain-{n}-for-approval.md"), "w").write("\n".join(out))
print(f"Domain {n}: {total} corrections filed; approval document written")
