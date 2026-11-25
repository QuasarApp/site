# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## Description

Static website for the QuasarApp organization (home page plus the
`/contacts` page). Pure HTML5 +
CSS3 + vanilla JS — no framework, no build step, no dependencies.
Multi-language: English (default), Russian, Montenegrin, German and
Spanish. Hosted on GitHub Pages: the `main` branch root is served at
`https://quasarapp.github.io/site/` (custom domain via `CNAME`).

## Architecture

- `index.html` — single page: navbar, hero (with Ecliptica featured
  banner), featured projects showcase (cards for the 6 key projects -
  Ecliptica links to the `/ecliptica.html` hub, issue #79, the rest to
  the `/projects/{slug}` pages, issue #77), latest news/devlog feed,
  footer with social links (home sections per issue #78 / TZ 2.1). Per
  the EndrII review of PR #96 the home page no longer duplicates the
  /about or /contacts content: the "What We Do" verticals
  section, the "Our Projects" project-card grid, the "Technology Stack &
  open-source footprint" section (the GitHub org metrics are baked into
  the /about page markup instead) and the "Get in Touch" contact section
  were removed from the home page. The navbar "Projects" entry anchors
  the #featured showcase, the "About" entry links to /about (issue #73,
  which also removed the redundant "About Us" section) and the "Contact"
  entry links to /contacts (issue #74).
- `ecliptica.html` — Ecliptica flagship hub page (issue #79): hero with
  the Steam key art ("gameplay video coming soon" caption), mechanics
  tabs, development roadmap (Steam-verified milestones), system
  requirements table (the exact Steam specs), community links (Discord,
  Reddit, Steam store page) and a media gallery of Steam screenshots
  with lightbox. The footer is copied verbatim from `index.html`. Loads
  `js/i18n.js`, `js/parallax.js` and `js/main.js`; its `data-lang` keys
  live in the nested `ecliptica` section of every language in
  `js/i18n.js` (the same key set is enforced by `tests/i18n.test.js` for
  all five languages).
- `css/style.css` — the only stylesheet; reuse the CSS design tokens on
  `:root`.
- `projects/{slug}/index.html` — project detail pages (issue #77) for the
  6 key projects: `ecliptica`, `cqtdeployer`, `cheatcard`,
  `yourtimedelivery`, `qtssecret` (canonical slug for Qt-Secret, with a
  noindex `qt-secret` redirect stub) and `heart`. Shared template: header
  + logo, category/status badges, OS badges, problem, value, features,
  tech stack tags, media/downloads, action buttons, and a GitHub block
  (stars, latest release, archived note, "updated" date) for the five
  open-source projects — YourTimeDelivery has no public repository and
  renders "No Public Repository" contact messaging instead. All copy is
  localized via `data-lang` keys under `projectsDetail.{slug}`.
- `about/index.html` — the About Us & Services page (issue #73, TZ 2.5):
  studio background (QuasarApp Group d.o.o., Bar, Montenegro), team
  competencies (C++23, Qt/QML, CI/CD, cross-platform deployment) and B2B
  services (outsourcing, consulting, platform porting) as service cards,
  plus a B2B CTA toward `/contacts` (issue #74).
  Reuses the existing `about.*` i18n copy and the cached org metrics
  (repo count, total stars); all new copy is localized via `data-lang`
  keys under `aboutPage.*`.
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
  `data/devlog.json` (latest 5 posts with date + tag). Progressive
  enhancement: the static markup keeps the documented devlog empty state
  when the JSON file is missing or unreachable (graceful offline
  fallback). Re-renders dynamic content on the
  `quasarapp:languagechange` event. The GitHub org metrics renderer was
  removed together with the home page "Technology Stack & open-source
  footprint" section (EndrII review of PR #96) — the cached values are
  baked into the /about page markup instead.
- `contacts/index.html` — the `/contacts` page (issue #74): anti-spam
  contact form (client-side validation, honeypot, optional Cloudflare
  Turnstile, loading/success/error states; graceful mailto fallback to
  `quasarappdevelop@gmail.com` with a visible notice while the
  rate-limited endpoint does not exist yet), official links block
  (GitHub, Steam, Discord, Telegram, Reddit, Bluesky, YouTube, email —
  verified URLs only). The legal information section was removed from the
  page per the EndrII review of PR #96 (guarded by
  `tests/contacts.test.js`). Loads `js/i18n.js`, `js/main.js` and
  `js/contacts.js`; shares the i18n keys from `js/i18n.js` (`contacts.*`
  namespace).
- `js/contacts.js` (contacts page only, load 3rd) — `/contacts` form
  controller: validation, honeypot, Turnstile (the third-party script is
  injected only when `TURNSTILE_SITE_KEY` is configured in the file),
  loading/success/error states and the mailto fallback. Delivery is
  configured at the top of the file (`CONTACT_ENDPOINT`,
  `TURNSTILE_SITE_KEY`); while the endpoint (Docker/CI-CD issue) is not
  deployed the form degrades gracefully.
- `js/projects-data.js` — project detail pages only (loaded after
  `js/i18n.js` and `js/main.js`): renders the GitHub block from
  `data/projects-github.json` (issue #77) and re-localizes the labels on
  `quasarapp:languagechange`. The static markup bakes in the same cached
  values as the graceful offline fallback.
- `data/github-org-metrics.json` — build-time cache of the QuasarApp
  GitHub org metrics (repo count, total stars, fetchedAt). The values
  are baked into the /about page markup (the home page no longer renders
  the metrics section, EndrII review of PR #96). Refresh with
  `node scripts/fetch-github-metrics.js` (no token needed, Node >= 18).
  If the GitHub API is unreachable, the script keeps the existing cache
  and exits 0 (graceful offline fallback); without any cache it exits 1.
- `data/projects-github.json` — build-time cache of the per-project
  GitHub data used by the `/projects/{slug}` pages (issue #77): for each
  of the five open-source projects — repo URL, stars, latest release tag
  + URL (or null), archived flag — plus `fetchedAt`. YourTimeDelivery is
  intentionally absent (no public repository; never invent one). Refresh
  with `node scripts/fetch-projects-github.js` (no token needed, Node >=
  18); same offline behavior as the org metrics fetcher (keeps the
  existing cache and exits 0, exits 1 only without any cache).
- `data/devlog.json` — devlog content collection for the home feed:
  `{"posts": [{ "slug", "title", "date", "tags": [], "type", "excerpt" }]}`.
  Generated from the Markdown posts in `devlog/posts/` by
  `scripts/build-devlog.js` (issue #75); the home page shows the explicit
  empty state only while the collection is empty.
- `devlog/` — the `/devlog` section (issue #75), a Git-based Markdown CMS:
  `devlog/posts/{slug}.md` are the single source of truth (frontmatter:
  title, date, tags, type, excerpt). `scripts/build-devlog.js` generates
  `data/devlog.json`, `devlog/index.html` (list + project-tag filter) and
  one `devlog/{slug}/index.html` per post, and syncs `sitemap.xml`.
  YouTube lines render lazy iframes; local video lines render
  non-blocking `<video poster data-src preload="none">` (the clip and its
  `-poster.webp` must be committed). `js/devlog.js` (list + post pages
  only, loads after `js/main.js`) drives the tag filter, `?tag={slug}`
  deep links and the IntersectionObserver video lazy-load; without JS
  every post stays visible. `node scripts/build-devlog.js --check` fails
  on artifact drift (run in CI via `tests/devlog.test.js`).
- `scripts/` — dependency-free Node helper scripts (the two build-time
  GitHub metrics fetchers above plus `build-devlog.js`); they are
  build-time tools and are not loaded by the browser.
- `tests/` — dependency-free Node.js test suite run with
  `node --test tests/*.test.js`; executed on every pull request by the
  `.github/workflows/auto-tests.yml` GitHub Actions workflow
  (`auto-tests` job plus a `lighthouse` job that enforces 90+ Performance
  on Desktop and Mobile, see below). `tests/home.test.js` guards the home
  sections (issue #78); `tests/projects.test.js` guards the
  `/projects/{slug}` detail pages (issue #77); `tests/about.test.js`
  guards the `/about` page (issue #73); `tests/links.test.js` scans
  every HTML page (the root pages incl. the `/ecliptica.html` hub,
  issue #79 + `/projects/{slug}` + `/about` + `/contacts` + the
  `/devlog` list and post pages, issue #75) for resolvable local
  references;
  `tests/devlog.test.js` guards the `/devlog` CMS (issue #75): manifest
  vs. Markdown parity, list/post page content, non-blocking media
  rendering, devlog i18n coverage, sitemap entries and the
  `build-devlog.js --check` drift check;
  `tests/i18n.test.js` checks key parity plus every `data-lang` key of
  all HTML pages; `tests/contacts.test.js` guards the `/contacts`
  acceptance criteria (issue #74): form validation and states,
  honeypot/Turnstile wiring, verified external links only, and that the
  legal information section stays removed (EndrII review of PR #96).
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
