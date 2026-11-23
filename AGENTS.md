# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Description

Static multi-page website for the QuasarApp organization. Built with
**Astro 7** (content layer, i18n routing, static output) and **Tailwind
CSS 4** (`@tailwindcss/vite`, design tokens in `@theme`). Multi-language:
English (default, unprefixed at `/`), Russian, German and Spanish under
`/ru/`, `/de/`, `/es/`. Hosted on GitHub Pages: the `main` branch root is
served at `https://quasarapp.me/` (custom domain via `CNAME`).

## Architecture

- `src/pages/` — route files. English routes live at the unprefixed root;
  the other locales are thin wrapper pages under `src/pages/[locale]/`
  whose `getStaticPaths()` emit one route per non-default locale
  (helper: `localeStaticPaths()` / `nonDefaultLocales()` from
  `src/i18n/index.ts`). Astro 7 renders non-default locales only when the
  routes exist, so keep the wrapper pages in 1:1 correspondence with the
  English routes. The locale inside a page is `Astro.currentLocale`
  (there is no `Astro.locale` in Astro 7).
- `src/components/pages/` — the page bodies (home, about, contacts, devlog,
  Ecliptica hub, projects catalog, project detail, noindex `qt-secret`
  redirect stub). Every locale route renders the same body; the body
  localizes itself via `t(Astro.currentLocale, key)`. Put new shared page
  markup here, not in the route files.
- `src/layouts/Base.astro` — unified head (canonical, Open Graph / Twitter
  card using `banner.webp`), the header with the EN/RU/DE/ES language
  switcher (options are the locale-prefixed URLs of the current page;
  the current path is stripped of its locale prefix first), the footer
  with the verified social links and the shared language-switch
  script. `src/components/` holds Header, Footer, the inline SVG icon
  sprite (Icons), ProjectActions and DevlogFeed.
- `src/i18n/` — `index.ts` (`DEFAULT_LOCALE`, `LOCALES`, `t()` dot-path
  lookup with visible fallback for missing keys, `localeHref()`, the
  static-path helpers) plus one JSON file per language (`en.json`,
  `ru.json`, `de.json`, `es.json`). When adding or changing a string,
  update all four language files together — `tests/i18n.test.js` asserts
  identical key sets and non-empty values.
- `src/content/` — the Git-based content layer (Astro content collections;
  `glob()` loaders from `astro/loaders`, `render()` from `astro:content`):
  - `projects/{slug}.md` — the 6 key project records rendered at
    `/projects/{slug}` for every locale (Ecliptica, CQtDeployer, CheatCard,
    YourTimeDelivery, Qt-Secret with the canonical slug `qtssecret` + a
    noindex `qt-secret` redirect stub, Heart).
  - `devlog/` — devlog posts for the home feed and `/devlog` (seeded by
    the devlog issue, #75; while empty the documented empty state renders
    and the build logs a harmless empty-collection warning).
  - `roadmap/` — the Ecliptica roadmap rendered on the `/ecliptica` hub.
- `src/data/` — build-time GitHub caches imported by the pages:
  - `github-org-metrics.json` — org repo count / total stars; refresh with
    `node scripts/fetch-github-metrics.js` (no token, Node >= 18).
  - `projects-github.json` — per-project stars, latest release, archived
    flag for the 5 open-source projects; refresh with
    `node scripts/fetch-projects-github.js`. YourTimeDelivery has no public
    repository and is intentionally absent — its page renders "No Public
    Repository" contact messaging; never invent a repository URL. Both
    scripts keep the existing cache and exit 0 when the GitHub API is
    unreachable (graceful offline fallback); exit 1 only without any cache.
- `src/styles/global.css` — the only stylesheet: Tailwind CSS 4 plus the
  design tokens on `@theme`.
- `public/` — static assets served as-is: pre-optimized WebP content
  images under `assets/images/` (responsive `*-480.webp` / `*-768.webp`
  variants wired via `srcset`/`sizes`; the Open Graph banner
  `banner.webp`), favicons (PNG), `robots.txt`, `sitemap.xml`.
- `scripts/` — the two dependency-free Node fetcher scripts (build-time
  tools, not loaded by the browser).
- `tests/` — dependency-free Node.js test suite run with `node --test
  tests/*.test.js`; executed on every pull request by
  `.github/workflows/auto-tests.yml` (install, lint, `astro check`,
  `astro build`, node tests, plus a Lighthouse job enforcing 90+
  Performance on Desktop and Mobile). `tests/pages.test.js` guards the
  built routes per locale; `tests/i18n.test.js` the translation parity and
  the language switcher; `tests/links.test.js` local/external links and
  image references; `tests/content.test.js` the content layer and caches;
  `tests/repo.test.js` repository hygiene; `tests/syntax.test.js` parses
  the source files.
- Media & performance (issue #81): all content images are pre-optimized
  WebP (no build step); no render-blocking third-party CSS/JS (system font
  stack, inline SVG sprite); the LCP hero image is preloaded in
  `Base.astro` (`rel="preload" as="image"`) with `fetchpriority="high"`;
  below-the-fold images use `loading="lazy"`. The LCP preload is applied
  via the `preloadHero` prop of `Base.astro` (home page only).

## Workflow

- Install once, then: `npm run dev` for local development, `npm run build`
  for the production output in `dist/`. Serve `dist/` with
  `npx http-server dist -p 8000` and check all four languages (EN/RU/DE/ES)
  in a browser.
- Run the quality gates before pushing:

  ```bash
  npm run lint       # eslint (JS/TS + .astro)
  npm run check      # astro check (TypeScript)
  npm run build      # astro build -> dist/
  npm run test:full  # build + node --test tests/*.test.js
  ```

  The pages/i18n/links tests assert on the built `dist/` pages, so a build
  must precede the test run.
- Measure performance with Lighthouse before pushing (commands in
  `README.md`, "Performance & Media"); CI fails the PR when the
  Performance category drops below 90 on Desktop or Mobile.
- Keep the site dependency-free in `tests/` and `scripts/` (Node builtins
  only). Do not use Python. Keep changes minimal; update `README.md` and
  this file together on structural changes.
- Refresh the GitHub caches (`scripts/fetch-*.js`) before pushing when
  touching the data-driven sections.
- Never commit or push to `main`. Work on `task_<issue-number>` from an
  up-to-date `main`, push it, and open a PR against `main` with
  `Closes #<issue-number>` in the description.
