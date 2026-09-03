# 04 — Accessibility

**WCAG 2.2 AA is the acceptance baseline** for the first release, chosen as a voluntary standard that also conforms to WCAG 2.1 ([#10](https://github.com/inarush0/spiritual-collective/issues/10)). Accessibility is named as a product principle, so the release bar is **zero known WCAG 2.2 AA failures** on any page type — not "no blockers found" ([#4](https://github.com/inarush0/spiritual-collective/issues/4)).

## Why the architecture does most of the work

Prerendered pages with no client JavaScript are the accessible default rather than something maintained against the grain: every state is a real URL, every option is an ordinary link, nothing appears or moves without a navigation, and there is no focus management to get wrong. The device reality — old and loaned phones, hospital wifi, screen readers — is the reason for the architecture, not a consequence of it ([ADR 0001](../adr/0001-static-zero-js-no-third-party.md)).

## Device and viewport baseline

- Last two versions of the major desktop browsers, plus iOS Safari and Android Chrome two majors back
- **Usable, not merely readable**, when modern CSS degrades
- Checked at **320 px width** and **200% zoom**, with reflow

## Machine-checked

Part of the blocking gate command (§7): **axe over every built page**, on every build. This covers roughly half of WCAG, which is why the human pass below is a release gate rather than a formality.

Also machine-checked and load-bearing for accessibility: no web fonts, no raster images, ≤ 100 KB transferred per page, no client JavaScript on any page.

## Human-tested, once per release

Owned by the release criteria (§6). Scope is **one instance of every page type**, not every record:

arrival · discovery question · suggestion set (including the set tail and the low-energy entry) · practice view · stepped view · standing guide · about page · the withdrawn-practice 200 page

Matrix:

| Axis | Coverage |
| --- | --- |
| Keyboard | end to end, every path, no trap, visible focus |
| Screen reader | VoiceOver on iOS Safari; NVDA on Windows |
| Viewport | 320 px |
| Zoom | 200%, with reflow |

Written up as a **conformance statement**, not a note. A partial-conformance claim would undercut a resource that names accessibility as a product principle. On zero-JS static pages this is hours, not days.

## Content-level accessibility

The plain-language checklist (§2) is an accessibility control as much as an editorial one: 6th-grade reading level, one idea per sentence, ≤ 5 steps, second person, no undefined jargon, whole practice view readable in under a minute. It is machine-checked before a record may enter review.

The **understandability** criterion in §6 — three lay adults, read-aloud, on the three hardest practices — is the human counterpart, testing whether a reader can tell what to do first and how to get out.
