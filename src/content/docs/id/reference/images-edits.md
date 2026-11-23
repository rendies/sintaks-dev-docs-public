---
title: POST /v1/images/edits
description: Edit image (img2img / inpainting); hasil di-host dan dikembalikan sebagai URL.
---

Membuat gambar yang diedit dari satu atau lebih gambar sumber, opsional dengan mask (inpainting). Endpoint ini berupa **multipart form-data**.

`POST https://api.sintaks.dev/v1/images/edits`

Auth: `Authorization: Bearer <api key>`. Body: `multipart/form-data`.

## Field form

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `image` | file | ya | Satu atau lebih gambar sumber. |
| `prompt` | string | ya | Instruksi yang menjelaskan edit. |
| `mask` | file | tidak | Mask opsional untuk inpainting. Jumlah harus sama dengan jumlah `image`. |
| `model` | string | tidak | Model berkemampuan gambar. |
| `n` | integer | tidak | Jumlah gambar (1–10). |
| `size` | string | tidak | `WIDTHxHEIGHT` atau `auto`. |
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

Edit image ditagih dengan tarif token model. Model yang tidak mendukung edit mengembalikan error terdokumentasi.

## Contoh

```bash
curl https://api.sintaks.dev/v1/images/edits \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -F "image=@input.png" \
  -F "prompt=Tambahkan air mancur cokelat di sisi kanan" \
  -F "model=openai/gpt-image-1" \
  -F "n=1" \
  -F "size=1024x1024"
```
