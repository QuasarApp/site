// QuasarApp Group - Projects catalog (issue #76)
//
// Renders the project cards into #catalog-grid from the
// data/projects-catalog.json content collection (the same pattern as the
// devlog feed in js/home-data.js) and provides the client-side category
// filtering with URL-updatable state (?category=<category>, e.g.
// /projects/?category=games) - AC1/AC2 of issue #76:
// - on load the category is read from the URL (unknown values fall back
//   to "all") and the matching filter is applied without a full reload;
// - clicking a filter button updates the URL via history.replaceState so
//   the filtered state is shareable/bookmarkable;
// - popstate re-applies the URL state for back/forward navigation.
// All card fields are inserted via textContent (the collection is trusted
// repo content, but the renderer must not be able to inject HTML).
// Loads after js/i18n.js so it can reuse `currentLanguage` and the
// translation tree, and re-renders on quasarapp:languagechange.
(function () {
    'use strict';

    const DATA_URL = '../data/projects-catalog.json';
    const DEFAULT_FILTER = 'all';
    const SVG_NS = 'http://www.w3.org/2000/svg';

    function currentLocale() {
        return (typeof currentLanguage !== 'undefined' && currentLanguage) || 'en';
    }

    /** Resolve a dot path ('projectsDetail.categories.games') in the active
     *  language's i18n tree (translations[<lang>][...]). */
    function resolveTranslation(dotPath) {
        const tree = (typeof translations !== 'undefined') ? translations : null;
        let value = tree ? tree[currentLocale()] : null;
        for (const part of dotPath.split('.')) {
            if (value === null || typeof value !== 'object') return null;
            value = value[part];
        }
        return (typeof value === 'string' && value.trim() !== '') ? value : null;
    }

    /** The set of category values the filter buttons offer. */
    function knownFilters() {
        return Array.prototype.map.call(document.querySelectorAll('.filter-btn'), (btn) => btn.dataset.filter);
    }

    /** Category value from the URL (?category=...); 'all' when missing/unknown. */
    function categoryFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const value = params.get('category');
        return (value && knownFilters().indexOf(value) !== -1) ? value : DEFAULT_FILTER;
    }

    /** Update the URL (?category=...) without a reload; 'all' drops the param. */
    function updateUrl(filter) {
        const url = new URL(window.location.href);
        if (filter === DEFAULT_FILTER) {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', filter);
        }
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }

    function loadJson(url) {
        return fetch(url, { cache: 'no-cache' }).then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
            return res.json();
        });
    }

    function svgIcon(name) {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'icon');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        const use = document.createElementNS(SVG_NS, 'use');
        use.setAttribute('href', `#icon-${name}`);
        svg.appendChild(use);
        return svg;
    }

    /** Build one catalog card from a content collection entry. */
    function buildCard(project) {
        const lang = currentLocale();
        const card = document.createElement('article');
        card.className = 'catalog-card';
        card.dataset.category = project.category;

        const content = document.createElement('div');
        content.className = 'catalog-card-content';

        const logo = document.createElement('div');
        logo.className = 'catalog-logo';
        logo.appendChild(svgIcon(project.icon || 'grid'));
        content.appendChild(logo);

        const title = document.createElement('h2');
        title.className = 'catalog-title';
        title.textContent = project.title;
        content.appendChild(title);

        const description = document.createElement('p');
        description.className = 'catalog-description';
        description.textContent = resolveTranslation(project.descriptionKey) || '';
        content.appendChild(description);

        const meta = document.createElement('div');
        meta.className = 'catalog-meta';
        const category = document.createElement('span');
        category.className = 'catalog-category';
        category.textContent = resolveTranslation(`projectsDetail.categories.${project.category}`) || project.category;
        const status = document.createElement('span');
        status.className = 'catalog-status';
        status.textContent = resolveTranslation(`projectsDetail.statuses.${project.status}`) || project.status;
        meta.appendChild(category);
        meta.appendChild(status);
        content.appendChild(meta);

        const link = document.createElement('a');
        link.className = 'catalog-link';
        link.setAttribute('href', `/projects/${project.slug}/`);
        link.textContent = resolveTranslation('featured.details') || 'View details';
        content.appendChild(link);

        card.appendChild(content);
        return card;
    }

    let lastProjects = null;
    let activeFilter = DEFAULT_FILTER;

    /** Show/hide the cards for a filter and sync the button states. */
    function applyFilter(filter) {
        activeFilter = filter;
        let visible = 0;
        document.querySelectorAll('#catalog-grid .catalog-card').forEach((card) => {
            const match = filter === DEFAULT_FILTER || card.dataset.category === filter;
            card.style.display = match ? '' : 'none';
            if (match) visible += 1;
        });
        document.querySelectorAll('.filter-btn').forEach((btn) => {
            const isActive = btn.dataset.filter === filter;
            if (isActive) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.removeAttribute('aria-pressed');
            }
        });
        const empty = document.querySelector('[data-catalog-empty]');
        if (empty) empty.hidden = visible !== 0;
    }

    /** (Re)render all cards from the loaded collection, keep the filter. */
    function renderCatalog() {
        if (!lastProjects) return;
        const grid = document.getElementById('catalog-grid');
        if (!grid) return;
        grid.textContent = '';
        for (const project of lastProjects) {
            if (project && project.slug && project.title && project.category) {
                grid.appendChild(buildCard(project));
            }
        }
        applyFilter(activeFilter);
    }

    function init() {
        document.querySelectorAll('.filter-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter || DEFAULT_FILTER;
                applyFilter(filter);
                updateUrl(filter);
            });
        });
        // Back/forward navigation re-applies the URL state (no reload).
        window.addEventListener('popstate', () => {
            applyFilter(categoryFromUrl());
        });
        // Re-localize the rendered cards when the active language changes.
        document.addEventListener('quasarapp:languagechange', () => {
            if (lastProjects) renderCatalog();
        });
        activeFilter = categoryFromUrl();
        applyFilter(activeFilter);
        loadJson(DATA_URL)
            .then((data) => {
                lastProjects = data && Array.isArray(data.projects) ? data.projects : [];
                renderCatalog();
            })
            .catch((err) => console.warn('project catalog unavailable, keeping empty state:', err));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
