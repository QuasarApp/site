// QuasarApp Group - Project detail page data renderer (issue #77)
//
// Progressive enhancement on top of the static markup in
// projects/{slug}/index.html:
// - GitHub API integration block: renders the build-time cache
//   data/projects-github.json (refreshed by
//   `node scripts/fetch-projects-github.js`). The static markup bakes in
//   the same values as the graceful offline fallback, so the page is
//   correct and fully readable when the JSON is missing or unreachable.
// - The renderer only updates the marked-up values
//   (star count, latest release, "updated" date, archived note) when the
//   cache is newer or different; on language change it re-localizes the
//   "updated" label via the translations in js/i18n.js.
//
// Loads after js/i18n.js (for `translations` / `currentLanguage`) and
// js/main.js; it is only included on the /projects/{slug} pages.
(function () {
    'use strict';

    function t(dotPath) {
        if (typeof translations === 'undefined') return null;
        let value = (typeof currentLanguage !== 'undefined' && translations[currentLanguage]) || translations.en;
        for (const part of dotPath.split('.')) {
            value = value ? value[part] : null;
        }
        return typeof value === 'string' ? value : null;
    }

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

    /** The /projects/{slug} page slug, or null when not on such a page. */
    function projectSlug() {
        const segments = (window.location.pathname || '')
            .split('/')
            .filter(Boolean);
        if (segments.length < 2 || segments[0] !== 'projects') return null;
        return segments[1];
    }

    /**
     * Update the GitHub block of the current project page from the cache.
     * All values go through textContent / setAttribute - the cache is
     * trusted repo content, but the renderer must not inject HTML.
     */
    function renderGithubBlock(entry, fetchedAt) {
        if (!entry || typeof entry !== 'object') return;

        const stars = document.querySelector('[data-project-github="stars"]');
        if (stars && Number.isFinite(Number(entry.stars))) {
            stars.textContent = Number(entry.stars).toLocaleString(currentLocale());
        }

        const release = document.querySelector('[data-project-github="release"]');
        if (release) {
            const tag = typeof entry.latestRelease === 'string' && entry.latestRelease
                ? entry.latestRelease
                : null;
            release.textContent = tag || (t('projectsDetail.githubNoRelease') || release.textContent);
            if (tag && entry.latestReleaseUrl) {
                release.setAttribute('href', entry.latestReleaseUrl);
            } else if (entry.repoUrl) {
                release.setAttribute('href', entry.repoUrl);
            }
        }

        const updatedDate = document.querySelector('[data-project-github="updated-date"]');
        if (updatedDate) {
            const date = new Date(fetchedAt);
            if (!Number.isNaN(date.getTime())) {
                updatedDate.textContent = date.toISOString().slice(0, 10);
            }
        }

        const archivedNote = document.querySelector('[data-project-github="archived-note"]');
        if (archivedNote) {
            archivedNote.hidden = !entry.archived;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        const slug = projectSlug();
        if (!slug) return; // not a project page - nothing to do

        let lastEntry = null;
        let lastFetchedAt = null;

        // Re-localize the "updated" label when the active language changes.
        document.addEventListener('quasarapp:languagechange', function () {
            if (lastEntry) renderGithubBlock(lastEntry, lastFetchedAt);
        });

        loadJson('../../data/projects-github.json')
            .then((cache) => {
                lastEntry = cache && cache.projects ? cache.projects[slug] : null;
                lastFetchedAt = cache && typeof cache.fetchedAt === 'string' ? cache.fetchedAt : null;
                renderGithubBlock(lastEntry, lastFetchedAt);
            })
            .catch((err) => console.warn('project GitHub cache unavailable, keeping static values:', err));
    });
})();