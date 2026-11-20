/**
 * QuasarApp site — privacy-friendly analytics with custom event tracking
 * (issue #82, TZ section 5.3).
 *
 * Provider: Plausible (https://plausible.io). Chosen for privacy-friendliness:
 * no cookies, no fingerprinting, no personal data — therefore no cookie
 * banner is required. The tracking script is loaded in the <head> of
 * index.html with `defer` (non-blocking):
 *
 *     <script defer data-domain="quasarapp.me" src="https://plausible.io/js/script.js"></script>
 *
 * Custom event naming convention (snake_case; fired via window.plausible —
 * see README.md "Analytics" for the full table and rationale):
 *
 *   steam_wishlist       Steam "Add to Wishlist" CTA click (ALL CTA instances).
 *                        props: { source, url }
 *   download             Binary / download link click.
 *                        props: { project, url }
 *   outbound             Outbound click to GitHub (github.com) or Discord
 *                        (discord.com, discord.gg). GitHub/Discord links are
 *                        auto-tracked, no markup needed.
 *                        props: { outbound: <host>, [source], url }
 *   contact_form_submit  Contact form submission (form#contact-form or any
 *                        form with a data-analytics-form attribute).
 *                        props: { form }
 *
 * Markup convention for future pages:
 *   <a href="..." data-analytics-event="steam_wishlist" data-analytics-source="hero">…</a>
 *   <a href="..." data-analytics-event="download" data-analytics-source="cqtdeployer">…</a>
 *   <form id="contact-form">…</form>
 */
(function () {
    'use strict';

    // External hosts auto-tracked as `outbound` events (issue #82).
    var OUTBOUND_HOSTS = {
        'github.com': true,
        'discord.com': true,
        'discord.gg': true
    };

    /** Resolve the host of an href; '' when unresolvable. */
    function hostOf(href, base) {
        if (!href) return '';
        try {
            if (!base && typeof window !== 'undefined' && window.location) base = window.location.href;
            var resolved = new URL(href, base || 'http://localhost/');
            return resolved.host;
        } catch (e) {
            return '';
        }
    }

    /**
     * Resolve the custom event (if any) for a clicked anchor.
     * @param {{getAttribute: Function}} element  clicked <a> element (or stub)
     * @param {string} [href]                     the anchor's href value
     * @param {string} [base]                     base URL for relative hrefs
     * @returns {{event: string, props: Object}|null}
     */
    function resolveClickEvent(element, href, base) {
        if (!element || typeof element.getAttribute !== 'function') return null;
        var explicit = element.getAttribute('data-analytics-event');
        var source = element.getAttribute('data-analytics-source') || '';
        var props = {};
        if (href) props.url = href;

        if (explicit) {
            if (explicit === 'steam_wishlist') {
                props.source = source;
                return { event: 'steam_wishlist', props: props };
            }
            if (explicit === 'download') {
                props.project = source;
                return { event: 'download', props: props };
            }
            if (explicit === 'outbound') {
                props.outbound = hostOf(href, base);
                if (source) props.source = source;
                return { event: 'outbound', props: props };
            }
            // Unknown explicit event: pass through unchanged (README.md documents the convention).
            return { event: explicit, props: props };
        }

        // Implicit: outbound GitHub / Discord links need no markup.
        var host = hostOf(href, base);
        if (host && OUTBOUND_HOSTS[host]) {
            props.outbound = host;
            if (source) props.source = source;
            return { event: 'outbound', props: props };
        }
        return null;
    }

    /**
     * Resolve the custom event (if any) for a submitted form.
     * Only contact forms are tracked: id="contact-form" or data-analytics-form.
     */
    function resolveFormEvent(form) {
        if (!form || (form.tagName && form.tagName !== 'FORM')) return null;
        var isContact = (form.id === 'contact-form') ||
            (typeof form.hasAttribute === 'function' && form.hasAttribute('data-analytics-form'));
        if (!isContact) return null;
        return { event: 'contact_form_submit', props: { form: form.id || form.name || 'contact' } };
    }

    /** Forward an event to Plausible; no-op until window.plausible is ready. */
    function track(event, props) {
        if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
            window.plausible(event, { props: props || {} });
        }
    }

    /**
     * Wire event delegation onto a document so every current and future
     * tracked element works (delegation also covers elements added later).
     */
    function wire(documentObj) {
        if (!documentObj || typeof documentObj.addEventListener !== 'function') return;
        documentObj.addEventListener('click', function (e) {
            var anchor = e.target && typeof e.target.closest === 'function'
                ? e.target.closest('a[href]')
                : null;
            if (!anchor) return;
            var resolved = resolveClickEvent(anchor, anchor.getAttribute('href'));
            if (resolved) track(resolved.event, resolved.props);
        }, true);
        documentObj.addEventListener('submit', function (e) {
            var resolved = resolveFormEvent(e.target);
            if (resolved) track(resolved.event, resolved.props);
        }, true);
    }

    // Browser wiring.
    if (typeof document !== 'undefined') {
        wire(document);
    }

    // Exports for the dependency-free test suite (tests/analytics.test.js).
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            track: track,
            wire: wire,
            resolveClickEvent: resolveClickEvent,
            resolveFormEvent: resolveFormEvent,
            OUTBOUND_HOSTS: OUTBOUND_HOSTS
        };
    }
})();