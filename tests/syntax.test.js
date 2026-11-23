'use strict';

// Auto tests for syntax sanity of the Astro project (issue #72): package
// scripts, config files, JSON documents, CSS delimiters and JS sources.
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { ROOT } = require('./helpers');

function listFiles(dir, ext) {
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir)
		.filter((name) => fs.statSync(path.join(dir, name)).isFile() && path.extname(name).toLowerCase() === ext)
		.map((name) => path.join(dir, name))
		.sort();
}

test('package.json is valid and declares the build/lint/check/test scripts', () => {
	const raw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
	const pkg = JSON.parse(raw);
	for (const script of ['dev', 'build', 'preview', 'lint', 'check', 'test']) {
		assert.equal(typeof pkg.scripts?.[script], 'string', `package.json has no '${script}' script`);
	}
	assert.match(pkg.scripts.build, /astro build/, "the 'build' script must run astro build");
	assert.match(pkg.scripts.check, /astro check/, "the 'check' script must run astro check");
	assert.match(pkg.scripts.lint, /eslint/, "the 'lint' script must run eslint");
	assert.match(pkg.scripts.test, /node --test tests\/\*\.test\.js/, "the 'test' script must run the node test suite");
	assert.ok(pkg.devDependencies?.astro, 'astro must be a devDependency');
	assert.ok(pkg.devDependencies?.tailwindcss, 'tailwindcss must be a devDependency');
	assert.ok(pkg.devDependencies?.typescript, 'typescript must be a devDependency for astro check');
});

test('astro.config.mjs and eslint.config.mjs have valid ESM syntax', () => {
	for (const file of ['astro.config.mjs', 'eslint.config.mjs']) {
		assert.doesNotThrow(
			() => execFileSync(process.execPath, ['--check', path.join(ROOT, file)], { stdio: 'pipe' }),
			`syntax error in ${file}`
		);
	}
});

test('tsconfig.json extends the Astro base config', () => {
	const tsconfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'tsconfig.json'), 'utf8'));
	assert.match(tsconfig.extends ?? '', /astro\/tsconfigs\//, 'tsconfig must extend an Astro tsconfig preset');
});

test('every JSON document parses', () => {
	const files = [
		...listFiles(path.join(ROOT, 'src', 'i18n'), '.json'),
		...listFiles(path.join(ROOT, 'src', 'data'), '.json'),
	];
	assert.ok(files.length >= 6, `expected at least 6 JSON documents, found ${files.length}`);
	for (const file of files) {
		assert.doesNotThrow(
			() => JSON.parse(fs.readFileSync(file, 'utf8')),
			`invalid JSON in ${path.relative(ROOT, file)}`
		);
	}
});

/** Count braces/parentheses outside of comments and string literals. */
function scanDelimiters(source) {
	let braces = 0;
	let parens = 0;
	let inBlockComment = false;
	let inString = null;
	for (let i = 0; i < source.length; i++) {
		const ch = source[i];
		const next = source[i + 1];
		if (inBlockComment) {
			if (ch === '*' && next === '/') { inBlockComment = false; i++; }
			continue;
		}
		if (inString) {
			if (ch === '\\') i++;
			else if (ch === inString) inString = null;
			continue;
		}
		if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
		if (ch === "'" || ch === '"') { inString = ch; continue; }
		if (ch === '{') braces++;
		else if (ch === '}') braces--;
		else if (ch === '(') parens++;
		else if (ch === ')') parens--;
	}
	return { braces, parens, inBlockComment, inString };
}

test('every CSS file has balanced braces and parentheses', () => {
	const files = listFiles(path.join(ROOT, 'src', 'styles'), '.css');
	assert.ok(files.length >= 1, 'expected at least one CSS file in src/styles');
	for (const file of files) {
		const rel = path.relative(ROOT, file);
		const { braces, parens, inBlockComment, inString } = scanDelimiters(fs.readFileSync(file, 'utf8'));
		assert.equal(inBlockComment, false, `${rel}: unterminated /* comment`);
		assert.equal(inString, null, `${rel}: unterminated string literal`);
		assert.equal(braces, 0, `${rel}: unbalanced { } (delta ${braces})`);
		assert.equal(parens, 0, `${rel}: unbalanced ( ) (delta ${parens})`);
	}
});

test('every JavaScript file in scripts/ and tests/ passes node --check', () => {
	const files = [...listFiles(path.join(ROOT, 'scripts'), '.js'), ...listFiles(path.join(ROOT, 'tests'), '.js')];
	assert.ok(files.length >= 2, 'expected JS files in scripts/ and tests/');
	for (const file of files) {
		assert.doesNotThrow(
			() => execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }),
			`syntax error in ${path.relative(ROOT, file)}`
		);
	}
});
