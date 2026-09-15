import { getCollection, type CollectionEntry } from 'astro:content';
import { selectCatalog } from './select.js';
import { release } from '../records/release.js';

export type Practice = CollectionEntry<'practices'>;

/**
 * Which build this is, and what it marks — re-exported so no page reaches for
 * the variable itself, and none has to know that the answer is a fact about a
 * release rather than about the catalog (`src/records/release.ts`).
 */
export { pendingIn, release, type Release } from '../records/release.js';

/**
 * The practices this build publishes, in the fixed editorial order.
 *
 * Every page that lists practices reads from here. The two builds differ only
 * in what this returns, so no route has to know the filter exists.
 */
export async function loadCatalog(): Promise<Practice[]> {
	return selectCatalog(await getCollection('practices'), release);
}
