---
title: POST /v1/responses
description: Decision/response generation; compatible with the OpenAI Responses API.
---

Creates a response using the OpenAI Responses API shape. Use it with the OpenAI SDK's `responses` resource pointed at `https://api.sintaks.dev/v1`.

`POST https://api.sintaks.dev/v1/responses`

Auth: `Authorization: Bearer <api key>`.

## Request body

```json
{
  "model": "openai/gpt-5.5",
  "input": "What is the weather in Jakarta?",
  "instructions": "Answer concisely.",
  "max_output_tokens": 512,
  "stream": false
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `model` | string | yes | A model ID from `GET /v1/models`. |
| `input` | string \| array \| object | yes | The prompt, message list, or input items. |
| `instructions` | string | no | System-style instructions. |
| `max_output_tokens` | integer | no | Max output tokens. |
| `temperature` | number | no | Sampling temperature. |
| `top_p` | number | no | Nucleus sampling. |
| `tools` | array | no | Tool/function definitions. |
| `tool_choice` | string \| object | no | Tool selection. |
| `stream` | boolean | no | `true` for streaming. |

## Response

```json
{
  "id": "resp_...",
  "object": "response",
  "created_at": 1730000000,
  "status": "completed",
  "model": "openai/gpt-5.5",
  "output": [
    {
      "type": "message",
      "id": "msg_...",
      "role": "assistant",
      "status": "completed",
      "content": [ { "type": "output_text", "text": "..." } ]
    }
  ],
  "usage": { "prompt_tokens": 5, "completion_tokens": 4, "total_tokens": 9 }
}
```

| Field | Type | Description |
|---|---|---|
| `id` | string | Response ID. |
| `object` | string | Always `response`. |
| `created_at` | integer | Unix epoch seconds. |
| `status` | string | e.g. `completed`. |
| `model` | string | The serving model. |
| `output` | array | Output items (`message`, or `function_call` with `call_id`, `name`, `arguments`). |
| `output[].content[].type` | string | `output_text` (text) or `output_image`. |
| `output[].content[].text` | string | Generated text. |
| `usage` | object | Token usage (`prompt_tokens`, `completion_tokens`, `total_tokens`). |

## Example

```bash
curl https://api.sintaks.dev/v1/responses \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.5",
    "input": "What is the weather in Jakarta?"
  }'
```
