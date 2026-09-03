import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..');

/** Builds into a throwaway directory so the tests never race `dist/`. */
function build(release: string | undefined): string {
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

/** Practice names in the order they appear in the page. */
function names(html: string): string[] {
	return [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((match) =>
		match[1]!.replace(/&#39;/g, "'").replace(/<[^>]+>/g, ''),
	);
}

let production: string;
let beta: string;
let productionHtml: string;
let betaHtml: string;

beforeAll(() => {
	production = build(undefined);
	beta = build('beta');
	productionHtml = readFileSync(join(production, 'me', 'everything', 'index.html'), 'utf8');
	betaHtml = readFileSync(join(beta, 'me', 'everything', 'index.html'), 'utf8');
});

afterAll(() => {
	for (const dir of [production, beta]) {
		if (dir) rmSync(dir, { recursive: true, force: true });
	}
});

describe('/me/everything/', () => {
	it('is prerendered as a real page at a real URL', () => {
		expect(productionHtml).toContain('<h1');
	});

	it('lists the catalog in the fixed editorial order', () => {
		expect(names(betaHtml)).toEqual([
			"Noticing what's around you",
			'Rest, without a task',
			'Saying the hard thing',
			'A small kindness, from where you are',
		]);
	});
});

describe('one environment variable selects the build', () => {
	it('includes pending records on beta', () => {
		expect(names(betaHtml)).toContain('Saying the hard thing');
		expect(betaHtml).toContain('beta — for review');
		expect(betaHtml).toContain('in review — not approved yet');
	});

	it('excludes every record that is not approved from production', () => {
		expect(names(productionHtml)).toEqual([
			"Noticing what's around you",
			'Rest, without a task',
			'A small kindness, from where you are',
		]);
		// No review bar and no pending markers: production is not a review surface.
		expect(productionHtml).not.toContain('beta — for review');
		expect(productionHtml).not.toContain('in review — not approved yet');
	});

	it('refuses to build against a release it does not recognise', () => {
		expect(() => build('staging')).toThrow();
	});
});

describe('the weight budget', () => {
	const files = (dir: string): string[] =>
		readdirSync(dir, { recursive: true, withFileTypes: true })
			.filter((entry) => entry.isFile())
			.map((entry) => join(entry.parentPath, entry.name));

	it('ships no client JavaScript', () => {
		for (const html of [productionHtml, betaHtml]) {
			expect(html).not.toMatch(/<script/i);
		}
		expect(files(production).filter((file) => file.endsWith('.js'))).toEqual([]);
	});

	it('makes no request to any third-party origin', () => {
		for (const html of [productionHtml, betaHtml]) {
			// Any absolute URL in the markup is a second origin, since the whole
			// site is served from one. Catches CDNs, web fonts, and embeds.
			expect(html).not.toMatch(/(?:src|href)\s*=\s*["'](?:https?:)?\/\//i);
			expect(html).not.toMatch(/@import|url\(\s*["']?https?:/i);
		}
	});

	it('ships no raster images', () => {
		expect(
			files(production).filter((file) => /\.(png|jpe?g|gif|webp|avif)$/i.test(file)),
		).toEqual([]);
	});

	it('stays under 100 KB transferred per page', () => {
		expect(Buffer.byteLength(productionHtml)).toBeLessThan(100 * 1024);
		expect(Buffer.byteLength(betaHtml)).toBeLessThan(100 * 1024);
	});
});

describe('the schema is the enforcement point for field completeness', () => {
	// The loader globs the real content directory, so proving the schema is
	// wired to the build means briefly putting a bad record in it. Removed in
	// `finally` and again in `afterAll`, so a failing assertion never leaves a
	// governed content file behind.
	const stray = join(ROOT, 'content', 'practices', 'remembering-someone.md');

	afterAll(() => rmSync(stray, { force: true }));

	it('fails the build on a record missing a field', () => {
		writeFileSync(
			stray,
			['---', 'name: A record with almost nothing in it', 'publication: in-review', '---', ''].join(
				'\n',
			),
		);
		try {
			expect(() => build('beta')).toThrow();
		} finally {
			rmSync(stray, { force: true });
		}
	});
});
