---
title: POST /v1/videos
description: Generate videos asynchronously; poll the job for status and download the result.
---

Video generation is asynchronous. You submit a job, then poll `GET /v1/videos/{id}` until it completes, and finally download the result from `GET /v1/videos/{id}/content`.

`POST https://api.sintaks.dev/v1/videos`

Auth: `Authorization: Bearer <api key>`.

## Create a video job

### Request body

```json
{
  "model": "spacexai/grok-imagine-video-1.5-lite",
  "prompt": "A neon-lit Jakarta street at night, slow dolly shot",
  "seconds": 5,
  "size": "1080p",
  "aspect_ratio": "16:9",
  "audio": true
}
```

| Field | Type | Required | Description |
|---|---|---|
| `model` | string | yes | A video-capable model from `GET /v1/models`. |
| `prompt` | string | yes | The prompt describing the video. |
| `seconds` | integer | no | Clip length in seconds (1–20, default 4). |
| `size` | string | no | Resolution label (e.g. `720p`, `1080p`), when the provider supports it. |
| `aspect_ratio` | string | no | Frame aspect (e.g. `16:9`, `9:16`). |
| `audio` | boolean | no | Generate audio where the model supports it. |

### Response (job created)

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

| Field | Type | Description |
|---|---|---|
| `id` | string | Video job ID. |
| `object` | string | Always `video`. |
| `created_at` | integer | Unix epoch seconds. |
| `status` | string | `queued` → `in_progress` → `completed` \| `failed`. |
| `model` | string | The serving model. |
| `seconds` | integer | Requested duration. |
| `url` | string | Present when `status: "completed"` (hosted result URL). |
| `error` | string | Present when `status: "failed"`. |
| `completed_at` | integer | Present when completed. |
| `usage` | object | Token usage (video bills duration-priced seconds as synthetic output tokens). |

## Get a video job

`GET https://api.sintaks.dev/v1/videos/{id}` returns the same job object, updated as it progresses.

## Download the result

`GET https://api.sintaks.dev/v1/videos/{id}/content` redirects (`302`) to the provider CDN's video URL. The gateway does not host generated media.

## Example

```bash
# submit
curl https://api.sintaks.dev/v1/videos \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "spacexai/grok-imagine-video-1.5-lite",
    "prompt": "A neon-lit Jakarta street at night",
    "seconds": 5
  }'

# poll
curl https://api.sintaks.dev/v1/videos/vid_... \
  -H "Authorization: Bearer $SINTAKS_API_KEY"

# download when completed
curl -L https://api.sintaks.dev/v1/videos/vid_.../content \
  -H "Authorization: Bearer $SINTAKS_API_KEY" -o video.mp4
```
