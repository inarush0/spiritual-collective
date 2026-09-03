import {
	cssReferences,
	isAbsolute,
	referencesIn,
	type BuiltOutput,
	type Reference,
} from './built-output.ts';
import type { Gate, GateFailure } from './failure.ts';

const GATE: Gate = 'third-party requests';

/**
 * Check 5 of `npm run gates`: zero requests to any third-party origin in the
 * built output.
 *
 * The site is served from one origin, so *any* absolute URL in the markup is a
 * second one — there is no allowlist to keep current and no origin to compare
 * against. That catches the whole list §7 names (CDN libraries, embeds, web
 * fonts, analytics of any kind) without naming any of them, which matters
 * because the next vendor to be tempting has not been invented yet.
 *
 * Outbound links fail too, though a link is not a request until it is clicked.
 * Operator independence is architectural: no co-branding, no institutional
 * links. When a real outbound link is wanted, loosening this is the deliberate
 * act it should be.
 */
export function checkNetwork(output: BuiltOutput): GateFailure[] {
	return [
		...output.pages.flatMap((page) => secondOrigins(page.route, referencesIn(page.html))),
		// A stylesheet the build emitted rather than inlined is built output too,
		// and `@import` in one is the oldest way a web font arrives.
		...output.stylesheets.flatMap((sheet) => secondOrigins(sheet.path, [...cssReferences(sheet.css)])),
	];
}

function secondOrigins(where: string, references: readonly Reference[]): GateFailure[] {
	return references
		.filter((reference) => isAbsolute(reference.url))
		.map((reference) => ({
			gate: GATE,
			where,
			message:
				`${reference.origin} reaches ${originOf(reference.url)} — ` +
				'the built output may not request or link to a second origin ' +
				'(docs/adr/0001-static-zero-js-no-third-party.md).',
		}));
}

/** The host, when there is one to name; the URL itself when it will not parse. */
function originOf(url: string): string {
	try {
		return new URL(url, 'https://placeholder.invalid').host;
	} catch {
		return url;
	}
}
