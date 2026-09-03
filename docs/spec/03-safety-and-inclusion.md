# 03 — Safety and inclusion

Safety is a product principle, not a disclaimer. The resource is an optional aid for spiritual exploration and is **never** an assessment, treatment, counselling service, or crisis service ([#2](https://github.com/inarush0/spiritual-collective/issues/2)).

## Standing rules

Every practice must be **previewable, adaptable, skippable, and stoppable**. Adolescent agency is preserved throughout: nothing starts on its own, nothing advances on a timer, refusal is visible on every screen, and no screen asks the reader to account for a choice.

Prohibited everywhere on the site:

- Proselytizing, or any movement toward or away from a tradition
- Spiritual or medical outcome claims
- Forced positivity, or treating calm as the correct outcome
- Sensitive-data collection of any kind
- Any claim about the person derived from what they picked
- Any claim that a practice suits a particular age or developmental level

Distress routes to **the people already caring for them** — caregiver, chaplain, care team — with 988 and 911 named for US crisis and emergency needs (below).

## Risk classes

`risk class` is a required field on every practice record ([#2](https://github.com/inarush0/spiritual-collective/issues/2)).

| Class | Meaning | Gates |
| --- | --- | --- |
| **low** | no bodily, sensory, or exposure component | spiritual-care, trauma, accessibility, and editorial review — a low class is not a waiver |
| **clinical** | involves breathing cadence, body focus, movement, touch, food, scent, flame, or other exposure | clinical review **and** a nonphysical alternative |
| **excluded** | see below | never ships |

**Practice 12 is the only clinical-class record in this release.** The subtract-only rule on adaptation fields (§2) is what keeps that true: an adaptation cannot push a low-risk practice into the clinical class.

## Excluded from the first release

Not oversights. Each is written into the register (§2) with its reason code.

- Coercive practices
- Medical or spiritual diagnosis
- Breath holding or hyperventilation
- Equipment changes
- Ingesting substances
- Unsupervised flame
- Crisis assessment
- Outcome guarantees
- **Formal breath-cadence and meditation practices** — breath-cadence work needs clinical review plus a nonphysical alternative, and meditation has reported adverse effects that remain understudied, in a population already carrying trauma and unwanted memories. Practice 1 is the eyes-open, externally-focused substitute; practice 12 covers stillness in the body without instructing breath ([#7](https://github.com/inarush0/spiritual-collective/issues/7)).
- **Tradition-named practices** — Rosary, Jesus Prayer, Lectio Divina, prayer wheels, yoga, chakras, labyrinth. Each needs a qualified reviewer from its own tradition and that capacity does not exist; half-reviewed tradition content is the seed audit's single largest failure mode ([#11](https://github.com/inarush0/spiritual-collective/issues/11)).
- **Manifesting, affirmations, and self-guided fasting** — removed or materially reframed by the seed audit.

## Inclusion

- **Religious users are served by a bring-your-own container and a pointer to a person**: practice 3, where the reader supplies the words, and practice 4, asking for a chaplain or their own faith leader. This serves every tradition equally without the resource speaking for any of them ([#7](https://github.com/inarush0/spiritual-collective/issues/7)).
- **Belief is optional everywhere.** Nine of the twelve require no belief in anything sacred, and `belief requirement` is a required field so the reader is never surprised.
- **Provenance is visible to the reader**: a short plain-language origin line on each practice, never naming the seed material's author and never implying a tradition endorses this version. For most of the twelve the honest sentence is that versions of this are practised in many traditions and by people with none — which doubles as the non-proselytizing signal at the point of use. Full academic citations are rejected as borrowed authority; internal-only provenance is rejected because it makes the site look like it invented practices it did not ([#8](https://github.com/inarush0/spiritual-collective/issues/8)).
- **Nothing is age-graded.** The no-suitability claim is stated in the two places it binds (§1).

## Banned phrasing

Machine-checked as part of the gate command (§7). Drawn from the guardrails; extend as review finds more.

`cure` · `heal` · calm-as-correct-outcome constructions · "everything happens for a reason" · "you should" · symptom-relief claims · divine-favour claims · completion or streak language · any phrasing that tells the reader what they are feeling

The **need tag** grammar is part of this: tags name something a person *wants*, never a state they are *in*. Under "What might support you right now?", picking a want is a preference; picking a state is self-diagnosis ([#12](https://github.com/inarush0/spiritual-collective/issues/12)).

## Limits and the crisis pointer

**Two jobs, deliberately split** — one sentence cannot both say *this is not care* and *here is what to do if you are in trouble now* ([#8](https://github.com/inarush0/spiritual-collective/issues/8)).

- **On the practice view, once, near the stop control**: a quiet line that this is something to try rather than treatment, and that stopping is always fine.
- **The crisis pointer sits with it but visually distinct**, so the one reader who needs it finds it without every other reader being handed an emergency framing mid-stillness.
- **Not on suggestion sets** — that is the moment someone is deciding to try something, and a disclaimer there reads as a warning about the practices themselves.
- **Not in the footer.** The only persistent chrome is the "What is this?" link.
- **The fuller limits statement lives on the about page.**

The pointer's ordering is fixed: **the people already with them first** — care team, nurse, chaplain, the number on their own paperwork — then **988 for immediate danger**, as plain text and a link, then 911. No widget, no third-party request. A maintained list of hotlines by need is rejected: it ages badly, no two-person static project will maintain it, and it forces a distressed reader to triage themselves. "Seek professional help" is rejected as a sentence that helps nobody.

## Compliance posture

From the compliance baseline ([#10](https://github.com/inarush0/spiritual-collective/issues/10)). These are design constraints, not legal advice; the full note lives on `research/public-resource-compliance`.

- **Independence is architectural, not cosmetic.** The whole HIPAA analysis rests on the resource being independent of covered care workflows: own domain, operated independently, no institutional co-branding, no hospital logo, no institution-specific content, stated on the about page. Co-branding would invalidate the analysis and reopen these decisions ([#3](https://github.com/inarush0/spiritual-collective/issues/3)).
- **No identifiable health information is received**, ever.
- **COPPA**: no independent under-13 targeting, and no user-level data collection through persistent identifiers or third-party infrastructure — which the zero-third-party posture (§7) makes verifiable rather than asserted. The younger-child path is addressed to a **companion**, never to a child.
- **Consumer protection**: truthful presentation, no unsupported express or implied health claims.
- **Accessibility**: WCAG 2.2 AA as the voluntary first-release acceptance baseline, which also conforms to WCAG 2.1 (§4).
- **Reopen the compliance review** when functionality, integrations, claims, audience, data, or jurisdictions change.
