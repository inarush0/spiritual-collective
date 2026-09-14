import { needTagSlug } from '../catalog/need-tags.js';
import type { NeedTag } from '../catalog/practice-record.js';

/**
 * The route table, for all three **audience paths**.
 *
 * §1 of the spec enumerates every state of the journey as a real prerendered
 * page (`docs/spec/01-journey-and-ia.md`), and three trees of them differ only
 * in their first segment: `/me/`, `/with/`, `/child/`. A page a reader is sent
 * to is named once here rather than spelled again in each sentence that leads
 * to it — and, now that the same screens serve every path, **a route is built
 * from the path a page is on rather than written into the page**. That is what
 * keeps the promise §1 makes: every practice reachable on every path, and no
 * path quietly showing a smaller catalog than another.
 *
 * Wording stays where it belongs — `./discovery.ts`, `./companion.ts`,
 * `./exits.ts`, `./practice-view.ts`, and `./audience.ts` for what changes with
 * the path. This file holds no words a reader reads.
 */

/** The three audience paths, by their URL segment. */
export const AUDIENCE_PATHS = ['me', 'with', 'child'] as const;

export type AudiencePath = (typeof AUDIENCE_PATHS)[number];

/**
 * The two paths held by someone acting alongside another person.
 *
 * Asked as a question about the path rather than stored as a flag on each one,
 * because "is this a companion?" is the same question in every place it is
 * asked, and a flag can be set wrong once per path.
 */
export function isCompanionPath(path: AudiencePath): boolean {
	return path !== 'me';
}

/** Every route one audience path holds. */
export interface PathRoutes {
	path: AudiencePath;
	/**
	 * The path's own door onto a set.
	 *
	 * The direct user's is the discovery question, which is the only screen
	 * that asks anything; a companion's is a set itself, met immediately and
	 * with no question (§1). `/child/`'s door is `/child/set/` because `/child/`
	 * itself is the **standing guide**, met before the catalog.
	 */
	door: string;
	notSure: string;
	everything: string;
	nothing: string;
	exit: string;
	/** The suggestion set for one need tag. */
	forTag(tag: NeedTag): string;
	/** That set's **low-energy variant**, derived so the two cannot drift. */
	lowEnergy(tag: NeedTag): string;
	/** The practice view for one practice. */
	practice(slug: string): string;
}

/** Where a path's set door is, for the one path whose door is not its root. */
const DOORS: Record<AudiencePath, string> = {
	me: '/me/',
	with: '/with/',
	child: '/child/set/',
};

/** The route table of one audience path. */
export function routesFor(path: AudiencePath): PathRoutes {
	const root = `/${path}/`;
	return {
		path,
		door: DOORS[path],
		notSure: `${root}not-sure/`,
		everything: `${root}everything/`,
		nothing: `${root}nothing-right-now/`,
		exit: `${root}after/`,
		forTag: (tag) => `${root}for/${needTagSlug(tag)}/`,
		lowEnergy: (tag) => `${root}for/${needTagSlug(tag)}/low/`,
		practice: (slug) => `${root}practice/${slug}/`,
	};
}

/**
 * Two screens this route tree points at and does not build: arrival, where
 * "Change who this is for" leads
 * ([#28](https://github.com/inarush0/spiritual-collective/issues/28)), and the
 * **standing guide** at `/child/`, which every companion screen keeps a quiet
 * doorway back to
 * ([#30](https://github.com/inarush0/spiritual-collective/issues/30)).
 *
 * Both are `null` until the page exists, and the screens that offer them
 * render a sentence rather than a link while it does not. **A link to a page
 * that is not there is worse than a sentence**: someone following a chaplain's
 * link should always meet a way onward that works, which is the same rule that
 * keeps a withdrawn practice's URL serving a 200 (§1). Landing either page is
 * then one line here rather than an edit on every screen that names it.
 */
export const ARRIVAL_ROUTE: string | null = null;

export const GUIDE_ROUTE: string | null = null;

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
