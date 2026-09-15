import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { NEED_TAGS, type NeedTag } from '../src/catalog/practice-record.js';
import { needTagSlug } from '../src/catalog/need-tags.js';
import { escapesFor, framingFor, CHANGE_PATH } from '../src/framing/audience.js';
import {
	ADJUSTMENTS_LEAD,
	CHILD_BADGE,
	COMPANION_ACTION,
	COMPANION_LOW_ENERGY_LINK,
	COMPANION_OFFER,
	GUIDE_DOORWAY,
	NO_SUITABILITY,
	WITH_BADGE,
} from '../src/framing/companion.js';
import { LOW_ENERGY_LINK, SET_LEAD, TAIL_LEAD, TAIL_TITLE } from '../src/framing/discovery.js';
import { ACTION, PATH_BADGE } from '../src/framing/practice-view.js';
import { AUDIENCE_PATHS, routesFor, type AudiencePath } from '../src/framing/routes.js';
import { buildBothReleases, hasPageAt, pageAt, plainText } from './support/build.js';

/**
 * The companion route trees: `/with/` and `/child/`
 * ([#27](https://github.com/inarush0/spiritual-collective/issues/27)).
 *
 * The same practices, offered to someone acting alongside another person, with
 * no question asked of them (`docs/spec/01-journey-and-ia.md`). Asserted
 * against the built pages, because nearly every rule here is a rule about what
 * a companion meets on a screen — and, more often, about what the three paths
 * must *not* differ in.
 *
 * The strongest of these are the comparisons across paths. A companion meeting
 * a quietly smaller catalog is the failure this ticket exists to prevent, and
 * it is not something one page can be read to rule out.
 */

const COMPANIONS = ['with', 'child'] as const satisfies readonly AudiencePath[];

let production: string;
let beta: string;
let cleanUp: () => void;

beforeAll(() => {
	({
		builds: { production, beta },
		cleanUp,
	} = buildBothReleases());
});

afterAll(() => cleanUp?.());

/** The practice slugs a screen links to, on its own path, in page order. */
function practicesOn(html: string, path: AudiencePath): string[] {
	const links = new RegExp(`href="/${path}/practice/([^/"]+)/"`, 'g');
	return [...html.matchAll(links)].map((match) => match[1]!);
}

/** The markup the set tail opens with, so a set can be read apart from it. */
const TAIL_MARKUP = '<section class="tail"';

/** A set screen above the quiet divider: what the reader was actually offered. */
function setOf(html: string): string {
	const divider = html.indexOf(TAIL_MARKUP);
	return divider === -1 ? html : html.slice(0, divider);
}

/** The tags the build offers as answers, from the question a direct user meets. */
function offeredTags(dir: string): NeedTag[] {
	const question = plainText(pageAt(dir, '/me/'));
	return NEED_TAGS.filter((tag) => question.includes(tag));
}

/** Every route one path holds, for the tags this build offers. */
function routeSet(dir: string, path: AudiencePath): string[] {
	const routes = routesFor(path);
	return [
		routes.door,
		routes.notSure,
		routes.everything,
		routes.nothing,
		...offeredTags(dir).flatMap((tag) => [routes.forTag(tag), routes.lowEnergy(tag)]),
		...practicesOn(pageAt(dir, routes.everything), path).map((slug) => routes.practice(slug)),
	];
}

describe('the door a companion lands on', () => {
	it('is a set, reached without a question being asked', () => {
		const door = plainText(pageAt(production, '/with/'));
		expect(door).toContain(COMPANION_OFFER);
		// No question mark outside the one persistent chrome link.
		expect(plainText(pageAt(production, '/with/').match(/<main>([\s\S]*)<\/main>/)![1]!)).not.toContain(
			'?',
		);
	});

	it('serves the fixed companion set, in the fixed editorial order', () => {
		// Written so far: saying the hard thing, which beta publishes. The other
		// two slots the set names are unwritten, and the door still opens.
		expect(practicesOn(setOf(pageAt(beta, '/with/')), 'with')).toEqual(['saying-the-hard-thing']);
	});

	it('reads as offering rather than reaching', () => {
		for (const path of COMPANIONS) {
			const door = plainText(pageAt(production, routesFor(path).door));
			expect(door, path).toContain(COMPANION_OFFER);
			// The direct user's lead-in, which reaches rather than offers. The
			// tail's heading says "other things people reach for" on every path,
			// because it describes the list rather than addressing the reader.
			expect(door, path).not.toContain(SET_LEAD[0]);
		}
	});

	it('gives the younger-child path the same set, unchanged', () => {
		// Not "a similar set": the same practices, in the same order. A set
		// hand-picked for a young child would be an age-suitability judgement
		// expressed as page order.
		for (const dir of [production, beta]) {
			expect(practicesOn(setOf(pageAt(dir, '/child/set/')), 'child')).toEqual(
				practicesOn(setOf(pageAt(dir, '/with/')), 'with'),
			);
		}
	});

	it('states the no-suitability claim over the younger-child set, above it', () => {
		const html = pageAt(production, '/child/set/');
		const words = plainText(html);
		for (const line of NO_SUITABILITY) expect(words).toContain(line);
		// Above the list it is about: a reader meets the refusal before the set,
		// or the set has already been read as a selection made for their child.
		const firstPractice = html.indexOf('href="/child/practice/');
		expect(words.indexOf(NO_SUITABILITY[0]!)).toBeGreaterThan(-1);
		expect(html.indexOf(NO_SUITABILITY[0]!)).toBeLessThan(firstPractice);
	});

	it('says it nowhere else, because it is a claim about this list', () => {
		expect(plainText(pageAt(production, '/with/'))).not.toContain(NO_SUITABILITY[0]);
	});
});

describe('both trees carry the full route set', () => {
	it('builds every route on every path', () => {
		for (const dir of [production, beta]) {
			for (const path of AUDIENCE_PATHS) {
				for (const route of routeSet(dir, path)) {
					expect(hasPageAt(dir, route), route).toBe(true);
				}
			}
		}
	});

	it('builds the same routes on a companion path as on the direct-user tree', () => {
		// Segment for segment: the two trees differ in their first segment and
		// in nothing else. `/me/` is the discovery question and `/with/` is a
		// set, so the doors are compared as doors rather than as strings.
		const shape = (dir: string, path: AudiencePath) =>
			routeSet(dir, path)
				.map((route) => route.replace(`/${path}/`, '/*/').replace('/*/set/', '/*/'))
				.sort();

		for (const dir of [production, beta]) {
			for (const path of COMPANIONS) {
				expect(shape(dir, path), path).toEqual(shape(dir, 'me'));
			}
		}
	});

	it('shows no path a smaller catalog than another', () => {
		for (const dir of [production, beta]) {
			const whole = practicesOn(setOf(pageAt(dir, '/me/everything/')), 'me');
			expect(whole.length).toBeGreaterThan(0);
			for (const path of COMPANIONS) {
				expect(
					practicesOn(setOf(pageAt(dir, routesFor(path).everything)), path),
					path,
				).toEqual(whole);
			}
		}
	});

	it('gives every tag the same set on every path', () => {
		for (const tag of offeredTags(beta)) {
			const on = (path: AudiencePath) =>
				practicesOn(setOf(pageAt(beta, routesFor(path).forTag(tag))), path);
			for (const path of COMPANIONS) {
				expect(on(path), `${path} — ${tag}`).toEqual(on('me'));
			}
		}
	});

	it('keeps /everything/ without a tail on every path', () => {
		// The one carve-out from the shape rule, settled in #49: a screen
		// showing the whole catalog has nothing it is not showing.
		for (const path of AUDIENCE_PATHS) {
			expect(pageAt(production, routesFor(path).everything), path).not.toContain(TAIL_MARKUP);
		}
	});

	it('carries the tail on every other set screen, worded as it is elsewhere', () => {
		for (const path of COMPANIONS) {
			const routes = routesFor(path);
			for (const route of [routes.door, routes.notSure, routes.forTag('I want to be still')]) {
				const words = plainText(pageAt(production, route));
				expect(words, route).toContain(TAIL_TITLE);
				for (const line of TAIL_LEAD) expect(words, route).toContain(line);
			}
		}
	});
});

describe('the adjustments', () => {
	it('offer the same eight first-person strings, with no companion variants', () => {
		for (const path of COMPANIONS) {
			const words = plainText(pageAt(beta, routesFor(path).door));
			for (const tag of offeredTags(beta)) expect(words, `${path} — ${tag}`).toContain(tag);
		}
	});

	it('leads into them in a companion voice, without rewording them', () => {
		for (const path of COMPANIONS) {
			const words = plainText(pageAt(production, routesFor(path).door));
			for (const line of ADJUSTMENTS_LEAD) expect(words, path).toContain(line);
		}
	});

	it('links each tag to its own set, on the path the reader is on', () => {
		for (const path of COMPANIONS) {
			const html = pageAt(production, routesFor(path).door);
			for (const tag of offeredTags(production)) {
				expect(html, `${path} — ${tag}`).toContain(`href="/${path}/for/${needTagSlug(tag)}/"`);
			}
			expect(html, path).not.toContain('href="/me/for/');
		}
	});

	it('asks nothing: every adjustment is an ordinary link', () => {
		for (const path of COMPANIONS) {
			const html = pageAt(production, routesFor(path).door);
			expect(html, path).not.toContain('<button');
			expect(html, path).not.toContain('<form');
			expect(plainText(html.match(/<main>([\s\S]*)<\/main>/)![1]!), path).not.toContain('?');
		}
	});

	it('offers the low-energy variant in wording pointed at the reader', () => {
		// The need tags stay first-person on every path; this one is the page
		// talking to whoever is holding the screen, so it turns.
		const set = plainText(pageAt(production, '/with/for/be-still/'));
		expect(set).toContain(COMPANION_LOW_ENERGY_LINK);
		expect(set).not.toContain(LOW_ENERGY_LINK);
	});
});

describe('a companion practice view', () => {
	const PRACTICE = 'rest-without-a-task';

	it('reads "Offer this", and never the direct user\'s action', () => {
		for (const path of COMPANIONS) {
			const words = plainText(pageAt(production, routesFor(path).practice(PRACTICE)));
			expect(words, path).toContain(COMPANION_ACTION);
			expect(words, path).not.toContain(ACTION);
		}
		// And the direct user's is untouched.
		expect(plainText(pageAt(production, routesFor('me').practice(PRACTICE)))).toContain(ACTION);
	});

	it('names the path, and offers to change it', () => {
		const badges: Record<AudiencePath, string> = {
			me: PATH_BADGE,
			with: WITH_BADGE,
			child: CHILD_BADGE,
		};
		for (const path of AUDIENCE_PATHS) {
			const words = plainText(pageAt(production, routesFor(path).practice(PRACTICE)));
			expect(words, path).toContain(badges[path]);
			expect(words, path).toContain(CHANGE_PATH);
			for (const other of AUDIENCE_PATHS) {
				if (other !== path) expect(words, `${path} claims to be ${other}`).not.toContain(badges[other]);
			}
		}
	});

	it('renders the record itself identically on every path', () => {
		// The canonical steps and everything that says what the practice asks
		// of the person doing it. A companion path frames a practice; it does
		// not restate one.
		const body = (path: AudiencePath) =>
			pageAt(production, routesFor(path).practice(PRACTICE))
				.match(/<section[\s\S]*<\/section>/)![0]
				.replaceAll(`/${path}/`, '/*/');

		for (const path of COMPANIONS) expect(body(path), path).toBe(body('me'));
	});

	it('keeps its refusal on its own path', () => {
		for (const path of COMPANIONS) {
			const html = pageAt(production, routesFor(path).practice(PRACTICE));
			expect(html, path).toContain(`href="/${path}/everything/"`);
			expect(html, path).not.toContain('href="/me/');
		}
	});
});

describe('the doorway to the standing guide', () => {
	it('is on every companion screen', () => {
		for (const path of COMPANIONS) {
			const routes = routesFor(path);
			const screens = [
				routes.door,
				routes.notSure,
				routes.everything,
				routes.nothing,
				routes.forTag('I want to be still'),
				routes.lowEnergy('I want to be still'),
				routes.practice('rest-without-a-task'),
			];
			for (const route of screens) {
				expect(plainText(pageAt(production, route)), route).toContain(GUIDE_DOORWAY);
			}
		}
	});

	it('is never shown to the direct user', () => {
		for (const route of routeSet(production, 'me')) {
			expect(plainText(pageAt(production, route)), route).not.toContain(GUIDE_DOORWAY);
		}
	});
});

describe('a companion path only leaves itself through shared doors', () => {
	it('keeps the escapes within the path', () => {
		for (const path of COMPANIONS) {
			const routes = routesFor(path);
			for (const route of [routes.door, routes.notSure, routes.everything]) {
				const html = pageAt(production, route);
				for (const escape of escapesFor(path)) {
					expect(
						html.includes(`href="${escape.route}"`),
						`${route} → ${escape.route}`,
					).toBe(escape.route !== route);
				}
			}
		}
	});

	it('links nowhere that was not built, and nowhere on another audience path', () => {
		for (const path of COMPANIONS) {
			for (const route of routeSet(production, path)) {
				const html = pageAt(production, route);
				for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
					expect(hasPageAt(production, href), `${route} → ${href}`).toBe(true);
					const onPath = href.startsWith(`/${path}/`) || href === '/about/' || href === '/';
					expect(onPath, `${route} leaves ${path} for ${href}`).toBe(true);
				}
			}
		}
	});
});

describe('nothing is ever marked suitable for an age', () => {
	it('says nothing about ages anywhere on /child/', () => {
		const forbidden = [
			'suitable',
			'appropriate',
			'age-appropriate',
			'years old',
			'younger children can',
			'too young',
			'old enough',
			'recommended for',
			'best for',
		];
		for (const dir of [production, beta]) {
			for (const route of routeSet(dir, 'child')) {
				const words = plainText(pageAt(dir, route)).toLowerCase();
				for (const phrase of forbidden) {
					expect(words, `${route} says: ${phrase}`).not.toContain(phrase);
				}
			}
		}
	});

	it('states the refusal itself, on the screen that puts a list in front of a carer', () => {
		expect(plainText(pageAt(production, '/child/set/'))).toContain(NO_SUITABILITY[1]);
	});
});

describe('the framing a path chooses', () => {
	it('gives the companion paths their own wording and the direct user theirs', () => {
		expect(framingFor('me').companion).toBe(false);
		for (const path of COMPANIONS) {
			const framing = framingFor(path);
			expect(framing.companion, path).toBe(true);
			expect(framing.action, path).toBe(COMPANION_ACTION);
			expect(framing.setLead[0], path).toBe(COMPANION_OFFER);
			expect(framing.actionRoute('rest-without-a-task'), path).toBe(
				`/${path}/practice/rest-without-a-task/before/`,
			);
		}
		expect(framingFor('me').actionRoute('rest-without-a-task')).toBe(
			'/me/practice/rest-without-a-task/1/',
		);
	});
});
