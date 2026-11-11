---
title: Coding agent
description: Hubungkan OpenCode dan coding agent lainnya ke API sintaks.dev.
---

Panduan ini ditujukan bagi developer yang mengonfigurasi coding agent untuk menggunakan API publik sintaks.dev. Panduan ini mencakup OpenCode dan pengaturan umum untuk agent lain yang mendukung custom provider kompatibel OpenAI.

Gunakan sintaks.dev dengan coding agent yang mendukung custom provider kompatibel OpenAI. Panduan ini menjelaskan konfigurasi OpenCode; agent lain menggunakan URL API, key, dan model ID yang sama.

## Persiapan

1. [Buat akun](https://app.sintaks.dev) dan isi saldo organisasi. Request dapat gagal dengan `402 insufficient_quota` jika saldo tidak cukup untuk memprosesnya.
2. Buat API key di bagian **API keys** pada portal. Salin saat ditampilkan karena raw key hanya ditampilkan satu kali.
3. Pilih model aktif dari katalog. Untuk melihat daftar model terbaru:

   ```bash
   curl https://api.sintaks.dev/v1/models \
     -H "Authorization: Bearer $SINTAKS_API_KEY"
   ```

Jaga kerahasiaan API key. Jangan commit key ke repository atau memasukkannya ke konfigurasi proyek yang dibagikan kepada orang lain.

## OpenCode

OpenCode mendukung custom provider melalui `opencode.json`. Konfigurasikan sintaks.dev sebagai provider kompatibel OpenAI dan gunakan model ID yang dikembalikan oleh `GET /v1/models`:

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

Atur API key sebagai environment variable sebelum menjalankan OpenCode:

```bash
export SINTAKS_API_KEY="sk-..."
opencode
```

Ganti `claude-sonnet-5-5` dengan model ID aktif lainnya. Jika model memerlukan opsi provider tambahan, periksa persyaratan model di katalog sintaks.dev dan dokumentasi provider OpenCode.

Anda juga dapat menyimpan konfigurasi provider di konfigurasi OpenCode global (`~/.config/opencode/opencode.json`) agar tersedia di semua proyek. Gunakan referensi environment variable untuk secret; hindari menaruh raw key di `opencode.json` yang di-commit.

## Coding agent lainnya

Untuk agent dengan pengaturan custom provider kompatibel OpenAI, masukkan nilai berikut:

| Pengaturan | Nilai |
|---|---|
| Tipe provider | OpenAI-compatible / custom OpenAI provider |
| Base URL | `https://api.sintaks.dev/v1` |
| API key | API key sintaks.dev Anda |
| Model | Model ID aktif dari `GET /v1/models` |

Beberapa agent mengatur nilai tersebut lewat environment variable:

```bash
export OPENAI_BASE_URL="https://api.sintaks.dev/v1"
export OPENAI_API_KEY="sk-..."
```

Ikuti dokumentasi agent terkait pengaturan custom provider dan model ID. Jika agent hanya mendukung provider bawaan, cari opsi custom endpoint atau OpenAI-compatible.

## Pemecahan masalah

- **`401` / API key tidak valid:** Periksa key dan pastikan belum dicabut. Buat key baru jika key lama tidak tersedia.
- **`402` / saldo tidak cukup:** Tambahkan saldo organisasi melalui portal.
- **Model tidak dikenal:** Gunakan model ID aktif dari `GET /v1/models`; nama model membedakan huruf besar dan kecil.
- **Error koneksi atau provider:** Pastikan base URL tepat `https://api.sintaks.dev/v1` dan agent dikonfigurasi menggunakan protokol OpenAI-compatible.

Setiap respons API menyertakan `X-Request-ID`. Sertakan ID tersebut saat menghubungi support terkait request yang gagal.
