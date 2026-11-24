---
title: GET /v1/models
description: Daftar model aktif yang tersedia melalui gateway, lengkap dengan kemampuan dan harga.
---

Menampilkan model aktif yang dilayani gateway. Endpoint ini **publik** — tidak perlu API key (key yang ada tetapi tidak valid tetap mengembalikan `401`).

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

## Field response

| Field | Tipe | Keterangan |
|---|---|---|
| `object` | string | Selalu `list`. |
| `data` | array | Objek model. |
| `data[].id` | string | ID model publik yang Anda kirim sebagai `model`. |
| `data[].object` | string | Selalu `model`. |
| `data[].owned_by` | string | Selalu `sintaksdev`. |
| `data[].type` | string | Jenis model: `chat`, `embedding`, `image`, atau `decision`. |
| `data[].premium` | boolean | Apakah model memerlukan grant premium. |
| `data[].context_window` | integer | Context window dalam token, jika diketahui. |
| `data[].aliases` | array | ID alternatif yang mengarah ke model ini. |
| `data[].pricing` | object | Tarif pelanggan dalam USD per 1M token. |
| `data[].pricing.input_usd_per_1m` | number | Tarif input. |
| `data[].pricing.output_usd_per_1m` | number | Tarif output. |
| `data[].pricing_idr_per_1m` | object | Tarif yang sama dalam IDR per 1M token. |
| `data[].capabilities` | object | Flag kemampuan katalog jika baris model memilikinya. |

## Flag kemampuan

| Flag | Keterangan |
|---|---|
| `supports_temperature` | Menerima `temperature`. |
| `supports_tools` | Mendukung function/tool calling. |
| `supports_reasoning_effort` | Menerima `reasoning_effort`. |
| `default_reasoning_effort` | Level effort default jika dihilangkan. |
| `supports_vision` | Menerima bagian konten gambar. |
| `supports_response_format` | Mendukung `response_format`. |
| `supports_seed` | Mendukung `seed`. |
| `supports_logprobs` | Mendukung `logprobs`. |
| `supports_parallel_tool_calls` | Mendukung `parallel_tool_calls`. |
| `responses_only` | Model hanya dilayani lewat Responses API. |
| `system_one` | Model adalah model evaluasi System One. |

## Contoh

```bash
curl https://api.sintaks.dev/v1/models
```
