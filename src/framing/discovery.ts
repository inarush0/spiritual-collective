/**
 * The discovery question and the wording around every direct-user set screen.
 *
 * Some of it is met on every path rather than this one: the **set tail**'s
 * heading and label, the escapes' words, "Not sure is fine." A companion's
 * wording for the rest is in `./companion.ts`, and `./audience.ts` is where a
 * screen asks which of the two it is showing. What stays here is what a
 * direct user reads.
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
 * chose" does not leave the reader guessing what the page did. It says the
 * list is always here, and stops there: explaining that the tail exists so a
 * screen cannot reveal how much sat behind an answer would raise, in the
 * reader's mind, the question the tail is here to keep off the page. Neither
 * line may rank them, count them, or say they are related.
 */
export const TAIL_LEAD: readonly string[] = [
	'These are not from what you chose.',
	'They are the next few in the list everything is kept in, and they are here on every screen like this one.',
];

/**
 * The link to the **low-energy variant**, carried by every set screen.
 *
 * It says what is on the other side of it rather than who it is for. "If you
 * have almost nothing to give" would ask the reader to place themselves before
 * they can follow it, and a reader who does not think of themselves that way
 * would pass over the one page that fits them; "lying down, with your eyes
 * closed" is a fact about the practices, which anyone can check against their
 * own afternoon. It also cannot be read as a smaller or lesser offer, which
 * "short version" and "easy mode" both would be.
 *
 * The link is never conditional (§1). It appears on a set screen whether or
 * not the chosen tag has anything behind it, because a link that showed up
 * only where the variant was stocked would tell the reader something about the
 * answer they picked.
 */
export const LOW_ENERGY_LINK = 'Things that work lying down, with your eyes closed.';

/**
 * The lead over the low-energy variant itself.
 *
 * The first line is the promise the page makes, and it is the only claim on
 * the screen: the `low energy` field on each record is what makes it true. The
 * second exists because a list offered to someone with almost nothing to give
 * will otherwise be read as an abridgement — these are whole practices, and
 * the **smallest version** on each one is where the least a person can do is
 * already said.
 *
 * That second line may not reach for the words it is refusing. Naming what
 * this page is not — a short version, an easy mode — puts the frame in the
 * reader's head whichever way the sentence points, on the one screen whose
 * whole job is not to read as a lesser offer. So it says what they are.
 */
export const LOW_ENERGY_LEAD: readonly string[] = [
	'Everything here works lying down, with your eyes closed.',
	'They are whole practices, complete as they are.',
];

/**
 * The label where the variant fell back past the chosen tag.
 *
 * Framed as the **set tail** is framed, and for the same reason: a list that
 * arrives under the answer someone chose is read as more of that answer unless
 * something says otherwise, and this page would then be claiming a fit it did
 * not work out. So the first line is the tail's own, verbatim.
 *
 * The second says where they came from instead and stops there, again like the
 * tail. Saying that nothing behind the reader's answer works this way would
 * answer, out loud, the question this whole arrangement exists to keep off the
 * page.
 */
export const LOW_ENERGY_OUTSIDE_LEAD: readonly string[] = [
	'These are not from what you chose.',
	'They are the ones that work this way, from the list everything is kept in.',
];

/**
 * What the variant says when the whole catalog holds nothing that works this
 * way.
 *
 * Reachable in principle rather than in practice: the fallback covers a tag
 * with none of its own, and only a build publishing no low-energy practice at
 * all reaches this. It is written anyway, because the alternative to a
 * sentence here is a page with a heading and nothing under it, and because the
 * link that leads here is never hidden — a link the build cannot stock is
 * still a link a reader will follow.
 *
 * Said without apology or reassurance. It is a fact about the list, and the
 * escapes below it are the way onward.
 */
export const LOW_ENERGY_EMPTY = 'There is nothing on the list that works this way right now.';

/**
 * The way back from the variant to the whole set the reader came from.
 *
 * Not "everything for this answer": it would sit two lines above "Show me
 * everything", which goes to the whole catalog, and the two would read as the
 * same size of move. This one is the smaller of them, and says so by naming
 * what the reader did rather than how much is behind it.
 */
export const LOW_ENERGY_BACK = 'Back to what you chose.';

/**
 * The variant's browser-tab title.
 *
 * The set and its variant are two prerendered pages under one answer, and a
 * reader returning through history or a bookmark has only this to tell them
 * apart. It repeats the link's own words rather than inventing a name for the
 * page, so the thing they followed is the thing they find in the list.
 */
export const LOW_ENERGY_TAB = (tag: string): string => `${tag} — lying down`;

/** The heading and lead of `/me/not-sure/`, the door that skips the question. */
export const NOT_SURE_TITLE = 'Not sure is fine.';

export const NOT_SURE_LINES: readonly string[] = [
	'Not knowing what you want is not a problem to solve before you can be here.',
];

/**
 * The heading and lead of `/*​/everything/`, the other door that skips the
 * question.
 *
 * The lead says the one thing a whole-catalog screen has to say for itself:
 * the order it is in is not an order of fit. The catalog is in the fixed
 * editorial order on every screen that lists it, and a reader meeting all of
 * it at once is the most likely to read the top of the list as the best of it.
 */
export const CATALOG_TITLE = 'Everything';

export const CATALOG_LEAD = 'All of it, in one list. Nothing here is ordered by how well it would suit you.';
