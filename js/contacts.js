// QuasarApp Group - Contacts page controller (issue #74)
//
// Anti-spam protected contact form for the /contacts page (TZ 2.6 + 5.4):
// - client-side validation with per-field error messages
// - honeypot field for bots (hidden from humans)
// - optional Cloudflare Turnstile challenge: the third-party script is
//   injected dynamically ONLY when TURNSTILE_SITE_KEY is configured, so the
//   site stays dependency-free and free of render-blocking third-party JS
//   (issue #81) until a key is published
// - loading / success / error states on the form
//
// The site is static (SSG), so submissions go to a rate-limited endpoint
// (small serverless function / lightweight API on the company VPS; deployment
// is covered by the Docker/CI-CD issue). While that endpoint does not exist
// yet (CONTACT_ENDPOINT is empty), the form degrades gracefully to the
// mailto fallback (FALLBACK_MAILTO) with the visible notice in the markup:
// submitting opens the visitor's email client with the message pre-filled.
//
// Loads after js/i18n.js so it can reuse `translations` / `currentLanguage`
// and re-localizes dynamic messages on `quasarapp:languagechange`.
(function () {
    'use strict';

    // ---------------------------------------------------------------------
    // Delivery / anti-spam configuration (issue #74).
    // Set CONTACT_ENDPOINT to the rate-limited backend endpoint once the
    // Docker/CI-CD issue ships it, and TURNSTILE_SITE_KEY to the published
    // Cloudflare Turnstile site key. Both are empty on purpose right now:
    // no key exists in the repository, so no third-party script is loaded.
    // ---------------------------------------------------------------------
    var CONTACT_ENDPOINT = '';
    var TURNSTILE_SITE_KEY = '';
    var FALLBACK_MAILTO = 'quasarappdevelop@gmail.com';

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var form, nameInput, emailInput, messageInput, honeypotInput,
        statusEl, noticeEl, submitBtn, submitLabel, turnstileEl;
    var turnstileWidget = null;
    var turnstileToken = null;
    var lastState = { type: 'idle', key: null }; // re-localized on language change

    /** Resolve an i18n key ('contacts.error') for the active language. */
    function t(dotPath) {
        if (typeof translations === 'undefined') return null;
        var tree = (typeof currentLanguage !== 'undefined' && translations[currentLanguage]) || translations.en;
        var parts = dotPath.split('.');
        var value = tree;
        for (var i = 0; i < parts.length; i++) {
            value = value ? value[parts[i]] : null;
        }
        return typeof value === 'string' ? value : null;
    }

    function clearFieldError(name) {
        var wrap = document.getElementById('cf-field-' + name);
        if (wrap) wrap.classList.remove('has-error');
    }

    function showFieldError(name) {
        var wrap = document.getElementById('cf-field-' + name);
        if (wrap) wrap.classList.add('has-error');
    }

    /** Client-side validation (TZ 2.6). Returns { ok, firstInvalid, data }. */
    function validate() {
        var firstInvalid = null;
        var nameValue = nameInput.value.trim();
        var emailValue = emailInput.value.trim();
        var messageValue = messageInput.value.trim();

        clearFieldError('name');
        clearFieldError('email');
        clearFieldError('message');

        if (nameValue.length < 2) {
            showFieldError('name');
            firstInvalid = firstInvalid || nameInput;
        }
        if (!EMAIL_RE.test(emailValue)) {
            showFieldError('email');
            firstInvalid = firstInvalid || emailInput;
        }
        if (messageValue.length < 10) {
            showFieldError('message');
            firstInvalid = firstInvalid || messageInput;
        }

        return {
            ok: firstInvalid === null,
            firstInvalid: firstInvalid,
            data: { name: nameValue, email: emailValue, message: messageValue }
        };
    }

    /**
     * Form state machine (loading / success / error).
     * state: 'idle' | 'loading' | 'success' | 'error'
     * messageKey: i18n key for the status banner ('contacts.error',
     * 'contacts.rateLimited', 'contacts.success', ...).
     */
    function setState(state, messageKey) {
        lastState = { type: state, key: messageKey || null };
        submitBtn.disabled = state === 'loading';
        submitLabel.textContent = t('contacts.' + (state === 'loading' ? 'sending' : 'send'));

        statusEl.className = 'cf-status' + (state === 'success' || state === 'error' ? ' is-' + state : '');
        statusEl.textContent = (state === 'success' || state === 'error') && messageKey ? t(messageKey) : '';
    }

    /** Build the pre-filled mailto URL used by the graceful fallback. */
    function buildMailto(data) {
        var subject = 'Website contact: ' + data.name;
        var body = 'Name: ' + data.name + '\nEmail: ' + data.email + '\n\n' + data.message;
        return 'mailto:' + FALLBACK_MAILTO +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
    }

    /**
     * Graceful fallback (issue #74): no rate-limited endpoint is deployed
     * yet, so submitting opens the visitor's email client with the message
     * pre-filled and reports the success state for the fallback flow.
     */
    function submitViaMailtoFallback(data) {
        var anchor = document.createElement('a');
        anchor.href = buildMailto(data);
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        setState('success', 'contacts.fallbackSuccess');
    }

    /** Submit to the rate-limited endpoint (loading/success/error states). */
    function submitViaEndpoint(data) {
        setState('loading', null);
        var payload = {
            name: data.name,
            email: data.email,
            message: data.message,
            turnstile: turnstileToken || ''
        };
        fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(function (res) {
            if (res.ok) {
                setState('success', 'contacts.success');
                form.reset();
                turnstileToken = null;
                if (turnstileWidget && typeof turnstileWidget.reset === 'function') {
                    turnstileWidget.reset();
                }
            } else if (res.status === 429) {
                setState('error', 'contacts.rateLimited');
            } else {
                setState('error', 'contacts.error');
            }
        }).catch(function () {
            setState('error', 'contacts.error');
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        statusEl.className = 'cf-status';
        statusEl.textContent = '';

        var result = validate();
        if (!result.ok) {
            if (result.firstInvalid) result.firstInvalid.focus();
            return;
        }

        // Honeypot: bots that fill the hidden field are silently "served".
        if (honeypotInput.value !== '') {
            setState('success', 'contacts.success');
            return;
        }

        if (CONTACT_ENDPOINT) {
            submitViaEndpoint(result.data);
        } else {
            submitViaMailtoFallback(result.data);
        }
    }

    /**
     * Cloudflare Turnstile (TZ 5.4). The widget script is injected only when
     * a site key is configured; until then nothing third-party is loaded.
     */
    function initTurnstile() {
        if (!TURNSTILE_SITE_KEY || !turnstileEl) return;
        var script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.onload = function () {
            if (typeof window.turnstile === 'undefined') return;
            turnstileWidget = window.turnstile.render(turnstileEl, {
                sitekey: TURNSTILE_SITE_KEY,
                callback: function (token) {
                    turnstileToken = token;
                }
            });
        };
        document.head.appendChild(script);
    }

    /** Re-localize dynamic text when the active language changes. */
    function onLanguageChange() {
        setState(lastState.type, lastState.key);
        var inputs = form ? form.querySelectorAll('[data-lang-placeholder]') : [];
        Array.prototype.forEach.call(inputs, function (input) {
            var value = t(input.getAttribute('data-lang-placeholder'));
            if (value) input.setAttribute('placeholder', value);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        form = document.getElementById('contact-form');
        if (!form) return; // not the contacts page

        nameInput = document.getElementById('cf-name');
        emailInput = document.getElementById('cf-email');
        messageInput = document.getElementById('cf-message');
        honeypotInput = document.getElementById('cf-website');
        statusEl = document.getElementById('cf-status');
        noticeEl = document.getElementById('cf-notice');
        submitBtn = document.getElementById('cf-submit');
        submitLabel = document.getElementById('cf-submit-label');
        turnstileEl = document.getElementById('cf-turnstile');

        // With a configured endpoint the mailto fallback notice is no longer
        // applicable; without one it stays visible (also without JS).
        if (CONTACT_ENDPOINT && noticeEl) {
            noticeEl.style.display = 'none';
        }
        if (!CONTACT_ENDPOINT && turnstileEl) {
            turnstileEl.style.display = 'none';
        }

        form.addEventListener('submit', handleSubmit);
        [nameInput, emailInput, messageInput].forEach(function (input) {
            input.addEventListener('input', function () {
                clearFieldError(input.getAttribute('data-cf-field'));
                statusEl.className = 'cf-status';
                statusEl.textContent = '';
            });
        });

        initTurnstile();
        document.addEventListener('quasarapp:languagechange', onLanguageChange);
        onLanguageChange();
    });
})();
