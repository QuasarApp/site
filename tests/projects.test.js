'use strict';

// Auto tests for the /projects/{slug} detail pages (issue #77):
// - all six project pages exist with the required sections
// - GitHub API integration block with build-time cache values
//   (data/projects-github.json + scripts/fetch-projects-github.js)
// - Ecliptica: Steam store/wishlist buttons, /ecliptica.html hub link,
//   EclipticaPage repository note
// - YourTimeDelivery: no invented repository, explicit "no public
//   repository" messaging
// - every data-lang key used on the pages exists in all five languages
// - sitemap.xml lists the new pages
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT, 'projects');
const LANGS = ['en', 'ru', 'me', 'de', 'es'];

const SLUGS = ['ecliptica', 'cqtdeployer', 'cheatcard', 'yourtimedelivery', 'qtssecret', 'heart'];
// Open-source projects with a public QuasarApp repository. YourTimeDelivery
// is a commercial product without a public repository (do not invent one).
const OPEN_SOURCE_SLUGS = ['ecliptica', 'cqtdeployer', 'cheatcard', 'qtssecret', 'heart'];

function pageHtml(slug) {
    const file = path.join(PROJECTS_DIR, slug, 'index.html');
    assert.ok(fs.existsSync(file), `projects/${slug}/index.html is missing`);
    return fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
}

/** Load js/i18n.js inside a VM sandbox (same pattern as tests/i18n.test.js). */
function loadTranslations() {
    const code = fs.readFileSync(path.join(ROOT, 'js', 'i18n.js'), 'utf8');
    const sandbox = {
        console,
        navigator: { languages: [], language: '' },
        localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
        document: {
            addEventListener: () => {},
            querySelector: () => null,
            querySelectorAll: () => [],
            documentElement: { setAttribute: () => {}, getAttribute: () => null },
        },
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: 'js/i18n.js' });
    return vm.runInContext('translations', sandbox, { filename: 'js/i18n.js' });
}

function resolvePath(tree, dotPath) {
    let value = tree;
    for (const part of dotPath.split('.')) {
        if (value === null || typeof value !== 'object') return undefined;
        value = value[part];
    }
    return value;
}

test('all six project detail pages exist', () => {
    for (const slug of SLUGS) pageHtml(slug);
});

test('qt-secret redirects to the canonical qtssecret page', () => {
    const file = path.join(PROJECTS_DIR, 'qt-secret', 'index.html');
    assert.ok(fs.existsSync(file), 'projects/qt-secret/index.html is missing');
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /url=\/projects\/qtssecret/, 'meta refresh must target /projects/qtssecret');
    assert.match(html, /rel="canonical" href="https:\/\/quasarapp\.me\/projects\/qtssecret\/"/, 'canonical URL must point at the qtssecret page');
    assert.match(html, /noindex/, 'redirect stub must not be indexed');
});

test('every project page has the required sections, badges and a language switcher', () => {
    for (const slug of SLUGS) {
        const html = pageHtml(slug);
        for (const id of ['problem', 'value', 'features', 'stack', 'media']) {
            assert.match(html, new RegExp(`<section[^>]+id="${id}"`), `${slug}: missing #${id} section`);
        }
        assert.match(html, /<h1>/, `${slug}: missing <h1>`);
        assert.match(html, /badge-category/, `${slug}: missing category badge`);
        assert.match(html, /os-badges/, `${slug}: missing OS badges`);
        assert.match(html, /stack-tags/, `${slug}: missing technology stack tags`);
        assert.match(html, /id="lang-select"/, `${slug}: missing language switcher`);
        assert.match(html, /<footer/, `${slug}: missing footer`);
    }
});

test('open-source projects show a GitHub block with cached API values', () => {
    for (const slug of OPEN_SOURCE_SLUGS) {
        const html = pageHtml(slug);
        for (const marker of ['stars', 'release', 'updated-date', 'archived-note']) {
            assert.match(html, new RegExp(`data-project-github="${marker}"`), `${slug}: missing data-project-github="${marker}" marker`);
        }
        assert.match(html, /github\.com\/QuasarApp\//, `${slug}: missing repository URL`);
    }
});

test('YourTimeDelivery has no GitHub repository link or block', () => {
    const html = pageHtml('yourtimedelivery');
    assert.match(html, /projectsDetail\.noGithubTitle/, 'missing the "no public repository" heading');
    assert.match(html, /projectsDetail\.yourtimedelivery\.noRepo/, 'missing the no-repository contact copy');
    assert.doesNotMatch(html, /data-project-github=/, 'must not render a GitHub API block');
    assert.doesNotMatch(html, /github\.com\/QuasarApp\/YourTimeDelivery/i, 'must not reference an invented repository');
});

test('Ecliptica links to Steam (store + wishlist), the /ecliptica.html hub and documents the EclipticaPage repository', () => {
    const html = pageHtml('ecliptica');
    assert.match(html, /store\.steampowered\.com\/app\/3723390\//, 'missing the Steam store button');
    assert.match(html, /wishlist\/add\/item\?appid=3723390/, 'missing the Steam wishlist button');
    assert.match(html, /href="\/ecliptica\.html"/, 'missing the /ecliptica.html hub link (issue #79)');
    assert.match(html, /github\.com\/QuasarApp\/EclipticaPage/, 'missing the EclipticaPage repository link');
    assert.match(html, /projectsDetail\.ecliptica\.githubNote/, 'missing the note that EclipticaPage is the web page, not the game code');
});

test('project pages load i18n -> main -> projects-data in order', () => {
    for (const slug of SLUGS) {
        const html = pageHtml(slug);
        const files = ['../../js/i18n.js', '../../js/main.js', '../../js/projects-data.js'];
        const offsets = files.map((file) => html.indexOf(`src="${file}"`));
        assert.ok(offsets.every((i) => i !== -1), `${slug}: missing script references`);
        for (let i = 1; i < offsets.length; i++) {
            assert.ok(offsets[i - 1] < offsets[i], `${slug}: wrong script load order`);
        }
    }
});

test('every data-lang key used on the project pages exists in all languages', () => {
    const translations = loadTranslations();
    let keys = 0;
    for (const slug of SLUGS) {
        for (const key of new Set([...pageHtml(slug).matchAll(/data-lang="([^"]+)"/g)].map((m) => m[1]))) {
            keys += 1;
            for (const lang of LANGS) {
                const value = resolvePath(translations[lang], key);
                assert.equal(typeof value, 'string', `${slug}: data-lang '${key}' does not resolve to a string in '${lang}'`);
                assert.notEqual(value.trim(), '', `${slug}: data-lang '${key}' is empty in '${lang}'`);
            }
        }
    }
    assert.ok(keys >= 25, `expected at least 25 distinct data-lang keys across the pages, found ${keys}`);
});

test('data/projects-github.json is a valid build-time cache for the five repositories', () => {
    const file = path.join(ROOT, 'data', 'projects-github.json');
    assert.ok(fs.existsSync(file), 'data/projects-github.json is missing (run scripts/fetch-projects-github.js)');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(data.org, 'QuasarApp', 'cache must target the QuasarApp org');
    assert.ok(!Number.isNaN(Date.parse(data.fetchedAt)), 'fetchedAt is not a valid date');
    for (const slug of OPEN_SOURCE_SLUGS) {
        const entry = data.projects ? data.projects[slug] : null;
        assert.ok(entry, `cache has no entry for '${slug}'`);
        assert.match(entry.repoUrl, /^https:\/\/github\.com\/QuasarApp\//, `'${slug}' repoUrl is not a QuasarApp repository`);
        assert.ok(Number.isInteger(entry.stars) && entry.stars >= 0, `'${slug}' stars must be a non-negative integer`);
        assert.equal(typeof entry.archived, 'boolean', `'${slug}' archived must be a boolean`);
        assert.ok(
            entry.latestRelease === null || typeof entry.latestRelease === 'string',
            `'${slug}' latestRelease must be a tag string or null`
        );
    }
    assert.equal(
        data.projects ? data.projects.yourtimedelivery : undefined,
        undefined,
        'YourTimeDelivery has no public repository and must not appear in the cache'
    );
});

test('the build-time projects fetcher exists and writes the cache', () => {
    const script = path.join(ROOT, 'scripts', 'fetch-projects-github.js');
    assert.ok(fs.existsSync(script), 'scripts/fetch-projects-github.js is missing');
    const source = fs.readFileSync(script, 'utf8');
    assert.match(source, /api\.github\.com/, 'fetcher must query the GitHub API');
    assert.match(source, /data[\\/]projects-github\.json/, 'fetcher must write the cache JSON');
});

test('sitemap.xml lists all six project pages', () => {
    const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
    for (const slug of SLUGS) {
        assert.match(sitemap, new RegExp(`https://quasarapp\\.me/projects/${slug}/`), `sitemap missing /projects/${slug}/`);
    }
});