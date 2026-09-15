import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { guideRecordSchema } from './guide/guide-record.js';
import { practiceRecordSchema } from './catalog/practice-record.js';

// Content lives in git at the repo root, one file per record, structured
// fields in frontmatter and prose in the body (docs/spec/07-technical-constraints.md).
// The schema is defined once in src/catalog/practice-record.ts and imported
// here rather than declared inline, so that `npm run gates` can enforce the
// same field set from the same definition when it lands.
const practices = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './content/practices' }),
	schema: practiceRecordSchema,
});

/**
 * The **guide record**, in its own collection of exactly one.
 *
 * Separate from `practices` because it is a separate governed kind, and
 * because separateness is what keeps §1's promise mechanical: every page that
 * lists something reads the practices collection, so the guide cannot appear
 * in the catalog, in a suggestion set, in a **set tail**, or in `/everything/`
 * — not by a rule each of those pages remembers to apply, but because it is
 * not in the list they read. Its prose lives in the body, as a practice's does.
 */
const guide = defineCollection({
	loader: glob({ pattern: 'guide.md', base: './content' }),
	schema: guideRecordSchema,
});

export const collections = { practices, guide };
