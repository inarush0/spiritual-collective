# Cloudflare Pages: production and beta

This is the one-time setup for the two Git-connected Pages projects required by
[`docs/spec/07-technical-constraints.md`](../spec/07-technical-constraints.md).
Both projects build `main` from `inarush0/spiritual-collective`. Their only
behavioral difference is `SITE_BUILD=beta` on the beta project. Readers use
`spiritual-collective.com` for production and `beta.spiritual-collective.com`
for beta; the generated `pages.dev` hostnames are deployment plumbing, not the
published addresses.

## Preserve the accountability mailbox first

The domain is registered and its DNS is currently hosted at Squarespace. The
working Fastmail mailbox depends on the MX, SPF, DKIM, and DMARC records listed
in the [accountability-mailbox runbook](./accountability-mailbox.md#as-provisioned).

Cloudflare requires an apex Pages domain to be a zone on the same Cloudflare
account, with the domain's nameservers pointed to Cloudflare. Treat this as a
DNS migration:

1. Add `spiritual-collective.com` as a Cloudflare zone, but do not change the
   registrar's nameservers yet.
2. Recreate every existing Squarespace DNS record in Cloudflare, including all
   five Fastmail record groups exactly as provisioned. Preserve any unrelated
   records too.
3. Compare the complete old and new record sets. A missing mail record blocks
   the cutover.
4. Change the authoritative nameservers at Squarespace to the pair Cloudflare
   assigns.
5. After propagation, verify the Fastmail MX, SPF, all three DKIM CNAMEs, and
   DMARC records publicly, then send and receive a real mailbox test.
6. Update the accountability-mailbox runbook's “As provisioned” paragraph from
   Squarespace DNS to Cloudflare DNS only after those checks pass.

Do not remove the Squarespace zone records during propagation. Squarespace
remains the registrar; only authoritative DNS moves.

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

After its first successful deployment, open **Custom domains → Set up a
domain**, attach `spiritual-collective.com`, and wait for the hostname and TLS
certificate to become active. Because the apex is now a Cloudflare zone, Pages
creates the required flattened CNAME record.

## Beta project

In its production environment variables, set `SITE_BUILD` to `beta`. Attach
`beta.spiritual-collective.com` under **Custom domains** and wait for the
hostname and TLS certificate to become active. Do not enable a password or
Access policy: the beta is unlisted and uncrawlable, not private. Its ordinary
`beta` label is intentional; obscurity is not one of its safeguards.

The beta build writes two Cloudflare control files into `dist/`:

- `_headers` applies `X-Robots-Tag: noindex` to every response.
- `robots.txt` disallows the entire site.

`npm run gates` checks both files in the built artifact. After both projects
finish deploying, verify what Cloudflare actually serves:

```sh
npm run verify:deployment -- https://spiritual-collective.com https://beta.spiritual-collective.com
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
| `https://<production-project>.pages.dev` | `https://spiritual-collective.com` |
| `https://<beta-project>.pages.dev` | `https://beta.spiritual-collective.com` |

The custom domains are the stable addresses used by the live verifier and all
human review. Re-run the verifier after enabling the redirects.

## Promotion and withdrawal check

Once the projects exist, complete sitting 2 of the
[accountability-mailbox runbook](./accountability-mailbox.md): change only one
record's `publication` field, merge through the ordinary PR path, and confirm
both projects rebuild from `main`. Do not use a deployment branch.
