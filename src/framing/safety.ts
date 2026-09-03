/**
 * The limits line and the crisis pointer.
 *
 * Two jobs, deliberately split (`docs/spec/03-safety-and-inclusion.md`): one
 * sentence cannot both say *this is not care* and *here is what to do if you
 * are in trouble now*. They are rendered together by
 * `src/framing/SafetyNote.astro`, on the practice view only — never on a
 * suggestion set, where a disclaimer reads as a warning about the practices
 * themselves, and never in the footer, where it would frame the whole resource
 * as an emergency.
 *
 * The wording lives here rather than inside the component so that a test can
 * assert the exact strings on the pages that must carry them and, more
 * importantly, their absence from the pages that must not.
 *
 * Both are **tier-2 framing surfaces** (`docs/spec/05-governance.md`): the
 * chaplain reviewer approves this wording, with no per-record evidence. What is
 * written below is placeholder drafting for the build, like everything in
 * `content/` — no chaplain has read it.
 */

/** Once per practice view, near the stop control. Never on a set screen. */
export const LIMITS_LINE = 'This is something to try, not treatment. Stopping is always fine.';

/** One line of the pointer. `tel` is the number to dial, when it is one to dial. */
export interface CrisisLine {
	before: string;
	number?: string;
	tel?: string;
	after?: string;
}

/**
 * The crisis pointer.
 *
 * **The order is fixed and lives in this array**, not in the markup: the people
 * already with them first, then 988 for immediate danger, then 911. A
 * maintained list of hotlines by need is rejected — it ages badly, and it makes
 * a distressed reader triage themselves.
 *
 * 988 carries the link the spec names. 911 is plain text: everyone already
 * knows how to reach it, and the spec's sentence attaches the link affordance
 * to 988 only.
 */
export const CRISIS_LEAD = 'If you need help right now:';

export const CRISIS_LINES: readonly CrisisLine[] = [
	{
		before:
			'Start with the people already caring for you — your care team, your nurse, or your ' +
			'chaplain. The number on your own paperwork reaches them.',
	},
	{
		before: 'In the US, if you are in immediate danger, you can call ',
		number: '988',
		tel: '988',
		after: ', the Suicide and Crisis Lifeline. You can text the same number instead.',
	},
	{
		before: 'If someone is in immediate physical danger, call ',
		number: '911',
		after: '.',
	},
];
