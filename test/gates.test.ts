import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..');

interface Run {
	status: number;
	output: string;
}

/** `npm run gates` exactly as CI runs it. */
function gates(): Run {
	try {
		const output = execFileSync('npm', ['run', 'gates', '--silent'], {
			cwd: ROOT,
			env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', SITE_BUILD: '' },
			encoding: 'utf8',
			stdio: 'pipe',
		});
		return { status: 0, output };
	} catch (error) {
		const failure = error as { status?: number; stdout?: string; stderr?: string };
		return {
			status: failure.status ?? 1,
			output: `${failure.stdout ?? ''}${failure.stderr ?? ''}`,
		};
	}
}

// Both fixtures below are deliberate violations placed in the real tree,
// because a gate that has never failed is a gate nobody knows the wiring of.
// Each is removed in `finally` and again in `afterAll`, so a failing assertion
// cannot leave a broken record or an overweight page behind.
const BROKEN_RECORD = join(ROOT, 'content', 'practices', 'words-from-your-own-tradition.md');
const FIXTURE_PAGES = join(ROOT, 'src', 'pages', 'gates-fixture');
const OVERWEIGHT_PAGE = join(FIXTURE_PAGES, 'overweight.astro');

/** Only ever cleaned up: paths this test actually created. */
const written = new Set<string>();

/**
 * Write a fixture, refusing if something is already there.
 *
 * `words-from-your-own-tradition` is a slot in the fixed editorial order, so
 * one day it will hold a real record with a chaplain's approval on it. Nothing
 * here may be able to delete that: the test fails instead, saying to pick an
 * unused slot.
 */
function writeFixture(path: string, contents: string): void {
	expect(
		existsSync(path),
		`${path} already exists — this test will not overwrite it. Pick an unused slot.`,
	).toBe(false);
	mkdirSync(dirname(path), { recursive: true });
	written.add(path);
	writeFileSync(path, contents);
}

function removeFixture(path: string): void {
	if (!written.delete(path)) return;
	rmSync(path, { force: true });
}

afterAll(() => {
	for (const path of [...written]) removeFixture(path);
	rmSync(FIXTURE_PAGES, { recursive: true, force: true });
});

describe('npm run gates', () => {
	it('passes on the repository as it stands', () => {
		const run = gates();

		expect(run.output).toContain('gates passed');
		expect(run.status).toBe(0);
	});

	it('fails on a record that violates the schema', () => {
		writeFixture(
			BROKEN_RECORD,
			[
				'---',
				'name: A record with a duration on it',
				'duration: 10 minutes',
				'publication: in-review',
				'---',
				'',
			].join('\n'),
		);
		try {
			const run = gates();

			expect(run.status).not.toBe(0);
			expect(run.output).toContain('words-from-your-own-tradition.md');
			expect(run.output).toContain('duration');
		} finally {
			removeFixture(BROKEN_RECORD);
		}
	});

	it('fails on a page over the weight budget', () => {
		writeFixture(OVERWEIGHT_PAGE, `<p>${'weight '.repeat(20_000)}</p>\n`);
		try {
			const run = gates();

			expect(run.status).not.toBe(0);
			expect(run.output).toContain('100 KB');
		} finally {
			removeFixture(OVERWEIGHT_PAGE);
		}
	});
});
