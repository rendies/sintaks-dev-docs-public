---
title: Troubleshooting
description: Diagnose common sintaks.dev API errors and failures.
---

## Error envelope

Every error is a JSON object with `error.message`, `error.type`, `error.param`, and `error.code`. The full status matrix is in the [errors reference](/en/reference/errors/).

## 401: invalid API key

- The key is missing, malformed, revoked, or unknown.
- Create a key in the portal (**API keys**) — it is shown only once at creation.
- After revoking or rotating a key, allow up to a minute for the gateway to see the change.
- Check that the key is sent as `Authorization: Bearer <key>` and is not embedded in browser bundles.

## 402: insufficient balance

- The reservation (estimated input tokens plus the requested output limit) exceeds your balance.
- Top up in the portal; the minimum order is Rp10.000.
- Long requests with a large `max_tokens` hold a large reservation. Lower `max_tokens` or `max_completion_tokens` to reserve less.

## 400: invalid request

- **Unknown model** — the requested `model` is not in the active catalog. Call `GET /v1/models` for the current list.
- **Capability mismatch** — for example requesting image generation from a chat-only model, or an unsupported parameter for the model. `temperature` is ignored for reasoning models; `response_format` is not supported yet.
- **Malformed body** — verify JSON, message roles, `tool_call_id` on tool-role messages, and tool schemas. A rejected request is never charged.

## 429: rate limited

- The provider or gateway rate limit was reached.
- Retry with exponential backoff and jitter. Streaming long responses counts against the same limits.

## 5xx / 502 / 503: upstream failure

- The gateway or the upstream provider is temporarily unavailable.
- Retry with backoff. `GET /healthz` returns `200` when the gateway itself is up; a `503` on `/v1/*` means the upstream provider is unavailable.
- A request that reached the provider may still consume usage even if the connection failed. Check the Usage & Audit Log before retrying.

## Streamed requests that disconnect

- If the client disconnects mid-stream, the model keeps running and the final charge is estimated from what was already produced.
- Reconnect with `stream_options.include_usage: true` if you need exact token counts.

## Image generation problems

- The generated image is withheld if the upstream content filter blocks it; the request is billed because the provider still ran it.
- If you get `502 upstream provider returned no image`, the model answered with text instead of calling the image tool. Retry the same prompt; persistent failures usually mean the model does not support image generation.
- Images are always returned as hosted URLs; `response_format: b64_json` is rejected.

## Getting help

Every response carries `X-Request-ID`. Include it in support requests — it keys your usage history and lets support trace the exact provider call. Check the Usage & Audit Log first: it shows settled charges, refunds, and provider status for each request.