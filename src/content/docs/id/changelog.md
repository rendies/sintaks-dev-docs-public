---
title: Riwayat perubahan
description: Perubahan API dan dokumentasi sintaks.dev yang terlihat oleh pengguna.
---

## 2026-11-19

- **`POST /v1/messages`** — endpoint kompatibel Anthropic Messages API. Pakai dari Claude Code (`ANTHROPIC_BASE_URL=https://api.sintaks.dev/v1`), SDK Anthropic, atau klien kompatibel Anthropic apa pun. Mendukung `system` (string atau blok teks), streaming (event `content_block_*`), `tools` / `tool_choice`, input gambar, dan `stop_sequences`. Lihat panduan [Claude Code](/id/guides/claude-code/).

## 2026-10-27

- **`POST /v1/responses`** — endpoint keputusan/respons yang kompatibel dengan OpenAI Responses API. Menerima `model`, `input`, `instructions`, `max_output_tokens`, `temperature`, dan `top_p`. Mengembalikan `id`, `object`, `created`, `model`, `choices`, dan `usage`. Lihat [sdk-reference](/id/guides/sdk-reference/) untuk penggunaan SDK TypeScript dan Go.
- **`POST /v1/images/generations`** — (existing) Generate image; hasil di-host dan dikembalikan sebagai URL.
- Dokumentasi ditata ulang: panduan [Contoh](/id/guides/examples/) dan [Pemecahan masalah](/id/guides/troubleshooting/) baru, dan quickstart kini sesuai dengan permukaan API yang dirilis.

## 2026-10-13

- **Image generation** — `POST /v1/images/generations` dilayani melalui provider produksi dan ditagih dengan tarif token model. Hasil di-host dan dikembalikan sebagai URL; `response_format: "b64_json"` ditolak.
- **Katalog model** — `GET /v1/models` mengembalikan katalog aktif; model chat diselesaikan melalui katalog dan model yang tidak dikenal mengembalikan `400`.

## 2026-10-04

- **Chat completions** — `POST /v1/chat/completions` dengan streaming (`stream: true`, SSE), `stream_options.include_usage`, `tools` / `functions` / `tool_choice`, `max_tokens` / `max_completion_tokens`, `temperature`, `top_p`, dan `stop`.
- **Semantik error** — envelope error yang kompatibel dengan OpenAI dengan pemetaan `400`, `401`, `402`, `429`, dan `5xx`; setiap respons membawa `X-Request-ID`.
- **API keys** — bearer key yang dibuat di portal, ditampilkan sekali saat dibuat; key yang di-revoke ditolak dalam sekitar satu menit.