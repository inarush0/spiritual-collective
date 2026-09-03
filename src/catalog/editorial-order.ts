/**
 * The fixed editorial order over the twelve catalog slots, lowest-demand first.
 *
 * This array is the single source of truth for ordering. `/everything/`, every
 * suggestion set, and the set tail read from here — nothing re-lists the
 * practices in an order of its own. See `docs/spec/02-content-standard.md`
 * ("The fixed editorial order").
 *
 * Changing this array is a governed change, not a code change:
 * `docs/spec/05-governance.md` lists "`/everything/` ordering" among the tier-2
 * framing surfaces, so it needs chaplain approval.
 *
 * Receiving comes before doing, and the two practices requiring another human
 * to act (asking for a chaplain, a message for someone) sit late because they
 * are the largest ask.
 */
export const EDITORIAL_ORDER = [
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
] as const;

const RANKS = new Map<string, number>(EDITORIAL_ORDER.map((slug, index) => [slug, index]));

/**
 * The position of a practice in the fixed editorial order.
 *
 * Throws on a slug the order does not name. A practice record that no order
 * places has no defined position on any page that lists it, so this fails the
 * build rather than silently sorting it to one end.
 */
export function editorialRank(slug: string): number {
	const rank = RANKS.get(slug);
	if (rank === undefined) {
		throw new Error(
			`"${slug}" is not in the fixed editorial order. Add it to EDITORIAL_ORDER in ` +
				'src/catalog/editorial-order.ts, or rename the record file to match a slot.',
		);
	}
	return rank;
}

/**
 * A copy of `records`, in the fixed editorial order.
 *
 * Every record is ranked before anything is sorted, so a record the order does
 * not name fails even when it is the only one — `Array.sort` never calls its
 * comparator on a single element, and a stray content file is exactly the case
 * that has to fail.
 */
export function sortByEditorialOrder<T extends { id: string }>(records: readonly T[]): T[] {
	return records
		.map((record) => ({ record, rank: editorialRank(record.id) }))
		.sort((a, b) => a.rank - b.rank)
		.map(({ record }) => record);
}
