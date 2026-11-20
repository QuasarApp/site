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
