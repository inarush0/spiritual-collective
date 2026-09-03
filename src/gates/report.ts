import type { GateFailure } from './failure.ts';

/**
 * The failures as lines to print, grouped by the check that found them.
 *
 * Every failure is shown. A gate run is something someone does before they push
 * — often at the end of a session — and a report that stops early turns one fix
 * into several runs.
 */
export function formatReport(failures: readonly GateFailure[]): string[] {
	if (failures.length === 0) return ['gates passed'];

	const lines: string[] = [];
	for (const gate of [...new Set(failures.map((failure) => failure.gate))]) {
		lines.push('', `${gate}:`);
		for (const failure of failures.filter((failure) => failure.gate === gate)) {
			lines.push(`  ${failure.where}`, `    ${failure.message}`);
		}
	}
	lines.push('', `gates failed — ${failures.length} ${failures.length === 1 ? 'problem' : 'problems'}`);
	return lines;
}
