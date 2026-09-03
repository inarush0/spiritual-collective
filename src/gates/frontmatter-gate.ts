import { practiceRecordSchema } from '../catalog/practice-record.ts';
import type { Gate, GateFailure } from './failure.ts';

/** A record file as read off disk, with its frontmatter parsed but unvalidated. */
export interface RecordFile {
	/** Repo-relative, so a failure line can be pasted into an editor. */
	path: string;
	frontmatter: unknown;
}

const GATE: Gate = 'frontmatter schema';

/**
 * Check 1 of `npm run gates`: field completeness, `provenance` and `risk class`
 * populated, steps ≤ 5, and no duration field other than `smallest version`.
 *
 * The schema in `src/catalog/practice-record.ts` is the single enforcement
 * point and carries the first three rules already, so this gate parses against
 * it rather than restating them — the build and the gate cannot disagree about
 * what a complete record is. What it adds is the rule the schema cannot express
 * on its own: Zod strips keys it does not know, so a `duration:` field added to
 * a record would parse cleanly and vanish. The gate reads the keys that were
 * actually written.
 */
export function checkFrontmatter(records: readonly RecordFile[]): GateFailure[] {
	return records.flatMap((record) => [
		...schemaFailures(record),
		...unknownFieldFailures(record),
	]);
}

function schemaFailures({ path, frontmatter }: RecordFile): GateFailure[] {
	const result = practiceRecordSchema.safeParse(frontmatter);
	if (result.success) return [];

	return result.error.issues.map((issue) => ({
		gate: GATE,
		where: path,
		message: `${fieldName(issue.path)}: ${issue.message}`,
	}));
}

/** `["review_record", "approved_version"]` reads as `review_record.approved_version`. */
function fieldName(path: readonly PropertyKey[]): string {
	return path.length === 0 ? '(record)' : path.join('.');
}

/**
 * Any key the schema does not name, reported rather than silently dropped.
 *
 * The rule this exists for is §2's "no duration or time estimate other than
 * `smallest version`" — duration targets create completion pressure — and the
 * shape it would arrive in is a well-meant extra field. Every other unknown key
 * is worth failing on for the same reason: a field nothing reads is a field
 * nobody reviewed.
 */
function unknownFieldFailures({ path, frontmatter }: RecordFile): GateFailure[] {
	return [...unknownKeys(frontmatter, practiceRecordSchema.shape, [])].map((key) => ({
		gate: GATE,
		where: path,
		message:
			`${key}: not a field of the practice record. ` +
			(looksLikeDuration(key)
				? '`smallest_version` is the only field that may carry anything resembling a duration.'
				: 'Add it to the schema in src/catalog/practice-record.ts, or remove it.'),
	}));
}

/**
 * Keys the schema does not name, at every depth, as dotted paths.
 *
 * Nesting is where this would otherwise be evaded: `provenance` and
 * `review_record` are objects, and Zod strips an unknown key inside one exactly
 * as quietly as it strips one at the top.
 */
function* unknownKeys(value: unknown, shape: unknown, at: string[]): Generator<string> {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) return;
	if (shape === null || typeof shape !== 'object') return;

	for (const [key, nested] of Object.entries(value)) {
		const field = [...at, key];
		if (!(key in shape)) {
			yield field.join('.');
			continue;
		}
		yield* unknownKeys(nested, shapeOf((shape as Record<string, unknown>)[key]), field);
	}
}

/** The field map of a nested object schema, or `undefined` if it is not one. */
function shapeOf(schema: unknown): unknown {
	return (schema as { shape?: unknown } | undefined)?.shape;
}

function looksLikeDuration(key: string): boolean {
	return /duration|time|minutes?|length|how_long/i.test(key);
}
