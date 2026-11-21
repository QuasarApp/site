'use strict';

// Auto tests for local link/asset references (issue #69).
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

function listFiles(dir, exts) {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir)
        .filter((name) => fs.statSync(path.join(dir, name)).isFile() && exts.includes(path.extname(name).toLowerCase()))
        .map((name) => path.join(dir, name))
        .sort();
}

// External references: any URI scheme (http:, https:, mailto:, data:, tel: ...),
// protocol-relative URLs and pure in-page anchors.
function isExternal(ref) {
    return ref.startsWith('#') || ref.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(ref);
}

// Upcoming routes (issues #75/#77): the /projects/{slug} detail pages and
// the /devlog/{slug} post pages are shipped by their own issues. The home
// page (issue #78) already references them, so those references are
// expected to 404 until those issues land and are exempt from the
// file-existence check below.
const PENDING_ROUTE_PREFIXES = ['/projects/', '/devlog/'];
function isPendingRoute(ref) {
    return ref.startsWith('/') && PENDING_ROUTE_PREFIXES.some((p) => ref.startsWith(p));
}

/** Assert that a local (relative or site-absolute) reference resolves to a file. */
function assertRefExists(ref, fromFile) {
    const rel = path.relative(ROOT, fromFile);
    let cleaned;
    let resolved;
    if (ref.startsWith('/')) {
        // Site-absolute: on GitHub Pages the site root is the repository root.
        cleaned = decodeURIComponent(ref.slice(1).split('#')[0].split('?')[0]);
        if (!cleaned) return; // reference to the site root itself
        resolved = path.join(ROOT, cleaned);
    } else {
        cleaned = decodeURIComponent(ref.split('#')[0].split('?')[0]);
        if (!cleaned) return;
        resolved = path.resolve(path.dirname(fromFile), cleaned);
    }
    assert.ok(
        fs.existsSync(resolved),
        `'${ref}' in ${rel} does not resolve to an existing file (${path.relative(ROOT, resolved)})`
    );
}

test('all local href/src references in index.html resolve to existing files', () => {
    const htmlFile = path.join(ROOT, 'index.html');
    const refs = [...fs.readFileSync(htmlFile, 'utf8').matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)]
        .map((m) => m[1].trim())
        .filter((ref) => ref && !isExternal(ref) && !isPendingRoute(ref));
    assert.ok(refs.length > 0, 'no local references found in index.html');
    for (const ref of refs) assertRefExists(ref, htmlFile);
});

test('all local url() references in CSS files resolve to existing files', () => {
    for (const cssFile of listFiles(path.join(ROOT, 'css'), ['.css'])) {
        const refs = [...fs.readFileSync(cssFile, 'utf8').matchAll(/url\(\s*['"]?([^'")]+?)['"]?\s*\)/gi)]
            .map((m) => m[1].trim())
            .filter((ref) => ref && !isExternal(ref));
        for (const ref of refs) assertRefExists(ref, cssFile);
    }
});

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico'];

test('every image in the repository root and assets/images is referenced somewhere', () => {
    // Browsers request /favicon.ico by convention, even without a <link> tag.
    const EXEMPT = new Set(['favicon.ico']);
    const dirsToCheck = [ROOT, path.join(ROOT, 'assets', 'images')];
    const images = [];
    for (const dir of dirsToCheck) {
        if (!fs.existsSync(dir)) continue;
        images.push(
            ...listFiles(dir, IMAGE_EXTENSIONS).filter(
                (f) => !EXEMPT.has(path.basename(f).toLowerCase())
            )
        );
    }
    assert.ok(images.length > 0, 'no images found in the repository root or assets/images');

    const sources = [
        path.join(ROOT, 'index.html'),
        ...listFiles(path.join(ROOT, 'css'), ['.css']),
        ...listFiles(path.join(ROOT, 'js'), ['.js']),
    ];
    const haystack = sources.map((f) => fs.readFileSync(f, 'utf8')).join('\n').toLowerCase();

    for (const img of images) {
        const name = path.basename(img).toLowerCase();
        assert.ok(
            haystack.includes(name),
            `image '${name}' is not referenced in index.html, css/ or js/`
        );
    }
});
