import { describe, expect, it } from 'vitest';
import { checkNetwork } from '../../src/gates/network-gate.ts';
import type { BuiltOutput } from '../../src/gates/built-output.ts';

const output = (parts: Partial<BuiltOutput>): BuiltOutput => ({
	dir: '/tmp/does-not-matter',
	pages: [],
	stylesheets: [],
	files: [],
	...parts,
});

const page = (html: string): BuiltOutput =>
	output({ pages: [{ route: '/me/everything/', file: 'me/everything/index.html', html }] });

describe('the network assertion', () => {
	it('passes a page that reaches for nothing', () => {
		expect(checkNetwork(page('<html><body><h1>Everything</h1></body></html>'))).toEqual([]);
	});

	it('fails a stylesheet, script, or image from a second origin', () => {
		for (const markup of [
			'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter" />',
			'<script src="//cdn.example.com/analytics.js"></script>',
			'<img src="http://images.example.org/logo.png" />',
		]) {
			const failures = checkNetwork(page(markup));
			expect(failures).toHaveLength(1);
			expect(failures[0]!.where).toBe('/me/everything/');
		}
	});

	it('fails a web font or import reached from inline CSS', () => {
		expect(
			checkNetwork(page('<style>@import url("https://fonts.example.com/inter.css");</style>')),
		).toHaveLength(1);
		expect(
			checkNetwork(page('<style>@font-face{src:url(https://cdn.example.com/a.woff2)}</style>')),
		).toHaveLength(1);
	});

	it('fails a URL reached from a style attribute', () => {
		expect(
			checkNetwork(page('<div style="background:url(https://cdn.example.com/x.png)"></div>')),
		).toHaveLength(1);
	});

	it('fails an outbound link, because operator independence is architectural', () => {
		expect(checkNetwork(page('<a href="https://a-hospital.example/">Our partner</a>'))).toHaveLength(
			1,
		);
	});

	it('names the origin it found, so the fix is obvious', () => {
		const failures = checkNetwork(page('<img src="https://cdn.example.com/logo.png" />'));
		expect(failures[0]!.message).toContain('cdn.example.com');
	});

	it('allows local paths and the SVG namespace', () => {
		expect(
			checkNetwork(
				page(
					'<a href="/me/everything/">Everything</a>' +
						'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><path d="M0 0" /></svg>',
				),
			),
		).toEqual([]);
	});

	it('fails a second origin in a stylesheet the build emitted', () => {
		const failures = checkNetwork(
			output({
				stylesheets: [
					{ path: '_astro/page.css', css: '@import "https://fonts.example.com/inter.css";' },
				],
			}),
		);

		expect(failures).toHaveLength(1);
		expect(failures[0]!.where).toBe('_astro/page.css');
	});

	it('does not read a URL printed as words as a request', () => {
		// A record's origin line may one day quote a source. Nothing is fetched.
		expect(checkNetwork(page('<p>Adapted from https://example.org/a-book</p>'))).toEqual([]);
	});
});
