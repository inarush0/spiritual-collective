import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';
import { EDITORIAL_ORDER } from '../src/catalog/editorial-order.js';
import { practiceRecordSchema } from '../src/catalog/practice-record.js';
import { guideRecordSchema, missingGuideParts } from '../src/guide/guide-record.js';

const CONTENT_DIR = join(import.meta.dirname, '..', 'content');
const PRACTICES_DIR = join(CONTENT_DIR, 'practices');
const GUIDE_FILE = join(CONTENT_DIR, 'guide.md');

const files = readdirSync(PRACTICES_DIR).filter((name) => name.endsWith('.md'));

function frontmatter(file: string): unknown {
	const source = readFileSync(join(PRACTICES_DIR, file), 'utf8');
	const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
	if (!match) throw new Error(`${file} has no frontmatter`);
	return yaml.load(match[1]!);
}

function body(file: string): string {
	const source = readFileSync(join(PRACTICES_DIR, file), 'utf8');
	return source.split(/^---$/m).slice(2).join('---');
}

describe('the practice records on disk', () => {
	it('has enough records to exercise ordering', () => {
		expect(files.length).toBeGreaterThanOrEqual(3);
	});

	it.each(files)('%s validates against the schema', (file) => {
		const result = practiceRecordSchema.safeParse(frontmatter(file));
		expect(result.error?.issues ?? []).toEqual([]);
		expect(result.success).toBe(true);
	});

	it.each(files)('%s is named for a slot in the fixed editorial order', (file) => {
		expect(EDITORIAL_ORDER).toContain(file.replace(/\.md$/, ''));
	});

	it.each(files)('%s is marked as an example, not for publication', (file) => {
		expect(body(file)).toMatch(/Example, not for publication/i);
	});

	it('does not hold the guide record, which is its own kind and its own collection', () => {
		expect(files).not.toContain('guide.md');
		expect(EDITORIAL_ORDER).not.toContain('guide');
	});

	it('carries both an approved and an unapproved record, so the filter is exercised', () => {
		const states = files.map(
			(file) => practiceRecordSchema.parse(frontmatter(file)).publication,
		);
		expect(states).toContain('approved');
		expect(states.some((state) => state !== 'approved')).toBe(true);
	});
});

describe('the guide record on disk', () => {
	const source = readFileSync(GUIDE_FILE, 'utf8');
	const front = yaml.load(/^---\r?\n([\s\S]*?)\r?\n---/.exec(source)![1]!);
	const prose = source.split(/^---$/m).slice(2).join('---');

	it('validates against the guide record schema', () => {
		const result = guideRecordSchema.safeParse(front);
		expect(result.error?.issues ?? []).toEqual([]);
		expect(result.success).toBe(true);
	});

	it('holds all four parts', () => {
		expect(missingGuideParts(prose)).toEqual([]);
	});

	it('is marked as an example, not for publication', () => {
		expect(prose).toMatch(/Example, not for publication/i);
	});

	it('says the catalog is also for the caregiver as themselves', () => {
		expect(prose).toMatch(/also for you/i);
	});

	it('states the no-suitability claim, in the first of the two places it binds', () => {
		expect(prose).toMatch(/never met your child/i);
		expect(prose).toMatch(/cannot say which practice suits which age/i);
	});

	it('is published, so both builds offer the younger-child path', () => {
		// The placeholder convention of `content/README.md`: these are field
		// shapes rather than approvals, and the gate has to be exercised by
		// something. The closed gate is exercised in `test/guide.test.ts`.
		expect(guideRecordSchema.parse(front).publication).toBe('approved');
	});
});
