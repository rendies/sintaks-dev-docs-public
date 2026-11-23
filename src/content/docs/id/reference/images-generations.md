---
title: POST /v1/images/generations
description: Generate image; hasil di-host dan dikembalikan sebagai URL (atau byte mentah).
---

Membuat image pada model `image_capable`.

`POST https://api.sintaks.dev/v1/images/generations`

Auth: `Authorization: Bearer <api key>`.

## Body request

```json
{
  "model": "openai/gpt-image-1",
  "prompt": "ilustrasi datar hangat meja restoran dengan menu kode QR",
  "n": 1,
  "size": "1024x1024",
  "response_format": "url"
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `model` | string | ya | Model berkemampuan gambar dari `GET /v1/models`. |
| `prompt` | string | ya | Prompt yang menjelaskan gambar. |
| `n` | integer | tidak | Jumlah gambar (1–10). Anda hanya membayar gambar yang kembali. |
| `size` | string | tidak | `WIDTHxHEIGHT` atau `auto`. Ukuran tidak didukung gagal di upstream dan di-refund. |
| `quality` | string | tidak | `auto` / `low` / `medium` / `high` (dibatasi kemampuan). |
| `style` | string | tidak | `vivid` / `natural` (dibatasi kemampuan). |
| `background` | string | tidak | `auto` / `opaque` / `transparent` (dibatasi kemampuan). |
| `response_format` | string | tidak | `url` (default, di-host) atau `b64_json` (byte mentah). |

## Response

```json
{
  "created": 1730000000,
  "data": [ { "url": "https://cdn.sintaks.dev/..." } ]
}
```

| Field | Tipe | Keterangan |
|---|---|---|
| `created` | integer | Detik epoch Unix. |
| `data[].url` | string | URL gambar yang di-host (saat `response_format: "url"`). |
| `data[].b64_json` | string | Byte gambar base64 (saat `response_format: "b64_json"`). |

Generate image ditagih dengan tarif token model.

## Contoh

```bash
curl https://api.sintaks.dev/v1/images/generations \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-image-1",
    "prompt": "Cakrawala Jakarta futuristik saat senja",
    "n": 1,
    "size": "1024x1024"
  }'
```
