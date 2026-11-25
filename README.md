A modern, multi-language website for the QuasarApp organization showcasing our projects and services.

## About Our Project

QuasarApp is an open-source organization dedicated to creating innovative software solutions. We believe in the power of open collaboration and building tools that empower developers worldwide.

## Development

To test locally:

```bash
cd /path/to/site
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser and check all five
languages (EN/RU/ME/DE/ES) with the language switcher in the navbar.

## Testing

The repository includes a dependency-free automated test suite in `tests/`
that runs on every pull request via the `Auto Tests (PR)` GitHub Actions
workflow (`.github/workflows/auto-tests.yml`). The tests cover i18n key
parity across all five languages, local link and asset references (home
page and every `/projects/{slug}` page), HTML structure, the project
detail pages (sections, GitHub cache block, per-page i18n coverage,
sitemap entries), JS/CSS syntax and repository hygiene.

Run the tests locally with Node.js (nothing to install):

```bash
node --test tests/*.test.js
```

## Home page data & GitHub metrics (issue #78)

The home page renders one data-driven section on top of the static
markup:

- **Latest News & Devlog feed** — the latest posts (max 5, newest first,
  with date and tags) from the `data/devlog.json` content collection,
  which is generated from the Markdown posts in `devlog/posts/` by
  `scripts/build-devlog.js` (see "Devlog (issue #75)" below). While the
  collection is empty the feed shows a documented explicit empty state.

The former **Technology stack & open-source footprint** section was
removed from the home page (EndrII review of PR #96, together with the
"What We Do", "Our Projects" and "Get in Touch" sections): the QuasarApp
GitHub org metrics (public repo count, total stars) now live on the
`/about` page, where the cached values from `data/github-org-metrics.json`
are baked into the markup, and `js/home-data.js` no longer fetches the
metrics cache on `/`.

Refresh the metrics cache before pushing (no token required, Node >= 18,
nothing to install):

```bash
node scripts/fetch-github-metrics.js
```

If the GitHub API is unreachable, the script keeps the existing cache
and exits 0; without any cache it exits 1 so the build fails loudly.

## Devlog (issue #75)

The `/devlog` section is a Git-based Markdown CMS. Posts are plain
Markdown files in `devlog/posts/` with a small frontmatter block:

```markdown
---
title: Your post title
date: 2026-12-01          # YYYY-MM-DD, required
tags: ecliptica            # comma-separated project tags (e.g. "ecliptica, cqtdeployer")
type: devlog               # devlog | patch-notes | engine-insight
excerpt: One-line summary used on the list page and the home feed.
---

Post body (Markdown subset: headings, lists, code, blockquotes, links,
images and videos).
```

Run the generator after adding or editing a post (Node >= 18, no
dependencies):

```bash
node scripts/build-devlog.js
```

It (re)generates, in deterministic order:

- `data/devlog.json` — the manifest consumed by the home page feed
  (`js/home-data.js`);
- `devlog/index.html` — the list page (newest first, project-tag filter);
- `devlog/{slug}/index.html` — one static page per post;
- `sitemap.xml` — devlog entries are synced in place.

`node scripts/build-devlog.js --check` re-runs the generation in memory
and exits non-zero when the committed artifacts drift from the Markdown
sources (the same check runs in CI via `tests/devlog.test.js`).

Media rules:

- **YouTube** — embed with a normal image-style line whose URL is a
  `youtube.com` / `youtu.be` link; the generator renders a lazy,
  privacy-friendly `<iframe>` (the video IDs must be verified via
  oEmbed before use).
- **Local video** — `![caption](/assets/devlog/videos/{name}.mp4)` (or
  `.webm`). The clip **and** its static poster `{name}-poster.webp` must
  be committed next to it; the build fails if either is missing. The
  rendered `<video>` keeps the poster, sets `preload="none"` and defers
  the real source to `data-src` (attached by `js/devlog.js` via
  IntersectionObserver), so posts stay non-blocking for Lighthouse.
- **Images** — reference committed files under `assets/`; remote images
  are rejected by the generator.

Browsing: `devlog/index.html` lists every post with the project-tag
filter buttons; `js/devlog.js` handles filtering client-side, `?tag={slug}`
deep links (the Ecliptica hub links to `/devlog/?tag=ecliptica`) and
lazy-loads local videos. Without JavaScript every post stays visible.

## Contacts page (issue #74)

`/contacts` (`contacts/index.html`) provides:

- **Anti-spam contact form** — client-side validation (name, email,
  message), a hidden honeypot field for bots and an optional Cloudflare
  Turnstile challenge (the third-party script is injected only when a
  site key is configured). The form shows loading/success/error states.
- **Graceful mailto fallback** — the site is static, so submissions are
  meant to go to a rate-limited endpoint deployed by the Docker/CI-CD
  issue. Until `CONTACT_ENDPOINT` in `js/contacts.js` is set, the form
  shows a visible notice and submitting opens the visitor's email client
  with the message pre-filled to `quasarappdevelop@gmail.com`.
- **Official links block** — GitHub, Steam, Discord, Telegram, Reddit,
  Bluesky, YouTube and email. Discord/Telegram/Reddit are the official
  community links published on the Ecliptica Steam store page;
  `tests/contacts.test.js` enforces the verified-URL allow-list so no
  invented links can land.

Note: the legal information section was removed from the page per the
EndrII review of PR #96; `tests/contacts.test.js` guards that it stays
removed.

To enable direct submission once the endpoint exists, set
`CONTACT_ENDPOINT` (and optionally `TURNSTILE_SITE_KEY`) at the top of
`js/contacts.js` — no other changes are needed.
## Project detail pages (issue #77)

Each key project has a detail page at `projects/{slug}/index.html`:
`/projects/ecliptica`, `/projects/cqtdeployer`, `/projects/cheatcard`,
`/projects/yourtimedelivery`, `/projects/qtssecret` (plus a noindex
`/projects/qt-secret` redirect stub to the canonical slug) and
`/projects/heart`. All pages share one template: header with logo,
category and status badges, OS badges, problem statement, value
proposition, feature list, technology stack tags, a media & downloads
section, action buttons (Steam store + wishlist for Ecliptica,
release downloads, documentation, contact) and — for the five
open-source projects — a GitHub block showing stars, the latest
release, an archived-repository note and the build-time "updated" date.

The GitHub block is a progressive enhancement over static markup: the
values baked into the HTML are the build-time cache
`data/projects-github.json`, and `js/projects-data.js` (loaded after
`js/i18n.js` and `js/main.js`, on project pages only) re-renders them
from the JSON at runtime and re-localizes the labels on language
change. When the JSON is missing or unreachable, the baked-in values
keep the page correct and readable (graceful offline fallback).

Notes on scope:

- Ecliptica is a commercial Steam game (app 3723390). Its GitHub block
  links to `QuasarApp/EclipticaPage` — the game's official web page, not
  the game code — and the page links to the Steam store, the Steam
  wishlist and the `/ecliptica` hub (issue #72).
- YourTimeDelivery is a commercial product with no public repository.
  Its page renders an explicit "No Public Repository" section with
  contact messaging instead of a GitHub block; no repository URL is
  invented.
- CheatCard and Qt-Secret are archived repositories; the GitHub block
  shows the read-only note (statically and via the cache).

Refresh the per-project cache before pushing (no token required,
Node >= 18, nothing to install):

```bash
node scripts/fetch-projects-github.js
```

Offline behavior matches the org metrics fetcher: the existing cache is
kept and the script exits 0 when the GitHub API is unreachable; without
any cache it exits 1.

Adding a seventh project: copy an existing `projects/{slug}/index.html`
as the new content file, add the `projectsDetail.{slug}` keys to all
five language blocks in `js/i18n.js`, add the slug/repository to the
`PROJECTS` map in `scripts/fetch-projects-github.js`, refresh the cache
with the fetcher, add the URL to `sitemap.xml` and re-run the tests.

## About page (issue #73)

`about/index.html` is the About Us & Services page at `/about`
(TZ section 2.5), rendered statically with the same dark design system:

- **Studio background** (`#background`) — QuasarApp Group d.o.o., a
  high-tech software and game development studio in Bar, Montenegro,
  specializing in C++/Qt/QML, cross-platform solutions and 3D engines.
  Reuses the existing `about.*` i18n copy (title, lead, mission, team)
  and shows the cached GitHub org metrics (repo count, total stars)
  from `data/github-org-metrics.json` baked into the markup.
- **Team competencies** (`#competencies`) — C++23, Qt/QML, CI/CD and
  cross-platform deployment as four competency cards.
- **B2B services** (`#services`) — outsourcing, consulting and platform
  porting as service cards, with a CTA panel linking to `/contacts`
  (issue #74).

All copy is localized via `data-lang` keys under `aboutPage.*` (plus the
reused `about.*`/`stack.*`/`nav.*`/`footer.*` keys) in all five active
languages. `tests/about.test.js` guards the page (sections, required
competencies/services, `/contacts` CTA, per-page i18n coverage, script
order, tag balance, sitemap entry).

The redundant "About Us" section was removed from the home page
(`index.html`): the navbar "About" entry is the home page link to
`/about`, and `tests/home.test.js` guards both the link and the absence
of the duplicated copy (EndrII review of PR #97).

## Performance & Media (issue #81)

The site targets Lighthouse / PageSpeed **90+ Performance on Desktop and
Mobile**. Current measured scores (Lighthouse, local server, 2026-11-20):

| Page | Desktop | Mobile |
| ---- | ------- | ------ |
| `/`  | 99      | 100    |

How the targets are met:

- **WebP only**: all content images are committed as pre-optimized WebP
  (no build step, no dependencies). Responsive `srcset`/`sizes` variants are
  generated alongside the originals (e.g. `ecliptica_background-480.webp`,
  `ecliptica_background-768.webp`). Favicons and the Apple touch icon stay
  PNG because browsers require it.
- **Non-blocking media**: the LCP hero image is preloaded
  (`<link rel="preload" as="image" imagesrcset=... imagesizes=...>`) and
  marked `fetchpriority="high"`; below-the-fold images use
  `loading="lazy"`.
- **No render-blocking third-party CSS/JS**: fonts use the system font
  stack and icons are an inline SVG sprite (Feather + Simple Icons paths)
  in `index.html` — zero external stylesheet/font requests.

Measure locally (no Python, no repo dependencies — `npx` only):

```bash
npx http-server -p 8000 &        # serve the repo root
npx lighthouse http://localhost:8000/ --output=html --output-path=lh-desktop.html
npx lighthouse http://localhost:8000/ \
  --form-factor=mobile \
  --screenEmulation.isMobile=true --screenEmulation.hasTouch=true \
  --screenEmulation.deviceScaleFactor=1 --screenEmulation.width=412 \
  --screenEmulation.height=823 \
  --output=html --output-path=lh-mobile.html
```

Every pull request runs the same checks in CI: the `lighthouse` job of
`.github/workflows/auto-tests.yml` serves the repo root, audits `/` with
`treosh/lighthouse-ci-action` (desktop + mobile presets from
`lighthouserc.desktop.json` / `lighthouserc.mobile.json`) and fails the
build when the Performance category drops below 90.

`tests/media.test.js` guards the media strategy in the regular test suite:
WebP-only content images, srcset coverage + resolvable candidates,
fetchpriority/preload for the LCP image, lazy-loading of below-the-fold
media, and the non-blocking `<video>` contract (IntersectionObserver +
`prefers-reduced-motion`) that the `/ecliptica` hub must satisfy.
