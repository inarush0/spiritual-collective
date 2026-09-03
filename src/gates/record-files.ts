import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep, posix } from 'node:path';
import yaml from 'js-yaml';
import type { RecordFile } from './frontmatter-gate.ts';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * The content records as written, before anything validates them.
 *
 * The gate reads the files itself rather than going through `getCollection`,
 * for two reasons: Astro's loader drops keys the schema does not name, which is
 * exactly the class of mistake check 1 exists to catch; and a record broken
 * badly enough fails the build, and "the build crashed" is a worse answer than
 * a list of fields and the files they are in.
 */
export function readRecordFiles(dir: string, root: string): RecordFile[] {
	return readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
		.map((entry) => join(entry.parentPath, entry.name))
		.sort()
		.map((file) => ({
			path: relative(root, file).split(sep).join(posix.sep),
			frontmatter: parseFrontmatter(readFileSync(file, 'utf8'), file),
		}));
}

/**
 * The frontmatter block as data. A file with no frontmatter at all parses to
 * `undefined`, which the schema fails on with the whole field list — the right
 * answer for a record that has not been written yet.
 */
function parseFrontmatter(source: string, file: string): unknown {
	const match = FRONTMATTER.exec(source);
	if (!match) return undefined;
	try {
		return yaml.load(match[1]!);
	} catch (error) {
		throw new Error(`${file}: frontmatter is not valid YAML — ${(error as Error).message}`);
	}
}
