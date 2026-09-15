import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { GUIDE_DOORWAY, GUIDE_ONWARD, GUIDE_UNAVAILABLE } from '../src/framing/companion.js';
import { GUIDE_ROUTE, routesFor } from '../src/framing/routes.js';
import { GUIDE_PARTS } from '../src/guide/guide-record.js';
import {
	buildBothReleases,
	buildInto,
	hasPageAt,
	pageAt,
	plainText,
	ROOT,
	routesIn,
} from './support/build.js';

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
 * The closed state is built against a temporarily unpublished
 * `content/guide.md`, restored in `finally` and again in `afterAll`. A gate
 * that has never been seen closed is a gate nobody knows the wiring of.
 */

const GUIDE_FILE = join(ROOT, 'content', 'guide.md');
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

describe('the standing guide, published', () => {
	let production: string;
	let beta: string;
	let cleanUp: () => void;

	beforeAll(() => {
		({
			builds: { production, beta },
			cleanUp,
		} = buildBothReleases());
	});

	afterAll(() => cleanUp?.());

	it('is the first screen of the younger-child path, at /child/ itself', () => {
		for (const build of [production, beta]) {
			expect(hasPageAt(build, GUIDE_ROUTE)).toBe(true);
		}
		expect(GUIDE_ROUTE).toBe('/child/');
		expect(CHILD.door).toBe('/child/set/');
	});

	it('holds all four parts', () => {
		const words = plainText(pageAt(production, GUIDE_ROUTE));
		for (const part of GUIDE_PARTS) {
			expect(words, part.name).toContain(part.heading);
		}
	});

	it('states the no-suitability claim in the first of the two places it binds', () => {
		const guide = plainText(pageAt(production, GUIDE_ROUTE));
		const set = plainText(pageAt(production, CHILD.door));

		expect(guide).toMatch(/never met your child/i);
		expect(set).toMatch(/never met your child/i);
	});

	it('is met before the catalog, and leads on to it', () => {
		const html = pageAt(production, GUIDE_ROUTE);
		expect(plainText(html)).toContain(GUIDE_ONWARD);
		expect(html).toContain(`href="${CHILD.door}"`);
	});

	it('is the arrival screen third answer, and its door', () => {
		const html = pageAt(production, '/');
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
				const html = pageAt(production, route);
				expect(plainText(html), route).toContain(GUIDE_DOORWAY);
				expect(html, route).toContain(`href="${GUIDE_ROUTE}"`);
			}
		}
	});

	it('does not offer a doorway to itself', () => {
		expect(plainText(pageAt(production, GUIDE_ROUTE))).not.toContain(GUIDE_DOORWAY);
	});

	it('is never shown to the direct user', () => {
		for (const route of routesIn(production).filter((route) => route.startsWith('/me/'))) {
			const html = pageAt(production, route);
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
			/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(pageAt(production, GUIDE_ROUTE))![1]!,
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
			const html = pageAt(production, route);
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
		for (const route of routesIn(production)) {
			expect(route, route).not.toMatch(/practice\/guide/);
		}
	});

	it('leaves no dead link anywhere in the build', () => {
		expect(deadLinks(production)).toEqual([]);
		expect(deadLinks(beta)).toEqual([]);
	});
});

describe('the standing guide, unpublished', () => {
	/**
	 * The real record, briefly unapproved, and restored whatever happens. It is
	 * governed content: nothing here may be able to lose it, so the original
	 * bytes are held and written back in `finally` and again after the suite.
	 */
	const original = readFileSync(GUIDE_FILE, 'utf8');
	let dir: string | undefined;
	let output = '';

	beforeAll(() => {
		expect(original).toContain('publication: approved');
		writeFileSync(GUIDE_FILE, original.replace('publication: approved', 'publication: in-review'));
		try {
			({ dir, output } = buildInto(undefined));
		} finally {
			writeFileSync(GUIDE_FILE, original);
		}
	});

	afterAll(() => {
		writeFileSync(GUIDE_FILE, original);
		if (dir) rmSync(dir, { recursive: true, force: true });
	});

	it('drops the third arrival option rather than showing it as a dead link', () => {
		const html = pageAt(dir!, '/');
		const words = plainText(html);

		expect(words).not.toContain(THIRD_ANSWER);
		expect(html).not.toContain(`href="${GUIDE_ROUTE}"`);
		// The other two answers are untouched: one record held back closes one
		// path, not the resource.
		expect(html).toContain('href="/me/"');
		expect(html).toContain('href="/with/"');
	});

	it('emits a loud build warning saying which option went and why', () => {
		expect(output).toContain('[the standing guide]');
		expect(output).toContain('in-review');
		expect(output).toContain(THIRD_ANSWER);
	});

	it('links to the guide from nowhere at all', () => {
		for (const route of routesIn(dir!)) {
			expect(pageAt(dir!, route), route).not.toContain(`href="${GUIDE_ROUTE}"`);
		}
	});

	it('keeps the doorway wording on companion screens, as a sentence', () => {
		const html = pageAt(dir!, '/with/');
		expect(plainText(html)).toContain(GUIDE_DOORWAY);
		expect(html).not.toContain(`href="${GUIDE_ROUTE}"`);
	});

	it('still serves /child/ rather than a 404, and does not continue guide-less', () => {
		expect(hasPageAt(dir!, GUIDE_ROUTE)).toBe(true);
		const html = pageAt(dir!, GUIDE_ROUTE);
		const words = plainText(html);

		expect(words).toContain(GUIDE_UNAVAILABLE.heading);
		for (const line of GUIDE_UNAVAILABLE.lines) expect(words).toContain(line);
		// The way onward is out of the path, not further into it.
		expect(html).toContain('href="/"');
		expect(html).not.toContain(`href="${CHILD.door}"`);
		expect(html).not.toContain('href="/child/for/');
	});

	it('leaves no dead link behind', () => {
		expect(deadLinks(dir!)).toEqual([]);
	});
});
