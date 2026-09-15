import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { COMPANION_ACTION, CHILD_BADGE, WITH_BADGE } from '../src/framing/companion.js';
import { COMPANION_EXIT_LINE, EXIT_LINES } from '../src/framing/exits.js';
import { PATH_BADGE } from '../src/framing/practice-view.js';
import { routesFor, type AudiencePath } from '../src/framing/routes.js';
import {
	BEFORE_TITLE,
	BEING_ALONGSIDE,
	CHANGE_THIS,
	COMPANION_PROGRESS,
	CONTINUE_ALONE,
	LEAVE_HERE,
	PERSON_STEP_LEAD,
	STOP,
} from '../src/framing/stepped-view.js';
import { buildBothReleases, hasPageAt, pageAt, plainText } from './support/build.js';

const SLUG = 'noticing-whats-around-you';
const STEPS = [
	'Let your eyes land on one thing in the room.',
	'Notice its colour, and whether it is bright or dull.',
	'Move to the next thing your eyes find.',
	'Stay with whatever holds you.',
];
const NOTE = 'Let them lead where they look. You can look at the same things without naming them.';
const CAUTIONS =
	'Do not quiz them about what they see. Do not point out things you think they should notice.';
const CHILD_KEEP = 'Looking at one thing together, with nobody asking for an answer.';
const CHILD_CHANGE = 'Let them point, touch, and talk instead of staying quiet.';

let production: string;
let beta: string;
let cleanUp: () => void;

beforeAll(() => {
	({ builds: { production, beta }, cleanUp } = buildBothReleases());
});

afterAll(() => cleanUp?.());

function practice(path: AudiencePath): string {
	return routesFor(path).practice(SLUG);
}

function words(path: AudiencePath, suffix: string, dir = production): string {
	return plainText(pageAt(dir, `${practice(path)}${suffix}`));
}

describe('before a companion offers the first step', () => {
	it('links the practice action to a real before-screen on both companion paths', () => {
		for (const path of ['with', 'child'] as const) {
			const route = `${practice(path)}before/`;
			const view = pageAt(production, practice(path));
			expect(plainText(view), path).toContain(COMPANION_ACTION);
			expect(view, path).toContain(`href="${route}"`);
			expect(hasPageAt(production, route), route).toBe(true);
		}
	});

	it('presents the companion note and cautions before step one', () => {
		for (const path of ['with', 'child'] as const) {
			const before = words(path, 'before/');
			expect(before, path).toContain(BEFORE_TITLE);
			expect(before, path).toContain(BEING_ALONGSIDE);
			expect(before, path).toContain(NOTE);
			expect(before, path).toContain(CAUTIONS);
			expect(before.indexOf(CAUTIONS), path).toBeLessThan(before.indexOf('Offer the first step.'));
		}
	});

	it('adds child keep and child change only on the younger-child path', () => {
		const child = words('child', 'before/');
		expect(child).toContain(CHILD_KEEP);
		expect(child).toContain(CHILD_CHANGE);
		const withSomeone = words('with', 'before/');
		expect(withSomeone).not.toContain(CHILD_KEEP);
		expect(withSomeone).not.toContain(CHILD_CHANGE);
	});

	it('puts progression in the hands of the person doing the practice', () => {
		for (const path of ['with', 'child'] as const) {
			const before = words(path, 'before/');
			for (const line of COMPANION_PROGRESS) expect(before, path).toContain(line);
		}
	});
});

describe('one canonical sequence with a companion wrapper', () => {
	it('builds the same steps in the same order on every path', () => {
		for (const path of ['me', 'with', 'child'] as const) {
			for (let number = 1; number <= STEPS.length; number += 1) {
				const screen = words(path, `${number}/`);
				expect(screen, `${path} step ${number}`).toContain(STEPS[number - 1]);
				for (const [index, other] of STEPS.entries()) {
					if (index !== number - 1) expect(screen, `${path} step ${number}`).not.toContain(other);
				}
			}
		}
	});

	it('makes clear that each companion-path step addresses the person doing it', () => {
		for (const path of ['with', 'child'] as const) {
			expect(words(path, '2/'), path).toContain(PERSON_STEP_LEAD);
		}
		expect(words('me', '2/')).not.toContain(PERSON_STEP_LEAD);
	});

	it('keeps being-alongside guidance reachable without repeating cautions', () => {
		for (const path of ['with', 'child'] as const) {
			for (let number = 1; number <= STEPS.length; number += 1) {
				const html = pageAt(production, `${practice(path)}${number}/`);
				expect(plainText(html), `${path} step ${number}`).toContain(BEING_ALONGSIDE);
				expect(html, `${path} step ${number}`).toContain(
					`href="${practice(path)}before/#being-alongside"`,
				);
				expect(plainText(html), `${path} step ${number}`).not.toContain(CAUTIONS);
			}
		}
	});

	it('keeps applicable change guidance reachable on every step', () => {
		for (const path of ['with', 'child'] as const) {
			for (let number = 1; number <= STEPS.length; number += 1) {
				expect(words(path, `${number}/`), `${path} step ${number}`).toContain(CHANGE_THIS);
			}
		}
		const child = words('child', '3/');
		expect(child).toContain(CHILD_KEEP);
		expect(child).toContain(CHILD_CHANGE);
		expect(words('with', '3/')).not.toContain(CHILD_KEEP);
	});

	it('uses path-specific badges and stop controls', () => {
		const badges = { me: PATH_BADGE, with: WITH_BADGE, child: CHILD_BADGE } as const;
		for (const path of ['me', 'with', 'child'] as const) {
			const screen = words(path, '1/');
			expect(screen, path).toContain(badges[path]);
			expect(screen, path).toContain(path === 'me' ? STOP : LEAVE_HERE);
			if (path !== 'me') expect(screen, path).not.toContain(STOP);
		}
	});
});

describe('handoff to the direct-user rendering', () => {
	it('is available before and during /with/ at the same step', () => {
		expect(pageAt(production, `${practice('with')}before/`)).toContain(
			`href="${practice('me')}1/"`,
		);
		for (let number = 1; number <= STEPS.length; number += 1) {
			const html = pageAt(production, `${practice('with')}${number}/`);
			expect(plainText(html), `step ${number}`).toContain(CONTINUE_ALONE);
			expect(html, `step ${number}`).toContain(`href="${practice('me')}${number}/"`);
		}
	});

	it('is absent everywhere on /child/', () => {
		for (const suffix of ['before/', ...STEPS.map((_, index) => `${index + 1}/`)]) {
			expect(words('child', suffix), suffix).not.toContain(CONTINUE_ALONE);
		}
	});
});

describe('companion exits', () => {
	it('uses the same unconditional exit for stopping and the final step', () => {
		for (const path of ['with', 'child'] as const) {
			const exit = routesFor(path).exit;
			expect(hasPageAt(production, exit), exit).toBe(true);
			expect(pageAt(production, `${practice(path)}1/`), path).toContain(`href="${exit}"`);
			expect(pageAt(production, `${practice(path)}${STEPS.length}/`), path).toContain(
				`href="${exit}"`,
			);
			const after = plainText(pageAt(production, exit));
			for (const line of EXIT_LINES) expect(after, path).toContain(line);
			expect(after, path).toContain(COMPANION_EXIT_LINE);
		}
	});

	it('keeps the companion reassurance off the direct-user exit', () => {
		expect(plainText(pageAt(production, routesFor('me').exit))).not.toContain(COMPANION_EXIT_LINE);
	});

	it('also builds pending companion practice routes in beta only', () => {
		const pending = '/with/practice/saying-the-hard-thing/';
		expect(hasPageAt(beta, `${pending}before/`)).toBe(true);
		expect(hasPageAt(beta, `${pending}1/`)).toBe(true);
		expect(hasPageAt(production, `${pending}before/`)).toBe(false);
	});
});
