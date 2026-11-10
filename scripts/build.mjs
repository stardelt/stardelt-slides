// Builds `_site/` from `site/` and `decks.json`: the deck files, an index page,
// a 404 page, the custom-domain file and `.nojekyll`.
import { readFileSync, rmSync, mkdirSync, cpSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = join(root, '_site');

const decks = JSON.parse(readFileSync(join(root, 'decks.json'), 'utf8'));

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(root, 'site'), out, { recursive: true });

const escape = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const sorted = [...decks].sort((a, b) => String(b.date).localeCompare(String(a.date)));
const cards = sorted
  .map(
    (deck) => `<a class="card" href="${escape(deck.slug)}/">
  <h2>${escape(deck.title)}</h2>
  <p>${escape(deck.summary)}</p>
  <time>${escape(deck.date)}</time>
</a>`,
  )
  .join('\n');

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>stardelt slides</title>
<meta name="description" content="stardelt decks — talks, demos and community events. Content Apache 2.0.">
<link rel="stylesheet" href="shared/stardelt.css">
<style>
* { box-sizing: border-box; }
body { margin: 0; padding: 64px 16px; background: #18191b; color: #e8eaed; font-family: Inter, Arial, sans-serif; }
main { max-width: 880px; margin: 0 auto; }
h1 { margin: 0 0 8px; font-family: 'Space Grotesk', Arial, sans-serif; font-size: 48px; font-weight: 700; color: #f3f4f6; }
.lead { margin: 0 0 40px; font-size: 20px; color: #8e949e; }
.card { display: block; padding: 28px; margin-bottom: 16px; background: #1f2124; border: 1px solid #3e4147; border-radius: 16px; text-decoration: none; }
.card h2 { margin: 0 0 8px; font-family: 'Space Grotesk', Arial, sans-serif; font-size: 26px; font-weight: 700; color: #f3f4f6; }
.card p { margin: 0 0 12px; font-size: 18px; line-height: 1.5; color: #b0b5bd; }
.card time { font-size: 14px; color: #8e949e; }
.card:hover { border-color: #7a8aff; }
footer { max-width: 880px; margin: 40px auto 0; margin-top: 40px; font-size: 14px; color: #8e949e; }
footer a { color: #7a8aff; }
</style>
</head>
<body>
<main>
<h1>stardelt slides</h1>
<p class="lead">Talks, demos and community events. Content Apache 2.0.</p>
${cards}
</main>
<footer>Content Apache 2.0 · <a href="https://github.com/stardelt/stardelt-slides">source on GitHub</a> ↗</footer>
</body>
</html>
`;

writeFileSync(join(out, 'index.html'), page);
writeFileSync(join(out, '404.html'), page);
writeFileSync(join(out, 'CNAME'), 'slides.stardelt.io\n');
writeFileSync(join(out, '.nojekyll'), '');

console.log(`built ${out} with ${decks.length} deck(s)`);
