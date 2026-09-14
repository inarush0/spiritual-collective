/**
 * The **set tail**: what every suggestion set carries below the line.
 *
 * The next practices in the fixed editorial order that are not already on
 * screen, scanning onward from the set's last practice and wrapping around the
 * catalog (`docs/spec/01-journey-and-ia.md`,
 * `docs/spec/07-technical-constraints.md`).
 *
 * It exists for one reason: **the layout of a set screen must not change with
 * how well-stocked the answer was**. A tag with one practice behind it and a
 * tag with four produce the same page, so a short set cannot be read as a
 * verdict about the person who chose it. This is the mechanism that replaced
 * the abandoned floor of three practices per need tag
 * ([#3](https://github.com/inarush0/spiritual-collective/issues/3)).
 *
 * Two consequences of that, which the rules below are shaped by:
 *
 * - The tail is **not relevance**. It scans by position in the editorial
 *   order, never by what the set has in common, because a tail computed from
 *   fit would be a second, quieter ranking of the catalog against the reader.
 *   The page says so in words: these are not from what you chose.
 * - It **wraps**, so a set at the end of the order gets the same tail size as
 *   one at the top rather than running short where the catalog happens to end.
 *
 * Pure, and takes its catalog as an argument, so the size rule can be
 * exercised at set sizes the written catalog does not yet hold.
 */

/**
 * How many practices the tail carries.
 *
 * Three: enough that the space below the divider is the same shape on every
 * set screen, small enough that it does not become a second catalog under the
 * first.
 */
export const TAIL_SIZE = 3;

/**
 * The tail for one set.
 *
 * `catalog` and `set` are both in the fixed editorial order — `selectCatalog`
 * and the set builders in `./need-tags.ts` have already applied it, so nothing
 * here re-sorts and there is no second ordering rule to drift.
 *
 * Returns fewer than `TAIL_SIZE` only when the catalog does not hold that many
 * practices outside the set. It never pads by naming a practice the reader is
 * already looking at: repeating what is on screen would be a stranger page
 * than a short tail, and the constant size is reachable as soon as the catalog
 * is bigger than a set plus three. With the twelve slots the editorial order
 * names and sets of three and four, it always is.
 */
export function setTail<T extends { id: string }>(
	catalog: readonly T[],
	set: readonly T[],
): T[] {
	const onScreen = new Set(set.map((practice) => practice.id));

	// Where the scan begins: just past the set's last practice. A set with
	// nothing in it starts at the top of the order rather than nowhere.
	const last = set.at(-1);
	const start = last ? catalog.findIndex((practice) => practice.id === last.id) + 1 : 0;

	const tail: T[] = [];
	for (let step = 0; step < catalog.length && tail.length < TAIL_SIZE; step += 1) {
		const practice = catalog[(start + step) % catalog.length]!;
		if (!onScreen.has(practice.id)) tail.push(practice);
	}
	return tail;
}
