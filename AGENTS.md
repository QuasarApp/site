# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Description

Static single-page website for the QuasarApp organization. Pure HTML5 +
CSS3 + vanilla JS — no framework, no build step, no dependencies.
Multi-language: English (default, in the markup) plus Russian, German and
Spanish. Merging into `main` deploys the repo root to
`https://quasarapp.github.io/site/` via the GitHub Pages workflow
(`.github/workflows/pages.yml`).

## Architecture

- `index.html` — single page: navbar, hero, 4 project cards, about + stats,
  contact, footer.
- `css/style.css` — the only stylesheet; reuse the CSS design tokens on `:root`.
- `js/i18n.js` (load 1st) — translations + language switch via `data-lang`
  dot-path keys; keep the `ru`/`de`/`es` keys in sync with the markup.
- `js/parallax.js` (load 2nd) — global `ParallaxHandler` class.
- `js/main.js` (load 3rd) — scroll animations, card tilt, particles.

The script load order (i18n → parallax → main) matters — keep it.

## Workflow

- No build: serve the repo root (e.g. `npx http-server -p 8000`) and check
  all 4 languages in a browser.
- Never commit or push to `main`. Work on `task_<issue-number>` from an
  up-to-date `main`, push it, and open a PR against `main` with
  `Closes #<issue-number>` in the description.
- Keep the site dependency-free (no frameworks or bundlers) and do not use
  Python. Keep changes minimal; update `README.md` and this file together
  on structural changes.
