#!/usr/bin/env node
'use strict';

// Build-time fetcher for the QuasarApp GitHub organization metrics (issue #78).
//
// Queries the public GitHub REST API (no token required; unauthenticated
// rate limit is 60 requests/hour) and caches the result as JSON in
// data/github-org-metrics.json. The home page (js/home-data.js) renders the
// cached numbers - the same build-time cache pattern the /projects/{slug}
// detail pages (issue #77) use for their per-repo GitHub data.
//
// Usage:
//   node scripts/fetch-github-metrics.js
//
// Offline behavior (graceful fallback): if the API is unreachable, an
// existing cache file is kept and the script exits 0 so the build can ship
// the last known metrics. Without any cache file the script exits 1, which
// fails the build loudly instead of shipping empty metrics.

const fs = require('node:fs');
const path = require('node:path');

const ORG = 'QuasarApp';
const API_BASE = `https://api.github.com/orgs/${ORG}/repos`;
const OUT_FILE = path.join(__dirname, '..', 'data', 'github-org-metrics.json');
const TIMEOUT_MS = 20000;
const MAX_PAGES = 10; // safety cap: 1000 repositories
const PER_PAGE = 100;

async function fetchJson(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            signal: controller.signal,
            headers: { Accept: 'application/vnd.github+json' },
        });
        if (!res.ok) {
            throw new Error(`GitHub API returned HTTP ${res.status} for ${url}`);
        }
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

async function collectMetrics() {
    let page = 1;
    let repoCount = 0;
    let totalStars = 0;
    for (;;) {
        const repos = await fetchJson(
            `${API_BASE}?type=public&per_page=${PER_PAGE}&page=${page}`
        );
        if (!Array.isArray(repos)) {
            throw new Error('GitHub API did not return an array of repositories');
        }
        for (const repo of repos) {
            repoCount += 1;
            totalStars += Number(repo.stargazers_count) || 0;
        }
        if (repos.length < PER_PAGE || page >= MAX_PAGES) break;
        page += 1;
    }
    return { repoCount, totalStars };
}

function main() {
    collectMetrics()
        .then(({ repoCount, totalStars }) => {
            const payload = {
                org: ORG,
                source: `https://github.com/${ORG}`,
                fetchedAt: new Date().toISOString(),
                repoCount,
                totalStars,
            };
            fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
            fs.writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`);
            console.log(
                `github-org-metrics: cached ${repoCount} repos / ` +
                    `${totalStars} stars -> ${path.relative(process.cwd(), OUT_FILE)}`
            );
        })
        .catch((err) => {
            if (fs.existsSync(OUT_FILE)) {
                console.warn(
                    `github-org-metrics: GitHub API unreachable (${err.message}); ` +
                        `keeping the existing cache at ${path.relative(process.cwd(), OUT_FILE)}`
                );
                return; // graceful offline fallback: ship the last known cache
            }
            console.error(
                `github-org-metrics: GitHub API unreachable (${err.message}) ` +
                    `and no cache file exists - refusing to build with empty metrics`
            );
            process.exitCode = 1;
        });
}

main();
