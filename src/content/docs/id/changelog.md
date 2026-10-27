---
title: Riwayat perubahan
description: Perubahan API dan dokumentasi sintaks.dev yang terlihat oleh pengguna.
---

## 2026-10-27

- **`POST /v1/embeddings`** — embeddings untuk input teks yang kompatibel dengan OpenAI, ditagih dengan tarif token input model. `input` menerima string atau array string; `encoding_format: "float"` dan `dimensions` didukung. Lihat [contoh](/id/guides/examples/).
- Dokumentasi ditata ulang: panduan [Contoh](/id/guides/examples/) dan [Pemecahan masalah](/id/guides/troubleshooting/) baru, dan quickstart kini sesuai dengan permukaan API yang dirilis.

## 2026-10-13

- **Image generation** — `POST /v1/images/generations` dilayani melalui provider produksi dan ditagih dengan tarif token model. Hasil di-host dan dikembalikan sebagai URL; `response_format: "b64_json"` ditolak.
- **Katalog model** — `GET /v1/models` mengembalikan katalog aktif; model chat diselesaikan melalui katalog dan model yang tidak dikenal mengembalikan `400`.

## 2026-10-04

- **Chat completions** — `POST /v1/chat/completions` dengan streaming (`stream: true`, SSE), `stream_options.include_usage`, `tools` / `functions` / `tool_choice`, `max_tokens` / `max_completion_tokens`, `temperature`, `top_p`, dan `stop`.
- **Semantik error** — envelope error yang kompatibel dengan OpenAI dengan pemetaan `400`, `401`, `402`, `429`, dan `5xx`; setiap respons membawa `X-Request-ID`.
- **API keys** — bearer key yang dibuat di portal, ditampilkan sekali saat dibuat; key yang di-revoke ditolak dalam sekitar satu menit.