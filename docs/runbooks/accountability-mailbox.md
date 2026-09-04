# Runbook: the accountability mailbox

The operating procedure that turns the address on `/about/` into a **channel** rather than an address. [`docs/spec/05-governance.md`](../spec/05-governance.md) is authoritative for the rules; this document is how they are carried out, and it holds the drafted wording the procedure needs at the moment it is needed. Tracked in [#39](https://github.com/inarush0/spiritual-collective/issues/39).

> **Status: mailbox provisioned, drill not yet run.** `REPORT_ADDRESS` in [`src/framing/about.ts`](../../src/framing/about.ts) is still `report@example.invalid`, deliberately unroutable. The release gate in [`docs/spec/06-release-criteria.md`](../spec/06-release-criteria.md) holds production until every box in [Before the address ships](#before-the-address-ships) is ticked.

**Nothing in this file is an identity.** The editor and the chaplain reviewer are named by role, here as everywhere in this repository ([ADR 0002](../adr/0002-two-person-asymmetric-governance.md)). Nothing from a real report — sender address, message text, or paraphrase — is ever added to this file or any other file in git.

## Provisioning

Owner: **editor**. All of it is human work; none of it is in this repository.

- [ ] **A real mailbox on the resource's own domain.** Not a personal address, not a free-provider address on someone's own name: the address is spoken on `/about/` as the resource's accountability channel, and it must survive one person changing jobs, phones, or providers.
- [ ] **Owner access confirmed** — the editor can read, reply from the address, and permanently delete.
- [ ] **Backup access confirmed** — the chaplain reviewer can do the same, tested by actually signing in, not by being handed a credential. A credential nobody has exercised is an unavailable credential, and §6 fails publication on exactly that.
- [ ] **No forwarding into a personal archive, and no provider-side backup that outlives the 30-day maximum.** Source-email deletion is a promise the about page makes on the resource's behalf; a copy sitting in someone's personal mail history breaks it silently. Disable auto-archive, auto-forward, and any "deleted items keep forever" retention. A short provider restore window is acceptable and must be [written down](#what-deleted-actually-means) rather than assumed away.
- [ ] **Spam filtering set to quarantine, not silent discard**, and the quarantine checked on the same daily rhythm. A safety report that a filter ate is indistinguishable from a channel that does not exist.
- [ ] **Outbound mail authenticated**, so the three replies land in an inbox rather than a spam folder. A distress reply nobody sees is the harm this channel exists to prevent, and a young domain's first outbound mail is exactly where it happens.
- [ ] **Recovery codes and the registrar login in a vault both people can reach.** The mailbox surviving one unavailable person is the whole point of a backup, and it is not a backup if recovering it needs the other person.

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

### What "deleted" actually means

**Fastmail keeps a short restore window** — on the order of a week — during which deleted mail can be recovered by the account owner, and it is not a setting that can be turned off. That is well inside the 30-day maximum, so the promise on `/about/` holds. It is written down here rather than glossed because the honest sentence is *deleted, with a provider restore window of about a week*, not *deleted instantly*, and a procedure that overstates its own guarantees is the kind that quietly stops being followed. Confirm the current figure against Fastmail's own documentation before the drill.

## The daily rhythm

**Checked at least once each business day** by the editor. Initial response within **two business days**. **No resolution deadline is promised**, to anyone, ever.

Each check is one **mailbox-review session**, and it is the unit that matters: a report that names a specific, plausible harm gets its protective action *during the session it is read in* — before investigation, before any reply — and no later than one business day after receipt under normal coverage.

**Planned absence is an explicit handoff.** The editor tells the chaplain reviewer the dates and confirms they will check; the chaplain confirms back. An assumed handoff is not a handoff. If neither person can monitor the address for more than one business day, publish the [temporary availability notice](#the-temporary-availability-notice) — the address stays visible. The resource must never silently accept reports, and must never remove its accountability channel.

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

For the case where neither the editor nor the chaplain reviewer can monitor the address for more than one business day. **The address stays visible**; this sentence goes with it, and comes down the day monitoring resumes.

> This address is not being checked at the moment and will be again from **&lt;date&gt;**. Nothing sent here will be read before then. If you need help right now, start with the people already caring for you — your care team, your nurse, or your chaplain.

Two things it must not do: it must not remove the address, and it must not soften the date into "shortly" or "as soon as possible". An inaccurate notice is worse than none, because a reader will believe it.

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

**Never** in the register: sender identity, quoted message text, diagnosis, institution, or narrative detail. If a field seems to need a sentence of story to make sense, that is the signal it is being written down at the wrong grain — the version pointer and the outcome carry the meaning.

**A content incident closes only when** the material is retired, or a corrected or restored version has passed every applicable gate. **A distress-only incident closes** after the boundary response is sent. **A combined record closes on the content lane's terms** — the reply has already gone, and the material is what is left open.

## Deleting the source email

**As soon as clarification and the closing response are complete. Hard maximum 30 days**, unless preservation is legally required. Permanent deletion, including from the trash and any quarantine copy.

It is **never** copied into git, into a review record, into an issue, into a commit message, or into a chat with an assistant. The incident record is what survives, and it is deliberately too thin to reconstruct the message from.

## The drill

The release gate in [§6](../spec/06-release-criteria.md) — owner: **editor**, run once against the real mailbox before the address ships. **Publication fails if any step depends on an unavailable person, an inaccessible credential, or an unwritten judgment.**

Send four test messages to the real address from an address outside the project, one per lane, and work them exactly as the procedure says:

- [ ] **Lane 4 (spam)** — discarded, no incident record created.
- [ ] **Lane 3 (distress)** — distress reply sent, once; incident record created and closed on the reply.
- [ ] **Lane 2 (wrong content)** — assessed as an editorial correction or a substantive change; incident record carries the version pointer.
- [ ] **Lane 1 (safety)** — protective action in the same session: a real **withdrawal or revert performed** against the real site, chaplain notified, record returned to review. Then acknowledgement sent, closing sent, incident record closed, and the content restored through the ordinary gates afterwards.
- [ ] **Lanes 1 + 3 combined** — a fifth message carrying both a safety claim and distress. Beyond what §6 asks for, and the case the channel most exists for: the protective action happens, the distress reply goes *instead of* the acknowledgement, one incident record carries both lanes, and no follow-up question is sent.
- [ ] **One-business-day detection demonstrated** — the elapsed time between sending and the protective action is recorded, and it is under one business day. Demonstrated, not asserted.
- [ ] **Backup access exercised** — the chaplain reviewer signs in and reads the mailbox as part of the drill, not afterwards.
- [ ] **Replies landed in an inbox, not a spam folder** — checked at the receiving end for every reply sent during the drill, ideally against more than one provider. A reply the reporter never sees fails the channel as completely as never sending one.
- [ ] **Source-email deletion performed** on all four test messages, trash and quarantine included.
- [ ] **A sanitized incident record created** for lanes 1–3, and checked against the field list above — nothing extra in it.

## Before the address ships

The last box is the one that touches code, and it is last on purpose.

- [x] The mailbox exists, on the resource's own domain, with MX, SPF, DKIM, and DMARC verified live
- [ ] [Provisioning](#provisioning) otherwise complete — confirmed backup access, spam quarantined rather than discarded, recovery in the shared vault
- [ ] The daily check is in place, with the handoff agreed with the chaplain reviewer
- [ ] [The three replies](#the-three-replies) agreed by editor and chaplain
- [ ] [The temporary availability notice](#the-temporary-availability-notice) agreed, and somewhere it can be published from quickly
- [ ] [The incident register](#the-incident-register) exists, empty, outside this repository
- [ ] [The drill](#the-drill) passed in full
- [ ] **Only then**: replace `REPORT_ADDRESS` in [`src/framing/about.ts`](../../src/framing/about.ts) with the real address

An address that merely looked real would take reports into a void, which is the harm this channel exists to prevent. Until the boxes above are ticked, the unroutable placeholder is the honest thing to ship.
