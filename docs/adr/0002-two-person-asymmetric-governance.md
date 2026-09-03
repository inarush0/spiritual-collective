# Asymmetric two-person governance: approval to publish, never to remove

The resource publishes spiritual-care content to adolescents in pediatric hospice and palliative care, and it is maintained by two people — an **editor** and a **chaplain reviewer**, the latter an unpaid volunteer. We govern it by splitting authority asymmetrically rather than by giving both roles the same rights over the same acts.

**Publishing requires the chaplain reviewer's approval, and nothing overrides it.** They hold a veto on every user-facing word, not editorial ownership: they can stop anything shipping and force removal of anything shipped, but cannot compel the editor to write or ship anything. Nothing ever auto-promotes — no timeout, no lapse-into-approval, no "deemed approved after 30 days".

**Removing requires nobody's approval.** The editor may withdraw or soften any published content unilaterally and immediately. Restoration always follows every applicable gate, and an emergency removal notifies the chaplain and returns the record to review so it cannot become permanent by neglect.

An approval is a **signature over a specific version** of a record — role, date, and `approved_version`, never an identity, because this repository is public. A change that could alter what a person does or how safe it is voids that signature and returns the record to review, while the last approved version keeps serving.

## Why

Taking something down cannot harm a reader the way leaving it up can. Symmetric authority would either let one busy volunteer become the bottleneck on an urgent withdrawal, or introduce a timer that publishes unreviewed spiritual-care content to this audience — and both are worse than anything the asymmetry costs.

## Consequences

- **The chaplain reviewer is a single point of failure for publishing, deliberately.** A stall is a scheduling problem, and the only concession to time pressure is shrinking the review batch. Recruiting a second approver would be a staffing change, not a governance rewrite.
- **Approval and promotion are per record**, so one contested practice never holds up the rest, and a record whose gate is unmet is *held* rather than cut.
- **Withdrawal must degrade rather than block.** A production build can never fail because content was withdrawn, or an urgent removal would wait on writing a replacement.
- **No reviewer identity enters git.** Identity is verifiable by the editor and the reviewer alone, with the signed reply kept outside the repository — which also keeps the public trust posture (review stated as a role and a process fact) true in the one place nobody would look.
- **Editorial improvement must be safe to start.** Because a voided approval keeps serving the last approved version, beginning to edit a page can never accidentally remove it.

Decided in [#9](https://github.com/inarush0/spiritual-collective/issues/9), amended by [#13](https://github.com/inarush0/spiritual-collective/issues/13) (signatures carry role, not identity) and [#14](https://github.com/inarush0/spiritual-collective/issues/14) (a voided approval never unpublishes; the guide record is a second governed kind). Operational detail in [`docs/spec/05-governance.md`](../spec/05-governance.md).
