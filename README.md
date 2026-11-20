A modern, multi-language website for the QuasarApp organization showcasing our projects and services.

## About Our Project

QuasarApp is an open-source organization dedicated to creating innovative software solutions. We believe in the power of open collaboration and building tools that empower developers worldwide.

## Analytics

The site uses [Plausible](https://plausible.io) — a **privacy-friendly**
analytics provider: no cookies, no fingerprinting, no personal data, so
**no cookie banner is required**. The single tracking script is loaded in
the `<head>` of `index.html` with `defer`, which keeps it non-blocking so
analytics never delay rendering:

```html
<script defer data-domain="quasarapp.me" src="https://plausible.io/js/script.js"></script>
```

`data-domain` must match the domain added in the Plausible dashboard; it is
kept in sync with `CNAME` and enforced by `tests/analytics.test.js`. When a
new page is added, copy the snippet into its `<head>` as well (pages without
the snippet are not counted).

### Custom event naming convention (TZ 5.3)

Custom events are fired by `js/analytics.js` through `window.plausible(name,
{ props })`. **Every page must fire these same snake_case event names:**

| Event                 | Fired on                                                            | Props                       |
| --------------------- | ------------------------------------------------------------------- | --------------------------- |
| `steam_wishlist`      | Every Steam "Add to Wishlist" CTA (hero banner, project card, …)    | `source`, `url`             |
| `download`            | Binary / download link clicks                                       | `project`, `url`            |
| `outbound`            | Outbound clicks to GitHub (`github.com`) and Discord (`discord.com`, `discord.gg`) | `outbound` (host), optional `source`, `url` |
| `contact_form_submit` | Contact form submission (`<form id="contact-form">` or any form with `data-analytics-form`) | `form` |

Tag elements with these attributes (event delegation picks them up, also for
elements added later):

```html
<a href="https://store.steampowered.com/wishlist/add/item?appid=3723390"
   data-analytics-event="steam_wishlist" data-analytics-source="hero">Add to Wishlist</a>

<a href="/downloads/CQtDeployer-2.0.0-linux-x64.zip"
   data-analytics-event="download" data-analytics-source="cqtdeployer">Download</a>

<form id="contact-form">…</form>
```

GitHub and Discord links need **no markup** — any `href` to those hosts is
tracked as `outbound` automatically. `tests/analytics.test.js` verifies the
non-blocking script, the convention, and the event firing for all four event
types.

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
