---
title: POST /v1/messages
description: Streaming and non-streaming messages; compatible with the Anthropic Messages API.
---

Creates a message using the Anthropic Messages API shape. Use it with the Anthropic SDK (`base_url` = `https://api.sintaks.dev`; the SDK appends `/v1/messages`).

`POST https://api.sintaks.dev/v1/messages`

Auth: `Authorization: Bearer <api key>`.

## Request body

```json
{
  "model": "anthropic/claude-sonnet-5.5",
  "max_tokens": 512,
  "system": "You are concise.",
  "messages": [
    { "role": "user", "content": "Halo" }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `model` | string | yes | A model ID from `GET /v1/models`. |
| `max_tokens` | integer | yes | Maximum tokens to generate. |
| `messages` | array | yes | `role` (`user`/`assistant`) + `content` (string or content blocks). |
| `system` | string | no | System prompt. |
| `stop_sequences` | array | no | Stop sequences. |
| `temperature` | number | no | Sampling temperature. |
| `top_p` | number | no | Nucleus sampling. |
| `stream` | boolean | no | `true` for streaming. |
| `tools` | array | no | Tool definitions (`name`, `description`, `input_schema`). |
| `tool_choice` | object | no | Tool selection. |
| `service_tier` | string | no | Service tier. |
| `thinking` | object | no | `{ "type": "enabled", "budget_tokens": N }`. |

## Response

```json
{
  "id": "msg_...",
  "type": "message",
  "role": "assistant",
  "model": "anthropic/claude-sonnet-5.5",
  "content": [
    { "type": "text", "text": "Halo!" }
  ],
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 4,
    "output_tokens": 2,
    "cache_read_input_tokens": 0,
    "cache_creation_input_tokens": 0
  }
}
```

| Field | Type | Description |
|---|---|---|
| `id` | string | Message ID. |
| `type` | string | Always `message`. |
| `role` | string | Always `assistant`. |
| `model` | string | The serving model. |
| `content` | array | Content blocks: `text`, `tool_use` (with `id`, `name`, `input`), etc. |
| `stop_reason` | string | e.g. `end_turn`, `max_tokens`, `tool_use`. |
| `stop_sequence` | string | The stop sequence that fired, if any. |
| `usage.input_tokens` | integer | Input tokens. |
| `usage.output_tokens` | integer | Output tokens. |
| `usage.cache_read_input_tokens` | integer | Tokens read from cache. |
| `usage.cache_creation_input_tokens` | integer | Tokens written to cache. |

## Example

```bash
curl https://api.sintaks.dev/v1/messages \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-5.5",
    "max_tokens": 512,
    "messages": [{ "role": "user", "content": "Halo" }]
  }'
```
