# spiritual-collective

A shareable spiritual-care resource for pediatric hospice and palliative-care
settings. It supports personal exploration without replacing professional
spiritual, medical, mental-health, or emergency care.

- [`CONTEXT.md`](./CONTEXT.md) — the glossary. Authoritative for vocabulary.
- [`docs/spec/`](./docs/spec/) — the first-release specification. Authoritative
  for what to build. Start at [`docs/spec/README.md`](./docs/spec/README.md).
- [`docs/adr/`](./docs/adr/) — the two hard-to-reverse decisions.

## Running it

```sh
npm install
npm run dev      # beta: every record, including pending ones
npm run build    # production: approved records only
npm test         # unit tests, the records on disk, and both builds
```

## One branch, two builds

`SITE_BUILD` selects the release, and it is the only difference between them.
Both Cloudflare Pages projects deploy the same commit; the gate is each
record's `publication` field, never the deploy.

| `SITE_BUILD` | Release | Includes |
| --- | --- | --- |
| unset | production | `publication: approved` only |
| `production` | production | `publication: approved` only |
| `beta` | beta | everything, with a review bar and pending markers |

Unset means production on purpose: the accident worth defending against is a
build meant for production going out with unapproved content in it, so the
permissive release is the one you have to ask for.

## Layout

```
content/practices/     practice records, one file per record
src/catalog/           the schema, the fixed editorial order, and the build filter
src/pages/             one prerendered page per route in the spec's route table
test/                  unit tests plus a build test over the real output
```

The site is fully prerendered, ships no client JavaScript, and makes no request
to any third-party origin ([ADR 0001](./docs/adr/0001-static-zero-js-no-third-party.md)).
`test/build.test.ts` asserts all three against the built output.
