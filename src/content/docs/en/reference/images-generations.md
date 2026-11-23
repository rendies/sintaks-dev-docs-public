---
title: POST /v1/images/generations
description: Generate images; results are hosted and returned as URLs (or raw bytes).
---

Generates images on `image_capable` models.

`POST https://api.sintaks.dev/v1/images/generations`

Auth: `Authorization: Bearer <api key>`.

## Request body

```json
{
  "model": "openai/gpt-image-1",
  "prompt": "warm flat illustration of a restaurant table with a QR code menu",
  "n": 1,
  "size": "1024x1024",
  "response_format": "url"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `model` | string | yes | An image-capable model from `GET /v1/models`. |
| `prompt` | string | yes | The prompt describing the image. |
| `n` | integer | no | Number of images (1–10). You pay only for images that come back. |
| `size` | string | no | `WIDTHxHEIGHT` or `auto`. Unsupported sizes fail upstream and are refunded. |
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

Image generation is billed with the model's token rates.

## Example

```bash
curl https://api.sintaks.dev/v1/images/generations \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-image-1",
    "prompt": "A futuristic Jakarta skyline at dusk",
    "n": 1,
    "size": "1024x1024"
  }'
```
