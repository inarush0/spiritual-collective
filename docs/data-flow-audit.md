# First-release data-flow audit

Status: **awaiting live Cloudflare project verification**.

This audit records the first release's deliberately small data flow. It is not
complete until the two projects in
[`docs/runbooks/cloudflare-pages.md`](./runbooks/cloudflare-pages.md) exist and
the verification record below has a role and date.

## Browser-visible flow

| From | To | Data | Purpose | Project storage |
| --- | --- | --- | --- | --- |
| Reader's browser | Cloudflare Pages, same origin | Ordinary HTTP request metadata, including IP address and user agent | Serve prerendered static files | None configured by this project |
| Reader's mail app, only after choosing the accountability address | Mailbox providers | Sender address and message | Voluntary harm report | Governed by the accountability-mailbox runbook |

The site has no accounts, cookies, client JavaScript, analytics, embeds, web
fonts, or third-party requests. It has no Pages Functions or other server-side
runtime. Production and beta use the same posture.

## Host configuration to verify

- Web Analytics is disabled on both Pages projects.
- No Logpush job, Log Explorer dataset, or other optional request-log product
  is enabled for either project.
- Where the account or an attached own-domain zone exposes HTTP Logpull
  retention, retention is disabled. Cloudflare documents disabled as the
  default; verify rather than assume it.
- Preview branch deployments are disabled, so only the production and beta
  `main` deployments create stable release surfaces.
- Beta at `beta.spiritual-collective.com` has no Access policy or password. It
  is not publicly linked; its discovery controls are the site-wide `noindex`
  response header and full crawler disallow.

Cloudflare necessarily processes edge request metadata to serve the files.
This project does not describe that processing as “nothing stored”; it enables
no optional collection and selects the shortest retention the account exposes.

## Evidence

- `npm run gates` checks every generated production and beta page for
  third-party references and client JavaScript, and checks beta's crawl-control
  files.
- `npm run verify:deployment -- <production-url> <beta-url>` checks the live
  review bar, production/beta catalog split, pending marker, absence of injected
  scripts and third-party references, and beta crawl controls.

## Live verification record

| Role | Date | Production project | Beta project | Optional log retention | Result |
| --- | --- | --- | --- | --- | --- |
| _pending_ | _pending_ | _pending_ | _pending_ | _pending_ | _pending_ |

Record role, not identity. The public hostnames are
`spiritual-collective.com` and `beta.spiritual-collective.com`; the generated
Pages project names may be recorded here as deployment evidence.
