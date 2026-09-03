# src/gates

`npm run gates` — one command, run identically locally and in CI, blocking on
`main`. Nothing merges past a failure
([`docs/spec/07-technical-constraints.md`](../../docs/spec/07-technical-constraints.md)).

Three of the six checks the spec lists are here:

| # | Check | Module |
| --- | --- | --- |
| 1 | Frontmatter schema | `frontmatter-gate.ts` |
| 5 | Network assertion | `network-gate.ts` |
| 6 | Weight budget | `weight-gate.ts` |

Prose checks, the drift check, and axe are a later ticket. They slot in beside
these: a check is a function from something already read — the records, or the
built pages — to a list of `GateFailure`. Nothing in a check opens a file,
builds, prints, or exits, so every rule can be exercised in milliseconds
against a fixture. `run.ts` does the reading and the building; `scripts/gates.ts`
does the printing and the exit code.

Each gate names the spec rule it enforces in its own doc comment, so a rule
that changes has one place to change.

## These files import each other with `.ts` extensions

The rest of `src/` uses `.js` specifiers, which is what Astro and Vite want.
`npm run gates` is run by node directly, with no bundler in front of it, and
node's type stripping resolves the specifier as written — `./failure.js` is a
file that does not exist. `allowImportingTsExtensions` is already on in
`tsconfig.json`, so both spellings typecheck.
