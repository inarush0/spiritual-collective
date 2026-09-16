import { describe, expect, it } from 'vitest';
import { checkCloudflarePages } from '../../src/gates/cloudflare-pages-gate.ts';

const betaFiles = {
	headers: '/*\n  X-Robots-Tag: noindex\n',
	robots: 'User-agent: *\nDisallow: /\n',
};

describe('the Cloudflare Pages release assertion', () => {
	it('accepts beta output that sends noindex and disallows every crawler', () => {
		expect(checkCloudflarePages('beta', betaFiles)).toEqual([]);
	});

	it('fails beta when either indexing control is absent or incomplete', () => {
		expect(checkCloudflarePages('beta', {})).toHaveLength(2);
		expect(
			checkCloudflarePages('beta', {
				headers: '/*\n  X-Robots-Tag: nofollow\n',
				robots: 'User-agent: *\nDisallow: /private/\n',
			}),
		).toHaveLength(2);
	});

	it('fails production when beta indexing controls leak into it', () => {
		const failures = checkCloudflarePages('production', betaFiles);
		expect(failures).toHaveLength(2);
		expect(failures.map(({ where }) => where)).toEqual(['_headers', 'robots.txt']);
	});
});
