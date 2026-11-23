---
title: POST /v1/messages
description: Pesan streaming dan non-streaming; kompatibel dengan Anthropic Messages API.
---

Membuat pesan menggunakan bentuk Anthropic Messages API. Gunakan dengan SDK Anthropic (`base_url` = `https://api.sintaks.dev`; SDK menambahkan `/v1/messages`).

`POST https://api.sintaks.dev/v1/messages`

Auth: `Authorization: Bearer <api key>`.

## Body request

```json
{
  "model": "anthropic/claude-sonnet-5.5",
  "max_tokens": 512,
  "system": "Anda ringkas.",
  "messages": [
    { "role": "user", "content": "Halo" }
  ]
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `model` | string | ya | ID model dari `GET /v1/models`. |
| `max_tokens` | integer | ya | Token maksimum yang dihasilkan. |
| `messages` | array | ya | `role` (`user`/`assistant`) + `content` (string atau blok konten). |
| `system` | string | tidak | System prompt. |
| `stop_sequences` | array | tidak | Urutan stop. |
| `temperature` | number | tidak | Temperature sampling. |
| `top_p` | number | tidak | Nucleus sampling. |
| `stream` | boolean | tidak | `true` untuk streaming. |
| `tools` | array | tidak | Definisi tool (`name`, `description`, `input_schema`). |
| `tool_choice` | object | tidak | Pemilihan tool. |
| `service_tier` | string | tidak | Tier layanan. |
| `thinking` | object | tidak | `{ "type": "enabled", "budget_tokens": N }`. |

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

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | string | ID pesan. |
| `type` | string | Selalu `message`. |
| `role` | string | Selalu `assistant`. |
| `model` | string | Model yang melayani. |
| `content` | array | Blok konten: `text`, `tool_use` (dengan `id`, `name`, `input`), dll. |
| `stop_reason` | string | mis. `end_turn`, `max_tokens`, `tool_use`. |
| `stop_sequence` | string | Urutan stop yang memicu, jika ada. |
| `usage.input_tokens` | integer | Token input. |
| `usage.output_tokens` | integer | Token output. |
| `usage.cache_read_input_tokens` | integer | Token yang dibaca dari cache. |
| `usage.cache_creation_input_tokens` | integer | Token yang ditulis ke cache. |

## Contoh

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
