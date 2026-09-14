import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { NEED_TAGS } from '../src/catalog/practice-record.js';
import { needTagRoute, needTagSlug } from '../src/catalog/need-tags.js';
import {
	ESCAPES,
	NOT_SURE_TITLE,
	ORIENTATION_LINES,
	QUESTION,
	SET_LEAD,
} from '../src/framing/discovery.js';
import { CRISIS_LEAD, LIMITS_LINE } from '../src/framing/safety.js';
import { buildBothReleases, hasPageAt, pageAt, plainText } from './support/build.js';

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
		expect(practicesOn(pageAt(production, STILL))).toEqual([
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

describe('/me/not-sure/', () => {
	it('serves its fixed set, in the fixed editorial order', () => {
		expect(practicesOn(pageAt(production, NOT_SURE))).toEqual([
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
