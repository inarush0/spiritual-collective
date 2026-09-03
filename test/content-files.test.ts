import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';
import { EDITORIAL_ORDER } from '../src/catalog/editorial-order.js';
import { practiceRecordSchema } from '../src/catalog/practice-record.js';

const PRACTICES_DIR = join(import.meta.dirname, '..', 'content', 'practices');

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

	it('carries both an approved and an unapproved record, so the filter is exercised', () => {
		const states = files.map(
			(file) => practiceRecordSchema.parse(frontmatter(file)).publication,
		);
		expect(states).toContain('approved');
		expect(states.some((state) => state !== 'approved')).toBe(true);
	});
});
