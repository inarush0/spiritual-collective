import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';

/**
 * A real `astro build`, into a throwaway directory so the tests never race
 * `dist/` or each other.
 *
 * Shared by every suite that asserts against built pages rather than against a
 * function: the two builds are the thing under test in several places, and a
 * second spelling of how one is produced is a second place for the release
 * variable to be got wrong.
 */

export const ROOT = join(import.meta.dirname, '..', '..');

/** Builds and returns the output directory. `undefined` is the unset case. */
export function build(release: string | undefined): string {
	const outDir = mkdtempSync(join(tmpdir(), `catalog-${release ?? 'default'}-`));
	execFileSync('node', ['node_modules/astro/bin/astro.mjs', 'build', '--outDir', outDir], {
		cwd: ROOT,
		env: {
			...process.env,
			ASTRO_TELEMETRY_DISABLED: '1',
			...(release ? { SITE_BUILD: release } : { SITE_BUILD: '' }),
		},
		stdio: 'pipe',
	});
	return outDir;
}

/** Both releases, and the cleanup that removes them. */
export interface Builds {
	production: string;
	beta: string;
}

/**
 * Builds both releases and returns them with a teardown.
 *
 * Every suite asserting against built pages wants exactly this pair — the two
 * builds differ only by the release variable, and most rules under test are
 * about the difference. Vitest runs each test file in its own worker, so the
 * builds cannot be shared across files; the setup can be.
 */
export function buildBothReleases(): { builds: Builds; cleanUp: () => void } {
	const builds = { production: build(undefined), beta: build('beta') };
	return {
		builds,
		cleanUp: () => {
			for (const dir of Object.values(builds)) {
				if (dir) rmSync(dir, { recursive: true, force: true });
			}
		},
	};
}

/** The markup a reader would meet at `route`, from a built directory. */
export function pageAt(dir: string, route: string): string {
	return readFileSync(join(dir, ...route.split('/').filter(Boolean), 'index.html'), 'utf8');
}

/**
 * Every route the build wrote a page for.
 *
 * Site-wide rules — the chrome link on every screen, no date anywhere — are
 * assertions about the whole route table rather than about a page a test
 * happens to name, so the enumeration is read from the build.
 */
export function routesIn(dir: string): string[] {
	return readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name === 'index.html')
		.map((entry) => relative(dir, entry.parentPath).split(sep).filter(Boolean))
		.map((segments) => `/${segments.map((segment) => `${segment}/`).join('')}`);
}

/** Whether the build wrote a page at `route`. */
export function hasPageAt(dir: string, route: string): boolean {
	return existsSync(join(dir, ...route.split('/').filter(Boolean), 'index.html'));
}

/**
 * A page as words, so a test can assert the sentence a reader meets rather
 * than the markup it arrived in. Astro escapes apostrophes, and copy that
 * reads as one line is written across several in a template.
 */
export function plainText(html: string): string {
	return html
		.replace(/<[^>]+>/g, ' ')
		.replace(/&#39;|&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();
}
