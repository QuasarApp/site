'use strict';

// Auto tests for js/i18n.js translation coverage (issue #69).
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const LANGS = ['en', 'ru', 'me', 'de', 'es'];

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

test('every data-lang key used in any root HTML page exists in all languages', () => {
    const htmlFiles = fs
        .readdirSync(ROOT)
        .filter((name) => name.toLowerCase().endsWith('.html') && fs.statSync(path.join(ROOT, name)).isFile())
        .sort();
    assert.ok(htmlFiles.length > 0, 'no HTML pages found in the repository root');
    for (const file of htmlFiles) {
        const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
        const keys = [...html.matchAll(/data-lang="([^"]+)"/g)].map((m) => m[1]);
        for (const key of new Set(keys)) {
            for (const lang of LANGS) {
                const value = resolvePath(translations[lang], key);
                assert.equal(
                    typeof value,
                    'string',
                    `data-lang '${key}' in ${file} does not resolve to a string in '${lang}'`
                );
                assert.notEqual(value.trim(), '', `data-lang '${key}' in ${file} is empty in '${lang}'`);
            }
        }
    }
});

test('every data-lang key used in contacts/index.html exists in all languages (issue #74)', () => {
    const page = path.join(ROOT, 'contacts', 'index.html');
    assert.ok(fs.existsSync(page), 'contacts/index.html is missing');
    const keys = [...fs.readFileSync(page, 'utf8').matchAll(/data-lang="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(keys.length > 0, 'no data-lang attributes found in contacts/index.html');
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

test('EN is the default language (issue #84)', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.match(html, /<html[^>]*lang="en"/i, 'html element must declare lang="en"');
    const i18n = fs.readFileSync(path.join(ROOT, 'js', 'i18n.js'), 'utf8');
    assert.match(
        i18n,
        /let currentLanguage = 'en';/,
        "the initial language in js/i18n.js must be 'en'"
    );
});

test('the language switcher lists all active languages with EN selected (issue #84)', () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const selectMatch = html.match(/<select[^>]*id="lang-select"[\s\S]*?<\/select>/);
    assert.ok(selectMatch, 'no #lang-select switcher found in index.html');
    const options = [...selectMatch[0].matchAll(/<option[^>]*value="([^"]+)"/g)]
        .map((m) => m[1]);
    assert.deepEqual(
        options.slice().sort(),
        LANGS.slice().sort(),
        'the switcher must list exactly the active languages'
    );
    const enOption = selectMatch[0]
        .match(/<option[^>]*>/g)
        ?.find((tag) => tag.includes('value="en"'));
    assert.ok(
        enOption && /\bselected\b/.test(enOption),
        'the EN option must be the default selection'
    );
});

test('ME (Montenegrin) covers the corporate/legal sections (issue #84)', () => {
    const corporateKeys = [
        'contact.title',
        'contact.message',
        'footer.github',
        'footer.bluesky',
        'footer.email',
        'footer.youtube',
        'footer.steam',
        'footer.copyright',
        'about.title',
        'about.text',
        'about.text2',
    ];
    for (const key of corporateKeys) {
        const value = resolvePath(translations.me, key);
        assert.equal(typeof value, 'string', `me.${key} is not a string`);
        assert.notEqual(value.trim(), '', `me.${key} is empty`);
    }
});
