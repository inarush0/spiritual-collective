import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
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

export const collections = { practices };
