import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { NEED_TAGS } from '../src/catalog/practice-record.js';
import { needTagSlug } from '../src/catalog/need-tags.js';
import { escapesFor } from '../src/framing/audience.js';
import { routesFor } from '../src/framing/routes.js';
import {
	LOW_ENERGY_EMPTY,
	LOW_ENERGY_LEAD,
	LOW_ENERGY_LINK,
	LOW_ENERGY_OUTSIDE_LEAD,
	LOW_ENERGY_TAB,
	NOT_SURE_TITLE,
	ORIENTATION_LINES,
	QUESTION,
	SET_LEAD,
	TAIL_LEAD,
	TAIL_TITLE,
} from '../src/framing/discovery.js';
import { CRISIS_LEAD, LIMITS_LINE } from '../src/framing/safety.js';
import { buildBothReleases, hasPageAt, pageAt, plainText } from './support/build.js';

/** The direct user's own routes and escapes: this suite is about their tree. */
const { forTag: needTagRoute } = routesFor('me');
const ESCAPES = escapesFor('me');

/**
 * The discovery question and the suggestion sets, direct-user path.
 *
 * Asserted against the built pages, because most of these rules are about what
 * a reader meets on a screen: which answers are offered, what a set contains
 * and in what order, and what the page refuses to say about them.
 */

const QUESTION_PAGE = '/me/';
/** A tag two published practices carry. */
const STILL = '/me/for/be-still/';
/** A tag nothing published carries. */
const COMPANY = '/me/for/some-company/';
/** A tag only the pending record carries: beta only. */
const ANGER = '/me/for/room-for-anger-grief-or-doubt/';
const NOT_SURE = '/me/not-sure/';

let production: string;
let beta: string;
let cleanUp: () => void;
/** The screens as a reader meets them: words, not markup. */
let question: string;
let set: string;

beforeAll(() => {
	({
		builds: { production, beta },
		cleanUp,
	} = buildBothReleases());
	question = plainText(pageAt(production, QUESTION_PAGE));
	set = plainText(pageAt(production, STILL));
});

afterAll(() => cleanUp?.());

/** Where `needle` sits in the page, asserted to be there at all. */
function at(haystack: string, needle: string): number {
	const index = haystack.indexOf(needle);
	expect(index, `page does not contain: ${needle}`).toBeGreaterThan(-1);
	return index;
}

/** The practice slugs a set screen links to, in the order it links to them. */
function practicesOn(html: string): string[] {
	return [...html.matchAll(/href="\/me\/practice\/([^/"]+)\//g)].map((match) => match[1]);
}

/** The markup the set tail opens with, named once so the two users agree. */
const TAIL_MARKUP = '<section class="tail"';

/** Where the quiet divider falls: everything above it, and everything below. */
function split(html: string): { set: string; tail: string } {
	const divider = html.indexOf(TAIL_MARKUP);
	expect(divider, 'page carries no set tail').toBeGreaterThan(-1);
	return { set: html.slice(0, divider), tail: html.slice(divider) };
}

/**
 * The screen without its chrome.
 *
 * The one persistent link is a question ("What is this?"), so a test about how
 * many questions a screen asks has to look at the screen rather than the page.
 */
function mainOf(html: string): string {
	return plainText(html.match(/<main>([\s\S]*)<\/main>/)?.[1] ?? '');
}

describe('the discovery question', () => {
	it('asks one question, with the orientation line as a subhead', () => {
		const asked = at(question, QUESTION);
		for (const line of ORIENTATION_LINES) {
			expect(at(question, line)).toBeGreaterThan(asked);
		}
	});

	it('offers the need tags verbatim, with no label layer', () => {
		for (const tag of ['I want to be still', 'I want as little as possible asked of me']) {
			expect(question).toContain(tag);
		}
	});

	it('offers an answer as an ordinary link to its set', () => {
		expect(pageAt(production, QUESTION_PAGE)).toContain(`href="${needTagRoute('I want to be still')}"`);
	});

	it('offers a tag one published practice carries', () => {
		expect(question).toContain('I want as little as possible asked of me');
		expect(hasPageAt(production, '/me/for/as-little-as-possible-asked-of-me/')).toBe(true);
	});

	it('drops a tag at zero, on that build only', () => {
		expect(question).not.toContain('I want some company');
		expect(hasPageAt(production, COMPANY)).toBe(false);

		expect(plainText(pageAt(production, QUESTION_PAGE))).not.toContain(
			'I want room for anger, grief, or doubt',
		);
		expect(plainText(pageAt(beta, QUESTION_PAGE))).toContain('I want room for anger, grief, or doubt');
		expect(hasPageAt(beta, ANGER)).toBe(true);
	});

	it('has no begin button and no second question', () => {
		expect(mainOf(pageAt(production, QUESTION_PAGE)).match(/\?/g)).toHaveLength(1);
		expect(question.toLowerCase()).not.toContain('begin');
		expect(pageAt(production, QUESTION_PAGE)).not.toContain('<button');
	});
});

describe('a suggestion set', () => {
	it('holds every published practice carrying the tag, in the fixed editorial order', () => {
		expect(practicesOn(split(pageAt(production, STILL)).set)).toEqual([
			'noticing-whats-around-you',
			'rest-without-a-task',
		]);
	});

	it('names the answer that opened it, verbatim', () => {
		expect(set).toContain('I want to be still');
	});

	it('frames itself as a starting point, not a result about the reader', () => {
		for (const line of SET_LEAD) expect(set).toContain(line);
	});

	it('is unranked: no numbering, no ordering language, no best match', () => {
		// Phrases rather than bare words: a practice named "music that matches
		// how you feel" must not make this test fail when it lands.
		for (const phrase of [
			'best match',
			'closest',
			'most suitable',
			'recommend',
			'ranked',
			'in order of',
			'first choice',
		]) {
			expect(set.toLowerCase(), phrase).not.toContain(phrase);
		}
		expect(pageAt(production, STILL)).not.toContain('<ol');
	});

	it('carries neither the limits line nor the crisis pointer', () => {
		expect(set).not.toContain(LIMITS_LINE);
		expect(set).not.toContain(CRISIS_LEAD);
	});

	it('builds a set for every tag the question offers, and none it does not', () => {
		for (const tag of NEED_TAGS) {
			const route = `/me/for/${needTagSlug(tag)}/`;
			expect(hasPageAt(production, route), route).toBe(
				plainText(pageAt(production, QUESTION_PAGE)).includes(tag),
			);
		}
	});
});

describe('the set tail', () => {
	/**
	 * The list carried below every set, labelled as not matching what was
	 * chosen ([#25](https://github.com/inarush0/spiritual-collective/issues/25)).
	 * It is what stops a one-practice screen reading as a verdict, so these are
	 * assertions about the *shape* of the page rather than about its contents.
	 */
	const sets = [STILL, '/me/for/as-little-as-possible-asked-of-me/', NOT_SURE];

	it('carries the practices not on screen, scanning on from the set and wrapping', () => {
		// Production publishes three: noticing, rest, a small kindness. The set
		// behind "I want to be still" is the first two, so the tail is the one
		// left — and it comes after them in the editorial order.
		expect(practicesOn(split(pageAt(production, STILL)).tail)).toEqual(['a-small-kindness']);

		// Beta publishes one more, late in the order, so its tail wraps past
		// the end of the catalog to reach the pending record.
		expect(practicesOn(split(pageAt(beta, STILL)).tail)).toEqual([
			'saying-the-hard-thing',
			'a-small-kindness',
		]);
	});

	it('never repeats a practice the reader is already looking at', () => {
		for (const route of sets) {
			for (const build of [production, beta]) {
				const { set, tail } = split(pageAt(build, route));
				const onScreen = practicesOn(set);
				expect(onScreen.length, route).toBeGreaterThan(0);
				for (const slug of practicesOn(tail)) {
					expect(onScreen, `${route} repeats ${slug}`).not.toContain(slug);
				}
			}
		}
	});

	it('says, on every set screen, that it is not what was chosen', () => {
		for (const route of sets) {
			const below = plainText(split(pageAt(production, route)).tail);
			expect(below, route).toContain(TAIL_TITLE);
			for (const line of TAIL_LEAD) expect(below, route).toContain(line);
		}
	});

	it('gives the fixed set the same shape as a set an answer opened', () => {
		// A set of one and a set of four are the same page, whatever is above
		// the divider. What the written catalog can show is that the tail's
		// structure does not vary with the set's size; `test/set-tail.test.ts`
		// holds the constant tail size at catalog sizes the records do not
		// yet reach.
		// The framing elements, not the entries: while the catalog is smaller
		// than a set plus a tail, the number of entries below the line is what
		// is left over rather than what the rule asks for.
		const structure = (route: string) =>
			(split(pageAt(beta, route)).tail.match(/<(section|hr|h2|ul)\b/g) ?? []).join(' ');

		for (const route of sets) expect(structure(route), route).toBe(structure(sets[0]!));
	});

	it('is absent from /me/everything/, which has nothing it is not showing', () => {
		expect(pageAt(production, '/me/everything/')).not.toContain(TAIL_MARKUP);
	});
});

/**
 * The **low-energy variant**: the alternative for someone with almost nothing
 * to give ([#26](https://github.com/inarush0/spiritual-collective/issues/26)).
 *
 * Production publishes one low-energy practice, rest without a task, which
 * carries two of the eight tags — so the built site holds both cases the page
 * has to read well in: a tag with one of its own, and a tag with none. The
 * third case, a catalog with no low-energy practice anywhere, is not buildable
 * from the written records and is held at the data layer in
 * `test/low-energy.test.ts`.
 */
describe('the low-energy variant', () => {
	/** A tag whose set has a low-energy practice in it. */
	const STILL_LOW = `${STILL}low/`;
	/** A tag whose set has none, so the page falls back past it. */
	const MAKING_LOW = '/me/for/make-or-do-something/low/';

	it('holds the practices carrying the tag whose low energy is true', () => {
		expect(practicesOn(pageAt(production, STILL_LOW))).toEqual(['rest-without-a-task']);
	});

	it('leaves out a practice carrying the tag that does not work lying down', () => {
		// Noticing what's around you is on the set above; its `low energy` is
		// false, and this page is the one place that field decides anything.
		expect(practicesOn(pageAt(production, STILL))).toContain('noticing-whats-around-you');
		expect(practicesOn(pageAt(production, STILL_LOW))).not.toContain('noticing-whats-around-you');
	});

	it('is offered on every set screen, stocked or not', () => {
		for (const tag of NEED_TAGS) {
			const route = `/me/for/${needTagSlug(tag)}/`;
			if (!hasPageAt(production, route)) continue;
			expect(pageAt(production, route), route).toContain(`href="${route}low/"`);
			expect(plainText(pageAt(production, route)), route).toContain(LOW_ENERGY_LINK);
		}
	});

	it('offers the same link on a set screen whose variant fell back', () => {
		// The link is the thing that must not vary: identical markup on the set
		// whose tag has a low-energy practice and on the set whose tag has none,
		// so that following it — or not — tells the reader nothing.
		const linkOn = (route: string) => pageAt(production, route).match(/<p class="low-energy"[\s\S]*?<\/p>/)?.[0];
		expect(linkOn('/me/for/make-or-do-something/')).toBeDefined();
		expect(linkOn(STILL)?.replace('be-still', 'TAG')).toBe(
			linkOn('/me/for/make-or-do-something/')?.replace('make-or-do-something', 'TAG'),
		);
	});

	it('builds a variant for every tag the question offers, and none it does not', () => {
		for (const tag of NEED_TAGS) {
			const route = `/me/for/${needTagSlug(tag)}/`;
			expect(hasPageAt(production, `${route}low/`), route).toBe(hasPageAt(production, route));
		}
	});

	it('falls back past an empty tag, framed as the tail is framed', () => {
		const page = plainText(pageAt(production, MAKING_LOW));
		expect(practicesOn(pageAt(production, MAKING_LOW))).toEqual(['rest-without-a-task']);
		for (const line of LOW_ENERGY_OUTSIDE_LEAD) expect(page).toContain(line);
		// The tail's own sentence, so the two places say it the same way.
		expect(LOW_ENERGY_OUTSIDE_LEAD[0]).toBe(TAIL_LEAD[0]);
	});

	it('says where its practices came from only when they are not from the tag', () => {
		expect(plainText(pageAt(production, STILL_LOW))).not.toContain(LOW_ENERGY_OUTSIDE_LEAD[0]);
	});

	it('makes the same promise on both, and offers the way back to the set', () => {
		for (const route of [STILL_LOW, MAKING_LOW]) {
			const page = plainText(pageAt(production, route));
			for (const line of LOW_ENERGY_LEAD) expect(page, route).toContain(line);
			expect(pageAt(production, route), route).toContain(`href="${route.replace(/low\/$/, '')}"`);
		}
	});

	it('is not the set screen wearing the same name in a tab or a bookmark', () => {
		const titleOf = (route: string) => pageAt(production, route).match(/<title>([^<]*)<\/title>/)?.[1];
		expect(titleOf(STILL_LOW)).toBe(LOW_ENERGY_TAB('I want to be still'));
		expect(titleOf(STILL_LOW)).not.toBe(titleOf(STILL));
	});

	it('does not say the list is empty while it is showing one', () => {
		// The other half of that branch — a lead over no list — needs a build
		// publishing no low-energy practice at all, which the written records
		// cannot produce.
		for (const route of [STILL_LOW, MAKING_LOW]) {
			expect(plainText(pageAt(production, route)), route).not.toContain(LOW_ENERGY_EMPTY);
		}
	});

	it('is a path of its own, not a toggle or a query string', () => {
		for (const route of [STILL, '/me/for/make-or-do-something/']) {
			const screen = pageAt(production, route);
			expect(screen, route).not.toContain('?low');
			expect(screen, route).not.toContain('<input');
			expect(screen, route).not.toContain('<button');
		}
	});

	it('carries no set tail, which would undo the promise it makes', () => {
		// The editorial order knows nothing about energy, so a tail here would
		// put practices that need getting up on the one page saying nothing
		// does. Nor does the page link to itself.
		for (const route of [STILL_LOW, MAKING_LOW]) {
			expect(pageAt(production, route), route).not.toContain(TAIL_MARKUP);
			expect(pageAt(production, route), route).not.toContain(`href="${route}"`);
		}
	});

	it('carries neither the limits line nor the crisis pointer', () => {
		const page = plainText(pageAt(production, STILL_LOW));
		expect(page).not.toContain(LIMITS_LINE);
		expect(page).not.toContain(CRISIS_LEAD);
	});
});

describe('/me/not-sure/', () => {
	it('serves its fixed set, in the fixed editorial order', () => {
		expect(practicesOn(split(pageAt(production, NOT_SURE)).set)).toEqual([
			'noticing-whats-around-you',
			'rest-without-a-task',
		]);
	});

	it('is shaped like any other set, and asks nothing', () => {
		const notSure = plainText(pageAt(production, NOT_SURE));
		expect(notSure).toContain(NOT_SURE_TITLE);
		for (const line of SET_LEAD) expect(notSure).toContain(line);
		expect(notSure).not.toContain(QUESTION);
	});
});

describe('the three escapes', () => {
	const flow = [QUESTION_PAGE, STILL, NOT_SURE, '/me/everything/'];

	it('appear on every screen in the flow', () => {
		for (const route of flow) {
			const screen = plainText(pageAt(production, route));
			for (const escape of ESCAPES) {
				expect(screen, `${route} is missing: ${escape.words}`).toContain(escape.words);
			}
		}
	});

	it('link onward, and never back to the screen the reader is on', () => {
		for (const route of flow) {
			const screen = pageAt(production, route);
			for (const escape of ESCAPES) {
				expect(screen.includes(`href="${escape.route}"`), `${route} → ${escape.route}`).toBe(
					escape.route !== route,
				);
			}
		}
	});
});
