import type { PracticeRecord } from '../catalog/practice-record.js';

/**
 * The practice view's own framing wording, direct-user path, plus the record
 * wording every page that lists a practice shares.
 *
 * Tier-2 framing surfaces (`docs/spec/05-governance.md`), placeholder drafting
 * until the chaplain reviewer has read them. Held here beside the safety
 * wording so that the words a reader meets around a practice are all in one
 * place, and so a test can assert them.
 *
 * The companion paths' wording ("Offer this.") belongs to the companion route
 * trees, not here.
 */

/** The action. Direct user only; a companion is never told to try a practice. */
export const ACTION = "I'll try this.";

/**
 * The refusal, alongside the action and at the same weight.
 *
 * Refusal is visible on every screen (`docs/spec/03-safety-and-inclusion.md`),
 * and it has to go somewhere real: this one leads to the whole catalog. When
 * the kind screen lands it gains the rest of the exits, not a smaller voice.
 */
export const REFUSAL = 'Not this one. Show me everything.';

/** The badge naming the current path. */
export const PATH_BADGE = 'You are reading this for yourself.';

/**
 * The beta marker on a record that has not been approved.
 *
 * Every page that can show a pending record says it the same way — the catalog
 * and the practice view today, every set screen later — so the sentence is one
 * string rather than a literal per template. `pendingIn` decides when it shows.
 */
export const PENDING_MARKER = 'in review — not approved yet';

/**
 * What `belief requirement` means to a reader.
 *
 * Belief is optional everywhere and the field exists "so the reader is never
 * surprised" (`docs/spec/03-safety-and-inclusion.md`). That promise is only
 * kept if the practice view says it, so the field is rendered rather than held
 * as metadata — the reader learns what a practice will ask of them before they
 * are inside it, not after.
 */
export const BELIEF_LINE: Record<PracticeRecord['belief_requirement'], string> = {
	none: 'This asks you to believe nothing.',
	'you supply it': 'You bring your own words or beliefs to this. Nothing is supplied for you.',
	'named tradition': 'This comes from one tradition and uses its words.',
};
