/**
 * The stepped view's framing wording, direct-user path.
 *
 * The stepped view is user-advanced, one step per page, with no timer and no
 * audio (`docs/spec/01-journey-and-ia.md`). Everything below is the wrapper
 * around a canonical step — the words that say where you are, how to change
 * it, how to go on, and how to stop. **The canonical step itself is never
 * written here**: it comes from the record, verbatim, and the same sequence
 * serves all three paths.
 *
 * A **tier-2 framing surface** (`docs/spec/05-governance.md`): placeholder
 * drafting until the chaplain reviewer has read it, like everything in
 * `content/`.
 *
 * The companion paths' wrapper — "Before you offer this", "Being alongside",
 * "Leave this here" — belongs to the companion route trees, not here.
 */

/**
 * Where the reader is in the sequence.
 *
 * The total is named as well as the position, and it is orientation rather
 * than a meter: the whole sequence is already on the practice view, read in
 * full before anything starts, so "of 4" tells a reader nothing they were not
 * shown. A reader who cannot see how much is left has to guess, and guessing
 * is its own pressure. It says where you are; it says nothing about how far
 * you ought to get, and no screen here treats the last step as the point.
 */
export function stepLabel(step: number, total: number): string {
	return `Step ${step} of ${total}`;
}

/**
 * The advance. An ordinary link the reader clicks, and the only thing that
 * moves the practice on: nothing here advances by itself.
 */
export const NEXT = 'Next step.';

/**
 * The end of the written sequence, said plainly on the last step.
 *
 * Not "you finished": the practice is the reader's, and the resource only ever
 * ran out of things to write down. Completion language is banned phrasing
 * (`docs/spec/03-safety-and-inclusion.md`), and this is the screen most likely
 * to slip into it.
 */
export const LAST_STEP = 'That is the last step written down here.';

/** The last step's way onward, to the same exit that stopping reaches. */
export const ONWARD = 'Go on from here.';

/** The stop control, on every step screen. Direct users keep "Stop". */
export const STOP = 'Stop.';

/**
 * "Change this", on every step screen.
 *
 * The record's `ways to change it` and `smallest version` stay reachable
 * inside the steps rather than only on the practice view, so a reader who
 * finds a step hard does not have to leave the practice to learn it can be
 * made smaller. Disclosed in place, because a link away mid-practice is a
 * harder thing to come back from.
 */
export const CHANGE_THIS = 'Change this';
