import { describe, expect, it } from 'vitest';
import {
	RELEASE_ENV_VAR,
	pendingIn,
	publishedIn,
	resolveRelease,
} from '../src/catalog/release.js';

describe('resolveRelease', () => {
	it('reads the release from one environment variable', () => {
		expect(resolveRelease({ [RELEASE_ENV_VAR]: 'beta' })).toBe('beta');
		expect(resolveRelease({ [RELEASE_ENV_VAR]: 'production' })).toBe('production');
	});

	it('defaults to production, so an unconfigured build never ships unapproved content', () => {
		expect(resolveRelease({})).toBe('production');
		expect(resolveRelease({ [RELEASE_ENV_VAR]: '' })).toBe('production');
	});

	it('fails loudly on a value it does not recognise rather than guessing', () => {
		expect(() => resolveRelease({ [RELEASE_ENV_VAR]: 'staging' })).toThrow(/staging/);
	});
});

describe('publishedIn', () => {
	it('adds pending records on beta, so review meets them as a reader would', () => {
		expect(publishedIn('beta', 'in-review')).toBe(true);
		expect(publishedIn('beta', 'approved')).toBe(true);
	});

	it('offers only approved records in production', () => {
		expect(publishedIn('production', 'approved')).toBe(true);
		expect(publishedIn('production', 'in-review')).toBe(false);
	});

	it('offers a withdrawn record on neither build', () => {
		expect(publishedIn('production', 'withdrawn')).toBe(false);
		expect(publishedIn('beta', 'withdrawn')).toBe(false);
	});
});

describe('pendingIn', () => {
	it('marks an unapproved record on beta', () => {
		expect(pendingIn('beta', 'in-review')).toBe(true);
	});

	it('marks nothing in production, which is not a review surface', () => {
		expect(pendingIn('production', 'in-review')).toBe(false);
		expect(pendingIn('production', 'approved')).toBe(false);
	});

	it('does not mark an approved record on beta', () => {
		expect(pendingIn('beta', 'approved')).toBe(false);
	});
});
