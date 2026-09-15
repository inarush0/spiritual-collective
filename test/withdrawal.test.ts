import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
	buildInto,
	hasPageAt,
	pageAt,
	plainText,
	ROOT,
	routesIn,
} from './support/build.js';

/**
 * Withdrawal is exercised through the same public operation an editor uses:
 * one approved record's `publication` field changes to `withdrawn`, then the
 * real production site builds. The source is restored as soon as Astro has
 * read it, so the repository is unchanged even while these assertions run.
 */
const record = join(ROOT, 'content', 'practices', 'a-small-kindness.md');
const slug = 'a-small-kindness';
const steps = [1, 2, 3];
const unavailable = "This practice isn't available right now.";

let production: string;
let output: string;
let emptyProduction: string;

function buildWithWithdrawals(files: readonly string[]): { dir: string; output: string } {
	const originals = files.map((file) => [file, readFileSync(file, 'utf8')] as const);
	for (const [file, source] of originals) {
		const withdrawn = source.replace(
			/publication: (?:approved|in-review)/,
			'publication: withdrawn',
		);
		expect(withdrawn, file).not.toBe(source);
		writeFileSync(file, withdrawn);
	}
	try {
		return buildInto(undefined);
	} finally {
		for (const [file, source] of originals) writeFileSync(file, source);
	}
}

beforeAll(() => {
	({ dir: production, output } = buildWithWithdrawals([record]));
	const everyRecord = [
		'a-small-kindness',
		'noticing-whats-around-you',
		'rest-without-a-task',
		'saying-the-hard-thing',
	].map((name) => join(ROOT, 'content', 'practices', `${name}.md`));
	({ dir: emptyProduction } = buildWithWithdrawals(everyRecord));
});

afterAll(() => {
	for (const dir of [production, emptyProduction]) {
		if (dir) rmSync(dir, { recursive: true, force: true });
	}
});

/** Internal links pointing at a page this build did not write. */
function deadLinks(dir: string): string[] {
	const dead: string[] = [];
	for (const route of routesIn(dir)) {
		for (const match of pageAt(dir, route).matchAll(/href="(\/[^"#?]*)"/g)) {
			const target = match[1]!;
			if (!hasPageAt(dir, target)) dead.push(`${route} → ${target}`);
		}
	}
	return dead;
}

describe('a withdrawn practice', () => {
	it('serves an unavailable page at every existing URL on all three audience paths', () => {
		for (const path of ['me', 'with', 'child']) {
			const practice = `/${path}/practice/${slug}/`;
			const routes = [practice, ...steps.map((step) => `${practice}${step}/`)];
			if (path !== 'me') routes.push(`${practice}before/`);

			for (const route of routes) {
				expect(hasPageAt(production, route), route).toBe(true);
				expect(plainText(pageAt(production, route)), route).toContain(unavailable);
			}
		}
	});

	it('drops its last need tags from discovery and emits a loud build warning', () => {
		const discovery = plainText(pageAt(production, '/me/'));
		for (const tag of [
			'I want to make or do something',
			'I want my faith or my tradition',
			'I want to do something for someone',
		]) {
			expect(discovery).not.toContain(tag);
			expect(output).toContain('[need tags]');
			expect(output).toContain(tag);
		}
	});

	it('leaves no link to the withdrawn practice and no dead internal link', () => {
		for (const route of routesIn(production)) {
			expect(pageAt(production, route), route).not.toContain(`href="/me/practice/${slug}/"`);
			expect(pageAt(production, route), route).not.toContain(`href="/with/practice/${slug}/"`);
			expect(pageAt(production, route), route).not.toContain(`href="/child/practice/${slug}/"`);
		}
		expect(deadLinks(production)).toEqual([]);
	});

	it('still completes a production build when every written practice is withdrawn', () => {
		expect(hasPageAt(emptyProduction, '/me/')).toBe(true);
		expect(hasPageAt(emptyProduction, `/me/practice/${slug}/`)).toBe(true);
		expect(deadLinks(emptyProduction)).toEqual([]);
	});

	it('completes a production build for every combination of written records withdrawn', () => {
		const records = [
			'a-small-kindness',
			'noticing-whats-around-you',
			'rest-without-a-task',
			'saying-the-hard-thing',
		].map((name) => join(ROOT, 'content', 'practices', `${name}.md`));

		for (let mask = 0; mask < 2 ** records.length; mask += 1) {
			// These two combinations were built in setup and are asserted above.
			if (mask === 1 || mask === 2 ** records.length - 1) continue;
			const withdrawn = records.filter((_, index) => mask & (1 << index));
			const { dir } = buildWithWithdrawals(withdrawn);
			try {
				expect(hasPageAt(dir, '/me/'), `withdrawal mask ${mask}`).toBe(true);
			} finally {
				rmSync(dir, { recursive: true, force: true });
			}
		}
	});
});
