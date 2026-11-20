# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Description

Static single-page website for the QuasarApp organization. Pure HTML5 +
CSS3 + vanilla JS — no framework, no build step, no dependencies.
Multi-language: English (default), Russian, Montenegrin, German and
Spanish. Hosted on GitHub Pages: the `main` branch root is served at
`https://quasarapp.github.io/site/` (custom domain via `CNAME`).

## Architecture

- `index.html` — single page: navbar, hero (with Ecliptica featured
  banner), project-card grid, about + stats, contact, footer with social
  links.
- `css/style.css` — the only stylesheet; reuse the CSS design tokens on
  `:root`.
- `js/i18n.js` (load 1st) — `translations` object for `en`/`ru`/`me`/`de`/`es`;
  elements carry `data-lang` dot-path keys. When adding or changing a
  string, update the key in the markup and all five language blocks
  together. EN is the default language; the navbar `#lang-select`
  switcher lists every active language and the choice is persisted in
  `localStorage` (`quasarapp_language`).
- `js/parallax.js` (load 2nd) — global `ParallaxHandler` class.
- `js/main.js` (load 3rd) — scroll animations, card tilt, particles.
- `tests/` — dependency-free Node.js test suite run with
  `node --test tests/*.test.js`; executed on every pull request by the
  `.github/workflows/auto-tests.yml` GitHub Actions workflow
  (`auto-tests` job plus a `lighthouse` job that enforces 90+ Performance
  on Desktop and Mobile, see below).
- Media & performance (issue #81):
  - All content images are pre-optimized WebP committed to the repo (no
    build step). Responsive variants (`*-480.webp`, `*-768.webp`, ...) live
    next to the original and are wired via `srcset`/`sizes`. Favicons and
    the Apple touch icon stay PNG (browser requirement).
  - No render-blocking third-party CSS/JS: the body uses the system font
    stack and icons are an inline SVG sprite (`<symbol>`/`<use>`) at the
    top of `index.html`. Do not add CDN stylesheet/font/script links.
  - LCP hero image: `<link rel="preload" as="image" imagesrcset=...
    imagesizes=...>` in `<head>` + `fetchpriority="high"` on the `<img>`;
    below-the-fold images use `loading="lazy"`.
  - `tests/media.test.js` enforces all of the above; any `<video>` element
    must also satisfy the non-blocking contract (poster +
    IntersectionObserver + `prefers-reduced-motion` fallback).

The script load order (i18n → parallax → main) matters — keep it.

## Workflow

- No build: serve the repo root (e.g. `npx http-server -p 8000`) and check
  all 5 languages in a browser.
- Run the auto tests before pushing: `node --test tests/*.test.js` (the
  same suite runs on every pull request via
  `.github/workflows/auto-tests.yml`).
- Measure performance with Lighthouse before pushing (commands in
  `README.md`, "Performance & Media"); CI fails the PR when the
  Performance category drops below 90 on Desktop or Mobile.
- Never commit or push to `main`. Work on `task_<issue-number>` from an
  up-to-date `main`, push it, and open a PR against `main` with
  `Closes #<issue-number>` in the description.
- Keep the site dependency-free (no frameworks or bundlers) and do not use
  Python. Keep changes minimal; update `README.md` and this file together
  on structural changes.
