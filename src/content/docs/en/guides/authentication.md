---
title: Authentication
description: API keys authenticate organizations at the gateway; browser sessions belong to the portal.
---

## API keys

Gateway calls authenticate with a bearer API key:

```bash
curl https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer sk-..."
```

- Keys authenticate an **organization**, not a user session.
- The raw key is shown once at creation. Only the SHA-256 hash is persisted.
- Revoking or rotating a key propagates to the gateway within about a minute; revoked keys receive `401`.
- Keep keys server-side. Never embed them in browser bundles or client apps.

## Portal sessions

The customer portal signs in through the platform's hosted auth (email verification, passwordless OTP or password) and exchanges the session for a short-lived JWT accepted by the platform. API keys are never used to sign in.

## Error semantics

| Status | Meaning |
|---|---|
| `401` | Missing, malformed, revoked, or invalid API key. |
| `402` | Authenticated, but the organization's IDR balance cannot cover the reservation. Top up first. |
| `503` | The request could not be completed upstream; it is safe to retry with the same request. |
