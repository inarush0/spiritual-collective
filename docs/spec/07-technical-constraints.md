# 07 — Technical constraints

The shape and its reasoning are [ADR 0001](../adr/0001-static-zero-js-no-third-party.md): **a fully prerendered static site, zero client JavaScript, zero third-party requests, with content and approvals in git and promotion expressed as a field rather than a branch.** This document is what to build against it ([#3](https://github.com/inarush0/spiritual-collective/issues/3)).

## Stack

- **Astro**, at the repo root alongside the existing `docs/` and `CONTEXT.md`. Chosen because content collections validate frontmatter against a Zod schema at build time — the mechanical gates become build failures rather than checklist items — and because zero-JS is its default rather than something maintained against the grain.
- **Cloudflare Pages**, two projects from the same repo and the same branch, differing by one environment variable, auto-deploying on push to `main`. Safe because the gate is the record's `publication` field, not the deploy. The host's one-click rollback is the whole-site revert instrument; per-record withdrawal remains primary.
- **No CMS.** Twelve records do not justify one, and it would add a vendor to the data-flow audit for an editing UI a two-person process does not need.

## Content in git

```
content/
  practices/<slug>.md     one file per practice record
  guide.md                the guide record
```

Structured fields in frontmatter, prose in the body. **The review record is nested in the same frontmatter**, so an approval and the words it approved cannot drift apart. `approved_version` is the commit SHA of that file at approval; the gate command re-checks the file against it.

Schema is defined once as a Zod content-collection schema and is the single enforcement point for field completeness.

## One branch, two builds

Each record carries `publication`: `in-review` / `approved` / `withdrawn`.

| Build | Includes | Notes |
| --- | --- | --- |
| **beta** | everything | one quiet "beta — for review" bar; a marker on pending records |
| **production** | `publication: approved` only | no bar, no markers |

**Promotion and withdrawal are both a one-field edit plus an automatic rebuild.** Branch-based promotion was rejected: it turns per-record promotion into git surgery and makes an urgent withdrawal a merge problem.

The beta must run the *real* site with pending content included, because half the chaplain's gates are judgments about the experience rather than the text.

### Beta is unlisted, not private

- Unguessable URL
- **`noindex` HTTP header** — not merely a meta tag
- `robots.txt` disallow
- Both verified automatically

**No password.** The content is unapproved rather than confidential; the risk is a distressed user finding unreviewed spiritual-care content via search, which `noindex` addresses; and a login is a real barrier to a chaplain reviewing on a phone between shifts.

Beta carries production's data posture. **Beta is not where analytics get switched on.**

## Build behaviour

- Every route in the §1 table is prerendered. Answer options are ordinary links; the low-energy variant is its own path, not a toggle.
- **Suggestion sets are computed at build time from `need tags` on the records** — tag membership in the fixed editorial order, uncapped. The records are the only source of truth; there is no per-tag curated list to go stale.
- **The set tail** is the next three practices in the editorial order not already on screen, scanning onward from the set's last practice and wrapping.
- A **withdrawn** practice's routes still build, serving the 200 "this practice isn't available right now" page on every path. Never a 404.
- A need tag with **zero** approved practices drops out of the discovery answer options and emits a **loud build warning**. It does not fail the build.
- The **guide record**'s `publication` gates the third arrival option; when it is not published the option is absent and the build warns. No dead link.
- **A production build never fails because content was withdrawn.** Failing on a coverage hole would make an urgent removal wait on writing a replacement.

## `npm run gates`

**One command, run identically locally and in CI, blocking on `main`.** Nothing merges past a failure.

1. **Frontmatter schema** — field completeness, `provenance` and `risk class` populated, no duration other than `smallest version`, steps ≤ 5
2. **Prose checks** — reading level, one idea per sentence, second person, the banned-phrasing list, the adaptation-field sentence caps (§2, §3)
3. **Drift check** — every record with an approval re-hashed against `approved_version`
4. **Accessibility** — axe over every built page
5. **Network assertion** — no requests to any third-party origin in the built output
6. **Weight budget** — below

The **subtract-only rule** on adaptation fields is the one content rule no machine can check; it has two human owners (§2, §5).

## Weight budget — hard fail

- **No web fonts.** System font stack only.
- **No raster images.** Inline SVG only.
- **≤ 100 KB transferred per page.**
- **No client JavaScript on any page.**

Trivial to satisfy now; only ever violated by accident later. That is precisely why it is a gate rather than a guideline.

## Data posture

- **Zero third-party requests in production, and on beta**: no CDN libraries, no embeds, no web fonts, **no analytics of any kind in the first release**. This is the only posture that makes the compliance baseline's data-flow verification finishable by two people.
- **Operator independence is architectural**: own domain, operated independently, no institutional co-branding, no hospital logo, no institution-specific content, stated on the about page. Co-branding would invalidate the compliance analysis and reopen these decisions.
- **Edge access logs still exist at any host.** The posture is "we collect nothing ourselves and configure retention to the minimum available", documented in the data-flow audit rather than pretended away.

The accepted consequence: **release criteria cannot be built from usage data** (§6), and suggestion sets are identical for every visitor until the content changes. "Unranked" is a presentation claim — no numbering, no "best match" — not a per-visit shuffle. Reintroducing variation would cost client JavaScript or an edge function, i.e. it would reopen [ADR 0001](../adr/0001-static-zero-js-no-third-party.md).

## Browser and device baseline

Last two versions of the major browsers plus iOS Safari and Android Chrome two majors back. **Usable, not merely readable**, when modern CSS degrades. Checked at 320 px and 200% zoom (§4).

## Suggested build order

Not a decision — the implementer's to change. It exists so nobody starts with the hardest thing.

1. Astro project, content collection, and the Zod schema for the practice record and guide record
2. `npm run gates` with checks 1, 5, and 6 wired into CI on `main`
3. The route table as prerendered pages against placeholder content
4. Set assembly, the tail, and the low-energy fallback from record tags
5. The three audience renderings, the stepped view, and the exits
6. Withdrawal behaviour: the 200 page, the tag drop-out warning, the guide gate
7. Two Cloudflare Pages projects, the `publication` filter, and the beta `noindex` and `robots.txt` assertions
8. Gate checks 2, 3, and 4
9. Framing-surface copy and the about page, into review
