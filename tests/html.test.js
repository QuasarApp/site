'use strict';

// Auto tests for index.html structure (issue #69).
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

test('document starts with a DOCTYPE declaration', () => {
    assert.match(html, /^\s*<!DOCTYPE html>/i);
});

test('html element declares the page language', () => {
    assert.match(html, /<html[^>]*lang="[a-z]{2}(?:-[a-z]{2})?"/i);
});

test('document has a non-empty title', () => {
    const m = html.match(/<title>([^<]*)<\/title>/i);
    assert.ok(m, 'no <title> element found');
    assert.notEqual(m[1].trim(), '', 'title is empty');
});

test('document declares charset and viewport', () => {
    assert.match(html, /<meta[^>]+charset=["']?utf-8/i);
    assert.match(html, /<meta[^>]+name=["']?viewport["']?/i);
});

// The home page ships the hero, the featured projects showcase and the
// devlog feed (issue #78). The "What We Do" verticals (#verticals), the
// "Our Projects" project-card grid (#projects), the "Technology Stack &
// open-source footprint" (#stack) and the "Get in Touch" (#contact)
// sections were removed from the home page (EndrII review of PR #96):
// the studio, services and GitHub org metrics live on /about (issue #73,
// guarded by tests/about.test.js) and the contact form lives on /contacts
// (issue #74, guarded by tests/contacts.test.js).
for (const id of ['home', 'featured', 'devlog']) {
    test(`section #${id} exists`, () => {
        assert.match(html, new RegExp(`<section[^>]+id=["']${id}["']`, 'i'));
    });
}

test('home page renders the hero, featured projects and devlog feed (issue #78)', () => {
    // 1. hero with the Ecliptica featured banner
    assert.match(html, /class="ecliptica-featured"/, 'hero is missing the Ecliptica featured banner');
    // 2. featured projects showcase linking to /projects/{slug}
    assert.match(html, /id=["']featured["']/, 'featured projects section missing');
    // 3. latest news / devlog feed with a documented empty state
    assert.match(html, /id=["']devlog-feed["']/, 'devlog feed container missing');
    assert.match(html, /data-devlog-empty/, 'documented devlog empty state missing');
});

test('the removed home sections stay removed (EndrII review of PR #96)', () => {
    // "What We Do" (#verticals) and "Technology Stack & open-source
    // footprint" (#stack) duplicate the /about page; "Our Projects"
    // (#projects) duplicates the #featured showcase and the
    // /projects/{slug} pages; "Get in Touch" (#contact) duplicates the
    // /contacts page.
    for (const id of ['verticals', 'projects', 'stack', 'contact']) {
        assert.ok(
            !new RegExp(`<section\\b[^>]*id=["']${id}["']`).test(html),
            `home page still has the #${id} section`
        );
    }
    assert.ok(!/id=["']gh-repo-count["']/.test(html), 'home page still renders the GitHub repo count metric');
    assert.ok(!/id=["']gh-total-stars["']/.test(html), 'home page still renders the GitHub total stars metric');
});

test('navigation bar and footer exist', () => {
    assert.match(html, /<nav[\s>]/i);
    assert.match(html, /<footer[\s>]/i);
});

test('scripts load in the required order: i18n -> parallax -> main', () => {
    const offsets = ['js/i18n.js', 'js/parallax.js', 'js/main.js'].map(
        (file) => html.indexOf(`src="${file}"`)
    );
    assert.ok(
        offsets.every((i) => i !== -1),
        `missing script reference in index.html (offsets: ${offsets.join(', ')})`
    );
    assert.ok(
        offsets[0] < offsets[1] && offsets[1] < offsets[2],
        `wrong script load order in index.html (offsets: ${offsets.join(', ')})`
    );
});

const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/**
 * Stack-based balance check for structural tags. Comments and inline
 * script/style bodies are stripped first so their content cannot confuse
 * the parser. Returns an error message or null when balanced.
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

test('all structural tags are balanced', () => {
    const imbalance = findTagImbalance(html);
    assert.equal(imbalance, null, imbalance ? `tag imbalance: ${imbalance}` : 'tags are not balanced');
});
