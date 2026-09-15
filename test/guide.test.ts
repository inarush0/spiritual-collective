import { rmSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { GUIDE_DOORWAY, GUIDE_ONWARD, GUIDE_UNAVAILABLE } from '../src/framing/companion.js';
import { GUIDE_ROUTE, routesFor } from '../src/framing/routes.js';
import { GUIDE_PARTS } from '../src/guide/guide-record.js';
import { buildInto, hasPageAt, pageAt, plainText, routesIn } from './support/build.js';

/**
 * The **standing guide** at `/child/`, and the arrival option it gates
 * ([#30](https://github.com/inarush0/spiritual-collective/issues/30)).
 *
 * Two states are asserted here, because the guide is the only record on the
 * site whose `publication` decides whether a whole **audience path** is
 * offered. Open: the guide is the first screen of `/child/`, met before the
 * catalog, reachable again from every companion screen, and shown to no direct
 * user. Closed: the third arrival answer is gone, the build says so, and
 * nothing anywhere links to a page with no guide on it.
 *
 * **The two builds are the two states**, with nothing rewritten to produce
 * them. `content/guide.md` is placeholder drafting held in review, so beta
 * publishes it and production does not — which is the gate open and the gate
 * closed, on the same commit, exactly as an editor would meet them.
 */

const CHILD = routesFor('child');
const THIRD_ANSWER = 'A younger child I am caring for';

/** Every internal link the build wrote, as route → the pages linking to it. */
function internalLinks(dir: string): Map<string, string[]> {
	const links = new Map<string, string[]>();
	for (const route of routesIn(dir)) {
		for (const match of pageAt(dir, route).matchAll(/href="(\/[^"#?]*)"/g)) {
			const target = match[1]!;
			links.set(target, [...(links.get(target) ?? []), route]);
		}
	}
	return links;
}

/** Links pointing at a page this build did not write. */
function deadLinks(dir: string): string[] {
	return [...internalLinks(dir)]
		.filter(([target]) => !hasPageAt(dir, target))
		.map(([target, from]) => `${target} ← ${from.join(', ')}`);
}

/** Beta publishes the in-review guide; production does not. */
let beta: string;
let production: string;
let productionOutput: string;

beforeAll(() => {
	({ dir: beta } = buildInto('beta'));
	({ dir: production, output: productionOutput } = buildInto(undefined));
});

afterAll(() => {
	for (const dir of [beta, production]) {
		if (dir) rmSync(dir, { recursive: true, force: true });
	}
});

describe('the standing guide, published', () => {

	it('is the first screen of the younger-child path, at /child/ itself', () => {
		expect(hasPageAt(beta, GUIDE_ROUTE)).toBe(true);
		expect(GUIDE_ROUTE).toBe('/child/');
		expect(CHILD.door).toBe('/child/set/');
	});

	it('holds all four parts', () => {
		const words = plainText(pageAt(beta, GUIDE_ROUTE));
		for (const part of GUIDE_PARTS) {
			expect(words, part.name).toContain(part.heading);
		}
	});

	it('states the no-suitability claim in the first of the two places it binds', () => {
		const guide = plainText(pageAt(beta, GUIDE_ROUTE));
		const set = plainText(pageAt(beta, CHILD.door));

		expect(guide).toMatch(/never met your child/i);
		expect(set).toMatch(/never met your child/i);
	});

	it('is met before the catalog, and leads on to it', () => {
		const html = pageAt(beta, GUIDE_ROUTE);
		expect(plainText(html)).toContain(GUIDE_ONWARD);
		expect(html).toContain(`href="${CHILD.door}"`);
	});

	it('is the arrival screen third answer, and its door', () => {
		const html = pageAt(beta, '/');
		expect(plainText(html)).toContain(THIRD_ANSWER);
		expect(html).toContain(`href="${GUIDE_ROUTE}"`);
	});

	it('is reachable again from a quiet doorway on every companion-path screen', () => {
		for (const path of ['with', 'child'] as const) {
			const routes = routesFor(path);
			const screens = [
				routes.door,
				routes.notSure,
				routes.everything,
				routes.nothing,
				routes.exit,
				routes.forTag('I want to be still'),
				routes.lowEnergy('I want to be still'),
				routes.practice('rest-without-a-task'),
				`${routes.practice('rest-without-a-task')}before/`,
				`${routes.practice('rest-without-a-task')}1/`,
			];
			for (const route of screens) {
				const html = pageAt(beta, route);
				expect(plainText(html), route).toContain(GUIDE_DOORWAY);
				expect(html, route).toContain(`href="${GUIDE_ROUTE}"`);
			}
		}
	});

	it('does not offer a doorway to itself', () => {
		expect(plainText(pageAt(beta, GUIDE_ROUTE))).not.toContain(GUIDE_DOORWAY);
	});

	it('is never shown to the direct user', () => {
		for (const route of routesIn(beta).filter((route) => route.startsWith('/me/'))) {
			const html = pageAt(beta, route);
			expect(html, route).not.toContain(`href="${GUIDE_ROUTE}"`);
			expect(plainText(html), route).not.toContain(GUIDE_DOORWAY);
			for (const part of GUIDE_PARTS) {
				expect(plainText(html), route).not.toContain(part.heading);
			}
		}
	});

	it('is in no catalog, no suggestion set, no tail, and no /everything/', () => {
		// The record's own name, read off the page it is rendered on rather
		// than written here: placeholder copy is replaced before anything ships.
		const name = plainText(
			/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(pageAt(beta, GUIDE_ROUTE))![1]!,
		);

		const listings = [
			'/me/everything/',
			'/with/everything/',
			'/child/everything/',
			'/me/',
			'/with/',
			CHILD.door,
			'/me/not-sure/',
			'/me/for/be-still/',
			'/me/for/be-still/low/',
		];
		for (const route of listings) {
			const html = pageAt(beta, route);
			// A listing links every practice it holds; the guide is not a
			// practice and has no practice URL to be linked by.
			expect(html, route).not.toContain('practice/guide');
			expect(plainText(html), route).not.toContain(name);
			// The last part rather than the first: the doorway's own wording
			// says what is behind it, and says it in nearly the first's words.
			expect(plainText(html), route).not.toContain(GUIDE_PARTS.at(-1)!.heading);
		}
	});

	it('has no practice routes of its own on any path', () => {
		for (const route of routesIn(beta)) {
			expect(route, route).not.toMatch(/practice\/guide/);
		}
	});

	it('leaves no dead link anywhere in the build', () => {
		expect(deadLinks(beta)).toEqual([]);
	});
});

describe('the standing guide, unpublished', () => {
	it('drops the third arrival option rather than showing it as a dead link', () => {
		const html = pageAt(production, '/');
		const words = plainText(html);

		expect(words).not.toContain(THIRD_ANSWER);
		expect(html).not.toContain(`href="${GUIDE_ROUTE}"`);
		// The other two answers are untouched: one record held back closes one
		// path, not the resource.
		expect(html).toContain('href="/me/"');
		expect(html).toContain('href="/with/"');
	});

	it('emits a loud build warning saying which option went and why', () => {
		expect(productionOutput).toContain('[the standing guide]');
		expect(productionOutput).toContain('in-review');
		expect(productionOutput).toContain(THIRD_ANSWER);
	});

	it('links to the guide from nowhere at all', () => {
		for (const route of routesIn(production)) {
			expect(pageAt(production, route), route).not.toContain(`href="${GUIDE_ROUTE}"`);
		}
	});

	it('keeps the doorway wording on companion screens, as a sentence', () => {
		const html = pageAt(production, '/with/');
		expect(plainText(html)).toContain(GUIDE_DOORWAY);
		expect(html).not.toContain(`href="${GUIDE_ROUTE}"`);
	});

	it('still serves /child/ rather than a 404, and does not continue guide-less', () => {
		expect(hasPageAt(production, GUIDE_ROUTE)).toBe(true);
		const html = pageAt(production, GUIDE_ROUTE);
		const words = plainText(html);

		expect(words).toContain(GUIDE_UNAVAILABLE.heading);
		for (const line of GUIDE_UNAVAILABLE.lines) expect(words).toContain(line);
		// The way onward is out of the path, not further into it.
		expect(html).toContain('href="/"');
		expect(html).not.toContain(`href="${CHILD.door}"`);
		expect(html).not.toContain('href="/child/for/');
	});

	it('leaves no dead link behind', () => {
		expect(deadLinks(production)).toEqual([]);
	});
});
