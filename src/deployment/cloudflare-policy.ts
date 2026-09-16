/** The host control files written only for the beta build. */
export const BETA_HEADERS = '/*\n  X-Robots-Tag: noindex\n';
export const BETA_ROBOTS = 'User-agent: *\nDisallow: /\n';

const WILDCARD_NOINDEX = /(?:^|\n)\/\*\s*\n(?:[ \t]+[^\n]*\n)*?[ \t]+X-Robots-Tag:\s*[^\n]*\bnoindex\b/im;
const NOINDEX = /(?:^|,)\s*noindex(?:\s|,|$)/i;
const DISALLOW_ALL = /(?:^|\n)User-agent:\s*\*\s*\nDisallow:\s*\/\s*(?:\n|$)/im;

export function headersFileDisablesIndexing(headers: string | undefined): boolean {
	return WILDCARD_NOINDEX.test(headers ?? '');
}

export function responseDisablesIndexing(header: string | null): boolean {
	return NOINDEX.test(header ?? '');
}

export function robotsDisallowAll(robots: string | undefined): boolean {
	return DISALLOW_ALL.test(robots ?? '');
}
