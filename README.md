# stardelt slides

Presentations for stardelt — conference talks, demos and community events.

Built with [Slidev](https://sli.dev): markdown in, a web deck out.

## The deck

- `slides/stardelt.md` — **stardelt: your own data platform**, the main talk
  (problem, what it is, architecture, lakehouse core, the interface, streaming,
  the platform as resources, openness, status, getting started)
- `slides/img/` — the screenshots and diagrams the deck uses

## Run it

```bash
npm install
npm run dev          # http://localhost:3030
```

`npm run build` writes a static site to `dist/` at the repository root; `npm run export` writes a PDF
(needs a Chromium download the first time).

## Add a deck

Copy the frontmatter of `slides/stardelt.md` into `slides/<talk>.md`, add images
next to it in `slides/img/`, and run `npm run dev -- slides/<talk>.md`.

## Publish

Every push to `main` builds and deploys to GitHub Pages
(`.github/workflows/deploy.yml`). The project URL is
`https://stardelt.github.io/stardelt-slides/`; for `slides.stardelt.io`, add the
custom domain in the repository settings and set the DNS record — no workflow
change is needed beyond the base path in that file.

## Rules

- Public-facing: no internal notes, issue numbers, customer names or prices.
- Claims match the product: the site (`stardelt.io`) is the source for what works
  today; a slide that says "working today" must be true on `main`.
