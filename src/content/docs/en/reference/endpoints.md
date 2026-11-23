---
title: API reference
description: Public sintaks.dev gateway endpoints.
---

The gateway lives at `https://api.sintaks.dev`. Authenticate with `Authorization: Bearer <api key>`. Download the [OpenAPI spec](/openapi.yaml) for your tooling.

Each endpoint has its own page with full request and response field references:

| Endpoint | Page |
|---|---|
| `GET /v1/models` | [List models](./models) |
| `POST /v1/chat/completions` | [Chat completions](./chat-completions) |
| `POST /v1/embeddings` | [Embeddings](./embeddings) |
| `POST /v1/images/generations` | [Image generation](./images-generations) |
| `POST /v1/images/edits` | [Image edits](./images-edits) |
| `POST /v1/responses` | [Responses](./responses) |
| `POST /v1/decisions` | [Decisions](./decisions) |
| `POST /v1/messages` | [Messages](./messages) |

Account, API-key, balance, usage, and top-up management are available in the customer portal.
