"""Assemble one deck from slides of other decks (run from the repository root; see README, "Merge decks").

    python3 scripts/merge-deck.py SPEC.json

SPEC: {"slug": ..., "title": ..., "description": ..., "slides": [["deck", n] | ["new", "<section …>…</section>"], ...],
       "images": [["deck", "file"], ...]}
A slide is the n-th <section> of site/<deck>/index.html (1-based), copied with its speaker notes. The page
head and foot come from site/<first deck of the list>/index.html; only <title> and the description change.
"""
import html
import json
import pathlib
import re
import shutil
import sys

spec = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
site = pathlib.Path("site")
cache = {}


def sections(deck):
    if deck not in cache:
        text = (site / deck / "index.html").read_text(encoding="utf-8")
        cache[deck] = (text, re.findall(r"<section\b.*?</section>", text, re.S))
    return cache[deck][1]


first = next(item[0] for item in spec["slides"] if item[0] != "new")
template = (site / first / "index.html").read_text(encoding="utf-8")
head = template[: template.index("<section")]
foot = template[template.rindex("</section>") + len("</section>") :]
head = re.sub(r"<title>[^<]*</title>", f"<title>{html.escape(spec['title'])}</title>", head, count=1)
head = re.sub(
    r'<meta name="description" content="[^"]*">',
    f'<meta name="description" content="{html.escape(spec["description"], quote=True)}">',
    head,
    count=1,
)
body = []
for deck, which in spec["slides"]:
    body.append(which if deck == "new" else sections(deck)[which - 1])
out = site / spec["slug"]
(out / "img").mkdir(parents=True, exist_ok=True)
for deck, name in spec.get("images", []):
    shutil.copyfile(site / deck / "img" / name, out / "img" / name)
(out / "index.html").write_text(head + "\n\n".join(body) + foot, encoding="utf-8")
print(f"wrote site/{spec['slug']}/index.html: {len(body)} slides, {len(spec.get('images', []))} images")
