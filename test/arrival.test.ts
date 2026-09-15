import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildBothReleases, hasPageAt, pageAt, plainText } from './support/build.js';

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

describe('arrival', () => {
	it('is the first real screen at /', () => {
		for (const build of [production, beta]) {
			expect(hasPageAt(build, '/')).toBe(true);
			expect(plainText(pageAt(build, '/'))).toContain('Who are you here for?');
		}
	});

	it('opens each available audience path at its structurally different door', () => {
		const html = pageAt(production, '/');
		const words = plainText(html);

		expect(words).toContain('Myself');
		expect(html).toContain('href="/me/"');
		expect(words).toContain('Someone I am with');
		expect(html).toContain('href="/with/"');
		// The third answer's door is the **standing guide**, and it is offered
		// only while the guide record is published. Both states of that gate
		// are `test/guide.test.ts`.
		expect(words).toContain('A younger child I am caring for');
		expect(html).toContain('href="/child/"');
	});

	it('carries the three escapes, with uncertainty resolving to the direct-user path', () => {
		const html = pageAt(production, '/');
		const words = plainText(html);

		expect(html).toContain('href="/me/not-sure/"');
		expect(words).toContain("I'm not sure.");
		expect(html).toContain('href="/me/everything/"');
		expect(words).toContain('Show me everything.');
		expect(html).toContain('href="/me/nothing-right-now/"');
		expect(words).toContain('Nothing right now.');
	});

	it('states that nothing is saved and carries every choice only in the URL path', () => {
		const html = pageAt(production, '/');
		const words = plainText(html);
		const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]!);

		expect(words).toContain('Nothing you choose here is saved.');
		expect(html).not.toMatch(/<(form|button|input|script)\b/);
		expect(hrefs.length).toBeGreaterThan(0);
		for (const href of hrefs) {
			expect(href).toMatch(/^\/[^?]*$/);
		}
	});
});
