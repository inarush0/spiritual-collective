import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CRISIS_LEAD, CRISIS_LINES, LIMITS_LINE } from '../src/framing/safety.js';
import { ACTION, PENDING_MARKER, REFUSAL } from '../src/framing/practice-view.js';
import { buildBothReleases, hasPageAt, pageAt, plainText } from './support/build.js';

/**
 * The practice view, direct user: `/me/practice/<slug>/`.
 *
 * Asserted against the built pages rather than a render helper, because three
 * of the rules are about what a reader meets where — the fixed section order,
 * the limits line appearing once, and neither the limits line nor the crisis
 * pointer reaching a set screen.
 */

/** An approved record: on both builds. */
const NOTICING = '/me/practice/noticing-whats-around-you/';
/** A pending record: on beta only. */
const HARD_THING = '/me/practice/saying-the-hard-thing/';

let production: string;
let beta: string;
let cleanUp: () => void;
/** The practice view as a reader meets it: words, not markup. */
let view: string;

beforeAll(() => {
	({
		builds: { production, beta },
		cleanUp,
	} = buildBothReleases());
	view = plainText(pageAt(production, NOTICING));
});

afterAll(() => cleanUp?.());

/** Where `needle` sits in the page, asserted to be there at all. */
function at(haystack: string, needle: string): number {
	const index = haystack.indexOf(needle);
	expect(index, `page does not contain: ${needle}`).toBeGreaterThan(-1);
	return index;
}

describe('every practice in the catalog has a working page', () => {
	it('builds one per practice this release publishes', () => {
		for (const route of [
			NOTICING,
			'/me/practice/rest-without-a-task/',
			'/me/practice/a-small-kindness/',
		]) {
			expect(hasPageAt(production, route), route).toBe(true);
			expect(hasPageAt(beta, route), route).toBe(true);
		}
	});

	it('builds the pending record on beta only', () => {
		expect(hasPageAt(beta, HARD_THING)).toBe(true);
		expect(hasPageAt(production, HARD_THING)).toBe(false);
	});

	it('is linked from /me/everything/', () => {
		const everything = pageAt(production, '/me/everything/');
		for (const slug of ['noticing-whats-around-you', 'rest-without-a-task', 'a-small-kindness']) {
			expect(everything).toContain(`href="/me/practice/${slug}/"`);
		}
	});
});

describe('the fixed shape', () => {
	it('runs what this involves, ways to change it, stop guidance, then the action', () => {
		const involves = at(view, 'What this involves');
		const change = at(view, 'Ways to change it');
		const stop = at(view, 'If you want to stop');
		const action = at(view, ACTION);

		expect(involves).toBeLessThan(change);
		expect(change).toBeLessThan(stop);
		expect(stop).toBeLessThan(action);
	});

	it('is readable in full before anything starts', () => {
		// The record's own words, all of them, on the page before the action.
		expect(view).toContain('Let your eyes land on one thing in the room.');
		expect(view).toContain('You can do this with sound instead of sight.');
		expect(view).toContain('Stop whenever you want.');
		expect(view).toContain('One thing, noticed once.');
	});

	it('offers the action with a visible refusal alongside it', () => {
		expect(view).toContain(ACTION);
		expect(view).toContain(REFUSAL);
	});

	it('carries the plain-language provenance origin line', () => {
		expect(view).toContain(
			'Paying attention to what is in front of you is practised in many traditions and by people with none.',
		);
	});

	it('says what the practice asks the reader to believe', () => {
		// `belief requirement` is a required field so the reader is never
		// surprised, which only holds if the view says it (spec 03).
		expect(view).toContain('This asks you to believe nothing.');
	});

	it('marks a pending record on beta and nowhere else', () => {
		expect(plainText(pageAt(beta, HARD_THING))).toContain(PENDING_MARKER);
		expect(view).not.toContain(PENDING_MARKER);
	});
});

describe('the limits line and the crisis pointer', () => {
	it('says the limits line once, near the stop control', () => {
		expect(view.split(LIMITS_LINE)).toHaveLength(2);
		expect(at(view, 'If you want to stop')).toBeLessThan(at(view, LIMITS_LINE));
	});

	it('keeps the crisis pointer with it but visually distinct', () => {
		const html = pageAt(production, NOTICING);
		expect(at(view, LIMITS_LINE)).toBeLessThan(at(view, CRISIS_LEAD));
		// Distinct to a screen reader too, not only in the eye: a named region
		// the one reader who needs it can be sent to, and everyone else can pass.
		expect(html).toMatch(/<aside[^>]+aria-label="If you need help right now:"/);
	});

	it('names the people already caring for them, then 988, then 911', () => {
		const positions = CRISIS_LINES.map((line) => at(view, line.number ?? line.before));

		expect(positions).toEqual([...positions].sort((a, b) => a - b));
		expect(CRISIS_LINES.map((line) => line.number)).toEqual([undefined, '988', '911']);
	});

	it('offers 988 as plain text and a link, with no third-party request', () => {
		const html = pageAt(production, NOTICING);
		expect(html).toContain('href="tel:988"');
		expect(view).toContain('988');
		// 911 is named, not linked: the spec attaches the link to 988 only.
		expect(view).toContain('911');
		expect(html).not.toContain('tel:911');
		// No widget and no second origin. `npm run gates` asserts this over
		// every page; here it is the pointer's own rule being checked.
		expect([...html.matchAll(/href="([^"]*)"/g)].map(([, href]) => href)).not.toContainEqual(
			expect.stringMatching(/^(https?:)?\/\//),
		);
	});

	it('appears on no set screen', () => {
		// A disclaimer where someone is deciding what to try reads as a warning
		// about the practices themselves.
		const everything = plainText(pageAt(production, '/me/everything/'));
		expect(everything).not.toContain(LIMITS_LINE);
		expect(everything).not.toContain(CRISIS_LEAD);
		expect(everything).not.toContain('988');
	});
});
