'use strict';

// Auto tests for the /about page (issue #73, TZ section 2.5):
// - page exists with the three required sections: studio background,
//   team competencies, B2B services
// - competencies explicitly list C++23, Qt/QML, CI/CD and
//   cross-platform deployment
// - services list outsourcing, consulting and platform porting
// - B2B CTA links to /contacts (the contacts page ships via issue #74)
// - fully translated: every data-lang key exists in all five languages
// - structural tags are balanced, scripts load in order, sitemap entry
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const PAGE = path.join(ROOT, 'about', 'index.html');
const LANGS = ['en', 'ru', 'me', 'de', 'es'];

function pageHtml() {
    assert.ok(fs.existsSync(PAGE), 'about/index.html is missing');
    return fs.readFileSync(PAGE, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
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

test('the /about page exists with a title, charset, viewport and OG tags', () => {
    const html = pageHtml();
    assert.match(html, /^\s*<!DOCTYPE html>/i, 'missing DOCTYPE');
    assert.match(html, /<html[^>]*lang="en"/i, 'html element must declare lang="en"');
    assert.match(html, /<meta[^>]+charset=["']?utf-8/i, 'missing charset meta');
    assert.match(html, /<meta[^>]+name=["']?viewport["']?/i, 'missing viewport meta');
    const m = html.match(/<title>([^<]*)<\/title>/i);
    assert.ok(m && m[1].trim(), 'missing or empty <title>');
    assert.match(html, /<meta[^>]+name=["']?description["']?[^>]*content=["'][^"']+["']/i, 'missing meta description');
    assert.match(html, /<meta[^>]+property=["']?og:url["']?[^>]*content=["']?https:\/\/quasarapp\.me\/about\/["']?/i, 'missing or wrong og:url');
});

test('the /about page has the three required TZ 2.5 sections', () => {
    const html = pageHtml();
    for (const id of ['background', 'competencies', 'services']) {
        assert.match(html, new RegExp(`<section[^>]+id="${id}"`), `missing #${id} section`);
    }
    assert.match(html, /<h1[\s>]/, 'missing <h1>');
    assert.match(html, /<nav[\s>]/i, 'missing navbar');
    assert.match(html, /<footer[\s>]/i, 'missing footer');
});

test('the studio background names QuasarApp Group d.o.o. in Bar, Montenegro (TZ 1)', () => {
    const html = pageHtml();
    assert.match(html, /QuasarApp Group d\.o\.o\./, 'missing the company name');
    assert.match(html, /Bar, Montenegro/i, 'missing the registered office location');
});

test('team competencies explicitly list C++23, Qt/QML, CI/CD and cross-platform deployment', () => {
    const html = pageHtml();
    assert.match(html, /C\+\+23/, 'C++23 missing from the page');
    assert.match(html, /Qt\/QML/, 'Qt/QML missing from the page');
    assert.match(html, /CI\/CD/, 'CI/CD missing from the page');
    assert.match(html, /cross-platform deployment/i, 'cross-platform deployment missing from the page');
});

test('the B2B services list outsourcing, consulting and platform porting', () => {
    const html = pageHtml();
    assert.match(html, /outsourcing/i, 'outsourcing service missing');
    assert.match(html, /consulting/i, 'consulting service missing');
    assert.match(html, /platform porting/i, 'platform porting service missing');
});

test('the B2B CTA links to /contacts', () => {
    const html = pageHtml();
    assert.match(html, /<a[^>]+href="\/contacts"/, 'no CTA link to /contacts');
});

test('the language switcher lists all active languages with EN selected', () => {
    const html = pageHtml();
    const selectMatch = html.match(/<select[^>]*id="lang-select"[\s\S]*?<\/select>/);
    assert.ok(selectMatch, 'no #lang-select switcher found');
    const options = [...selectMatch[0].matchAll(/<option[^>]*value="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(
        options.slice().sort(),
        LANGS.slice().sort(),
        'the switcher must list exactly the active languages'
    );
    const enOption = selectMatch[0]
        .match(/<option[^>]*>/g)
        ?.find((tag) => tag.includes('value="en"'));
    assert.ok(
        enOption && /\bselected\b/.test(enOption),
        'the EN option must be the default selection'
    );
});

test('every data-lang key used on /about exists in all five languages', () => {
    const translations = loadTranslations();
    const keys = [...pageHtml().matchAll(/data-lang="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(keys.length >= 15, `expected at least 15 data-lang keys on /about, found ${keys.length}`);
    for (const key of new Set(keys)) {
        for (const lang of LANGS) {
            const value = resolvePath(translations[lang], key);
            assert.equal(typeof value, 'string', `data-lang '${key}' does not resolve to a string in '${lang}'`);
            assert.notEqual(value.trim(), '', `data-lang '${key}' is empty in '${lang}'`);
        }
    }
});

test('scripts load in the required order: i18n -> main', () => {
    const html = pageHtml();
    const files = ['../js/i18n.js', '../js/main.js'];
    const offsets = files.map((file) => html.indexOf(`src="${file}"`));
    assert.ok(offsets.every((i) => i !== -1), 'missing script references');
    for (let i = 1; i < offsets.length; i++) {
        assert.ok(offsets[i - 1] < offsets[i], `script order violated: ${files[i - 1]} must load before ${files[i]}`);
    }
});

const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/**
 * Stack-based balance check for structural tags (same algorithm as
 * tests/html.test.js). Comments and inline script/style bodies are
 * stripped first so their content cannot confuse the parser.
 */
function findTagImbalance(source) {
    const stripped = source
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<script\b[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[\s\S]*?<\/style>/gi, '');
    const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)\/?>/g;
    const stack = [];
    for (const m of stripped.matchAll(tagRe)) {
        const tag = m[0];
        const name = m[1].toLowerCase();
        if (VOID_ELEMENTS.has(name)) continue;
        if (tag.startsWith('</')) {
            if (stack.length === 0 || stack[stack.length - 1] !== name) {
                return `unexpected closing tag </${name}> (still open: ${stack.join(', ') || 'nothing'})`;
            }
            stack.pop();
        } else if (!tag.endsWith('/>')) {
            stack.push(name);
        }
    }
    return stack.length ? `unclosed tags: ${stack.join(', ')}` : null;
}

test('all structural tags on /about are balanced', () => {
    const imbalance = findTagImbalance(pageHtml());
    assert.equal(imbalance, null, imbalance ? `tag imbalance: ${imbalance}` : 'tags are not balanced');
});

test('sitemap.xml lists the /about page', () => {
    const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
    assert.match(sitemap, /https:\/\/quasarapp\.me\/about\//, 'sitemap missing /about/');
});