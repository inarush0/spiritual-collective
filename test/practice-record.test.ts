import { describe, expect, it } from 'vitest';
import { NEED_TAGS, practiceRecordSchema } from '../src/catalog/practice-record.js';

/** A complete record. Every test below starts here and takes something away. */
const complete = () => ({
	name: 'Rest, without a task',
	invitation: "You don't have to do anything with this time.",
	what_this_involves: [
		'Put the phone down somewhere you can still reach it.',
		'Let your eyes close, or let them rest on one thing.',
		'Stay there. Nothing has to happen.',
	],
	ways_to_change_it: 'Eyes open is fine. Lying down is fine.',
	stop_guidance: "Stop whenever you want. You don't need a reason.",
	smallest_version: 'One breath where nothing is asked of you.',
	belief_requirement: 'none',
	risk_class: 'low',
	provenance: {
		kind: 'site editorial',
		origin_line: 'Versions of this are practised in many traditions and by people with none.',
	},
	pathway_tags: ['contemplative'],
	need_tags: ['I want as little as possible asked of me', 'I want to be still'],
	low_energy: true,
	companion_note: 'Sit where they can see you without turning.',
	companion_cautions: "Don't fill the silence.",
	child_keep: "Being near someone who isn't asking them for anything.",
	child_change: 'Make it much shorter.',
	publication: 'in-review',
	review_record: {
		approved_version: null,
		chaplain_attested: null,
		chaplain_attested_date: null,
		clinician_attested: 'not-required',
		reply_kept: null,
	},
});

describe('the practice record schema', () => {
	it('accepts a complete record', () => {
		expect(practiceRecordSchema.safeParse(complete()).success).toBe(true);
	});

	describe('every field is required', () => {
		const fields = Object.keys(complete());

		it.each(fields)('rejects a record missing %s', (field) => {
			const record = complete() as Record<string, unknown>;
			delete record[field];
			expect(practiceRecordSchema.safeParse(record).success).toBe(false);
		});

		const reviewFields = Object.keys(complete().review_record);

		it.each(reviewFields)('rejects a record missing review_record.%s', (field) => {
			const record = complete();
			delete (record.review_record as Record<string, unknown>)[field];
			expect(practiceRecordSchema.safeParse(record).success).toBe(false);
		});
	});

	describe('no field may be empty', () => {
		it('rejects an empty prose field', () => {
			expect(
				practiceRecordSchema.safeParse({ ...complete(), stop_guidance: '   ' }).success,
			).toBe(false);
		});

		it('rejects an empty step list', () => {
			expect(
				practiceRecordSchema.safeParse({ ...complete(), what_this_involves: [] }).success,
			).toBe(false);
		});

		it('rejects an empty need tag list', () => {
			expect(practiceRecordSchema.safeParse({ ...complete(), need_tags: [] }).success).toBe(
				false,
			);
		});

		it('rejects an empty origin line', () => {
			const record = complete();
			record.provenance.origin_line = '';
			expect(practiceRecordSchema.safeParse(record).success).toBe(false);
		});
	});

	describe('constrained vocabularies', () => {
		it('caps what_this_involves at five steps', () => {
			const record = complete();
			record.what_this_involves = ['a', 'b', 'c', 'd', 'e'];
			expect(practiceRecordSchema.safeParse(record).success).toBe(true);

			record.what_this_involves = ['a', 'b', 'c', 'd', 'e', 'f'];
			expect(practiceRecordSchema.safeParse(record).success).toBe(false);
		});

		it.each(NEED_TAGS)('accepts the need tag %s verbatim', (tag) => {
			expect(practiceRecordSchema.safeParse({ ...complete(), need_tags: [tag] }).success).toBe(
				true,
			);
		});

		it('offers exactly the eight need tags', () => {
			expect(NEED_TAGS).toHaveLength(8);
		});

		it('rejects a need tag outside the eight', () => {
			expect(
				practiceRecordSchema.safeParse({ ...complete(), need_tags: ['I want to feel calm'] })
					.success,
			).toBe(false);
		});

		it.each(['none', 'you supply it', 'named tradition'])(
			'accepts belief requirement %s',
			(value) => {
				expect(
					practiceRecordSchema.safeParse({ ...complete(), belief_requirement: value })
						.success,
				).toBe(true);
			},
		);

		it.each(['low', 'clinical', 'excluded'])('accepts risk class %s', (value) => {
			expect(practiceRecordSchema.safeParse({ ...complete(), risk_class: value }).success).toBe(
				true,
			);
		});

		// `approved` additionally needs an approval behind it; see "the review
		// record" below.
		it.each(['in-review', 'withdrawn'])('accepts publication %s', (value) => {
			expect(practiceRecordSchema.safeParse({ ...complete(), publication: value }).success).toBe(
				true,
			);
		});

		it('rejects a publication state outside the three', () => {
			expect(
				practiceRecordSchema.safeParse({ ...complete(), publication: 'published' }).success,
			).toBe(false);
		});

		it.each(['tradition-owned', 'clinical', 'site editorial'])(
			'accepts provenance kind %s',
			(kind) => {
				const record = complete();
				record.provenance.kind = kind;
				expect(practiceRecordSchema.safeParse(record).success).toBe(true);
			},
		);

		it('requires low_energy to be a boolean, not prose', () => {
			expect(
				practiceRecordSchema.safeParse({ ...complete(), low_energy: 'sometimes' }).success,
			).toBe(false);
		});
	});

	describe('the review record', () => {
		it('reads YAML booleans as attestations', () => {
			const parsed = practiceRecordSchema.parse({
				...complete(),
				review_record: {
					approved_version: '0f2a91c',
					// YAML 1.1 reads a bare `yes` as this.
					chaplain_attested: true,
					chaplain_attested_date: '2026-08-14',
					clinician_attested: 'not-required',
					reply_kept: 'editor mailbox, 2026-08-14',
				},
			});
			expect(parsed.review_record.chaplain_attested).toBe('yes');
		});

		it('accepts an explicit null attestation on an unapproved record', () => {
			const parsed = practiceRecordSchema.parse(complete());
			expect(parsed.review_record.chaplain_attested).toBeNull();
		});

		it('refuses an approved record with no chaplain attestation behind it', () => {
			const record = complete();
			record.publication = 'approved';
			expect(practiceRecordSchema.safeParse(record).success).toBe(false);
		});

		it('refuses an approved record with no version the approval was given against', () => {
			const record = {
				...complete(),
				publication: 'approved',
				review_record: {
					approved_version: null,
					chaplain_attested: 'yes',
					chaplain_attested_date: '2026-01-01',
					clinician_attested: 'not-required',
					reply_kept: 'editor mailbox',
				},
			};
			expect(practiceRecordSchema.safeParse(record).success).toBe(false);
		});

		it('refuses to approve a record still awaiting a safety consult', () => {
			const record = {
				...complete(),
				publication: 'approved',
				review_record: {
					approved_version: '0f2a91c',
					chaplain_attested: 'yes',
					chaplain_attested_date: '2026-01-01',
					clinician_attested: 'pending',
					reply_kept: 'editor mailbox',
				},
			};
			expect(practiceRecordSchema.safeParse(record).success).toBe(false);
		});

		it('accepts an approved record with a complete approval behind it', () => {
			const record = {
				...complete(),
				publication: 'approved',
				review_record: {
					approved_version: '0f2a91c',
					chaplain_attested: 'yes',
					chaplain_attested_date: '2026-01-01',
					clinician_attested: 'not-required',
					reply_kept: 'editor mailbox',
				},
			};
			expect(practiceRecordSchema.safeParse(record).success).toBe(true);
		});

		it('rejects an unknown clinician attestation state', () => {
			const record = complete();
			record.review_record.clinician_attested = 'waived';
			expect(practiceRecordSchema.safeParse(record).success).toBe(false);
		});
	});
});
