// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://quasarapp.me/',
	output: 'static',
	vite: {
		plugins: [tailwindcss()],
	},
	i18n: {
		// EN is the default locale and is served without a prefix ("/");
		// the other locales are served under /ru/, /de/, /es/ (issue #72).
		defaultLocale: 'en',
		locales: ['en', 'ru', 'de', 'es'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
