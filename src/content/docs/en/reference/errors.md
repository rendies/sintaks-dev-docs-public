---
title: Errors
description: Gateway error shape and status semantics.
---

Errors follow the OpenAI-compatible error envelope:

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

| Status | Type | Meaning | Retry guidance |
|---|---|---|---|
| `400` | `invalid_request_error` | The request body, model, endpoint, parameters, or tool schema is invalid. | Fix the request; do not retry unchanged. |
| `401` | `invalid_request_error` | The API key is missing, malformed, revoked, or invalid. | Check the API key. |
| `402` | `insufficient_quota` | The balance cannot cover the request reservation. | Top up the organization balance. |
| `408` | `upstream_error` | The provider did not respond before the gateway timeout. | Retry with backoff; check usage before repeating long requests. |
| `429` | `rate_limit_error` | The provider or gateway rate limit was reached. | Retry after a delay with exponential backoff. |
| `499` | `request_canceled` | The client disconnected or canceled the request. | Retry only if the operation is safe to repeat. |
| `500` | `server_error` | An unexpected gateway error occurred. | Retry with backoff and include `X-Request-ID` when contacting support. |
| `501` | `invalid_request_error` | The requested capability or endpoint is not implemented. | Use a supported endpoint or model. |
| `502` | `upstream_error` | The provider rejected the request or returned a provider-side error. | Fix request/model compatibility or retry only when appropriate. |
| `503` | `upstream_error` | The provider is temporarily unavailable. | Retry with exponential backoff. |
| `504` | `upstream_error` | The provider request timed out. | Retry with backoff; check usage before repeating. |

Every response carries `X-Request-ID`. Include it in support requests; the same ID keys your usage history and the provider call.

A provider response after the request was accepted may still consume tokens and affect your balance. Check the Usage & Audit Log before retrying.
