import { writeFile } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';
import { resolveRelease } from '../records/release.js';
import { BETA_HEADERS, BETA_ROBOTS } from './cloudflare-policy.js';

/**
 * Cloudflare Pages reads these files from the completed static output. They
 * belong only to the beta release: production remains indexable, while beta
 * is unlisted and uncrawlable without putting a password between the chaplain
 * reviewer and the experience under review.
 */
/**
 * Emit host configuration from the same release variable that filters the
 * records. Keeping this inside the build makes a beta artifact self-contained:
 * it cannot be uploaded without its indexing controls, and production cannot
 * accidentally inherit them from a shared `public/` directory.
 */
export function cloudflarePages(env = process.env): AstroIntegration {
	const release = resolveRelease(env);

	return {
		name: 'cloudflare-pages-release-files',
		hooks: {
			'astro:build:done': async ({ dir }) => {
				if (release !== 'beta') return;
				await Promise.all([
					writeFile(new URL('_headers', dir), BETA_HEADERS),
					writeFile(new URL('robots.txt', dir), BETA_ROBOTS),
				]);
			},
		},
	};
}
