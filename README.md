# sintaks.dev

**sintaks.dev** is an OpenAI-compatible AI API for Indonesian developers. Top
up an IDR balance, create an API key, and call chat, embeddings, or image
endpoints through one gateway — no credit card required, pay with QRIS or a
virtual account through iPaymu.

- API base URL: `https://api.sintaks.dev` (the `/v1` path is appended per request)
- Full documentation: [docs.sintaks.dev](https://docs.sintaks.dev)
- OpenAPI 3.1 spec: [`openapi.yaml`](https://docs.sintaks.dev/openapi.yaml)

sintaks.dev is developed by [PT Trakk Digital Indonesia](https://trakk.id/), the company behind [trakk.id](https://trakk.id/).

## Quickstart

### 1. Create an account

Sign up at [app.sintaks.dev](https://app.sintaks.dev) and verify your email.
An organization is created for you automatically.

### 2. Top up your balance

From the portal, create a top-up order in IDR (minimum Rp10.000) and pay it
through iPaymu. QRIS, virtual accounts, and e-wallets are supported. A
verified payment adds to your organization balance exactly once.

### 3. Create an API key

In the portal under **API keys**, create a key. The raw key is shown once —
store it somewhere safe. Only its SHA-256 hash is kept server-side.

### 4. Call the API

```bash
curl https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer sk-..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "messages": [{"role": "user", "content": "Halo sintaks.dev!"}]
  }'
```

Or point any OpenAI-compatible client at the gateway:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sintaks.dev/v1",
    api_key="sk-...",
)
resp = client.chat.completions.create(
    model="claude-sonnet-5-5",
    messages=[{"role": "user", "content": "Halo"}],
)
```

## Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /v1/models` | List active models available through the gateway. |
| `POST /v1/chat/completions` | Streaming and non-streaming chat completions against the model catalog. Tools and `tool_choice` are supported. |
| `POST /v1/embeddings` | Embedding vectors for text inputs; billed at the model's input-token rate. |
| `POST /v1/images/generations` | Image generation; results are hosted and returned as URLs. |

## Authentication

Gateway calls authenticate with a bearer API key:

```
Authorization: Bearer sk-...
```

- Keys authenticate an **organization**, not a user session.
- The raw key is shown once at creation; only the SHA-256 hash is persisted.
- Revoking or rotating a key propagates to the gateway within about a minute; revoked keys receive `401`.
- Keep keys server-side. Never embed them in browser bundles or client apps.

## Errors

Errors follow the OpenAI-compatible envelope:

```json
{
  "error": {
    "message": "insufficient credits",
    "type": "insufficient_quota",
    "param": null,
    "code": "insufficient_quota"
  }
}
```

| Status | Type | Meaning |
|---|---|---|
| `400` | `invalid_request_error` | Invalid request, model, parameter, or tool schema. Nothing is charged. |
| `401` | `invalid_request_error` | Missing, malformed, revoked, or invalid API key. |
| `402` | `insufficient_quota` | The balance cannot cover the request reservation. Top up first. |
| `408` / `504` | `upstream_error` | The provider did not respond before the timeout. |
| `429` | `rate_limit_error` | The provider or gateway rate limit was reached. |
| `499` | `request_canceled` | The client disconnected or canceled the request. |
| `5xx` | `server_error` / `upstream_error` | Gateway or provider failure; safe to retry with backoff. |

Every response carries `X-Request-ID` — include it in support requests; it
keys your usage history and the provider call.

## Billing

- Balance is IDR, added through iPaymu top-ups (QRIS, virtual accounts, e-wallets). Balance never expires.
- Every billable request is metered in two steps: **reserve** the worst-case cost before the provider call, then **settle** the actual cost after the provider reports usage. The difference is refunded immediately.
- A request that never reaches the provider is fully refunded; a request that failed upstream but consumed usage is billed for what it used and flagged in your usage history.
- Per-model rates are visible in the portal pricing page and updated automatically as the catalog changes.

## SDKs

The API is OpenAI-compatible, so existing clients work out of the box:

- **TypeScript / JavaScript**: official package [`@sintaksdev/sdk`](https://www.npmjs.com/package/@sintaksdev/sdk), or the `openai` package with `baseURL: "https://api.sintaks.dev/v1"`.
- **Python**: `openai` package with `base_url="https://api.sintaks.dev/v1"`.
- **Go**: official SDK [`github.com/rendies/sintaks-dev-go`](https://github.com/rendies/sintaks-dev-go).
- **Java / PHP / cURL**: see the [examples guide](https://docs.sintaks.dev/en/guides/examples/).

Copy-paste examples for every endpoint (chat, streaming SSE, embeddings,
images, error handling) across cURL, TypeScript, JavaScript, Python, Go,
Java, and PHP live in [EXAMPLES.md](EXAMPLES.md).

Guides for connecting sintaks.dev to agent platforms (Claude Code, Cursor,
Open WebUI, LiteLLM, Hermes and other OpenAI-compatible agents) and LLM
gateways (9router, etc.) — including prefixed model IDs like
`sintaks-prod/claude-sonnet-5` — live in [INTEGRATIONS.md](INTEGRATIONS.md).

## Documentation

- [Quickstart](https://docs.sintaks.dev/en/) — sign up, top up, first call
- [Authentication](https://docs.sintaks.dev/en/guides/authentication/)
- [Pricing and balance](https://docs.sintaks.dev/en/guides/pricing/)
- [Top-ups with iPaymu](https://docs.sintaks.dev/en/guides/top-ups/)
- [SDKs & libraries](https://docs.sintaks.dev/en/guides/sdks/)
- [Examples](https://docs.sintaks.dev/en/guides/examples/) — curl, JavaScript, TypeScript, Java
- [Troubleshooting](https://docs.sintaks.dev/en/guides/troubleshooting/)
- [API reference](https://docs.sintaks.dev/en/reference/endpoints/) and [errors](https://docs.sintaks.dev/en/reference/errors/)
- [Changelog](https://docs.sintaks.dev/en/changelog/)

The site is localized at `/id/` (Bahasa Indonesia, default) and `/en/`.