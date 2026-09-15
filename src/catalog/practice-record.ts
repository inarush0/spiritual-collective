import { z } from 'zod';
import {
	attested,
	chaplainReview,
	promotionIssues,
	prose,
	PUBLICATION_STATES,
	type Publication,
} from '../records/governed.js';

/**
 * The practice record schema — the single enforcement point for field
 * completeness, per `docs/spec/07-technical-constraints.md`.
 *
 * The field set is `docs/spec/02-content-standard.md`. Two rules shape every
 * definition below:
 *
 * - **Every field is required.** Where a practice has nothing distinct to say,
 *   the field says so in plain words. A required field forces that sentence to
 *   be written and reviewed rather than defaulted into existence — an absence
 *   from a companion path makes a claim by omission.
 * - **Nothing may be empty.** Prose is trimmed and must have content, so a
 *   present-but-blank field cannot pass for a written one.
 *
 * What this record kind shares with the **guide record** — the publication
 * states, the chaplain's half of the review record, and the rule that nothing
 * auto-promotes — is in `src/records/governed.ts`. Everything below is a facet
 * of a practice, which is precisely what the guide record does not carry.
 */

export { PUBLICATION_STATES, type Publication };

/**
 * The eight need tags, verbatim.
 *
 * They are the discovery question's answer options with no separate label
 * layer, so these strings are user-facing wording under chaplain approval.
 * They name something a person *wants*, never a state they are *in*.
 */
export const NEED_TAGS = [
	'I want as little as possible asked of me',
	'I want some company',
	'I want room for anger, grief, or doubt',
	'I want to remember someone',
	'I want to make or do something',
	'I want to be still',
	'I want my faith or my tradition',
	'I want to do something for someone',
] as const;

export type NeedTag = (typeof NEED_TAGS)[number];

/**
 * The chaplain's half, plus the one attestation only a practice can need: the
 * **safety consult**, asked once about a practice carrying clinical risk. The
 * guide record has no `risk class` and so has nothing to ask a clinician
 * about, which is why this field sits here rather than in the shared shape.
 */
const reviewRecordSchema = z.object({
	...chaplainReview,
	clinician_attested: attested(['yes', 'pending', 'not-required']),
});

export const practiceRecordSchema = z.object({
	name: prose,
	invitation: prose,
	/** The canonical sequence, identical on all three audience paths. */
	what_this_involves: z.array(prose).min(1).max(5),
	ways_to_change_it: prose,
	stop_guidance: prose,
	/** The only field that may carry anything resembling a duration. */
	smallest_version: prose,
	belief_requirement: z.enum(['none', 'you supply it', 'named tradition']),
	risk_class: z.enum(['low', 'clinical', 'excluded']),
	provenance: z.object({
		kind: z.enum(['tradition-owned', 'clinical', 'site editorial']),
		/** The reader-facing origin line. Never names the seed material's author. */
		origin_line: prose,
	}),
	/** Record metadata; not user-facing in this release. */
	pathway_tags: z.array(prose).min(1),
	need_tags: z.array(z.enum(NEED_TAGS)).min(1),
	/** Asked once per practice, not per step. Backs `/for/<tag>/low/`. */
	low_energy: z.boolean(),

	// The adaptation fields. All required; each may only subtract from or
	// soften what `what_this_involves` already asks. The subtract-only rule
	// itself has two human owners — no machine can check it.
	companion_note: prose,
	companion_cautions: prose,
	child_keep: prose,
	child_change: prose,

	publication: z.enum(PUBLICATION_STATES),
	review_record: reviewRecordSchema,
}).check((ctx) => {
	// Nothing ever auto-promotes: an approved record carries the chaplain's
	// attestation and the version it was given against, or it is not approved.
	// The rule is both record kinds', so it is asked rather than restated.
	for (const issue of promotionIssues(ctx.value)) {
		ctx.issues.push({ code: 'custom', ...issue });
	}

	const { publication, review_record: review } = ctx.value;
	if (publication !== 'approved') return;

	if (review.clinician_attested === 'pending') {
		ctx.issues.push({
			code: 'custom',
			input: review.clinician_attested,
			path: ['review_record', 'clinician_attested'],
			message: 'a record awaiting a safety consult is a held record, not an approved one',
		});
	}
});

export type PracticeRecord = z.infer<typeof practiceRecordSchema>;
