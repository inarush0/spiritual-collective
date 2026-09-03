import { describe, expect, it } from 'vitest';
import { checkWeight } from '../../src/gates/weight-gate.ts';
import type { BuiltOutput } from '../../src/gates/built-output.ts';

/** A built site described directly, so the budget can be tested without a build. */
function built(
	html: string,
	extraFiles: { path: string; bytes: number }[] = [],
): BuiltOutput {
	const file = 'me/everything/index.html';
	return {
		dir: '/tmp/does-not-matter',
		pages: [{ route: '/me/everything/', file, html }],
		stylesheets: [],
		files: [{ path: file, bytes: Buffer.byteLength(html) }, ...extraFiles],
	};
}

const page = (body: string) => `<!doctype html><html><body>${body}</body></html>`;

describe('the weight budget', () => {
	it('passes a page of markup and inline SVG', () => {
		expect(
			checkWeight(
				built(page('<h1>Everything</h1><svg viewBox="0 0 1 1"><path d="M0 0" /></svg>')),
			),
		).toEqual([]);
	});

	it('does not read a practice record\'s own words as markup', () => {
		// Every one of these is prose a record could legitimately carry. A gate
		// that fails on them fails the build for saying something.
		const prose =
			'<p>Ask yourself: what would I do if this happened once = twice?</p>' +
			'<p>The typographer called it @font-face, which is not a thing here.</p>';

		expect(checkWeight(built(page(prose)))).toEqual([]);
	});

	describe('no client JavaScript on any page', () => {
		it('fails a script element', () => {
			expect(checkWeight(built(page('<script>console.log(1)</script>')))).toHaveLength(1);
		});

		it('fails an inline event handler', () => {
			expect(checkWeight(built(page('<button onclick="go()">Go</button>')))).toHaveLength(1);
		});

		it('fails a javascript: URL', () => {
			expect(checkWeight(built(page('<a href="javascript:void(0)">Go</a>')))).toHaveLength(1);
		});

		it('fails a script the build emitted, even if no page loads it', () => {
			expect(checkWeight(built(page('<h1>Hi</h1>'), [{ path: '_astro/x.js', bytes: 10 }])))
				.toHaveLength(1);
		});
	});

	describe('no web fonts', () => {
		it('fails an @font-face rule', () => {
			const html = page('<style>@font-face{font-family:X;src:url(/x.woff2)}</style>');
			expect(checkWeight(built(html, [{ path: 'x.woff2', bytes: 10 }])).length).toBeGreaterThan(0);
		});

		it('fails a font file in the built output', () => {
			expect(checkWeight(built(page('<h1>Hi</h1>'), [{ path: 'fonts/inter.woff2', bytes: 10 }])))
				.toHaveLength(1);
		});
	});

	describe('no raster images — inline SVG only', () => {
		it('fails a raster file in the built output', () => {
			expect(checkWeight(built(page('<h1>Hi</h1>'), [{ path: 'logo.png', bytes: 10 }])))
				.toHaveLength(1);
		});

		it('fails a raster data URI, which ships the bytes rather than requesting them', () => {
			expect(checkWeight(built(page('<img src="data:image/png;base64,iVBORw0KGgo=" />'))))
				.toHaveLength(1);
		});
	});

	describe('100 KB transferred per page', () => {
		it('fails a page whose own markup is over budget', () => {
			const failures = checkWeight(built(page('x'.repeat(101 * 1024))));

			expect(failures).toHaveLength(1);
			expect(failures[0]!.where).toBe('/me/everything/');
			expect(failures[0]!.message).toContain('100 KB');
		});

		it('counts what the page fetches, not only its own bytes', () => {
			const html = page('<link rel="stylesheet" href="/styles.css" /><h1>Hi</h1>');
			// Under the budget by itself; over it once the markup is added.
			const output = built(html, [{ path: 'styles.css', bytes: 100 * 1024 - 50 }]);

			expect(checkWeight(output)).toHaveLength(1);
		});

		it('follows a stylesheet into what the stylesheet itself fetches', () => {
			const html = page('<link rel="stylesheet" href="/styles.css" /><h1>Hi</h1>');
			const output = built(html, [
				{ path: 'styles.css', bytes: 200 },
				{ path: 'art/backdrop.svg', bytes: 100 * 1024 },
			]);
			output.stylesheets = [
				{ path: 'styles.css', css: 'body{background:url(/art/backdrop.svg)}' },
			];

			expect(checkWeight(output)).toHaveLength(1);
		});

		it('does not count a page the reader might navigate to next', () => {
			const html = page('<a href="/me/everything/other/">Other</a>');
			const output = built(html, [{ path: 'me/everything/other/index.html', bytes: 99 * 1024 }]);

			expect(checkWeight(output)).toEqual([]);
		});
	});
});
