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
npm run gates    # the gates; run this before you push
npm test         # unit tests, the records on disk, and both builds
```

## `npm run gates`

One command, run identically locally and in CI, blocking on `main`. It exits
non-zero on any failure and prints every problem it found, not just the first.

| Check | What it fails on |
| --- | --- |
| Frontmatter schema | an incomplete record, an unpopulated `provenance` or `risk_class`, a sixth step, or any field the content standard does not name — a `duration` among them |
| Network assertion | any absolute URL in the built output: a CDN, an embed, a web font, analytics of any kind |
| Weight budget | a web font, a raster image, over 100 KB transferred by one page, or any client JavaScript |

Both releases are gated, not just production: beta carries production's data
posture. The prose checks, the drift check, and axe are still to come; see
[`src/gates/README.md`](./src/gates/README.md).

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
src/framing/           framing-surface wording: the limits line, the crisis pointer
src/gates/             the checks behind `npm run gates`
src/pages/             one prerendered page per route in the spec's route table
scripts/gates.ts       the gate command itself
test/                  unit tests plus a build test over the real output
```

The site is fully prerendered, ships no client JavaScript, and makes no request
to any third-party origin ([ADR 0001](./docs/adr/0001-static-zero-js-no-third-party.md)).
`npm run gates` asserts all three against the built output, on both releases.
