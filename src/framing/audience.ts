import {
	CHILD_BADGE,
	COMPANION_ACTION,
	COMPANION_CATALOG_LEAD,
	COMPANION_LOW_ENERGY_LEAD,
	COMPANION_LOW_ENERGY_LINK,
	COMPANION_NOT_SURE_LINES,
	COMPANION_SET_LEAD,
	COMPANION_SET_TITLE,
	WITH_BADGE,
} from './companion.js';
import {
	CATALOG_LEAD,
	LOW_ENERGY_LEAD,
	LOW_ENERGY_LINK,
	NOT_SURE_LINES,
	SET_LEAD,
	SET_TITLE,
} from './discovery.js';
import { ACTION, PATH_BADGE } from './practice-view.js';
import { isCompanionPath, routesFor, type AudiencePath, type PathRoutes } from './routes.js';

/**
 * What changes with the **audience path**, in one place.
 *
 * The three paths are the same catalog rendered three ways: the practices, the
 * sets, the canonical steps, and the order they are in are identical, and what
 * differs is who the page is talking to
 * (`docs/spec/01-journey-and-ia.md`). Every screen below `/me/`, `/with/` and
 * `/child/` is therefore **one template asking this module which words it is
 * showing**, rather than three templates holding one copy each.
 *
 * That is not only tidiness. §1 promises that every practice is reachable on
 * every path and that no companion ever meets a silently smaller catalog, and
 * three templates per screen is exactly how one of them comes to filter, cap,
 * or forget something the others do not. A page that cannot hold a rule of its
 * own cannot break one.
 *
 * The words themselves stay in `./discovery.ts` and `./companion.ts`, where a
 * chaplain reads them as screens rather than as a table. This file chooses
 * between them and writes none.
 */

/** The badge each path names itself with. */
const BADGES: Record<AudiencePath, string> = {
	me: PATH_BADGE,
	with: WITH_BADGE,
	child: CHILD_BADGE,
};

/** The wording a direct user meets, and a companion's beside it. */
type PathWords = Pick<
	PathFraming,
	'setLead' | 'setTitle' | 'action' | 'notSureLines' | 'catalogLead' | 'lowEnergyLink' | 'lowEnergyLead'
>;

const DIRECT_WORDS: PathWords = {
	setLead: SET_LEAD,
	setTitle: SET_TITLE,
	action: ACTION,
	notSureLines: NOT_SURE_LINES,
	catalogLead: CATALOG_LEAD,
	lowEnergyLink: LOW_ENERGY_LINK,
	lowEnergyLead: LOW_ENERGY_LEAD,
};

const COMPANION_WORDS: PathWords = {
	setLead: COMPANION_SET_LEAD,
	setTitle: COMPANION_SET_TITLE,
	action: COMPANION_ACTION,
	notSureLines: COMPANION_NOT_SURE_LINES,
	catalogLead: COMPANION_CATALOG_LEAD,
	lowEnergyLink: COMPANION_LOW_ENERGY_LINK,
	lowEnergyLead: COMPANION_LOW_ENERGY_LEAD,
};

/** Everything one path renders differently, and the routes it renders them at. */
export interface PathFraming {
	path: AudiencePath;
	routes: PathRoutes;
	/** Whether this reader is acting alongside another person. */
	companion: boolean;
	/** The badge naming the current path. */
	badge: string;
	/** The lead-in over a set: reaching, or offering. */
	setLead: readonly string[];
	/** What sits over the need tag a set was opened with. */
	setTitle: string;
	/** The practice view's action. */
	action: string;
	/**
	 * Where that action leads, or `null` while the screen behind it is unbuilt.
	 *
	 * The direct user's is step one. A companion's is
	 * `/<path>/practice/<slug>/before/` — "Before you offer this", which holds
	 * the `companion note` and `companion cautions` a companion reads before
	 * anything is offered to anyone (§1). That screen and the companion
	 * stepped view behind it are
	 * [#29](https://github.com/inarush0/spiritual-collective/issues/29), so the
	 * action is words rather than a link until it lands: a companion path must
	 * not reach a set of steps that skips the cautions, and it must not hand a
	 * companion the direct user's rendering, which addresses the wrong person.
	 */
	actionRoute(slug: string): string | null;
	/** The line under "Not sure is fine." */
	notSureLines: readonly string[];
	/** The lead over the whole catalog. */
	catalogLead: string;
	/** The link to the **low-energy variant**, and the lead on the page itself. */
	lowEnergyLink: string;
	lowEnergyLead: readonly string[];
}

/**
 * The framing one audience path reads.
 *
 * There is no default and no fallback: a screen that could not name its path
 * would have to guess who it was addressing, and the wrong guess on a
 * companion path is a page telling a caregiver to try something themselves.
 */
export function framingFor(path: AudiencePath): PathFraming {
	const companion = isCompanionPath(path);
	const routes = routesFor(path);
	return {
		path,
		routes,
		companion,
		badge: BADGES[path],
		// One table rather than a ternary per line: what turns with the path is
		// then a thing that can be read at a glance and counted, and a sentence
		// cannot be given to the wrong reader by a condition written backwards.
		...(companion ? COMPANION_WORDS : DIRECT_WORDS),
		actionRoute: (slug) => (companion ? null : `${routes.practice(slug)}1/`),
	};
}

/** One way out of the flow: the words, and where they go. */
export interface Escape {
	words: string;
	route: string;
}

/**
 * The three escapes, on every screen in every flow.
 *
 * They are ordinary links at the same size as everything else. "I'm not sure"
 * is first because it is the one a reader wants while looking at a question
 * they cannot answer; "Nothing right now" is last, and it is a real page
 * rather than a way of saying goodbye.
 *
 * **The words are the same on every path and the routes are not.** An escape
 * leads out of the flow the reader is in rather than into the direct user's,
 * so a companion who has had enough is not handed a screen addressed to
 * somebody else on the way out.
 *
 * A screen renders the escape that points at itself as a plain line, so that
 * none of the three is ever a link back to where the reader already is.
 */
export function escapesFor(path: AudiencePath): Escape[] {
	const routes = routesFor(path);
	return [
		{ words: "I'm not sure.", route: routes.notSure },
		{ words: 'Show me everything.', route: routes.everything },
		{ words: 'Nothing right now.', route: routes.nothing },
	];
}

/**
 * The way back to arrival, offered on every practice view beside the badge
 * that names the path (`docs/spec/01-journey-and-ia.md`).
 *
 * One string, because it is offered from the exit as well, and a reader who
 * meets the same move worded two ways has to work out whether it is the same
 * move.
 */
export const CHANGE_PATH = 'Change who this is for.';
