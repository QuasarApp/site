/**
 * SEO Tests for sitemap.xml, robots.txt, and JSON-LD structured data
 * Run with: node --test tests/seo.test.js
 */

'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const sitemapPath = path.join(ROOT, 'sitemap.xml');
const robotsPath = path.join(ROOT, 'robots.txt');
const seoPath = path.join(ROOT, 'js', 'seo.js');

// Read files
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const robots = fs.readFileSync(robotsPath, 'utf8');
const seoContent = fs.readFileSync(seoPath, 'utf8');

test('sitemap.xml exists and is valid XML', () => {
    assert.ok(sitemap.includes('<?xml version="1.0"'), 'sitemap has XML declaration');
    assert.ok(sitemap.includes('<urlset'), 'sitemap has urlset element');
});

test('sitemap.xml lists the homepage', () => {
    assert.ok(sitemap.includes('<loc>https://quasarapp.me/</loc>'), 'homepage URL in sitemap');
});

test('sitemap.xml lists ecliptica page', () => {
    assert.ok(sitemap.includes('ecliptica'), 'ecliptica URL in sitemap');
});

test('sitemap.xml lists devlog section', () => {
    assert.ok(sitemap.includes('devlog'), 'devlog URL in sitemap');
});

test('sitemap.xml lists project section', () => {
    assert.ok(sitemap.includes('projects/'), 'projects URL in sitemap');
});

test('sitemap.xml has proper changefreq and priority', () => {
    assert.ok(sitemap.includes('changefreq'), 'sitemap has changefreq elements');
    assert.ok(sitemap.includes('priority'), 'sitemap has priority elements');
    assert.ok(sitemap.includes('<priority>1.0</priority>'), 'homepage has priority 1.0');
});

test('sitemap.xml does not contain anchor fragments for sections', () => {
    // Anchor fragments for sections should be avoided as they point to the same document
    assert.ok(!sitemap.includes('#home'), 'sitemap should not list #home fragment');
    assert.ok(!sitemap.includes('#about'), 'sitemap should not list #about fragment');
    assert.ok(!sitemap.includes('#contact'), 'sitemap should not list #contact fragment');
});

test('robots.txt allows crawling of all pages', () => {
    assert.ok(robots.includes('User-agent: *'), 'robots.txt has default user agent');
    assert.ok(robots.includes('Allow: /'), 'robots.txt allows all paths');
});

test('robots.txt references sitemap.xml', () => {
    assert.ok(robots.includes('Sitemap:'), 'robots.txt has Sitemap directive');
    assert.ok(robots.includes('sitemap.xml'), 'robots.txt references sitemap.xml');
});

test('robots.txt has disallow rules for admin areas', () => {
    assert.ok(robots.includes('Disallow:'), 'robots.txt has disallow rules');
    assert.ok(robots.includes('/admin/'), 'robots.txt disallows admin area');
});

test('seo.js exists and is valid JavaScript', () => {
    assert.ok(fs.existsSync(seoPath), 'seo.js exists');
    assert.ok(seoContent.includes('function'), 'seo.js contains functions');
    assert.ok(seoContent.includes('application/ld+json'), 'seo.js injects JSON-LD');
});

test('seo.js injects dynamic meta tags', () => {
    assert.ok(seoContent.includes('updateMetaTags'), 'seo.js has updateMetaTags function');
    assert.ok(seoContent.includes('updateOgTags'), 'seo.js has updateOgTags function');
    assert.ok(seoContent.includes('updateTwitterTags'), 'seo.js has updateTwitterTags function');
});

test('seo.js includes Organization structured data', () => {
    assert.ok(seoContent.includes("'@type': 'Organization'"), 'seo.js includes Organization type');
});

test('seo.js includes VideoGame structured data for /ecliptica', () => {
    assert.ok(seoContent.includes("'@type': 'VideoGame'"), 'seo.js includes VideoGame type');
    assert.ok(seoContent.includes('ecliptica'), 'seo.js has ecliptica configuration');
});

test('seo.js includes SoftwareApplication structured data for /projects/', () => {
    assert.ok(seoContent.includes("'@type': 'SoftwareApplication'"), 'seo.js includes SoftwareApplication type');
    assert.ok(seoContent.includes('/projects/'), 'seo.js has /projects/ configuration');
});

test('seo.js includes BlogPosting structured data for /devlog/', () => {
    assert.ok(seoContent.includes("'@type': 'BlogPosting'"), 'seo.js includes BlogPosting type');
    assert.ok(seoContent.includes('/devlog/'), 'seo.js has /devlog/ configuration');
});

test('seo.js has hashchange listener for SPA navigation', () => {
    assert.ok(seoContent.includes('hashchange'), 'seo.js has hashchange listener');
    assert.ok(seoContent.includes('handleHashChange'), 'seo.js has handleHashChange function');
});

test('seo.js pageMeta does not have fallback iteration bug', () => {
    // The old code had a bug where it iterated through pageMeta keys
    // and returned the first hash key for all unknown paths
    // The new code should use defaultMeta directly for unknown paths
    assert.ok(!seoContent.includes('for (const key in pageMeta)'), 'seo.js should not iterate pageMeta keys for fallback');
});

test('seo.js has pageMeta entries for /ecliptica', () => {
    assert.ok(seoContent.includes("'/ecliptica':"), 'seo.js has /ecliptica in pageMeta');
});

test('seo.js has pageMeta entries for /projects/', () => {
    assert.ok(seoContent.includes("'/projects/':"), 'seo.js has /projects/ in pageMeta');
});

test('seo.js has pageMeta entries for /devlog/', () => {
    assert.ok(seoContent.includes("'/devlog/':"), 'seo.js has /devlog/ in pageMeta');
});

test('seo.js has pageMeta entries for hash sections', () => {
    assert.ok(seoContent.includes("'#home':"), 'seo.js has #home in pageMeta');
    assert.ok(seoContent.includes("'#projects':"), 'seo.js has #projects in pageMeta');
    assert.ok(seoContent.includes("'#about':"), 'seo.js has #about in pageMeta');
    assert.ok(seoContent.includes("'#contact':"), 'seo.js has #contact in pageMeta');
});

test('seo.js has defaultMeta fallback for unknown paths', () => {
    assert.ok(seoContent.includes('defaultMeta'), 'seo.js has defaultMeta fallback');
});

test('seo.js pageMeta has unique metadata per page', () => {
    assert.ok(seoContent.includes("title: 'Ecliptica - QuasarApp Group'"), 'seo.js has unique title for ecliptica');
    assert.ok(seoContent.includes("description: 'Ecliptica is a revolutionary game development tool that empowers indie developers to create immersive gaming experiences.'"), 'seo.js has unique description for ecliptica');
});

test('seo.js file ends with a newline', () => {
    const seoLines = seoContent.split('\n');
    if (seoLines.length > 0) {
        assert.ok(seoLines[seoLines.length - 1].length === 0, 'seo.js should end with a newline');
    }
});

test('seo.test.js file ends with a newline', () => {
    const testsContent = fs.readFileSync(__filename, 'utf8');
    const testsLines = testsContent.split('\n');
    if (testsLines.length > 0) {
        assert.ok(testsLines[testsLines.length - 1].length === 0, 'seo.test.js should end with a newline');
    }
});
