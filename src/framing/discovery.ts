import { CATALOG_ROUTE, NOTHING_ROUTE, NOT_SURE_ROUTE } from './routes.js';

/**
 * The discovery question and the wording around every direct-user set screen.
 *
 * The journey is one gentle question and then a set: no landing page, no
 * "begin" button, no second question (`docs/spec/01-journey-and-ia.md`). The
 * answer options themselves are not here — they are the eight **need tags**,
 * verbatim from the records, with no separate label layer, and they live in
 * `src/catalog/practice-record.ts`.
 *
 * **Tier-2 framing surfaces** (`docs/spec/05-governance.md`): placeholder
 * drafting until the chaplain reviewer has read it. Every sentence a reader
 * meets on these screens is here rather than in a template, so a test can
 * assert it and so the chaplain can read the screens in one file.
 */

/** The discovery question, direct-user path. The only question on this path. */
export const QUESTION = 'What might support you right now?';

/**
 * The orientation line, as a subhead under the question.
 *
 * Three facts, in the order a reader needs them: how they got here, that there
 * is no wrong move, and that nothing is kept. It sits under the question
 * rather than on a screen of its own — a page explaining itself before asking
 * anything is the landing page this journey does not have.
 */
export const ORIENTATION_LINES: readonly string[] = [
	'Someone shared this page with you.',
	'There is no right answer, and nothing you pick is saved.',
];

/**
 * The lead-in over every direct-user set.
 *
 * It frames the set as a starting point, not a result about the person. The
 * first line is the spec's wording; the second says what the page did *not*
 * do, because a list that appears after a question is read as an answer about
 * the reader unless something says otherwise. Neither line may rank, count, or
 * recommend.
 */
export const SET_LEAD: readonly string[] = [
	'A few things people reach for.',
	'This is a starting point, not something this page worked out about you. It is in no particular order.',
];

/** The heading over a set, above the answer that opened it. */
export const SET_TITLE = 'You said:';

/**
 * The heading over the **set tail**, below the quiet divider.
 *
 * "Other things people reach for" echoes the set's own lead-in on purpose: the
 * tail is made of the same kind of thing as the set, offered in the same voice
 * and at the same size. What separates them is the sentence below, not a
 * smaller typeface or a hedge.
 */
export const TAIL_TITLE = 'Other things people reach for.';

/**
 * The label on the tail: it is not what the reader chose.
 *
 * This has to be said outright. The tail is the mechanism that keeps a set
 * screen the same shape whether one practice or four sit above it, and a list
 * arriving unlabelled under a set would be read as more of the same answer —
 * which would make the page claim a fit it did not work out.
 *
 * The second line says where they came from instead, so that "not what you
 * chose" does not leave the reader guessing what the page did. Neither line
 * may rank them, count them, or say they are related.
 */
export const TAIL_LEAD: readonly string[] = [
	'These are not from what you chose.',
	'They are on this page whatever you picked, so the page never says how much there was behind an answer.',
];

/** The heading and lead of `/me/not-sure/`, the door that skips the question. */
export const NOT_SURE_TITLE = 'Not sure is fine.';

export const NOT_SURE_LINES: readonly string[] = [
	'Not knowing what you want is not a problem to solve before you can be here.',
];

/** One way out of the flow: the words, and where they go. */
export interface Escape {
	words: string;
	route: string;
}

/**
 * The three escapes, on every screen in this flow.
 *
 * They are ordinary links at the same size as everything else. "I'm not sure"
 * is first because it is the one a reader wants while looking at a question
 * they cannot answer; "Nothing right now" is last, and it is a real page
 * rather than a way of saying goodbye.
 *
 * A screen renders the escape that points at itself as a plain line, so that
 * none of the three is ever a link back to where the reader already is.
 */
export const ESCAPES: readonly Escape[] = [
	{ words: "I'm not sure.", route: NOT_SURE_ROUTE },
	{ words: 'Show me everything.', route: CATALOG_ROUTE },
	{ words: 'Nothing right now.', route: NOTHING_ROUTE },
];
