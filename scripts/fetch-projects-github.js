#!/usr/bin/env node
'use strict';

// Build-time fetcher for the per-project GitHub data used by the
// /projects/{slug} detail pages (issue #77, TZ section 4).
//
// For every open-source project page, queries the public GitHub REST API
// (no token required; unauthenticated rate limit is 60 requests/hour) and
// caches the result as JSON in data/projects-github.json:
//   - latest release version (tag) + release URL, or null when the repo
//     has no public releases
//   - star count
//   - repository URL and archived flag
//
// The project pages (js/projects-data.js) render the cached values and the
// static markup bakes in the same values as the graceful offline fallback,
// so the static site is reproducible and works without network access.
//
// Usage:
//   node scripts/fetch-projects-github.js
//
// Offline behavior (graceful fallback): if the API is unreachable (or a
// repository disappeared), an existing cache file is kept and the script
// exits 0 so the build can ship the last known values. Without any cache
// file the script exits 1, which fails the build loudly instead of
// shipping empty GitHub data.
//
// YourTimeDelivery is intentionally NOT in the list: no public repository
// with that name exists in the QuasarApp org (issue #77 scope - do not
// invent repository URLs).

const fs = require('node:fs');
const path = require('node:path');

const ORG = 'QuasarApp';
const OUT_FILE = path.join(__dirname, '..', 'data', 'projects-github.json');
const TIMEOUT_MS = 20000;

/**
 * Project content slug -> GitHub repository in the QuasarApp org.
 * Ecliptica: the game is a commercial Steam title; the only public
 * Ecliptica repository in the org is EclipticaPage (the game's official
 * web page), which is what the page's GitHub block links to.
 */
const PROJECTS = {
    ecliptica: { repo: 'EclipticaPage' },
    cqtdeployer: { repo: 'CQtDeployer' },
    cheatcard: { repo: 'CheatCard' },
    qtssecret: { repo: 'Qt-Secret' },
    heart: { repo: 'Heart' },
};

async function fetchJson(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            signal: controller.signal,
            headers: { Accept: 'application/vnd.github+json' },
        });
        if (!res.ok) {
            // 404 on /releases/latest is a normal state (no public
            // releases) and is handled by the caller; anything else is an
            // API error.
            if (res.status === 404) {
                const err = new Error(`GitHub API returned HTTP 404 for ${url}`);
                err.status = 404;
                throw err;
            }
            throw new Error(`GitHub API returned HTTP ${res.status} for ${url}`);
        }
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

async function fetchProject(slug, config) {
    const repoUrl = `https://github.com/${ORG}/${config.repo}`;
    const repo = await fetchJson(`https://api.github.com/repos/${ORG}/${config.repo}`);
    const entry = {
        repo: `${ORG}/${config.repo}`,
        repoUrl,
        stars: Number(repo.stargazers_count) || 0,
        archived: Boolean(repo.archived),
        latestRelease: null,
        latestReleaseUrl: null,
    };
    try {
        const release = await fetchJson(
            `https://api.github.com/repos/${ORG}/${config.repo}/releases/latest`
        );
        entry.latestRelease = typeof release.tag_name === 'string' ? release.tag_name : null;
        entry.latestReleaseUrl = typeof release.html_url === 'string' ? release.html_url : null;
    } catch (err) {
        if (err.status !== 404) throw err;
        // No public releases - keep the nulls (a valid cached state).
    }
    console.log(
        `projects-github: ${slug} -> ${entry.repo} stars=${entry.stars} ` +
            `release=${entry.latestRelease || 'none'}` +
            (entry.archived ? ' (archived)' : '')
    );
    return entry;
}

async function collectProjects() {
    const projects = {};
    for (const [slug, config] of Object.entries(PROJECTS)) {
        projects[slug] = await fetchProject(slug, config);
    }
    return projects;
}

/**
 * Fetch all project data and write the cache. Returns the exit code the
 * process should end with (0 = ok or graceful offline fallback kept an
 * existing cache, 1 = API unreachable and no cache exists).
 */
async function main() {
    try {
        const projects = await collectProjects();
        const payload = {
            org: ORG,
            source: `https://github.com/${ORG}`,
            fetchedAt: new Date().toISOString(),
            projects,
        };
        fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
        fs.writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`);
        console.log(
            `projects-github: cached ${Object.keys(projects).length} projects -> ` +
                `${path.relative(process.cwd(), OUT_FILE)}`
        );
        return 0;
    } catch (err) {
        if (fs.existsSync(OUT_FILE)) {
            console.warn(
                `projects-github: GitHub API unreachable (${err.message}); ` +
                    `keeping the existing cache at ${path.relative(process.cwd(), OUT_FILE)}`
            );
            return 0; // graceful offline fallback: ship the last known cache
        }
        console.error(
            `projects-github: GitHub API unreachable (${err.message}) ` +
                `and no cache file exists - refusing to build with empty GitHub data`
        );
        return 1;
    }
}

module.exports = { main, PROJECTS, OUT_FILE };

if (require.main === module) {
    main().then((code) => {
        if (code !== 0) process.exitCode = code;
    });
}