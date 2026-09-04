/**
 * The about page's words, and the one link that reaches it.
 *
 * The page is **path-neutral** — the same facts for every reader — and it is
 * the only place several of them are said at all: the fuller limits statement,
 * the stance on belief, how review works, and what emailing shares
 * (`docs/spec/01-journey-and-ia.md`).
 *
 * A **tier-2 framing surface** (`docs/spec/05-governance.md`), and the riskiest
 * kind: these sentences are claims about the resource itself rather than
 * instructions inside a practice. What is written below is placeholder drafting
 * for the build, like everything in `content/` — no chaplain has read it.
 *
 * The copy is data rather than markup so that the section order, the sentence
 * counts the spec fixes, and the words themselves are assertable, and so that
 * the page template holds no sentence of its own.
 */

/** The one page. Named here because the chrome link and the page share it. */
export const ABOUT_ROUTE = '/about/';

/**
 * The only persistent chrome, on every screen (`docs/spec/01`).
 *
 * A question rather than a label, because it is the question a reader arriving
 * from a link someone sent them is actually asking. In particular the crisis
 * pointer is *not* down here: on every screen it would frame the whole resource
 * as an emergency.
 */
export const CHROME_LINK = 'What is this?';

/**
 * The accountability channel (`docs/spec/05-governance.md`).
 *
 * **A placeholder.** A real mailbox with working owner and backup access is a
 * production prerequisite, and it does not exist yet; an address that merely
 * looked real would take reports into a void, which is the harm the channel
 * exists to prevent. An address that cannot receive mail is the honest
 * stand-in until the mailbox is provisioned.
 */
export const REPORT_ADDRESS = 'report@example.invalid';

/** The sections, in the order §1 fixes them. */
export type SectionId = 'purpose' | 'limits' | 'review' | 'belief' | 'data' | 'contact';

/**
 * A sentence with the accountability address inside it.
 *
 * The same shape as `CrisisLine` in `./safety.ts` and for the same reason: the
 * address is a link where it is spoken, and a template that had to find it in a
 * string would be a second place that knows what the sentence says.
 */
export interface AddressSentence {
	before: string;
	address: string;
	after: string;
}

/** One sentence of a paragraph, plain or carrying the address. */
export type Sentence = string | AddressSentence;

/**
 * One section: a short paragraph, not a heading with prose beneath it.
 *
 * Sentences are separate entries because the spec counts them — the purpose
 * section is two, the data section is four — and because a paragraph written as
 * one long literal is a paragraph nobody notices growing.
 */
export interface AboutSection {
	id: SectionId;
	sentences: readonly Sentence[];
}

/** A sentence as words, with the address read as the words it is. */
export function sentenceText(sentence: Sentence): string {
	return typeof sentence === 'string'
		? sentence
		: `${sentence.before}${sentence.address}${sentence.after}`;
}

/**
 * The whole page, in order. The array *is* the order; the template renders it
 * and chooses nothing.
 */
export const ABOUT_SECTIONS: readonly AboutSection[] = [
	{
		id: 'purpose',
		sentences: [
			'This is a small collection of quiet things a person can try in a few minutes, ' +
				'somewhere that is hard.',
			'It is for anyone who wants one: someone who is ill, a parent, a brother or sister, ' +
				'a friend, or someone sitting alongside them.',
		],
	},
	{
		id: 'limits',
		sentences: [
			'This is not assessment, not treatment, not counselling, and not a crisis service.',
			'It cannot tell whether something is wrong, and it knows nothing about you or about ' +
				'the person you are caring for.',
			'If you need help now, this page is not it: the people already caring for you are.',
		],
	},
	{
		id: 'review',
		sentences: [
			'This was made independently, and it is free to use.',
			'It is not affiliated with any hospital, religious body, or company, and nothing here ' +
				'is being sold.',
			'Nothing is published here until a chaplain has read it: a hospital chaplain working ' +
				'in pediatric palliative care, named by role because a name is not what makes ' +
				'the reading worth anything.',
			'This has not been tried with patients or families.',
			'You will not find a date on anything here, because a date would say nothing about ' +
				'whether a thing was read: nothing is published unreviewed, and changing anything ' +
				'that could change what a person does returns it to review.',
		],
	},
	{
		id: 'belief',
		sentences: [
			'This does not ask you to believe anything.',
			'It does not belong to a tradition, and it will not try to move you toward one or ' +
				'away from one.',
			'If you have your own words or beliefs, they belong here; if you have none, nothing ' +
				'here is missing.',
		],
	},
	{
		id: 'data',
		sentences: [
			'There is no account here and nothing to sign in to.',
			'There are no analytics, no trackers, and no cookies.',
			'What you read and what you choose stay on your own screen: nothing is sent anywhere ' +
				'and nothing about you is stored.',
			'Choosing to email the address below is the one exception, and it shares your email ' +
				'address and your message with the mail providers that carry it.',
		],
	},
	{
		id: 'contact',
		sentences: [
			{
				before: 'If something here is wrong, unsafe, or hurt someone, you can say so: ',
				address: REPORT_ADDRESS,
				after: '.',
			},
			'Please leave out names, diagnoses, institutions, and other private details — none of ' +
				'that is needed to look into it.',
			'This address is not monitored urgently and it is not a way to reach help now.',
		],
	},
];
