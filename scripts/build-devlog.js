#!/usr/bin/env node
'use strict';

// QuasarApp site - Devlog build script (issue #75, TZ section 2.4)
//
// Git-based CMS for the /devlog section. The Markdown files in
// devlog/posts/ are the single source of truth; this script renders
// them into the static artifacts that GitHub Pages serves:
//
//   devlog/posts/{slug}.md  ->  data/devlog.json          (manifest: home
//                                        feed + /devlog list page)
//                             ->  devlog/index.html       (list page with
//                                        project-tag filter)
//                             ->  devlog/{slug}/index.html (post page:
//                                        title/date/tags in the DOM,
//                                        rendered Markdown, embedded
//                                        video and images)
//                             ->  sitemap.xml             (the /devlog/
//                                        entries are kept in sync)
//
// Adding a new post is a content change, not a code change: write
// devlog/posts/{slug}.md, then run
//
//     node scripts/build-devlog.js
//
// and commit the generated files. `--check` verifies that the committed
// artifacts are in sync with the Markdown collection (used by
// tests/devlog.test.js and CI):
//
//     node scripts/build-devlog.js --check
//
// Dependency-free, Node >= 18 (same contract as the other build-time
// scripts in scripts/).
//
// Frontmatter (required):
//   title:    Post title
//   date:     Publication date, YYYY-MM-DD
//   tags:     Comma-separated project tags (e.g. "ecliptica" or
//             "ecliptica, cqtdeployer")
//   type:     devlog | patch-notes | engine-insight
//   excerpt:  One or two sentences shown in the feeds
//
// Markdown subset (everything else is escaped, never injected):
//   ## headings (shifted one level down - the post title owns <h1>),
//   paragraphs, **bold**, *italic*, `inline code`, ``` fenced code blocks,
//   - and 1. lists, > blockquotes, --- horizontal rules,
//   [links](https://... | /site-absolute | mailto:),
//   ![alt](/path/image.webp)            -> lazy-loaded <img>,
//   ![video](https://youtu.be/ID)       -> lazy YouTube <iframe>,
//   ![video](/path/clip.mp4 | .webm)    -> <video controls> with a static
//                                          poster (the poster must be
//                                          committed as {clip}-poster.webp
//                                          next to the video file).

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const SITE_BASE = 'https://quasarapp.me';
const POST_TYPES = ['devlog', 'patch-notes', 'engine-insight'];
const TYPE_META = {
    'devlog': { key: 'devlog', icon: 'icon-bell' },
    'patch-notes': { key: 'patchNotes', icon: 'icon-send' },
    'engine-insight': { key: 'engineInsight', icon: 'icon-tool' },
};

// Project tag slugs -> display names (product names stay untranslated).
const TAG_DISPLAY_NAMES = {
    ecliptica: 'Ecliptica',
    cqtdeployer: 'CQtDeployer',
    cheatcard: 'CheatCard',
    yourtimedelivery: 'YourTimeDelivery',
    qtssecret: 'Qt-Secret',
    heart: 'Heart',
};

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

function tagName(slug) {
    return TAG_DISPLAY_NAMES[slug] || (slug.charAt(0).toUpperCase() + slug.slice(1));
}

function formatDateLong(isoDate) {
    const parts = String(isoDate).split('-').map(Number);
    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return isoDate;
    return `${MONTHS[parts[1] - 1] || ''} ${parts[2]}, ${parts[0]}`.trim();
}

// ---------------------------------------------------------------------------
// Frontmatter
// ---------------------------------------------------------------------------

/**
 * Split a post file into { meta, body }. Throws on invalid frontmatter so
 * a broken post fails the build (and CI) instead of shipping a broken page.
 */
function parseFrontmatter(source, fileName) {
    const lines = source.replace(/\r\n/g, '\n').split('\n');
    if (lines[0] !== '---') {
        throw new Error(`${fileName}: post must start with a '---' frontmatter line`);
    }
    let end = -1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i] === '---') { end = i; break; }
    }
    if (end === -1) {
        throw new Error(`${fileName}: frontmatter is not closed with '---'`);
    }
    const meta = {};
    for (let i = 1; i < end; i++) {
        const line = lines[i];
        if (line.trim() === '') continue;
        const sep = line.indexOf(':');
        if (sep === -1) throw new Error(`${fileName}: frontmatter line is not 'key: value': '${line}'`);
        const key = line.slice(0, sep).trim();
        const value = line.slice(sep + 1).trim();
        if (Object.prototype.hasOwnProperty.call(meta, key)) {
            throw new Error(`${fileName}: duplicate frontmatter key '${key}'`);
        }
        meta[key] = value;
    }
    const known = ['title', 'date', 'tags', 'type', 'excerpt'];
    for (const key of Object.keys(meta)) {
        if (!known.includes(key)) {
            throw new Error(`${fileName}: unknown frontmatter key '${key}' (allowed: ${known.join(', ')})`);
        }
    }
    for (const key of known) {
        if (meta[key] === undefined || meta[key] === '') {
            throw new Error(`${fileName}: missing required frontmatter key '${key}'`);
        }
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || Number.isNaN(Date.parse(meta.date))) {
        throw new Error(`${fileName}: 'date' must be a valid YYYY-MM-DD date, got '${meta.date}'`);
    }
    const tags = meta.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '');
    if (tags.length === 0) throw new Error(`${fileName}: 'tags' must list at least one project tag`);
    for (const tag of tags) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag)) {
            throw new Error(`${fileName}: tag '${tag}' must be a lowercase slug (a-z, 0-9, '-')`);
        }
    }
    if (!POST_TYPES.includes(meta.type)) {
        throw new Error(`${fileName}: 'type' must be one of ${POST_TYPES.join(', ')}, got '${meta.type}'`);
    }
    return { meta, body: lines.slice(end + 1).join('\n') };
}

const SLUG_RE = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

/** Load + validate every post in the collection, newest first. */
function loadPosts(root) {
    const postsDir = path.join(root, 'devlog', 'posts');
    if (!fs.existsSync(postsDir)) return [];
    const slugs = new Set();
    const posts = [];
    for (const name of fs.readdirSync(postsDir).sort()) {
        if (!name.toLowerCase().endsWith('.md')) continue;
        const slug = name.slice(0, -3);
        if (!SLUG_RE.test(slug)) {
            throw new Error(`devlog/posts/${name}: file name must be a lowercase slug (a-z, 0-9, '-', '.')`);
        }
        if (slugs.has(slug)) throw new Error(`devlog/posts/${name}: duplicate slug '${slug}'`);
        slugs.add(slug);
        const { meta, body } = parseFrontmatter(
            fs.readFileSync(path.join(postsDir, name), 'utf8'),
            `devlog/posts/${name}`
        );
        posts.push({
            slug,
            title: meta.title,
            date: meta.date,
            tags: [...new Set(meta.tags.split(',').map((t) => t.trim()).filter(Boolean))],
            type: meta.type,
            excerpt: meta.excerpt,
            body,
        });
    }
    posts.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));
    return posts;
}

// ---------------------------------------------------------------------------
// Markdown rendering (escape-first: content can never inject HTML)
// ---------------------------------------------------------------------------

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Allow only safe destinations: http(s), mailto:, site-absolute paths and
 * in-page anchors. Everything else (javascript:, relative paths, ...) is
 * dropped so the generated page cannot point at an unsafe resource.
 */
function sanitizeUrl(url) {
    const u = String(url).trim();
    if (/^https?:\/\//i.test(u)) return u;
    if (/^mailto:/i.test(u)) return u;
    if (/^\/(?!\/)/.test(u)) return u;
    if (/^#/.test(u)) return u;
    return null;
}

const YOUTUBE_ID_RE = /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/)|(?:www\.)?youtu\.be\/)([A-Za-z0-9_-]{11})/i;

function videoFigureHtml(url, options) {
    const root = (options && options.root) || ROOT;
    const youtube = url.match(YOUTUBE_ID_RE);
    if (youtube) {
        const id = youtube[1];
        return (
            '<figure class="devlog-video devlog-video-youtube">\n' +
            `    <iframe src="https://www.youtube.com/embed/${id}" title="Embedded video" loading="lazy" ` +
            'allow="accelerometer; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>\n' +
            '</figure>'
        );
    }
    if (/\.(mp4|webm)(?:\?.*)?$/i.test(url)) {
        if (!/^\/(?!\/)/.test(url)) {
            throw new Error(`local video must use a site-absolute path, got '${url}'`);
        }
        const poster = url.replace(/\.(mp4|webm)(?:\?.*)?$/i, '-poster.webp');
        for (const ref of [url.split('?')[0], poster]) {
            const file = path.join(root, ref.slice(1));
            if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
                throw new Error(`local video media missing: '${ref}' (commit the file, and the poster as {clip}-poster.webp)`);
            }
        }
        return (
            '<figure class="devlog-video devlog-video-local">\n' +
            `    <video class="devlog-video-el" controls playsinline preload="none" poster="${escapeHtml(poster)}" data-src="${escapeHtml(url)}"></video>\n` +
            '</figure>'
        );
    }
    throw new Error(`unsupported video URL (expected YouTube or /path/clip.mp4|.webm): '${url}'`);
}

function imageFigureHtml(alt, url, options) {
    const safe = sanitizeUrl(url);
    if (!safe) throw new Error(`image URL is not allowed: '${url}'`);
    // A media URL (YouTube or local .mp4/.webm) is always a video, no
    // matter what the alt text says - content authors can write either
    // ![video](url) or ![alt text](url).
    if (YOUTUBE_ID_RE.test(safe) || /\.(mp4|webm)(?:\?.*)?$/i.test(safe)) {
        return videoFigureHtml(safe, options);
    }
    return (
        '<figure class="devlog-fig">\n' +
        `    <img class="devlog-img" src="${escapeHtml(safe)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">\n` +
        '</figure>'
    );
}

/**
 * A whole line that is a single media directive (image/video) renders as
 * its own block so the <figure> is never nested inside a <p>.
 * Returns null when the line is not a standalone media directive.
 */
function mediaDirectiveHtml(line, options) {
    const m = String(line).trim().match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (!m) return null;
    return imageFigureHtml(m[1], m[2], options);
}

function renderInline(raw, options) {
    let text = escapeHtml(raw);
    const codes = [];
    text = text.replace(/`([^`]+)`/g, (m, code) => {
        codes.push(`<code>${code}</code>`);
        return `\u0000${codes.length - 1}\u0000`;
    });
    text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => imageFigureHtml(alt, url, options));
    text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, url) => {
        const safe = sanitizeUrl(url);
        if (!safe) return escapeHtml(label);
        const external = /^https?:\/\//i.test(safe) ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeHtml(safe)}"${external}>${label}</a>`;
    });
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    text = text.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
    text = text.replace(/(^|[\s(-])_([^_\n]+)_(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
    text = text.replace(/\u0000(\d+)\u0000/g, (m, i) => codes[Number(i)]);
    return text;
}

function renderList(items, options) {
    const out = [];
    let run = [];
    let ordered = null;
    const flush = () => {
        if (run.length === 0) return;
        const tag = run[0].ordered ? 'ol' : 'ul';
        out.push(`<${tag}>${run.map((it) => `<li>${renderInline(it.text, options)}</li>`).join('')}</${tag}>`);
        run = [];
    };
    for (const item of items) {
        if (ordered === null) ordered = item.ordered;
        if (item.ordered !== ordered) {
            flush();
            ordered = item.ordered;
        }
        run.push(item);
    }
    flush();
    return out.join('\n');
}

const LIST_ITEM_RE = /^(\s*)([-*]|\d+\.)\s+/;

function renderMarkdown(source, options) {
    const lines = String(source).replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (/^\s*$/.test(line)) { i += 1; continue; }

        const fence = line.match(/^```\s*([A-Za-z0-9+#-]*)\s*$/);
        if (fence) {
            const code = [];
            i += 1;
            while (i < lines.length && !/^```\s*$/.test(lines[i])) { code.push(lines[i]); i += 1; }
            i += 1; // consume the closing fence (missing fence: run to EOF)
            const lang = fence[1] ? ` class="language-${fence[1]}"` : '';
            out.push(`<pre><code${lang}>${escapeHtml(code.join('\n'))}</code></pre>`);
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.*)$/);
        if (heading) {
            // The post title owns <h1>; body headings shift down one level.
            const level = Math.min(heading[1].length + 1, 6);
            out.push(`<h${level}>${renderInline(heading[2].trim(), options)}</h${level}>`);
            i += 1;
            continue;
        }

        if (/^\s*---+\s*$/.test(line)) { out.push('<hr>'); i += 1; continue; }

        if (/^\s*>\s?/.test(line)) {
            const quote = [];
            while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
                quote.push(lines[i].replace(/^\s*>\s?/, ''));
                i += 1;
            }
            out.push(`<blockquote>\n${renderMarkdown(quote.join('\n'), options)}\n</blockquote>`);
            continue;
        }

        if (LIST_ITEM_RE.test(line)) {
            const items = [];
            while (i < lines.length) {
                if (LIST_ITEM_RE.test(lines[i])) {
                    const m = lines[i].match(LIST_ITEM_RE);
                    items.push({ ordered: /^\d+\./.test(m[2]), text: lines[i].replace(LIST_ITEM_RE, '') });
                } else if (/^\s{2,}\S/.test(lines[i]) && items.length > 0) {
                    items[items.length - 1].text += ' ' + lines[i].trim();
                } else {
                    break;
                }
                i += 1;
            }
            out.push(renderList(items, options));
            continue;
        }

        const media = mediaDirectiveHtml(line, options);
        if (media !== null) { out.push(media); i += 1; continue; }

        const para = [line];
        i += 1;
        while (
            i < lines.length &&
            !/^\s*$/.test(lines[i]) &&
            !LIST_ITEM_RE.test(lines[i]) &&
            !/^#{1,6}\s/.test(lines[i]) &&
            !/^```/.test(lines[i]) &&
            !/^\s*---+\s*$/.test(lines[i]) &&
            !/^\s*>\s?/.test(lines[i]) &&
            mediaDirectiveHtml(lines[i], options) === null
        ) {
            para.push(lines[i]);
            i += 1;
        }
        out.push(`<p>${renderInline(para.join(' '), options)}</p>`);
    }
    return out.join('\n');
}

// ---------------------------------------------------------------------------
// Page chrome (nav/footer/sprite - same markup as the hand-written pages)
// ---------------------------------------------------------------------------

const SVG_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;" aria-hidden="true" focusable="false">
        <symbol id="icon-github" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></symbol>
        <symbol id="icon-steam" viewBox="0 0 24 24"><path fill="currentColor" d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/></symbol>
        <symbol id="icon-youtube" viewBox="0 0 24 24"><path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></symbol>
        <symbol id="icon-heart" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></symbol>
        <symbol id="icon-mail" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></g></symbol>
        <symbol id="icon-send" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></symbol>
        <symbol id="icon-tool" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></symbol>
        <symbol id="icon-bell" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></g></symbol>
    </svg>`;

function navHtml(prefix) {
    return `    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">
                <a href="/">
                    <img src="${prefix}assets/images/logo.png.webp" srcset="${prefix}assets/images/logo-100.webp 100w, ${prefix}assets/images/logo.png.webp 512w" sizes="50px" alt="QuasarApp" class="nav-logo" width="50" height="50">
                    <span>QuasarApp</span>
                </a>
            </div>
            <ul class="nav-links" aria-label="Main navigation">
                <li><a href="/" data-lang="nav.home">Home</a></li>
                <li><a href="/devlog/" data-lang="nav.devlog">Devlog</a></li>
                <li><a href="mailto:quasarappdevelop@gmail.com" data-lang="nav.contact">Contact</a></li>
                <li>
                    <select id="lang-select" class="lang-select" aria-label="Toggle language" onchange="selectLanguage(this.value)">
                        <option value="en" selected>EN</option>
                        <option value="ru">RU</option>
                        <option value="me">ME</option>
                        <option value="de">DE</option>
                        <option value="es">ES</option>
                    </select>
                </li>
            </ul>
        </div>
    </nav>`;
}

function footerHtml() {
    return `    <footer class="footer" role="contentinfo">
        <div class="container">
            <div class="footer-social">
                <a href="https://github.com/QuasarApp" class="social-link">
                    <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-github"></use></svg>
                    <span data-lang="footer.github">GitHub</span>
                </a>
                <a href="mailto:quasarappdevelop@gmail.com" class="social-link">
                    <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-mail"></use></svg>
                    <span data-lang="footer.email">Email</span>
                </a>
                <a href="https://www.youtube.com/@quasarappcore" class="social-link" target="_blank">
                    <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-youtube"></use></svg>
                    <span data-lang="footer.youtube">YouTube</span>
                </a>
                <a href="https://store.steampowered.com/curator/45704880" class="social-link" target="_blank">
                    <svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-steam"></use></svg>
                    <span data-lang="footer.steam">Steam</span>
                </a>
            </div>
            <div class="footer-bottom">
                <p data-lang="footer.copyright">&copy; 2026 QuasarApp Group. All rights reserved.</p>
                <p class="made-with"><svg class="icon" aria-hidden="true" focusable="false"><use href="#icon-heart"></use></svg> Made with <span class="glow">passion</span></p>
            </div>
        </div>
    </footer>`;
}

function typeBadge(type) {
    const meta = TYPE_META[type];
    return (
        `                <span class="devlog-type-badge badge-type-${type}">\n` +
        `                    <svg class="icon" aria-hidden="true" focusable="false"><use href="#${meta.icon}"></use></svg>\n` +
        `                    <span data-lang="devlog.type.${meta.key}">${escapeHtml(type)}</span>\n` +
        '                </span>'
    );
}

function tagBadges(tags) {
    return tags.map((tag) => `                        <span class="lang-badge">${escapeHtml(tagName(tag))}</span>`).join('\n');
}

// ---------------------------------------------------------------------------
// Page templates
// ---------------------------------------------------------------------------

function listPageHtml(posts) {
    const tagsInOrder = [];
    for (const post of posts) {
        for (const tag of post.tags) {
            if (!tagsInOrder.includes(tag)) tagsInOrder.push(tag);
        }
    }
    const filterButtons = [
        '                    <button type="button" class="devlog-filter-btn active" data-filter="all" data-lang="devlog.filterAll">All projects</button>',
        ...tagsInOrder.map(
            (tag) =>
                `                    <button type="button" class="devlog-filter-btn" data-filter="${escapeHtml(tag)}">${escapeHtml(tagName(tag))}</button>`
        ),
    ].join('\n');
    const items = posts
        .map(
            (post) =>
                `                    <article class="devlog-item" data-tags="${escapeHtml(post.tags.join(','))}">
                        <a class="devlog-item-link" href="/devlog/${post.slug}/">
                            <h3 class="devlog-title">${escapeHtml(post.title)}</h3>
                        </a>
                        <div class="devlog-meta">
                            <time datetime="${post.date}">${formatDateLong(post.date)}</time>
${typeBadge(post.type)}
${tagBadges(post.tags)}
                        </div>
                        <p class="devlog-excerpt">${escapeHtml(post.excerpt)}</p>
                        <span class="devlog-cta" data-lang="devlog.readPost">Read post</span>
                    </article>`
        )
        .join('\n');
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Development Logs &mdash; QuasarApp Group</title>
    <meta name="description" content="Development logs, patch notes and engine insights from the QuasarApp studio - Ecliptica first.">
    <meta name="theme-color" content="#0a0e17">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE_BASE}/devlog/">
    <meta property="og:title" content="Development Logs &mdash; QuasarApp Group">
    <meta property="og:description" content="Development logs, patch notes and engine insights from the QuasarApp studio - Ecliptica first.">
    <meta property="og:image" content="${SITE_BASE}/assets/images/banner.webp">

    <link rel="stylesheet" href="../css/style.css">
    <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png">
    <link rel="apple-touch-icon" href="../apple-touch-icon.png">
</head>
<body data-devlog-page="list">
    <!-- Inline SVG icon sprite (issue #81): subset of the index.html sprite. -->
${SVG_SPRITE}
    <a href="#main-content" class="skip-link">Skip to main content</a>

${navHtml('../')}

    <main id="main-content">
        <section class="devlog-list-hero">
            <div class="container">
                <h1 class="section-title" data-lang="devlog.listTitle">Development Logs</h1>
                <p class="section-subtitle" data-lang="devlog.listSubtitle">Development diaries, patch notes and engine insights - written as the milestones ship.</p>
            </div>
        </section>

        <section class="devlog-list-section">
            <div class="container">
                <!-- Project-tag filter (issue #75): js/devlog.js toggles the
                     items below; without JavaScript every post stays
                     visible. ?tag={slug} deep links pre-select a project. -->
                <div class="devlog-filter" role="group" aria-label="Filter by project">
${filterButtons}
                </div>
                <div id="devlog-list" class="devlog-list">
${items}
                </div>
                <p class="devlog-no-results" hidden data-lang="devlog.noResults">No posts for this project yet.</p>
            </div>
        </section>
    </main>

${footerHtml()}

    <script src="../js/i18n.js"></script>
    <script src="../js/main.js"></script>
    <script src="../js/devlog.js"></script>
</body>
</html>
`;
}

function postPageHtml(post, renderedBody) {
    const title = escapeHtml(post.title);
    const excerpt = escapeHtml(post.excerpt);
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} &mdash; QuasarApp Devlog</title>
    <meta name="description" content="${excerpt}">
    <meta name="theme-color" content="#0a0e17">

    <!-- Open Graph (per-post meta is extended by the SEO issue) -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${SITE_BASE}/devlog/${post.slug}/">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${excerpt}">
    <meta property="og:image" content="${SITE_BASE}/assets/images/banner.webp">
    <meta property="article:published_time" content="${post.date}">

    <link rel="stylesheet" href="../../css/style.css">
    <link rel="icon" type="image/png" sizes="32x32" href="../../favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../../favicon-16x16.png">
    <link rel="apple-touch-icon" href="../../apple-touch-icon.png">
</head>
<body data-devlog-page="post">
    <!-- Inline SVG icon sprite (issue #81): subset of the index.html sprite. -->
${SVG_SPRITE}
    <a href="#main-content" class="skip-link">Skip to main content</a>

${navHtml('../../')}

    <main id="main-content">
        <section class="devlog-post-hero">
            <div class="container">
                <a class="devlog-back" href="/devlog/" data-lang="devlog.back">Back to devlog</a>
${typeBadge(post.type)}
                <h1 class="devlog-post-title">${title}</h1>
                <div class="devlog-post-meta">
                    <time datetime="${post.date}">${formatDateLong(post.date)}</time>
                    <span class="devlog-meta-tags" aria-label="Projects">
${tagBadges(post.tags)}
                    </span>
                </div>
            </div>
        </section>

        <section class="devlog-post-section">
            <div class="container">
                <article class="devlog-article">
${renderedBody}
                </article>
            </div>
        </section>
    </main>

${footerHtml()}

    <script src="../../js/i18n.js"></script>
    <script src="../../js/main.js"></script>
    <script src="../../js/devlog.js"></script>
</body>
</html>
`;
}

/** Replace the /devlog/ <url> entries in sitemap.xml with the current posts. */
function syncSitemap(sitemap, posts) {
    const urlBlock = (loc, lastmod, priority) =>
        `    <url>\n        <loc>${loc}</loc>\n        <lastmod>${lastmod}</lastmod>\n        <changefreq>weekly</changefreq>\n        <priority>${priority}</priority>\n    </url>`;
    const devlogUrls = [
        urlBlock(`${SITE_BASE}/devlog/`, posts.length > 0 ? posts[0].date : '2026-11-25', '0.9'),
        ...posts.map((post) => urlBlock(`${SITE_BASE}/devlog/${post.slug}/`, post.date, '0.8')),
    ].join('\n');
    const withoutDevlog = sitemap
        .split(/\n(?=    <url>)/)
        .filter((block) => !/<loc>https:\/\/quasarapp\.me\/devlog\//.test(block))
        .join('\n');
    const withoutEndTag = withoutDevlog.replace(/<\/urlset>\s*$/, '');
    return withoutEndTag.replace(/\s*$/, '\n') + devlogUrls + '\n</urlset>\n';
}

/**
 * Render the whole devlog section from the Markdown collection.
 * Returns { posts, files } where files maps repo-relative paths to the
 * exact content that must be committed. Deterministic for a given
 * collection (no timestamps, stable ordering).
 */
function build(options) {
    const root = (options && options.root) || ROOT;
    const posts = loadPosts(root);
    const files = {};
    files['data/devlog.json'] = JSON.stringify(
        {
            posts: posts.map(({ slug, title, date, tags, type, excerpt }) => ({
                slug, title, date, tags, type, excerpt,
            })),
        },
        null,
        2
    ) + '\n';
    files['devlog/index.html'] = listPageHtml(posts);
    for (const post of posts) {
        files[`devlog/${post.slug}/index.html`] = postPageHtml(
            post,
            renderMarkdown(post.body, { root })
        );
    }
    const sitemapPath = path.join(root, 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
        files['sitemap.xml'] = syncSitemap(fs.readFileSync(sitemapPath, 'utf8'), posts);
    }
    return { posts, files };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

if (require.main === module) {
    const checkOnly = process.argv.includes('--check');
    let result;
    try {
        result = build();
    } catch (err) {
        console.error(`devlog build failed: ${err.message}`);
        process.exit(1);
    }
    if (checkOnly) {
        let drift = 0;
        for (const [rel, content] of Object.entries(result.files)) {
            const onDisk = fs.existsSync(path.join(ROOT, rel))
                ? fs.readFileSync(path.join(ROOT, rel), 'utf8')
                : null;
            if (onDisk !== content) {
                drift += 1;
                console.error(`out of sync: ${rel} (run node scripts/build-devlog.js)`);
            }
        }
        if (drift > 0) {
            process.exit(1);
        }
        console.log(`devlog: ${result.posts.length} post(s), all generated artifacts in sync.`);
        process.exit(0);
    }
    for (const [rel, content] of Object.entries(result.files)) {
        const file = path.join(ROOT, rel);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, content);
        console.log(`wrote ${rel}`);
    }
    console.log(`devlog: ${result.posts.length} post(s) rendered.`);
}

module.exports = {
    build,
    loadPosts,
    parseFrontmatter,
    renderMarkdown,
    sanitizeUrl,
    escapeHtml,
    tagName,
    SLUG_RE,
    POST_TYPES,
    TYPE_META,
    SITE_BASE,
};








