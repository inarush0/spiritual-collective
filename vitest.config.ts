import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		include: ['test/**/*.test.ts'],
		// The build test shells out to `astro build` twice.
		testTimeout: 120_000,
	},
});
