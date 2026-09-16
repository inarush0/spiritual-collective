import { describe, expect, it } from 'vitest';
import { verifyDeployments } from '../src/deployment/verify.js';
import { PENDING_MARKER } from '../src/framing/practice-view.js';

function responses(parts: {
	production?: Response;
	productionCatalog?: Response;
	beta?: Response;
	betaCatalog?: Response;
	robots?: Response;
}): typeof fetch {
	const fetcher = async (input: RequestInfo | URL) => {
		const url = String(input);
		if (url === 'https://production.example/') {
			return parts.production ?? new Response('<p>public site</p>');
		}
		if (url === 'https://production.example/me/everything/') {
			return parts.productionCatalog ?? new Response('<p>approved record</p>');
		}
		if (url === 'https://unlisted-beta.example/') {
			return (
				parts.beta ??
				new Response('<p>beta — for review</p>', {
					headers: { 'X-Robots-Tag': 'noindex' },
				})
			);
		}
		if (url === 'https://unlisted-beta.example/robots.txt') {
			return parts.robots ?? new Response('User-agent: *\nDisallow: /\n');
		}
		if (url === 'https://unlisted-beta.example/me/everything/') {
			return (
				parts.betaCatalog ??
				new Response(`<p>${PENDING_MARKER}</p>`, {
					headers: { 'X-Robots-Tag': 'noindex' },
				})
			);
		}
		throw new Error(`unexpected request: ${url}`);
	};
	return fetcher as typeof fetch;
}

describe('deployed Cloudflare Pages projects', () => {
	it('passes two distinct releases with beta crawl controls', async () => {
		await expect(
			verifyDeployments(
				'https://production.example',
				'https://unlisted-beta.example',
				responses({}),
			),
		).resolves.toEqual([]);
	});

	it('reports a public beta or crawl controls that Cloudflare did not serve', async () => {
		const failures = await verifyDeployments(
			'https://production.example',
			'https://unlisted-beta.example',
			responses({
				production: new Response('<p>beta — for review</p>', {
					headers: { 'X-Robots-Tag': 'noindex' },
				}),
				beta: new Response('<p>public site</p>'),
				robots: new Response('User-agent: *\nAllow: /\n'),
			}),
		);

		expect(failures).toEqual([
			'production must not show the beta review bar',
			'production must not send X-Robots-Tag: noindex',
			'beta must show the review bar',
			'beta must send X-Robots-Tag: noindex',
			'beta robots.txt must disallow the whole site',
		]);
	});

	it('requires two different HTTPS origins', async () => {
		await expect(
			verifyDeployments('http://same.example', 'http://same.example', responses({})),
		).resolves.toEqual([
			'production URL must use HTTPS',
			'beta URL must use HTTPS',
			'production and beta must use different origins',
		]);
	});

	it('checks the deployed catalog split and production data posture', async () => {
		const failures = await verifyDeployments(
			'https://production.example',
			'https://unlisted-beta.example',
			responses({
				productionCatalog: new Response(
					`<p>${PENDING_MARKER}</p><script src="https://analytics.example/beacon.js"></script>`,
				),
				betaCatalog: new Response('<p>approved record</p>', {
					headers: { 'X-Robots-Tag': 'noindex' },
				}),
			}),
		);

		expect(failures).toEqual([
			'production must not serve pending records',
			'production must not serve client scripts or third-party references',
			'beta must serve and mark pending records',
		]);
	});
});
