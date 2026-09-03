import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, posix, relative, sep } from 'node:path';

/**
 * A reading of a built site, and the vocabulary the output gates share.
 *
 * The network assertion and the weight budget both have to answer the same
 * question first — *what does this page make the browser go and get?* — so the
 * scanning lives here once and the two gates only decide what to do with the
 * answer. Neither gate opens a file itself.
 */

/** One prerendered page. `route` is what a reader would see in the address bar. */
export interface BuiltPage {
	route: string;
	/** Path within the built directory, for a failure line. */
	file: string;
	html: string;
}

/** A file the build emitted, with its transferred size. */
export interface BuiltFile {
	path: string;
	bytes: number;
}

/** A stylesheet the build emitted as its own request rather than inlining. */
export interface BuiltStylesheet {
	path: string;
	css: string;
}

/** Everything the gates need from one build, read once. */
export interface BuiltOutput {
	dir: string;
	pages: BuiltPage[];
	stylesheets: BuiltStylesheet[];
	files: BuiltFile[];
}

/**
 * A URL the markup points at.
 *
 * `fetched` is the distinction the two gates disagree about: the weight budget
 * counts only what the browser gets before the page is usable, while the
 * network assertion fails on a second origin either way — a link out is not a
 * request, but it is not something this site does (ADR 0001, §7 operator
 * independence).
 */
export interface Reference {
	url: string;
	/** `img[src]`, `link[href]`, `css url()` — enough to find it in the file. */
	origin: string;
	fetched: boolean;
}

/** Attributes whose value the browser fetches without being asked. */
const FETCHED_ATTRIBUTES = new Set([
	'src',
	'srcset',
	'imagesrcset',
	'poster',
	'data',
	'background',
]);

/** Attributes that carry a URL the reader travels to rather than one that loads. */
const NAVIGATION_ATTRIBUTES = new Set(['action', 'formaction', 'cite', 'ping']);

/** `<link>` fetches its href; `<a>`, `<area>`, and `<base>` do not. */
const HREF_IS_FETCHED = new Set(['link', 'embed', 'use', 'image']);

/**
 * Attributes that hold a URL-shaped string the browser never resolves.
 * `xmlns` is the reason this list exists: every inline SVG carries the W3C
 * namespace, and it is not a request.
 */
const NOT_A_URL = /^xmlns(:|$)/i;

const TAG = /<([a-zA-Z][^\s/>]*)((?:[^>"']|"[^"]*"|'[^']*')*)\/?>/g;
const ATTRIBUTE = /([a-zA-Z_:][-\w:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
const STYLE_ELEMENT = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
const CSS_URL = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"]*))\s*\)|@import\s+(?:"([^"]*)"|'([^']*)')/gi;

/** One element as the markup wrote it: its name and the attributes it carries. */
export interface Element {
	tag: string;
	attributes: { name: string; value: string }[];
}

/**
 * Every element in the page.
 *
 * The gates read this rather than testing patterns against the page as one
 * string, because the page also contains a practice's words. A record is
 * allowed to say "once = twice" or to name `@font-face`; a gate that fails on
 * prose fails the build for saying something, and the fix a writer would reach
 * for is to say it differently.
 */
export function* elementsIn(html: string): Generator<Element> {
	for (const [, tag = '', attributes = ''] of html.matchAll(TAG)) {
		yield {
			tag: tag.toLowerCase(),
			attributes: [...attributes.matchAll(ATTRIBUTE)].map(([, name = '', quoted, single, bare]) => ({
				name: name.toLowerCase(),
				value: quoted ?? single ?? bare ?? '',
			})),
		};
	}
}

/** The CSS a page carries in `<style>` elements and `style` attributes. */
export function* inlineCss(html: string): Generator<string> {
	for (const [, css = ''] of html.matchAll(STYLE_ELEMENT)) yield css;
	for (const element of elementsIn(html)) {
		for (const { name, value } of element.attributes) {
			if (name === 'style' && value !== '') yield value;
		}
	}
}

/** Every URL the page points at, in the order they appear. */
export function referencesIn(html: string): Reference[] {
	return [...markupReferences(html), ...styleReferences(html)];
}

function* markupReferences(html: string): Generator<Reference> {
	for (const { tag, attributes } of elementsIn(html)) {
		for (const { name, value } of attributes) {
			// A `style` attribute is picked up by `inlineCss` below, with the
			// `<style>` elements.
			if (NOT_A_URL.test(name) || value === '' || name === 'style') continue;

			const fetched = FETCHED_ATTRIBUTES.has(name) || (name === 'href' && HREF_IS_FETCHED.has(tag));
			if (!fetched && !NAVIGATION_ATTRIBUTES.has(name) && name !== 'href') continue;

			for (const url of name.endsWith('srcset') ? candidates(value) : [value]) {
				yield { url, origin: `${tag}[${name}]`, fetched };
			}
		}
	}
}

/** `a.png 1x, b.png 2x` — the descriptor is not part of the URL. */
function candidates(srcset: string): string[] {
	return srcset
		.split(',')
		.map((candidate) => candidate.trim().split(/\s+/)[0] ?? '')
		.filter((url) => url !== '');
}

function* styleReferences(html: string): Generator<Reference> {
	for (const css of inlineCss(html)) yield* cssReferences(css);
}

/** Exported for the CSS files a build may emit alongside the pages. */
export function* cssReferences(css: string): Generator<Reference> {
	for (const [, quoted, single, bare, imported, importedSingle] of css.matchAll(CSS_URL)) {
		const url = (quoted ?? single ?? bare ?? imported ?? importedSingle ?? '').trim();
		if (url !== '') yield { url, origin: 'css url()', fetched: true };
	}
}

/** Read a built directory: every page, and every file with its size. */
export function readBuiltOutput(dir: string): BuiltOutput {
	const files = listFiles(dir).map((path) => ({ path, bytes: statSync(join(dir, path)).size }));

	const pages = files
		.filter(({ path }) => path.endsWith('.html'))
		.map(({ path }) => ({
			route: routeOf(path),
			file: path,
			html: readFileSync(join(dir, path), 'utf8'),
		}));

	const stylesheets = files
		.filter(({ path }) => path.endsWith('.css'))
		.map(({ path }) => ({ path, css: readFileSync(join(dir, path), 'utf8') }));

	return { dir, pages, stylesheets, files };
}

/** Built-directory-relative paths, always with forward slashes. */
function listFiles(dir: string): string[] {
	return readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => relative(dir, join(entry.parentPath, entry.name)).split(sep).join(posix.sep))
		.sort();
}

/** `me/everything/index.html` is the page a reader reaches at `/me/everything/`. */
function routeOf(file: string): string {
	return `/${file.replace(/index\.html$/, '')}`;
}

/**
 * Whether a URL leaves this origin. Absolute (`https://x/y`) and
 * protocol-relative (`//x/y`) both do; the whole site is served from one
 * origin, so there is no host to compare against and no allowlist to keep.
 */
export function isAbsolute(url: string): boolean {
	return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(url);
}

/**
 * A URL as a path within the built directory, resolved against the file it was
 * found in. `undefined` when it is not a file this build emitted — another
 * origin, or a `data:` URI carrying its bytes with it.
 */
export function builtPathOf(url: string, from: string): string | undefined {
	if (isAbsolute(url) || url.startsWith('data:')) return undefined;
	const [path = ''] = url.split(/[?#]/);
	if (path === '') return undefined;

	const absolute = path.startsWith('/') ? path : posix.join('/', posix.dirname(from), path);
	return absolute.replace(/^\//, '');
}
