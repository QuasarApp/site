'use strict';

// Auto tests for the built site structure (issue #72): required routes for
// every locale, document basics, tag balance, and the migrated sections of
// the home page and the project detail pages.
// Run with: node --test tests/*.test.js (after `npm run build`)

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, DIST, LOCALES, DEFAULT_LOCALE, findTagImbalance } = require('./helpers');

const ROUTES = [
	'/index.html',
	'/ecliptica/index.html',
	'/projects/index.html',
	'/projects/ecliptica/index.html',
	'/projects/cqtdeployer/index.html',
	'/projects/cheatcard/index.html',
	'/projects/yourtimedelivery/index.html',
	'/projects/qtssecret/index.html',
	'/projects/heart/index.html',
	'/projects/qt-secret/index.html',
	'/devlog/index.html',
	'/about/index.html',
	'/contacts/index.html',
];

function pageFile(locale, route) {
	const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
	return path.join(DIST, `${prefix}${route}`);
}

test('every required route is built for every locale', () => {
	for (const locale of LOCALES) {
		for (const route of ROUTES) {
			const file = pageFile(locale, route);
			assert.ok(fs.existsSync(file), `missing built page: ${path.relative(ROOT, file)}`);
		}
	}
});

function allPages() {
	const pages = [];
	for (const locale of LOCALES) {
		for (const route of ROUTES) pages.push(pageFile(locale, route));
	}
	return pages;
}

test('every built page has DOCTYPE, title, charset, viewport, nav and footer', () => {
	for (const page of allPages()) {
		const rel = path.relative(ROOT, page);
		const html = fs.readFileSync(page, 'utf8');
		assert.match(html, /^\s*<!DOCTYPE html>/i, `${rel}: no DOCTYPE`);
		const title = html.match(/<title>([^<]*)<\/title>/i);
		assert.ok(title && title[1].trim() !== '', `${rel}: empty or missing <title>`);
		assert.match(html, /<meta[^>]+charset=["']?utf-8/i, `${rel}: no charset`);
		// The noindex qt-secret redirect stub is a minimal page without the
		// viewport/nav/footer chrome (same contract as the legacy stub).
		if (rel.replace(/\\/g, '/').includes('projects/qt-secret/')) continue;
		assert.match(html, /<meta[^>]+name=["']?viewport["']?/i, `${rel}: no viewport`);
		assert.match(html, /<nav[\s>]/i, `${rel}: no <nav>`);
		assert.match(html, /<footer[\s>]/i, `${rel}: no <footer>`);
	}
});

test('all structural tags are balanced on every built page', () => {
	for (const page of allPages()) {
		const rel = path.relative(ROOT, page);
		const imbalance = findTagImbalance(fs.readFileSync(page, 'utf8'));
		assert.equal(imbalance, null, imbalance ? `${rel}: tag imbalance: ${imbalance}` : undefined);
	}
});

test('the home page keeps all migrated sections', () => {
	const html = fs.readFileSync(pageFile('en', '/index.html'), 'utf8');
	assert.match(html, /ecliptica-featured/, 'hero is missing the Ecliptica featured banner');
	assert.match(html, /id=["']verticals["']/, 'business verticals section missing');
	assert.match(html, /id=["']featured["']/, 'featured projects section missing');
	assert.match(html, /id=["']devlog-feed["']/, 'devlog feed container missing');
	assert.match(html, /data-devlog-empty/, 'documented devlog empty state missing');
	assert.match(html, /id=["']stack["']/, 'tech stack section missing');
	assert.match(html, /id=["']gh-repo-count["']/, 'GitHub repo count metric missing');
	assert.match(html, /id=["']gh-total-stars["']/, 'GitHub total stars metric missing');
	assert.match(html, /id=["']about["']/, 'about section missing');
	assert.match(html, /id=["']contact["']/, 'contact section missing');
	// LCP contract: the hero image is preloaded and fetched with high priority.
	assert.match(html, /<link[^>]+rel=["']preload["'][^>]+as=["']image["']/, 'hero image preload missing');
	assert.match(html, /fetchpriority=["']high["']/, 'hero image fetchpriority missing');
	for (const slug of ['ecliptica', 'cqtdeployer', 'cheatcard', 'yourtimedelivery', 'qtssecret', 'heart']) {
		assert.match(html, new RegExp(`href=["']?/projects/${slug}["']?`), `no featured card linking to /projects/${slug}`);
	}
});

test('the project detail pages keep the migrated structure', () => {
	for (const slug of ['ecliptica', 'cqtdeployer', 'cheatcard', 'yourtimedelivery', 'qtssecret', 'heart']) {
		const html = fs.readFileSync(pageFile('en', `/projects/${slug}/index.html`), 'utf8');
		const rel = `dist/projects/${slug}`;
		assert.match(html, /id=["']problem["']/, `${rel}: problem section missing`);
		assert.match(html, /id=["']value["']/, `${rel}: value section missing`);
		assert.match(html, /id=["']features["']/, `${rel}: features section missing`);
		assert.match(html, /id=["']stack["']/, `${rel}: stack section missing`);
		assert.match(html, /id=["']media["']/, `${rel}: media section missing`);
		assert.match(html, /id=["']github["']/, `${rel}: github section missing`);
	}
	// Ecliptica: Steam buttons, the hub link and the commercial-repo note.
	const ecliptica = fs.readFileSync(pageFile('en', '/projects/ecliptica/index.html'), 'utf8');
	assert.match(ecliptica, /https:\/\/store\.steampowered\.com\/app\/3723390\/Ecliptica\//, 'ecliptica: Steam store link missing');
	assert.match(ecliptica, /https:\/\/store\.steampowered\.com\/wishlist\/add\/item\?appid=3723390/, 'ecliptica: wishlist link missing');
	assert.match(ecliptica, /href=["']?\/ecliptica["']?/, 'ecliptica: hub link missing');
	// YourTimeDelivery: no public repository messaging.
	const ytd = fs.readFileSync(pageFile('en', '/projects/yourtimedelivery/index.html'), 'utf8');
	assert.match(ytd, /No Public Repository/, 'yourtimedelivery: no-repo heading missing (EN)');
	assert.match(ytd, /mailto:quasarappdevelop@gmail.com/, 'yourtimedelivery: contact mailto missing');
	assert.ok(!/data-project-github=["']stars["']/.test(ytd), 'yourtimedelivery must not render a GitHub stars block');
	// Archived repositories show the read-only note.
	for (const slug of ['cheatcard', 'qtssecret']) {
		const html = fs.readFileSync(pageFile('en', `/projects/${slug}/index.html`), 'utf8');
		assert.match(html, /data-project-github=["']archived-note["']/, `${slug}: archived note missing`);
	}
	// Open-source repos render the stars block with the cached values.
	for (const slug of ['ecliptica', 'cqtdeployer', 'cheatcard', 'qtssecret', 'heart']) {
		const html = fs.readFileSync(pageFile('en', `/projects/${slug}/index.html`), 'utf8');
		assert.match(html, /data-project-github=["']stars["']/, `${slug}: stars block missing`);
		assert.match(html, /data-project-github=["']updated-date["']/, `${slug}: updated date missing`);
	}
});

test('the Ecliptica hub and devlog pages render their skeleton content', () => {
	const hub = fs.readFileSync(pageFile('en', '/ecliptica/index.html'), 'utf8');
	assert.match(hub, /Ecliptica/, 'ecliptica hub: title missing');
	assert.match(hub, /https:\/\/store\.steampowered\.com\/app\/3723390\/Ecliptica\//, 'ecliptica hub: Steam link missing');
	assert.match(hub, /href=["']?\/projects\/ecliptica["']?/, 'ecliptica hub: project page link missing');
	const devlog = fs.readFileSync(pageFile('en', '/devlog/index.html'), 'utf8');
	assert.match(devlog, /data-devlog-empty/, 'devlog: documented empty state missing');
});
