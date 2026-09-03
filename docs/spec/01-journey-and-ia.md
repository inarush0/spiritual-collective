# 01 — Journey and information architecture

Every state of the journey is a real prerendered page ([ADR 0001](../adr/0001-static-zero-js-no-third-party.md)). There is no client JavaScript, no stored state, and nothing about a visitor is recorded or carried between pages. An **audience path** is a rendering choice for the current page, expressed entirely in the URL.

## The three paths

Arrival asks **"Who are you here for?"** with three answers, each leading to a structurally different next screen rather than to different copy over the same screen ([#5](https://github.com/inarush0/spiritual-collective/issues/5)).

| Answer | Path | Next screen |
| --- | --- | --- |
| Myself | direct user | the discovery question |
| Someone I'm with | companion | a suggestion set, immediately |
| A younger child I'm caring for | companion, younger child | the **standing guide** |

- The **direct user** meets two screens before an offer: arrival, then the discovery question. This is the accepted amendment to the one-question rule ([#6](https://github.com/inarush0/spiritual-collective/issues/6), amended by [#5](https://github.com/inarush0/spiritual-collective/issues/5)); the cost falls on the direct user only.
- Companion paths are never asked a question. Need vocabulary is available to them on the set screen as adjustments.
- The third arrival option is **gated on the guide record's `publication`**. If the guide is not published, the option is absent from the arrival screen and the build emits a warning; no dead link, and the path never continues guide-less ([#14](https://github.com/inarush0/spiritual-collective/issues/14)).
- Arrival carries the same escapes as every other screen and states that nothing is saved. **"I'm not sure" at arrival resolves to the direct-user path**, not to a second question.

## Route table

Path is encoded in the URL; there is no session, cookie, or query-string state.

```
/                                   arrival — "Who are you here for?"
/me/                                the discovery question
/me/for/<need-tag-slug>/            suggestion set, direct user
/me/for/<need-tag-slug>/low/        low-energy variant of that set
/me/not-sure/                       fixed set, direct user
/me/everything/                     whole catalog, fixed editorial order
/me/nothing-right-now/              the kind screen
/me/practice/<slug>/                practice view, direct user
/me/practice/<slug>/1..n/           stepped view, one step per page

/with/                              suggestion set, companion (no question)
/with/for/<need-tag-slug>/          adjusted set, companion
/with/for/<need-tag-slug>/low/      low-energy variant
/with/not-sure/  /with/everything/  /with/nothing-right-now/
/with/practice/<slug>/              practice view, companion
/with/practice/<slug>/before/       "Before you offer this"
/with/practice/<slug>/1..n/         stepped view, companion framing

/child/                             the standing guide
/child/set/                         suggestion set, younger child
/child/for/<need-tag-slug>/  /child/for/<need-tag-slug>/low/
/child/not-sure/  /child/everything/  /child/nothing-right-now/
/child/practice/<slug>/  /child/practice/<slug>/before/  /child/practice/<slug>/1..n/

/about/                             the about page
```

Rules on the table:

- **Every practice is reachable on every published path**, so a chaplain can link one directly and a companion never sees a silently smaller catalog.
- `/with/` and `/child/` share set membership (below) but differ in framing and in which **adaptation fields** they surface.
- A withdrawn practice's URLs serve a **200 page** saying the practice isn't available right now, on every path. Never a 404: someone following a chaplain's link should meet a sentence and a way onward ([#3](https://github.com/inarush0/spiritual-collective/issues/3)).
- The route table is the complete enumeration. Adding a state means adding a page.

## The discovery question

**"What might support you right now?"**, direct-user path only, with the orientation line as a subhead: someone shared this page with you, there is no right answer, nothing you pick is saved. No landing page, no "begin" button, no second question ([#6](https://github.com/inarush0/spiritual-collective/issues/6)).

The eight **need tags** are the answer options, verbatim, one string each — there is no separate label layer ([#12](https://github.com/inarush0/spiritual-collective/issues/12)). Options are ordinary links. A need tag is offered whenever **at least one** approved practice carries it, and drops out only at zero.

## Suggestion sets

A **suggestion set** is every approved practice carrying that need tag, in the fixed editorial order (§2), **uncapped**. No curation layer, no per-tag hand-picked list, no algorithm. Current membership yields sets of three and four.

Every set screen, at every size, contains:

1. A lead-in framing the set as a starting point, not a result about the person. Direct user: "a few things people reach for". Companion: "a few things you could offer".
2. The set, **unranked** — no numbering, no ordering language, no "best match". Fixed at build time; identical for every visitor.
3. A quiet divider, then the **set tail**: the next three practices in the editorial order not already on screen, scanning onward from the set's last practice and **wrapping**. Labelled explicitly as not matching what was chosen ([#12](https://github.com/inarush0/spiritual-collective/issues/12)).
4. A link to the **low-energy variant**, present on every set screen whether or not the chosen tag has any low-energy practices behind it.
5. The three escapes: "I'm not sure", "Show me everything", "Nothing right now".

**The layout never changes with how well-stocked a tag is.** This is the mechanism that stops a one-practice screen reading as a verdict, and it replaces the abandoned floor of three practices per tag ([#3](https://github.com/inarush0/spiritual-collective/issues/3)).

### The doors that skip the question

| Route | Set |
| --- | --- |
| `/me/not-sure/` | noticing what's around you · rest without a task · letting someone sit with you |
| `/with/` and `/child/set/` | letting someone sit with you · saying the hard thing · remembering someone |
| `/*/everything/` | the whole catalog in the fixed editorial order |

Each fixed set is shaped like any other set, tail included. The younger-child path **reuses the companion set unchanged**: a set hand-picked for a young child would be an age-suitability judgement expressed as page order, and this path states twice that it makes no such judgement ([#12](https://github.com/inarush0/spiritual-collective/issues/12)).

### The low-energy variant

`/<path>/for/<tag>/low/` holds the practices carrying that tag whose `low energy` field is true. Where that filter is empty, the page falls back to the low-energy practices from outside the tag, framed as the tail is framed — these aren't from what you chose. **The link is never hidden**, because showing it only where non-empty leaks a verdict about the answer the reader picked.

### Adjustments, not questions

Further narrowing is offered on the set screen as adjustments — the eight need-tag strings, and the low-energy link — never as an additional step. Companion set screens use **the same eight first-person strings** under a companion-framed lead-in; there are no companion-worded variants ([#12](https://github.com/inarush0/spiritual-collective/issues/12)).

## The practice view

Same shape in every case, in this order: **what this involves → ways to change it → stop guidance → the action**, with a visible refusal alongside it. The whole record is readable in full before anything starts, and nothing starts on its own.

- Direct user action: **"I'll try this."** Companion paths: **"Offer this."**
- **Provenance** appears as a short plain-language origin line. It never names the **seed material**'s author and never implies a tradition endorses this version ([#8](https://github.com/inarush0/spiritual-collective/issues/8)).
- Near the stop control, once: a quiet line that this is something to try rather than treatment, and that stopping is always fine. The **crisis pointer** sits with it but visually distinct. Neither appears on suggestion sets (§3).
- A badge names the current path, and **"Change who this is for"** returns to arrival.
- Companion paths carry a quiet doorway back to the **standing guide**.
- Copy shifts with the path; the **canonical steps do not**.

## The stepped view

User-advanced, one step per page, **no timer and no audio** ([#7](https://github.com/inarush0/spiritual-collective/issues/7)). Nothing advances automatically. Every step screen carries a stop control and "Change this".

**One canonical sequence and order serves all three paths** ([#16](https://github.com/inarush0/spiritual-collective/issues/16)). On companion paths the wrapper addresses the companion while each canonical step remains visibly addressed to the person doing the practice. The wrapper may explain how to offer a step; it never rewrites, adds to, or reorders the instruction.

- **"Before you offer this"** precedes step one on companion paths: `companion note` and `companion cautions`, plus `child keep` and `child change` on `/child/`.
- **"Being alongside"** keeps the note and cautions reachable during the steps. **"Change this"** keeps the applicable keep/change guidance reachable. Cautions are not repeated in full on every screen and are not mapped to individual steps.
- **Progression belongs to the person doing the practice**, not the companion holding the screen. The guidance says: offer one step and leave it there; advance only when they ask or clearly choose to continue; no response, sleep, turning away, or uncertainty means leave the practice there rather than prompt for an answer.
- Companion stop control reads **"Leave this here"** rather than "Stop" — it ends the guidance the resource is offering, not another person's private activity. Direct users keep **"Stop"**.
- **"Let them continue on their own"** is available before and during the steps on `/with/` only. It opens the direct-user rendering of the same practice **at the same step**, without restarting. Absent from `/child/`, which promises no independent use by age.

## Exits

Stopping and reaching the final step lead to **the same** quiet, path-specific exit. No completion claim, no reflection or rating question, no praise. It offers:

- **Choose something else** → the same audience path's suggestion set
- **Change who this is for** → arrival
- **Nothing right now** → the kind screen, a real, neutral resting state

On companion paths the exit quietly repeats that the companion does not need to ask whether the practice helped. Because every path has this unconditional exit, the younger-child path needs no special stop control.

## The standing guide

The first screen of `/child/`, met before the catalog, addressed to a companion rather than to the person doing a practice ([#5](https://github.com/inarush0/spiritual-collective/issues/5)). It holds:

- **How to offer a practice**: one thing, not a list; say it's optional once; "no", silence, and sleep are complete answers; don't ask afterwards whether it helped.
- **How to adapt one**: keep the heart, change the size, the words, and the hands; play and repetition are the child's version; follow the care team on touch, materials, and anything leaving the room.
- **A section saying the catalog is also for the caregiver as themselves.**
- **The no-suitability statement**: this resource has never met your child; it does not say which practice suits which age; that judgement is yours, with their care team.

Reachable again from a quiet doorway on every companion-path screen. Never shown to the direct user. Governed as a **guide record** (§2, §5).

**The no-suitability claim is stated twice, in the two places it binds**: here, and over the younger-child suggestion set ("these are the same practices everyone else sees, with notes on adapting them — we can't say which suits a particular child"). Nothing in the catalog is age-graded and no practice is ever marked suitable for an age.

## Persistent chrome

**One link, on every screen: "What is this?"**, to the **about page**. That is the only persistent chrome ([#8](https://github.com/inarush0/spiritual-collective/issues/8)). In particular the crisis pointer is **not** in the footer: on every screen it would frame the whole resource as an emergency.

## The about page

One **path-neutral** page — the same facts for every reader — reachable from every screen and never met before arrival. One or two screens; each section a short paragraph, not a heading with prose beneath it. In this order ([#8](https://github.com/inarush0/spiritual-collective/issues/8)):

1. **Purpose and audience** — two sentences: what is this, and is it for me.
2. **Limits** — the fuller statement: not assessment, treatment, counselling, or a crisis service.
3. **Who made it and how it is reviewed** — made independently; not affiliated with any hospital, religious body, or company; nothing is being sold. "Nothing is published here until a chaplain has read it" — a hospital chaplain working in pediatric palliative care. The **role, never the name**, and never the institution. No "chaplain-approved" badge. Inside this paragraph, one sentence: this has not been tried with patients or families ([#4](https://github.com/inarush0/spiritual-collective/issues/4)).
4. **The stance on belief**, said once, here: this does not ask you to believe anything, does not belong to a tradition, and will not try to move you toward or away from one.
5. **Data** — four sentences, not a policy document: no account, no analytics, nothing sent anywhere, nothing stored about you. Plus the disclosure that choosing to email voluntarily shares the sender address and message with the mailbox providers ([#15](https://github.com/inarush0/spiritual-collective/issues/15)).
6. **Contact** — the **accountability channel** (§5).

Also on this page: free, no account, nothing to buy, **present tense only** — no promise the resource will stay up or stay free. **No user-facing dates anywhere on the site**, per practice or site-level; the about page states the rule instead — nothing is published unreviewed, and any substantive change returns a record to review.
