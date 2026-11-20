# QuasarApp site - Dockerized deployment (issue #83, TZ 5.4)
#
# Multi-stage build:
#   build : assembles the static site output into /out
#           - runs the production build when the repository has a
#             package.json (after the Astro migration, issue #72, with the
#             output in dist/)
#           - today the repository root *is* the static site (no build step,
#             dependency-free), so the stage copies the static files directly
#   web   : Caddy 2 serving /out - automatic Let's Encrypt TLS and HTTP/3
#           (QUIC over 443/udp) out of the box; /api/* is reverse-proxied
#           to the api service (see deploy/docker-compose.yml)
#   api   : dependency-free Node.js contact form endpoint with per-IP rate
#           limiting (api/server.js)
#
# Build:
#   docker build -t quasarapp/site .                        # static site (web)
#   docker build -t quasarapp/site-api --target api .       # form API
#
# Run locally (static site, internal certificate on localhost):
#   SITE_ADDRESS=localhost docker run -d \
#     -p 80:80 -p 443:443 -p 443:443/udp quasarapp/site
#
# Full stack on the company VPS: deploy/docker-compose.yml + the
# "Deployment (runbook)" section of README.md.

# ------------------------------------------------------------- stage: build
FROM node:24-alpine AS build
WORKDIR /app

COPY . .

# Future-proofing: once the repository gains a package.json (Astro
# migration, issue #72) the production build runs in this stage.
RUN if [ -f package.json ]; then \
        if [ -f package-lock.json ]; then \
            npm ci --no-audit --no-fund; \
        else \
            npm install --no-audit --no-fund; \
        fi; \
        npm run build; \
    fi

# Assemble /out: dist/ when a build produced it, otherwise the static files
# from the repository root (current single-page architecture). CNAME is
# GitHub Pages specific and is intentionally not copied.
RUN mkdir -p /out \
    && if [ -d dist ]; then \
        cp -a dist/. /out/; \
    else \
        for f in index.html css js; do \
            [ -e "$f" ] && cp -a "$f" /out/ || true; \
        done \
        && for f in *.webp *.png *.ico *.txt *.xml; do \
            [ -e "$f" ] && cp -a "$f" /out/ || true; \
        done; \
    fi \
    && test -f /out/index.html \
    || { echo "ERROR: the build output /out has no index.html" >&2; exit 1; }

# ---------------------------------------------------------------- stage: web
FROM caddy:2-alpine AS web
#  - automatic HTTPS via Let's Encrypt (HTTP-01) when SITE_ADDRESS is a
#    public domain; an internal self-signed certificate on localhost
#  - HTTP/3 (QUIC) on 443/udp is enabled by default in Caddy 2
#  - /api/* is reverse-proxied to the api service of the compose stack
COPY --from=build /out /srv/site
COPY deploy/caddy/Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443 443/udp
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD ["sh", "-c", "wget -qO- --no-check-certificate https://localhost/ 2>/dev/null | grep -qi quasarapp || wget -qO- http://localhost/ 2>/dev/null | grep -qi quasarapp || exit 1"]

# ---------------------------------------------------------------- stage: api
FROM node:24-alpine AS api
WORKDIR /app
COPY api/ ./api/
RUN mkdir -p /data && chown -R node:node /data
ENV NODE_ENV=production PORT=3000 DATA_DIR=/data
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD ["sh", "-c", "wget -qO- http://127.0.0.1:3000/api/health | grep -q '\"ok\":true' || exit 1"]
CMD ["node", "api/server.js"]
