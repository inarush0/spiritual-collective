# Review packet: what the accountability mailbox says back

Everything the resource sends to a person who wrote to `report@…`, gathered in one place so the chaplain reviewer can read it as a reader receives it — one message at a time, in order, without the surrounding procedure. **This is the artifact to send.**

[`docs/runbooks/accountability-mailbox.md`](accountability-mailbox.md) is authoritative for the wording. This packet is a **snapshot of it for review**, pinned to a version; when the chaplain's answers come back, the agreed wording is edited into the runbook and this packet is regenerated from it, never the other way round. Two copies of safety-critical sentences drifting apart is the defect this note exists to prevent.

| | |
| --- | --- |
| **Sent to** | chaplain reviewer |
| **Sent by** | editor |
| **Version under review** | filled in on the copy that is sent — see [The version](#the-version) |
| **Date sent** | filled in on the copy that is sent |
| **Tracked in** | [#39](https://github.com/inarush0/spiritual-collective/issues/39) |

**This file is a template and stays one.** The two rows above are never filled in here and committed. What the chaplain reviewer receives is a **copy** — an email, a document, whatever suits them — with the version and date written into it. The copy is the artifact under review; this file is what the copy is made from.

That is not tidiness. Writing the version into this file would change this file, which would change its version: a record that invalidates itself the moment it is written. The [Outcome](#outcome) below is the part that *is* committed, and it can be, because by then the version it names is a commit that already exists.

**No identity appears in this packet or in the record of its outcome** — role, date, and version only ([§5](../spec/05-governance.md), [ADR 0002](../adr/0002-two-person-asymmetric-governance.md)).

### The version

A git commit SHA, for the same reason a review record carries one: it tells you later whether these sentences changed after the chaplain reviewer agreed to them.

**Pin it to the runbook, not to this packet.** The wording under review lives in [`accountability-mailbox.md`](accountability-mailbox.md); this file only carries a copy of it. An approval goes stale when a *reply* changes, and a reply changing means that file changing.

```
git log -1 --format=%h -- docs/runbooks/accountability-mailbox.md
```

This over-triggers — editing the drill section bumps the SHA without touching a single reply, and the wording will look unapproved when it is not. That is the safe direction to be wrong in. It costs one question to the chaplain reviewer and can only ever make you re-check an approval that still held; the opposite error leaves a changed reply wearing an approval that no longer covers it.

## Why this one is reviewed as a document

[§5](../spec/05-governance.md) says a tier-2 framing surface is reviewed **on the beta release, not on a document or a diff**, and that rule is right: a sentence reads differently on a phone at 3am than in a list. These sentences are the exception, because they are never on the site. They arrive in an inbox, alone, usually in the worst hour the reader has had. There is no beta to review them on, and there never will be.

So the surface is reviewed as a document, and the **evidence discipline is the tier-2 one** rather than the lighter bar [#39](https://github.com/inarush0/spiritual-collective/issues/39) sets: the chaplain answers however suits them, the editor **transcribes the answers into [Outcome](#outcome) and sends the transcription back for confirmation**, and the evidence is the record plus that confirmation.

They are not folded into [#40](https://github.com/inarush0/spiritual-collective/issues/40) with the rest of the framing copy, for two reasons. #40 is blocked on the beta deploy, and these do not need it. And #40's surface is the resource talking to a reader who is browsing; this is the resource talking to a reader who has just told it something went wrong.

**One contested sentence holds only itself.** A reply that needs work is revised and re-sent; the other two are agreed and the drill proceeds on them.

---

## 1. Acknowledgement

Sent once, to a report about content, when no distress is present.

> Thank you for writing. Your message reached us and someone is looking at it.
>
> This address is not monitored urgently and it is not a way to reach help now. If you need help right now, start with the people already caring for you — your care team, your nurse, or your chaplain. The number on your own paperwork reaches them.
>
> We may not be able to send you an individual explanation of what we decide, but nothing you have told us is being ignored.

**The last sentence is the one to weigh.** It declines to promise an individual answer while saying the report was not discarded. Those two things are in tension, and the sentence is trying to hold both without doing either dishonestly.

## 2. Distress

Sent **in place of** the acknowledgement — never in addition — whenever a message carries distress, including when it is also a safety report about content.

**One response. The reader is not assessed, not counselled, not promised follow-up, and not drawn into an exchange.** A second distress message from the same person gets an incident record and no second reply.

> Thank you for writing, and I am sorry things are hard right now.
>
> This mailbox cannot give immediate help or pastoral care, and I do not want to leave you waiting on it. The people already caring for you are the ones to reach first — your care team, your nurse, or your chaplain. The number on your own paperwork reaches them.
>
> In the US, if you are in immediate danger, you can call or text 988, the Suicide and Crisis Lifeline. If someone is in immediate physical danger, call 911.

The crisis wording matches `CRISIS_LINES` in [`src/framing/safety.ts`](../../src/framing/safety.ts), in the same fixed order — the people already caring for you, then 988, then 911 — so the mailbox and the site say the same thing to the same person.

**This is the hardest one in the packet**, and the one most worth the chaplain's time. It has to decline to be a care relationship without reading as a door closing on someone who just reached for one.

## 3. Closing

Sent once, after the report is worked. Says only which of three things happened.

> Thank you again for writing. The material you told us about has been removed.

> Thank you again for writing. The material you told us about has been corrected.

> Thank you again for writing. We reviewed the material you told us about and have not changed it.

Each thanks the reporter **without disputing their experience, declaring causation, exposing internal deliberation, or promising future safety.** Nothing about who reviewed it or what was argued.

Never: *we have made sure this cannot happen again* · *this was already reviewed by a chaplain* · *we do not believe this caused any harm*.

**The third variant is the exposed one.** It tells someone who reported a harm that nothing changed, in one sentence, with no defence offered — deliberately, because a defence would be an argument with a person about their own experience. Whether one bare sentence is the kind thing or the cold thing here is a judgment worth a second reader.

---

## Also sent to readers

Not among the three replies [#39](https://github.com/inarush0/spiritual-collective/issues/39) names, and included because they reach a reader the same way and the same person should read them.

### The one follow-up

The only question the editor may ask, at most once, and only about the material.

> Thank you — one question so we can find the right thing: which page or practice were you looking at, and what appeared wrong or unsafe about it?

**Never sent to a message carrying distress.** Asking *which page were you looking at* of someone who has just said they do not want to be here is a request for paperwork at the worst possible moment.

Never asks for identity, age, diagnosis, institution, or medical history — not to understand the context, not to assess severity. An unanswered follow-up never reverses a protective action: the withdrawal stands.

### The temporary availability notice

Published beside the address when neither person can monitor it for more than one business day. The address stays visible.

> This address is not being checked at the moment and will be again from **&lt;date&gt;**. Nothing sent here will be read before then. If you need help right now, start with the people already caring for you — your care team, your nurse, or your chaplain.

It must not remove the address, and must not soften the date into *shortly* or *as soon as possible*. An inaccurate notice is worse than none, because a reader will believe it.

---

## What is being asked

Not a line edit. Four questions, and *no* to any of them is a useful answer:

1. **Does the distress reply close a door on someone reaching for help?** It is trying to be a boundary that is also kind. If it lands as a form letter, or as an institution declining liability, it fails at the only moment it exists for.
2. **Is there a sentence here that would make things worse for a parent whose child died last week, or for a teenager harmed by religion?** The same two readings the [§6](../spec/06-release-criteria.md) adversarial read applies to the site.
3. **Does anything promise more than the resource can do?** Two people, no urgency, no resolution deadline ever promised. A sentence that implies otherwise is a defect, not a warmth.
4. **Is the third closing variant — nothing changed — survivable to receive?**

And one standing question: **is there a message this mailbox will get that none of these three replies fits?** A missing reply shape is the failure that shows up under pressure, when someone writes one at the keyboard instead.

## Outcome

Transcribed by the editor from the chaplain's response, then **sent back to the chaplain for confirmation**. Nothing here until that confirmation arrives.

This section, unlike the template above, **is** filled in and committed. It can be: every SHA it names is a commit that already exists when it is written.

| Reply | Outcome | Date |
| --- | --- | --- |
| Acknowledgement | `agreed` / `agreed with changes` / `held` | |
| Distress | | |
| Closing — removed | | |
| Closing — corrected | | |
| Closing — no change | | |
| The one follow-up | | |
| Availability notice | | |

- **Date sent** `<date>` · **version sent** `<SHA of accountability-mailbox.md at that moment>`
- **Transcription confirmed by the chaplain reviewer on** `<date>`
- **Agreed changes carried back into** [`accountability-mailbox.md`](accountability-mailbox.md) **in** `<SHA>`

That last line is the one that matters a year from now. It says the approved wording and the shipped wording are the same thing.

Anything **held** is revised and re-sent as a new packet against a new version. A held reply does not go out in the drill, and does not ship.
