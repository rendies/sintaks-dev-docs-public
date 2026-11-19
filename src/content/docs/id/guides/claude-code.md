---
title: Claude Code
description: Pakai model sintaks.dev di Claude Code dan klien kompatibel Anthropic lewat endpoint /v1/messages.
---

sintaks.dev menyediakan endpoint kompatibel Anthropic Messages API di `POST /v1/messages`, sehingga Claude Code, SDK Anthropic, dan klien kompatibel Anthropic lainnya bisa langsung memakai model sintaks.dev. Setiap permintaan ditagih per-request ke saldo organisasi Anda dalam IDR.

## Sebelum mulai

1. [Buat akun](https://app.sintaks.dev) dan isi saldo organisasi. Permintaan gagal dengan `402 insufficient_quota` jika saldo tidak mencukupi.
2. Buat API key di bagian **API keys** pada portal. Salin saat ditampilkan; key mentah hanya muncul satu kali.
3. Pilih model **chat** aktif dari katalog — Claude Code memanggil `/v1/messages`, yang hanya melayani model chat. Model embedding, image, dan decision tidak bisa dipilih di sini.

## Claude Code

Arahkan Claude Code ke gateway sintaks.dev lewat environment variable:

```bash
export ANTHROPIC_BASE_URL="https://api.sintaks.dev/v1"
export ANTHROPIC_AUTH_TOKEN="sk-..."
export ANTHROPIC_MODEL="openai/gpt-6.1-sol"
claude
```

Ganti `openai/gpt-6.1-sol` dengan ID model chat aktif apa pun dari `GET /v1/models`. `ANTHROPIC_AUTH_TOKEN` diisi API key sintaks.dev Anda; gateway tidak pernah menerima kredensial Anthropic.

Tool calling didukung: tool Claude Code tiba sebagai blok `tool_use`/`tool_result` dan diterjemahkan ke protokol tool gateway. Input gambar dan streaming didukung sesuai kemampuan model yang dipilih.

## SDK Anthropic

SDK resmi Anthropic menerima `baseURL` kustom. Node.js:

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "https://api.sintaks.dev/v1",
  apiKey: "sk-...",
});

const message = await client.messages.create({
  model: "openai/gpt-6.1-sol",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello" }],
});
```

Python:

```python
from anthropic import Anthropic

client = Anthropic(base_url="https://api.sintaks.dev/v1", api_key="sk-...")

message = client.messages.create(
    model="openai/gpt-6.1-sol",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
)
```

Klien kompatibel Anthropic apa pun yang memungkinkan pengaturan base URL dan API key bisa memakai konfigurasi yang sama.

## Catatan

- **ID model adalah ID katalog sintaks.dev**, bukan nama model Anthropic — gunakan nilai `model` dari `GET /v1/models`.
- `system` bisa berupa string atau array blok teks; `stream`, `tools`, `tool_choice`, `max_tokens`, `temperature`, `top_p`, dan `stop_sequences` didukung.
- Respons memakai bentuk pesan Anthropic (ID `msg_…`, event stream `content_block_*`) sehingga klien mem-parsing tanpa perubahan.
- Jaga kerahasiaan API key. Jangan commit ke repository atau taruh di konfigurasi proyek yang dibagikan.

## Pemecahan masalah

- **401 / API key tidak valid:** periksa key dan pastikan belum dicabut; buat yang baru jika perlu.
- **402 / kredit tidak cukup:** isi ulang saldo organisasi di portal.
- **Model tidak ditemukan:** hanya model chat aktif yang dilayani `/v1/messages`; gunakan ID model chat aktif dari `GET /v1/models`.
- **Gagal tool atau gambar:** kemampuan model menentukan apakah tools dan input gambar diterima; pilih model yang kapabilitasnya sesuai kebutuhan Anda.

Setiap respons API menyertakan `X-Request-ID`. Sertakan ID tersebut saat menghubungi dukungan tentang permintaan yang gagal.