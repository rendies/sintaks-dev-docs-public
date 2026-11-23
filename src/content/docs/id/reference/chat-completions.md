---
title: POST /v1/chat/completions
description: Chat completion streaming dan non-streaming dari katalog model.
---

Membuat chat completion. Kompatibel dengan OpenAI Chat Completions API — gunakan dengan SDK OpenAI dengan mengarahkan `base_url` ke `https://api.sintaks.dev/v1`.

`POST https://api.sintaks.dev/v1/chat/completions`

Auth: `Authorization: Bearer <api key>`.

## Body request

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

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `model` | string | ya | ID model dari `GET /v1/models`. |
| `messages` | array | ya | Pesan percakapan (di bawah). |
| `stream` | boolean | tidak | `true` untuk streaming SSE. |
| `stream_options.include_usage` | boolean | tidak | Memancarkan chunk usage akhir saat streaming. |
| `max_tokens` | integer | tidak | Max token lama (legacy OpenAI). |
| `max_completion_tokens` | integer | tidak | Max token untuk completion. |
| `temperature` | number | tidak | Temperature sampling (dibatasi kemampuan). |
| `top_p` | number | tidak | Nucleus sampling. |
| `reasoning_effort` | string | tidak | `low` / `medium` / `high` (dibatasi kemampuan). |
| `n` | integer | tidak | Jumlah completion yang dibuat. |
| `stop` | string \| array | tidak | Urutan stop. |
| `tools` | array | tidak | Definisi fungsi. |
| `functions` | array | tidak | Definisi fungsi legacy. |
| `tool_choice` | string \| object | tidak | `auto` / `none` / `required` / `{type:function,...}`. |
| `response_format` | object | tidak | mis. `{"type":"json_object"}` (dibatasi kemampuan). |
| `seed` | integer | tidak | Seed determinisme (dibatasi kemampuan). |
| `logprobs` | boolean | tidak | Minta logprobs (dibatasi kemampuan). |
| `parallel_tool_calls` | boolean | tidak | Izinkan tool call paralel (dibatasi kemampuan). |

### Objek pesan

Setiap pesan memiliki `role` (`system`, `developer`, `user`, `assistant`, atau `tool`) dan `content`. `content` berupa string atau array bagian:

```json
[
  { "type": "text", "text": "Apa isi gambar ini?" },
  { "type": "image_url", "image_url": { "url": "https://..." } }
]
```

Pesan `assistant` dapat membawa `tool_calls`; pesan `tool` membawa `tool_call_id`.

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

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | string | ID completion. |
| `object` | string | Selalu `chat.completion`. |
| `created` | integer | Detik epoch Unix. |
| `model` | string | Model yang melayani. |
| `choices[].message.role` | string | `assistant`. |
| `choices[].message.content` | string | Teks yang dihasilkan. |
| `choices[].message.tool_calls` | array | Tool call, jika diminta. |
| `choices[].finish_reason` | string | `stop`, `length`, `content_filter`, atau `tool_calls`. |
| `usage.prompt_tokens` | integer | Token input. |
| `usage.completion_tokens` | integer | Token output. |
| `usage.total_tokens` | integer | Total token. |
| `usage.prompt_tokens_details.cached_tokens` | integer | Token yang dilayani dari cache. |
| `usage.prompt_tokens_details.cache_write_tokens` | integer | Token yang ditulis ke cache. |
| `usage.completion_tokens_details.reasoning_tokens` | integer | Token yang digunakan untuk penalaran. |

## Streaming

Dengan `"stream": true`, response berupa SSE dengan event `chat.completion.chunk` yang membawa `choices[].delta` (`role`, `content`, `tool_calls`). Saat `stream_options.include_usage` diatur, chunk akhir dengan `usage` dipancarkan, dan stream diakhiri `data: [DONE]`.

## Contoh

```bash
curl https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.5",
    "messages": [{ "role": "user", "content": "Halo" }]
  }'
```
