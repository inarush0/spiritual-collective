# Cloudflare Pages: production and beta

This is the one-time setup for the two Git-connected Pages projects required by
[`docs/spec/07-technical-constraints.md`](../spec/07-technical-constraints.md).
Both projects build `main` from `inarush0/spiritual-collective`. Their only
behavioral difference is `SITE_BUILD=beta` on the beta project. Readers use
`www.spiritual-collective.com` for production and
`beta.spiritual-collective.com` for beta; `spiritual-collective.com` redirects
permanently to `www`. The generated `pages.dev` hostnames are deployment
plumbing, not the published addresses.

For the one-time setup, run the interactive companion from the repository root:

```sh
scripts/setup-cloudflare-pages.sh
```

It opens each dashboard, pauses at every manual action, records only non-secret
project hostnames in `/tmp`, and runs the checks in this runbook. This document
remains the source of truth when dashboard wording changes.

## Keep DNS at Squarespace

The domain is registered and its DNS is currently hosted at Squarespace. The
working Fastmail mailbox depends on the MX, SPF, DKIM, and DMARC records listed
in the [accountability-mailbox runbook](./accountability-mailbox.md#as-provisioned).

Both Pages sites use subdomains, so Cloudflare does not need to become the
authoritative DNS provider. Keep the Squarespace nameservers and every Fastmail
record unchanged. Before and after adding the web records, compare the mail
records against the provisioned table and send and receive a real mailbox test.

The apex is not attached directly to Pages. Squarespace permanently forwards
`spiritual-collective.com` to `www.spiritual-collective.com`, with SSL enabled
and path forwarding set to **Maintain paths**. Squarespace does not allow DNS
editing while domain forwarding is active; a future DNS change therefore
requires temporarily removing and then restoring the forwarding rule.

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

After its first successful deployment:

1. In Pages, open **Custom domains → Set up a domain**, associate
   `www.spiritual-collective.com`, and wait for Cloudflare to provide the CNAME
   target.
2. In Squarespace DNS, create `www` as a CNAME to that generated
   `<production-project>.pages.dev` hostname.
3. Wait for Pages to show the custom hostname and TLS certificate as active.
4. In Squarespace domain forwarding, permanently redirect `@` to
   `www.spiritual-collective.com`, keep SSL on, and select **Maintain paths**.

## Beta project

In its production environment variables, set `SITE_BUILD` to `beta`. Attach
`beta.spiritual-collective.com` under **Custom domains**, then create a
Squarespace CNAME named `beta` pointing to the generated
`<beta-project>.pages.dev` hostname. Wait for the hostname and TLS certificate
to become active. Do not enable a password or Access policy: the beta is
unlisted and uncrawlable, not private. Its ordinary `beta` label is intentional;
obscurity is not one of its safeguards.

The beta build writes two Cloudflare control files into `dist/`:

- `_headers` applies `X-Robots-Tag: noindex` to every response.
- `robots.txt` disallows the entire site.

`npm run gates` checks both files in the built artifact. After both projects
finish deploying, verify what Cloudflare actually serves:

```sh
npm run verify:deployment -- https://www.spiritual-collective.com https://beta.spiritual-collective.com
```

The command fails unless the origins are distinct HTTPS sites, only beta shows
the review bar and pending records, production excludes pending records, both
sites preserve the zero-script/zero-third-party posture, Cloudflare serves
beta's `noindex` response header across multiple routes, and beta's `robots.txt`
disallows the whole site. Do not add a public link to the beta.

## Retire the generated hostnames

Each Pages project also receives a generated `<project>.pages.dev` hostname.
After both custom domains pass verification, configure account-level Bulk
Redirects with **Preserve query string**, **Subpath matching**, **Preserve path
suffix**, and **Include subdomains** enabled:

| Source | Destination |
| --- | --- |
| `https://<production-project>.pages.dev` | `https://www.spiritual-collective.com` |
| `https://<beta-project>.pages.dev` | `https://beta.spiritual-collective.com` |

The custom domains are the stable addresses used by the live verifier and all
human review. Re-run the verifier after enabling the redirects.

## Promotion and withdrawal check

Once the projects exist, complete sitting 2 of the
[accountability-mailbox runbook](./accountability-mailbox.md): change only one
record's `publication` field, merge through the ordinary PR path, and confirm
both projects rebuild from `main`. Do not use a deployment branch.
