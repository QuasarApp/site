'use strict';

// Auto tests for the /contacts page (issue #74):
// - anti-spam contact form: validation fields, honeypot, loading/success/
//   error states, graceful mailto fallback with a visible notice
// - official links block: only verified URLs (no invented external links)
// - legal details block: company name + registered office (Bar, Montenegro)
//   + PIB, with values consistent across all languages
// Run with: node --test tests/*.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const PAGE = path.join(ROOT, 'contacts', 'index.html');
const html = fs.readFileSync(PAGE, 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'js', 'contacts.js'), 'utf8');
const LANGS = ['en', 'ru', 'me', 'de', 'es'];

/** Load js/i18n.js in a VM sandbox (same helper approach as i18n.test.js). */
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

const translations = loadTranslations();

function resolvePath(tree, dotPath) {
    let value = tree;
    for (const part of dotPath.split('.')) {
        if (value === null || typeof value !== 'object') return undefined;
        value = value[part];
    }
    return value;
}

test('contacts page exists and is a well-formed HTML document', () => {
    assert.match(html, /^\s*<!DOCTYPE html>/i, 'missing DOCTYPE');
    assert.match(html, /<html[^>]*lang="en"/i, 'html element must declare lang="en"');
    const m = html.match(/<title>([^<]*)<\/title>/i);
    assert.ok(m && m[1].trim() !== '', 'missing or empty <title>');
    assert.match(html, /<meta[^>]+charset=["']?utf-8/i, 'missing charset');
    assert.match(html, /<meta[^>]+name=["']?viewport["']?/i, 'missing viewport');
});

test('contact form has the required fields with client-side validation (issue #74)', () => {
    assert.match(html, /<form[^>]+id=["']contact-form["']/, 'contact form missing');
    const nameInput = html.match(/<input[^>]+id=["']cf-name["'][^>]*>/);
    const emailInput = html.match(/<input[^>]+id=["']cf-email["'][^>]*>/);
    const messageInput = html.match(/<textarea[^>]+id=["']cf-message["'][^>]*>/);
    assert.ok(nameInput, 'form field #cf-name missing');
    assert.ok(emailInput, 'form field #cf-email missing');
    assert.ok(messageInput, 'form field #cf-message missing');
    assert.match(nameInput[0], /type=["']text["']/, '#cf-name must be type=text');
    assert.match(emailInput[0], /type=["']email["']/, '#cf-email must be type=email');
    for (const m of [nameInput[0], emailInput[0], messageInput[0]]) {
        assert.match(m, /required/, 'a contact form field must be required');
    }
    assert.match(messageInput[0], /minlength=["']10["']/, 'message must have a minimum length');
});

test('contact form has anti-spam protection: honeypot + optional Turnstile (issue #74)', () => {
    assert.match(html, /class=["'][^"']*cf-hp[^"']*"/, 'honeypot wrapper missing');
    const hp = html.match(/<input[^>]+id=["']cf-website["'][^>]*>/);
    assert.ok(hp, 'honeypot input #cf-website missing');
    assert.match(hp[0], /tabindex=["']-1["']/, 'honeypot must be out of the tab order');
    assert.match(html, /id=["']cf-turnstile["']/, 'Turnstile container missing');
    assert.match(js, /challenges\.cloudflare\.com\/turnstile/, 'Turnstile script not wired in js/contacts.js');
    // No third-party script may be statically referenced in the page.
    assert.doesNotMatch(
        html.replace(/<!--[\s\S]*?-->/g, ''),
        /<script[^>]+src=["'](https?:[^"']+|\/\/[^"']+)["']/i,
        'contacts page must not statically load third-party scripts'
    );
});

test('contact form exposes loading/success/error states and a visible fallback notice (issue #74)', () => {
    assert.match(html, /id=["']cf-status["'][^>]*aria-live=["']polite["']/, 'status region missing');
    assert.match(html, /id=["']cf-submit["']/, 'submit button missing');
    assert.match(js, /'loading'/, 'loading state missing in js/contacts.js');
    assert.match(js, /'success'/, 'success state missing in js/contacts.js');
    assert.match(js, /'error'/, 'error state missing in js/contacts.js');
    const notice = html.match(/<p[^>]+id=["']cf-notice["'][^>]*>/);
    assert.ok(notice, 'visible fallback notice missing');
    assert.match(notice[0], /role=["']note["']/, 'fallback notice must have role="note"');
    // The graceful fallback targets the verified company email address.
    assert.match(js, /FALLBACK_MAILTO\s*=\s*'quasarappdevelop@gmail\.com'/, 'mailto fallback must target quasarappdevelop@gmail.com');
});

// External links allowed on the contacts page. Everything else would be an
// invented URL, which the issue explicitly forbids. GitHub, Steam, Bluesky,
// YouTube and the email address are the verified links already in use on
// the site; Discord, Telegram and Reddit come from the official Ecliptica
// Steam store page (verified 2026-11-22).
const ALLOWED_EXTERNAL = [
    'https://github.com/QuasarApp',
    'https://store.steampowered.com/app/3723390/Ecliptica/',
    'https://discord.gg/FRpw2565Sy',
    'https://t.me/+vyrQidUgV8U5NjI6',
    'https://www.reddit.com/r/Ecliptica/',
    'https://bsky.app/profile/quasarapp.bsky.social',
    'https://www.youtube.com/@quasarappcore',
    'https://store.steampowered.com/curator/45704880',
];

test('official links block contains all required channels (issue #74)', () => {
    assert.match(html, /<section[^>]+id=["']links["']/, 'links section missing');
    for (const url of ALLOWED_EXTERNAL.slice(0, 7)) {
        assert.ok(html.includes(url), `official link missing: ${url}`);
    }
    assert.match(html, /mailto:quasarappdevelop@gmail\.com/, 'verified email link missing');
});

test('no invented external URLs on the contacts page (issue #74)', () => {
    const refs = [...html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)]
        .map((m) => m[1].trim())
        .filter((ref) => /^https?:\/\//i.test(ref));
    assert.ok(refs.length > 0, 'no external links found');
    for (const ref of refs) {
        assert.ok(
            ALLOWED_EXTERNAL.includes(ref),
            `unverified external link found on the contacts page: ${ref}`
        );
    }
});

test('legal details block shows company name, registered office in Bar, Montenegro and PIB (issue #74)', () => {
    assert.match(html, /<section[^>]+id=["']legal["']/, 'legal section missing');
    assert.match(html, /QuasarApp Group d\.o\.o\./, 'company name missing');
    assert.match(html, /03602524/, 'PIB missing from the legal block');
    // The city may be localized (e.g. Cyrillic "Бар" in Russian).
    const cityPatterns = {
        en: /Bar/i,
        ru: /Бар/i,
        me: /Bar/i,
        de: /Bar/i,
        es: /Bar/i,
    };
    for (const lang of LANGS) {
        assert.equal(
            resolvePath(translations[lang], 'contacts.legalCompanyValue'),
            'QuasarApp Group d.o.o.',
            `${lang}.contacts.legalCompanyValue must be the company name`
        );
        const office = resolvePath(translations[lang], 'contacts.legalOfficeValue');
        assert.equal(typeof office, 'string', `${lang}.contacts.legalOfficeValue missing`);
        assert.match(office, cityPatterns[lang], `${lang}.contacts.legalOfficeValue must mention Bar`);
        assert.match(
            office,
            /Montenegro|Crna Gora|Черногория/i,
            `${lang}.contacts.legalOfficeValue must mention Montenegro`
        );
        assert.equal(
            resolvePath(translations[lang], 'contacts.legalPibValue'),
            '03602524',
            `${lang}.contacts.legalPibValue must carry the registry PIB`
        );
    }
});

test('the home page links to the /contacts page (issue #74)', () => {
    const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    assert.match(home, /href=["']\/contacts["']/, 'home page must link to /contacts');
});
