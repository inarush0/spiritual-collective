import type { Release } from '../records/release.ts';
import type { GateFailure } from './failure.ts';

export interface CloudflarePagesFiles {
	headers?: string;
	robots?: string;
}

const WILDCARD_NOINDEX = /(?:^|\n)\/\*\s*\n(?:[ \t]+[^\n]*\n)*?[ \t]+X-Robots-Tag:\s*[^\n]*\bnoindex\b/im;
const DISALLOW_ALL = /(?:^|\n)User-agent:\s*\*\s*\nDisallow:\s*\/\s*(?:\n|$)/im;

/**
 * The beta is unlisted, not private: Cloudflare must add a `noindex` response
 * header to every static asset and `robots.txt` must disallow every crawler.
 * Production must carry neither beta control, because it is the public copy.
 */
export function checkCloudflarePages(
	release: Release,
	files: CloudflarePagesFiles,
): GateFailure[] {
	const failures: GateFailure[] = [];
	const hasNoindex = WILDCARD_NOINDEX.test(files.headers ?? '');
	const disallowsAll = DISALLOW_ALL.test(files.robots ?? '');

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
