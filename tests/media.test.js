'use strict';

// Media & asset performance checks (issue #81):
// - no render-blocking third-party CSS/JS (CDN stylesheets, web fonts)
// - content images served as WebP/AVIF
// - LCP hero image: fetchpriority + preload
// - responsive srcset on content images, all candidates resolvable
// - below-the-fold media lazy-loaded
// - non-blocking video patterns (IntersectionObserver + prefers-reduced-motion)
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
// Comments are stripped before content checks so explanatory notes that
// mention a removed CDN do not trip the assertions.
const htmlNoComments = html.replace(/<!--[\s\S]*?-->/g, '');
const cssFiles = fs
    .readdirSync(path.join(ROOT, 'css'))
    .filter((f) => f.endsWith('.css'))
    .map((f) => fs.readFileSync(path.join(ROOT, 'css', f), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, ''));
const jsFiles = fs
    .readdirSync(path.join(ROOT, 'js'))
    .filter((f) => f.endsWith('.js'))
    .map((f) => fs.readFileSync(path.join(ROOT, 'js', f), 'utf8'));

function imgByClass(cls) {
    const m = htmlNoComments.match(new RegExp(`<img[^>]*class="[^"]*${cls}[^"]*"[^>]*>`));
    assert.ok(m, `no <img> with class '${cls}' found in index.html`);
    return m[0];
}

test('no render-blocking third-party stylesheets or scripts', () => {
    const stylesheets = [...htmlNoComments.matchAll(/<link[^>]+rel=["']?stylesheet["']?[^>]*>/gi)]
        .map((m) => m[0]);
    assert.ok(stylesheets.length > 0, 'expected at least one local stylesheet');
    for (const tag of stylesheets) {
        assert.doesNotMatch(tag, /https?:\/\//, `third-party stylesheet found: ${tag}`);
    }
    const externalScripts = [...htmlNoComments.matchAll(/<script[^>]+src=["'](https?:[^"']+|\/\/[^"']+)["']/gi)]
        .map((m) => m[1]);
    assert.deepEqual(externalScripts, [], `third-party scripts found: ${externalScripts.join(', ')}`);
});

test('no references to removed CDNs (Google Fonts / Cloudflare / icon font)', () => {
    const banned = [
        /fonts\.googleapis\.com/i,
        /fonts\.gstatic\.com/i,
        /cdnjs\.cloudflare\.com/i,
        /font-?awesome/i,
    ];
    for (const src of [...cssFiles, ...jsFiles]) {
        for (const re of banned) {
            assert.doesNotMatch(src, re, `a source file still references ${re}`);
        }
    }
    for (const re of banned) {
        assert.doesNotMatch(htmlNoComments, re, `index.html still references ${re}`);
    }
});

// Browser-required exceptions: favicons and the Apple touch icon must stay
// PNG (WebP favicons are not supported by all browsers; Apple requires PNG).
const ICON_EXEMPT = new Set([
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
]);

test('all content images in the repository root are WebP or AVIF', () => {
    const rasterExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico'];
    let contentImages = 0;
    for (const entry of fs.readdirSync(ROOT)) {
        if (!fs.statSync(path.join(ROOT, entry)).isFile()) continue;
        const ext = path.extname(entry).toLowerCase();
        if (!rasterExts.includes(ext)) continue;
        if (ICON_EXEMPT.has(entry.toLowerCase())) continue;
        contentImages += 1;
        assert.ok(
            ext === '.webp' || ext === '.avif',
            `'${entry}' is not WebP/AVIF - complete the media migration`
        );
    }
    assert.ok(contentImages > 0, 'no content images found in the repository root');
});

test('LCP hero image uses fetchpriority="high" and is preloaded', () => {
    const hero = imgByClass('parallax-bg-img');
    assert.match(hero, /fetchpriority=["']?high/i, 'hero image must set fetchpriority="high"');
    assert.doesNotMatch(hero, /loading=["']?lazy/i, 'LCP hero image must not be lazy-loaded');
    const preload = htmlNoComments.match(/<link[^>]+rel=["']?preload["']?[^>]*as=["']?image["'][^>]*>/i);
    assert.ok(preload, 'no <link rel="preload" as="image"> found in <head>');
    const src = hero.match(/\bsrc=["']([^"']+)["']/);
    assert.ok(src, 'hero image has no src');
    assert.ok(
        preload[0].includes(src[1]),
        `preload link must reference the hero image source '${src[1]}'`
    );
});

test('content images expose responsive srcset with at least two candidates', () => {
    const classes = ['parallax-bg-img', 'ecliptica-capsule-img', 'ecliptica-logo', 'nav-logo', 'game-logo', 'ecliptica-card-bg'];
    for (const cls of classes) {
        const tag = imgByClass(cls);
        assert.match(tag, /\bsrcset="/, `img.${cls} has no srcset`);
        assert.match(tag, /\bsizes="/, `img.${cls} has no sizes`);
        const candidates = tag.match(/srcset="([^"]+)"/)[1].split(',').map((c) => c.trim()).filter(Boolean);
        assert.ok(candidates.length >= 2, `img.${cls} srcset has fewer than two candidates`);
        for (const candidate of candidates) {
            assert.match(candidate, /\s\d+w$/, `srcset candidate without width descriptor: '${candidate}'`);
        }
    }
});

test('every srcset candidate resolves to an existing file', () => {
    let candidates = 0;
    for (const m of htmlNoComments.matchAll(/<img[^>]*\bsrcset="([^"]+)"[^>]*>/gi)) {
        for (const part of m[1].split(',')) {
            const url = part.trim().split(/\s+/)[0];
            if (!url) continue;
            candidates += 1;
            assert.ok(
                fs.existsSync(path.resolve(ROOT, url)),
                `srcset candidate '${url}' does not resolve to a file`
            );
        }
    }
    assert.ok(candidates >= 6, `expected at least 6 srcset candidates, found ${candidates}`);
});

test('below-the-fold images are lazy-loaded', () => {
    for (const cls of ['ecliptica-capsule-img', 'game-logo', 'ecliptica-card-bg']) {
        assert.match(imgByClass(cls), /loading=["']?lazy/i, `img.${cls} must be lazy-loaded`);
    }
});

test('any <video> element uses non-blocking media patterns (TZ 5.2)', () => {
    const videos = [...htmlNoComments.matchAll(/<video[\s>]/gi)];
    if (videos.length === 0) {
        // The current single page has no video yet. The /ecliptica hub
        // (issue #72) must satisfy the same checks when it lands.
        return;
    }
    for (const m of videos) {
        assert.match(m[0], /\bposter=["']/, 'video must have a static poster fallback');
    }
    const js = jsFiles.join('\n');
    assert.ok(js.includes('IntersectionObserver'), 'video playback must be viewport-triggered via IntersectionObserver');
    assert.ok(js.includes('prefers-reduced-motion'), 'video must fall back to static imagery when prefers-reduced-motion is set');
});