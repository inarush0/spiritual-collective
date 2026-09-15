import { describe, expect, it } from 'vitest';
import { practiceRecordSchema } from '../src/catalog/practice-record.js';
import {
	GUIDE_PARTS,
	guideRecordSchema,
	missingGuideParts,
} from '../src/guide/guide-record.js';

/**
 * The **guide record**: its own governed kind, carrying the same governance a
 * practice carries and none of a practice's facets
 * (`docs/spec/02-content-standard.md`).
 *
 * The two halves of that sentence are what this file holds. The first is about
 * publication — an approved guide needs an attestation and a version, exactly
 * as a practice does. The second is about the shape, and it is asserted as a
 * comparison against the practice schema rather than as a list, because a
 * facet arriving here later would arrive as a field somebody copied across.
 */

function record(overrides: Record<string, unknown> = {}): Record<string, unknown> {
	return {
		name: 'Before you offer anything',
		publication: 'in-review',
		review_record: {
			approved_version: null,
			chaplain_attested: null,
			chaplain_attested_date: null,
			reply_kept: null,
		},
		...overrides,
	};
}

/** An approved guide, as the review record would actually be filled in. */
const attested = {
	publication: 'approved',
	review_record: {
		approved_version: 'a'.repeat(40),
		chaplain_attested: 'yes',
		chaplain_attested_date: '2026-01-01',
		reply_kept: 'held outside the repository',
	},
};

describe('the guide record schema', () => {
	it('accepts a complete record', () => {
		expect(guideRecordSchema.safeParse(record()).success).toBe(true);
	});

	it.each(['name', 'publication', 'review_record'])('requires %s', (field) => {
		const { [field]: _dropped, ...missing } = record();
		expect(guideRecordSchema.safeParse(missing).success).toBe(false);
	});

	it('refuses a blank name, so a present-but-empty field cannot pass for a written one', () => {
		expect(guideRecordSchema.safeParse(record({ name: '  ' })).success).toBe(false);
	});

	it('requires every half of the review record to be present, even when it is null', () => {
		expect(
			guideRecordSchema.safeParse(record({ review_record: { approved_version: null } })).success,
		).toBe(false);
	});

	it('reads a YAML 1.1 bare yes as an attestation', () => {
		const parsed = guideRecordSchema.parse(
			record({ ...attested, review_record: { ...attested.review_record, chaplain_attested: true } }),
		);
		expect(parsed.review_record.chaplain_attested).toBe('yes');
	});
});

describe('nothing auto-promotes, the guide included', () => {
	it('accepts an approved record with the chaplain attestation and the version', () => {
		expect(guideRecordSchema.safeParse(record(attested)).success).toBe(true);
	});

	it('refuses an approved record with no attestation', () => {
		const result = guideRecordSchema.safeParse(
			record({ ...attested, review_record: { ...attested.review_record, chaplain_attested: null } }),
		);
		expect(result.success).toBe(false);
	});

	it('refuses an approved record with no version behind the approval', () => {
		const result = guideRecordSchema.safeParse(
			record({ ...attested, review_record: { ...attested.review_record, approved_version: null } }),
		);
		expect(result.success).toBe(false);
	});

	it('lets an unapproved record carry an empty review record', () => {
		expect(guideRecordSchema.safeParse(record({ publication: 'in-review' })).success).toBe(true);
	});
});

describe('the guide record carries no practice facets', () => {
	it('names none of the practice record fields except the governed ones', () => {
		const governed = ['name', 'publication', 'review_record'];
		const facets = Object.keys(practiceRecordSchema.shape).filter(
			(field) => !governed.includes(field),
		);

		expect(Object.keys(guideRecordSchema.shape).sort()).toEqual([...governed].sort());
		for (const facet of facets) {
			expect(Object.keys(guideRecordSchema.shape), facet).not.toContain(facet);
		}
	});

	it('asks nobody for a clinician attestation, having no risk class to ask about', () => {
		const review = Object.keys(guideRecordSchema.shape.review_record.shape);
		expect(review).not.toContain('clinician_attested');
	});
});

describe('the four parts of the standing guide', () => {
	const body = GUIDE_PARTS.map((part) => `## ${part.heading}\n\nSomething.\n`).join('\n');

	it('is satisfied by a body holding all four', () => {
		expect(missingGuideParts(body)).toEqual([]);
	});

	it.each(GUIDE_PARTS)('notices when $name is gone', (part) => {
		const without = body.replace(`## ${part.heading}`, '');
		expect(missingGuideParts(without)).toEqual([part]);
	});

	it('says nothing at all is there for an empty body', () => {
		expect(missingGuideParts('')).toEqual(GUIDE_PARTS);
	});

	it('holds the two parts most easily lost in an edit', () => {
		const names = GUIDE_PARTS.map((part) => part.name);
		expect(names).toContain('the caregiver as themselves');
		expect(names).toContain('the no-suitability statement');
	});
});

describe('the schema refuses a facet rather than ignoring it', () => {
	it.each(['need_tags', 'risk_class', 'smallest_version', 'low_energy'])(
		'fails a %s written into the guide record',
		(facet) => {
			// Strict, so this is an `astro build` failure where the editor is
			// working rather than only a `npm run gates` line later.
			expect(guideRecordSchema.safeParse(record({ [facet]: 'anything' })).success).toBe(false);
		},
	);
});
