---
title: Endpoint
description: Endpoint publik gateway sintaks.dev.
---

## Gateway: `https://api.sintaks.dev`

Autentikasi menggunakan `Authorization: Bearer <api key>`. Unduh
[OpenAPI spec](/openapi.yaml) untuk digunakan pada tooling Anda.

| Endpoint | Fungsi |
|---|---|
| `GET /v1/models` | Daftar model aktif yang tersedia melalui gateway. |
| `POST /v1/chat/completions` | Chat completion streaming dan non-streaming dari katalog model. |
| `POST /v1/embeddings` | Vector embedding untuk input teks; ditagih dengan tarif token input model. |
| `POST /v1/images/generations` | Generate image; hasil di-host dan dikembalikan sebagai URL. |

Pengelolaan akun, API key, saldo, usage, dan top up tersedia di portal customer.
