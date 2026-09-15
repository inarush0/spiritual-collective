import { GUIDE_ROUTE, routesFor } from './routes.js';

/** The one question on the arrival screen. */
export const ARRIVAL_QUESTION = 'Who are you here for?';

/** The privacy fact beside the choice, where it can govern the choice. */
export const ARRIVAL_PRIVACY = 'Nothing you choose here is saved.';

export interface ArrivalAnswer {
	words: string;
	route: string | null;
}

/**
 * The three answers and the structurally different screen each one opens.
 *
 * The younger-child answer is deliberately present in this definition before
 * it is necessarily visible. Its door is the governed standing guide, so the
 * answer becomes available only when that guide has a route; rendering a link
 * sooner would let the path continue guide-less.
 */
export const ARRIVAL_ANSWERS: readonly ArrivalAnswer[] = [
	{ words: 'Myself', route: routesFor('me').door },
	{ words: 'Someone I am with', route: routesFor('with').door },
	{ words: 'A younger child I am caring for', route: GUIDE_ROUTE },
];
