# content

Practice records and the guide record, in git, one file per record. Structured
fields in frontmatter, prose in the body. See
[`docs/spec/02-content-standard.md`](../docs/spec/02-content-standard.md) for
the field set and [ADR 0001](../docs/adr/0001-static-zero-js-no-third-party.md)
for why they live here rather than in a CMS.

```
practices/<slug>.md   one file per practice record
guide.md              the guide record
```

The filename slug of a practice must name a slot in the fixed editorial order
(`src/catalog/editorial-order.ts`). A record the order does not name fails the
build, because it would have no defined position on any page that lists it.

The schema in `src/catalog/practice-record.ts` is the single enforcement point
for field completeness. **Every field is required** — where a practice has
nothing distinct to say, the field says so in plain words. A record missing any
field fails the build.

## The guide record

`guide.md` is the **guide record**: its own governed kind, holding the standing
guide that `/child/` renders. Its schema is `src/guide/guide-record.ts`, and it
carries **no practice facets** — no `risk class`, no `need tags`, no `smallest
version`. Its frontmatter is `name`, `publication`, and a review record; its
body is the four parts §1 lists, each under its own heading, and a published
guide missing one of them fails the build.

Its `publication` gates the third arrival option. An unpublished guide means the
younger-child path is not offered at all, and the build says so loudly rather
than linking somewhere there is nothing to read.

## Everything here is placeholder

Every record currently in this directory is marked **example, not for
publication** in its body. No chaplain, tradition, or clinical review stands
behind any of these words.

Some of them nonetheless carry `publication: approved`, because the production
build's filter has to be exercised by something. Their review records are field
shapes rather than approvals, and the schema requires an approved record's
review record to be internally consistent, so those fields are filled in. The
tells that they are fiction: `approved_version` is a zero SHA, `reply_kept`
says no reply exists, and the body says so in full. **Every one of these
records is replaced before anything ships.**

The guide record's body is rendered on `/child/` as it is written, so its
placeholder line is on the page rather than only in the file. That is the
honest rendering: a reader of a build carrying this record is reading
unreviewed words about offering something to a dying child, and the page says
so.

Practice copy from the `prototype/*` branches is placeholder drafting too, and
is not to be lifted in.
