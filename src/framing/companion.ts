/**
 * Every word met only on a companion path: `/with/` and `/child/`.
 *
 * A **companion** uses the resource on behalf of another person rather than
 * for themselves. They are **never asked a question** — they land on a set
 * immediately — and they are never told that a practice suits the person they
 * are with (`docs/spec/01-journey-and-ia.md`).
 *
 * Two rules decide whether a sentence is here or in `./discovery.ts`:
 *
 * - **Wording that addresses the reader shifts with the path.** The reader of
 *   a companion screen is not the person who would be doing the practice, so a
 *   sentence written to "you" has to be rewritten or it is addressed to the
 *   wrong person.
 * - **Wording that describes the practice does not.** The canonical steps are
 *   identical on all three paths and stay visibly addressed to the person
 *   doing them (§1), and so does everything that says what the practice asks
 *   of that person — the belief line, the smallest version. A companion path
 *   frames a practice; it does not restate it.
 *
 * What is emphatically **not** here is a companion wording of the eight **need
 * tags**. They are first-person strings, offered verbatim with no label layer,
 * and companion set screens use the same eight under a companion-framed
 * lead-in ([#12](https://github.com/inarush0/spiritual-collective/issues/12)).
 *
 * **Tier-2 framing surfaces** (`docs/spec/05-governance.md`): placeholder
 * drafting until the chaplain reviewer has read it.
 */

/** The badge naming the path, on every screen of `/with/`. */
export const WITH_BADGE = 'You are reading this for someone you are with.';

/** The same, on `/child/`. It names a role, and claims nothing about a child. */
export const CHILD_BADGE = 'You are reading this for a younger child you are caring for.';

/**
 * The browser-tab titles of the two companion doors.
 *
 * `/with/` and `/child/set/` are the same set on two paths, and a reader
 * returning through history or a bookmark has only this to tell them apart.
 * They name the reader's situation rather than the screen's contents, which is
 * the one thing that differs between the two pages.
 */
export const WITH_TAB = 'For someone you are with';

export const CHILD_SET_TAB = 'For a younger child';

/**
 * The **no-suitability statement**, over the younger-child set.
 *
 * One of the two places the claim binds (`docs/spec/01-journey-and-ia.md`); the
 * other is the **standing guide** itself. It is said here because this is the
 * screen where a list of practices is put in front of someone caring for a
 * child, and a list arriving unqualified would be read as a selection made for
 * that child.
 *
 * The first line is the fact about the list — these are the same practices
 * everyone else sees. The second is the refusal, and it names where the
 * judgement actually sits rather than leaving the reader without one. Nothing
 * in the catalog is age-graded, and **no practice is ever marked suitable for
 * an age**.
 */
export const NO_SUITABILITY: readonly string[] = [
	'These are the same practices everyone else sees, with notes on adapting them.',
	'This resource has never met your child, and cannot say which one suits them. That judgement is yours, with the people caring for them.',
];

/**
 * The lead-in over a companion set.
 *
 * Its two lines are named separately because the screen a companion lands on
 * has no need tag to head it — nothing was asked, so there is no answer to say
 * back — and the first line is what that page is about. It is the heading
 * there and the lead-in everywhere else, one string either way.
 *
 * The spec's own wording for the first line: **"a few things you could
 * offer"** — offering rather than reaching, because the reader is not the
 * person who would be doing any of this.
 *
 * The second line is the direct user's, turned to the person they are with. It
 * is the sentence that stops a list arriving under a path choice from reading
 * as a selection made for that person, which on a companion path is the more
 * dangerous misreading of the two: a companion can act on it.
 */
export const COMPANION_OFFER = 'A few things you could offer.';

export const COMPANION_STARTING_POINT =
	'This is a starting point, not something this page worked out about them. It is in no particular order.';

export const COMPANION_SET_LEAD: readonly string[] = [COMPANION_OFFER, COMPANION_STARTING_POINT];

/**
 * The heading over a set a companion opened with an adjustment.
 *
 * "You chose" rather than "you said": the string below it is written in the
 * first person, and a companion did not say it. What the page knows is what
 * was clicked, and that is all this says.
 */
export const COMPANION_SET_TITLE = 'You chose:';

/**
 * The lead-in over the **adjustments** on a companion set screen.
 *
 * Adjustments are the companion's only way further in, because no question is
 * ever put to them (§1). They are offered as adjustments to what is on screen
 * and never as a second step — nothing here asks anything, and following none
 * of them is a complete way to use the page.
 *
 * The second line exists for the reason the first-person strings are kept as
 * they are: a companion meeting "I want to be still" on their screen needs to
 * know whose voice it is in, or the page reads as though it were speaking for
 * the person they are with.
 */
export const ADJUSTMENTS_LEAD: readonly string[] = [
	'If one of these is nearer to where they are, it opens a different few.',
	'They are written as the person doing them would say them, and they are the same words everyone else is offered.',
];

/** The heading over the adjustments. */
export const ADJUSTMENTS_TITLE = 'Something else to start from.';

/**
 * The **low-energy variant** link and lead, companion wording.
 *
 * The same offer as the direct user's, addressed to the reader who would be
 * making it rather than to the person lying down. "Your eyes closed" on a
 * companion screen is a sentence pointed at the wrong person.
 */
export const COMPANION_LOW_ENERGY_LINK = 'Things that work lying down, with their eyes closed.';

export const COMPANION_LOW_ENERGY_LEAD: readonly string[] = [
	'Everything here works lying down, with their eyes closed.',
	'They are whole practices, complete as they are.',
];

/** The line under "Not sure is fine.", turned to a companion. */
export const COMPANION_NOT_SURE_LINES: readonly string[] = [
	'Not knowing what would help is not a problem to solve before you can be here.',
];

/** The lead on `/<path>/everything/`, companion wording. */
export const COMPANION_CATALOG_LEAD =
	'All of it, in one list. Nothing here is ordered by how well it would suit them.';

/**
 * The action on a companion practice view.
 *
 * "Offer this" and never "I'll try this": the reader is not the person who
 * would be doing it, and the difference is the whole of what a companion path
 * is (`docs/spec/01-journey-and-ia.md`). It is an offer, which the other
 * person is free to decline — the wording carries no assumption that it is
 * taken up.
 */
export const COMPANION_ACTION = 'Offer this.';

/**
 * The quiet doorway back to the **standing guide**, on every companion screen.
 *
 * The guide is where how-to-offer and how-to-adapt live, and a companion who
 * arrived through `/with/` has never seen it. It says what is behind it rather
 * than naming a page, because "the guide" means nothing to someone who has not
 * met it.
 */
export const GUIDE_DOORWAY = 'How to offer one of these, and how to adapt it.';

/**
 * The way on from the **standing guide** into the catalog.
 *
 * The guide is met before anything is offered, so it is the one screen whose
 * job is finished when the reader leaves it. "When you are ready" is the whole
 * of the pacing this page does: nothing here counts as having read it, and
 * nobody is asked to confirm that they have.
 *
 * It echoes the set screen's own first line, because that is the screen it
 * opens, and a reader should recognise where they have arrived.
 */
export const GUIDE_ONWARD = 'When you are ready, a few things you could offer.';

/**
 * What `/child/` says when this build does not publish the guide record.
 *
 * The third arrival option is absent in that build, so nobody is sent here —
 * but a link from a chaplain, a bookmark, or a browser's history can still
 * land on this URL, and those are the readers the never-a-404 rule is for
 * (`docs/spec/01-journey-and-ia.md`). They meet a sentence and the way back to
 * arrival.
 *
 * **It does not offer the catalog.** Sending this reader on to `/child/set/`
 * would be the path continuing guide-less, which is the outcome the gate
 * exists to prevent; the lines say plainly that this is a choice rather than a
 * page that failed to load.
 */
export const GUIDE_UNAVAILABLE: { heading: string; lines: readonly string[] } = {
	heading: 'This part of the resource is not available right now.',
	lines: [
		'It holds how to offer one of these to a younger child, and how to adapt it.',
		'We would rather not hand you the practices without it.',
	],
};
