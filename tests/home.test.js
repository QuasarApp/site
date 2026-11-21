'use strict';

// Auto tests for the home page (issue #78, TZ section 2.1):
// - featured cards for the 6 key projects link to /projects/{slug}
// - devlog feed: content collection JSON + documented empty state
// - GitHub org metrics: build-time cache JSON + fetcher script
// - js/home-data.js loads after the i18n -> parallax -> main chain
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const FEATURED_SLUGS = [
    'ecliptica',
    'cqtdeployer',
    'cheatcard',
    'yourtimedelivery',
    'qtssecret',
    'heart',
];

test('featured cards for the 6 key projects link to /projects/{slug}', () => {
    for (const slug of FEATURED_SLUGS) {
        assert.match(
            html,
            new RegExp(`href=["']?/projects/${slug}["']?`),
            `no featured card linking to /projects/${slug}`
        );
    }
});

test('the devlog content collection JSON exists and is a valid posts array', () => {
    const file = path.join(ROOT, 'data', 'devlog.json');
    assert.ok(fs.existsSync(file), 'data/devlog.json is missing');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.ok(Array.isArray(data.posts), 'data/devlog.json must contain a posts array');
    for (const post of data.posts) {
        assert.equal(typeof post.title, 'string', 'devlog post has no string title');
        assert.equal(typeof post.slug, 'string', 'devlog post has no string slug');
    }
});

test('the devlog feed keeps its documented empty state in the markup', () => {
    assert.match(html, /id=["']devlog-feed["']/, 'no #devlog-feed container');
    assert.match(html, /data-devlog-empty/, 'no explicit empty state marker');
    assert.match(html, /data-lang=["']devlog\.empty["']/, 'empty state has no translated copy');
});

test('the GitHub org metrics cache JSON is valid and non-empty', () => {
    const file = path.join(ROOT, 'data', 'github-org-metrics.json');
    assert.ok(fs.existsSync(file), 'data/github-org-metrics.json is missing (run scripts/fetch-github-metrics.js)');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(data.org, 'QuasarApp', 'metrics cache must target the QuasarApp org');
    assert.equal(typeof data.source, 'string', 'metrics cache has no source URL');
    assert.match(data.source, /^https:\/\/github\.com\/QuasarApp\/?$/, 'metrics source is not the org URL');
    assert.equal(typeof data.fetchedAt, 'string', 'metrics cache has no fetchedAt timestamp');
    assert.ok(!Number.isNaN(Date.parse(data.fetchedAt)), 'fetchedAt is not a valid date');
    assert.ok(Number.isInteger(data.repoCount) && data.repoCount > 0, 'repoCount must be a positive integer');
    assert.ok(Number.isInteger(data.totalStars) && data.totalStars >= 0, 'totalStars must be a non-negative integer');
});

test('the build-time metrics fetcher script exists and writes the cache', () => {
    const script = path.join(ROOT, 'scripts', 'fetch-github-metrics.js');
    assert.ok(fs.existsSync(script), 'scripts/fetch-github-metrics.js is missing');
    const source = fs.readFileSync(script, 'utf8');
    assert.match(source, /api\.github\.com/, 'fetcher must query the GitHub API');
    assert.match(source, /data[\\\/]github-org-metrics\.json/, 'fetcher must write the cache JSON');
});

test('js/home-data.js is loaded after the i18n -> parallax -> main chain', () => {
    const files = ['js/i18n.js', 'js/parallax.js', 'js/main.js', 'js/home-data.js'];
    const offsets = files.map((file) => html.indexOf(`src="${file}"`));
    assert.ok(offsets.every((i) => i !== -1), 'all four home page scripts must be referenced');
    for (let i = 1; i < offsets.length; i++) {
        assert.ok(
            offsets[i - 1] < offsets[i],
            `script order violated: ${files[i - 1]} must load before ${files[i]}`
        );
    }
});
