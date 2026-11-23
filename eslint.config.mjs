// @ts-check
// ESLint 10 flat config (issue #72): JS/TS via @eslint/js + typescript-eslint,
// Astro templates via eslint-plugin-astro's flat recommended config (which
// also carries the bundled jsx-a11y rules for .astro files).
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
	{
		ignores: ['dist/**', 'node_modules/**', '.astro/**', 'package-lock.json'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...astro.configs['flat/recommended'],
	{
		files: ['**/*.astro'],
		languageOptions: {
			globals: { ...globals.browser },
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
	{
		// tests/ and scripts/ are dependency-free CommonJS Node tooling:
		// require() is the module system there, not an import style issue.
		files: ['tests/**/*.js', 'scripts/**/*.js'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: {
			globals: { ...globals.node },
		},
	},
];
