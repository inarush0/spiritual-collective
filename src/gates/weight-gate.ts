import {
	builtPathOf,
	cssReferences,
	elementsIn,
	inlineCss,
	referencesIn,
	type BuiltFile,
	type BuiltOutput,
	type BuiltPage,
	type Reference,
} from './built-output.ts';
import type { Gate, GateFailure } from './failure.ts';

const GATE: Gate = 'weight budget';

/** §7: "≤ 100 KB transferred per page." */
const BUDGET_BYTES = 100 * 1024;

const FONT_FILE = /\.(woff2?|ttf|otf|eot)(?:[?#]|$)/i;
const RASTER_FILE = /\.(png|jpe?g|gif|webp|avif|bmp|ico|tiff?)(?:[?#]|$)/i;
const RASTER_DATA_URI = /^data:image\/(?!svg\+xml)/i;
const SCRIPT_FILE = /\.(m?js|cjs)(?:[?#]|$)/i;

/** `onclick`, `onload` — an event handler is client JavaScript in an attribute. */
const EVENT_HANDLER = /^on[a-z]+$/i;
const JAVASCRIPT_URL = /^\s*javascript:/i;
const FONT_FACE = /@font-face/i;

/**
 * Check 6 of `npm run gates`: the weight budget, as a hard fail.
 *
 * No web fonts, no raster images, ≤ 100 KB transferred per page, no client
 * JavaScript on any page. Every one of these is trivially true today, which is
 * the entire reason it is a gate: the way any of them breaks is a later change
 * that nobody weighed, and the cost of finding out in review is a rewrite.
 *
 * Each rule is checked twice over — against what the pages ask for, and against
 * what the build actually emitted — because an asset can arrive either by being
 * referenced or by being copied into `public/` and picked up by something else.
 */
export function checkWeight(output: BuiltOutput): GateFailure[] {
	return [
		...output.pages.flatMap((page) => pageFailures(page, output)),
		...emittedFileFailures(output.files),
	];
}

function pageFailures(page: BuiltPage, output: BuiltOutput): GateFailure[] {
	const failures: GateFailure[] = [];
	const fail = (message: string) => failures.push({ gate: GATE, where: page.route, message });

	for (const element of elementsIn(page.html)) {
		if (element.tag === 'script') {
			fail('a <script> element. No page ships client JavaScript (ADR 0001).');
		}
		for (const { name } of element.attributes) {
			if (EVENT_HANDLER.test(name)) {
				fail(`${element.tag}[${name}] is an event handler. No page ships client JavaScript.`);
			}
		}
	}

	for (const css of inlineCss(page.html)) {
		if (FONT_FACE.test(css)) fail('an @font-face rule. The system font stack only — no web fonts.');
	}

	const references = referencesIn(page.html);
	for (const { url, origin } of references) {
		if (JAVASCRIPT_URL.test(url)) {
			fail(`${origin} is a javascript: URL. No page ships client JavaScript (ADR 0001).`);
		}
		if (RASTER_DATA_URI.test(url)) {
			fail(`${origin} inlines a raster image. Inline SVG only.`);
		}
		if (RASTER_FILE.test(url)) fail(`${origin} loads a raster image. Inline SVG only.`);
		if (FONT_FILE.test(url)) fail(`${origin} loads a web font. System font stack only.`);
		if (SCRIPT_FILE.test(url)) {
			fail(`${origin} loads a script. No page ships client JavaScript (ADR 0001).`);
		}
	}

	const bytes = transferredBytes(page, references, output);
	if (bytes > BUDGET_BYTES) {
		fail(`${kb(bytes)} transferred. The budget is 100 KB per page.`);
	}

	return failures;
}

/**
 * What the browser gets for this page: its own markup, everything the markup
 * makes it fetch, and everything *those* files fetch in turn — a stylesheet
 * that pulls in a background image is weight this page pays for.
 *
 * A page the reader might navigate to next is not part of this page's weight,
 * so links are not counted.
 */
function transferredBytes(
	page: BuiltPage,
	references: readonly Reference[],
	output: BuiltOutput,
): number {
	const size = (path: string) => output.files.find((file) => file.path === path)?.bytes ?? 0;

	const pending = fetchedPaths(references, page.file);
	const counted = new Set<string>();
	let total = size(page.file);

	while (pending.length > 0) {
		const path = pending.shift()!;
		if (path === page.file || counted.has(path)) continue;
		counted.add(path);
		total += size(path);

		const stylesheet = output.stylesheets.find((sheet) => sheet.path === path);
		if (stylesheet) pending.push(...fetchedPaths([...cssReferences(stylesheet.css)], path));
	}

	return total;
}

/** The built-directory paths a set of references fetches, relative to `from`. */
function fetchedPaths(references: readonly Reference[], from: string): string[] {
	return references
		.filter((reference) => reference.fetched)
		.map((reference) => builtPathOf(reference.url, from))
		.filter((path): path is string => path !== undefined);
}

/** The build's own output, checked for assets no page happens to reference. */
function emittedFileFailures(files: readonly BuiltFile[]): GateFailure[] {
	const rules: [RegExp, string][] = [
		[SCRIPT_FILE, 'a script. No page ships client JavaScript (ADR 0001).'],
		[FONT_FILE, 'a web font. System font stack only.'],
		[RASTER_FILE, 'a raster image. Inline SVG only.'],
	];

	return files.flatMap(({ path }) =>
		rules
			.filter(([pattern]) => pattern.test(path))
			.map(([, what]) => ({ gate: GATE, where: path, message: `the build emitted ${what}` })),
	);
}

function kb(bytes: number): string {
	return `${(bytes / 1024).toFixed(1)} KB`;
}
