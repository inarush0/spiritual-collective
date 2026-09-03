import { getCollection, type CollectionEntry } from 'astro:content';
import { selectCatalog } from './select.js';
import { resolveRelease, type Release } from './release.js';

export type Practice = CollectionEntry<'practices'>;

export { pendingIn, type Release } from './release.js';

/** Which build this is. Read once here so no page reaches for the variable itself. */
export const release: Release = resolveRelease(process.env);

/**
 * The practices this build publishes, in the fixed editorial order.
 *
 * Every page that lists practices reads from here. The two builds differ only
 * in what this returns, so no route has to know the filter exists.
 */
export async function loadCatalog(): Promise<Practice[]> {
	return selectCatalog(await getCollection('practices'), release);
}
