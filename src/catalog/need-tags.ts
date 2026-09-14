import { editorialRank, sortByEditorialOrder } from './editorial-order.js';
import { NEED_TAGS, type NeedTag } from './practice-record.js';

/**
 * Suggestion-set membership.
 *
 * A **suggestion set** is every published practice carrying one **need tag**,
 * in the fixed editorial order, uncapped — no curation layer, no per-tag
 * hand-picked list, no algorithm (`docs/spec/01-journey-and-ia.md`). The
 * records are the only source of truth: the table in
 * `docs/spec/02-content-standard.md` is the expected result of what is written
 * on them, not a second place membership is decided.
 *
 * The sets that are **not** derived are the fixed ones at the foot of this
 * file — the door that skips the question, and the door a companion lands on.
 * Neither can be answered by a tag: one was taken by a reader who could not
 * answer the question, and the other by a reader who was never asked it. They
 * are here rather than elsewhere because a reader meeting either meets a set
 * like any other.
 *
 * Everything here is pure and takes its practices as an argument, so a set can
 * be exercised at sizes the catalog does not currently have. The build-facing
 * catalog is `./index.ts`.
 */

/** The shape a set needs from a record: which practice, and what it carries. */
export interface TaggedEntry {
	id: string;
	data: { need_tags: readonly NeedTag[] };
}

/**
 * The URL segment for a need tag.
 *
 * Derived from the tag string rather than stored beside it. The eight strings
 * are the answer options verbatim, with no separate label layer
 * ([#12](https://github.com/inarush0/spiritual-collective/issues/12)), and a
 * hand-written slug table would be exactly that layer — a second place to edit
 * when a tag is reworded, and a second thing to get out of step with it.
 *
 * The shared "I want" — and the "to" that follows it in half of them — is the
 * grammar every tag has, so it carries nothing in a URL and comes off.
 */
export function needTagSlug(tag: NeedTag): string {
	return tag
		.replace(/^I want (to )?/, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/**
 * The eight tags by slug.
 *
 * Built once from the tags themselves, so a routed slug can only ever resolve
 * to a tag the records may carry. A collision would silently hide one tag
 * behind another's set, so it fails the build instead.
 */
const BY_SLUG: ReadonlyMap<string, NeedTag> = (() => {
	const bySlug = new Map<string, NeedTag>();
	for (const tag of NEED_TAGS) {
		const slug = needTagSlug(tag);
		const taken = bySlug.get(slug);
		if (taken) {
			throw new Error(
				`the need tags "${taken}" and "${tag}" both slug to "${slug}". ` +
					'Two tags cannot share one set URL.',
			);
		}
		bySlug.set(slug, tag);
	}
	return bySlug;
})();

/** The need tag a set URL names, or `undefined` for a slug nothing issued. */
export function needTagBySlug(slug: string): NeedTag | undefined {
	return BY_SLUG.get(slug);
}

/**
 * The suggestion set for one need tag: every practice carrying it, in the
 * fixed editorial order, uncapped.
 *
 * Nothing here trims the result to a shape. A set of one and a set of five are
 * both what the records say, and the set screen's layout — not its length —
 * is what keeps a short set from reading as a verdict.
 */
export function practicesFor<T extends TaggedEntry>(
	practices: readonly T[],
	tag: NeedTag,
): T[] {
	return sortByEditorialOrder(practices.filter((practice) => practice.data.need_tags.includes(tag)));
}

/**
 * The practices a fixed set names, in the fixed editorial order.
 *
 * Fixed sets name slugs rather than tags, so a practice that has not been
 * written yet is simply absent instead of breaking the page: the door still
 * opens onto what exists. Each named slug is checked against the editorial
 * order, so a typo fails the build rather than quietly shrinking the set.
 */
export function practicesIn<T extends { id: string }>(
	practices: readonly T[],
	slugs: readonly string[],
): T[] {
	for (const slug of slugs) editorialRank(slug);
	return sortByEditorialOrder(practices.filter((practice) => slugs.includes(practice.id)));
}

/**
 * A need tag as it is offered: the string a reader reads, and its URL segment.
 *
 * No route, because a tag's set is on three paths and this module knows about
 * none of them. The route is built from the path the reader is on, in
 * `src/framing/routes.ts` — which is what keeps every tag's set reachable on
 * every path rather than on the one a route string happened to name.
 */
export interface NeedTagOffer {
	tag: NeedTag;
	slug: string;
}

/**
 * The need tags this build offers as answer options.
 *
 * A tag is offered whenever **at least one** published practice carries it,
 * and drops out only at zero — the discovery question never offers a door onto
 * an empty room, and never hides one because it is sparsely stocked.
 *
 * Zero is a **loud build warning and not a build failure**
 * (`docs/spec/07-technical-constraints.md`): a coverage hole is something for
 * the editor to fill, and failing on it would make an urgent withdrawal wait
 * on writing a replacement. The production build is where the rule bites —
 * beta offers pending records too, so a tag it warns about has nothing behind
 * it even counting what is still in review.
 *
 * Both the question and the set routes ask which tags are offered, so the
 * warning is said once per tag per build rather than once per caller: a
 * warning printed twice is a warning read as noise.
 */
const warned = new Set<NeedTag>();

export function offeredNeedTags(practices: readonly TaggedEntry[]): NeedTagOffer[] {
	const offered: NeedTagOffer[] = [];

	for (const tag of NEED_TAGS) {
		if (practices.some((practice) => practice.data.need_tags.includes(tag))) {
			offered.push({ tag, slug: needTagSlug(tag) });
			continue;
		}
		if (warned.has(tag)) continue;
		warned.add(tag);
		console.warn(
			`[need tags] no published practice carries "${tag}", so it is not offered as an ` +
				'answer to the discovery question. Write a practice that carries it, or accept ' +
				'seven answers.',
		);
	}

	return offered;
}

/**
 * The fixed set behind `/me/not-sure/` (`docs/spec/01-journey-and-ia.md`).
 *
 * Named by slug because this set is editorial rather than derived: "I'm not
 * sure" is an escape from the question, so it cannot be answered by a tag.
 * It is the only set on this path that does not come from the records, and it
 * is the smallest, lowest-demand door the catalog has.
 */
export const NOT_SURE_SET: readonly string[] = [
	'noticing-whats-around-you',
	'rest-without-a-task',
	'letting-someone-sit-with-you',
];

/**
 * The fixed set behind `/with/` and `/child/set/`
 * (`docs/spec/01-journey-and-ia.md`).
 *
 * A companion is never asked a question, so they land on a set immediately and
 * there is no answer for it to have come from. These three are the practices a
 * person can be offered rather than sent away to do: sitting with someone,
 * saying the hard thing, remembering someone.
 *
 * **One array, read by both companion paths.** The younger-child path reuses
 * the companion set unchanged, because a set hand-picked for a young child
 * would be an age-suitability judgement expressed as page order — the one
 * judgement this resource refuses to make. A second array here, however
 * identical today, would be the place that judgement could later be written
 * without anyone deciding to make it.
 */
export const COMPANION_SET: readonly string[] = [
	'letting-someone-sit-with-you',
	'saying-the-hard-thing',
	'remembering-someone',
];
