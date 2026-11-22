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
parity across all five languages, local link and asset references, HTML
structure, JS/CSS syntax and repository hygiene.

Run the tests locally with Node.js (nothing to install):

```bash
node --test tests/*.test.js
```

## Home page data & GitHub metrics (issue #78)

The home page renders two data-driven sections on top of the static
markup:

- **Latest News & Devlog feed** — the latest posts (max 5, newest first,
  with date and tags) from the `data/devlog.json` content collection.
  The devlog issue (#75) seeds the collection; while it is empty the
  feed shows a documented explicit empty state.
- **Technology stack & open-source footprint** — QuasarApp GitHub org
  metrics (public repo count, total stars) from the build-time cache
  `data/github-org-metrics.json`. The numbers are fetched at build time
  from the GitHub API and committed as JSON (same pattern the
  `/projects/{slug}` detail pages use for their per-repo data). If the
  cache file is missing or unreachable at runtime, the page keeps the
  static fallback line (graceful offline fallback).

Refresh the metrics cache before pushing (no token required, Node >= 18,
nothing to install):

```bash
node scripts/fetch-github-metrics.js
```

If the GitHub API is unreachable, the script keeps the existing cache
and exits 0; without any cache it exits 1 so the build fails loudly.

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
- **Legal corporate details** — QuasarApp Group d.o.o., Željeznička 91,
  Bar, Montenegro, PIB 03602524 (values from the public registry of the
  Agency for Public Revenue of Montenegro, IRMS; flagged for human
  confirmation on the issue).

To enable direct submission once the endpoint exists, set
`CONTACT_ENDPOINT` (and optionally `TURNSTILE_SITE_KEY`) at the top of
`js/contacts.js` — no other changes are needed.

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
