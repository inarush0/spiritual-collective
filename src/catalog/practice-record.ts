import { z } from 'zod';

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
 * Fields nullable below are the review record's: an unapproved record carries
 * an explicit `null`, which is presence, not absence. `.nullable()` without
 * `.optional()` keeps the key mandatory.
 */

/** Prose that must actually say something. */
const prose = z.string().trim().min(1);

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

export const PUBLICATION_STATES = ['in-review', 'approved', 'withdrawn'] as const;
export type Publication = (typeof PUBLICATION_STATES)[number];

/**
 * YAML parsers disagree about bare `yes` / `no`: 1.1 reads booleans, 1.2 reads
 * strings. The review record is written by hand, so accept both spellings and
 * normalise to the one the spec writes.
 */
const attested = <T extends readonly [string, ...string[]]>(states: T) =>
	z.preprocess((value) => {
		if (value === true) return 'yes';
		if (value === false) return 'no';
		return value;
	}, z.enum(states));

/**
 * Role, date, and record version — never an identity. This repository is
 * public and content records live in it, so a reviewer's name here would be
 * published whether or not any page renders it. See `docs/spec/05-governance.md`.
 */
const reviewRecordSchema = z.object({
	/** Commit SHA of this file at approval; the drift check re-hashes against it. */
	approved_version: prose.nullable(),
	chaplain_attested: attested(['yes', 'no']).nullable(),
	chaplain_attested_date: prose.nullable(),
	clinician_attested: attested(['yes', 'pending', 'not-required']),
	/** Pointer to where the signed reply is held, outside the repository. */
	reply_kept: prose.nullable(),
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
	// Nothing ever auto-promotes. `publication: approved` is the one-field edit
	// that publishes a record, so it may not stand without the attestation and
	// the version it was given against — an approved record with an empty
	// review record is unapproved content wearing a signature.
	const { publication, review_record: review } = ctx.value;
	if (publication !== 'approved') return;

	if (review.chaplain_attested !== 'yes') {
		ctx.issues.push({
			code: 'custom',
			input: review.chaplain_attested,
			path: ['review_record', 'chaplain_attested'],
			message: 'an approved record needs the chaplain reviewer\'s attestation',
		});
	}
	if (review.approved_version === null) {
		ctx.issues.push({
			code: 'custom',
			input: review.approved_version,
			path: ['review_record', 'approved_version'],
			message: 'an approved record needs the version the approval was given against',
		});
	}
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
