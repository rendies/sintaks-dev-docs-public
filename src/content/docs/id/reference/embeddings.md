---
title: POST /v1/embeddings
description: Vector embedding untuk input teks; ditagih dengan tarif token input model.
---

Membuat vector embedding untuk satu atau lebih input teks.

`POST https://api.sintaks.dev/v1/embeddings`

Auth: `Authorization: Bearer <api key>`.

## Body request

```json
{
  "model": "qwen3-embedding-0-6b",
  "input": ["Serverless Postgres dengan sintaks.dev"],
  "encoding_format": "float"
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `model` | string | ya | Model `embedding` dari `GET /v1/models`. |
| `input` | string \| array | ya | Satu teks, atau array teks (dikembalikan sesuai urutan). |
| `encoding_format` | string | tidak | `float` (default) atau `base64`. |
| `dimensions` | integer | tidak | Dimensi vector yang diminta, jika model mendukungnya. |

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

| Field | Tipe | Keterangan |
|---|---|---|
| `object` | string | Selalu `list`. |
| `data[].object` | string | Selalu `embedding`. |
| `data[].index` | integer | Indeks sesuai urutan request. |
| `data[].embedding` | array \| string | Vektor; string base64 saat `encoding_format: "base64"` dan model menghormatinya. |
| `model` | string | Model yang melayani. |
| `usage.prompt_tokens` | integer | Token input. |
| `usage.total_tokens` | integer | Total token. |

## Contoh

```bash
curl https://api.sintaks.dev/v1/embeddings \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-embedding-0-6b",
    "input": ["Pencarian semantik dengan sintaks.dev"]
  }'
```
