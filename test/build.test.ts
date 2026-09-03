import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PENDING_MARKER } from '../src/framing/practice-view.js';
import { build, buildBothReleases, pageAt, plainText, ROOT } from './support/build.js';

/** Practice names in the order they appear in the page. */
function names(html: string): string[] {
	return [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((match) => plainText(match[1]!));
}

let cleanUp: () => void;
let productionHtml: string;
let betaHtml: string;

beforeAll(() => {
	const { builds, cleanUp: teardown } = buildBothReleases();
	cleanUp = teardown;
	productionHtml = pageAt(builds.production, '/me/everything/');
	betaHtml = pageAt(builds.beta, '/me/everything/');
});

afterAll(() => cleanUp?.());

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
		expect(betaHtml).toContain(PENDING_MARKER);
	});

	it('excludes every record that is not approved from production', () => {
		expect(names(productionHtml)).toEqual([
			"Noticing what's around you",
			'Rest, without a task',
			'A small kindness, from where you are',
		]);
		// No review bar and no pending markers: production is not a review surface.
		expect(productionHtml).not.toContain('beta — for review');
		expect(productionHtml).not.toContain(PENDING_MARKER);
	});

	it('refuses to build against a release it does not recognise', () => {
		expect(() => build('staging')).toThrow();
	});
});

// The weight budget and the third-party assertion live in `npm run gates` now:
// every page rather than this one, both releases, and the same command CI runs.

describe('the schema is the enforcement point for field completeness', () => {
	// The loader globs the real content directory, so proving the schema is
	// wired to the build means briefly putting a bad record in it. Removed in
	// `finally` and again in `afterAll`, so a failing assertion never leaves a
	// governed content file behind.
	const stray = join(ROOT, 'content', 'practices', 'remembering-someone.md');
	let wrote = false;

	afterAll(() => {
		if (wrote) rmSync(stray, { force: true });
	});

	it('fails the build on a record missing a field', () => {
		// That slot will hold a real, approved record one day. The cleanup below
		// removes only what this test wrote, and only if it wrote it.
		expect(existsSync(stray), `${stray} already exists — pick an unused slot`).toBe(false);
		wrote = true;
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
