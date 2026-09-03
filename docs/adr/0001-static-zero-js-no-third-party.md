# Static prerendering, zero client JavaScript, no third-party requests

The resource serves adolescents and family members in pediatric hospice and palliative care, often on old or loaned devices over hospital wifi, and must collect no user-level data while remaining WCAG 2.2 AA accessible. We therefore build it as a fully prerendered static site — every state of the discovery journey is a real URL, no client JavaScript is required for anything essential, and production makes no requests to any third-party origin (no web fonts, no CDN libraries, no embeds, no analytics of any kind in the first release).

The three choices only make sense together: static prerendering is what makes zero-JS affordable, and zero-JS plus a single origin is what makes "we collect nothing" a claim two people can actually verify rather than assert.

## Consequences

- **Suggestion sets are fixed at build time.** With no runtime, the practices offered for a given answer are identical for every visitor until someone edits the content. "Unranked" is a presentation property (no numbering, no "best match"), not a per-visit shuffle. Reintroducing variation would cost either client JavaScript or an edge function, i.e. it would reopen this decision.
- **Success metrics cannot come from usage data.** With no analytics, release and validation criteria have to be built from review, testing, and qualitative feedback instead.
- **Every journey state must be enumerable.** Answer options are links to prerendered pages, and the low-energy variant is its own path rather than a query-string or JS toggle.
- Edge access logs still exist at any host. The posture is "we collect nothing ourselves and configure retention to the minimum available", documented in the data-flow audit rather than pretended away.
