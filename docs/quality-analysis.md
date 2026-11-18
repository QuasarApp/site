# Website Quality Analysis (Issue #48)

Analysis of the QuasarApp site (`quasarapp.me`) performed on branch `task_48`
as part of https://github.com/QuasarApp/site/issues/48.

Each finding below is tracked by a dedicated sub-issue (assigned to
@quasarappmanager, "Part of #48").

## Method

- Full inspection of `index.html`, `css/style.css`, `js/i18n.js`, `js/main.js`,
  `js/parallax.js` and all image assets.
- Static checks: `node --check` on all JS files, Unicode/Cyrillic scan of the
  visible text, asset-reference audit (grep across html/css/js), meta/SEO
  audit, accessibility review.

## Findings

### 1. `js/parallax.js` has a fatal SyntaxError — parallax is completely broken
https://github.com/QuasarApp/site/issues/49 (High)

- Line 4 declares `class ParallaxHandler`, line 87 re-declares it with
  `let ParallaxHandler = new ParallaxHandler();`.
- Verified with `node --check js/parallax.js`:
  `SyntaxError: Identifier 'ParallaxHandler' has already been declared`.
- The browser refuses the whole script, so **no parallax/tilt effect runs**.
- `js/i18n.js` also references `window.ParallaxHandler`, which is never a
  `window` property (top-level `let`), so the cross-script init would fail
  anyway.

### 2. Invalid contact email in the footer
https://github.com/QuasarApp/site/issues/50 (High)

- `index.html` line 213: `mailto:quasarappdevelop.gmail.com` — the domain is
  wrong; almost certainly should be `quasarappdevelop@gmail.com`.

### 3. Missing SEO / social metadata
https://github.com/QuasarApp/site/issues/51 (Medium)

- No `<meta name="description">`, no Open Graph / Twitter Card tags, no
  favicon (`/favicon.ico` 404s), no `theme-color`, no `robots.txt` /
  `sitemap.xml`.

### 4. Image assets: ~1.7 MB of dead weight, oversized logo, no lazy loading
https://github.com/QuasarApp/site/issues/52 (Medium)

- Unused (no reference anywhere): `banner.png` (519 KB),
  `ecliptica_capsula_vertical.png` (1.1 MB), `ecliptica_header.jpg` (58 KB).
- `logo.png` is 387 KB but rendered at 50×50 px.
- No `loading="lazy"`, no explicit dimensions, no WebP/AVIF variants.

### 5. Incomplete i18n
https://github.com/QuasarApp/site/issues/53 (Medium)

- Project card descriptions are hard-coded English without `data-lang`
  attributes, even though ru/de/es translations exist in `js/i18n.js`.
- Dead translation keys (`hero.subtitle/explore/learn`).
- No language persistence (`localStorage`), no browser-language detection,
  `<html lang>` never updated on switch.

### 6. Accessibility gaps
https://github.com/QuasarApp/site/issues/54 (Medium)

- Permanent `requestAnimationFrame` particle loop + parallax/tilt transforms
  ignore `prefers-reduced-motion`.
- No `<main>` landmark, no skip-to-content link.

### 7. Content typos / mixed script
https://github.com/QuasarApp/site/issues/55 (Low)

- `index.html` line 99 uses the Cyrillic letter "С" (U+0421) in "С / С++"
  inside an English sentence; "qt" should be "Qt".
- Line 127: "Wraper" → "Wrapper".

### 8. Dead code and duplicated CSS
https://github.com/QuasarApp/site/issues/56 (Low)

- `addToWishlist()` in `js/main.js` is never called (wishlist buttons are
  plain links); `.wishlist-toast` CSS only serves it.
- The 768 px `@media` block for `.nav-brand img/svg` is duplicated verbatim
  in `css/style.css` (lines 50-56 and 60-66).
- Heavy inline `style="..."` attributes in `index.html`.

### 9. No CI
https://github.com/QuasarApp/site/issues/57 (Medium)

- No `.github/workflows/` — a `node --check` step would have caught the
  parallax.js parse error; a link check + image size budget would have caught
  the dead assets.

## Sub-issue note

Native GitHub sub-issues (REST `/issues/{n}/sub_issues`) are not available on
the organization's current (Free) plan — the endpoint returns 404 on create.
All sub-issues therefore use the `Part of #48` reference convention in their
bodies, which is the supported way to express the parent/child relationship
outside Teams/Enterprise plans. If the organization upgrades its plan, the
issues can be re-linked with the native sub-issues API.
