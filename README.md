# stardelt slides

stardelt decks, published at **https://slides.stardelt.io**.

Plain [reveal.js](https://revealjs.com) HTML: no build tool, no npm dependency at run time. reveal.js
and the fonts are vendored, so a page never calls a third party.

```bash
npm run build && npm run serve      # http://localhost:3000/
```

`npm run build` checks the deck pattern and writes `_site/`. `npm run check` runs the checker alone,
which is what CI does on every pull request.

## The deck pattern

- One deck is one folder `site/<slug>/` with `index.html` and an optional `img/` folder, plus one
  entry in `decks.json`.
- A slide is a `<section class="sd …">` on a 1920×1080 canvas, using a kit layout such as
  `sd-cover`, `sd-cards`, `sd-split` or `sd-figure` (copy them from `site/kit/index.html`).
- Every slide has speaker notes: `<aside class="notes">`.
- A deck loads only `../vendor/reveal/*`, `../shared/*` and its own `img/`. It loads nothing over
  `http(s)://`, and has no `<script>` of its own.
- Graphite colours: `#18191b` bg, `#1f2124` surface, `#3e4147` border, `#e8eaed` text, `#b0b5bd` dim,
  `#8e949e` mute, `#7a8aff` accent. Fonts: Space Grotesk for headings, Inter for text. The logo is
  unchanged.

## Add a deck

1. Copy `site/sovereignty/index.html` to `site/<slug>/index.html` and replace the slides.
2. Add an entry to `decks.json` (`slug`, `title`, `summary`, `date`).
3. Run `npm run check`.

## Layouts

Start every new deck by copying slides from `site/kit/index.html`. Use the `sd-*` classes; add
`style=` only for a one-off position. A layout that two decks need goes into `shared/stardelt.css`
and the kit first.

## Publish

Every push to `main` builds `_site/` and deploys it to GitHub Pages
(`.github/workflows/pages.yml`); the custom domain is `slides.stardelt.io`.
