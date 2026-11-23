---
title: POST /v1/chat/completions
description: Streaming and non-streaming chat completions against the model catalog.
---

Creates a chat completion. Compatible with the OpenAI Chat Completions API — use it with the OpenAI SDK by pointing `base_url` at `https://api.sintaks.dev/v1`.

`POST https://api.sintaks.dev/v1/chat/completions`

Auth: `Authorization: Bearer <api key>`.

## Request body

```json
{
  "model": "openai/gpt-5.5",
  "messages": [
    { "role": "user", "content": "Halo" }
  ],
  "stream": false,
  "stream_options": { "include_usage": true },
  "temperature": 0.7,
  "max_completion_tokens": 512
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `model` | string | yes | A model ID from `GET /v1/models`. |
| `messages` | array | yes | Conversation messages (below). |
| `stream` | boolean | no | `true` for SSE streaming. |
| `stream_options.include_usage` | boolean | no | Emit a final usage chunk when streaming. |
| `max_tokens` | integer | no | Deprecated max tokens (OpenAI legacy). |
| `max_completion_tokens` | integer | no | Max tokens for the completion. |
| `temperature` | number | no | Sampling temperature (capability-gated). |
| `top_p` | number | no | Nucleus sampling. |
| `reasoning_effort` | string | no | `low` / `medium` / `high` (capability-gated). |
| `n` | integer | no | Number of completions to generate. |
| `stop` | string \| array | no | Stop sequences. |
| `tools` | array | no | Function definitions. |
| `functions` | array | no | Legacy function definitions. |
| `tool_choice` | string \| object | no | `auto` / `none` / `required` / `{type:function,...}`. |
| `response_format` | object | no | e.g. `{"type":"json_object"}` (capability-gated). |
| `seed` | integer | no | Determinism seed (capability-gated). |
| `logprobs` | boolean | no | Request logprobs (capability-gated). |
| `parallel_tool_calls` | boolean | no | Allow parallel tool calls (capability-gated). |

### Message objects

Each message has `role` (`system`, `developer`, `user`, `assistant`, or `tool`) and `content`. `content` is either a string or an array of parts:

```json
[
  { "type": "text", "text": "What is in the image?" },
  { "type": "image_url", "image_url": { "url": "https://..." } }
]
```

`assistant` messages may carry `tool_calls`; `tool` messages carry `tool_call_id`.

## Response (non-streaming)

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1730000000,
  "model": "openai/gpt-5.5",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "Halo!" },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 4,
    "completion_tokens": 2,
    "total_tokens": 6,
    "prompt_tokens_details": { "cached_tokens": 0, "cache_write_tokens": 0 },
    "completion_tokens_details": { "reasoning_tokens": 0 }
  }
}
```

| Field | Type | Description |
|---|---|---|
| `id` | string | Completion ID. |
| `object` | string | Always `chat.completion`. |
| `created` | integer | Unix epoch seconds. |
| `model` | string | The serving model. |
| `choices[].message.role` | string | `assistant`. |
| `choices[].message.content` | string | The generated text. |
| `choices[].message.tool_calls` | array | Tool calls, when requested. |
| `choices[].finish_reason` | string | `stop`, `length`, `content_filter`, or `tool_calls`. |
| `usage.prompt_tokens` | integer | Input tokens. |
| `usage.completion_tokens` | integer | Output tokens. |
| `usage.total_tokens` | integer | Total tokens. |
| `usage.prompt_tokens_details.cached_tokens` | integer | Tokens served from cache. |
| `usage.prompt_tokens_details.cache_write_tokens` | integer | Tokens written to cache. |
| `usage.completion_tokens_details.reasoning_tokens` | integer | Tokens spent on reasoning. |

## Streaming

With `"stream": true`, the response is SSE with `chat.completion.chunk` events carrying `choices[].delta` (`role`, `content`, `tool_calls`). When `stream_options.include_usage` is set, a final chunk with `usage` is emitted, and the stream ends with `data: [DONE]`.

## Example

```bash
curl https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.5",
    "messages": [{ "role": "user", "content": "Halo" }]
  }'
```
