import { getEntry, type CollectionEntry } from 'astro:content';
import { publishedIn, release, type Release } from '../records/release.js';
import { missingGuideParts } from './guide-record.js';

/**
 * The **standing guide**, as this build publishes it.
 *
 * The guide is one record and one page, and its `publication` decides more
 * than whether that page has words on it: it **gates the third arrival
 * option** (`docs/spec/01-journey-and-ia.md`). A companion caring for a
 * younger child is sent to the guide before the catalog, so a build that
 * cannot publish the guide must not offer that path — the alternative is a
 * caregiver handed practices to offer a dying child with none of the
 * how-to-offer, how-to-adapt, and no-suitability wording the path exists to
 * put in front of them first.
 *
 * Everything the gate turns on is therefore asked here, once, and answered
 * with the guide or with `null`. A screen never reads `publication` itself and
 * never decides what an unpublished guide means.
 */

export type Guide = CollectionEntry<'guide'>;

/** The one guide record. Its `id` is its filename: `content/guide.md`. */
const GUIDE_ID = 'guide';

/**
 * The guide this build publishes, or `null`.
 *
 * `null` is the whole of what a caller needs: the arrival option is absent,
 * the doorway on companion screens is a sentence rather than a link, and
 * `/child/` says the guide is not available right now instead of falling
 * through to the catalog.
 */
export async function loadGuide(): Promise<Guide | null> {
	const guide = await getEntry('guide', GUIDE_ID);

	if (!guide) {
		warnOnce(
			'there is no content/guide.md, so the younger-child path is not offered. ' +
				'Write the guide record (docs/spec/02-content-standard.md).',
		);
		return null;
	}

	if (!publishedIn(release, guide.data.publication)) {
		warnOnce(unpublishedWarning(release, guide.data.publication));
		return null;
	}

	// A published guide missing one of its four parts is the one thing here
	// that fails the build rather than warning. The parts are not decoration:
	// the **no-suitability statement** is a refusal this resource owes the
	// reader, and a guide that has lost it is worse to publish than to hold.
	const missing = missingGuideParts(guide.body ?? '');
	if (missing.length > 0) {
		throw new Error(
			`content/guide.md is published but does not hold ${missing
				.map((part) => part.name)
				.join(', ')}. Add the missing section${missing.length === 1 ? '' : 's'}: ` +
				`${missing.map((part) => `"## ${part.heading}"`).join(', ')}.`,
		);
	}

	return guide;
}

/**
 * The warning the spec asks for when the gate closes
 * (`docs/spec/07-technical-constraints.md`).
 *
 * **Loud, and not a build failure**, for the same reason a need tag at zero is
 * not: `withdrawn` is the instrument for wording that is actively harmful, and
 * a build that refused to complete without the guide would make an urgent
 * withdrawal of it wait on writing a replacement. The resource goes out
 * two-thirds of itself instead, and says so on the way past.
 */
function unpublishedWarning(release: Release, publication: string): string {
	return (
		`content/guide.md is "${publication}", so the ${release} build does not publish the ` +
		'standing guide. The third arrival option — "A younger child I am caring for" — is ' +
		'absent from the arrival screen, and no screen links to the guide. Approve the guide ' +
		'record to offer that path again.'
	);
}

/**
 * Said once per build.
 *
 * Arrival asks, and so does every companion screen's doorway, so a warning
 * printed per caller would be the same sentence a hundred times — which is a
 * warning read as noise.
 */
const warned = new Set<string>();

function warnOnce(message: string): void {
	if (warned.has(message)) return;
	warned.add(message);
	console.warn(`[the standing guide] ${message}`);
}
