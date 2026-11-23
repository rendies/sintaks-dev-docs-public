---
title: POST /v1/responses
description: Pembuatan keputusan/respons; kompatibel dengan OpenAI Responses API.
---

Membuat respons menggunakan bentuk OpenAI Responses API. Gunakan dengan resource `responses` SDK OpenAI yang diarahkan ke `https://api.sintaks.dev/v1`.

`POST https://api.sintaks.dev/v1/responses`

Auth: `Authorization: Bearer <api key>`.

## Body request

```json
{
  "model": "openai/gpt-5.5",
  "input": "Bagaimana cuaca di Jakarta?",
  "instructions": "Jawab dengan ringkas.",
  "max_output_tokens": 512,
  "stream": false
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `model` | string | ya | ID model dari `GET /v1/models`. |
| `input` | string \| array \| object | ya | Prompt, daftar pesan, atau item input. |
| `instructions` | string | tidak | Instruksi ala system. |
| `max_output_tokens` | integer | tidak | Max token output. |
| `temperature` | number | tidak | Temperature sampling. |
| `top_p` | number | tidak | Nucleus sampling. |
| `tools` | array | tidak | Definisi tool/function. |
| `tool_choice` | string \| object | tidak | Pemilihan tool. |
| `stream` | boolean | tidak | `true` untuk streaming. |

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

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | string | ID response. |
| `object` | string | Selalu `response`. |
| `created_at` | integer | Detik epoch Unix. |
| `status` | string | mis. `completed`. |
| `model` | string | Model yang melayani. |
| `output` | array | Item output (`message`, atau `function_call` dengan `call_id`, `name`, `arguments`). |
| `output[].content[].type` | string | `output_text` (teks) atau `output_image`. |
| `output[].content[].text` | string | Teks yang dihasilkan. |
| `usage` | object | Pemakaian token (`prompt_tokens`, `completion_tokens`, `total_tokens`). |

## Contoh

```bash
curl https://api.sintaks.dev/v1/responses \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.5",
    "input": "Bagaimana cuaca di Jakarta?"
  }'
```
