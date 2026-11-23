// Content collections (issue #72, TZ 5.1 Option A - the Git-based CMS).
// Markdown files in src/content/ are the single source of truth for:
//   - projects:  the 6 key project records rendered at /projects/{slug}
//   - devlog:    devlog posts rendered on the home feed and /devlog
//   - roadmap:   the Ecliptica roadmap rendered on the /ecliptica hub
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		category: z.enum(['games', 'developerTools', 'desktopApps', 'libraries']),
		statuses: z.array(z.enum(['activeDevelopment', 'released', 'openSource', 'beta'])),
		os: z.array(z.string()),
		stack: z.array(z.string()),
		// Action buttons rendered in the Media & Downloads section; the
		// hrefs are resolved by src/components/ProjectActions.astro
		// (steam/wishlist are the verified Steam links, download/github/docs
		// point at the repository from src/data/projects-github.json,
		// contact is the mailto link, hub is the locale-aware /ecliptica).
		actions: z.array(z.enum(['steam', 'wishlist', 'hub', 'download', 'github', 'docs', 'contact'])),
		media: z
			.array(
				z.object({
					image: z.string(),
					srcset: z.string().optional(),
					alt: z.string().optional(),
					captionKey: z.enum(['mediaCaptionKeyArt', 'mediaCaptionEnvironment']),
				})
			)
			.default([]),
		order: z.number().int().default(1),
	}),
});

const devlog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/devlog' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		excerpt: z.string().optional(),
	}),
});

const roadmap = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/roadmap' }),
	schema: z.object({
		title: z.string(),
		project: z.string(),
		status: z.enum(['draft', 'active', 'complete']).default('active'),
	}),
});

export const collections = { projects, devlog, roadmap };
