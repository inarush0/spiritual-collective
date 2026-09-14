import { describe, expect, it } from 'vitest';
import { EDITORIAL_ORDER } from '../src/catalog/editorial-order.js';
import { TAIL_SIZE, setTail } from '../src/catalog/set-tail.js';

/**
 * The **set tail**: the next three practices in the editorial order not
 * already on screen, scanning onward from the set's last practice and
 * wrapping (`docs/spec/01-journey-and-ia.md`, `docs/spec/07-technical-constraints.md`).
 *
 * Exercised against a fixture catalog rather than a build, because the rule
 * these tests exist to hold is about set *sizes* — a set of one and a set of
 * four must produce the same page — and the written catalog holds neither
 * size yet.
 */

const catalog = EDITORIAL_ORDER.map((id) => ({ id }));

/** The tail of the set named by these slugs, as slugs. */
function tailOf(slugs: readonly string[], from: readonly { id: string }[] = catalog): string[] {
	const set = from.filter((practice) => slugs.includes(practice.id));
	return setTail(from, set).map((practice) => practice.id);
}

describe('setTail', () => {
	it('takes the practices after the set, in the fixed editorial order', () => {
		expect(tailOf(['noticing-whats-around-you', 'rest-without-a-task'])).toEqual([
			'music-that-matches-how-you-feel',
			'letting-someone-sit-with-you',
			'gentle-movement-or-stillness',
		]);
	});

	it('scans onward from the set’s last practice, not from its first', () => {
		// A set spanning the catalog: the tail starts after the *last* member,
		// so a spread-out set does not get a tail from the top of the order.
		expect(tailOf(['noticing-whats-around-you', 'saying-the-hard-thing'])).toEqual([
			'asking-for-a-chaplain',
			'making-something-small',
			'a-message-for-someone',
		]);
	});

	it('wraps around the catalog rather than running short at the end', () => {
		expect(tailOf(['a-small-kindness'])).toEqual([
			'noticing-whats-around-you',
			'rest-without-a-task',
			'music-that-matches-how-you-feel',
		]);
	});

	it('never carries a practice already on screen', () => {
		const set = ['a-message-for-someone', 'a-small-kindness', 'noticing-whats-around-you'];
		const tail = tailOf(set);
		for (const slug of set) expect(tail).not.toContain(slug);
		expect(tail).toEqual([
			'rest-without-a-task',
			'music-that-matches-how-you-feel',
			'letting-someone-sit-with-you',
		]);
	});

	it('is the same size whatever the set holds — the whole point of it', () => {
		const one = tailOf(['letting-someone-sit-with-you']);
		const four = tailOf([
			'noticing-whats-around-you',
			'rest-without-a-task',
			'letting-someone-sit-with-you',
			'remembering-someone',
		]);
		expect(one).toHaveLength(TAIL_SIZE);
		expect(four).toHaveLength(TAIL_SIZE);
	});

	it('holds what is left when the catalog cannot fill it, rather than repeating', () => {
		// Only while the catalog is smaller than a set plus a tail. It must
		// never pad by naming a practice the reader is already looking at.
		const small = catalog.slice(0, 4);
		const tail = tailOf(['noticing-whats-around-you', 'rest-without-a-task'], small);
		expect(tail).toEqual(['music-that-matches-how-you-feel', 'letting-someone-sit-with-you']);
	});

	it('is empty where the whole catalog is already on screen', () => {
		expect(tailOf(EDITORIAL_ORDER)).toEqual([]);
	});

	it('starts at the top of the order for a set with nothing in it', () => {
		expect(setTail(catalog, []).map((practice) => practice.id)).toEqual([
			'noticing-whats-around-you',
			'rest-without-a-task',
			'music-that-matches-how-you-feel',
		]);
	});
});
