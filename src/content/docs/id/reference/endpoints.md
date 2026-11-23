---
title: Referensi API
description: Endpoint publik gateway sintaks.dev.
---

Gateway berada di `https://api.sintaks.dev`. Autentikasi menggunakan `Authorization: Bearer <api key>`. Unduh [OpenAPI spec](/openapi.yaml) untuk digunakan pada tooling Anda.

Setiap endpoint memiliki halaman sendiri dengan referensi lengkap field request dan response:

| Endpoint | Halaman |
|---|---|
| `GET /v1/models` | [Daftar model](./models) |
| `POST /v1/chat/completions` | [Chat completions](./chat-completions) |
| `POST /v1/embeddings` | [Embeddings](./embeddings) |
| `POST /v1/images/generations` | [Generate image](./images-generations) |
| `POST /v1/images/edits` | [Edit image](./images-edits) |
| `POST /v1/responses` | [Responses](./responses) |
| `POST /v1/decisions` | [Decisions](./decisions) |
| `POST /v1/messages` | [Messages](./messages) |

Pengelolaan akun, API key, saldo, usage, dan top up tersedia di portal customer.
