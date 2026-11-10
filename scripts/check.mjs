// Enforces the stardelt deck pattern. Prints every violation as `<file>: <rule>`
// and exits with 1 when there is at least one.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const problems = [];
const fail = (file, rule) => problems.push(`${file}: ${rule}`);

const ALLOWED_SCRIPTS = [
  '../vendor/reveal/reveal.js',
  '../vendor/reveal/plugin/notes/notes.js',
  '../vendor/reveal/plugin/markdown/markdown.js',
  '../shared/init.js',
];

const decksPath = join(root, 'decks.json');
let decks = [];
try {
  decks = JSON.parse(readFileSync(decksPath, 'utf8'));
} catch (err) {
  console.error(`decks.json: cannot read or parse (${err.message})`);
  process.exit(1);
}
if (!Array.isArray(decks)) {
  console.error('decks.json: must be a JSON array');
  process.exit(1);
}

// (a) every entry is valid and its deck exists
const slugs = new Set();
for (const [i, deck] of decks.entries()) {
  const where = `decks.json[${i}]`;
  if (typeof deck.slug !== 'string' || !/^[a-z0-9-]+$/.test(deck.slug)) {
    fail(where, 'slug must match ^[a-z0-9-]+$');
  } else {
    slugs.add(deck.slug);
  }
  if (typeof deck.title !== 'string' || deck.title.trim() === '') fail(where, 'title must be non-empty');
  if (typeof deck.summary !== 'string' || deck.summary.trim() === '') fail(where, 'summary must be non-empty');
  if (typeof deck.date !== 'string' || !/^\d{4}-\d{2}$/.test(deck.date)) fail(where, 'date must match YYYY-MM');
  if (typeof deck.slug === 'string' && !existsSync(join(root, 'site', deck.slug, 'index.html'))) {
    fail(`site/${deck.slug}/index.html`, 'missing (listed in decks.json)');
  }
}

// (b) every folder in site/ except the shared ones is a deck
const siteDir = join(root, 'site');
const SHARED = new Set(['vendor', 'fonts', 'shared']);
const folders = readdirSync(siteDir).filter((name) => statSync(join(siteDir, name)).isDirectory());
for (const name of folders) {
  if (!SHARED.has(name) && !slugs.has(name)) fail(`site/${name}`, 'not listed in decks.json');
}

const deckFiles = decks.filter((d) => typeof d.slug === 'string').map((d) => `site/${d.slug}/index.html`);

const imgSizeLimit = 2 * 1024 * 1024;
const folderSizeLimit = 15 * 1024 * 1024;

function folderSize(dir) {
  let total = 0;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    total += st.isDirectory() ? folderSize(path) : st.size;
  }
  return total;
}

for (const rel of deckFiles) {
  const path = join(root, rel);
  if (!existsSync(path)) continue; // already reported by (a)
  const html = readFileSync(path, 'utf8');
  const dir = dirname(path);

  // (c) the required head and script wiring
  if (!/<title>[^<]+<\/title>/.test(html)) fail(rel, 'missing <title>');
  if (!html.includes('href="../vendor/reveal/reveal.css"')) fail(rel, 'missing href="../vendor/reveal/reveal.css"');
  if (!html.includes('href="../shared/stardelt.css"')) fail(rel, 'missing href="../shared/stardelt.css"');
  if (!html.includes('src="../vendor/reveal/reveal.js"')) fail(rel, 'missing src="../vendor/reveal/reveal.js"');
  if (!html.includes('src="../vendor/reveal/plugin/notes/notes.js"')) {
    fail(rel, 'missing src="../vendor/reveal/plugin/notes/notes.js"');
  }
  {
    const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
    if (srcs.length === 0 || srcs[srcs.length - 1] !== '../shared/init.js') {
      fail(rel, 'src="../shared/init.js" must be the last <script>');
    }
  }

  // (d) only vendored and shared scripts, no inline script bodies
  for (const m of html.matchAll(/<script\b([^>]*)>/g)) {
    const attrs = m[1];
    const src = /\bsrc="([^"]+)"/.exec(attrs);
    if (!src) {
      fail(rel, 'inline <script> body');
    } else if (!ALLOWED_SCRIPTS.includes(src[1])) {
      fail(rel, `script src not vendored: ${src[1]}`);
    }
  }

  // (e) no request leaves the page. A `<script src>` is reported by (d) instead,
  // so a single violation gives a single message.
  for (const m of html.matchAll(/<([a-zA-Z]+)\b[^>]*?\bsrc="(https?:\/\/|\/\/)[^"]*"/g)) {
    if (m[1].toLowerCase() !== 'script') fail(rel, `external request: ${m[0].slice(0, 80)}`);
  }
  for (const m of html.matchAll(/<link\b[^>]*\bhref="(https?:\/\/|\/\/)[^"]*"|url\((https?:\/\/|\/\/)[^"')]*/g)) {
    fail(rel, `external request: ${m[0].slice(0, 80)}`);
  }

  // (f) images have alt text and exist
  for (const m of html.matchAll(/<img\b([^>]*)>/g)) {
    const alt = /\balt="([^"]*)"/.exec(m[1]);
    if (!alt || alt[1].trim() === '') fail(rel, 'img without alt text');
    const src = /\bsrc="([^"]+)"/.exec(m[1]);
    if (!src) {
      fail(rel, 'img without src');
      continue;
    }
    const imgPath = join(dir, src[1]);
    if (!existsSync(imgPath)) {
      fail(`${rel}: img/${src[1]}`, 'image file missing');
      continue;
    }
    if (statSync(imgPath).size > imgSizeLimit) fail(`${rel}: img/${src[1]}`, 'image larger than 2 MB');
  }

  // (g) every slide has speaker notes
  const sections = (html.match(/<section\b/g) || []).length;
  const notes =
    (html.match(/<aside class="notes">/g) || []).length + (html.match(/^Note:/gm) || []).length;
  if (notes < sections) fail(rel, `${sections} <section> but ${notes} notes`);

  // (h) the deck folder stays small
  const size = folderSize(dir);
  if (size > folderSizeLimit) fail(rel, `deck folder ${(size / 1024 / 1024).toFixed(1)} MB > 15 MB`);
}

if (problems.length > 0) {
  for (const line of problems) console.log(line);
  process.exit(1);
}
console.log(`ok: ${decks.length} deck(s)`);
