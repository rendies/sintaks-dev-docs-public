---
title: GET /v1/models
description: List the active models available through the gateway, with capabilities and pricing.
---

Lists the active models served by the gateway. This endpoint is **public** — no API key is required (a present-but-invalid key still returns `401`).

`GET https://api.sintaks.dev/v1/models`

## Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "openai/gpt-5.5",
      "object": "model",
      "owned_by": "sintaksdev",
      "type": "chat",
      "premium": false,
      "context_window": 128000,
      "aliases": ["gpt-5.5"],
      "pricing": { "input_usd_per_1m": 2.5, "output_usd_per_1m": 10.0 },
      "pricing_idr_per_1m": { "input_idr_per_1m": 40100, "output_idr_per_1m": 160400 },
      "capabilities": {
        "supports_tools": true,
        "supports_reasoning_effort": true,
        "default_reasoning_effort": "medium",
        "supports_vision": true
      }
    }
  ]
}
```

## Response fields

| Field | Type | Description |
|---|---|---|
| `object` | string | Always `list`. |
| `data` | array | The model objects. |
| `data[].id` | string | The public model ID you pass as `model`. |
| `data[].object` | string | Always `model`. |
| `data[].owned_by` | string | Always `sintaksdev`. |
| `data[].type` | string | Model kind: `chat`, `embedding`, `image`, or `decision`. |
| `data[].premium` | boolean | Whether the model requires a premium grant. |
| `data[].context_window` | integer | Context window in tokens, when known. |
| `data[].aliases` | array | Alternative IDs that alias to this model. |
| `data[].pricing` | object | Customer rate card in USD per 1M tokens (markup included). |
| `data[].pricing.input_usd_per_1m` | number | Input rate. |
| `data[].pricing.output_usd_per_1m` | number | Output rate. |
| `data[].pricing_idr_per_1m` | object | The same card in IDR per 1M tokens. |
| `data[].capabilities` | object | Catalog capability flags when the model row carries them. |

## Capability flags

| Flag | Description |
|---|---|
| `supports_temperature` | Accepts `temperature`. |
| `supports_tools` | Supports function/tool calling. |
| `supports_reasoning_effort` | Accepts `reasoning_effort`. |
| `default_reasoning_effort` | Default effort level when omitted. |
| `supports_vision` | Accepts image content parts. |
| `supports_response_format` | Supports `response_format`. |
| `supports_seed` | Supports `seed`. |
| `supports_logprobs` | Supports `logprobs`. |
| `supports_parallel_tool_calls` | Supports `parallel_tool_calls`. |
| `responses_only` | Model is served only through the Responses API. |
| `system_one` | Model is a System One evaluation model. |

## Example

```bash
curl https://api.sintaks.dev/v1/models
```
