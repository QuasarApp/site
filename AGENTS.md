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
  banner), business verticals, featured projects showcase (cards for the
  6 key projects - Ecliptica links to the `/ecliptica.html` hub, issue
  #79, the rest to the upcoming `/projects/{slug}` pages, issue #77),
  latest news/devlog feed, technology stack + GitHub org
  metrics, project-card grid, about + stats, contact, footer with social
  links (home sections per issue #78 / TZ 2.1).
- `ecliptica.html` — Ecliptica flagship hub page (issue #79): hero with
  video placeholder, mechanics tabs, development roadmap, system
  requirements table, community links, media gallery with lightbox and a
  feedback form. Loads `js/i18n.js`, `js/parallax.js` and `js/main.js`;
  its `data-lang` keys live in the nested `ecliptica` section of every
  language in `js/i18n.js` (the same key set is enforced by
  `tests/i18n.test.js` for all five languages).
- `css/style.css` — the only stylesheet; reuse the CSS design tokens on
  `:root`.
- `js/i18n.js` (load 1st) — `translations` object for `en`/`ru`/`me`/`de`/`es`;
  elements carry `data-lang` dot-path keys. When adding or changing a
  string, update the key in the markup and all five language blocks
  together. EN is the default language; the navbar `#lang-select`
  switcher lists every active language and the choice is persisted in
  `localStorage` (`quasarapp_language`). After each update it dispatches
  a `quasarapp:languagechange` CustomEvent so data renderers can
  re-localize dynamic content.
- `js/parallax.js` (load 2nd) — global `ParallaxHandler` class.
- `js/main.js` (load 3rd) — scroll animations, card tilt, particles.
- `js/home-data.js` (load 4th) — renders the devlog feed from
  `data/devlog.json` (latest 5 posts with date + tag) and the GitHub org
  metrics from `data/github-org-metrics.json` (issue #78). Progressive
  enhancement: the static markup keeps the documented devlog empty state
  and the metrics fallback line when a JSON file is missing or
  unreachable (graceful offline fallback). Re-renders dynamic content on
  the `quasarapp:languagechange` event.
- `data/github-org-metrics.json` — build-time cache of the QuasarApp
  GitHub org metrics (repo count, total stars, fetchedAt). Refresh with
  `node scripts/fetch-github-metrics.js` (no token needed, Node >= 18).
  If the GitHub API is unreachable, the script keeps the existing cache
  and exits 0 (graceful offline fallback); without any cache it exits 1.
- `data/devlog.json` — devlog content collection for the home feed:
  `{"posts": [{ "slug", "title", "date", "tags": [], "excerpt" }]}`.
  Seeded by the devlog issue (#75); while empty, the home page shows the
  explicit empty state.
- `scripts/` — dependency-free Node helper scripts (the metrics fetcher
  above); they are build-time tools and are not loaded by the browser.
- `tests/` — dependency-free Node.js test suite run with
  `node --test tests/*.test.js`; executed on every pull request by the
  `.github/workflows/auto-tests.yml` GitHub Actions workflow
  (`auto-tests` job plus a `lighthouse` job that enforces 90+ Performance
  on Desktop and Mobile, see below). `tests/home.test.js` guards the home
  sections (issue #78); `tests/links.test.js` exempts the upcoming
  `/projects/...` and `/devlog/...` routes (issues #75/#77) from the
  file-existence check until those pages land.
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

The script load order (i18n → parallax → main → home-data) matters — keep it.

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
