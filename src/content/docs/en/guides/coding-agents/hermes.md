---
title: Hermes
description: Configure sintaks.dev with Hermes and other OpenAI-compatible CLI agents.
---

Hermes and other OpenAI-compatible CLI agents connect to sintaks.dev using a custom provider. The setup uses the standard provider settings: base URL, API key, and model ID.

## Configuration

Set the provider to **OpenAI-compatible** with:

| Setting | Value |
|---|---|
| Provider type | OpenAI-compatible / custom OpenAI provider |
| Base URL | `https://api.sintaks.dev/v1` |
| API key | Your sintaks.dev API key |
| Model | An active model ID from `GET /v1/models` |

Many agents also read environment variables:

```bash
export OPENAI_BASE_URL="https://api.sintaks.dev/v1"
export OPENAI_API_KEY="sk-..."
```

Then launch the agent as usual. If the agent only supports preset providers, look for a custom endpoint or OpenAI-compatible option in its documentation.

## Troubleshooting

- **`401` invalid API key** — check the key and confirm it has not been revoked.
- **`402` insufficient quota** — add balance to the organization in the portal.
- **Unknown model** — use an active model ID from `GET /v1/models`; model IDs are case-sensitive.
- **Provider or connection errors** — confirm the base URL is exactly `https://api.sintaks.dev/v1`.

Include the `X-Request-ID` from a failed request when contacting support.
