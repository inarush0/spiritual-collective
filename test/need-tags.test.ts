import { describe, expect, it, vi } from 'vitest';
import { NEED_TAGS, type NeedTag } from '../src/catalog/practice-record.js';
import {
	COMPANION_SET,
	NOT_SURE_SET,
	needTagBySlug,
	needTagSlug,
	offeredNeedTags,
	practicesFor,
	practicesIn,
} from '../src/catalog/need-tags.js';

/**
 * Set membership is derived from the records' `need tags` and from nothing
 * else, so these are the tests that hold the "no second source of truth"
 * promise (`docs/spec/01-journey-and-ia.md`). They run against fixtures rather
 * than a build, so the rule can be exercised at sizes the catalog does not
 * currently have — one practice behind a tag, and none.
 */

const entry = (id: string, need_tags: NeedTag[]) => ({ id, data: { need_tags } });

/** Out of editorial order on purpose: every caller is asserted to fix that. */
const entries = [
	entry('a-small-kindness', ['I want to make or do something', 'I want to do something for someone']),
	entry('noticing-whats-around-you', ['I want to be still']),
	entry('rest-without-a-task', ['I want as little as possible asked of me', 'I want to be still']),
];

describe('needTagSlug', () => {
	it('drops the "I want" the eight strings share', () => {
		expect(needTagSlug('I want to be still')).toBe('be-still');
		expect(needTagSlug('I want some company')).toBe('some-company');
	});

	it('carries no punctuation into the URL', () => {
		expect(needTagSlug('I want room for anger, grief, or doubt')).toBe(
			'room-for-anger-grief-or-doubt',
		);
	});

	it('gives the eight tags eight distinct slugs', () => {
		const slugs = NEED_TAGS.map(needTagSlug);
		expect(new Set(slugs).size).toBe(NEED_TAGS.length);
		expect(slugs.every((slug) => /^[a-z][a-z-]*[a-z]$/.test(slug))).toBe(true);
	});

	it('round-trips through the slug a URL carries', () => {
		for (const tag of NEED_TAGS) {
			expect(needTagBySlug(needTagSlug(tag))).toBe(tag);
		}
	});

	it('has no tag behind a slug it never issued', () => {
		expect(needTagBySlug('calm')).toBeUndefined();
	});
});

describe('practicesFor', () => {
	it('holds every practice carrying the tag, in the fixed editorial order', () => {
		expect(practicesFor(entries, 'I want to be still').map((e) => e.id)).toEqual([
			'noticing-whats-around-you',
			'rest-without-a-task',
		]);
	});

	it('is uncapped — nothing trims a set to a shape', () => {
		const many = NEED_TAGS.map((_tag, index) =>
			entry(['noticing-whats-around-you', 'rest-without-a-task', 'a-small-kindness'][index % 3], [
				'I want to be still',
			]),
		);
		expect(practicesFor(many, 'I want to be still')).toHaveLength(NEED_TAGS.length);
	});

	it('is empty rather than broken where no practice carries the tag', () => {
		expect(practicesFor(entries, 'I want some company')).toEqual([]);
	});
});

describe('offeredNeedTags', () => {
	it('offers a tag on one practice, and drops one on none', () => {
		const offered = offeredNeedTags(entries);
		const tags = offered.map((offer) => offer.tag);

		expect(tags).toContain('I want as little as possible asked of me');
		expect(tags).not.toContain('I want some company');
		expect(tags).not.toContain('I want to remember someone');
	});

	it('keeps the eight strings in their written order, verbatim', () => {
		const tags = offeredNeedTags(entries).map((offer) => offer.tag);
		expect(tags).toEqual(NEED_TAGS.filter((tag) => tags.includes(tag)));
	});

	it('carries the URL segment the answer option links to, and no route', () => {
		// No route, because a tag's set is on all three paths and this module
		// knows about none of them: the path is what turns a slug into a route,
		// in `src/framing/routes.ts`.
		const still = offeredNeedTags(entries).find((offer) => offer.tag === 'I want to be still');
		expect(still?.slug).toBe('be-still');
		expect(still).not.toHaveProperty('route');
	});

	it('warns loudly about a tag with nothing behind it, once per build', async () => {
		// A fresh module, because the warning is said once per build and both
		// the question and the set routes ask this module the same thing.
		vi.resetModules();
		const { offeredNeedTags: freshly } = await import('../src/catalog/need-tags.js');
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		try {
			expect(freshly(entries)).toHaveLength(4);
			freshly(entries);

			const said = warn.mock.calls.map((call) => String(call[0]));
			expect(said.join('\n')).toContain('I want some company');
			expect(said.join('\n')).toContain('I want to remember someone');
			// Four tags nothing in the fixture carries, said once each across two calls.
			expect(said).toHaveLength(4);
		} finally {
			warn.mockRestore();
		}
	});
});

describe('the fixed sets', () => {
	it('are the ones the spec names', () => {
		expect(NOT_SURE_SET).toEqual([
			'noticing-whats-around-you',
			'rest-without-a-task',
			'letting-someone-sit-with-you',
		]);
		expect(COMPANION_SET).toEqual([
			'letting-someone-sit-with-you',
			'saying-the-hard-thing',
			'remembering-someone',
		]);
	});

	it('hold the named practices this build publishes, in the fixed editorial order', () => {
		expect(practicesIn(entries, NOT_SURE_SET, '/me/not-sure/').map((e) => e.id)).toEqual([
			'noticing-whats-around-you',
			'rest-without-a-task',
		]);
	});

	it('warn loudly when a build publishes none of them, once per door', () => {
		// A door whose whole set is unpublished is a coverage hole, not a
		// reason to fail the build: an urgent withdrawal must never wait on
		// writing a replacement. But nobody should have to find the empty
		// screen in a browser.
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		try {
			practicesIn(entries, COMPANION_SET, '/with/');
			practicesIn(entries, COMPANION_SET, '/with/');
			expect(warn).toHaveBeenCalledTimes(1);
			expect(warn.mock.calls[0]![0]).toContain('/with/');
			expect(warn.mock.calls[0]![0]).toContain('saying-the-hard-thing');
		} finally {
			warn.mockRestore();
		}
	});
});
