import { z } from 'zod';
import {
	chaplainReview,
	promotionIssues,
	prose,
	PUBLICATION_STATES,
} from '../records/governed.ts';

/**
 * The **guide record**: the reviewable, promotable unit holding the **standing
 * guide** (`docs/spec/02-content-standard.md`).
 *
 * Its own governed kind — not a practice record, and not a **framing surface**.
 * The page a companion is sent to first says how to offer a practice to a dying
 * child and how to adapt one, which is the most consequential wording on the
 * site, so it is approved, versioned, and withdrawable like everything else
 * user-facing: `approved_version` plus the chaplain's attestation, the same
 * apparatus a practice carries (`docs/spec/05-governance.md`).
 *
 * **It carries no practice facets.** No `risk class`, no `need tags`, no
 * `smallest version` — and the schema's silence is not what enforces that, since
 * Zod strips what it does not name. The frontmatter gate reads the keys actually
 * written and fails on any this schema does not name
 * (`src/gates/frontmatter-gate.ts`), so a `need_tags:` added here is a failed
 * build rather than a field that quietly does nothing. That matters because the
 * facets are what a set is built from: a guide record carrying one is a guide
 * one edit away from being offered as something to do.
 *
 * Nothing here reaches into the catalog and nothing in the catalog reaches into
 * this. That is the mechanism behind "never in a set, never in a tail, never in
 * `/everything/`" — the guide is not in the collection those pages read.
 */

/**
 * The four parts the standing guide holds (`docs/spec/01-journey-and-ia.md`).
 *
 * The headings are the record's own wording rather than the page's furniture,
 * which is why they are here and not in `src/framing/`: they are approved with
 * the body they head, and a companion reads them as part of the guide.
 *
 * They are a list rather than four prose fields because the guide is read as a
 * page, start to finish, by someone who has just been handed a reason to be on
 * it. But the four are named, and `missingGuideParts` checks for them, because
 * two of them are the parts most easily lost in an edit: the section saying the
 * catalog is also for the caregiver as themselves is the one a reader in a
 * hospital room is least likely to think of asking for, and the
 * **no-suitability statement** is a refusal the resource is obliged to make.
 */
export interface GuidePart {
	/** How this part is referred to in a build failure, not on the page. */
	name: string;
	/** The heading as the body writes it, and as a reader meets it. */
	heading: string;
}

export const GUIDE_PARTS: readonly GuidePart[] = [
	{ name: 'how to offer', heading: 'How to offer one of these' },
	{ name: 'how to adapt', heading: 'How to adapt one' },
	{ name: 'the caregiver as themselves', heading: 'This is for you as well' },
	{ name: 'the no-suitability statement', heading: 'What this cannot tell you' },
];

/**
 * The parts a guide body does not hold, named as the spec names them.
 *
 * A heading match rather than a prose judgement: whether the words under a
 * heading do their job is the chaplain's attestation, and no machine is
 * pretending otherwise here. What this catches is the part that went missing —
 * which is a whole-section absence, the failure an editor cannot see by reading
 * what is on the page.
 */
export function missingGuideParts(body: string): GuidePart[] {
	const headings = new Set(
		[...body.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)].map((match) => match[1]!.trim()),
	);
	return GUIDE_PARTS.filter((part) => !headings.has(part.heading));
}

export const guideRecordSchema = z
	.object({
		name: prose,
		publication: z.enum(PUBLICATION_STATES),
		/**
		 * The chaplain's half and nothing else. A **safety consult** is asked
		 * about a practice carrying clinical risk, and the guide asks nobody to
		 * do anything, so there is no `clinician_attested` here to fill in
		 * `not-required` forever.
		 */
		review_record: z.object(chaplainReview),
	})
	.check((ctx) => {
		for (const issue of promotionIssues(ctx.value)) {
			ctx.issues.push({ code: 'custom', ...issue });
		}
	});

export type GuideRecord = z.infer<typeof guideRecordSchema>;
