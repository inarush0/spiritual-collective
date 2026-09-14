import { describe, expect, it } from 'vitest';
import { EDITORIAL_ORDER } from '../src/catalog/editorial-order.js';
import { lowEnergySet } from '../src/catalog/low-energy.js';
import type { NeedTag } from '../src/catalog/practice-record.js';

/**
 * The **low-energy variant**'s membership: the practices carrying a tag whose
 * `low energy` is true, falling back to the low-energy practices from outside
 * the tag where that filter is empty (`docs/spec/01-journey-and-ia.md`).
 *
 * Exercised against a fixture catalog rather than a build, because the rule
 * under test is about what happens at *tag* populations the written records do
 * not hold: a tag with several low-energy practices, a tag with none, and a
 * catalog with none at all. The built pages are asserted in
 * `test/discovery.test.ts`.
 */

const STILL: NeedTag = 'I want to be still';
const COMPANY: NeedTag = 'I want some company';

/** A catalog in the fixed editorial order, built from what each slot carries. */
function catalogOf(entries: Record<string, { tags: NeedTag[]; low: boolean }>) {
	return EDITORIAL_ORDER.filter((slug) => slug in entries).map((slug) => ({
		id: slug,
		data: { need_tags: entries[slug]!.tags, low_energy: entries[slug]!.low },
	}));
}

/** A catalog where two of the still practices work lying down and one does not. */
const catalog = catalogOf({
	'rest-without-a-task': { tags: [STILL], low: true },
	'noticing-whats-around-you': { tags: [STILL], low: false },
	'gentle-movement-or-stillness': { tags: [STILL], low: true },
	'a-small-kindness': { tags: [COMPANY], low: false },
});

/** The variant for a tag, as slugs plus where they came from. */
function variantFor(tag: NeedTag, from = catalog) {
	const variant = lowEnergySet(from, tag);
	return { ...variant, practices: variant.practices.map((practice) => practice.id) };
}

describe('lowEnergySet', () => {
	it('holds the practices carrying the tag whose low energy is true', () => {
		expect(variantFor(STILL)).toEqual({
			practices: ['rest-without-a-task', 'gentle-movement-or-stillness'],
			fromOutsideTheTag: false,
		});
	});

	it('is in the fixed editorial order, like every other set', () => {
		expect(variantFor(STILL).practices).toEqual(
			EDITORIAL_ORDER.filter((slug) => variantFor(STILL).practices.includes(slug)),
		);
	});

	it('falls back to the low-energy practices from outside the tag where it is empty', () => {
		// Nothing carrying "I want some company" works lying down here, so the
		// page shows what does — and the practice that carries the tag without
		// the field is not one of them. The fallback loosens the tag, never the
		// promise the page makes about what is on it.
		expect(variantFor(COMPANY)).toEqual({
			practices: ['rest-without-a-task', 'gentle-movement-or-stillness'],
			fromOutsideTheTag: true,
		});
	});

	it('is empty only where the catalog holds no low-energy practice at all', () => {
		const none = catalogOf({
			'noticing-whats-around-you': { tags: [STILL], low: false },
			'a-small-kindness': { tags: [COMPANY], low: false },
		});
		expect(variantFor(STILL, none).practices).toEqual([]);
	});

	it('never falls back where the tag has one of its own, however few', () => {
		// The one case the fallback must not reach: a tag with a single
		// low-energy practice is not a thin result to be topped up from the rest
		// of the catalog. Topping it up would say the page judged it too short.
		const one = catalogOf({
			'rest-without-a-task': { tags: [STILL], low: true },
			'gentle-movement-or-stillness': { tags: [COMPANY], low: true },
		});
		expect(variantFor(STILL, one)).toEqual({
			practices: ['rest-without-a-task'],
			fromOutsideTheTag: false,
		});
	});
});
