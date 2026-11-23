---
title: POST /v1/embeddings
description: Embedding vectors for text inputs, billed at the model's input-token rate.
---

Creates embedding vectors for one or more text inputs.

`POST https://api.sintaks.dev/v1/embeddings`

Auth: `Authorization: Bearer <api key>`.

## Request body

```json
{
  "model": "qwen3-embedding-0-6b",
  "input": ["Serverless Postgres with sintaks.dev"],
  "encoding_format": "float"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `model` | string | yes | An `embedding` model from `GET /v1/models`. |
| `input` | string \| array | yes | One text, or an array of texts (returned in request order). |
| `encoding_format` | string | no | `float` (default) or `base64`. |
| `dimensions` | integer | no | Requested vector dimensionality, when the model supports it. |

## Response

```json
{
  "object": "list",
  "data": [
    { "object": "embedding", "index": 0, "embedding": [0.01, -0.03, ...] }
  ],
  "model": "qwen3-embedding-0-6b",
  "usage": { "prompt_tokens": 8, "total_tokens": 8 }
}
```

| Field | Type | Description |
|---|---|---|
| `object` | string | Always `list`. |
| `data[].object` | string | Always `embedding`. |
| `data[].index` | integer | Index in request order. |
| `data[].embedding` | array \| string | The vector; a base64 string when `encoding_format: "base64"` and the model honors it. |
| `model` | string | The serving model. |
| `usage.prompt_tokens` | integer | Input tokens. |
| `usage.total_tokens` | integer | Total tokens. |

## Example

```bash
curl https://api.sintaks.dev/v1/embeddings \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-embedding-0-6b",
    "input": ["Semantic search with sintaks.dev"]
  }'
```
