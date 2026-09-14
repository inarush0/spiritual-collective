# Runbook: the accountability mailbox

The operating procedure that turns the address on `/about/` into a **channel** rather than an address. [`docs/spec/05-governance.md`](../spec/05-governance.md) is authoritative for the rules; this document is how they are carried out, and it holds the drafted wording the procedure needs at the moment it is needed. Tracked in [#39](https://github.com/inarush0/spiritual-collective/issues/39).

> **Status: provisioned, the wording approved, and the channel proven.** [Drill sitting 1](#sitting-1-the-channel) has passed in full — a message reaching this address is detected, judged, answered, recorded, and deleted, demonstrated rather than asserted. Every reply and both notices are [agreed by the chaplain reviewer](accountability-replies-review.md#outcome), as drafted, with the transcription confirmed.
>
> **One thing remains, and it is [sitting 2](#sitting-2-the-withdrawal)** — proof that a safety report can move published material off the site. It is blocked on [#31](https://github.com/inarush0/spiritual-collective/issues/31) and [#33](https://github.com/inarush0/spiritual-collective/issues/33), because there is no deployed site to take anything down from.
>
> `REPORT_ADDRESS` in [`src/framing/about.ts`](../../src/framing/about.ts) is still `report@example.invalid`, deliberately unroutable. The release gate in [`docs/spec/06-release-criteria.md`](../spec/06-release-criteria.md) holds production until every box in [Before the address ships](#before-the-address-ships) is ticked.

**Nothing in this file is an identity.** The editor and the chaplain reviewer are named by role, here as everywhere in this repository ([ADR 0002](../adr/0002-two-person-asymmetric-governance.md)). Nothing from a real report — sender address, message text, or paraphrase — is ever added to this file or any other file in git.

## Provisioning

Owner: **editor**. All of it is human work; none of it is in this repository.

- [x] **A real mailbox on the resource's own domain.** Not a personal address, not a free-provider address on someone's own name: the address is spoken on `/about/` as the resource's accountability channel, and it must survive one person changing jobs, phones, or providers.
- [x] **Owner access confirmed** — the editor can read, reply from the address, and permanently delete.
- [x] **Backup access confirmed** — the chaplain reviewer can do the same, tested by actually signing in, not by being handed a credential. A credential nobody has exercised is an unavailable credential, and §6 fails publication on exactly that.
- [x] **No forwarding into a personal archive, and no provider-side backup that outlives the 30-day maximum.** Source-email deletion is a promise the about page makes on the resource's behalf; a copy sitting in someone's personal mail history breaks it silently. Disable auto-archive, auto-forward, and any "deleted items keep forever" retention. A short provider restore window is acceptable and must be [written down](#what-deleted-actually-means) rather than assumed away.
- [x] **Spam filtering set to quarantine, not silent discard**, and the quarantine checked on the same daily rhythm. A safety report that a filter ate is indistinguishable from a channel that does not exist.
- [x] **Outbound mail authenticated**, so the three replies land in an inbox rather than a spam folder. A distress reply nobody sees is the harm this channel exists to prevent, and a young domain's first outbound mail is exactly where it happens.
- [x] **What the chaplain reviewer needs to recover the mailbox, in a vault both people can reach.** The mailbox surviving one unavailable person is the whole point of a backup, and it is not a backup if recovering it needs the other person. See [the shared vault](#the-shared-vault) — and note that the registrar login is deliberately *not* in it.

**Provisioning is complete.** Backup access was exercised by signing in rather than granted on paper, and [drill sitting 1](#sitting-1-the-channel) exercised it again against live messages.

**What the vault is actually for.** The chaplain reviewer can already sign in, so day-to-day backup access was never the open question. The case the vault answers is *recovery*: the editor unreachable, or the second factor lost with the device holding it. A shared password answers neither. [The shared vault](#the-shared-vault) now holds what does.

### As provisioned

The address is **`report@spiritual-collective.com`**, hosted at **Fastmail**, with DNS on **Squarespace Domains** (`nsb1`–`nsb4.squarespacedns.com`). Recorded here so the next person changing DNS knows what mail depends on; there is nothing secret in it, and credentials live in the vault, never in git.

| Host | Type | Value |
| --- | --- | --- |
| `@` | MX 10 | `us1-smtp.messagingengine.com` |
| `@` | MX 20 | `us2-smtp.messagingengine.com` |
| `@` | TXT | `v=spf1 include:spf.messagingengine.com ?all` |
| `fm1`–`fm3._domainkey` | CNAME | `fm<n>.spiritual-collective.com.dkim.fmhosted.com` |
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:report@spiritual-collective.com` |

**Squarespace appends the domain to whatever is in the Host field.** The root records are `@`, never the full domain — entering `spiritual-collective.com` produces `spiritual-collective.com.spiritual-collective.com`, which resolves as nothing and takes the mailbox down silently. This cost a round of debugging once already.

**DMARC starts at `p=none` deliberately.** Tighten to `p=quarantine` and then `p=reject` once the aggregate reports confirm Fastmail is the only sender. SPF stays at Fastmail's `?all`: the protection comes from DKIM and DMARC, and `-all` would break any future sender for no gain here.

### The shared vault

An **Apple Passwords shared group**, holding three things: the Fastmail password, the Fastmail recovery code, and the link to the incident register. Recorded here for the same reason the DNS is — the next person needs to know where the keys live. Nothing secret is written down, only the name of the thing.

**Only what the chaplain reviewer will actually use belongs in it.** A credential they will never sign in with is not a backup; it is a copy of a secret in one more place. [The registrar stays with the editor](#the-registrar-stays-with-the-editor).

**The chaplain reviewer has read all three back from their own device.** That read-back is the check that matters, not the act of sharing: a share nobody has opened is not a share, and it is the only thing that catches a note added to a personal copy of a login rather than to the shared one — which looks identical from the side that added it.

#### Why the recovery code had to be in there

Account recovery runs through the **editor's cellphone number**. That works, and it works only for the editor; it is not a shared method and the chaplain reviewer cannot use it. The recovery code is the shared equivalent, at **Settings → Privacy & Security → Account recovery** — already generated rather than created on demand, and [worth copying while the screen is open](https://www.fastmail.help/hc/en-us/articles/360058752374-Using-two-step-verification-2FA), because Fastmail does not document whether it can be viewed twice.

**The gap it closed was silent**, which is why it is written down now that it is shut. Fastmail lets a device be marked trusted, and the chaplain reviewer's is, so their sign-in works today and would have kept appearing to work. The failure arrives later and all at once: a new phone, a reinstall, or cleared browser data drops the trust, Fastmail asks for a second factor, and that factor is a text message to the editor's phone. Backup access that depends on the person it is a backup for is the condition §6 fails publication on, and it passes every check until the day it matters.

**Still available, and sturdier:** Fastmail supports more than one two-step verification device, so the chaplain reviewer can register their own. That removes the dependency rather than working around it, and it does not replace the recovery code.

**One property of the shared group:** it depends on both people staying in the Apple ecosystem. Acceptable, and worth writing down rather than discovering — if either person moves off Apple, the vault moves with them, and that is the kind of task postponed until the day it is needed.

### What the chaplain reviewer can and cannot do

**The chaplain reviewer signs in to Fastmail and to nothing else.** They are not a technical operator, will not hold a registrar, DNS, host, or repository credential, and are not being asked to become one. Writing this down matters because every other line in this runbook has to be true under it.

[ADR 0002](../adr/0002-two-person-asymmetric-governance.md) is already consistent with this, and the distinction it draws is the one to keep: the asymmetry there is over **authority**, not capability. The chaplain reviewer can *force* the removal of anything shipped. The editor is who *performs* it. Nothing in the ADR ever said otherwise, and it now says so explicitly — the editor as single executor is recorded in its consequences rather than living only here.

So the backup is a backup for some things and not others:

| | Backed up by the chaplain reviewer | |
| --- | --- | --- |
| Reading the mailbox | **yes** | Fastmail, on a phone |
| Deciding the lane, including a safety call | **yes** | this is judgment, and it is the half they are better at |
| Sending any of the three replies | **yes** | it is email |
| Writing the incident record | **yes** | a shared sheet |
| Withdrawing a practice | **no** | a file edit and a commit |
| Fixing DNS, the host, or the build | **no** | credentials they will not hold |
| Publishing the availability notice | **no** | it is a change to the site |

**The editor is therefore a single point of failure for execution.** That is not a defect introduced here; it is the same shape as ADR 0002's deliberate single point of failure for publishing, on the other side of the split. Two people, one of them an unpaid volunteer with no technical role, cannot produce a second executor. What can be done is to stop the procedure from quietly assuming one.

### When the editor cannot act

A case the earlier draft missed, and the realistic one: the chaplain reviewer reads a lane-1 harm report during an editor absence. They can decide it is lane 1. They can send the reply. **They cannot take the material down.**

- **Planned absence.** Before the editor goes, they decide whether they can still act within one business day. If not, the [availability notice](#the-temporary-availability-notice) goes up *before they leave*, because afterwards nobody can publish it. The handoff to the chaplain reviewer is for monitoring and replies, and it is agreed explicitly that a protective action waits for the editor's return.
- **Unplanned absence.** The chaplain reviewer sends the reply the message calls for, opens the incident record, and reaches the editor by some route that is not this mailbox. The protective action waits. **There is no mitigation for this beyond the editor being reachable**, and pretending otherwise in a runbook would be worse than naming it.

The incident record carries the real elapsed time in these cases. A protective action that took four days took four days; the register is not where that gets rounded down.

### The registrar stays with the editor

The Squarespace account signs in with the editor's personal Google account, and that password is not shared — correctly. Sharing it would hand over the editor's whole mail, files, and identity to solve a DNS problem, and Squarespace documents no way to add a second person to a standalone domain.

There is no second technical operator to share it *with*, so this is not a gap to close. The Squarespace login and any future host credential live in **the editor's own vault**, not the shared group. They are a continuity concern for whoever maintains this next, not a backup-access concern for the chaplain reviewer.

What follows from that, and should be checked rather than assumed:

- **Auto-renew is on.** Confirmed. An unreachable editor plus a lapsed domain is how the mailbox is lost slowly, and it is the one failure here that a calendar prevents.
- **Renewal and expiry warnings do not depend on the domain they are about.** They go to the editor's personal account, which a `spiritual-collective.com` expiry cannot take down. That loop — expiry notices delivered to the mailbox the expiry kills — is broken by the same arrangement that makes the registrar login unshareable.

### What "deleted" actually means

**Fastmail keeps backups of deleted mail for one week**, during which the account owner can restore it, and there is no setting that turns this off. Confirmed against [Fastmail's *How to restore deleted data*](https://www.fastmail.help/hc/en-us/articles/1500000280381-How-to-restore-deleted-data) — "we keep backups of deleted email for one week" — rather than left as an estimate.

One week is well inside the 30-day maximum, so the promise on `/about/` holds. It is written down here rather than glossed because the honest sentence is *deleted, with a provider restore window of one week*, not *deleted instantly*, and a procedure that overstates its own guarantees is the kind that quietly stops being followed. Re-check the figure if the mail host ever changes; it is a property of the provider, not of this procedure.

## The daily rhythm

**Checked at least once each business day** by the editor. Initial response within **two business days**. **No resolution deadline is promised**, to anyone, ever.

Each check is one **mailbox-review session**, and it is the unit that matters: a report that names a specific, plausible harm gets its protective action *during the session it is read in* — before investigation, before any reply — and no later than one business day after receipt under normal coverage.

**Planned absence is an explicit handoff.** The editor tells the chaplain reviewer the dates and confirms they will check; the chaplain confirms back. An assumed handoff is not a handoff. The handoff covers **monitoring and replies only** — [the chaplain reviewer cannot perform a protective action](#what-the-chaplain-reviewer-can-and-cannot-do), and the handoff says so out loud rather than leaving it to be discovered on the day it matters.

Publish the [temporary availability notice](#the-temporary-availability-notice) when **nobody can act within one business day** — which is a wider condition than nobody being able to read. An editor away with the chaplain reviewer watching the mailbox means reports are read and answered but nothing can be taken down, and a reader is owed that fact rather than an unstated wait. The notice is itself a change to the site, so it goes up **before** the absence, never during.

The address stays visible either way. The resource must never silently accept reports, and must never remove its accountability channel.

## Triage: the four lanes

**Nothing arrives labelled.** The lane is a judgment the editor makes on reading, never something the sender declares — there is no form, no category to pick, and there never will be: a form means client JavaScript and a second origin ([ADR 0001](../adr/0001-static-zero-js-no-third-party.md)), and §3 refuses to make a distressed reader triage themselves. What arrives is a plain email.

| Lane | What it is | What happens |
| --- | --- | --- |
| **1 — safety or harm** | a specific, plausible claim that current published material is unsafe or caused harm | [precautionary action](#precautionary-action) in this session, then investigate |
| **2 — wrong or inaccessible** | an error or an access barrier, without plausible harm | assess as an editorial correction or a substantive change under §5's ordinary rules |
| **3 — distress or request for care** | someone reaching for help, or for a person to talk to | the [distress reply](#2-distress), once |
| **4 — spam or unrelated** | everything else | discard. **No incident record.** |

### Which lane this is

Read once, then ask in this order:

1. **Does it refer to anything on the site at all?** No → lane 4. Because the address is published on a public page it will be scraped, so this is most of the volume and the easiest call.
2. **Is the subject the person writing, or the material?** The person → lane 3, and read on, because it may be lane 3 *and* something else.
3. **Is there a plausible claim of harm or danger from the material?** Yes → lane 1. No → lane 2.

The discriminator between 1 and 2 is the harm claim, and **a genuine tie is lane 1**: uncertainty resolves toward protection.

### Lane 3 rides alongside

**Lanes 1 and 2 exclude each other. Lane 3 does not exclude either of them**, because the outputs are different kinds of thing — a content lane produces an *action*, lane 3 produces a *reply shape* — and they compose rather than compete.

The message this channel exists for is often both at once: *this practice made me feel worse and I do not want to be here any more* is a safety report about published material **and** a person in distress. When that happens:

- **The content lane governs the action** — the withdrawal or revert happens, in this session, exactly as lane 1 requires.
- **Lane 3 governs the reply** — the [distress reply](#2-distress) is sent, in place of the acknowledgement, never in addition to it. Two replies to that message is the exchange §5 forbids.
- **The incident record carries both lanes**, and closes on the content lane's terms: retired, or corrected and through every applicable gate. The distress side closes with the reply.

Forcing a single lane here is the failure mode worth naming, because under the pressure of reading that sentence the thing likeliest to be dropped is the withdrawal.

Lanes 1–3 each create an [incident record](#the-incident-register), one per message, whatever combination it carries.

### The one follow-up

The editor may ask **one** narrowly scoped follow-up, and only about the material:

> Thank you — one question so we can find the right thing: which page or practice were you looking at, and what appeared wrong or unsafe about it?

**Never send it to a message carrying distress.** Asking *which page were you looking at* of someone who has just said they do not want to be here reads as a request for paperwork at the worst possible moment. The distress reply goes, and the editor identifies the material themselves from what the message already says — an unidentifiable practice is withdrawn on the editor's best reading, not clarified out of the reporter.

**Never** ask for identity, age, diagnosis, institution, or medical history — not to "understand the context", not to assess severity. **No reply never becomes evidence that a protective action should be reversed.** If the follow-up goes unanswered, the withdrawal stands and the incident closes on the editor's and chaplain's judgment of the material itself.

### Precautionary action

One of, chosen in this order:

1. **Withdraw the affected practice record** — `publication: withdrawn`.
2. **Revert or remove the affected framing surface**, serving the last approved safe version where one exists.
3. **Whole-site revert** — only when the problem is systemic or cannot be isolated.

Prior chaplain approval **does not count against the report** and never shields content from withdrawal. Notify the chaplain; the record returns to review so the removal cannot become permanent by neglect.

**Closing a safety report with no content change requires both editor and chaplain to agree.** A clinical-safety claim additionally requires a qualified safety consult, and restoration that depends on clinical safety requires a **new** one — the original consult does not stretch to cover it.

## The three replies

Drafted here; **agreed by the editor and the chaplain reviewer before the address ships**. They are the resource speaking to a reader in the worst moment it has, and they are edited in this file rather than composed fresh at the keyboard — a reply written under the pressure of an upsetting message is where promises get made.

**This file is authoritative for the wording.** [`accountability-replies-review.md`](accountability-replies-review.md) is the packet the chaplain reads — these sentences plus the follow-up and the availability notice, pinned to a version, with the questions they are being asked. Agreed changes land here first and the packet is regenerated; the packet is never the source.

Send at most one of each per report. No signature, no role title, no name.

### 1. Acknowledgement

> Thank you for writing. Your message reached us and someone is looking at it.
>
> This address is not monitored urgently and it is not a way to reach help now. If you need help right now, start with the people already caring for you — your care team, your nurse, or your chaplain. The number on your own paperwork reaches them.
>
> We may not be able to send you an individual explanation of what we decide, but nothing you have told us is being ignored.

### 2. Distress

**One response. The reader is not assessed, not counselled, not promised follow-up, and not drawn into an exchange.** If a second distress message arrives, it does not get a second reply; it gets an incident record and nothing else.

> Thank you for writing, and I am sorry things are hard right now.
>
> This mailbox cannot give immediate help or pastoral care, and I do not want to leave you waiting on it. The people already caring for you are the ones to reach first — your care team, your nurse, or your chaplain. The number on your own paperwork reaches them.
>
> In the US, if you are in immediate danger, you can call or text 988, the Suicide and Crisis Lifeline. If someone is in immediate physical danger, call 911.

### 3. Closing

One response, saying only which of the three happened. Thanks the reporter **without disputing their experience, declaring causation, exposing internal deliberation, or promising future safety.** Nothing about who reviewed it, what was argued, or what will be done differently.

> Thank you again for writing. The material you told us about has been removed.

> Thank you again for writing. The material you told us about has been corrected.

> Thank you again for writing. We reviewed the material you told us about and have not changed it.

Never "we have made sure this cannot happen again", never "this was already reviewed by a chaplain", never "we do not believe this caused any harm".

## The temporary availability notice

**The address stays visible**; one of these sentences goes beside it, and comes down the day the thing it describes is no longer true. Published **before** the absence, because it is a change to the site and [the chaplain reviewer cannot make one](#what-the-chaplain-reviewer-can-and-cannot-do).

**Two variants, because there are two different absences**, and the first draft of this runbook had only one. Sending the wrong one is a lie to a reader who has no way to check it.

### Nobody is reading

Neither person can monitor the address for more than one business day.

> This address is not being checked at the moment and will be again from **&lt;date&gt;**. Nothing sent here will be read before then. If you need help right now, start with the people already caring for you — your care team, your nurse, or your chaplain.

### Read, but nothing can be changed

The more likely one: the chaplain reviewer is watching the mailbox, and the editor — the only person who can take material down — is away. Reports are read and answered. Nothing can be removed.

> Messages sent to this address are being read, but we cannot change anything on this site until **&lt;date&gt;**. If something here is wrong or unsafe, please tell us anyway — it will be seen. If you need help right now, start with the people already caring for you — your care team, your nurse, or your chaplain.

Do not use the first notice for this case. *Nothing sent here will be read* would be false, and it would talk a reader out of reporting something unsafe at the one moment the resource most needs to hear it.

Three things neither notice may do: remove the address, soften the date into "shortly" or "as soon as possible", or promise what will happen when the date arrives. An inaccurate notice is worse than none, because a reader will believe it.

## The incident register

**Private, operational, and outside this repository.** Not a file in git, not a GitHub issue, not a review record — a private document under the editor's control that the chaplain reviewer can also read.

One record per non-spam report, holding **only** these fields:

| Field | Example |
| --- | --- |
| receipt date | `2026-__-__` |
| affected record or framing surface, and version | `practice-07`, `<commit SHA>` |
| intake lane | `1 — safety or harm`, or `1 + 3` where [lane 3 rides alongside](#lane-3-rides-alongside) |
| protective action and time | `withdrawn, same session, 2026-__-__ 09:__` |
| required review roles | `editor + chaplain; safety consult required` |
| outcome | `retired` / `revised and re-approved` / `no change, both agreed` |
| closure date | `2026-__-__` |

**As created**: a private Google Sheet in the editor's Drive, one row per record and one column per field above, shared with the chaplain reviewer and with nobody else. **The link lives in the shared vault, not here** — the mailbox address is public by design and this is not, and a URL in a public repository is an invitation to ask for access to a thing nobody outside the two roles should have.

The column headings *are* the field list, which is the reason for a sheet rather than a document: a field that has no column is a field nobody can add in a hurry. Note the one thing the tool will not enforce — **revision history retains text that was typed and deleted**, so a slip pasted in and removed does not go away. The discipline below is what protects the register, not the software.

**Drill records say they are drill records.** The register's first rows are test messages the editor wrote to themselves, and nothing in the seven fields distinguishes them from a report a real person sent. Mark them in the outcome field — `drill, sitting 1` — because §6 keeps them as the gate's artifact rather than letting them be cleaned up, and the scheduled post-production review reads this register expecting incidents. A year from now, an unmarked drill row is a harm report nobody remembers receiving.

**Never** in the register: sender identity, quoted message text, diagnosis, institution, or narrative detail. If a field seems to need a sentence of story to make sense, that is the signal it is being written down at the wrong grain — the version pointer and the outcome carry the meaning.

**A content incident closes only when** the material is retired, or a corrected or restored version has passed every applicable gate. **A distress-only incident closes** after the boundary response is sent. **A combined record closes on the content lane's terms** — the reply has already gone, and the material is what is left open.

## Deleting the source email

**As soon as clarification and the closing response are complete. Hard maximum 30 days**, unless preservation is legally required. Permanent deletion, including from the trash and any quarantine copy.

It is **never** copied into git, into a review record, into an issue, into a commit message, or into a chat with an assistant. The incident record is what survives, and it is deliberately too thin to reconstruct the message from.

## The drill

The release gate in [§6](../spec/06-release-criteria.md) — owner: **editor**, run against the real mailbox before the address ships. Every test message is sent from an address outside the project, and worked exactly as the procedure says rather than in an abbreviated form arranged to pass. **Publication fails if any step depends on an unavailable person, an inaccessible credential, or an unwritten judgment.**

### Why it runs in two sittings

§6 asks for a **withdrawal or revert performed**, and a withdrawal is not something that can be rehearsed on paper. The point of the step is that a one-field edit reaches a reader — in one session, with no code change and no branch operation. That needs a deployed site, and there is not one yet: [#33](https://github.com/inarush0/spiritual-collective/issues/33) stands up the two Cloudflare Pages projects, and it is itself blocked on [#31](https://github.com/inarush0/spiritual-collective/issues/31), which is what makes a withdrawn practice serve a 200 page instead of a dead link.

So the drill splits at the dependency rather than pretending it is not there:

| | What it tests | Runnable |
| --- | --- | --- |
| **Sitting 1 — the channel** | that a message arriving at the address is detected, triaged, answered, recorded, and deleted | **now** |
| **Sitting 2 — the withdrawal** | that a safety report moves published material off the site inside a business day | after [#31](https://github.com/inarush0/spiritual-collective/issues/31) and [#33](https://github.com/inarush0/spiritual-collective/issues/33) |

**Splitting costs nothing in schedule.** The gate exists to let the address appear *in production*, and there is no production until #33 deploys one. Sitting 2 sits on the critical path already; this defers half a drill behind work the release is waiting on regardless, rather than deferring the release behind the drill.

**The gate stays binary.** Neither sitting passes anything on its own, a box ticked in sitting 1 does not decay into a pass for sitting 2, and `REPORT_ADDRESS` is replaced only after both are complete. Two sittings is a sequence, not a partial credit.

### The site to withdraw from is the beta

Sitting 2 runs against the **deployed beta**, not production, and that is the right target rather than a concession.

Withdrawal is excluded from *both* builds — `publishedIn` in [`src/catalog/release.ts`](../../src/catalog/release.ts) returns false for `withdrawn` before it ever looks at which release it is in — so a withdrawal on the beta exercises the identical code path a production withdrawal would. What the beta does not share with production is the approved-only filter and the domain, and neither of those is what this step tests.

It is also the honest target for a second reason: at the moment the drill runs, the beta **is** the deployed site. A drill against the site that actually exists is the procedure as it will be carried out; a drill against a locally built copy is a demonstration of a mechanism.

**Before sitting 2, rehearse the edit once.** The editor sets `publication: withdrawn` on a record, rebuilds, and sees the practice disappear — on a branch, thrown away afterwards. This is not part of the gate and proves nothing; it exists so the mechanics are not being learned for the first time while holding a real safety report.

### Sitting 1 — the channel

**Nothing is removed in this sitting, and nothing needs to be live.** Lane 1 is the only lane that takes material down, and it is wholly in sitting 2. What is being tested here is whether a message reaching the address gets detected, judged, answered, recorded, and deleted — all of which is mailbox work and none of which touches the site.

**What the lane-2 message refers to.** Write it about a real practice record in `content/practices/`, named by its slug, as a reader would describe it: something in it is wrong, or hard to follow. The records are placeholder drafting, which does not matter — the lane-2 output is a *classification*, not an edit. The editor reads the record as it stands in git and decides whether the reported problem would be an [editorial correction or a substantive change](#triage-the-four-lanes). The incident record carries the slug and the current commit SHA as its version pointer.

If the honest answer is *substantive change*, the drill records that and stops. Returning a record to review is the ordinary governance path, not part of this gate, and these records have no approval to void yet.

Three test messages, one each for lanes 4, 3, and 2, worked end to end.

- [x] **Lane 4 (spam)** — discarded. **No incident record created**, and confirm that: the absence is the thing being tested.
- [x] **Lane 3 (distress)** — the distress reply sent, once, as written. Incident record created and closed on the reply. **No follow-up question sent**, and no second reply when the drill message is answered.
- [x] **Lane 2 (wrong content)** — assessed as an editorial correction or a substantive change. The one follow-up sent, in its drafted wording. Incident record carries the version pointer.
- [x] **One-business-day detection demonstrated** — the elapsed time between a message being sent and the editor reading it is recorded, and it is under one business day. Demonstrated, not asserted. The *action* half of the same promise is measured in sitting 2.
- [x] **Backup access exercised** — the chaplain reviewer signs in and reads the drill messages during the sitting, not afterwards and not on a screenshot.
- [x] **Replies landed in an inbox, not a spam folder** — checked at the receiving end for every reply sent, against more than one provider. A reply the reporter never sees fails the channel as completely as never sending one.
- [x] **Source-email deletion performed** on all three, trash and quarantine included, inside the procedure's own timing rather than at the end of the day.
- [x] **Sanitized incident records** for lanes 2 and 3, checked against the [field list](#the-incident-register) — nothing extra in them.

Lane 1 is deliberately absent. Its closing reply says the material *has been removed*, which cannot truthfully be sent before it has been; opening a lane-1 record here would leave it hanging until #33 lands, and its source email would hit the 30-day deletion maximum long before the record could close. Lane 1 is worked whole, in sitting 2, on a fresh message.

### Sitting 2 — the withdrawal

Blocked on [#31](https://github.com/inarush0/spiritual-collective/issues/31) and [#33](https://github.com/inarush0/spiritual-collective/issues/33). Two fresh test messages, each worked end to end in a single session.

- [ ] **Lane 1 (safety)** — protective action in the session the message is read in: `publication: withdrawn` on a real record, on `main`, with the beta rebuilt.
- [ ] **The withdrawal confirmed as a reader sees it**, not as a build log reports it — the practice gone from every list that offered it, and its URL serving the 200 "not available right now" page rather than a 404, on all three audience paths including the stepped-view URLs.
- [ ] **Chaplain notified and the record returned to review**, so the removal cannot become permanent by neglect.
- [ ] Acknowledgement sent, then the closing reply in its **removed** variant. Incident record closed.
- [ ] **Lanes 1 + 3 combined** — a second message carrying both a safety claim and distress. Beyond what §6 asks for, and the case the channel most exists for: the protective action happens, the distress reply goes *instead of* the acknowledgement, one incident record carries both lanes and closes on the content lane's terms, and **no follow-up question is sent**.
- [ ] **Receipt to protective action, under one business day**, recorded for both messages. This is the half of the promise sitting 1 cannot measure.
- [ ] **No code change and no branch operation was required.** If either was, that is a finding against #31 rather than a note in the margin — the whole design of withdrawal is that it is a one-field edit.
- [ ] **The content restored through the ordinary gates** afterwards, and the restoration confirmed on the beta. Restoration that turns on clinical safety needs a **new** consult; the original does not stretch to cover it.
- [ ] **Source-email deletion performed** on both, trash and quarantine included.
- [ ] **Sanitized incident records** checked against the [field list](#the-incident-register), including the combined record's `1 + 3` lane entry.

## Before the address ships

The last box is the one that touches code, and it is last on purpose.

- [x] The mailbox exists, on the resource's own domain, with MX, SPF, DKIM, and DMARC verified live
- [x] [Provisioning](#provisioning) otherwise complete — confirmed backup access, spam quarantined rather than discarded
- [x] [The shared vault](#the-shared-vault) holds the Fastmail password, the recovery code, and the register's link — all three read back by the chaplain reviewer from their own device
- [x] Domain auto-renew confirmed on, with renewal warnings reaching an address that a domain expiry would not take down
- [ ] The daily check is in place, with the handoff agreed with the chaplain reviewer
- [x] [The three replies](#the-three-replies) agreed by editor and chaplain, via [the review packet](accountability-replies-review.md) — agreed as drafted, nothing held, transcription confirmed
- [x] [Both availability notices](#the-temporary-availability-notice) agreed
- [ ] Somewhere the notices can be published from quickly, decided and written down
- [x] [The incident register](#the-incident-register) exists outside this repository, created empty and now carrying sitting 1's drill records, marked as such
- [x] The register shared with the chaplain reviewer
- [x] [The drill](#the-drill), **sitting 1** — the channel, passed in full
- [ ] [The drill](#the-drill), **sitting 2** — the withdrawal, after [#31](https://github.com/inarush0/spiritual-collective/issues/31) and [#33](https://github.com/inarush0/spiritual-collective/issues/33)
- [ ] **Only then**: replace `REPORT_ADDRESS` in [`src/framing/about.ts`](../../src/framing/about.ts) with the real address

An address that merely looked real would take reports into a void, which is the harm this channel exists to prevent. Until the boxes above are ticked, the unroutable placeholder is the honest thing to ship.
