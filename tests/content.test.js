'use strict';

// Auto tests for the content collections and build-time data caches
// (issue #72): the Git-based CMS records (projects, devlog, Ecliptica
// roadmap) and the GitHub metric caches rendered by the site.
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('./helpers');

const PROJECT_SLUGS = ['ecliptica', 'cqtdeployer', 'cheatcard', 'yourtimedelivery', 'qtssecret', 'heart'];
const CATEGORIES = ['games', 'developerTools', 'desktopApps', 'libraries'];
const STATUSES = ['activeDevelopment', 'released', 'openSource', 'beta'];
const ACTIONS = ['steam', 'wishlist', 'hub', 'download', 'github', 'docs', 'contact'];

/** Minimal frontmatter parser: returns the parsed YAML-ish header as an object. */
function parseFrontmatter(source) {
	const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
	assert.ok(m, 'markdown entry has no frontmatter block');
	const data = {};
	let currentKey = null;
	for (const rawLine of m[1].split(/\r?\n/)) {
		if (!rawLine.trim()) continue;
		const listMatch = rawLine.match(/^\s+-\s+(.*)$/);
		if (listMatch && currentKey) {
			if (!Array.isArray(data[currentKey])) data[currentKey] = [];
			data[currentKey].push(listMatch[1].trim());
			continue;
		}
		const pairMatch = rawLine.match(/^(\w+):\s*(.*)$/);
		if (!pairMatch) continue;
		const [, key, value] = pairMatch;
		currentKey = key;
		if (value.trim() === '') {
			data[key] = null; // list or nested block follows
		} else {
			const trimmed = value.trim();
			data[key] = /^(\d+)$/.test(trimmed) ? Number(trimmed) : trimmed.replace(/^"|"$/g, '');
		}
	}
	return data;
}

test('content.config.ts defines the projects, devlog and roadmap collections', () => {
	const config = fs.readFileSync(path.join(ROOT, 'src', 'content.config.ts'), 'utf8');
	for (const collection of ['projects', 'devlog', 'roadmap']) {
		assert.match(config, new RegExp(`${collection}\\s*=\\s*defineCollection\\(`), `collection '${collection}' is not defined`);
	}
	assert.match(config, /loader:\s*glob\(/, 'collections must use the glob loader (Astro content layer)');
});

test('the projects collection has exactly the 6 key projects with valid frontmatter', () => {
	const files = fs.readdirSync(path.join(ROOT, 'src', 'content', 'projects'))
		.filter((name) => name.endsWith('.md'))
		.map((name) => path.basename(name, '.md'))
		.sort();
	assert.deepEqual(files, PROJECT_SLUGS.slice().sort(), `unexpected project files: ${files.join(', ')}`);
	for (const slug of PROJECT_SLUGS) {
		const data = parseFrontmatter(fs.readFileSync(path.join(ROOT, 'src', 'content', 'projects', `${slug}.md`), 'utf8'));
		assert.equal(typeof data.title, 'string', `${slug}: title missing`);
		assert.notEqual(data.title.trim(), '', `${slug}: title empty`);
		assert.ok(CATEGORIES.includes(data.category), `${slug}: invalid category '${data.category}'`);
		assert.ok(Array.isArray(data.statuses) && data.statuses.length > 0, `${slug}: statuses missing`);
		for (const status of data.statuses) assert.ok(STATUSES.includes(status), `${slug}: invalid status '${status}'`);
		assert.ok(Array.isArray(data.os) && data.os.length > 0, `${slug}: os missing`);
		assert.ok(Array.isArray(data.stack) && data.stack.length > 0, `${slug}: stack missing`);
		assert.ok(Array.isArray(data.actions) && data.actions.length > 0, `${slug}: actions missing`);
		for (const action of data.actions) assert.ok(ACTIONS.includes(action), `${slug}: invalid action '${action}'`);
	}
});

test('the ecliptica project media references committed images', () => {
	const source = fs.readFileSync(path.join(ROOT, 'src', 'content', 'projects', 'ecliptica.md'), 'utf8');
	for (const m of source.matchAll(/image:\s*(\/[^\s]+\.webp)/g)) {
		const rel = m[1].replace(/^\//, '');
		assert.ok(fs.existsSync(path.join(ROOT, 'public', rel)), `media image '${m[1]}' is not committed under public/`);
	}
});

test('the roadmap collection has the Ecliptica roadmap entry', () => {
	const dir = path.join(ROOT, 'src', 'content', 'roadmap');
	const files = fs.readdirSync(dir).filter((name) => name.endsWith('.md'));
	assert.ok(files.length >= 1, 'roadmap collection is empty');
	const data = parseFrontmatter(fs.readFileSync(path.join(dir, files[0]), 'utf8'));
	assert.equal(data.project, 'ecliptica', 'roadmap entry must target the ecliptica project');
	assert.equal(typeof data.title, 'string', 'roadmap entry has no title');
});

test('the devlog collection directory exists (posts are added by the devlog issue)', () => {
	assert.ok(fs.existsSync(path.join(ROOT, 'src', 'content', 'devlog')), 'src/content/devlog directory missing');
});

test('the GitHub org metrics cache JSON is valid and non-empty', () => {
	const file = path.join(ROOT, 'src', 'data', 'github-org-metrics.json');
	assert.ok(fs.existsSync(file), 'src/data/github-org-metrics.json is missing (run scripts/fetch-github-metrics.js)');
	const data = JSON.parse(fs.readFileSync(file, 'utf8'));
	assert.equal(data.org, 'QuasarApp', 'metrics cache must target the QuasarApp org');
	assert.match(data.source, /^https:\/\/github\.com\/QuasarApp\/?$/, 'metrics source is not the org URL');
	assert.equal(typeof data.fetchedAt, 'string', 'metrics cache has no fetchedAt timestamp');
	assert.ok(!Number.isNaN(Date.parse(data.fetchedAt)), 'fetchedAt is not a valid date');
	assert.ok(Number.isInteger(data.repoCount) && data.repoCount > 0, 'repoCount must be a positive integer');
	assert.ok(Number.isInteger(data.totalStars) && data.totalStars >= 0, 'totalStars must be a non-negative integer');
});

test('the per-project GitHub cache JSON is valid and covers the 5 open-source projects', () => {
	const file = path.join(ROOT, 'src', 'data', 'projects-github.json');
	assert.ok(fs.existsSync(file), 'src/data/projects-github.json is missing (run scripts/fetch-projects-github.js)');
	const data = JSON.parse(fs.readFileSync(file, 'utf8'));
	assert.equal(data.org, 'QuasarApp', 'cache must target the QuasarApp org');
	assert.ok(!Number.isNaN(Date.parse(data.fetchedAt)), 'fetchedAt is not a valid date');
	for (const slug of ['ecliptica', 'cqtdeployer', 'cheatcard', 'qtssecret', 'heart']) {
		const entry = data.projects?.[slug];
		assert.ok(entry, `cache entry for '${slug}' missing`);
		assert.match(entry.repoUrl, /^https:\/\/github\.com\/QuasarApp\//, `${slug}: repoUrl is not a QuasarApp repo`);
		assert.ok(Number.isInteger(entry.stars) && entry.stars >= 0, `${slug}: stars must be an integer`);
		assert.equal(typeof entry.archived, 'boolean', `${slug}: archived must be a boolean`);
	}
	assert.ok(!data.projects?.yourtimedelivery, 'YourTimeDelivery must have no cache entry (no public repository)');
});

test('the build-time fetcher scripts write the caches under src/data', () => {
	const metrics = fs.readFileSync(path.join(ROOT, 'scripts', 'fetch-github-metrics.js'), 'utf8');
	assert.match(metrics, /api\.github\.com/, 'org metrics fetcher must query the GitHub API');
	assert.match(metrics, /src[\\/'"],\s*['"]data['"]/, 'org metrics fetcher must write src/data/github-org-metrics.json');
	const projects = fs.readFileSync(path.join(ROOT, 'scripts', 'fetch-projects-github.js'), 'utf8');
	assert.match(projects, /api\.github\.com/, 'projects fetcher must query the GitHub API');
	assert.match(projects, /src[\\/'"],\s*['"]data['"]/, 'projects fetcher must write src/data/projects-github.json');
});
