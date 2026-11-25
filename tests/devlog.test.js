'use strict';

// Auto tests for the /devlog section (issue #75): the Git-based Markdown
// CMS. Run with: node --test tests/*.test.js
//
// Guards:
// - the data/devlog.json manifest matches the Markdown posts in
//   devlog/posts/ (same slugs, same frontmatter values, newest first);
// - the generated list page (devlog/index.html) carries every post, every
//   project-tag filter and the i18n -> main -> devlog script order;
// - every generated post page (devlog/{slug}/index.html) carries the
//   title, date, type badge, project tags, a back link and a non-empty
//   article;
// - embedded media renders non-blockingly: YouTube posts embed the
//   verified video IDs as lazy iframes, local video posts use
//   <video poster data-src preload="none"> with committed media files;
// - every data-lang key used on the devlog pages exists in all 5
//   languages;
// - scripts/build-devlog.js --check passes (deterministic artifacts);
// - the Ecliptica hub links into the devlog (EndrII review) and the
//   sitemap lists every devlog route.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const LANGS = ['en', 'ru', 'me', 'de', 'es'];
const DEVLOG_DIR = path.join(ROOT, 'devlog');
const POSTS_DIR = path.join(DEVLOG_DIR, 'posts');

/* ------------------------------------------------------------------------ */
/* Manifest + Markdown sources                                               */
/* ------------------------------------------------------------------------ */

/** Parse the frontmatter block of a Markdown post (key: value lines;
 *  tags is a comma-separated list). Only the subset used by the CMS. */
function parseFrontmatter(raw) {
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    assert.ok(m, 'post is missing the --- frontmatter block');
    const [, fmRaw, body] = m;
    const fm = {};
    for (const line of fmRaw.split(/\r?\n/)) {
        const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
        if (!kv) continue;
        fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
    }
    if (typeof fm.tags === 'string') {
        fm.tags = fm.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    return { fm, body };
}

function readManifest() {
    const raw = fs.readFileSync(path.join(ROOT, 'data', 'devlog.json'), 'utf8');
    const data = JSON.parse(raw);
    assert.ok(Array.isArray(data.posts), 'data/devlog.json must have a posts array');
    return data;
}

function readMarkdownPosts() {
    const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')).sort();
    assert.ok(files.length > 0, 'expected at least one Markdown post in devlog/posts/');
    return files.map((file) => {
        const slug = file.slice(0, -3);
        const { fm, body } = parseFrontmatter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
        assert.ok(fm.title && fm.date && fm.type && fm.excerpt, `${file}: title, date, type and excerpt are required`);
        assert.ok(Array.isArray(fm.tags) && fm.tags.length > 0, `${file}: tags must be a non-empty list`);
        assert.ok(body.trim().length > 0, `${file}: the post body must not be empty`);
        return { slug, ...fm };
    });
}

test('data/devlog.json is a valid manifest that matches devlog/posts/', () => {
    const manifest = readManifest();
    const markdown = readMarkdownPosts();

    assert.ok(manifest.posts.length === markdown.length, 'manifest must contain exactly one entry per Markdown post');

    const bySlug = new Map(manifest.posts.map((p) => [p.slug, p]));
    for (const post of markdown) {
        const entry = bySlug.get(post.slug);
        assert.ok(entry, `manifest is missing post '${post.slug}'`);
        assert.equal(entry.title, post.title, `${post.slug}: title mismatch`);
        assert.equal(entry.date, post.date, `${post.slug}: date mismatch`);
        assert.equal(entry.type, post.type, `${post.slug}: type mismatch`);
        assert.equal(entry.excerpt, post.excerpt, `${post.slug}: excerpt mismatch`);
        assert.deepEqual(entry.tags, post.tags, `${post.slug}: tags mismatch`);
    }
    for (const entry of manifest.posts) {
        assert.ok(fs.existsSync(path.join(POSTS_DIR, `${entry.slug}.md`)), `manifest slug '${entry.slug}' has no Markdown source`);
    }

    // Newest first.
    const dates = manifest.posts.map((p) => p.date);
    assert.deepEqual(dates, [...dates].sort().reverse(), 'posts must be sorted newest first');
});

test('a generated page exists for every post plus the list page', () => {
    assert.ok(fs.existsSync(path.join(DEVLOG_DIR, 'index.html')), 'devlog/index.html is missing');
    for (const post of readMarkdownPosts()) {
        const page = path.join(DEVLOG_DIR, post.slug, 'index.html');
        assert.ok(fs.existsSync(page), `generated page missing for post '${post.slug}'`);
    }
});

/* ------------------------------------------------------------------------ */
/* List page                                                                 */
/* ------------------------------------------------------------------------ */

test('the list page shows every post, the tag filters and the devlog script chain', () => {
    const html = fs.readFileSync(path.join(DEVLOG_DIR, 'index.html'), 'utf8');
    const manifest = readManifest();

    assert.ok(html.includes('<h1 class="section-title" data-lang="devlog.listTitle">'), 'list page is missing the localized h1');
    assert.ok(html.includes('id="devlog-list"'), 'list page is missing the #devlog-list container');

    // Filters: "all" plus every project tag used by any post.
    const tags = [...new Set(manifest.posts.flatMap((p) => p.tags))].sort();
    assert.ok(html.includes('data-filter="all"'), 'list page is missing the "all" filter');
    for (const tag of tags) {
        assert.ok(html.includes(`data-filter="${tag}"`), `list page is missing the '${tag}' filter`);
    }

    // One item per post, newest first, with a link + title + date.
    const hrefs = [...html.matchAll(/<a class="devlog-item-link" href="([^"]+)">/g)].map((m) => m[1]);
    assert.deepEqual(
        hrefs,
        manifest.posts.map((p) => `/devlog/${p.slug}/`),
        'list page must link every post in newest-first order'
    );
    for (const post of manifest.posts) {
        assert.ok(html.includes(`<time datetime="${post.date}">`), `list page is missing the date of '${post.slug}'`);
    }

    // No-results fallback (hidden until JS hides every item).
    assert.ok(html.includes('class="devlog-no-results" hidden'), 'list page is missing the hidden no-results fallback');

    // Script chain: i18n -> main -> devlog.
    const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
    const i18nIdx = scripts.findIndex((s) => s.endsWith('js/i18n.js'));
    const mainIdx = scripts.findIndex((s) => s.endsWith('js/main.js'));
    const devlogIdx = scripts.findIndex((s) => s.endsWith('js/devlog.js'));
    assert.ok(i18nIdx !== -1 && mainIdx !== -1 && devlogIdx !== -1, 'list page must load i18n, main and devlog scripts');
    assert.ok(i18nIdx < mainIdx && mainIdx < devlogIdx, 'scripts must load in the order i18n -> main -> devlog');
});

/* ------------------------------------------------------------------------ */
/* Post pages                                                                */
/* ------------------------------------------------------------------------ */

/** Escape the HTML entity subset the generator emits for titles. */
function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function postPageHtml(slug) {
    const page = path.join(DEVLOG_DIR, slug, 'index.html');
    assert.ok(fs.existsSync(page), `post page missing for '${slug}'`);
    return fs.readFileSync(page, 'utf8');
}

test('every post page carries the title, date, type, tags, back link and article', () => {
    // Project tag slugs -> display names (same map the generator uses).
    const TAG_LABELS = { ecliptica: 'Ecliptica' };
    for (const post of readMarkdownPosts()) {
        const html = postPageHtml(post.slug);
        assert.ok(html.includes(`<h1 class="devlog-post-title">${escapeHtml(post.title)}</h1>`), `${post.slug}: missing the h1 title`);
        assert.ok(html.includes(`<time datetime="${post.date}">`), `${post.slug}: missing the publish date`);
        assert.ok(html.includes(`badge-type-${post.type}`), `${post.slug}: missing the '${post.type}' type badge`);
        assert.ok(html.includes('class="devlog-meta-tags"'), `${post.slug}: missing the project tag block`);
        for (const tag of post.tags) {
            const label = TAG_LABELS[tag] || tag;
            assert.ok(html.includes(`<span class="lang-badge">${label}</span>`), `${post.slug}: missing the '${tag}' tag badge`);
        }
        assert.ok(html.includes('class="devlog-back" href="/devlog/"'), `${post.slug}: missing the back-to-list link`);
        const article = html.match(/<article class="devlog-article">([\s\S]*?)<\/article>/);
        assert.ok(article, `${post.slug}: missing the .devlog-article element`);
        assert.ok(article[1].trim().length > 200, `${post.slug}: the article body looks empty`);
    }
});

test('YouTube posts embed the verified video IDs as lazy iframes', () => {
    const cases = [
        ['ecliptica-predemo-1.5-milestone', 'ASwHlP7EkU4'],
        ['demo-1.0-grenade-launcher', 'cBZpczFAvJI'],
    ];
    for (const [slug, videoId] of cases) {
        const html = postPageHtml(slug);
        assert.ok(
            html.includes(`https://www.youtube.com/embed/${videoId}`),
            `${slug}: must embed the verified YouTube video ${videoId}`
        );
        assert.ok(html.includes('class="devlog-video devlog-video-youtube"'), `${slug}: missing the YouTube figure`);
        assert.ok(html.includes('loading="lazy"'), `${slug}: the YouTube iframe must be lazy-loaded`);
    }
});

test('local video posts use the non-blocking <video poster data-src> contract', () => {
    const cases = [
        ['ecliptica-server-headless-world', 'server-demo.webm'],
        ['fastnoise2-world-generation', 'worldgen-preview.mp4'],
    ];
    for (const [slug, clip] of cases) {
        const html = postPageHtml(slug);
        const media = `/assets/devlog/videos/${clip}`;
        const poster = `/assets/devlog/videos/${clip.replace(/\.[^.]+$/, '')}-poster.webp`;
        assert.ok(html.includes(`data-src="${media}"`), `${slug}: the local video must reference ${clip} via data-src`);
        assert.ok(html.includes(`poster="${poster}"`), `${slug}: the local video must keep its static poster`);
        assert.ok(html.includes('class="devlog-video devlog-video-local"'), `${slug}: missing the local video figure`);

        // The media files are committed (no remote fetch at runtime).
        assert.ok(fs.existsSync(path.join(ROOT, media.slice(1))), `${slug}: ${media} is not committed`);
        assert.ok(fs.existsSync(path.join(ROOT, poster.slice(1))), `${slug}: ${poster} is not committed`);

        // Non-blocking contract: no src on <video>, preload="none", poster kept.
        const videoTag = html.match(/<video[^>]*>/);
        assert.ok(videoTag, `${slug}: missing the <video> element`);
        assert.ok(!/\ssrc=/.test(videoTag[0]), `${slug}: the <video> must not have an inline src (TZ 5.2)`);
        assert.ok(/preload="none"/.test(videoTag[0]), `${slug}: the <video> must set preload="none"`);
        assert.ok(/poster=/.test(videoTag[0]), `${slug}: the <video> must keep its poster attribute`);
    }
});

test('post page images are local and resolve to committed files', () => {
    for (const post of readMarkdownPosts()) {
        const html = postPageHtml(post.slug);
        const imgs = [...html.matchAll(/<img class="devlog-img" src="([^"]+)"[^>]*>/g)].map((m) => m[1]);
        for (const src of imgs) {
            assert.ok(!src.startsWith('http'), `${post.slug}: post images must be local (${src})`);
            // Site-absolute paths resolve against the repository root (the
            // GitHub Pages site root).
            const file = src.startsWith('/')
                ? path.join(ROOT, src.slice(1))
                : path.resolve(path.join(DEVLOG_DIR, post.slug), src);
            assert.ok(fs.existsSync(file), `${post.slug}: image ${src} does not resolve to a committed file`);
        }
    }
});

/* ------------------------------------------------------------------------ */
/* i18n                                                                      */
/* ------------------------------------------------------------------------ */

test('every data-lang key used on the devlog pages exists in all 5 languages', () => {
    const code = fs.readFileSync(path.join(ROOT, 'js', 'i18n.js'), 'utf8');
    const sandbox = {
        console,
        navigator: { languages: [], language: '' },
        localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
        document: {
            addEventListener: () => {},
            querySelector: () => null,
            querySelectorAll: () => [],
            documentElement: { setAttribute: () => {}, getAttribute: () => null },
        },
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: 'js/i18n.js' });
    const translations = vm.runInContext('translations', sandbox, { filename: 'js/i18n.js' });

    function resolvePath(tree, dotPath) {
        let value = tree;
        for (const part of dotPath.split('.')) {
            if (value === null || typeof value !== 'object') return undefined;
            value = value[part];
        }
        return value;
    }

    const pages = [path.join(DEVLOG_DIR, 'index.html')];
    for (const post of readMarkdownPosts()) pages.push(path.join(DEVLOG_DIR, post.slug, 'index.html'));

    for (const page of pages) {
        const keys = [...new Set([...fs.readFileSync(page, 'utf8').matchAll(/data-lang="([^"]+)"/g)].map((m) => m[1]))];
        assert.ok(keys.length > 0, `${path.relative(ROOT, page)}: expected data-lang keys`);
        for (const key of keys) {
            for (const lang of LANGS) {
                const value = resolvePath(translations[lang], key);
                assert.ok(
                    typeof value === 'string' && value.trim().length > 0,
                    `data-lang '${key}' (${path.relative(ROOT, page)}) is missing or empty in '${lang}'`
                );
            }
        }
    }
});

/* ------------------------------------------------------------------------ */
/* Cross-page checks                                                         */
/* ------------------------------------------------------------------------ */

test('the Ecliptica hub links into the Ecliptica devlog feed (EndrII review)', () => {
    const html = fs.readFileSync(path.join(ROOT, 'ecliptica.html'), 'utf8');
    assert.ok(html.includes('href="/devlog/?tag=ecliptica"'), 'ecliptica.html must link to /devlog/?tag=ecliptica');
    assert.ok(html.includes('ecliptica-devlog-section'), 'ecliptica.html is missing the devlog teaser section');
});

test('the sitemap lists the devlog list page and every post page', () => {
    const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
    assert.ok(sitemap.includes('<loc>https://quasarapp.me/devlog/</loc>'), 'sitemap is missing /devlog/');
    for (const post of readMarkdownPosts()) {
        assert.ok(
            sitemap.includes(`<loc>https://quasarapp.me/devlog/${post.slug}/</loc>`),
            `sitemap is missing /devlog/${post.slug}/`
        );
    }
});

test('scripts/build-devlog.js --check passes (generated artifacts in sync)', () => {
    const out = execFileSync(process.execPath, ['scripts/build-devlog.js', '--check'], { cwd: ROOT, encoding: 'utf8' });
    assert.match(out, /in sync/);
});
