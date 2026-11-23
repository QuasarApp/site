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

test('all content images in the repository root and assets/images are WebP or AVIF', () => {
    const rasterExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico'];
    let contentImages = 0;
    const dirsToCheck = [ROOT, path.join(ROOT, 'assets', 'images')];
    
    for (const dir of dirsToCheck) {
        if (!fs.existsSync(dir)) continue;
        for (const entry of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, entry);
            if (!fs.statSync(fullPath).isFile()) continue;
            const ext = path.extname(entry).toLowerCase();
            if (!rasterExts.includes(ext)) continue;
            
            // Skip favicons in root
            if (dir === ROOT && ICON_EXEMPT.has(entry.toLowerCase())) continue;
            
            contentImages += 1;
            assert.ok(
                ext === '.webp' || ext === '.avif',
                `Image '${entry}' in ${path.basename(dir)} is not WebP/AVIF - complete the media migration`
            );
        }
    }
    // After the image migration to assets/images/, the root should only contain favicons.
    // This assertion verifies that all content images across the site are WebP/AVIF.
    // The assertion includes the count to ensure the check is not vacuous after migration.
    assert.ok(contentImages > 0, `expected at least one WebP/AVIF content image (found ${contentImages})`);
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
    // The Ecliptica featured card ships the game-logo / ecliptica-card-bg
    // images (issue #79 hub card); the project detail pages (issue #77)
    // are covered by the tests below.
    const classes = ['parallax-bg-img', 'ecliptica-capsule-img', 'ecliptica-logo', 'nav-logo'];
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
    // Scan every HTML page of the site (home + /projects/{slug}); srcset
    // candidates are resolved relative to the page that references them.
    const htmlFiles = [path.join(ROOT, 'index.html')];
    const projectsDir = path.join(ROOT, 'projects');
    if (fs.existsSync(projectsDir)) {
        for (const slug of fs.readdirSync(projectsDir).sort()) {
            const page = path.join(projectsDir, slug, 'index.html');
            if (fs.existsSync(page)) htmlFiles.push(page);
        }
    }
    let candidates = 0;
    for (const file of htmlFiles) {
        const page = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
        for (const m of page.matchAll(/<img[^>]*\bsrcset="([^"]+)"[^>]*>/gi)) {
            for (const part of m[1].split(',')) {
                const url = part.trim().split(/\s+/)[0];
                if (!url) continue;
                candidates += 1;
                const resolved = path.resolve(path.dirname(file), url);
                assert.ok(
                    fs.existsSync(resolved),
                    `srcset candidate '${url}' in ${path.relative(ROOT, file)} does not resolve to a file`
                );
            }
        }
    }
    assert.ok(candidates >= 6, `expected at least 6 srcset candidates, found ${candidates}`);
});

test('below-the-fold images are lazy-loaded', () => {
    for (const cls of ['ecliptica-capsule-img']) {
        assert.match(imgByClass(cls), /loading=["']?lazy/i, `img.${cls} must be lazy-loaded`);
    }
});

test('project detail pages: below-the-fold images are lazy-loaded WebP with responsive srcset (issue #77)', () => {
    const projectsDir = path.join(ROOT, 'projects');
    const pages = fs.existsSync(projectsDir)
        ? fs.readdirSync(projectsDir)
            .map((slug) => path.join(projectsDir, slug, 'index.html'))
            .filter((f) => fs.existsSync(f))
        : [];
    assert.ok(pages.length >= 6, 'expected at least six project detail pages');
    let checked = 0;
    for (const file of pages) {
        const rel = path.relative(ROOT, file);
        const page = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
        for (const m of page.matchAll(/<img[^>]*>/g)) {
            const tag = m[0];
            // The nav logo and the project header logo are above the fold
            // (LCP candidates) and must not be lazy-loaded.
            if (/class="[^"]*(?:nav-logo|project-logo)[^"]*"/.test(tag)) continue;
            assert.match(tag, /loading=["']?lazy/i, `image in ${rel} must be lazy-loaded: ${tag.slice(0, 80)}`);
            assert.match(tag, /\bsrcset="/, `image in ${rel} has no srcset: ${tag.slice(0, 80)}`);
            assert.ok(/\.(webp|avif)(\?|$)/i.test(tag.match(/\bsrc="([^"]+)"/)[1]), `image in ${rel} is not WebP/AVIF`);
            checked += 1;
        }
    }
    assert.ok(checked >= 2, `expected at least two below-the-fold project images, found ${checked}`);
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