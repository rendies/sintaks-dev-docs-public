---
title: Riwayat perubahan
description: Perubahan API dan dokumentasi sintaks.dev yang terlihat oleh pengguna.
---

## 2026-11-24

- **Generasi video asinkron** — endpoint baru `POST /v1/videos` (buat job), `GET /v1/videos/{id}` (cek status), dan `GET /v1/videos/{id}/content` (diarahkan ke hasil yang di-host). Lihat [Referensi Videos](/id/reference/videos/).
- **Referensi API per-endpoint** — referensi API kini memiliki halaman tersendiri per endpoint dengan tabel field request dan response lengkap: [Daftar model](/id/reference/models/), [Chat completions](/id/reference/chat-completions/), [Embeddings](/id/reference/embeddings/), [Generate image](/id/reference/images-generations/), [Edit image](/id/reference/images-edits/), [Responses](/id/reference/responses/), [Decisions](/id/reference/decisions/), dan [Messages](/id/reference/messages/).
- **Panduan SDK khusus** — halaman baru [TypeScript/JavaScript SDK](/id/guides/sdk-javascript/) dan [Go SDK](/id/guides/sdk-go/) dengan instalasi, referensi, contoh, penanganan error, dan pemecahan masalah.
- **Coding agent ditata ulang** — panduan [Coding agent](/id/guides/coding-agents/) dibagi menjadi agent CLI, integrasi IDE, dan aplikasi produksi, dengan sub-halaman khusus [OpenCode](/id/guides/coding-agents/opencode/) dan [Hermes](/id/guides/coding-agents/hermes/).
- **Langkah top up** — panduan [top up](/id/guides/top-ups/) kini berupa alur langkah demi langkah yang diakhiri dengan email invoice.
- **Situs docs** — docs.sintaks.dev kini menampilkan konten bahasa default langsung di root (tanpa redirect), logo mengarah ke sintaks.dev, dan header memuat tombol Masuk / Daftar.

## 2026-11-23

- **`POST /v1/images/edits`** — edit image (img2img / inpainting) didokumentasikan di referensi API, dan SDK JS/Go mengekspos `client.images.edits` / `EditImage`.

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