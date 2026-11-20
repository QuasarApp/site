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
that runs on every pull request via the GitHub Actions workflows
(`.github/workflows/auto-tests.yml` and `.github/workflows/ci-cd.yml`). The
tests cover i18n key parity across all five languages, local link and asset
references, HTML structure, JS/CSS syntax, repository hygiene, the contact
form endpoint (`api/server.js`) and the deployment artifacts (Dockerfile,
Caddyfile, compose stack, CI/CD workflow).

Run the tests locally with Node.js (nothing to install):

```bash
node --test tests/*.test.js
```

## Deployment (runbook)

Dockerized deployment per TZ section 5.4 (issue #83): the static site is
served by **Caddy 2** with **HTTP/3 (QUIC)** and **automated Let's Encrypt**
TLS, and a dependency-free **form endpoint** handles contact submissions
with per-IP rate limiting. The stack is a Docker Compose setup deployed to
the company VPS by the CI/CD pipeline.

### Architecture

| Component | Image (Dockerfile target) | Role |
|---|---|---|
| `web` | `web` (caddy:2) | Serves the static build assembled by the `build` stage; automatic Let's Encrypt (HTTP-01) and HTTP/3 on 443/udp; reverse-proxies `/api/*` to `api` |
| `api` | `api` (node:24-alpine) | Contact form endpoint (`api/server.js`) with per-IP rate limiting; no published ports - reachable only through `web` |

The Dockerfile is multi-stage: the `build` stage assembles the static output
into `/out` (it runs `npm run build` automatically once the repository gains
a `package.json` with the Astro migration, issue #72), and the `web`/`api`
stages copy only the built output.

### Local development

```bash
# Static site in Docker (Caddy, internal certificate on localhost):
docker build -t quasarapp/site .
SITE_ADDRESS=localhost docker run -d -p 80:80 -p 443:443 -p 443:443/udp quasarapp/site
# -> https://localhost/ (self-signed certificate; http://localhost/
#    redirects to HTTPS)

# Form endpoint on its own:
docker build -t quasarapp/site-api --target api .
docker run -d -p 3000:3000 quasarapp/site-api
# -> curl http://localhost:3000/api/health
```

### One-time VPS setup

Prerequisites: a VPS with Docker + the compose plugin, a DNS `A`/`AAAA`
record for the site domain (e.g. `quasarapp.me`) pointing at it, and ports
80, 443 and 443/udp open (80 for TLS + the Let's Encrypt challenge, 443 for
HTTPS, 443/udp for HTTP/3).

```bash
sudo useradd -m -s /bin/bash deploy            # or reuse an existing user
sudo mkdir -p /srv/site
sudo git clone https://github.com/QuasarApp/site.git /srv/site
sudo -u deploy cp /srv/site/deploy/.env.example /srv/site/deploy/.env
sudo -u deploy nano /srv/site/deploy/.env      # set SITE_ADDRESS to the domain
sudo chown -R deploy:deploy /srv/site
```

The `deploy` user needs read access to the repository (HTTPS token or a
repository deploy key). `deploy/.env` holds `SITE_ADDRESS`, `ACME_EMAIL` and
the form rate-limit settings (see `deploy/.env.example`); it is git-ignored
and must never be committed.

### Required repository secrets

| Secret | Used by | Meaning |
|---|---|---|
| `VPS_STAGING_HOST` | `deploy-staging` | Staging VPS host (IP or FQDN) |
| `VPS_STAGING_USER` | `deploy-staging` | SSH user on the staging VPS |
| `VPS_STAGING_SSH_KEY` | `deploy-staging` | Private SSH key for the staging VPS |
| `VPS_PRODUCTION_HOST` | `deploy-production` | Production VPS host (IP or FQDN) |
| `VPS_PRODUCTION_USER` | `deploy-production` | SSH user on the production VPS |
| `VPS_PRODUCTION_SSH_KEY` | `deploy-production` | Private SSH key for the production VPS |

### CI/CD pipeline (`.github/workflows/ci-cd.yml`)

* **Every pull request** - lint (`node --check` on all JavaScript),
  type-check (runs once a `tsconfig.json` exists), the production build (runs
  once a `package.json` exists), the full auto test suite, and a Docker build
  with smoke tests of both images (the web image must serve the built site,
  the api image must answer `/api/health`).
* **Merge to `main`** - `deploy-staging` then `deploy-production`: the
  pipeline copies `deploy/deploy.sh` to the VPS, checks out `main` in
  `/srv/site` and runs `docker compose up -d --build`.
* **Missing secrets fail loudly** - when a `VPS_*` secret is not set the
  deployment job fails with a clear error message instead of skipping.
* **Staging path** - until the VPS staging host is live, GitHub Pages (the
  existing `CNAME` setup) remains the low-cost staging mirror: every merge
  to `main` is rebuilt and published automatically there.
* No Python is used anywhere in the pipeline.

### Form endpoint (contacts, TZ 5.4)

`POST /api/contact` (JSON `{name, email, message, website?}`):

* validates the fields (400), rejects oversized payloads (413),
* drops honeypot submissions silently (a bot-filled `website` field),
* rate-limits per client IP (default 5 submissions / 10 minutes, configured
  via `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MINUTES` in `deploy/.env`) with
  429 responses,
* persists accepted submissions as JSON lines in the `api-data` volume
  (`messages.jsonl`) and logs them to stdout - a mail transport can be
  attached later without changing the API contract.

`GET /api/health` answers the container healthcheck.

### Verification

* HTTP/2: `curl -I https://quasarapp.me/` (response protocol line)
* HTTP/3: `curl --http3 -I https://quasarapp.me/` (QUIC over 443/udp)
* TLS: `openssl s_client -connect quasarapp.me:443 -alpn h3`
* Let's Encrypt automation and renewal are logged by Caddy in the container
  log: `docker logs <web container>`

### Rollback

```bash
# On the VPS (or trigger the pipeline from a previous commit/tag):
cd /srv/site
git checkout <previous-commit> && git reset --hard
docker compose -f deploy/docker-compose.yml up -d --build
```

