'use strict';

// Auto tests for the deployment artifacts (issue #83, TZ 5.4):
// Dockerfile, Caddyfile, docker compose stack, CI/CD workflow and the
// documented runbook. Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function read(rel) {
    const file = path.join(ROOT, rel);
    assert.ok(fs.existsSync(file), `${rel} is missing`);
    return fs.readFileSync(file, 'utf8');
}

test('Dockerfile is multi-stage and exposes HTTP/3 (QUIC)', () => {
    const df = read('Dockerfile');
    const stages = (df.match(/^FROM /gm) || []).length;
    assert.ok(stages >= 2, `expected a multi-stage Dockerfile, found ${stages} stage(s)`);
    assert.match(df, /FROM caddy:2/, 'the web stage must be based on caddy:2');
    assert.match(df, /COPY --from=build/, 'the web stage must consume the build stage output');
    assert.match(df, /443\/udp/, 'the HTTP/3 (QUIC) port 443/udp must be exposed');
});

test('Caddyfile: Let\'s Encrypt automation, HTTP/3 kept, API proxy', () => {
    const cf = read('deploy/caddy/Caddyfile');
    assert.match(cf, /\{\$SITE_ADDRESS:localhost\}/, 'the site address must be env-driven (SITE_ADDRESS)');
    assert.match(cf, /email /, "the ACME (Let's Encrypt) account email must be configured");
    assert.match(cf, /reverse_proxy \/api\/\* api:3000/, 'the form API must be reverse-proxied');
    assert.match(cf, /file_server/, 'the static site must be served by Caddy');
    assert.match(cf, /Strict-Transport-Security/, 'the HSTS header must be set');
    assert.ok(!/^\s*protocols\s+/m.test(cf), 'do not restrict the Caddy protocols - HTTP/3 must stay enabled');
});

test('docker compose stack: web + api, QUIC port, build targets', () => {
    const yml = read('deploy/docker-compose.yml');
    assert.match(yml, /services:/);
    assert.match(yml, /^\s{2}web:/m, 'the web service is missing');
    assert.match(yml, /^\s{2}api:/m, 'the api service is missing');
    assert.match(yml, /443:443\/udp/, 'the QUIC port mapping 443:443/udp is missing');
    assert.match(yml, /target:\s*web\b/, 'the web build target is missing');
    assert.match(yml, /target:\s*api\b/, 'the api build target is missing');
});

test('deploy script updates the repo and restarts the compose stack', () => {
    const sh = read('deploy/deploy.sh');
    assert.match(sh, /set -eu/);
    assert.match(sh, /git fetch origin main/);
    assert.match(sh, /docker compose -f deploy\/docker-compose\.yml up -d --build/);
    assert.match(sh, /deploy\/\.env/, 'the deploy script must verify deploy/.env exists');
});

test('CI/CD workflow: PR gate + secret-gated deploys, no Python', () => {
    const yml = read('.github/workflows/ci-cd.yml');
    assert.match(yml, /pull_request:/, 'the workflow must run on pull_request');
    assert.match(yml, /push:/, 'the workflow must run on push');
    for (const job of ['ci:', 'docker:', 'deploy-staging:', 'deploy-production:']) {
        assert.match(yml, new RegExp(`^\\s{2}${job}$`, 'm'), `job "${job}" is missing`);
    }
    for (const secret of [
        'VPS_STAGING_HOST', 'VPS_STAGING_USER', 'VPS_STAGING_SSH_KEY',
        'VPS_PRODUCTION_HOST', 'VPS_PRODUCTION_USER', 'VPS_PRODUCTION_SSH_KEY',
    ]) {
        assert.match(yml, new RegExp(secret), `secret ${secret} is not referenced`);
    }
    assert.match(yml, /node --test/, 'the PR gate must run the auto test suite');
    assert.match(yml, /docker build/, 'the PR gate must build the docker images');
    assert.match(yml, /exit 1/, 'missing deployment secrets must fail loudly');
    for (const file of ['ci-cd.yml', 'auto-tests.yml']) {
        const content = read(`.github/workflows/${file}`);
        assert.ok(!/python/i.test(content), `${file} must not use Python`);
    }
});

test('deployment runbook is documented in README.md and AGENTS.md', () => {
    const readme = read('README.md');
    assert.match(readme, /## Deployment/, 'README.md must contain the Deployment (runbook) section');
    assert.match(readme, /Let's Encrypt/i, "the runbook must document the Let's Encrypt automation");
    assert.match(readme, /HTTP\/3/, 'the runbook must document HTTP/3');
    assert.match(readme, /VPS_STAGING_HOST/, 'the runbook must list the required repository secrets');
    const agents = read('AGENTS.md');
    assert.match(agents, /Deployment/i, 'AGENTS.md must document the deployment');
    assert.match(agents, /docker build/i, 'AGENTS.md must document the docker build command');
});
