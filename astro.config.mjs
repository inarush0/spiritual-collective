// @ts-check
import { defineConfig } from 'astro/config';

// Fully prerendered, zero client JavaScript, zero third-party requests
// (ADR 0001). There is no adapter and no integration here on purpose: every
// route in the §1 table is a real static page, and anything added to this file
// that ships a script or reaches a second origin breaks the weight budget in
// docs/spec/07-technical-constraints.md.
export default defineConfig({
	trailingSlash: 'always',
	build: {
		format: 'directory',
		// No `is:inline` script should ever exist to bundle, but if one appears
		// this keeps it out of a separate request as well as out of the page.
		inlineStylesheets: 'always',
	},
	devToolbar: {
		enabled: false,
	},
});
