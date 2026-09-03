import { describe, expect, it } from 'vitest';
import { selectCatalog } from '../src/catalog/select.js';
import type { Publication } from '../src/catalog/practice-record.js';

const entry = (id: string, publication: Publication) => ({ id, data: { publication } });

const entries = [
	entry('a-small-kindness', 'approved'),
	entry('saying-the-hard-thing', 'in-review'),
	entry('noticing-whats-around-you', 'approved'),
	entry('rest-without-a-task', 'withdrawn'),
];

describe('selectCatalog', () => {
	it('returns approved and pending records on beta, in the fixed editorial order', () => {
		expect(selectCatalog(entries, 'beta').map((e) => e.id)).toEqual([
			'noticing-whats-around-you',
			'saying-the-hard-thing',
			'a-small-kindness',
		]);
	});

	it('offers a withdrawn record on neither build', () => {
		for (const release of ['beta', 'production'] as const) {
			expect(selectCatalog(entries, release).map((e) => e.id)).not.toContain(
				'rest-without-a-task',
			);
		}
	});

	it('returns only approved records in production, in the fixed editorial order', () => {
		expect(selectCatalog(entries, 'production').map((e) => e.id)).toEqual([
			'noticing-whats-around-you',
			'a-small-kindness',
		]);
	});

	it('is empty rather than broken when nothing is approved', () => {
		expect(selectCatalog([entry('a-small-kindness', 'in-review')], 'production')).toEqual([]);
	});
});
