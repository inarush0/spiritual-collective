import { sortByEditorialOrder } from './editorial-order.js';
import type { TaggedEntry } from './need-tags.js';
import type { NeedTag } from './practice-record.js';

/**
 * The **low-energy variant**'s membership: what sits on `/me/for/<tag>/low/`.
 *
 * The practices carrying that need tag whose `low energy` field is true and,
 * where that filter is empty, the low-energy practices from outside the tag
 * instead (`docs/spec/01-journey-and-ia.md`). One boolean field decides it;
 * there is no second list of which practices work lying down, and no page picks
 * its own.
 *
 * The fallback is the same idea as the **set tail**, for the same reason. The
 * link to this page is unconditional — `src/framing/LowEnergyLink.astro` says
 * why — and a page offered unconditionally cannot then be blank. So where the
 * filter is empty it shows what does work this way, said plainly to be not
 * from what they chose.
 *
 * What the fallback is **not** is a top-up. A tag with one low-energy practice
 * keeps its one: padding a thin result from the rest of the catalog would be
 * the page judging the answer too short, which is the thing none of this
 * machinery is allowed to do.
 *
 * Pure, and takes its catalog as an argument, so the rules can be exercised at
 * tag populations the written records do not hold.
 */

/**
 * The shape this needs from a record: what a set needs, plus whether the
 * practice works lying down. Extended from `TaggedEntry` rather than restated,
 * so the tag field is described in one place.
 */
export interface LowEnergyEntry extends TaggedEntry {
	data: TaggedEntry['data'] & { low_energy: boolean };
}

/** A low-energy variant: what it holds, and whether it came from the tag. */
export interface LowEnergySet<T> {
	/** The practices, in the fixed editorial order. */
	practices: T[];
	/**
	 * Whether these came from outside the chosen tag — the one thing the page
	 * needs in order to frame them as the tail is framed. Empty and
	 * fallen-back-to are distinct: a catalog holding no low-energy practice at
	 * all leaves nothing to fall back *to*, so the page checks the list before
	 * it reads this.
	 */
	fromOutsideTheTag: boolean;
}

/** The low-energy variant of one need tag's suggestion set. */
export function lowEnergySet<T extends LowEnergyEntry>(
	practices: readonly T[],
	tag: NeedTag,
): LowEnergySet<T> {
	const lowEnergy = practices.filter((practice) => practice.data.low_energy);
	const carryingTheTag = lowEnergy.filter((practice) => practice.data.need_tags.includes(tag));
	const fromOutsideTheTag = carryingTheTag.length === 0;

	return {
		practices: sortByEditorialOrder(fromOutsideTheTag ? lowEnergy : carryingTheTag),
		fromOutsideTheTag,
	};
}
