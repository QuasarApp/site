'use strict';

// Auto tests for i18n (issue #72): key parity across EN/RU/DE/ES, EN as the
// default locale, and the language switcher on every built page.
// Run with: node --test tests/*.test.js (after `npm run build`)

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
	ROOT,
	DIST,
	LOCALES,
	DEFAULT_LOCALE,
	listHtmlFiles,
	langSwitcherOf,
	localeOf,
	sitePathOf,
	refResolves,
} = require('./helpers');

/** Flatten a nested translation object to 'a.b.c' => value. */
function flatten(obj, prefix = '') {
	const out = {};
	for (const [key, value] of Object.entries(obj)) {
		const dotKey = prefix ? `${prefix}.${key}` : key;
		if (value !== null && typeof value === 'object') {
			Object.assign(out, flatten(value, dotKey));
		} else {
			out[dotKey] = value;
		}
	}
	return out;
}

function loadTranslations() {
	const translations = {};
	for (const lang of LOCALES) {
		const file = path.join(ROOT, 'src', 'i18n', `${lang}.json`);
		assert.ok(fs.existsSync(file), `src/i18n/${lang}.json is missing`);
		translations[lang] = JSON.parse(fs.readFileSync(file, 'utf8'));
	}
	return translations;
}

const translations = loadTranslations();

test('all supported languages are present', () => {
	for (const lang of LOCALES) {
		assert.ok(
			translations[lang] !== null && typeof translations[lang] === 'object',
			`missing translation block for language '${lang}'`
		);
	}
});

test('key sets are identical across all languages', () => {
	const keys = Object.fromEntries(
		LOCALES.map((lang) => [lang, Object.keys(flatten(translations[lang])).sort()])
	);
	assert.ok(keys.en.length > 0, 'no i18n keys found');
	for (const lang of LOCALES.slice(1)) {
		const missing = keys.en.filter((k) => !keys[lang].includes(k));
		const extra = keys[lang].filter((k) => !keys.en.includes(k));
		assert.deepEqual(
			keys[lang],
			keys.en,
			`language '${lang}' has a different key set than '${DEFAULT_LOCALE}': ` +
				`missing=[${missing.join(', ')}] extra=[${extra.join(', ')}]`
		);
	}
});

test('no translation value is empty', () => {
	for (const lang of LOCALES) {
		for (const [key, value] of Object.entries(flatten(translations[lang]))) {
			assert.equal(typeof value, 'string', `'${lang}.${key}' is not a string`);
			assert.notEqual(value.trim(), '', `'${lang}.${key}' is empty`);
		}
	}
});

test('Astro i18n config: EN default, 4 locales, default locale unprefixed', () => {
	const config = fs.readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf8');
	assert.match(config, /defaultLocale:\s*'en'/, "defaultLocale must be 'en'");
	for (const lang of LOCALES) {
		assert.match(config, new RegExp(`'${lang}'`), `locale '${lang}' missing in astro.config.mjs`);
	}
	assert.match(config, /prefixDefaultLocale:\s*false/, 'the default locale must be served without a prefix');
});

test('the dist build exists (run npm run build before the tests)', () => {
	assert.ok(
		fs.existsSync(path.join(DIST, 'index.html')),
		'dist/index.html is missing - run `npm run build` first'
	);
});

test('every built page declares its locale in <html lang>', () => {
	const pages = listHtmlFiles(DIST);
	assert.ok(pages.length >= 48, `expected at least 48 built pages, found ${pages.length}`);
	for (const page of pages) {
		const html = fs.readFileSync(page, 'utf8');
		const m = html.match(/<html[^>]*lang="([a-z]{2}(?:-[a-z]{2})?)"/i);
		assert.ok(m, `${path.relative(ROOT, page)} has no <html lang>`);
		assert.equal(m[1], localeOf(page), `${path.relative(ROOT, page)} declares lang="${m[1]}"`);
	}
});

test('the language switcher on every built page lists exactly EN/RU/DE/ES with the current locale selected', () => {
	const pages = listHtmlFiles(DIST);
	for (const page of pages) {
		const rel = path.relative(ROOT, page);
		// The noindex qt-secret redirect stub is a minimal page without the
		// global chrome (same contract as the legacy stub).
		if (rel.replace(/\\/g, '/').includes('projects/qt-secret/')) continue;
		const html = fs.readFileSync(page, 'utf8');
		const select = langSwitcherOf(html);
		assert.ok(select, `${rel} has no #lang-select switcher`);
		const options = [...select.matchAll(/<option[^>]*value="([^"]+)"[^>]*>([^<]*)<\/option>/g)];
		assert.equal(options.length, LOCALES.length, `${rel} switcher must list exactly ${LOCALES.length} options`);
		assert.deepEqual(
			options.map((o) => o[2]).sort(),
			LOCALES.map((l) => l.toUpperCase()).sort(),
			`${rel} switcher labels are not the locale abbreviations`
		);
		const selected = options.filter((o) => /<option[^>]*\bselected\b/.test(o[0]));
		assert.equal(selected.length, 1, `${rel} switcher must have exactly one selected option`);
		assert.equal(
			selected[0][2],
			localeOf(page).toUpperCase(),
			`${rel} switcher must preselect the page locale`
		);
	}
});

test('every language switcher target resolves to a built page', () => {
	const pages = listHtmlFiles(DIST);
	for (const page of pages) {
		const rel = path.relative(ROOT, page);
		if (rel.replace(/\\/g, '/').includes('projects/qt-secret/')) continue;
		const html = fs.readFileSync(page, 'utf8');
		const select = langSwitcherOf(html);
		assert.ok(select, `${rel} has no #lang-select switcher`);
		const options = [...select.matchAll(/<option[^>]*value="([^"]+)"/g)].map((m) => m[1]);
		const basePath = sitePathOf(page);
		for (const lang of LOCALES) {
			const expected = lang === DEFAULT_LOCALE ? basePath : `/${lang}${basePath}`;
			const value = options.find((v) => v === expected || v === `${expected}/` || v === expected.replace(/\/$/, ''));
			assert.ok(value !== undefined, `${rel} switcher has no option for '${expected}'`);
			assert.ok(refResolves(value, page), `${rel} switcher target '${value}' does not resolve in dist`);
		}
	}
});
