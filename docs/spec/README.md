# Specification: first release

This is the implementation-ready specification for the first release of **Something to try today**, a public spiritual-care resource for adolescents in pediatric hospice and palliative care, their adult family members, and the chaplains who share it.

It says **what to build**. It does not restate the reasoning that produced it; each document links the decision behind a rule so an implementer can zoom without the specification carrying the history.

## Read in this order

| Document | Holds |
| --- | --- |
| [01 — Journey and information architecture](./01-journey-and-ia.md) | The three audience paths, the complete route table, and what every page type contains |
| [02 — Content standard](./02-content-standard.md) | The practice record and guide record schemas, the plain-language checklist, the catalog slots, the need tags, and the fixed editorial order |
| [03 — Safety and inclusion](./03-safety-and-inclusion.md) | Risk classes, exclusions, banned phrasing, the limits line, and the crisis pointer |
| [04 — Accessibility](./04-accessibility.md) | The WCAG 2.2 AA baseline and what is machine-checked versus human-tested |
| [05 — Governance](./05-governance.md) | Roles, review gates, promotion, withdrawal, and the harm-report path |
| [06 — Release criteria](./06-release-criteria.md) | The binary checklist that holds production |
| [07 — Technical constraints](./07-technical-constraints.md) | Stack, build, gate command, hosting, and budgets |

## What is authoritative

- **This specification** is authoritative for what to build.
- **[`CONTEXT.md`](../../CONTEXT.md)** is the glossary. Every bolded domain term used here is defined there and is not redefined here. Use its vocabulary in code, content, and commit messages; honour its _Avoid_ lists.
- **[`docs/adr/`](../adr/)** holds the two decisions that are hard to reverse: [ADR 0001](../adr/0001-static-zero-js-no-third-party.md) (static, zero client JavaScript, no third-party requests) and [ADR 0002](../adr/0002-two-person-asymmetric-governance.md) (asymmetric two-person governance).
- **Issues [#2](https://github.com/inarush0/spiritual-collective/issues/2)–[#17](https://github.com/inarush0/spiritual-collective/issues/17)** under map [#1](https://github.com/inarush0/spiritual-collective/issues/1) are the rationale archive, closed. Where a rule here looks arbitrary, the linked issue says why it is not.

## What this specification does not carry

- **The content itself.** The twelve **practice records** and the **guide record** are specified as slots, fields, and rules; the words are written by the **editor** and approved by the **chaplain reviewer** on a track that runs alongside implementation. §2 carries one worked example marked _example, not for publication_.
- **Copy below the record shape.** Route structure, page contents by role, and content rules are fixed here. Actual user-facing wording is a **framing surface** under chaplain veto (§5) and is drafted, not specified.
- **Branding and the domain name.** Out of scope for this release; the resource's name is decided and is not a placeholder.
- **Anything for the handoff moment** — printed cards, one-pagers, QR pages. Ruled out of scope; a sayable name and a matching URL are the mitigation.

## Reference material off `main`

Kept on branches rather than merged, because they are evidence rather than specification:

- `research/pediatric-spiritual-care-safety` → `docs/research/pediatric-spiritual-care-safety-guardrails.md`
- `research/public-resource-compliance` → `docs/research/public-resource-compliance-baseline.md`
- `research/seed-framework-audit` → `docs/research/seed-framework-inclusion-audit.md`
- `prototype/discovery-journey` → `prototypes/discovery-journey-prototype.html`
- `prototype/age-and-family-adaptations` → `prototypes/age-family-adaptations-prototype.html` (opens on variant E, the decided shape)

All practice copy in the prototypes is placeholder drafting with no chaplain, tradition, or clinical review. Do not lift it into content.
