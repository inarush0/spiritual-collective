const REVIEW_BAR = 'beta — for review';
const NOINDEX = /(?:^|,)\s*noindex(?:\s|,|$)/i;
const DISALLOW_ALL = /(?:^|\n)User-agent:\s*\*\s*\nDisallow:\s*\/\s*(?:\n|$)/im;

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

	const [productionPage, betaPage, betaRobots] = await Promise.all([
		fetcher(new URL('/', production)),
		fetcher(new URL('/', beta)),
		fetcher(new URL('/robots.txt', beta)),
	]);
	const [productionHtml, betaHtml, robots] = await Promise.all([
		productionPage.text(),
		betaPage.text(),
		betaRobots.text(),
	]);

	if (!productionPage.ok) failures.push(`production returned HTTP ${productionPage.status}`);
	if (!betaPage.ok) failures.push(`beta returned HTTP ${betaPage.status}`);
	if (!betaRobots.ok) failures.push(`beta robots.txt returned HTTP ${betaRobots.status}`);
	if (productionHtml.includes(REVIEW_BAR)) {
		failures.push('production must not show the beta review bar');
	}
	if (NOINDEX.test(productionPage.headers.get('x-robots-tag') ?? '')) {
		failures.push('production must not send X-Robots-Tag: noindex');
	}
	if (!betaHtml.includes(REVIEW_BAR)) failures.push('beta must show the review bar');
	if (!NOINDEX.test(betaPage.headers.get('x-robots-tag') ?? '')) {
		failures.push('beta must send X-Robots-Tag: noindex');
	}
	if (!DISALLOW_ALL.test(robots)) {
		failures.push('beta robots.txt must disallow the whole site');
	}

	return failures;
}
