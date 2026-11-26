'use strict';

// Auto tests for the /projects/ catalog page (issue #76):
// - the catalog lives at projects/index.html (served as /projects/) and the
//   stale root projects.html is gone
// - the page structure: script order, the 4-category filter buttons with
//   translated labels, the documented empty state, the catalog notice
// - data/projects-catalog.json: the content collection (AC4) - valid
//   entries, every description i18n key present in all five languages,
//   every slug has a detail page and a sitemap entry
// - navigation in both directions: the home page links to the catalog and
//   the detail pages link back to it (EndrII/CI review of PR #87)
// - js/projects.js: AC2 URL-updatable filtering behavior, verified in a VM
//   sandbox with a minimal fake DOM (load ?category=..., unknown fallback,
//   click -> history.replaceState, popstate, language-change re-render)
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const CATALOG_PAGE = path.join(ROOT, 'projects', 'index.html');
const CATALOG_JSON = path.join(ROOT, 'data', 'projects-catalog.json');
const LANGS = ['en', 'ru', 'me', 'de', 'es'];
const CATEGORIES = ['games', 'developerTools', 'desktopApps', 'libraries'];
const STATUSES = ['activeDevelopment', 'released', 'beta'];
const KEY_SLUGS = ['ecliptica', 'cqtdeployer', 'cheatcard', 'yourtimedelivery', 'qtssecret', 'heart'];

function read(rel) {
    return fs.readFileSync(path.join(ROOT, rel), 'utf8');
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

const translations = loadTranslations();

test('the catalog page exists at projects/index.html and the stale root projects.html is gone', () => {
    assert.ok(fs.existsSync(CATALOG_PAGE), 'projects/index.html is missing (the /projects/ route)');
    assert.ok(!fs.existsSync(path.join(ROOT, 'projects.html')), 'projects.html must be replaced by projects/index.html (the /projects/ route)');
});

test('the catalog page loads i18n -> parallax -> main -> projects in order', () => {
    const html = read('projects/index.html');
    const files = ['../js/i18n.js', '../js/parallax.js', '../js/main.js', '../js/projects.js'];
    const offsets = files.map((file) => html.indexOf(`src="${file}"`));
    assert.ok(offsets.every((i) => i !== -1), 'all four catalog page scripts must be referenced');
    for (let i = 1; i < offsets.length; i++) {
        assert.ok(offsets[i - 1] < offsets[i], `script order violated: ${files[i - 1]} must load before ${files[i]}`);
    }
});

test('the filter buttons offer all + the four required categories with translated labels', () => {
    const html = read('projects/index.html');
    const buttons = [...html.matchAll(/<button[^>]*class="[^"]*filter-btn[^"]*"[^>]*>/g)].map((m) => m[0]);
    const filters = buttons.map((tag) => tag.match(/data-filter="([^"]+)"/)[1]);
    assert.deepEqual(
        filters.slice().sort(),
        ['all', ...CATEGORIES].slice().sort(),
        'the filter buttons must offer all + the four required categories'
    );
    for (const tag of buttons) {
        const key = tag.match(/data-lang="([^"]+)"/);
        assert.ok(key, `filter button has no translated label: ${tag}`);
        for (const lang of LANGS) {
            const value = resolvePath(translations[lang], key[1]);
            assert.equal(typeof value, 'string', `filter label '${key[1]}' does not resolve in '${lang}'`);
            assert.notEqual(value.trim(), '', `filter label '${key[1]}' is empty in '${lang}'`);
        }
    }
});

test('every data-lang key used on the catalog page exists in all five languages', () => {
    const html = read('projects/index.html');
    const keys = [...new Set([...html.matchAll(/data-lang="([^"]+)"/g)].map((m) => m[1]))];
    assert.ok(keys.length >= 10, 'expected at least 10 distinct data-lang keys on the catalog page');
    for (const key of keys) {
        for (const lang of LANGS) {
            const value = resolvePath(translations[lang], key);
            assert.equal(typeof value, 'string', `data-lang '${key}' does not resolve to a string in '${lang}'`);
            assert.notEqual(value.trim(), '', `data-lang '${key}' is empty in '${lang}'`);
        }
    }
});

test('the catalog keeps its documented empty state and the truthful content note', () => {
    const html = read('projects/index.html');
    assert.match(html, /id=["']catalog-grid["']/, 'no #catalog-grid container');
    assert.match(html, /data-catalog-empty/, 'no explicit empty state marker');
    assert.match(html, /data-lang=["']projects\.empty["']/, 'empty state has no translated copy');
    assert.match(html, /data-lang=["']catalog\.note["']/, 'the catalog notice has no translated copy');
    // The notice must not describe the nonexistent Git-based CMS workflow
    // (CI review of PR #87): the real workflow is the content collection.
    const note = resolvePath(translations.en, 'catalog.note');
    assert.match(note, /projects-catalog\.json/, 'the notice must document the content collection workflow');
    assert.doesNotMatch(note, /Git-based CMS/i, 'the notice must not describe the nonexistent Git-based CMS');
});

test('data/projects-catalog.json is a valid content collection for the six key projects (AC4)', () => {
    assert.ok(fs.existsSync(CATALOG_JSON), 'data/projects-catalog.json is missing');
    const data = JSON.parse(fs.readFileSync(CATALOG_JSON, 'utf8'));
    assert.ok(Array.isArray(data.projects), 'the collection must contain a projects array');
    const slugs = data.projects.map((p) => p.slug);
    assert.deepEqual(slugs.slice().sort(), KEY_SLUGS.slice().sort(), 'the six key projects must be present exactly once');
    for (const project of data.projects) {
        assert.equal(typeof project.title, 'string', `${project.slug}: title is not a string`);
        assert.ok(CATEGORIES.includes(project.category), `${project.slug}: unknown category '${project.category}'`);
        assert.ok(STATUSES.includes(project.status), `${project.slug}: unknown status '${project.status}'`);
        assert.equal(typeof project.icon, 'string', `${project.slug}: icon is not a string`);
        // The description follows the site i18n content model: an i18n key
        // that must resolve to a non-empty string in every active language.
        assert.equal(typeof project.descriptionKey, 'string', `${project.slug}: descriptionKey is not a string`);
        for (const lang of LANGS) {
            const value = resolvePath(translations[lang], project.descriptionKey);
            assert.equal(typeof value, 'string', `${project.slug}: '${project.descriptionKey}' does not resolve in '${lang}'`);
            assert.notEqual(value.trim(), '', `${project.slug}: '${project.descriptionKey}' is empty in '${lang}'`);
        }
        // Category and status labels must exist in every language too.
        for (const lang of LANGS) {
            assert.equal(typeof resolvePath(translations[lang], `projectsDetail.categories.${project.category}`), 'string', `${project.slug}: category label missing in '${lang}'`);
            assert.equal(typeof resolvePath(translations[lang], `projectsDetail.statuses.${project.status}`), 'string', `${project.slug}: status label missing in '${lang}'`);
        }
    }
});

test('every catalog project has a detail page and a sitemap entry', () => {
    const data = JSON.parse(fs.readFileSync(CATALOG_JSON, 'utf8'));
    const sitemap = read('sitemap.xml');
    for (const project of data.projects) {
        assert.ok(
            fs.existsSync(path.join(ROOT, 'projects', project.slug, 'index.html')),
            `catalog links to /projects/${project.slug}/ but the detail page is missing`
        );
        assert.match(
            sitemap,
            new RegExp(`https://quasarapp\\.me/projects/${project.slug}/`),
            `sitemap missing /projects/${project.slug}/`
        );
    }
});

test('the home page links to the /projects/ catalog (reachable navigation)', () => {
    const html = read('index.html');
    const link = html.match(/<a\b[^>]*href="\/projects\/"[^>]*data-lang="featured\.viewAll"[^>]*>/);
    assert.ok(link, 'the home page must link to /projects/ with the featured.viewAll label');
    for (const lang of LANGS) {
        const value = resolvePath(translations[lang], 'featured.viewAll');
        assert.equal(typeof value, 'string', 'featured.viewAll does not resolve in ' + lang);
        assert.notEqual(value.trim(), '', 'featured.viewAll is empty in ' + lang);
    }
});

test('the detail pages link back to the /projects/ catalog (both directions)', () => {
    for (const slug of KEY_SLUGS) {
        const html = read(`projects/${slug}/index.html`);
        const back = html.match(/<a\s+class="project-back"\s+href="([^"]+)"/);
        assert.ok(back, `${slug}: missing the "Back to all projects" link`);
        assert.equal(back[1], '/projects/', `${slug}: the back link must point at the /projects/ catalog, found '${back[1]}'`);
        assert.match(html, /data-lang="projectsDetail\.backToCatalog"/, `${slug}: back link has no translated label`);
    }
});

test('sitemap.xml lists the /projects/ catalog page', () => {
    assert.match(read('sitemap.xml'), /<loc>https:\/\/quasarapp\.me\/projects\/<\/loc>/, 'sitemap missing the /projects/ catalog URL');
});

test('js/projects.js ends with a trailing newline and wires up the URL-updatable filtering (AC2)', () => {
    const source = fs.readFileSync(path.join(ROOT, 'js', 'projects.js'), 'utf8');
    assert.ok(source.endsWith('\n'), 'js/projects.js is missing a trailing newline');
    assert.match(source, /URLSearchParams/, 'the filter must read ?category=... from the URL');
    assert.match(source, /history\.replaceState|history\.pushState/, 'filtering must update the URL without a reload');
    assert.match(source, /projects-catalog\.json/, 'the catalog must be driven by the content collection');
});

// --- AC2 behavior: js/projects.js in a VM sandbox with a minimal fake DOM ---

function makeEl(tag) {
    let text = '';
    const el = {
        tagName: String(tag).toUpperCase(),
        children: [],
        attributes: {},
        dataset: {},
        style: {},
        className: '',
        hidden: false,
        listeners: {},
        appendChild(child) { el.children.push(child); return child; },
        setAttribute(k, v) { el.attributes[k] = String(v); },
        getAttribute(k) { return Object.prototype.hasOwnProperty.call(el.attributes, k) ? el.attributes[k] : null; },
        removeAttribute(k) { delete el.attributes[k]; },
        addEventListener(type, fn) { (el.listeners[type] = el.listeners[type] || []).push(fn); },
        dispatchEvent(type) { (el.listeners[type] || []).forEach((fn) => fn()); },
    };
    // Real-DOM semantics: assigning textContent replaces the element content.
    Object.defineProperty(el, 'textContent', {
        get: () => text,
        set: (v) => { text = String(v); el.children.length = 0; },
    });
    const classes = new Set();
    el.classList = {
        add: (c) => classes.add(c),
        remove: (c) => classes.delete(c),
        contains: (c) => classes.has(c),
        toggle: (c, force) => {
            if (force === undefined) { if (classes.has(c)) classes.delete(c); else classes.add(c); }
            else if (force) classes.add(c);
            else classes.delete(c);
            return classes.has(c);
        },
    };
    return el;
}

/**
 * Load js/i18n.js + js/projects.js in a VM sandbox wired to a minimal fake
 * DOM built from the real projects/index.html filter buttons. Returns the
 * handles needed to drive and assert on the catalog behavior.
 */
function loadCatalog(search) {
    const collection = JSON.parse(fs.readFileSync(CATALOG_JSON, 'utf8'));
    const html = read('projects/index.html');
    const buttons = [...html.matchAll(/<button[^>]*class="[^"]*filter-btn[^"]*"[^>]*>/g)].map((m) => {
        const btn = makeEl('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = m[0].match(/data-filter="([^"]+)"/)[1];
        const active = /class="[^"]*\bactive\b/.test(m[0]);
        if (active) btn.classList.add('active');
        return btn;
    });
    const grid = makeEl('div');
    const emptyState = makeEl('div');
    emptyState.attributes['data-catalog-empty'] = '';

    const docListeners = {};
    const winListeners = {};
    const replaceStateCalls = [];
    const fetchCalls = [];
    const location = {
        href: `http://localhost/projects/${search ? `?${search}` : ''}`,
        search: search ? `?${search}` : '',
    };

    const sandbox = {
        console,
        navigator: { languages: [], language: '' },
        localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
        URLSearchParams,
        URL,
        fetch: (url) => {
            fetchCalls.push(url);
            return Promise.resolve({ ok: true, json: () => Promise.resolve(collection) });
        },
        document: {
            readyState: 'complete',
            addEventListener: (type, fn) => { (docListeners[type] = docListeners[type] || []).push(fn); },
            getElementById: (id) => (id === 'catalog-grid' ? grid : null),
            createElement: (tag) => makeEl(tag),
            createElementNS: (ns, tag) => makeEl(tag),
            querySelector: (selector) => (selector === '[data-catalog-empty]' ? emptyState : null),
            querySelectorAll: (selector) => {
                if (selector === '.filter-btn') return buttons;
                if (selector === '#catalog-grid .catalog-card') return grid.children.filter((c) => c.className.includes('catalog-card'));
                return [];
            },
            documentElement: { setAttribute: () => {}, getAttribute: () => null },
        },
    };
    sandbox.window = sandbox;
    sandbox.location = location;
    sandbox.history = { replaceState: (state, title, url) => replaceStateCalls.push(String(url)) };
    sandbox.addEventListener = (type, fn) => { (winListeners[type] = winListeners[type] || []).push(fn); };
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'i18n.js'), 'utf8'), sandbox, { filename: 'js/i18n.js' });
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'projects.js'), 'utf8'), sandbox, { filename: 'js/projects.js' });
    const translationsRef = vm.runInContext('translations', sandbox, { filename: 'js/i18n.js' });

    return {
        sandbox,
        grid,
        buttons,
        emptyState,
        replaceStateCalls,
        fetchCalls,
        location,
        translations: translationsRef,
        clickButton: (filter) => {
            const btn = buttons.find((b) => b.dataset.filter === filter);
            assert.ok(btn, `no filter button for '${filter}'`);
            btn.listeners.click.forEach((fn) => fn());
        },
        firePopstate: () => (winListeners.popstate || []).forEach((fn) => fn()),
        setLanguage: (lang) => {
            vm.runInContext(`currentLanguage = ${JSON.stringify(lang)}`, sandbox, { filename: 'test' });
            (docListeners['quasarapp:languagechange'] || []).forEach((fn) => fn());
        },
        flush: () => new Promise((resolve) => setImmediate(resolve)),
    };
}

function visibleCards(grid) {
    return grid.children.filter((c) => c.className.includes('catalog-card') && c.style.display !== 'none');
}

/** The single .catalog-card-content wrapper of a rendered card. */
function cardContent(card) {
    const content = card.children.find((c) => c.className.includes('catalog-card-content'));
    assert.ok(content, 'the card is missing its .catalog-card-content wrapper');
    return content;
}

function cardBySlug(grid, slug) {
    for (const card of grid.children) {
        if (!card.className.includes('catalog-card')) continue;
        const content = card.children[0];
        const link = content.children[content.children.length - 1];
        if (link.attributes.href === `/projects/${slug}/`) return card;
    }
    assert.fail(`no rendered card for '${slug}'`);
}

test('AC2: a known ?category= is applied on load without a full reload', async () => {
    const ctx = loadCatalog('category=games');
    await ctx.flush();
    assert.deepEqual(ctx.fetchCalls, ['../data/projects-catalog.json'], 'the catalog must fetch the content collection');
    assert.equal(ctx.grid.children.length, 6, 'all six cards must be rendered');
    const visible = visibleCards(ctx.grid);
    assert.equal(visible.length, 1, 'exactly one games card must be visible');
    assert.equal(cardBySlug(ctx.grid, 'ecliptica').style.display, '', 'the Ecliptica (games) card must be visible');
    assert.equal(cardBySlug(ctx.grid, 'heart').style.display, 'none', 'a non-games card must be hidden');
    const gamesBtn = ctx.buttons.find((b) => b.dataset.filter === 'games');
    assert.ok(gamesBtn.classList.contains('active'), 'the games filter button must be active');
    const allBtn = ctx.buttons.find((b) => b.dataset.filter === 'all');
    assert.ok(!allBtn.classList.contains('active'), 'the all filter button must not be active');
    assert.equal(ctx.emptyState.hidden, true, 'the empty state must be hidden once cards render');
});

test('AC2: an unknown ?category= falls back to "all"', async () => {
    const ctx = loadCatalog('category=bogus');
    await ctx.flush();
    assert.equal(visibleCards(ctx.grid).length, 6, 'all cards must be visible for an unknown category');
    const allBtn = ctx.buttons.find((b) => b.dataset.filter === 'all');
    assert.ok(allBtn.classList.contains('active'), 'the all filter button must be active for an unknown category');
});

test('AC2: clicking a filter updates the URL via replaceState (shareable/bookmarkable)', async () => {
    const ctx = loadCatalog('');
    await ctx.flush();
    ctx.clickButton('libraries');
    assert.equal(ctx.replaceStateCalls.length, 1, 'exactly one replaceState call expected');
    assert.match(ctx.replaceStateCalls[0], /category=libraries/, 'the URL must carry ?category=libraries');
    assert.equal(visibleCards(ctx.grid).length, 2, 'the two library cards must be visible');
    // Clicking "all" drops the parameter again.
    ctx.clickButton('all');
    assert.equal(ctx.replaceStateCalls.length, 2);
    assert.doesNotMatch(ctx.replaceStateCalls[1], /category=/, 'the all filter must drop the category parameter');
});

test('AC2: popstate re-applies the URL state (back/forward without reload)', async () => {
    const ctx = loadCatalog('');
    await ctx.flush();
    ctx.location.search = '?category=developerTools';
    ctx.location.href = 'http://localhost/projects/?category=developerTools';
    ctx.firePopstate();
    const visible = visibleCards(ctx.grid);
    assert.equal(visible.length, 1, 'exactly one developer-tools card must be visible');
    assert.equal(cardBySlug(ctx.grid, 'cqtdeployer').style.display, '', 'the CQtDeployer card must be visible');
});

test('the cards re-localize on language change (i18n content model)', async () => {
    const ctx = loadCatalog('');
    await ctx.flush();
    const heart = cardBySlug(ctx.grid, 'heart');
    const description = cardContent(heart).children.find((c) => c.className.includes('catalog-description'));
    assert.equal(description.textContent, ctx.translations.en.projects.heart, 'the EN description must render first');
    ctx.setLanguage('ru');
    await ctx.flush();
    const reRendered = cardBySlug(ctx.grid, 'heart');
    const reContent = cardContent(reRendered);
    const newDescription = reContent.children.find((c) => c.className.includes('catalog-description'));
    assert.equal(newDescription.textContent, ctx.translations.ru.projects.heart, 'the RU description must render after the language change');
    // The card title and the detail-page link must survive the re-render.
    assert.equal(reContent.children.find((c) => c.className.includes('catalog-title')).textContent, 'Heart');
    const link = reContent.children[reContent.children.length - 1];
    assert.equal(link.attributes.href, '/projects/heart/');
});
