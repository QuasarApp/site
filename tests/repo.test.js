'use strict';

// Repository-level auto tests (issue #72): no merge conflict markers, the
// legacy single-file architecture is gone, static assets live in public/,
// the CI workflow runs lint + type-check + build + tests, and the docs
// describe the new architecture.
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('./helpers');

const TEXT_EXTENSIONS = new Set([
	'.html', '.css', '.js', '.mjs', '.cjs', '.ts', '.astro', '.md',
	'.yml', '.yaml', '.json', '.txt', '.xml',
]);

function walkTextFiles(dir, out = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.astro') continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			walkTextFiles(full, out);
		} else if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) || entry.name === 'CNAME') {
			out.push(full);
		}
	}
	return out;
}

test('no git merge conflict markers left in text files', () => {
	const files = walkTextFiles(ROOT);
	assert.ok(files.length > 0, 'no text files found - repository looks empty');
	const markers = [
		/^<{7}( .+)?$/m,
		/^>{7}( .+)?$/m,
	];
	const offenders = files.filter((file) => markers.some((re) => re.test(fs.readFileSync(file, 'utf8'))));
	assert.deepEqual(
		offenders.map((f) => path.relative(ROOT, f)),
		[],
		`merge conflict markers found in: ${offenders.map((f) => path.relative(ROOT, f)).join(', ')}`
	);
});

test('the legacy single-file architecture is replaced (no root index.html, css/, js/, projects/, assets/, data/)', () => {
	for (const banned of ['index.html', 'css', 'js', 'projects', 'assets', 'data']) {
		assert.ok(
			!fs.existsSync(path.join(ROOT, banned)),
			`'${banned}' must be removed from the repository root (Astro architecture, issue #72)`
		);
	}
});

test('static assets live in public/', () => {
	const images = fs.readdirSync(path.join(ROOT, 'public', 'assets', 'images'));
	assert.ok(images.length >= 10, `expected the migrated WebP images in public/assets/images, found ${images.length}`);
	for (const file of ['favicon-32x32.png', 'favicon-16x16.png', 'favicon.ico', 'apple-touch-icon.png', 'robots.txt', 'sitemap.xml']) {
		assert.ok(fs.existsSync(path.join(ROOT, 'public', file)), `public/${file} is missing`);
	}
});

test('CNAME is kept at the repository root for GitHub Pages', () => {
	assert.ok(fs.existsSync(path.join(ROOT, 'CNAME')), 'CNAME is missing at the repository root');
});

test('the CI workflow runs lint, type-check, astro build and the node test suite', () => {
	const workflow = path.join(ROOT, '.github', 'workflows', 'auto-tests.yml');
	assert.ok(fs.existsSync(workflow), '.github/workflows/auto-tests.yml is missing');
	const yaml = fs.readFileSync(workflow, 'utf8');
	assert.match(yaml, /^on:/m, 'workflow has no trigger block');
	assert.match(yaml, /pull_request:/, 'workflow does not run on pull_request');
	assert.match(yaml, /jobs:/, 'workflow has no jobs');
	assert.match(yaml, /runs-on:\s*ubuntu-latest/m, 'workflow does not pin ubuntu-latest');
	assert.match(yaml, /npm run lint/, 'workflow does not run the lint step');
	assert.match(yaml, /npm run check/, 'workflow does not run the type-check step');
	assert.match(yaml, /npm run build/, 'workflow does not run the astro build step');
	assert.match(yaml, /node --test/, 'workflow does not run the node test suite');
});

test('README.md and AGENTS.md describe the Astro architecture', () => {
	for (const doc of ['README.md', 'AGENTS.md']) {
		const text = fs.readFileSync(path.join(ROOT, doc), 'utf8');
		assert.match(text, /Astro/, `${doc} must mention the Astro framework`);
		assert.match(text, /Tailwind/, `${doc} must mention Tailwind CSS`);
		assert.match(text, /astro build/, `${doc} must document the build command`);
	}
});
