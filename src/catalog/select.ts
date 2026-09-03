import { sortByEditorialOrder } from './editorial-order.js';
import type { Publication } from './practice-record.js';
import { publishedIn, type Release } from './release.js';

/** The shape both `getCollection` entries and test fixtures satisfy. */
export interface CatalogEntry {
	id: string;
	data: { publication: Publication };
}

/**
 * The practices this build publishes, in the fixed editorial order.
 *
 * Pure, so the filter-and-order rule can be exercised without a build. The
 * Astro-facing wrapper is `loadCatalog` in `./index.ts`.
 */
export function selectCatalog<T extends CatalogEntry>(
	entries: readonly T[],
	release: Release,
): T[] {
	return sortByEditorialOrder(
		entries.filter((entry) => publishedIn(release, entry.data.publication)),
	);
}
