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
 * **The third answer is gated on the guide record's `publication`**
 * (`docs/spec/01-journey-and-ia.md`). Its door is the **standing guide**, met
 * before the catalog, and a build that does not publish the guide must not
 * offer the path: the two alternatives are a dead link and a caregiver sent
 * straight to practices to offer a dying child, with none of the how-to-offer,
 * how-to-adapt, or no-suitability wording that path exists to put first.
 * Absence is the only safe closed state, so the answer is dropped rather than
 * shown disabled or explained — a greyed-out option would tell a reader they
 * were being refused something.
 *
 * The answer is still written here when the gate is closed, carrying `null`
 * instead of a route. The arrival screen renders only the answers that have
 * one, which keeps "what the three answers are" in this file and "which of
 * them this build can offer" a single question about the guide.
 */
export function arrivalAnswers(guidePublished: boolean): ArrivalAnswer[] {
	return [
		{ words: 'Myself', route: routesFor('me').door },
		{ words: 'Someone I am with', route: routesFor('with').door },
		{
			words: 'A younger child I am caring for',
			route: guidePublished ? GUIDE_ROUTE : null,
		},
	];
}
