import type { Release } from '../records/release.ts';
import {
	headersFileDisablesIndexing,
	robotsDisallowAll,
} from '../deployment/cloudflare-policy.ts';
import type { GateFailure } from './failure.ts';

export interface CloudflarePagesFiles {
	headers?: string;
	robots?: string;
}

/**
 * The beta is unlisted, not private: Cloudflare must add a `noindex` response
 * header to every static asset and `robots.txt` must disallow every crawler.
 * Production must carry neither beta control, because it is the public copy.
 * `docs/spec/07-technical-constraints.md`, “Beta is unlisted, not private”.
 */
export function checkCloudflarePages(
	release: Release,
	files: CloudflarePagesFiles,
): GateFailure[] {
	const failures: GateFailure[] = [];
	const hasNoindex = headersFileDisablesIndexing(files.headers);
	const disallowsAll = robotsDisallowAll(files.robots);

	if (release === 'beta' && !hasNoindex) {
		failures.push({
			gate: 'beta crawl controls',
			where: '_headers',
			message: 'beta must send X-Robots-Tag: noindex on every response',
		});
	}
	if (release === 'beta' && !disallowsAll) {
		failures.push({
			gate: 'beta crawl controls',
			where: 'robots.txt',
			message: 'beta must disallow every crawler from the whole site',
		});
	}
	if (release === 'production' && hasNoindex) {
		failures.push({
			gate: 'beta crawl controls',
			where: '_headers',
			message: 'production must not inherit the beta noindex header',
		});
	}
	if (release === 'production' && disallowsAll) {
		failures.push({
			gate: 'beta crawl controls',
			where: 'robots.txt',
			message: 'production must not inherit the beta crawler disallow',
		});
	}

	return failures;
}
