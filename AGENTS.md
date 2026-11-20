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
  `.github/workflows/auto-tests.yml` and `.github/workflows/ci-cd.yml`
  GitHub Actions workflows.

The script load order (i18n → parallax → main) matters — keep it.

## Deployment

Dockerized deployment (issue #83, TZ 5.4) — the full runbook lives in the
`Deployment (runbook)` section of `README.md`.

- `Dockerfile` — multi-stage: `build` (assembles the static site into `/out`;
  runs `npm run build` automatically once a `package.json` exists) ->
  `web` (Caddy 2: automatic Let's Encrypt + HTTP/3 on 443/udp) and
  `api` (dependency-free Node.js form endpoint with per-IP rate limiting).
- `deploy/` — Caddyfile, docker compose stack, the remote deploy script
  (`deploy.sh`, executed on the VPS by the pipeline) and `deploy/.env.example`
  (`deploy/.env` is git-ignored).
- `.github/workflows/ci-cd.yml` — PR gate (lint, type-check, build, tests,
  docker build + smoke tests); merge to `main` deploys to staging and then
  production over SSH (secret-gated: missing `VPS_*` secrets fail loudly).

Build and smoke-test locally:

```bash
docker build -t quasarapp/site .
docker build -t quasarapp/site-api --target api .
```

The site stays dependency-free: `api/server.js` must remain a single file
using only Node.js built-ins (no `package.json` in `api/`, no npm
dependencies, no Python in the pipeline).

## Workflow

- No build: serve the repo root (e.g. `npx http-server -p 8000`) and check
  all 5 languages in a browser.
- Run the auto tests before pushing: `node --test tests/*.test.js` (the
  same suite runs on every pull request via
  `.github/workflows/auto-tests.yml`).
- Never commit or push to `main`. Work on `task_<issue-number>` from an
  up-to-date `main`, push it, and open a PR against `main` with
  `Closes #<issue-number>` in the description.
- Keep the site dependency-free (no frameworks or bundlers) and do not use
  Python. Keep changes minimal; update `README.md` and this file together
  on structural changes.
