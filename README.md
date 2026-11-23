# QuasarApp Group Website

A modern, multi-language static website for the QuasarApp organization,
showcasing our projects and services. Built with **Astro** and
**Tailwind CSS 4** (issue #72): a multi-page static site with i18n routing
(English as the unprefixed default, Russian, German and Spanish under
`/ru/`, `/de/`, `/es/`) and a Git-based content layer for projects, devlog
posts and roadmaps.

Hosted on GitHub Pages: the `main` branch root is served at
`https://quasarapp.me/` (custom domain via `CNAME`).

## About Our Project

QuasarApp is an open-source organization dedicated to creating innovative
software solutions. We believe in the power of open collaboration and
building tools that empower developers worldwide.

## Architecture

- `src/pages/` — route files. English routes live at the unprefixed root
  (`src/pages/index.astro`, `src/pages/projects/[slug].astro`, ...); the
  other locales are thin wrapper pages under `src/pages/[locale]/` whose
  `getStaticPaths()` emit one route per non-default locale (RU/DE/ES).
- `src/components/pages/` — the actual page bodies (home, about, contacts,
  devlog, Ecliptica hub, projects catalog, project detail, the noindex
  `qt-secret` redirect stub). Each body is rendered by every locale's route
  and localizes itself via `Astro.currentLocale`.
- `src/layouts/Base.astro` + `src/components/` — the global layout, header
  with the EN/RU/DE/ES language switcher, footer with the verified social
  links, the inline SVG icon sprite and the shared page components.
- `src/i18n/` — `index.ts` (locale constants, the `t()` dot-path lookup,
  `localeHref()` and the `localeStaticPaths()` helper) plus one JSON file
  per language: `en.json`, `ru.json`, `de.json`, `es.json`. The key sets are
  identical across languages — guarded by `tests/i18n.test.js`.
- `src/content/` — the Git-based content layer (Astro content collections,
  `glob()` loaders, `src/content.config.ts`):
  - `projects/{slug}.md` — the 6 key project records (Ecliptica,
    CQtDeployer, CheatCard, YourTimeDelivery, Qt-Secret, Heart) rendered at
    `/projects/{slug}` for every locale.
  - `devlog/` — devlog posts for the home feed and `/devlog` (seeded by the
    devlog issue, #75; while empty the documented empty state renders).
  - `roadmap/` — the Ecliptica roadmap rendered on the `/ecliptica` hub.
- `src/data/` — build-time GitHub caches imported by the pages:
  - `github-org-metrics.json` — org repo count / total stars (refresh with
    `node scripts/fetch-github-metrics.js`, no token needed, Node >= 18).
  - `projects-github.json` — per-project stars, latest release, archived
    flag for the 5 open-source projects (refresh with
    `node scripts/fetch-projects-github.js`). YourTimeDelivery has no public
    repository and is intentionally absent; its page renders "No Public
    Repository" contact messaging. Both scripts keep the existing cache and
    exit 0 when the GitHub API is unreachable (graceful offline fallback),
    and exit 1 only without any cache.
- `src/styles/global.css` — the single stylesheet: Tailwind CSS 4 (via
  `@tailwindcss/vite`) plus the design tokens in `@theme`.
- `public/` — static assets served as-is: WebP content images under
  `assets/images/` (pre-optimized, responsive `*-480.webp` / `*-768.webp`
  variants wired via `srcset`/`sizes`; the Open Graph banner
  `banner.webp`), favicons (PNG, browser requirement), `robots.txt` and
  `sitemap.xml`.
- `scripts/` — the two dependency-free Node fetcher scripts above
  (build-time tools, not loaded by the browser).
- `tests/` — the dependency-free Node.js test suite (`node --test
  tests/*.test.js`), executed on every pull request by the
  `.github/workflows/auto-tests.yml` workflow (lint, `astro check`,
  `astro build`, node tests, plus Lighthouse 90+ Desktop/Mobile).

## Development

```bash
npm install        # install dependencies (Node >= 20.19)
npm run dev        # local dev server
```

Check all four languages (EN/RU/DE/ES) with the language switcher in the
navbar; the switcher works on every page and maps the current route to the
selected locale.

## Build & Quality Gates

```bash
npm run build      # astro build -> dist/
npm run check      # astro check (TypeScript)
npm run lint       # eslint (JS/TS + .astro templates)
npm test           # node --test tests/*.test.js (run after a build)
npm run test:full  # build + tests in one go
```

The `dist/` output is what GitHub Pages serves (via the `main` branch
root). `tests/pages.test.js`, `tests/i18n.test.js` and `tests/links.test.js`
assert on the built `dist/` pages, so run `npm run build` before `npm test`
(or use `npm run test:full`).

## GitHub metrics & project caches

The home page and the project detail pages render the cached GitHub values
from `src/data/`. Refresh the caches before pushing (no token required,
Node >= 18, nothing to install):

```bash
node scripts/fetch-github-metrics.js
node scripts/fetch-projects-github.js
```

Notes on scope:

- Ecliptica is a commercial Steam game (app 3723390). Its page links to the
  Steam store, the Steam wishlist, the GitHub organization repository and
  the `/ecliptica` hub.
- YourTimeDelivery is a commercial product with no public repository: its
  page renders the explicit "No Public Repository" section with contact
  messaging instead of a GitHub block; no repository URL is invented.
- CheatCard and Qt-Secret are archived repositories; the GitHub block shows
  the read-only note.

Adding a project: add `src/content/projects/{slug}.md` (the schema is
validated at build), add the `projectsDetail.{slug}` and `projects.{slug}`
keys to all four language files in `src/i18n/`, add the slug/repository to
the `PROJECTS` map in `scripts/fetch-projects-github.js` (open-source
projects only), refresh the caches with the fetcher, add the URLs to
`public/sitemap.xml` and re-run the tests.

## Performance & Media

The site targets Lighthouse / PageSpeed **90+ Performance on Desktop and
Mobile** (issue #81):

- **WebP only**: all content images are committed as pre-optimized WebP.
  Responsive `srcset`/`sizes` variants are generated alongside the
  originals. Favicons and the Apple touch icon stay PNG because browsers
  require it.
- **Non-blocking media**: the LCP hero image is preloaded
  (`<link rel="preload" as="image" imagesrcset=... imagesizes=...>`) and
  marked `fetchpriority="high"`; below-the-fold images use
  `loading="lazy"`.
- **No render-blocking third-party CSS/JS**: fonts use the system font
  stack and icons are an inline SVG sprite — zero external
  stylesheet/font requests.

Every pull request runs the same checks in CI: the `lighthouse` job of
`.github/workflows/auto-tests.yml` builds the site, serves `dist/` and
audits `/` with `treosh/lighthouse-ci-action` (desktop + mobile presets
from `lighthouserc.desktop.json` / `lighthouserc.mobile.json`), failing the
build when the Performance category drops below 90.

Measure locally:

```bash
npm run build
npx http-server dist -p 8000 &
npx lighthouse http://localhost:8000/ --output=html --output-path=lh-desktop.html
npx lighthouse http://localhost:8000/ \
  --form-factor=mobile \
  --screenEmulation.isMobile=true --screenEmulation.hasTouch=true \
  --screenEmulation.deviceScaleFactor=1 --screenEmulation.width=412 \
  --screenEmulation.height=823 \
  --output=html --output-path=lh-mobile.html
```
