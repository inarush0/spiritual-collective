# 05 — Governance

**Approval is required to publish, never to remove.** That asymmetry is the whole model; see [ADR 0002](../adr/0002-two-person-asymmetric-governance.md) for why it is hard to reverse ([#9](https://github.com/inarush0/spiritual-collective/issues/9)).

## Roles

Three roles, two standing people. Roles are named in the repo; **identities never are** ([#13](https://github.com/inarush0/spiritual-collective/issues/13)).

- **Editor** — drafts practice records, runs the gates, decides what is proposed and what is cut. Owns composition and scope. May remove published content unilaterally. May never publish without approval.
- **Chaplain reviewer** — the single chaplain, sole approver of user-facing content. Holds a **veto on publication**, not editorial ownership: can stop anything shipping and force removal of anything shipped, but cannot compel the editor to write or ship anything.
- **Safety consult** — not standing. A pediatric palliative clinician asked **once**, only for the clinical risk class, which in this release is practice 12 alone.

**Tradition reviewer** is defined but recorded as *unused this release*, since no tradition-named content ships. Reintroducing tradition content is then a staffing change, not a governance rewrite.

## The governed surface

**Every user-facing word**, in two tiers plus one record kind. The riskiest sentences on the site are framing copy, not practice steps.

| Tier | What | Evidence |
| --- | --- | --- |
| **1 — practice records** | the twelve | full review record, all gates |
| **1 — the guide record** | the standing guide | `approved_version` + chaplain attestation; same apparatus, no practice facets |
| **2 — framing surfaces** | discovery question, answer options, need-tag wording, about page, stop and crisis-pointer copy, provenance lines, chrome link wording, the resource's name, `/everything/` ordering | chaplain approval; no per-record evidence apparatus |
| **ungoverned** | build config, data schema, tests | — |

## Evidence

The seven gates split by who can decide them ([#9](https://github.com/inarush0/spiritual-collective/issues/9)):

**Machine-checked** — blocks a record from *entering* review: field completeness, no duration other than `smallest version`, steps ≤ 5, reading level, banned phrasing, sentence caps, `provenance` and `risk class` populated.

**Chaplain-attested** — recorded as role, date, and version:
1. spiritual-care fit and non-proselytizing language
2. genuine opt-out, stop instruction, and nonreligious alternative
3. no cure, symptom-relief, divine-favour, or outcome claims

The chaplain's attestation also carries the **subtract-only rule** on adaptation fields (§2) inside what it means.

**Clinician-attested** — clinical risk class only: pediatric safety.

### What a signature is

**Role, date, and record version — never an identity.** This repository is public and content records live in it, so a reviewer's name in a review record is published whether or not any page renders it ([#13](https://github.com/inarush0/spiritual-collective/issues/13)).

```yaml
review_record:
  approved_version: <commit SHA of this file at approval>
  chaplain_attested: yes
  chaplain_attested_date: 2026-__-__
  clinician_attested: not-required   # or yes / pending
  reply_kept: <pointer to where the signed reply is held, outside the repo>
```

The gate command re-checks the file against `approved_version`, so "did this drift after approval?" is a machine check rather than a memory. Identity is verifiable by the editor and the reviewer, and by no one else.

### How approval is captured

The chaplain reviews on the **beta release** and responds however suits them — email, a call, a marked-up list. The editor **transcribes it into the review record and sends the transcription back for confirmation**. Evidence is the record plus the confirmed transcription. No bespoke review UI in the first release: the failure mode to avoid is not insufficient ceremony but an approval nobody can locate a year later.

### What invalidates an approval

The test is **whether the change could alter what a person does or how safe it is**. If it takes thought, it is substantive.

- **Editorial correction** — no re-review, logged on the record: typo, punctuation, formatting, broken link, factual correction to a non-instructional field.
- **Substantive change** — approval voids, record returns to review: any change to `invitation`, `what this involves`, `stop guidance`, `ways to change it`, `smallest version`, `belief requirement`, `risk class`, `need tags`, `low energy`, `companion note`, `companion cautions`, `child keep`, `child change`, or the addition or removal of any instruction. **Clinician-requested safety wording is never an editorial correction.**

**A voided approval never takes content down.** The last approved version keeps serving while the edited version sits in beta. Otherwise beginning to improve a page becomes a way to accidentally remove it, which pressures the editor never to touch anything. What is published is always a version someone signed ([#14](https://github.com/inarush0/spiritual-collective/issues/14)).

**Approvals do not expire on a timer.** For a twelve-record catalog a calendar-driven re-review invents work and produces rubber-stamping. The catalog is re-reviewed on any change to the guardrails, the content standard, or the audience.

**Approval is whole-record across all three audience renderings.** Per-path approval was rejected: three review states for one record, and the chaplain having to remember which rendering they last signed.

## Review and promotion

**Review in batches, approve and promote per record.** The chaplain works one beta link containing everything in review, in one sitting; approval attaches record by record. An approved record promotes while a held one stays in beta — one contested practice must never hold up eleven good ones. The first release is a special case only in that the batch happens to be the whole catalog.

**Promotion** is a one-field edit: `publication: approved`. Nothing ever auto-promotes — no timeout, no lapse-into-approval, no "deemed approved after 30 days". One reviewer being busy must never become a mechanism for publishing unreviewed spiritual-care content to this audience. A stall is a scheduling problem; the only concession to time pressure is shrinking the batch.

**An empty gate is not a gate.** If no clinician is named by the time the other eleven are approved, practice 12 is a **held record** — written, machine-gated, unpromoted, not deleted — and eleven ship. It promotes later with no rework if an attestation arrives ([#13](https://github.com/inarush0/spiritual-collective/issues/13)).

### The practice-12 ask

Fully specified and unsent; it selects a branch rather than changing the plan. Tracked as a release gate in §6.

**The chaplain introduces; the clinician answers the editor directly.** A relayed answer is the chaplain's paraphrase of a verbal "seems fine", which is the empty gate wearing a signature. The request rides *alongside* the beta link, never as a condition of it, so declining costs nothing. **Practice 12 goes to the clinician before the chaplain sees it**, so the chaplain reviews the text that will ship.

The question, sent as text, with the record's steps, ways to change it, stop guidance, and smallest version pasted in and the beta link offered but not required:

> Practice 12, *gentle movement, or stillness in your body — seated, lying, or imagined*. It's read by an adolescent palliative or hospice patient on a public website, with no clinician present, no knowledge of their diagnosis, and no way for us to screen anyone. Three things: (1) is anything in these steps unsafe to offer that way; (2) is the stop guidance enough, or does something specific need naming; (3) should this practice carry "check with your care team first", and if so in those words?

All three questions, not just (1): question 3 is the likeliest yes and the cheapest fix, and asking only (1) invites a bare "looks fine". A **pass** is "fine, no changes" or "fine, with these changes" applied. A **non-reply** by the time the other eleven are approved fires the hold.

## Withdrawal and rollback

**Removal is unilateral and immediate; restoration never is.** The editor may pull or soften any published content without approval — taking something down cannot harm a user the way leaving it up can. Publishing, restoring, or re-escalating always requires approval. An emergency removal notifies the chaplain and returns the record to review, so it cannot become permanent by neglect.

Two instruments: **per-record withdrawal** (`publication: withdrawn`) is primary; **whole-site revert** is for systemic failure — broken build, wrong content deployed.

**Withdrawal degrades, it never blocks.** A production build never fails because content was withdrawn. A need tag whose last practice goes drops out of the answer options with a loud build warning; withdrawn practice URLs serve the 200 page. Failing the build on a coverage hole would make an urgent removal wait on writing a replacement ([#3](https://github.com/inarush0/spiritual-collective/issues/3)).

## The accountability channel

One plain `mailto:` address, framed narrowly: something here is wrong, unsafe, or hurt someone. It is the counterpart to unilateral withdrawal — that power is inert if no one can report harm. A general "contact us" is rejected: it invites support and pastoral messages this project cannot answer, and an unanswered message from this audience is its own harm. Stated next to the crisis pointer: the address is not monitored urgently and is not a way to reach help now ([#8](https://github.com/inarush0/spiritual-collective/issues/8)).

### Ownership and coverage

- The **editor** owns intake, triage, action, and replies. The **chaplain reviewer** is the named backup and covers planned absences through an explicit handoff.
- Checked at least once each business day. Initial response within two business days. **No promised resolution deadline.**
- If neither person can monitor it for more than one business day, the address stays visible with an accurate temporary availability notice. The resource must never silently accept reports or remove its accountability channel.
- A real mailbox, working owner and backup access, and this procedure are **production prerequisites**.

The operating procedure that carries this out — provisioning, the daily rhythm, the drafted replies, the incident-register fields, and the drill — is [`docs/runbooks/accountability-mailbox.md`](../runbooks/accountability-mailbox.md) ([#39](https://github.com/inarush0/spiritual-collective/issues/39)).

### Four intake lanes

1. **Safety or harm** → precautionary action, below.
2. **Wrong or inaccessible content without plausible harm** → assess as an editorial correction or substantive change under the ordinary rules.
3. **Distress or request for care** → the bounded distress response. Not pastoral care, not crisis assessment.
4. **Spam or unrelated** → discard, no **incident record**.

The editor may ask **one** narrowly scoped follow-up: which published material the person encountered, and what appeared wrong or unsafe. Never request identity, age, diagnosis, institution, or medical history. **No reply never becomes evidence that a protective action should be reversed.**

### Precautionary action

A specific, plausible claim that current published material is unsafe or caused harm triggers protective action **during the same mailbox-review session** — before investigation or reply, and no later than one business day after receipt under normal coverage:

- withdraw an affected practice record; or
- revert or remove an affected framing surface, serving the last approved safe version where one exists; or
- whole-site revert, only when the problem is systemic or cannot be isolated.

Prior chaplain approval does not count against the report and never shields content from withdrawal. The editor investigates and chooses whether to retire or revise. The chaplain reassesses changed user-facing wording and retains the veto. Restoration that depends on clinical safety requires a **new** qualified safety consult.

Closing a safety report with **no content change requires both editor and chaplain to agree**; a clinical-safety claim additionally requires a qualified safety consult. **Uncertainty resolves toward continued withdrawal.** The editor may keep material withdrawn regardless of any other role's view; restoration always follows every applicable gate.

### Replies

- **Acknowledgement**: received; this address is not urgent help; review may not produce an individual explanation.
- **Distress**: one compassionate boundary response — this mailbox cannot provide immediate or pastoral care; contact the care team, nurse, or chaplain first; 988 or 911 for immediate US danger. The reader is not assessed, counselled, promised follow-up, or drawn into an ongoing exchange.
- **Closing**: one response saying only that the material was removed, corrected, or reviewed with no change. Thanks the reporter without disputing their experience, declaring causation, exposing internal deliberation, or promising future safety.

### Data and the incident register

Ordinary use of the resource sends and stores nothing about the visitor; emailing voluntarily shares the sender address and message with the mailbox providers, and the about page says so. Copy beside the address asks reporters not to include names, diagnoses, institutions, or other private details.

**The source email is deleted** as soon as clarification and the closing response are complete, hard maximum 30 days unless preservation is legally required. It is **never** copied into git or a review record.

Each non-spam report creates an **incident record** in a private operational register **outside the public repository**, containing only: receipt date · affected record or framing surface and version · intake lane · protective action and time · required review roles · outcome · closure date. Never sender identity, quoted message text, diagnosis, institution, or narrative detail.

A content incident closes only when the material is retired, or a corrected or restored version has passed every applicable gate. A distress message closes after the boundary response.
