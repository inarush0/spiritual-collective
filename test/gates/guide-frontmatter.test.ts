import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { runGates } from '../../src/gates/run.ts';

const roots = new Set<string>();

function emptyRoot(): string {
	const root = mkdtempSync(join(tmpdir(), 'guide-frontmatter-gate-'));
	roots.add(root);
	mkdirSync(join(root, 'content', 'practices'), { recursive: true });
	return root;
}

function writeRecord(root: string, path: string, frontmatter: string): void {
	const file = join(root, path);
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, `---\n${frontmatter}\n---\n`);
}

const UNATTESTED_REVIEW = [
	'review_record:',
	'  approved_version: null',
	'  chaplain_attested: null',
	'  chaplain_attested_date: null',
	'  reply_kept: null',
].join('\n');

afterEach(() => {
	for (const root of roots) rmSync(root, { recursive: true, force: true });
	roots.clear();
});

describe('the guide record in npm run gates', () => {
	it('fails when content/guide.md is absent', () => {
		const failures = runGates(emptyRoot());

		expect(failures.length).toBeGreaterThan(0);
		expect(failures.every((failure) => failure.where === 'content/guide.md')).toBe(true);
	});

	it('fails when the guide record is missing a field', () => {
		const root = emptyRoot();
		writeRecord(root, 'content/guide.md', `publication: in-review\n${UNATTESTED_REVIEW}`);

		const failures = runGates(root);

		expect(failures).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ where: 'content/guide.md', message: expect.stringContaining('name') }),
			]),
		);
	});

	it('fails on an unknown field nested in the guide review record', () => {
		const root = emptyRoot();
		writeRecord(
			root,
			'content/guide.md',
			['name: Before you offer anything', 'publication: in-review', UNATTESTED_REVIEW, '  duration: 10 minutes'].join(
				'\n',
			),
		);

		const failures = runGates(root);

		expect(failures).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					where: 'content/guide.md',
					message: expect.stringContaining('review_record.duration'),
				}),
			]),
		);
	});

	it('reports practice-record and guide-record failures together', () => {
		const root = emptyRoot();
		writeRecord(root, 'content/practices/broken.md', 'name: Broken practice');
		writeRecord(root, 'content/guide.md', `publication: in-review\n${UNATTESTED_REVIEW}`);

		const failedFiles = new Set(runGates(root).map((failure) => failure.where));

		expect(failedFiles).toEqual(
			new Set(['content/practices/broken.md', 'content/guide.md']),
		);
	});

	it('fails an approved guide without the chaplain attestation and approved version', () => {
		const root = emptyRoot();
		writeRecord(
			root,
			'content/guide.md',
			`name: Before you offer anything\npublication: approved\n${UNATTESTED_REVIEW}`,
		);

		const report = runGates(root)
			.map((failure) => failure.message)
			.join('\n');

		expect(report).toContain('review_record.chaplain_attested');
		expect(report).toContain('review_record.approved_version');
	});
});
