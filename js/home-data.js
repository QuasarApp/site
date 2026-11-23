// QuasarApp Group - Home page data renderers (issue #78)
//
// Progressive enhancement on top of the static markup in index.html:
// - devlog feed: renders the latest posts from the data/devlog.json content
//   collection (issue #75 seeds the collection). When the collection is
//   empty or unreachable, the documented empty state in the markup stays.
//
// The "Technology Stack & open-source footprint" section (GitHub org
// metrics from data/github-org-metrics.json) was removed from the home
// page (EndrII review of PR #96): the cached values are baked into the
// /about page markup instead, so no metrics renderer lives here anymore.
//
// Loads after js/i18n.js so it can reuse `currentLanguage`.
(function () {
    'use strict';

    const MAX_DEVLOG_POSTS = 5;

    function currentLocale() {
        return (typeof currentLanguage !== 'undefined' && currentLanguage) || 'en';
    }

    function loadJson(url) {
        return fetch(url, { cache: 'no-cache' })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
                return res.json();
            });
    }

    function formatPostDate(isoDate) {
        const date = new Date(isoDate);
        if (Number.isNaN(date.getTime())) return String(isoDate);
        try {
            return new Intl.DateTimeFormat(currentLocale(), {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(date);
        } catch (e) {
            return date.toISOString().slice(0, 10);
        }
    }

    /**
     * Render the latest devlog posts into #devlog-feed. All post fields are
     * inserted via textContent (the collection is trusted repo content, but
     * the renderer must not be able to inject HTML).
     */
    function renderDevlogFeed(posts) {
        const feed = document.getElementById('devlog-feed');
        if (!feed || !Array.isArray(posts) || posts.length === 0) return;

        const latest = posts
            .filter((post) => post && post.title && post.slug)
            .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
            .slice(0, MAX_DEVLOG_POSTS);
        if (latest.length === 0) return;

        feed.textContent = '';
        for (const post of latest) {
            const item = document.createElement('article');
            item.className = 'devlog-item';

            const link = document.createElement('a');
            link.href = `/devlog/${post.slug}`;
            const title = document.createElement('h3');
            title.className = 'devlog-title';
            title.textContent = post.title;
            link.appendChild(title);
            item.appendChild(link);

            const meta = document.createElement('div');
            meta.className = 'devlog-meta';
            if (post.date) {
                const time = document.createElement('time');
                time.dateTime = String(post.date);
                time.textContent = formatPostDate(post.date);
                meta.appendChild(time);
            }
            for (const tag of Array.isArray(post.tags) ? post.tags : []) {
                const badge = document.createElement('span');
                badge.className = 'lang-badge';
                badge.textContent = tag;
                meta.appendChild(badge);
            }
            if (meta.childNodes.length > 0) item.appendChild(meta);

            if (post.excerpt) {
                const excerpt = document.createElement('p');
                excerpt.className = 'devlog-excerpt';
                excerpt.textContent = post.excerpt;
                item.appendChild(excerpt);
            }
            feed.appendChild(item);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        let lastPosts = null;

        // Re-render dynamic content when the active language changes (the
        // devlog dates are locale-dependent).
        document.addEventListener('quasarapp:languagechange', function () {
            if (lastPosts) renderDevlogFeed(lastPosts);
        });

        loadJson('data/devlog.json')
            .then((data) => {
                lastPosts = data && Array.isArray(data.posts) ? data.posts : [];
                renderDevlogFeed(lastPosts);
            })
            .catch((err) => console.warn('devlog feed unavailable, keeping empty state:', err));
    });
})();