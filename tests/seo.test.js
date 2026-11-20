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

// Read files
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const robots = fs.readFileSync(robotsPath, 'utf8');

test('sitemap.xml exists and is valid XML', () => {
    assert.ok(sitemap.includes('<?xml version="1.0"'), 'sitemap has XML declaration');
    assert.ok(sitemap.includes('<urlset'), 'sitemap has urlset element');
});

test('sitemap.xml lists the homepage', () => {
    assert.ok(sitemap.includes('<loc>https://quasarapp.me/</loc>'), 'homepage URL in sitemap');
});

test('sitemap.xml lists multiple pages and sections', () => {
    assert.ok(sitemap.includes('#projects'), 'projects section in sitemap');
    assert.ok(sitemap.includes('#about'), 'about section in sitemap');
    assert.ok(sitemap.includes('#contact'), 'contact section in sitemap');
    assert.ok(sitemap.includes('/projects/'), 'project pages in sitemap');
});

test('sitemap.xml has proper changefreq and priority', () => {
    assert.ok(sitemap.includes('changefreq'), 'sitemap has changefreq elements');
    assert.ok(sitemap.includes('priority'), 'sitemap has priority elements');
    assert.ok(sitemap.includes('<priority>1.0</priority>'), 'homepage has priority 1.0');
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
    const seoPath = path.join(ROOT, 'js', 'seo.js');
    assert.ok(fs.existsSync(seoPath), 'seo.js exists');
    const seoContent = fs.readFileSync(seoPath, 'utf8');
    assert.ok(seoContent.includes('function'), 'seo.js contains functions');
    assert.ok(seoContent.includes('application/ld+json'), 'seo.js injects JSON-LD');
});

test('seo.js injects dynamic meta tags', () => {
    const seoPath = path.join(ROOT, 'js', 'seo.js');
    const seoContent = fs.readFileSync(seoPath, 'utf8');
    assert.ok(seoContent.includes('updateMetaTags'), 'seo.js has updateMetaTags function');
    assert.ok(seoContent.includes('updateOgTags'), 'seo.js has updateOgTags function');
    assert.ok(seoContent.includes('updateTwitterTags'), 'seo.js has updateTwitterTags function');
});

test('seo.js includes Organization structured data', () => {
    const seoPath = path.join(ROOT, 'js', 'seo.js');
    const seoContent = fs.readFileSync(seoPath, 'utf8');
    assert.ok(seoContent.includes("'@type': 'Organization'"), 'seo.js includes Organization type');
});