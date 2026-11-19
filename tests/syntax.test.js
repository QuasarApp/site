'use strict';

// Auto tests for JS/CSS syntax sanity (issue #69).
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');

function listFiles(dir, ext) {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir)
        .filter((name) => fs.statSync(path.join(dir, name)).isFile() && path.extname(name).toLowerCase() === ext)
        .map((name) => path.join(dir, name))
        .sort();
}

test('JavaScript files exist', () => {
    const files = listFiles(path.join(ROOT, 'js'), '.js');
    assert.ok(files.length >= 3, 'expected at least 3 JS files in js/');
});

test('every JavaScript file passes node --check', () => {
    for (const file of listFiles(path.join(ROOT, 'js'), '.js')) {
        assert.doesNotThrow(
            () => execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }),
            `syntax error in ${path.relative(ROOT, file)}`
        );
    }
});

/** Count braces/parentheses outside of comments and string literals. */
function scanDelimiters(source) {
    let braces = 0;
    let parens = 0;
    let inBlockComment = false;
    let inString = null; // "'" or '"'
    for (let i = 0; i < source.length; i++) {
        const ch = source[i];
        const next = source[i + 1];
        if (inBlockComment) {
            if (ch === '*' && next === '/') {
                inBlockComment = false;
                i++;
            }
            continue;
        }
        if (inString) {
            if (ch === '\\') i++;
            else if (ch === inString) inString = null;
            continue;
        }
        if (ch === '/' && next === '*') {
            inBlockComment = true;
            i++;
            continue;
        }
        if (ch === "'" || ch === '"') {
            inString = ch;
            continue;
        }
        if (ch === '{') braces++;
        else if (ch === '}') braces--;
        else if (ch === '(') parens++;
        else if (ch === ')') parens--;
    }
    return { braces, parens, inBlockComment, inString };
}

test('every CSS file has balanced braces and parentheses', () => {
    const files = listFiles(path.join(ROOT, 'css'), '.css');
    assert.ok(files.length >= 1, 'expected at least one CSS file in css/');
    for (const file of files) {
        const rel = path.relative(ROOT, file);
        const { braces, parens, inBlockComment, inString } = scanDelimiters(fs.readFileSync(file, 'utf8'));
        assert.equal(inBlockComment, false, `${rel}: unterminated /* comment`);
        assert.equal(inString, null, `${rel}: unterminated string literal`);
        assert.equal(braces, 0, `${rel}: unbalanced { } (delta ${braces})`);
        assert.equal(parens, 0, `${rel}: unbalanced ( ) (delta ${parens})`);
    }
});
