import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
	ABOUT_ROUTE,
	ABOUT_SECTIONS,
	CHROME_LINK,
	REPORT_ADDRESS,
	sentenceText,
	type SectionId,
} from '../src/framing/about.js';
import { CRISIS_LEAD, LIMITS_LINE } from '../src/framing/safety.js';
import { buildBothReleases, hasPageAt, pageAt, plainText, routesIn } from './support/build.js';

/**
 * The about page and the persistent chrome link.
 *
 * Asserted against the built pages, because most of these rules are about what
 * a reader meets where: the section order, the one link that is on every screen
 * and the fact that nothing else is, and the absence of a date anywhere on the
 * site (`docs/spec/01-journey-and-ia.md`).
 */

let production: string;
let beta: string;
let cleanUp: () => void;
/** The about page as a reader meets it: words, not markup. */
let about: string;
let aboutHtml: string;

beforeAll(() => {
	({
		builds: { production, beta },
		cleanUp,
	} = buildBothReleases());
	aboutHtml = pageAt(production, ABOUT_ROUTE);
	about = plainText(aboutHtml);
});

afterAll(() => cleanUp?.());

/** The paragraph a section renders, as words. */
function paragraph(id: SectionId): string {
	return sentencesOf(id).map(sentenceText).join(' ');
}

/** One section's sentences, asserted to exist at all. */
function sentencesOf(id: SectionId) {
	const section = ABOUT_SECTIONS.find((candidate) => candidate.id === id);
	expect(section, `no section: ${id}`).toBeDefined();
	return section!.sentences;
}

/** Where `needle` sits on the about page, asserted to be there at all. */
function at(needle: string): number {
	const index = about.indexOf(needle);
	expect(index, `the about page does not contain: ${needle}`).toBeGreaterThan(-1);
	return index;
}

describe('the about page', () => {
	it('is a real page at /about/, on both releases', () => {
		expect(hasPageAt(production, ABOUT_ROUTE)).toBe(true);
		expect(hasPageAt(beta, ABOUT_ROUTE)).toBe(true);
	});

	it('runs the six sections in the specified order', () => {
		// The section's opening words: enough to find it, and not disturbed by
		// the one sentence that carries a link inside it.
		const positions = ABOUT_SECTIONS.map((section) =>
			at(sentenceText(section.sentences[0]!).split(REPORT_ADDRESS)[0]!),
		);

		expect(ABOUT_SECTIONS.map((section) => section.id)).toEqual([
			'purpose',
			'limits',
			'review',
			'belief',
			'data',
			'contact',
		]);
		expect(positions).toEqual([...positions].sort((a, b) => a - b));
	});

	it('is short paragraphs rather than headings with prose beneath them', () => {
		// One heading, the page's own. A section is a paragraph.
		expect(aboutHtml).not.toMatch(/<h[2-6][\s>]/);
		expect(about.split(/\s+/).length).toBeLessThan(500);
		for (const section of ABOUT_SECTIONS) {
			expect(section.sentences.length, section.id).toBeLessThanOrEqual(5);
		}
	});

	it('says what this is and who it is for, in two sentences', () => {
		expect(ABOUT_SECTIONS[0]!.sentences).toHaveLength(2);
	});

	it('carries the fuller limits statement', () => {
		const limits = paragraph('limits');
		for (const word of ['assessment', 'treatment', 'counselling', 'crisis service']) {
			expect(limits).toContain(word);
		}
		// The fuller statement, not a second copy of the practice view's line.
		expect(about).not.toContain(LIMITS_LINE);
	});

	it('states review as a role and a process fact, naming no one', () => {
		const review = paragraph('review');

		expect(review).toContain('Nothing is published here until a chaplain has read it');
		expect(review).toContain('pediatric palliative care');
		expect(review).toContain('has not been tried with patients or families');
		expect(review).toContain('not affiliated with any hospital, religious body, or company');
		// No badge, and no institution or person: a capital letter anywhere but
		// the start of a sentence is the shape a name arrives in.
		expect(review.toLowerCase()).not.toContain('chaplain-approved');
		expect(midSentenceCapitals(review), 'a name or an institution').toEqual([]);
	});

	it('says the stance on belief', () => {
		const belief = paragraph('belief');

		expect(belief).toContain('does not ask you to believe anything');
		expect(belief).toContain('does not belong to a tradition');
	});

	it('says the data facts in four sentences, and discloses what emailing shares', () => {
		expect(ABOUT_SECTIONS.find((section) => section.id === 'data')!.sentences).toHaveLength(4);

		const data = paragraph('data');
		expect(data).toContain('no account');
		expect(data).toContain('no analytics');
		expect(data).toContain('nothing is sent anywhere');
		expect(data).toContain('nothing about you is stored');
		// The one thing ordinary use does not cover (spec 05, §data).
		expect(data).toMatch(/shares your email address and your message/);
	});

	it('carries the accountability channel as a plain mailto, framed narrowly', () => {
		const contact = paragraph('contact');

		expect(aboutHtml).toContain(`href="mailto:${REPORT_ADDRESS}"`);
		expect(contact).toContain('wrong, unsafe, or hurt someone');
		expect(contact).toContain('not monitored urgently');
		expect(contact).toContain('not a way to reach help now');
		expect(contact).toContain('names, diagnoses, institutions');
		// On the page, not only in the constant the page is built from.
		expect(about).toContain('not monitored urgently');
		expect(about).toContain(REPORT_ADDRESS);
		// A general "contact us" invites messages this project cannot answer.
		expect(about.toLowerCase()).not.toContain('contact us');
		expect(about.toLowerCase()).not.toContain('get in touch');
	});

	it('speaks in the present tense, promising nothing about staying up or free', () => {
		expect(about).toMatch(/\bfree\b/);
		expect(about).not.toMatch(/\bwill (always|stay|remain|continue|keep)\b/i);
		expect(about).not.toMatch(/\bforever\b|\bpermanently\b/i);
	});

	it('makes exactly one outbound-looking reference, the mailto', () => {
		const hrefs = [...aboutHtml.matchAll(/href="([^"]*)"/g)].map(([, href]) => href!);

		expect(hrefs.filter((href) => href.startsWith('mailto:'))).toHaveLength(1);
		expect(hrefs).not.toContainEqual(expect.stringMatching(/^(https?:)?\/\//));
	});
});

describe('the persistent chrome', () => {
	it('puts "What is this?" on every page of both builds', () => {
		for (const dir of [production, beta]) {
			const built = routesIn(dir);
			expect(built.length).toBeGreaterThan(1);
			for (const route of built) {
				const html = pageAt(dir, route);
				expect(plainText(html), route).toContain(CHROME_LINK);
				expect(html, route).toContain(`href="${ABOUT_ROUTE}"`);
			}
		}
	});

	it('is the only persistent chrome', () => {
		// Both builds: beta carries one extra every-screen element, the review
		// bar, and nothing else may join it there either.
		for (const dir of [production, beta]) {
			for (const route of routesIn(dir)) {
				const html = pageAt(dir, route);
				const [, chrome = ''] = /<footer[^>]*>([\s\S]*?)<\/footer>/.exec(html) ?? [];

				expect(chrome, route).toContain(CHROME_LINK);
				// One link in it, and nothing else riding along: on every screen the
				// crisis pointer would frame the whole resource as an emergency.
				expect([...chrome.matchAll(/<a\b/g)], route).toHaveLength(1);
				expect(chrome, route).not.toContain(CRISIS_LEAD);
				expect(chrome, route).not.toContain('988');
				// No second bar: no header, no nav, nothing else on every screen.
				expect(html, route).not.toMatch(/<(header|nav)[\s>]/);
			}
		}
	});

	it('marks the link as the current page on the about page itself', () => {
		expect(aboutHtml).toMatch(/<a[^>]+aria-current="page"/);
	});

	it('is the only way the about page is reached', () => {
		// The about page is never met before the arrival question: nothing
		// offers it as a destination in the journey, only the chrome link does.
		for (const route of routesIn(production)) {
			const html = pageAt(production, route);
			expect([...html.matchAll(new RegExp(`href="${ABOUT_ROUTE}"`, 'g'))], route).toHaveLength(1);
		}
	});
});

describe('no user-facing dates anywhere on the site', () => {
	const MONTHS =
		/\b(january|february|march|april|june|july|august|september|october|november|december)\b/i;
	const YEAR = /\b(19|20)\d{2}\b/;
	const NUMERIC = /\b\d{1,4}[-/]\d{1,2}[-/]\d{1,4}\b/;

	it('shows no date, per record or site-level', () => {
		for (const dir of [production, beta]) {
			for (const route of routesIn(dir)) {
				const words = plainText(pageAt(dir, route));
				expect(words, route).not.toMatch(MONTHS);
				expect(words, route).not.toMatch(YEAR);
				expect(words, route).not.toMatch(NUMERIC);
			}
		}
	});

	it('says the rule the dates would have stood in for', () => {
		const review = paragraph('review');
		expect(review).toContain('nothing is published unreviewed');
		expect(review).toContain('returns it to review');
	});
});

/**
 * Capitalised words that are not starting a sentence.
 *
 * The review paragraph must name no person and no institution, and both arrive
 * as proper nouns. Sentence-initial words and the pronoun "I" are not evidence
 * of one.
 */
function midSentenceCapitals(paragraph: string): string[] {
	return paragraph
		.split(/(?<=[.:;!?])\s+/)
		.flatMap((sentence) => sentence.split(/\s+/).slice(1))
		.filter((word) => /^[A-Z]/.test(word) && word !== 'I');
}
