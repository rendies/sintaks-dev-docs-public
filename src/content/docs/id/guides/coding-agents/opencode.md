---
title: OpenCode
description: Konfigurasi sintaks.dev sebagai provider kompatibel OpenAI di OpenCode.
---

[OpenCode](https://opencode.ai) mendukung custom provider kompatibel OpenAI di `opencode.json`. Konfigurasi sintaks.dev sebagai provider dan gunakan ID model dari `GET /v1/models`.

## Konfigurasi

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "sintaks": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "sintaks.dev",
      "options": {
        "baseURL": "https://api.sintaks.dev/v1",
        "apiKey": "{env:SINTAKS_API_KEY}"
      },
      "models": {
        "claude-sonnet-5-5": {
          "name": "Claude Sonnet 5.5"
        }
      }
    }
  },
  "model": "sintaks/claude-sonnet-5-5"
}
```

Atur key di shell sebelum meluncurkan OpenCode:

```bash
export SINTAKS_API_KEY="sk-..."
opencode
```

Ganti `claude-sonnet-5-5` dengan ID model aktif apa pun. Anda dapat menyimpan provider di konfigurasi global (`~/.config/opencode/opencode.json`) agar tersedia lintas project. Gunakan referensi variabel lingkungan untuk secret.

## Pemecahan masalah

- **`401` API key tidak valid** — pastikan key valid dan belum dicabut; buat yang baru jika perlu.
- **`402` saldo tidak cukup** — top up saldo organisasi.
- **Model tidak dikenal** — gunakan ID model aktif dari `GET /v1/models`; ID peka huruf besar/kecil.
- **Kesalahan koneksi** — pastikan `baseURL` tepat `https://api.sintaks.dev/v1` dan tipe provider OpenAI-compatible.

Setiap response membawa `X-Request-ID`; sertakan saat menghubungi dukungan tentang request yang gagal.
