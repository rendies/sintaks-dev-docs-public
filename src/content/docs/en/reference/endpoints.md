---
title: Endpoints
description: Public sintaks.dev gateway endpoints.
---

## Gateway: `https://api.sintaks.dev`

Authenticate with `Authorization: Bearer <api key>`. Download the [OpenAPI spec](/openapi.yaml) for your tooling.

| Endpoint | Purpose |
|---|---|
| `GET /v1/models` | List active models available through the gateway. |
| `POST /v1/chat/completions` | Streaming and non-streaming chat completions against the model catalog. |
| `POST /v1/embeddings` | Embedding vectors for text inputs; billed at the model's input-token rate. |
| `POST /v1/images/generations` | Image generation; results are hosted and returned as URLs. |

Account, API-key, balance, usage, and top-up management are available in the customer portal.
