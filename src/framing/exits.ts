import { CHANGE_PATH } from './audience.js';
import { ARRIVAL_ROUTE, isCompanionPath, routesFor, type AudiencePath } from './routes.js';

/**
 * The exit, and the kind screen it can lead to.
 *
 * Stopping and reaching the final step lead to **the same** quiet exit
 * (`docs/spec/01-journey-and-ia.md`). The exit is unconditional: it is reached
 * the same way whether the reader did every step or left on the first one, and
 * it never learns which, because nothing about a visitor is recorded.
 *
 * Three rules shape every sentence below, and all three are rules about what
 * is *absent*:
 *
 * - **No completion claim.** The resource cannot know what happened, and
 *   completion language is banned phrasing (`docs/spec/03-safety-and-inclusion.md`).
 * - **No reflection or rating question.** Asking "did that help?" hands the
 *   reader homework on the way out and turns a practice into a test.
 * - **No praise.** Praise implies the alternative was worse.
 *
 * The exit is **path-specific**: one per **audience path**, holding nothing
 * about which practice was open, so the sentences that name a route are
 * written as functions of the path rather than as constants pointing at the
 * direct user's. The extra line the companion exits carry — that the companion
 * does not need to ask whether the practice helped — belongs with the
 * companion stepped view
 * ([#29](https://github.com/inarush0/spiritual-collective/issues/29)), which
 * is where those two pages land.
 *
 * **Tier-2 framing surfaces** (`docs/spec/05-governance.md`): placeholder
 * drafting until the chaplain reviewer has read them.
 */

export const EXIT_TITLE = 'That is as far as this goes.';

/**
 * The one line under the heading.
 *
 * It says what the page does not know, because a reader arriving from a stop
 * control is most likely to expect that it does. One line and no more: every
 * further sentence here is a sentence about how the practice went, and naming
 * the evaluation is most of the way to asking for it. The reassurance that
 * nobody need ask whether the practice helped belongs to the companion paths,
 * where the spec puts it.
 */
export const EXIT_LINES: readonly string[] = [
	'You stopped, or the steps ran out. Either one is the same to this page, and nothing here kept a record of which.',
];

/** One way onward from the exit. `route` is null while its page is unbuilt. */
export interface Exit {
	words: string;
	route: string | null;
}

/**
 * The three ways onward, in order.
 *
 * "Change who this is for" carries no route yet: arrival is its own ticket
 * ([#28](https://github.com/inarush0/spiritual-collective/issues/28)), and a
 * link to a page that does not exist is worse than a sentence — someone
 * following a chaplain's link should always meet a way onward that works. The
 * wording is here now so that arrival landing is one route, not a rewrite.
 *
 * "Choose something else" goes to a suggestion set, as the spec says. For the
 * direct user that is the whole catalog, the set that asks nothing: they have
 * not said what they want by leaving a practice, and sending them back to the
 * discovery question would put a question on the way out of one. A companion
 * was never asked in the first place, so their own door is already a set, and
 * it is the one they came in through.
 */
export function waysOnward(path: AudiencePath): Exit[] {
	const routes = routesFor(path);
	return [
		{
			words: 'Choose something else.',
			route: isCompanionPath(path) ? routes.door : routes.everything,
		},
		{ words: CHANGE_PATH, route: ARRIVAL_ROUTE },
		{ words: 'Nothing right now.', route: routes.nothing },
	];
}

export const NOTHING_TITLE = 'Nothing right now.';

/**
 * The kind screen.
 *
 * Offered as an escape on every screen, so it has to be somewhere a person can
 * actually land: neutral, kind, and making no attempt to win them back. The
 * last line is the one thing keeping it from being a dead end, and it is a way
 * back rather than an invitation to reconsider.
 */
export const NOTHING_LINES: readonly string[] = [
	'That is a whole answer. You do not owe anyone a reason for it, and nobody here is asking for one.',
	'Nothing on this page is waiting for you, and nothing carries on without you. You can close it and it keeps nothing.',
];

/**
 * A sentence with a link inside it — the same shape as `CrisisLine` in
 * `./safety.ts` and `AddressSentence` in `./about.ts`, and for the same
 * reason: a template that had to find the link inside a string would be a
 * second place that knows what the sentence says.
 */
export interface LinkedSentence {
	before: string;
	words: string;
	route: string;
	after: string;
}

/**
 * The way back, if it is wanted. Quiet, and last.
 *
 * It leads to the catalog of the path the reader is on, so that the one way
 * out of the kind screen does not also change who the resource thinks they
 * are.
 */
export function nothingOnward(path: AudiencePath): LinkedSentence {
	return {
		before: 'If you want to look again, whenever that is, it is all in ',
		words: 'one list',
		route: routesFor(path).everything,
		after: '.',
	};
}
