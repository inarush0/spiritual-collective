# 02 — Content standard

Two governed record kinds: the **practice record** and the **guide record**. Both live as files in git, one file per record, structured fields in frontmatter and prose in the body ([ADR 0001](../adr/0001-static-zero-js-no-third-party.md)). Both are validated mechanically at build time; no field may be empty as a condition of publication.

This document specifies the **shape**. The words are the **editor**'s to write and the **chaplain reviewer**'s to approve.

## The practice record

`content/practices/<slug>.md`

| Field | Shape | Notes |
| --- | --- | --- |
| `name` | one line | never tradition-named in this release |
| `invitation` | one line | |
| `what this involves` | ≤ 5 steps | the **canonical sequence**, identical on all three audience paths |
| `ways to change it` | prose | |
| `stop guidance` | prose | |
| `smallest version` | prose | the **only** field that may carry anything resembling a duration |
| `belief requirement` | `none` / `you supply it` / `named tradition` | |
| `risk class` | see §3 | |
| `provenance` | `tradition-owned` / `clinical` / `site editorial`, plus the reader-facing origin line | |
| `pathway tags` | list | record metadata, **not user-facing in this release** |
| `need tags` | list, from the eight below | |
| `low energy` | boolean | asked once per practice, not per step; backs `/for/<tag>/low/` |
| `companion note` | ≤ 2 sentences | how to be alongside someone doing this one |
| `companion cautions` | ≤ 2 sentences | what not to do while alongside them |
| `child keep` | 1 sentence | what survives the adaptation |
| `child change` | 1 sentence | what gives way |
| `publication` | `in-review` / `approved` / `withdrawn` | the promotion state (§5) |
| `review record` | nested | role, date, `approved_version` (§5) |

**No duration or time estimate other than `smallest version`.** Duration targets create completion pressure.

### The adaptation fields

`companion note`, `companion cautions`, `child keep`, `child change` are the **adaptation fields**, and `low energy` sits with them ([#14](https://github.com/inarush0/spiritual-collective/issues/14)).

- **All are required.** Where a practice has nothing distinct to say, the field says so in plain words ("Nothing different here — just be nearby"). A required field forces that sentence to be written and reviewed rather than defaulted into existence. Publishing without them and dropping the practice from companion paths was rejected: an absence from the younger-child set makes an age-suitability claim by omission.
- **Both pairs stay split.** `companion cautions` is closer to `stop guidance` than to an invitation, and negative guidance is what goes unwritten when it shares a field. `child keep` / `child change` are separate so the no-empty-field rule enforces both halves — one field would let a record satisfy the rule with only a change line, which reads as a correction rather than an adaptation.
- **`low energy` is a boolean, not prose.** Prose belongs in `smallest version` and `ways to change it`; a second prose field with an overlapping job would drift.

**The subtract-only rule.** An adaptation may only subtract from or soften what `what this involves` already asks, and may **never** add an instruction the practice does not contain. A keep/change line needing a new bodily, sensory, or touch-involving instruction is a different practice, not an adaptation. This is what keeps `risk class` a property of the practice rather than of its notes. No machine can check it; it has two human owners — a line in the plain-language checklist below, and a clause inside what the chaplain's attestation means.

## The plain-language checklist

A checklist, not a principle — vague standards cannot fail a review ([#7](https://github.com/inarush0/spiritual-collective/issues/7)). Applies to every prose field, including all four prose adaptation fields; a tired parent at 3am is not an easier reader than an adolescent.

- Roughly 6th-grade reading level
- One idea per sentence
- ≤ 5 steps in `what this involves`
- No undefined clinical or liturgical jargon
- Second person
- The whole practice view readable in under a minute
- Sentence caps: 2 each for `companion note` and `companion cautions`, 1 each for `child keep` and `child change`
- The banned-phrasing list (§3)
- **The subtract-only rule** — the one line that is not about language

Everything above except the subtract-only rule is machine-checked (§7).

## The catalog

Twelve slots, composed by **coverage guarantee, not pathway quota** ([#7](https://github.com/inarush0/spiritual-collective/issues/7)):

1. Noticing what's around you — senses, eyes open, external focus
2. Rest, without a task
3. Words from your own tradition — the user supplies the prayer, text, or phrase
4. Asking for a chaplain, or your own faith leader
5. Letting someone sit with you — receiving care
6. Saying the hard thing — naming anger, fear, doubt, grief, unsoftened
7. Remembering someone, or something
8. Making something small — art, craft, low-material
9. Music that matches how you feel, not music to fix how you feel
10. A message for someone — written, dictated, or recorded
11. A small kindness from where you are — tiny, remote, or symbolic
12. Gentle movement, or stillness in your body — seated, lying, or imagined

The guarantees that composition satisfies, which any substitution must preserve:

- **Nine require no belief in anything sacred.**
- **2, 5, 7, 9 work lying down with eyes closed at near-zero energy** (their `low energy` is true).
- **6 holds grief and anger without redirecting toward calm.**
- **4 and 5 are receiving rather than doing.**
- **Only 12 falls in the clinical-review risk class.**

Practices 4 and 5 are **real catalog entries, not page chrome** — chrome is skippable, and these must be findable as legitimate options.

Practice 12 ships only if a clinician attestation exists against the shipping version; otherwise it is a **held record** and eleven ship (§5, §6).

## Need tags

Eight. They are the answer options verbatim, so they share one "want" grammar ([#12](https://github.com/inarush0/spiritual-collective/issues/12)).

| Need tag | Practices |
| --- | --- |
| I want as little as possible asked of me | 2, 5, 9 |
| I want some company | 4, 5, 9, 10 |
| I want room for anger, grief, or doubt | 6, 7, 9 |
| I want to remember someone | 7, 8, 10 |
| I want to make or do something | 8, 10, 11 |
| I want to be still | 1, 2, 12 |
| I want my faith or my tradition | 3, 4, 11 |
| I want to do something for someone | 8, 10, 11 |

Membership lives on the records; this table is the expected result, not a second source of truth.

- The overlap between *make or do something*, *do something for someone*, and *remember someone* is deliberate: three doors onto practices 8 and 10 is a feature for a reader who can't name what they want.
- *I want my faith or my tradition* is the thinnest tag, resting on 3, 4, and a stretch to 11. That thinness is honest rather than padded.

## The fixed editorial order

One total order over the twelve, lowest-demand first. Used by `/everything/`, by every set, and by the **set tail** ([#12](https://github.com/inarush0/spiritual-collective/issues/12)):

**noticing what's around you · rest without a task · music that matches how you feel · letting someone sit with you · gentle movement or stillness · remembering someone · words from your own tradition · saying the hard thing · asking for a chaplain · making something small · a message for someone · a small kindness**

Receiving comes before doing; the two practices requiring another human to act (asking for a chaplain, a message for someone) sit late because they are the largest ask.

## The guide record

`content/guide.md`. Its own governed kind — not a practice record and not a **framing surface** ([#14](https://github.com/inarush0/spiritual-collective/issues/14)).

Fields: `name`, `body`, `publication`, `review record` (with `approved_version` and chaplain attestation). **No** `risk class`, `need tags`, `smallest version`, or any practice facet: it is never offered as a practice and never appears in a set, in `/everything/`, or in the catalog.

Its contents are specified in §1. Its `publication` gates the third arrival option.

## Pathways

**Record metadata only, not user-facing in this release.** With no tradition-named content, Devotional holds two entries, and four thinly-populated labels would be scaffolding the reader has to interpret. The **pathway** definition in `CONTEXT.md` holds; its scope is narrowed to editorial navigation ([#7](https://github.com/inarush0/spiritual-collective/issues/7), [#11](https://github.com/inarush0/spiritual-collective/issues/11)).

## The "considered, not in the first release" register

`docs/considered-not-shipped.md` — **in the repo, not on the site**. Everything cut from the **seed material** or from the catalog gets a line with a reason code:

`needs a tradition reviewer` · `needs clinical review` · `excluded by the guardrails` · `deferred for scope`

Practice 12 carries a line either way, marked **held, not cut**, reason code *needs clinical review*.

## Example record

Field shapes only. **Example, not for publication** — no chaplain, tradition, or clinical review stands behind these words.

```markdown
---
name: Rest, without a task
invitation: You don't have to do anything with this time.
what_this_involves:
  - Put the phone down somewhere you can still reach it.
  - Let your eyes close, or let them rest on one thing.
  - Stay there. Nothing has to happen.
ways_to_change_it: >
  Eyes open is fine. Lying down is fine. If someone is in the room,
  you don't have to explain what you're doing.
stop_guidance: >
  Stop whenever you want. You don't need a reason, and you don't need
  to finish. If resting makes things feel worse, come back out.
smallest_version: One breath where nothing is asked of you.
belief_requirement: none
risk_class: low
provenance:
  kind: site editorial
  origin_line: >
    Versions of this are practised in many traditions and by people
    with none.
pathway_tags: [contemplative]
need_tags:
  - I want as little as possible asked of me
  - I want to be still
low_energy: true
companion_note: >
  Sit where they can see you without turning. You don't need to say
  anything.
companion_cautions: >
  Don't fill the silence, and don't ask afterwards whether it helped.
child_keep: Being near someone who isn't asking them for anything.
child_change: Make it much shorter, and let them keep moving if they want.
publication: in-review
review_record:
  approved_version: null
  chaplain_attested: null
  clinician_attested: not-required
---

(prose body, if the record kind uses one)
```
