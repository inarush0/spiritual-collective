import type { BuiltOutput } from '../gates/built-output.ts';
import { checkNetwork } from '../gates/network-gate.ts';
import { checkWeight } from '../gates/weight-gate.ts';
import { PENDING_MARKER } from '../framing/practice-view.ts';
import { responseDisablesIndexing, robotsDisallowAll } from './cloudflare-policy.ts';

const REVIEW_BAR = 'beta — for review';

/**
 * Verify the behavior Cloudflare actually serves, after both Pages projects
 * have deployed. This complements the build gate: the gate proves the files
 * are in the artifact; this proves the host applied them to the beta origin.
 */
export async function verifyDeployments(
	productionUrl: string,
	betaUrl: string,
	fetcher: typeof fetch = fetch,
): Promise<string[]> {
	const failures: string[] = [];
	const production = new URL(productionUrl);
	const beta = new URL(betaUrl);

	if (production.protocol !== 'https:') failures.push('production URL must use HTTPS');
	if (beta.protocol !== 'https:') failures.push('beta URL must use HTTPS');
	if (production.origin === beta.origin) {
		failures.push('production and beta must use different origins');
	}
	if (failures.length > 0) return failures;

	const [productionPage, productionCatalog, betaPage, betaCatalog, betaRobots] = await Promise.all([
		fetcher(new URL('/', production)),
		fetcher(new URL('/me/everything/', production)),
		fetcher(new URL('/', beta)),
		fetcher(new URL('/me/everything/', beta)),
		fetcher(new URL('/robots.txt', beta)),
	]);
	const [productionHtml, productionCatalogHtml, betaHtml, betaCatalogHtml, robots] =
		await Promise.all([
		productionPage.text(),
		productionCatalog.text(),
		betaPage.text(),
		betaCatalog.text(),
		betaRobots.text(),
		]);

	if (!productionPage.ok) failures.push(`production returned HTTP ${productionPage.status}`);
	if (!productionCatalog.ok) {
		failures.push(`production catalog returned HTTP ${productionCatalog.status}`);
	}
	if (!betaPage.ok) failures.push(`beta returned HTTP ${betaPage.status}`);
	if (!betaCatalog.ok) failures.push(`beta catalog returned HTTP ${betaCatalog.status}`);
	if (!betaRobots.ok) failures.push(`beta robots.txt returned HTTP ${betaRobots.status}`);
	if (productionHtml.includes(REVIEW_BAR)) {
		failures.push('production must not show the beta review bar');
	}
	if (
		[productionPage, productionCatalog].some((response) =>
			responseDisablesIndexing(response.headers.get('x-robots-tag')),
		)
	) {
		failures.push('production must not send X-Robots-Tag: noindex');
	}
	if (productionCatalogHtml.includes(PENDING_MARKER)) {
		failures.push('production must not serve pending records');
	}
	if (violatesStaticPosture([productionHtml, productionCatalogHtml])) {
		failures.push('production must not serve client scripts or third-party references');
	}
	if (!betaHtml.includes(REVIEW_BAR)) failures.push('beta must show the review bar');
	if (
		[betaPage, betaCatalog].some(
			(response) => !responseDisablesIndexing(response.headers.get('x-robots-tag')),
		)
	) {
		failures.push('beta must send X-Robots-Tag: noindex');
	}
	if (!betaCatalogHtml.includes(PENDING_MARKER)) {
		failures.push('beta must serve and mark pending records');
	}
	if (violatesStaticPosture([betaHtml, betaCatalogHtml])) {
		failures.push('beta must not serve client scripts or third-party references');
	}
	if (!robotsDisallowAll(robots)) {
		failures.push('beta robots.txt must disallow the whole site');
	}

	return failures;
}

/** Run the same zero-JS, zero-third-party policy over the live HTML as the build gate. */
function violatesStaticPosture(pages: string[]): boolean {
	const output: BuiltOutput = {
		dir: '',
		pages: pages.map((html, index) => ({
			route: `/live/${index}`,
			file: `live/${index}.html`,
			html,
		})),
		stylesheets: [],
		files: pages.map((html, index) => ({
			path: `live/${index}.html`,
			bytes: Buffer.byteLength(html),
		})),
	};
	return checkNetwork(output).length > 0 || checkWeight(output).length > 0;
}
