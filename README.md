# sintaks-dev-docs-public

Public source for the [sintaks.dev](https://sintaks.dev) developer documentation at
[docs.sintaks.dev](https://docs.sintaks.dev).

This repository contains only public, user-facing content: the Astro/Starlight
site source under `src/`, static assets under `public/` (OpenAPI 3.1, logos,
robots), and the build/deploy configuration. Internal material — deployment
runbooks, architecture decisions, product briefs, and agent instructions —
stays in the private `sintaks-dev-docs` repository and is never published here.

## Contents

- Quickstart
- Guides: authentication, pricing and balance, iPaymu top-ups, SDKs,
  examples (curl / JavaScript / TypeScript / Java), troubleshooting
- API reference: endpoints, errors
- OpenAPI 3.1 download (`public/openapi.yaml`)
- Changelog

The site is localized at `/id/` (default) and `/en/`.

## Local development

```sh
pnpm install
pnpm run dev
pnpm run build
pnpm run preview
pnpm run deploy   # uploads dist/ to docs.sintaks.dev via the local `sintaks` S3 profile
```

`DEPLOY_DRY_RUN=1 pnpm run deploy` previews the upload commands without running them.

## Ownership

`sintaks.dev` is owned and operated by [PT Trakk Digital Indonesia](https://trakk.id/), the company behind [trakk.id](https://trakk.id/).