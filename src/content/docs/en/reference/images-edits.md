---
title: POST /v1/images/edits
description: Image-to-image edits (img2img / inpainting); results are hosted and returned as URLs.
---

Creates an edited image from one or more source images, optionally with a mask (inpainting). This endpoint is **multipart form-data**.

`POST https://api.sintaks.dev/v1/images/edits`

Auth: `Authorization: Bearer <api key>`. Body: `multipart/form-data`.

## Form fields

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | file | yes | One or more source images. |
| `prompt` | string | yes | The instruction describing the edit. |
| `mask` | file | no | Optional mask(s) for inpainting. Count must match `image` count. |
| `model` | string | no | An image-capable model. |
| `n` | integer | no | Number of images (1–10). |
| `size` | string | no | `WIDTHxHEIGHT` or `auto`. |
| `quality` | string | no | `auto` / `low` / `medium` / `high` (capability-gated). |
| `style` | string | no | `vivid` / `natural` (capability-gated). |
| `background` | string | no | `auto` / `opaque` / `transparent` (capability-gated). |
| `response_format` | string | no | `url` (default, hosted) or `b64_json` (raw bytes). |

## Response

```json
{
  "created": 1730000000,
  "data": [ { "url": "https://cdn.sintaks.dev/..." } ]
}
```

| Field | Type | Description |
|---|---|---|
| `created` | integer | Unix epoch seconds. |
| `data[].url` | string | Hosted image URL (when `response_format: "url"`). |
| `data[].b64_json` | string | Base64 image bytes (when `response_format: "b64_json"`). |

Edits are billed with the model's token rates. Models that do not support edits return a documented error.

## Example

```bash
curl https://api.sintaks.dev/v1/images/edits \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -F "image=@input.png" \
  -F "prompt=Add a chocolate fountain to the right side" \
  -F "model=openai/gpt-image-1" \
  -F "n=1" \
  -F "size=1024x1024"
```
