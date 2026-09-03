# 06 — Release criteria

**Readiness is a binary checklist of observable acts by roles, not a measurement** ([#4](https://github.com/inarush0/spiritual-collective/issues/4)). There is no usage data, and there will not be: the site is zero-JS with no analytics and no third-party requests, so no behavioural evidence exists. Standing capacity is two people, one an unpaid volunteer. Every criterion is therefore something a person can do in an afternoon and leave an artifact behind for.

> This document is the release-criteria artifact that [#4](https://github.com/inarush0/spiritual-collective/issues/4) placed at `docs/release-criteria.md`; it lives here so the specification set is one thing. Completion is recorded against it exactly like a review record — **role, date, and the version it was run against** — with findings and artifacts kept alongside. **No proxy reader, chaplain, or clinician is ever named in it.**

## Rules of the gate

- **Binary.** An unmet criterion holds the release, never lapses into met, and nothing auto-passes on a timer. A rubric with a threshold was rejected: averaging lets a strong accessibility pass offset a weak safety one, which is exactly wrong when the failure modes are categorical.
- **One owning role and one locatable artifact per line.** Owners are roles, never people.
- **Every criterion here blocks publishing. None of them is ever required to remove or withdraw.**

## No evidence comes from the actual audience

No adolescent patient, no currently-bereaved family member, and no family in active care is asked to evaluate this before production. This is research on a dying-child population, requiring consent, assent, and an institutional review process this independent project has no standing to run. A validation plan that quietly assumes it will happen produces either a permanently unmet gate or a bad shortcut taken under release pressure.

**The first release ships on expert and lay proxy evidence only**, and the about page says so (§1).

## Per-record criteria

Already fully specified elsewhere; nothing is added here.

- [ ] `npm run gates` passes for the record (§7)
- [ ] Chaplain attestation recorded against the shipping version (§5)
- [ ] Clinician attestation recorded, **clinical risk class only** — see the practice-12 gate below

## Site-level criteria

A first-production pass validating **the experience between the records**. Run once, with an explicit re-trigger list.

### Accessibility — owner: editor

- [ ] One instance of every page type tested across the full matrix (§4)
- [ ] **Zero known WCAG 2.2 AA failures on any page type**
- [ ] Artifact: a written conformance statement

### Understandability — owner: editor

- [ ] Three lay adults from outside the project, read-aloud, on the **three hardest practices** by the machine metrics — highest reading level, most steps, longest `what this involves`. If the worst pass, the other nine do.
- [ ] Bar, binary: after one read, the reader says back what they would actually do first **without re-reading**, and finds how to stop or leave within seconds of being asked. A reader who has to scroll back to answer either is a failure, and the finding is a **rewrite**, not a note.
- [ ] Artifact: the read-aloud results

This is the only criterion that tests the words against someone who has not read them thirty times.

### Feasibility in the care setting — owner: chaplain reviewer

A **conditions walkthrough** of the beta, with the chaplain owning the conditions list — they have been in the rooms, and the list is the part nobody else can invent. At minimum:

- [ ] One-handed
- [ ] Lowest brightness
- [ ] Silent
- [ ] Slow or absent wifi after first load
- [ ] The phone handed between two people mid-practice
- [ ] **Interrupted mid-practice and returning** — the site is stateless, so returning means re-navigating from the door; whether that is acceptable or a finding is the walkthrough's to decide
- [ ] Artifact: walkthrough notes

Held separate from the handoff rehearsal: that one asks *would you hand this over*, this asks *does it survive the room*. Collapsing them means the second gets skipped.

### Chaplain trust — owner: chaplain reviewer

- [ ] A **handoff rehearsal** on their own phone: arrival question through to one practice's stepped view, saying aloud what they would say while handing it over, **ending in a stated yes or no** on whether they would actually do it
- [ ] Artifact: the stated answer, recorded

A no is a finding, not a delay. Record-by-record approval is not the same act as deciding you would hand the whole thing to a family in a room. Not more recruitment: a blocking gate on volunteers you do not have is how a release stalls indefinitely. Outside chaplains, if reachable later, are a strengthening and never a precondition.

### Safety, beyond the attestations — owner: editor

An **adversarial read**, run **before** the chaplain sees the batch. Attestation asks *is this safe*; this asks *who does this hurt*, and the two find different things.

- [ ] Every practice and framing surface read as: a parent whose child died last week
- [ ] …as: a teenager harmed by religion
- [ ] …as: someone in pain who tries the practice and cannot do it
- [ ] …as: someone who tries it and feels worse afterward
- [ ] Artifact: one written finding per reading, **or an explicit "nothing found"** — the explicit nothing is what stops the pass being quietly skipped

It matters that the chaplain is not the only line of defence when the chaplain is one unpaid person.

### Coverage and no false notes — owner: chaplain reviewer

- [ ] The coverage guarantee (§2) holds over the shipping catalog
- [ ] For each of the eight need tags, the chaplain confirms the set behind it contains nothing that would land as **wrong or tone-deaf** to someone reaching for that thing

This is a no-false-notes check, **not a relevance measurement** — see below.

### The harm-report drill — owner: editor

Before the accountability channel's address may appear in production:

- [ ] A tabletop drill exercising all four intake lanes
- [ ] Owner and backup access confirmed
- [ ] One-business-day detection demonstrated
- [ ] Withdrawal or revert performed
- [ ] Acknowledgement and closing responses sent
- [ ] Source-email deletion performed
- [ ] A sanitized incident record created

**Publication fails if any step depends on an unavailable person, an inaccessible credential, or an unwritten judgment.**

### Operational prerequisites

- [ ] A real, monitored mailbox exists, with owner and backup access
- [ ] The beta release is `noindex` and non-crawlable, verified automatically (§7)
- [ ] Production makes zero third-party requests, verified automatically (§7)

## The practice-12 gate

The clinician ask is specified and unsent (§5). The trigger is **the chaplain's sign-off on the other eleven, not a date** — practice 12 must never delay the release.

- [ ] **If an attestation exists against the shipping version**, practice 12 promotes with the rest.
- [ ] **Otherwise** it is held unpromoted and eleven ship.

Either way, the "considered, not in the first release" register carries a line marked **held, not cut**, reason code *needs clinical review*.

## Relevance is not a release criterion

No usage data, no audience testing, unranked editorial sets. Any proxy measure available — click-throughs we do not collect, a chaplain guessing what an adolescent wants — would manufacture confidence we have not earned, in a resource whose content standard refuses to make claims about the person.

**Relevance is stated as unvalidated.** Real relevance evidence arrives only after release, through the accountability channel and the chaplain's own word of mouth. The distinction between this and the no-false-notes check above is written down so it cannot drift.

## Re-triggers

The site-level pass re-runs on a change to any of: **the arrival question · the discovery question · the guide record · the accountability channel · the guardrails**. Without this list the pass silently becomes a one-time ceremony.

## After production

A scheduled review in which editor and chaplain read the incident register together and re-walk the site once, feeding the same conditions walkthrough and adversarial read. A soft "observation window" was rejected: with no user data it is a period in which nothing is observed.

**An empty inbox is not evidence of safety.** With no analytics, silence is ambiguous — nothing went wrong, or nobody visited, or somebody was harmed and had no reason to believe emailing a stranger would help — and those are indistinguishable to us. This is written into the criteria so that "no reports in six months" cannot harden into a belief that the thing works.
