/**
 * What every gate returns: a list of these, empty when the gate passes.
 *
 * A gate never throws on a violation and never exits — it reports. `npm run
 * gates` runs the checks it can and prints every failure it found, because a
 * command that stops at the first bad record makes fixing twelve of them
 * twelve runs long. See `docs/spec/07-technical-constraints.md`.
 */
/**
 * The checks, named as the report headings name them.
 *
 * A closed set rather than a free string: the report groups failures by this
 * value, so a typo would quietly invent a heading and split one check's
 * failures across two.
 */
export type Gate = 'frontmatter schema' | 'third-party requests' | 'weight budget';

export interface GateFailure {
	gate: Gate;
	/** The file, route, or record the failure is in. */
	where: string;
	/** What is wrong, in words that say what to change. */
	message: string;
}
