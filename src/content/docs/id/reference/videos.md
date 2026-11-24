---
title: POST /v1/videos
description: Generate video secara asinkron; cek status job dan unduh hasilnya.
---

Generasi video bersifat asinkron. Anda mengirim job, lalu mengecek `GET /v1/videos/{id}` hingga selesai, kemudian mengunduh hasil dari `GET /v1/videos/{id}/content`.

`POST https://api.sintaks.dev/v1/videos`

Auth: `Authorization: Bearer <api key>`.

## Buat job video

### Body request

```json
{
  "model": "spacexai/grok-imagine-video-1.5-lite",
  "prompt": "Jalan Jakarta yang dipenuhi lampu neon di malam hari, slow dolly shot",
  "seconds": 5,
  "size": "1080p",
  "aspect_ratio": "16:9",
  "audio": true
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|
| `model` | string | ya | Model berkemampuan video dari `GET /v1/models`. |
| `prompt` | string | ya | Prompt yang menjelaskan video. |
| `seconds` | integer | tidak | Panjang klip dalam detik (1–20, default 4). |
| `size` | string | tidak | Label resolusi (mis. `720p`, `1080p`), jika didukung provider. |
| `aspect_ratio` | string | tidak | Aspek bingkai (mis. `16:9`, `9:16`). |
| `audio` | boolean | tidak | Membuat audio jika didukung model. |

### Response (job dibuat)

```json
{
  "id": "vid_...",
  "object": "video",
  "created_at": 1730000000,
  "status": "queued",
  "model": "spacexai/grok-imagine-video-1.5-lite",
  "seconds": 5
}
```

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | string | ID job video. |
| `object` | string | Selalu `video`. |
| `created_at` | integer | Detik epoch Unix. |
| `status` | string | `queued` → `in_progress` → `completed` \| `failed`. |
| `model` | string | Model yang melayani. |
| `seconds` | integer | Durasi yang diminta. |
| `url` | string | Hadir saat `status: "completed"` (URL hasil yang di-host). |
| `error` | string | Hadir saat `status: "failed"`. |
| `completed_at` | integer | Hadir saat selesai. |
| `usage` | object | Pemakaian token (video menagih detik berdurasi sebagai token output sintetis). |

## Ambil job video

`GET https://api.sintaks.dev/v1/videos/{id}` mengembalikan objek job yang sama, diperbarui seiring progres.

## Unduh hasil

`GET https://api.sintaks.dev/v1/videos/{id}/content` mengarahkan ulang (`302`) ke URL video di CDN provider. Gateway tidak menghosting media yang dihasilkan.

## Contoh

```bash
# kirim
curl https://api.sintaks.dev/v1/videos \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "spacexai/grok-imagine-video-1.5-lite",
    "prompt": "Jalan Jakarta yang dipenuhi lampu neon di malam hari",
    "seconds": 5
  }'

# cek
curl https://api.sintaks.dev/v1/videos/vid_... \
  -H "Authorization: Bearer $SINTAKS_API_KEY"

# unduh saat selesai
curl -L https://api.sintaks.dev/v1/videos/vid_.../content \
  -H "Authorization: Bearer $SINTAKS_API_KEY" -o video.mp4
```
