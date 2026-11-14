# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository.
Read this file before making any change. Keep it updated when the structure changes.

## Description

This repository is the **QuasarApp Group website** — a static, single-page
website for the QuasarApp organization. It showcases the group's projects
(QuasarApp, Platforms, OpenSimplex2, Quasar Framework) and provides
contact links.

Key facts:

- **Pure static site**: HTML5 + CSS3 + vanilla JavaScript (ES6+). No
  framework, no build step, no `package.json`, no dependencies to install.
- **Multi-language**: English (default, baked into the HTML markup),
  Russian, German and Spanish via a small custom i18n layer.
- **Design**: dark Material + sci-fi aesthetic — glowing gradients,
  parallax scroll effects, 3D card tilt, floating particles.
- **Hosting**: GitHub Pages. Any push to `main` redeploys the whole
  repository root to `https://quasarapp.github.io/site/`
  (see `.github/workflows/pages.yml` and `.github/PAGES.md`).

Because there is no build or test suite, correctness is verified by
serving the site locally and inspecting the result in a browser.

## Architecture

### Repository layout

```
site/
├── index.html                 # Single page: all sections and markup
├── css/
│   └── style.css              # The only stylesheet (design system + layout)
├── js/
│   ├── i18n.js                # Translations + language switching (load 1st)
│   ├── parallax.js            # ParallaxHandler class (load 2nd)
│   └── main.js                # Scroll animations, card tilt, particles (load 3rd)
├── .github/
│   ├── PAGES.md               # GitHub Pages deployment notes
│   └── workflows/pages.yml    # Deploy workflow (push to main / workflow_dispatch)
├── README.md
└── AGENTS.md                  # This file
```

### `index.html`

One page, composed of sections, in this order:

1. `nav.navbar` — fixed top navigation (brand, anchor links, language button).
2. `section#home.hero-section` — hero with parallax background and CTA buttons.
3. `section#projects` — grid of 4 project cards (`.project-card.parallax-card`,
   one per project, each linking to its GitHub repository).
4. `section#about` — about text plus 3 stat counters (`.stat-item`).
5. `section#contact` — GitHub / Twitter / email links.
6. `footer` — copyright line.

External assets (keep the `<link>`/`<script>` tags in `<head>` and at the end
of `<body>`):

- Google Fonts (Roboto 300–900)
- Font Awesome 6.4.0 (icons)
- `js/i18n.js`, `js/parallax.js`, `js/main.js` — **this load order matters**:
  `i18n.js` reads `window.ParallaxHandler` on `DOMContentLoaded` to start
  parallax, and `main.js` relies on both being present.

### Internationalization (`js/i18n.js`)

- The `translations` object contains full copies of every user-facing string
  for `ru`, `de` and `es`. **English is the default**: it lives directly in
  the HTML markup, not in `translations`.
- Any translatable element carries a dot-path key, e.g.
  `<p data-lang="projects.quasarapp.desc">`. `updateTranslations()` resolves
  the key against `translations[currentLanguage]` and replaces `textContent`.
- `toggleLanguage()` cycles `en → ru → de → es → …` and updates the
  `.lang-btn` label.

**Rule**: when adding, moving or renaming any translatable string, you must
update the `data-lang` key in `index.html` *and* add the identical key to all
three non-English blocks in `i18n.js` (`ru`, `de`, `es`). A missing key is
silently ignored — the element keeps its English text, so the UI looks fine
until someone switches language.

### Parallax (`js/parallax.js`)

- `ParallaxHandler` class: `init()` binds a scroll listener (throttled with
  `requestAnimationFrame`) that translates `.parallax-card`, `.parallax-text`
  and `.about-section` elements; `addMouseParallax()` adds mouse-driven 3D
  tilt on `.hero-section`.
- A module-level instance is created and (re)initialized on `DOMContentLoaded`;
  `i18n.js` also calls `window.ParallaxHandler.init()` — keep the class global.

### Effects (`js/main.js`)

- `IntersectionObserver` adds the `.animate-in` class (keyframes are injected
  at runtime) to `.stat-item` and `.project-card` when they enter the viewport.
- `mousemove` tilt (CSS `perspective`/`rotateX`/`rotateY`) on `.project-card`.
- 20 floating particle divs animated with `requestAnimationFrame`.

### Styling (`css/style.css`)

- All visual design lives in one stylesheet. Design tokens are CSS custom
  properties on `:root` (`--primary-color`, `--dark-bg`, `--card-bg`,
  `--glow-color`, `--gradient-1`, …). Reuse these tokens instead of hard-coding
  new colors.
- Layout is CSS Grid (project cards) + Flexbox (navbar, sections), with
  `backdrop-filter` blur on the navbar and gradient text for headings.

## Workflow

### Local development

There is no build. Serve the repository root with any static file server,
e.g.:

```bash
npx http-server -p 8000   # then open http://localhost:8000
```

Verify every change in a browser: check all 4 languages (click the globe
button), the parallax/tilt animations, and the responsive layout.

### Branching & pull requests

- Never commit to or push to `main`. Direct pushes to the base branch are
  forbidden, and no force-push / history rewrite on task branches.
- Work on a dedicated branch named `task_<issue-number>`, created from
  `main` (run `git pull` first; branch strictly from an up-to-date `main`).
- Commit with a clear message describing the change.
- Push the task branch and open a pull request against `main` with
  `gh pr create --base main --head task_<issue-number>`, including
  `Closes #<issue-number>` in the PR description so the issue auto-closes on
  merge.
- Track issue state with labels: `in-progress` while working,
  `waiting-for-review` once the PR is open, `blocked` / `help-wanted` on
  failure, `needs-clarification` when the task is ambiguous.

### Deployment

- Merging into `main` is the only deployment trigger: the `GitHub Pages`
  workflow (`.github/workflows/pages.yml`) uploads the repository root and
  deploys it to the `github-pages` environment. `workflow_dispatch` allows a
  manual redeploy.
- Everything at the repository root is published, so keep the repo free of
  build artifacts, local files and anything that should not be public.
  `.gitignore` already excludes IDE/OS/dependency noise.

### Constraints

- **Vanilla web only**: do not introduce frameworks (Vue/React/etc.),
  bundlers, package managers, or a build pipeline — the site must stay
  dependency-free and statically deployable from the repo root.
- **No Python**: do not write, run or suggest Python scripts for this repo.
- Keep changes minimal and reviewable: no unrelated refactors in the same PR.
- Preserve the i18n contract (see above) and the script load order in
  `index.html`.
- After any structural change (new section, file, or script), update
  `README.md` and this `AGENTS.md` in the same pull request.

