---
title: POST /v1/decisions
description: Jawaban bertipe (predicate, choice, score) dari model decision.
---

Meminta model decision menjawab pertanyaan bertipe tentang input bersama, kompatibel dengan OpenAI Decisions API.

`POST https://api.sintaks.dev/v1/decisions`

Auth: `Authorization: Bearer <api key>`.

## Body request

```json
{
  "model": "typesafe-ai/jev-1.14.0",
  "input": "Paket tiba dalam keadaan rusak. Saya ingin uang kembali.",
  "questions": [
    { "type": "predicate", "name": "refund", "instructions": "Apakah pelanggan meminta refund?" }
  ]
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `model` | string | ya | Model `decision` dari `GET /v1/models`. |
| `input` | string \| array | ya | Input bersama yang dijadikan dasar pertanyaan. |
| `questions` | array | ya | Pertanyaan (maks 64). Masing-masing memiliki `type` (`predicate`, `choice`, `score`), `name`, dan `instructions`. |

## Response

```json
{
  "model": "typesafe-ai/jev-1.14.0",
  "answers": [
    { "type": "predicate", "name": "refund", "probability": 0.92 }
  ],
  "usage": { "input_tokens": 24, "output_tokens": 3, "total_tokens": 27 }
}
```

| Field | Tipe | Keterangan |
|---|---|---|
| `model` | string | Model yang melayani. |
| `answers` | array | Satu jawaban per pertanyaan, sesuai urutan. |
| `answers[].type` | string | `predicate`, `choice`, atau `score`. |
| `answers[].name` | string | Sesuai `name` pertanyaan. |
| `answers[].probability` | number | Keyakinan predicate dalam [0,1]. |
| `answers[].choice` | string | Pilihan yang dipilih (pertanyaan choice). |
| `answers[].score` | number | Indeks level tertimbang probabilitas (pertanyaan score). |
| `answers[].confidence` | number | Keyakinan, jika model mengembalikannya. |
| `answers[].probabilities` | object | Distribusi, jika model mengembalikannya. |
| `usage.input_tokens` | integer | Token input. |
| `usage.output_tokens` | integer | Token output. |
| `usage.total_tokens` | integer | Total token. |

## Contoh

```bash
curl https://api.sintaks.dev/v1/decisions \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe-ai/jev-1.14.0",
    "input": "Paket tiba dalam keadaan rusak. Saya ingin uang kembali.",
    "questions": [
      { "type": "predicate", "name": "refund", "instructions": "Apakah pelanggan meminta refund?" }
    ]
  }'
```
