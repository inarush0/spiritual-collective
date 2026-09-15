import { z } from 'zod';

/**
 * What the two **governed record kinds** share.
 *
 * There are two — the **practice record** and the **guide record** — and they
 * are governed at the same strength while carrying different fields
 * (`docs/spec/02-content-standard.md`). What is identical between them is the
 * governance itself: the three publication states, what a signature is, and
 * the rule that nothing ever auto-promotes. What is not identical is every
 * facet of a practice, none of which the guide carries.
 *
 * This module holds the first list and nothing from the second. A guide record
 * reaching into the practice record's module for its publication states would
 * be the beginning of it acquiring a `risk class` too: the shape a file
 * imports from is the shape it drifts toward. Neither record kind imports the
 * other; both import this.
 */

/** Prose that must actually say something. */
export const prose = z.string().trim().min(1);

export const PUBLICATION_STATES = ['in-review', 'approved', 'withdrawn'] as const;
export type Publication = (typeof PUBLICATION_STATES)[number];

/**
 * YAML parsers disagree about bare `yes` / `no`: 1.1 reads booleans, 1.2 reads
 * strings. A review record is written by hand, so accept both spellings and
 * normalise to the one the spec writes.
 */
export const attested = <T extends readonly [string, ...string[]]>(states: T) =>
	z.preprocess((value) => {
		if (value === true) return 'yes';
		if (value === false) return 'no';
		return value;
	}, z.enum(states));

/**
 * The chaplain's half of a **review record** — the half both record kinds
 * carry, because the chaplain reviewer is the sole approver of user-facing
 * content and there is nothing user-facing they do not hold the veto on
 * (`docs/spec/05-governance.md`).
 *
 * Role, date, and record version — **never an identity**. This repository is
 * public and content records live in it, so a reviewer's name here would be
 * published whether or not any page renders it.
 *
 * Every field is mandatory and nullable rather than optional: an unapproved
 * record carries an explicit `null`, which is presence, not absence.
 */
export const chaplainReview = {
	/** Commit SHA of this file at approval; the drift check re-hashes against it. */
	approved_version: prose.nullable(),
	chaplain_attested: attested(['yes', 'no']).nullable(),
	chaplain_attested_date: prose.nullable(),
	/** Pointer to where the signed reply is held, outside the repository. */
	reply_kept: prose.nullable(),
};

/** A record as far as promotion is concerned: its state, and who attested it. */
interface Promotable {
	publication: Publication;
	review_record: {
		approved_version: string | null;
		chaplain_attested: string | null;
	};
}

/** One schema issue, as the record kind's own `.check` will push it. */
export interface PromotionIssue {
	input: unknown;
	path: PropertyKey[];
	message: string;
}

/**
 * **Nothing ever auto-promotes.**
 *
 * `publication: approved` is the one-field edit that publishes a record
 * (`docs/spec/07-technical-constraints.md`), so it may not stand without the
 * chaplain's attestation and the version the approval was given against — an
 * approved record with an empty review record is unapproved content wearing a
 * signature.
 *
 * Shared by both record kinds rather than written twice, because the rule is
 * the governance model itself ([ADR 0002](../../docs/adr/0002-two-person-asymmetric-governance.md))
 * and a second copy of it is a place one kind could quietly come to publish on
 * weaker evidence than the other.
 */
export function promotionIssues({ publication, review_record: review }: Promotable): PromotionIssue[] {
	if (publication !== 'approved') return [];

	const issues: PromotionIssue[] = [];
	if (review.chaplain_attested !== 'yes') {
		issues.push({
			input: review.chaplain_attested,
			path: ['review_record', 'chaplain_attested'],
			message: "an approved record needs the chaplain reviewer's attestation",
		});
	}
	if (review.approved_version === null) {
		issues.push({
			input: review.approved_version,
			path: ['review_record', 'approved_version'],
			message: 'an approved record needs the version the approval was given against',
		});
	}
	return issues;
}
