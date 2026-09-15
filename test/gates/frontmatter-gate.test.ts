import { describe, expect, it } from 'vitest';
import { checkFrontmatter } from '../../src/gates/frontmatter-gate.ts';

/** A record that passes every rule, to be broken one field at a time. */
function record(overrides: Record<string, unknown> = {}): Record<string, unknown> {
	return {
		name: 'Rest, without a task',
		invitation: 'Put it down. Nothing has to happen next.',
		what_this_involves: ['Sit or lie however you are.', 'Let the room be as it is.'],
		ways_to_change_it: 'Eyes open or closed. In a chair or in the bed.',
		stop_guidance: 'Stop whenever you want.',
		smallest_version: 'One breath, without doing anything about it.',
		belief_requirement: 'none',
		risk_class: 'low',
		provenance: {
			kind: 'site editorial',
			origin_line: 'Rest is not owned by anyone.',
		},
		pathway_tags: ['contemplative'],
		need_tags: ['I want to be still'],
		low_energy: true,
		companion_note: 'Be nearby without asking anything.',
		companion_cautions: 'Do not fill the quiet.',
		child_keep: 'Being allowed to stop.',
		child_change: 'Say it in fewer words.',
		publication: 'in-review',
		review_record: {
			approved_version: null,
			chaplain_attested: null,
			chaplain_attested_date: null,
			clinician_attested: 'not-required',
			reply_kept: null,
		},
		...overrides,
	};
}

/** The other governed kind: everything a guide record carries, and no facet. */
function guide(overrides: Record<string, unknown> = {}): Record<string, unknown> {
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

const guideAt = (frontmatter: Record<string, unknown>) => [
	{ path: 'content/guide.md', kind: 'guide' as const, frontmatter },
];

const at = (frontmatter: Record<string, unknown>) => [
	{ path: 'content/practices/rest-without-a-task.md', kind: 'practice' as const, frontmatter },
];

describe('the frontmatter schema gate', () => {
	it('passes a complete record', () => {
		expect(checkFrontmatter(at(record()))).toEqual([]);
	});

	it('names the file and the field when a field is missing', () => {
		const { stop_guidance: _dropped, ...missing } = record();
		const failures = checkFrontmatter(at(missing));

		expect(failures).toHaveLength(1);
		expect(failures[0]!.where).toBe('content/practices/rest-without-a-task.md');
		expect(failures[0]!.message).toContain('stop_guidance');
	});

	it('fails a blank field, so a present-but-empty field cannot pass for a written one', () => {
		const failures = checkFrontmatter(at(record({ child_keep: '   ' })));

		expect(failures).toHaveLength(1);
		expect(failures[0]!.message).toContain('child_keep');
	});

	it('fails a sixth step', () => {
		const six = ['One.', 'Two.', 'Three.', 'Four.', 'Five.', 'Six.'];
		const failures = checkFrontmatter(at(record({ what_this_involves: six })));

		expect(failures).toHaveLength(1);
		expect(failures[0]!.message).toContain('what_this_involves');
	});

	it('fails an unpopulated provenance or risk class', () => {
		expect(checkFrontmatter(at(record({ risk_class: null })))).toHaveLength(1);
		expect(
			checkFrontmatter(at(record({ provenance: { kind: 'site editorial', origin_line: '' } }))),
		).toHaveLength(1);
	});

	it('fails a duration field, and says which field durations belong in', () => {
		const failures = checkFrontmatter(at(record({ duration: '10 minutes' })));

		expect(failures).toHaveLength(1);
		expect(failures[0]!.message).toContain('duration');
		expect(failures[0]!.message).toContain('smallest_version');
	});

	it('fails a duration field nested inside another one', () => {
		// Zod strips what it does not know at every level, so a field hidden one
		// deeper parses clean and disappears.
		const provenance = { kind: 'site editorial', origin_line: 'Nobody owns rest.', duration: '10m' };
		const failures = checkFrontmatter(at(record({ provenance })));

		expect(failures).toHaveLength(1);
		expect(failures[0]!.message).toContain('provenance.duration');
	});

	it('checks the guide record against the guide record, not against a practice', () => {
		// Every field a practice requires and the guide does not — which is
		// almost all of them — would otherwise be reported as missing here.
		expect(checkFrontmatter(guideAt(guide()))).toEqual([]);
	});

	it('fails a practice facet written into the guide record', () => {
		// The point of the check: Zod strips these, so a guide record carrying
		// need tags would parse clean and be one edit from a suggestion set.
		// Twice over: the schema is strict, so the facet fails the build where
		// an editor works, and the gate reads the written keys and says so too.
		for (const facet of [{ need_tags: ['I want to be still'] }, { risk_class: 'low' }]) {
			const field = Object.keys(facet)[0]!;
			const failures = checkFrontmatter(guideAt(guide(facet)));

			expect(failures.length, field).toBeGreaterThan(0);
			for (const failure of failures) expect(failure.message, field).toContain(field);
			expect(failures.map((failure) => failure.message).join(' ')).toContain('the guide record');
		}
	});

	it('fails a smallest version written into the guide record', () => {
		const failures = checkFrontmatter(guideAt(guide({ smallest_version: 'One sentence of it.' })));

		expect(failures.length).toBeGreaterThan(0);
		for (const failure of failures) expect(failure.message).toContain('smallest_version');
	});

	it('fails an approved guide record with nothing attesting it', () => {
		const failures = checkFrontmatter(guideAt(guide({ publication: 'approved' })));

		expect(failures.map((failure) => failure.message).join(' ')).toContain('chaplain_attested');
	});

	it('reports every failing record, not just the first', () => {
		const broken = { path: 'content/practices/a.md', kind: 'practice' as const, frontmatter: {} };
		expect(checkFrontmatter([broken, { ...broken, path: 'content/practices/b.md' }]).map((f) => f.where))
			.toContain('content/practices/b.md');
	});
});
