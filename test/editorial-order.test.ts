import { describe, expect, it } from 'vitest';
import {
	EDITORIAL_ORDER,
	editorialRank,
	sortByEditorialOrder,
} from '../src/catalog/editorial-order.js';

describe('the fixed editorial order', () => {
	it('holds the twelve catalog slots, lowest-demand first', () => {
		expect(EDITORIAL_ORDER).toEqual([
			'noticing-whats-around-you',
			'rest-without-a-task',
			'music-that-matches-how-you-feel',
			'letting-someone-sit-with-you',
			'gentle-movement-or-stillness',
			'remembering-someone',
			'words-from-your-own-tradition',
			'saying-the-hard-thing',
			'asking-for-a-chaplain',
			'making-something-small',
			'a-message-for-someone',
			'a-small-kindness',
		]);
	});

	it('has no duplicate slots', () => {
		expect(new Set(EDITORIAL_ORDER).size).toBe(EDITORIAL_ORDER.length);
	});

	it('ranks a known slug by its position', () => {
		expect(editorialRank('noticing-whats-around-you')).toBe(0);
		expect(editorialRank('a-small-kindness')).toBe(11);
	});

	it('refuses a slug the order does not name', () => {
		expect(() => editorialRank('some-unlisted-practice')).toThrow(
			/some-unlisted-practice/,
		);
	});
});

describe('sortByEditorialOrder', () => {
	const record = (id: string) => ({ id });

	it('puts records into the fixed order regardless of input order', () => {
		const sorted = sortByEditorialOrder([
			record('a-small-kindness'),
			record('noticing-whats-around-you'),
			record('saying-the-hard-thing'),
			record('rest-without-a-task'),
		]);

		expect(sorted.map((entry) => entry.id)).toEqual([
			'noticing-whats-around-you',
			'rest-without-a-task',
			'saying-the-hard-thing',
			'a-small-kindness',
		]);
	});

	it('does not mutate its input', () => {
		const input = [record('a-small-kindness'), record('rest-without-a-task')];
		sortByEditorialOrder(input);
		expect(input.map((entry) => entry.id)).toEqual([
			'a-small-kindness',
			'rest-without-a-task',
		]);
	});

	it('fails on a record the editorial order does not name', () => {
		expect(() => sortByEditorialOrder([record('a-practice-nobody-ordered')])).toThrow(
			/a-practice-nobody-ordered/,
		);
	});
});
