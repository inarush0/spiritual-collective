import type { Publication } from './practice-record.js';

/**
 * One branch, two builds. Both Cloudflare Pages projects deploy the same commit
 * and differ only by this variable; the gate is the record's `publication`
 * field, never the deploy. See `docs/spec/07-technical-constraints.md`.
 */
export const RELEASE_ENV_VAR = 'SITE_BUILD';

export type Release = 'beta' | 'production';

const RELEASES: readonly Release[] = ['beta', 'production'];

/**
 * Which build this is.
 *
 * Unset means production. The failure this defends against is a build that was
 * meant to be production going out with pending content in it, so the
 * permissive release is the one you have to ask for: `npm run dev` and
 * `npm run build:beta` set the variable, and the beta Pages project sets it in
 * its environment. An unrecognised value is an error rather than a fallback —
 * `SITE_BUILD=staging` silently building production is the same accident.
 */
export function resolveRelease(env: Record<string, string | undefined>): Release {
	const value = env[RELEASE_ENV_VAR];
	if (!value) return 'production';
	if (!RELEASES.includes(value as Release)) {
		throw new Error(
			`${RELEASE_ENV_VAR}="${value}" is not a release. Expected one of: ${RELEASES.join(', ')}.`,
		);
	}
	return value as Release;
}

/**
 * Whether a record in this publication state is offered by this build.
 *
 * Beta adds pending records to production's approved ones, because half the
 * chaplain's gates are judgements about the experience rather than the text,
 * and they cannot judge what the beta does not show them.
 *
 * **Withdrawn is offered by neither.** "Beta includes everything" is about the
 * approved/pending distinction; a withdrawn record has been pulled from the
 * resource, and withdrawal is the instrument for content that is actively
 * harmful. Its routes still build — they serve the 200 "this practice isn't
 * available right now" page — but nothing lists it as something to try.
 */
export function publishedIn(release: Release, publication: Publication): boolean {
	if (publication === 'withdrawn') return false;
	return release === 'beta' || publication === 'approved';
}

/**
 * Whether this record needs a marker saying it has not been approved yet.
 *
 * The counterpart to `publishedIn`: it decides what a build offers, this
 * decides what it flags. Both live here so the two builds' visible difference
 * is described in one file rather than re-derived in a template.
 */
export function pendingIn(release: Release, publication: Publication): boolean {
	return release === 'beta' && publication === 'in-review';
}
