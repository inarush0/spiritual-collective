import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CRISIS_LEAD, LIMITS_LINE } from '../src/framing/safety.js';
import { ACTION } from '../src/framing/practice-view.js';
import {
	EXIT_LINES,
	EXIT_ROUTE,
	EXIT_TITLE,
	EXITS,
	NOTHING_LINES,
	NOTHING_ROUTE,
	NOTHING_TITLE,
} from '../src/framing/exits.js';
import { CHANGE_THIS, LAST_STEP, NEXT, ONWARD, STOP, stepLabel } from '../src/framing/stepped-view.js';
import { buildBothReleases, hasPageAt, pageAt, plainText } from './support/build.js';

/**
 * The stepped view and the exit, direct user.
 *
 * Asserted against the built pages, because every rule here is about what a
 * reader meets on one screen and what they cannot meet on it: one canonical
 * step per page, nothing that advances by itself, and an exit that asks
 * nothing back.
 */

/** An approved record with four canonical steps. */
const SLUG = 'noticing-whats-around-you';
const PRACTICE = `/me/practice/${SLUG}/`;
const STEPS = [
	'Let your eyes land on one thing in the room.',
	'Notice its colour, and whether it is bright or dull.',
	'Move to the next thing your eyes find.',
	'Stay with whatever holds you.',
];

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

/** One step screen as a reader meets it: words, not markup. */
function step(n: number, dir = production): string {
	return plainText(pageAt(dir, `${PRACTICE}${n}/`));
}

describe('one step per page', () => {
	it('builds a page for every canonical step and nothing past the last', () => {
		for (let n = 1; n <= STEPS.length; n += 1) {
			expect(hasPageAt(production, `${PRACTICE}${n}/`), `step ${n}`).toBe(true);
		}
		expect(hasPageAt(production, `${PRACTICE}${STEPS.length + 1}/`)).toBe(false);
		expect(hasPageAt(production, `${PRACTICE}0/`)).toBe(false);
	});

	it('builds the stepped view for every practice the release publishes', () => {
		expect(hasPageAt(production, '/me/practice/rest-without-a-task/1/')).toBe(true);
		// Pending records are on beta only, steps included.
		expect(hasPageAt(beta, '/me/practice/saying-the-hard-thing/1/')).toBe(true);
		expect(hasPageAt(production, '/me/practice/saying-the-hard-thing/1/')).toBe(false);
	});

	it('carries its own canonical step, verbatim, and no other', () => {
		const second = step(2);
		expect(second).toContain(STEPS[1]);
		for (const other of [STEPS[0], STEPS[2], STEPS[3]]) {
			expect(second, `step 2 also shows: ${other}`).not.toContain(other);
		}
	});

	it('says where the reader is without claiming progress', () => {
		expect(step(2)).toContain(stepLabel(2, STEPS.length));
	});

	it('is entered from the practice view action', () => {
		const html = pageAt(production, PRACTICE);
		expect(plainText(html)).toContain(ACTION);
		expect(html).toContain(`href="${PRACTICE}1/"`);
	});
});

describe('nothing advances on its own', () => {
	it('ships no client JavaScript, no refresh, no timer, and no audio', () => {
		for (let n = 1; n <= STEPS.length; n += 1) {
			const html = pageAt(production, `${PRACTICE}${n}/`);
			expect(html, `step ${n}`).not.toMatch(/<script/i);
			expect(html, `step ${n}`).not.toMatch(/<(audio|video)\b/i);
			expect(html, `step ${n}`).not.toMatch(/http-equiv="refresh"/i);
		}
	});

	it('advances only by an ordinary link the reader follows', () => {
		expect(pageAt(production, `${PRACTICE}1/`)).toContain(`href="${PRACTICE}2/"`);
		expect(step(1)).toContain(NEXT);
	});

	it('records nothing about where the reader got to', () => {
		// No state to record it in: the step is in the URL and nowhere else.
		const html = pageAt(production, `${PRACTICE}3/`);
		expect(html).not.toMatch(/localStorage|sessionStorage|document\.cookie/);
		expect(html).not.toMatch(/<form\b/i);
	});
});

describe('every step screen carries a stop control and "Change this"', () => {
	it('offers both on every step', () => {
		for (let n = 1; n <= STEPS.length; n += 1) {
			const words = step(n);
			expect(words, `step ${n}`).toContain(STOP);
			expect(words, `step ${n}`).toContain(CHANGE_THIS);
		}
	});

	it('keeps ways to change it and the smallest version reachable inside "Change this"', () => {
		const words = step(3);
		expect(words).toContain('You can do this with sound instead of sight.');
		expect(words).toContain('One thing, noticed once.');
	});

	it('leaves the limits line and the crisis pointer on the practice view', () => {
		// Once, near the stop control, on the practice view (spec 03). Repeating
		// it on every step would hand a reader an emergency framing mid-practice.
		for (let n = 1; n <= STEPS.length; n += 1) {
			expect(step(n), `step ${n}`).not.toContain(LIMITS_LINE);
			expect(step(n), `step ${n}`).not.toContain(CRISIS_LEAD);
		}
	});
});

describe('stopping and the final step reach the same exit', () => {
	it('sends every stop control to the exit', () => {
		for (let n = 1; n <= STEPS.length; n += 1) {
			expect(pageAt(production, `${PRACTICE}${n}/`), `step ${n}`).toContain(
				`href="${EXIT_ROUTE}"`,
			);
		}
	});

	it('sends the last step onward to the same page, with no next step', () => {
		const last = STEPS.length;
		const words = step(last);
		expect(words).toContain(LAST_STEP);
		expect(words).toContain(ONWARD);
		expect(words).not.toContain(NEXT);
		expect(pageAt(production, `${PRACTICE}${last}/`)).not.toContain(`${PRACTICE}${last + 1}/`);
	});
});

describe('the exit', () => {
	let exit: string;
	let html: string;

	beforeAll(() => {
		html = pageAt(production, EXIT_ROUTE);
		exit = plainText(html);
	});

	it('is a real page at a real URL', () => {
		expect(exit).toContain(EXIT_TITLE);
		for (const line of EXIT_LINES) expect(exit).toContain(line);
	});

	it('makes no completion claim and offers no praise', () => {
		for (const claim of [
			'complete',
			'completed',
			'finished',
			'well done',
			'congratulations',
			'good job',
			'proud',
			'you did it',
		]) {
			expect(exit.toLowerCase(), `the exit says: ${claim}`).not.toContain(claim);
		}
	});

	it('asks no reflection or rating question', () => {
		// Nothing to answer, and nowhere to answer it: no question mark outside
		// the chrome link, and no form control of any kind.
		expect(html).not.toMatch(/<(form|input|select|textarea|button)\b/i);
		expect(exit.replace('What is this?', '')).not.toContain('?');
	});

	it('offers choose something else, change who this is for, and nothing right now', () => {
		for (const exitOption of EXITS) {
			expect(exit, exitOption.words).toContain(exitOption.words);
			if (exitOption.route) expect(html).toContain(`href="${exitOption.route}"`);
		}
		expect(EXITS.map((option) => option.words)).toHaveLength(3);
	});

	it('links nowhere that was not built', () => {
		for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
			expect(hasPageAt(production, href), href).toBe(true);
		}
	});
});

describe('the kind screen', () => {
	it('is a real, neutral resting page', () => {
		const words = plainText(pageAt(production, NOTHING_ROUTE));
		expect(words).toContain(NOTHING_TITLE);
		for (const line of NOTHING_LINES) expect(words).toContain(line);
	});

	it('is not a dead end', () => {
		const html = pageAt(production, NOTHING_ROUTE);
		const routes = [...html.matchAll(/href="(\/[^"]*)"/g)].map(([, href]) => href);
		// A way back that is not only the chrome link, and every one of them real.
		expect(routes.filter((route) => route !== '/about/').length).toBeGreaterThan(0);
		for (const route of routes) expect(hasPageAt(production, route), route).toBe(true);
	});

	it('does not try to win the reader back', () => {
		const words = plainText(pageAt(production, NOTHING_ROUTE));
		for (const nudge of ['are you sure', 'instead', 'try again', 'why not']) {
			expect(words.toLowerCase(), `the kind screen says: ${nudge}`).not.toContain(nudge);
		}
	});
});
