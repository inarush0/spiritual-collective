import { join } from 'node:path';
import { formatReport } from '../src/gates/report.ts';
import { runGates } from '../src/gates/run.ts';

/**
 * `npm run gates`. Exits non-zero on any failure; nothing merges past it.
 *
 * This file is only the process: where the repository is, what gets printed,
 * and what the exit code is. The checks themselves are in `src/gates/`, so
 * they can be exercised without a build or a subprocess.
 */
const root = join(import.meta.dirname, '..');

try {
	const failures = runGates(root, (line) => console.log(line));
	console.log(formatReport(failures).join('\n'));
	process.exitCode = failures.length > 0 ? 1 : 0;
} catch (error) {
	// A build that will not run at all is a failure of the gate, not a crash to
	// be read out of a stack trace. Astro's own output says what broke.
	const failure = error as { stdout?: Buffer | string; stderr?: Buffer | string };
	console.log(String(failure.stdout ?? ''));
	console.log(String(failure.stderr ?? error));
	console.log('\ngates failed — the build did not complete');
	process.exitCode = 1;
}
