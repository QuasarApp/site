// i18n helpers for the Astro site (issue #72).
//
// Translation strings live in src/i18n/{en,ru,de,es}.json (ported from the
// legacy js/i18n.js; Montenegrin is added in a separate i18n issue). The
// key sets are identical across languages - guarded by tests/i18n.test.js.

import en from './en.json';
import ru from './ru.json';
import de from './de.json';
import es from './es.json';

export const DEFAULT_LOCALE = 'en';
export const LOCALES = ['en', 'ru', 'de', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * All locales except the default one. The default locale (EN) is served from
 * the unprefixed root routes; these are the locales that need the /[locale]/
 * wrapper pages under src/pages/[locale]/ (Astro issue #72).
 */
export function nonDefaultLocales(): Locale[] {
	return LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);
}

/**
 * getStaticPaths() entries for the simple src/pages/[locale]/*.astro wrapper
 * pages: one entry per non-default locale.
 */
export function localeStaticPaths(): Array<{ params: { locale: string } }> {
	return nonDefaultLocales().map((locale) => ({ params: { locale } }));
}

export const LOCALE_LABELS: Record<Locale, string> = {
	en: 'EN',
	ru: 'RU',
	de: 'DE',
	es: 'ES',
};

const translations: Record<Locale, Record<string, unknown>> = {
	en,
	ru,
	de,
	es,
};

/**
 * Resolve a dot-path key ('nav.home') in the given locale. Unknown locales
 * fall back to the default locale; unknown keys return the key itself so a
 * missing string is visible in the output instead of rendering as blank.
 */
export function t(locale: string, key: string): string {
	const lang = translations[locale as Locale] ?? translations[DEFAULT_LOCALE];
	const value = key
		.split('.')
		.reduce<unknown>(
			(acc, part) =>
				acc !== null && typeof acc === 'object'
					? (acc as Record<string, unknown>)[part]
					: undefined,
			lang
		);
	return typeof value === 'string' ? value : key;
}

/**
 * Locale-prefixed site path for the i18n routing scheme: the default locale
 * is unprefixed ('/'), the others live under /{locale}/.
 */
export function localeHref(locale: string, pathname: string): string {
	if (locale === DEFAULT_LOCALE) {
		return pathname;
	}
	const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
	return `/${locale}${path}`;
}

