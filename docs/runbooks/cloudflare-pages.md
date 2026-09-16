# Cloudflare Pages: production and beta

This is the one-time setup for the two Git-connected Pages projects required by
[`docs/spec/07-technical-constraints.md`](../spec/07-technical-constraints.md).
Both projects build `main` from `inarush0/spiritual-collective`. Their only
behavioral difference is `SITE_BUILD=beta` on the beta project.

## Shared project settings

Create each project from **Workers & Pages → Create application → Pages →
Import an existing Git repository** and choose this repository. Use these
settings for both:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run gates && npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Automatic production deployments | enabled |
| Preview branch deployments | none |
| Web Analytics | disabled |
| Access policy | disabled |

The checked-in `.node-version` selects the same Node major used by CI. Preview
branches are disabled because review happens on the beta project's `main`
deployment, not on a third release surface.

For both projects, confirm that no optional request-log product (Logpush, Log
Explorer, or equivalent) is enabled. If the account or attached own-domain zone
exposes HTTP Logpull retention, leave it disabled or turn it off. Record the
effective setting, role, and date in the
[data-flow audit](../data-flow-audit.md); project setup is incomplete while its
live verification row is pending.

## Production project

Do not define `SITE_BUILD`. Unset is deliberately the production-safe default:
only approved records are offered, with no review bar or pending marker.

## Beta project

Choose an unguessable project name. In its production environment variables,
set `SITE_BUILD` to `beta`. Do not enable a password or Access policy: the beta
is unlisted and uncrawlable, not private.

The beta build writes two Cloudflare control files into `dist/`:

- `_headers` applies `X-Robots-Tag: noindex` to every response.
- `robots.txt` disallows the entire site.

`npm run gates` checks both files in the built artifact. After both projects
finish deploying, verify what Cloudflare actually serves:

```sh
npm run verify:deployment -- https://<production-project>.pages.dev https://<unguessable-beta-project>.pages.dev
```

The command fails unless the origins are distinct HTTPS sites, only beta shows
the review bar and pending records, production excludes pending records, both
sites preserve the zero-script/zero-third-party posture, Cloudflare serves
beta's `noindex` response header across multiple routes, and beta's `robots.txt`
disallows the whole site. Record the two stable project URLs outside git; do
not add a public link to the beta.

## Promotion and withdrawal check

Once the projects exist, complete sitting 2 of the
[accountability-mailbox runbook](./accountability-mailbox.md): change only one
record's `publication` field, merge through the ordinary PR path, and confirm
both projects rebuild from `main`. Do not use a deployment branch.
