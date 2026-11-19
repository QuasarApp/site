'use strict';

// Auto tests for js/i18n.js translation coverage (issue #69).
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const LANGS = ['en', 'ru', 'de', 'es'];

/**
 * Load js/i18n.js inside a VM sandbox with the minimal browser globals the
 * script touches on load (it only registers a DOMContentLoaded listener).
 * `translations` is a top-level `const`, so it is read back through the same
 * context after the script has executed.
 */
function loadTranslations() {
    const code = fs.readFileSync(path.join(ROOT, 'js', 'i18n.js'), 'utf8');
    const sandbox = {
        console,
        navigator: { languages: [], language: '' },
        localStorage: {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
        },
        document: {
            addEventListener: () => {},
            querySelector: () => null,
            querySelectorAll: () => [],
            documentElement: {
                setAttribute: () => {},
                getAttribute: () => null,
            },
        },
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: 'js/i18n.js' });
    return vm.runInContext('translations', sandbox, { filename: 'js/i18n.js' });
}

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

/** Resolve a dot path ('nav.home') inside a translation tree. */
function resolvePath(tree, dotPath) {
    let value = tree;
    for (const part of dotPath.split('.')) {
        if (value === null || typeof value !== 'object') return undefined;
        value = value[part];
    }
    return value;
}

const translations = loadTranslations();

test('all supported languages are present', () => {
    for (const lang of LANGS) {
        assert.ok(
            translations[lang] !== null && typeof translations[lang] === 'object',
            `missing translation block for language '${lang}'`
        );
    }
});

test('key sets are identical across all languages', () => {
    const keys = Object.fromEntries(
        LANGS.map((lang) => [lang, Object.keys(flatten(translations[lang])).sort()])
    );
    for (const lang of LANGS.slice(1)) {
        const missing = keys.en.filter((k) => !keys[lang].includes(k));
        const extra = keys[lang].filter((k) => !keys.en.includes(k));
        assert.deepEqual(
            keys[lang],
            keys.en,
            `language '${lang}' has a different key set than 'en': ` +
                `missing=[${missing.join(', ')}] extra=[${extra.join(', ')}]`
        );
    }
});

test('no translation value is empty', () => {
    for (const lang of LANGS) {
        for (const [key, value] of Object.entries(flatten(translations[lang]))) {
            assert.equal(typeof value, 'string', `'${lang}.${key}' is not a string`);
            assert.notEqual(value.trim(), '', `'${lang}.${key}' is empty`);
        }
    }
});

test('every data-lang key used in index.html exists in all languages', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const keys = [...html.matchAll(/data-lang="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(keys.length > 0, 'no data-lang attributes found in index.html');
    for (const key of new Set(keys)) {
        for (const lang of LANGS) {
            const value = resolvePath(translations[lang], key);
            assert.equal(
                typeof value,
                'string',
                `data-lang '${key}' does not resolve to a string in '${lang}'`
            );
            assert.notEqual(value.trim(), '', `data-lang '${key}' is empty in '${lang}'`);
        }
    }
});
