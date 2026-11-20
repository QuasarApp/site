'use strict';

// Auto tests for privacy-friendly analytics + custom event tracking (issue #82).
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const analytics = require('../js/analytics.js');

const WISHLIST_URL = 'https://store.steampowered.com/wishlist/add/item?appid=3723390';

// --- The provider script (present, non-blocking) ---------------------------

function scriptTag() {
    const m = html.match(/<script\b[^>]*src=["'][^"']*plausible\.io[^"']*["'][^>]*>/i);
    assert.ok(m, 'no Plausible <script> tag found in index.html');
    return m[0];
}

test('the Plausible tracking script is present in the <head>', () => {
    const tag = scriptTag();
    assert.ok(html.indexOf(tag) < html.indexOf('</head>'), 'the analytics script must be inside <head>');
});

test('the analytics script is non-blocking (defer or async)', () => {
    assert.match(scriptTag(), /\b(defer|async)\b/, 'the script tag must carry defer or async');
});

test('the Plausible data-domain matches the CNAME domain', () => {
    const cname = fs.readFileSync(path.join(ROOT, 'CNAME'), 'utf8').trim();
    const escaped = cname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(scriptTag(), new RegExp(`data-domain=["']${escaped}["']`));
});

test('analytics.js is loaded in the body after i18n, parallax and main', () => {
    const offsets = ['js/i18n.js', 'js/parallax.js', 'js/main.js', 'js/analytics.js'].map(
        (file) => html.indexOf(`src="${file}"`)
    );
    assert.ok(offsets.every((i) => i !== -1), `missing script reference (offsets: ${offsets.join(', ')})`);
    for (let i = 1; i < offsets.length; i++) {
        assert.ok(offsets[i - 1] < offsets[i], `wrong script load order near index ${i}`);
    }
});

// --- Event naming convention ------------------------------------------------

const CONVENTION = new Set(['steam_wishlist', 'download', 'outbound', 'contact_form_submit']);

test('every data-analytics-event in index.html follows the documented convention', () => {
    const events = [...html.matchAll(/data-analytics-event=["']([^"']+)["']/g)].map((m) => m[1]);
    assert.ok(events.length >= 2, 'expected at least the two Steam wishlist CTAs to be tagged');
    for (const name of events) {
        assert.ok(CONVENTION.has(name), `unknown event name '${name}' (see README.md "Analytics")`);
    }
});

test('every Steam wishlist CTA instance is tagged as steam_wishlist', () => {
    const wishlistAnchors = [...html.matchAll(/<a\b[^>]*>/gi)]
        .map((m) => m[0])
        .filter((tag) => /href=["'][^"']*store\.steampowered\.com\/wishlist/i.test(tag));
    assert.ok(wishlistAnchors.length >= 2, 'expected at least two Steam wishlist CTAs on the page');
    for (const tag of wishlistAnchors) {
        assert.match(tag, /data-analytics-event=["']steam_wishlist["']/, `wishlist CTA is not tagged: ${tag}`);
    }
});

// --- Event resolution (custom event tracking, TZ 5.3) ------------------------

function stubElement(attrs) {
    return { getAttribute: (name) => (name in attrs ? attrs[name] : null) };
}

test('steam_wishlist click resolves with source and url props', () => {
    const el = stubElement({ 'data-analytics-event': 'steam_wishlist', 'data-analytics-source': 'hero' });
    assert.deepEqual(
        analytics.resolveClickEvent(el, WISHLIST_URL),
        { event: 'steam_wishlist', props: { source: 'hero', url: WISHLIST_URL } }
    );
});

test('download click resolves with project and url props', () => {
    const el = stubElement({ 'data-analytics-event': 'download', 'data-analytics-source': 'cqtdeployer' });
    const href = '/downloads/CQtDeployer-2.0.0-linux-x64.zip';
    assert.deepEqual(
        analytics.resolveClickEvent(el, href),
        { event: 'download', props: { project: 'cqtdeployer', url: href } }
    );
});

test('github.com links resolve to outbound without markup', () => {
    const el = stubElement({});
    const href = 'https://github.com/QuasarApp/CQtDeployer';
    assert.deepEqual(
        analytics.resolveClickEvent(el, href),
        { event: 'outbound', props: { outbound: 'github.com', url: href } }
    );
});

test('discord.com and discord.gg links resolve to outbound', () => {
    const el = stubElement({});
    for (const href of ['https://discord.com/invite/quasarapp', 'https://discord.gg/quasarapp']) {
        const r = analytics.resolveClickEvent(el, href);
        assert.ok(
            r && r.event === 'outbound' && /discord/.test(r.props.outbound),
            `${href} must be tracked as outbound (got ${JSON.stringify(r)})`
        );
    }
});

test('every github.com href in index.html resolves to the outbound event', () => {
    const hrefs = [...html.matchAll(/href=["'](https?:\/\/github\.com[^"']*)["']/gi)].map((m) => m[1]);
    assert.ok(hrefs.length >= 2, 'expected GitHub links on the page');
    const el = stubElement({});
    for (const href of hrefs) {
        const r = analytics.resolveClickEvent(el, href);
        assert.ok(r && r.event === 'outbound', `href ${href} is not tracked as outbound`);
    }
});

test('non-tracked links resolve to no event', () => {
    const el = stubElement({});
    assert.equal(analytics.resolveClickEvent(el, 'https://bsky.app/profile/quasarapp.bsky.social'), null);
    assert.equal(analytics.resolveClickEvent(el, '#projects'), null);
    assert.equal(analytics.resolveClickEvent(null, WISHLIST_URL), null);
});

test('contact form submission resolves to contact_form_submit', () => {
    const form = { tagName: 'FORM', id: 'contact-form', hasAttribute: () => false };
    assert.deepEqual(
        analytics.resolveFormEvent(form),
        { event: 'contact_form_submit', props: { form: 'contact-form' } }
    );
});

test('forms with data-analytics-form are tracked, other forms are not', () => {
    const marked = { tagName: 'FORM', id: '', hasAttribute: (n) => n === 'data-analytics-form' };
    const r = analytics.resolveFormEvent(marked);
    assert.ok(r && r.event === 'contact_form_submit', 'data-analytics-form forms must be tracked');
    assert.equal(analytics.resolveFormEvent({ tagName: 'FORM', id: 'search', hasAttribute: () => false }), null);
    assert.equal(analytics.resolveFormEvent({ tagName: 'DIV', id: 'contact-form', hasAttribute: () => false }), null);
    assert.equal(analytics.resolveFormEvent(null), null);
});

// --- Delegation wiring (end-to-end event firing) ------------------------------

function makeDocument() {
    const listeners = {};
    return {
        listeners,
        addEventListener(type, fn) {
            (listeners[type] = listeners[type] || []).push(fn);
        },
    };
}

function withPlausibleSpy(fn) {
    const calls = [];
    const original = globalThis.window;
    globalThis.window = { plausible: (event, opts) => calls.push([event, opts]) };
    try {
        fn(calls);
    } finally {
        if (original === undefined) delete globalThis.window;
        else globalThis.window = original;
    }
    return calls;
}

test('click delegation fires steam_wishlist for a tagged wishlist CTA', () => {
    const doc = makeDocument();
    analytics.wire(doc);
    const anchor = stubElement({
        href: WISHLIST_URL,
        'data-analytics-event': 'steam_wishlist',
        'data-analytics-source': 'hero',
    });
    const calls = withPlausibleSpy(() => {
        doc.listeners.click[0]({ target: { closest: (sel) => (sel === 'a[href]' ? anchor : null) } });
    });
    assert.deepEqual(calls, [[ 'steam_wishlist', { props: { source: 'hero', url: WISHLIST_URL } }]]);
});

test('click delegation fires outbound for an untagged GitHub link', () => {
    const doc = makeDocument();
    analytics.wire(doc);
    const href = 'https://github.com/QuasarApp/Heart';
    const anchor = stubElement({ href: href });
    const calls = withPlausibleSpy(() => {
        doc.listeners.click[0]({ target: { closest: (sel) => (sel === 'a[href]' ? anchor : null) } });
    });
    assert.deepEqual(calls, [[ 'outbound', { props: { outbound: 'github.com', url: href } }]]);
});

test('submit delegation fires contact_form_submit for the contact form', () => {
    const doc = makeDocument();
    analytics.wire(doc);
    const form = { tagName: 'FORM', id: 'contact-form', hasAttribute: () => false };
    const calls = withPlausibleSpy(() => {
        doc.listeners.submit[0]({ target: form });
    });
    assert.deepEqual(calls, [[ 'contact_form_submit', { props: { form: 'contact-form' } }]]);
});

test('clicks without a tracked anchor fire no event', () => {
    const doc = makeDocument();
    analytics.wire(doc);
    const calls = withPlausibleSpy(() => {
        doc.listeners.click[0]({ target: { closest: () => null } });
    });
    assert.deepEqual(calls, []);
});

test('track() is a no-op while window.plausible is not loaded yet', () => {
    const original = globalThis.window;
    globalThis.window = {};
    try {
        assert.doesNotThrow(() => analytics.track('steam_wishlist', { source: 'hero' }));
    } finally {
        if (original === undefined) delete globalThis.window;
        else globalThis.window = original;
    }
});