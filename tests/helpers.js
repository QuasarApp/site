'use strict';

// Shared helpers for the auto tests (issue #72). The suite runs against the
// BUILT site in dist/ (run `npm run build` first; `npm test` via
// `npm run test:full` chains build + tests), plus the source tree for the
// content collections and the build-time data caches.

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LOCALES = ['en', 'ru', 'de', 'es'];
const DEFAULT_LOCALE = 'en';

/** Recursively list all HTML files under a directory. */
function listHtmlFiles(dir) {
	if (!fs.existsSync(dir)) return [];
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === '_astro') continue; // generated JS/CSS assets
			out.push(...listHtmlFiles(full));
		} else if (entry.name.toLowerCase().endsWith('.html')) {
			out.push(full);
		}
	}
	return out.sort();
}

/** External references: any URI scheme, protocol-relative URLs, in-page anchors. */
function isExternal(ref) {
	return ref.startsWith('#') || ref.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(ref);
}

/**
 * Resolve a local (relative or site-absolute) reference from an HTML page in
 * dist/ to a filesystem path. Returns null for external references.
 */
function refToPath(ref, pageFile) {
	const cleaned = decodeURIComponent(ref.split('#')[0].split('?')[0]);
	if (!cleaned) return DIST; // reference to the site root itself
	if (cleaned.startsWith('/')) return path.join(DIST, cleaned);
	return path.resolve(path.dirname(pageFile), cleaned);
}

/** A local reference resolves when the file or a directory index exists. */
function refResolves(ref, pageFile) {
	if (isExternal(ref)) return true;
	const target = refToPath(ref, pageFile);
	if (fs.existsSync(target) && fs.statSync(target).isFile()) return true;
	return fs.existsSync(path.join(target, 'index.html'));
}

/** All href/src references plus srcset candidates of an HTML page. */
function localRefsOf(html) {
	const refs = [];
	for (const m of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
		refs.push(m[1].trim());
	}
	for (const m of html.matchAll(/srcset\s*=\s*["']([^"']+)["']/gi)) {
		for (const candidate of m[1].split(',')) {
			const url = candidate.trim().split(/\s+/)[0];
			if (url) refs.push(url);
		}
	}
	return refs.filter((ref) => ref && !isExternal(ref));
}

/** Extract the <select id="lang-select"> block of an HTML page. */
function langSwitcherOf(html) {
	const m = html.match(/<select[^>]*id="lang-select"[\s\S]*?<\/select>/i);
	return m ? m[0] : null;
}

/**
 * Stack-based tag balance check for structural tags (ported from the
 * legacy tests). Comments and inline script/style bodies are stripped first.
 * Returns an error message or null when balanced.
 */
function findTagImbalance(source) {
	const VOID_ELEMENTS = new Set([
		'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
		'link', 'meta', 'param', 'source', 'track', 'wbr',
	]);
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

/** Locale of a built page: the first path segment under dist when prefixed. */
function localeOf(pageFile) {
	const rel = path.relative(DIST, pageFile).split(path.sep);
	return LOCALES.includes(rel[0]) ? rel[0] : DEFAULT_LOCALE;
}

/** Site path (without locale prefix) of a built page, e.g. '/projects/heart'. */
function sitePathOf(pageFile) {
	const rel = path.relative(DIST, pageFile).split(path.sep);
	const withoutIndex = rel[rel.length - 1].toLowerCase().endsWith('index.html')
		? rel.slice(0, -1)
		: rel;
	const withoutLocale = LOCALES.includes(withoutIndex[0]) ? withoutIndex.slice(1) : withoutIndex;
	if (withoutLocale.length === 0) return '/';
	return `/${withoutIndex.length ? withoutLocale.join('/') : ''}`;
}

module.exports = {
	ROOT,
	DIST,
	LOCALES,
	DEFAULT_LOCALE,
	listHtmlFiles,
	isExternal,
	refToPath,
	refResolves,
	localRefsOf,
	langSwitcherOf,
	findTagImbalance,
	localeOf,
	sitePathOf,
};
