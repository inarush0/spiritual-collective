import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Release } from '../catalog/release.ts';
import { readBuiltOutput } from './built-output.ts';
import type { GateFailure } from './failure.ts';
import { checkFrontmatter } from './frontmatter-gate.ts';
import { checkNetwork } from './network-gate.ts';
import { readRecordFiles } from './record-files.ts';
import { checkWeight } from './weight-gate.ts';

/**
 * Both releases are gated, not just production.
 *
 * Beta carries production's data posture, and it is the build a chaplain
 * reviews on their own phone between shifts, so a third-party request or a
 * heavy page there is the same failure. The releases themselves are named in
 * `src/catalog/release.ts`; this list is only which of them a gate run builds.
 */
export const GATED_RELEASES: readonly Release[] = ['production', 'beta'];

/** Where progress goes while a run is building. Silent by default. */
export type Log = (line: string) => void;

/**
 * `npm run gates` — one command, run identically locally and in CI, blocking
 * on `main` (`docs/spec/07-technical-constraints.md`).
 *
 * Three of the six checks are here: the frontmatter schema, the network
 * assertion, and the weight budget. Prose, drift, and axe are a later ticket
 * and slot in beside these without changing the shape of this function.
 *
 * Returns every failure it found rather than throwing on the first, and prints
 * nothing: the exit code and the report are `scripts/gates.ts`.
 */
export function runGates(root: string, log: Log = () => {}): GateFailure[] {
	log('frontmatter schema…');
	const records = readRecordFiles(join(root, 'content', 'practices'), root);
	const recordFailures = checkFrontmatter(records);
	log(`  ${count(records.length, 'record')}`);

	// A record the schema rejects fails the build too, and a crashed build
	// reports the first bad field rather than all of them. Stopping here means
	// the answer is the record list, not a stack trace.
	if (recordFailures.length > 0) return recordFailures;

	return GATED_RELEASES.flatMap((release) => {
		log(`building ${release}…`);
		const dir = mkdtempSync(join(tmpdir(), `gates-${release}-`));
		try {
			build(root, release, dir);
			const output = readBuiltOutput(dir);
			log(`  ${count(output.pages.length, 'page')}`);
			return [...checkNetwork(output), ...checkWeight(output)].map((failure) => ({
				...failure,
				where: `${release} ${failure.where}`,
			}));
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});
}

function count(n: number, thing: string): string {
	return `${n} ${thing}${n === 1 ? '' : 's'}`;
}

/** The real build, into a throwaway directory so a gate run never touches `dist/`. */
function build(root: string, release: Release, outDir: string): void {
	execFileSync('node', ['node_modules/astro/bin/astro.mjs', 'build', '--outDir', outDir], {
		cwd: root,
		env: {
			...process.env,
			ASTRO_TELEMETRY_DISABLED: '1',
			// Production is the unset case; naming it here would be a second
			// spelling of the rule in src/catalog/release.ts.
			SITE_BUILD: release === 'production' ? '' : release,
		},
		stdio: 'pipe',
	});
}
