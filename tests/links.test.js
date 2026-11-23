'use strict';

// Auto tests for links and assets (issue #72): no dead local links in the
// built site, the verified external links are preserved exactly, and every
// committed content image is referenced by the built pages.
// Run with: node --test tests/*.test.js (after `npm run build`)

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, DIST, LOCALES, DEFAULT_LOCALE, listHtmlFiles, localRefsOf, refResolves } = require('./helpers');

const REQUIRED_HOME_LINKS = [
	'https://github.com/QuasarApp',
	'https://store.steampowered.com/app/3723390/Ecliptica/',
	'https://store.steampowered.com/wishlist/add/item?appid=3723390',
	'https://bsky.app/profile/quasarapp.bsky.social',
	'https://www.youtube.com/@quasarappcore',
	'mailto:quasarappdevelop@gmail.com',
];

// Footer links are global: they must appear on every built page.
const REQUIRED_FOOTER_LINKS = [
	'https://github.com/QuasarApp',
	'https://bsky.app/profile/quasarapp.bsky.social',
	'mailto:quasarappdevelop@gmail.com',
	'https://www.youtube.com/@quasarappcore',
	'https://store.steampowered.com/curator/45704880',
];

test('all local href/src/srcset references in every built page resolve', () => {
	const pages = listHtmlFiles(DIST);
	assert.ok(pages.length >= 48, `expected at least 48 built pages, found ${pages.length}`);
	for (const page of pages) {
		const rel = path.relative(ROOT, page);
		const refs = localRefsOf(fs.readFileSync(page, 'utf8'));
		assert.ok(refs.length > 0, `no local references found in ${rel}`);
		for (const ref of refs) {
			assert.ok(refResolves(ref, page), `'${ref}' in ${rel} does not resolve in dist`);
		}
	}
});

test('the verified external links are present on the home page', () => {
	const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
	for (const link of REQUIRED_HOME_LINKS) {
		assert.ok(html.includes(link), `home page is missing the verified link ${link}`);
	}
});

test('the footer social links are present on every built page', () => {
	const pages = listHtmlFiles(DIST);
	for (const page of pages) {
		const rel = path.relative(ROOT, page);
		// The noindex qt-secret redirect stub is a minimal page without the
		// global footer (same contract as the legacy stub).
		if (rel.replace(/\\/g, '/').includes('projects/qt-secret/')) continue;
		const html = fs.readFileSync(page, 'utf8');
		for (const link of REQUIRED_FOOTER_LINKS) {
			assert.ok(html.includes(link), `${rel} footer is missing ${link}`);
		}
	}
});

test('every content image in public/assets/images is referenced by the built site', () => {
	const imagesDir = path.join(ROOT, 'public', 'assets', 'images');
	const images = fs.readdirSync(imagesDir).filter((n) => n.toLowerCase().endsWith('.webp'));
	assert.ok(images.length >= 10, `expected at least 10 committed WebP images, found ${images.length}`);
	const haystack = listHtmlFiles(DIST)
		.map((f) => fs.readFileSync(f, 'utf8'))
		.join('\n')
		.toLowerCase();
	for (const img of images) {
		assert.ok(haystack.includes(img.toLowerCase()), `image '${img}' is not referenced in the built site`);
	}
});

test('robots.txt and sitemap.xml are built and consistent', () => {
	const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
	assert.match(robots, /Sitemap: https:\/\/quasarapp\.me\/sitemap\.xml/, 'robots.txt must reference the sitemap');
	const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
	const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
	assert.equal(locs.length, 48, `sitemap must list 12 routes x 4 locales = 48 URLs, found ${locs.length}`);
	const routes = ['/', '/ecliptica/', '/projects/', '/projects/ecliptica/', '/projects/cqtdeployer/',
		'/projects/cheatcard/', '/projects/yourtimedelivery/', '/projects/qtssecret/', '/projects/heart/',
		'/devlog/', '/about/', '/contacts/'];
	for (const lang of LOCALES) {
		const prefix = lang === DEFAULT_LOCALE ? '' : `/${lang}`;
		for (const route of routes) {
			const url = `https://quasarapp.me${prefix}${route}`;
			assert.ok(locs.includes(url), `sitemap is missing ${url}`);
		}
	}
});
