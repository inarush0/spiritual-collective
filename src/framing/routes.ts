/**
 * The direct user's route table.
 *
 * §1 of the spec enumerates every state of the journey as a real prerendered
 * page (`docs/spec/01-journey-and-ia.md`), and several of those pages point at
 * each other: the exit offers the set screen, every screen in the flow offers
 * the kind screen, the practice view's refusal offers the whole catalog. The
 * routes live here, in one file, so that a page a reader is sent to is named
 * once rather than spelled again in each sentence that leads to it.
 *
 * Wording stays where it belongs — `./discovery.ts`, `./exits.ts`,
 * `./practice-view.ts`. This file holds no words a reader reads.
 */

/** The discovery question: the direct user's one question, and their set door. */
export const QUESTION_ROUTE = '/me/';

/** The door that skips the question, for a reader who cannot answer it. */
export const NOT_SURE_ROUTE = '/me/not-sure/';

/** The whole catalog, in the fixed editorial order. */
export const CATALOG_ROUTE = '/me/everything/';

/** The kind screen: a real resting state, not a dead end. */
export const NOTHING_ROUTE = '/me/nothing-right-now/';

/** The exit. Every stop control and every last step lands here. */
export const EXIT_ROUTE = '/me/after/';

/**
 * The practice view for one practice.
 *
 * The set routes are not here: `/me/for/<need-tag-slug>/` is derived from the
 * tag string itself in `src/catalog/need-tags.ts`, where the derivation and
 * the tags it reads from sit together.
 */
export function practiceRoute(slug: string): string {
	return `/me/practice/${slug}/`;
}

/**
 * Whether `route` is the page the reader is already on.
 *
 * Every link that appears on many screens needs this — the chrome link on the
 * about page, each escape on the screen it points at — and each of them says
 * where the reader is rather than pretending to lead somewhere. Astro's
 * pathname may or may not carry the trailing slash the route table writes, so
 * the comparison is normalised here instead of at each call site.
 */
export function isHere(pathname: string, route: string): boolean {
	return `${pathname.replace(/\/$/, '')}/` === route;
}
