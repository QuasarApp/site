#!/bin/sh
# QuasarApp site - remote deploy script (issue #83, TZ 5.4).
#
# Executed on the VPS by the CI/CD pipeline (deploy-staging /
# deploy-production jobs of .github/workflows/ci-cd.yml):
#   scp deploy/deploy.sh user@vps:/tmp/quasarapp-site-deploy.sh
#   ssh user@vps "SITE_DIR=/srv/site sh /tmp/quasarapp-site-deploy.sh"
#
# One-time VPS setup: README.md, "Deployment (runbook)" section.

set -eu

SITE_DIR="${SITE_DIR:-/srv/site}"
cd "$SITE_DIR"

echo "==> Updating $SITE_DIR to origin/main"
git fetch origin main
git checkout main
git reset --hard origin/main
# Remove untracked/ignored files but keep the local environment file.
git clean -fdx -e deploy/.env

if [ ! -f deploy/.env ]; then
    echo "ERROR: deploy/.env is missing. Copy deploy/.env.example to deploy/.env and set SITE_ADDRESS." >&2
    exit 1
fi

echo "==> Building and restarting the site stack"
docker compose -f deploy/docker-compose.yml up -d --build
docker image prune -f

echo "==> Deploy finished"
