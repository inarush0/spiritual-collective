import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		include: ['test/**/*.test.ts'],
		// The build test shells out to `astro build` twice, and the gate test
		// runs `npm run gates`, which builds both releases.
		testTimeout: 120_000,
		// Those two suites put a deliberately broken record into `content/` to
		// prove the schema is wired to the build and to the gate. They are
		// editing the real tree, so they may not run alongside anything that
		// reads it — or alongside each other's builds.
		fileParallelism: false,
	},
});
