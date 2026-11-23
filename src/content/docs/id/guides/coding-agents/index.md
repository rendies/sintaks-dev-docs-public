---
title: Coding agent
description: Hubungkan coding agent dan alat AI ke API sintaks.dev.
---

sintaks.dev mengekspos API yang kompatibel dengan OpenAI yang dapat digunakan coding agent dan alat AI melalui custom provider. Konfigurasi alat Anda dengan base URL `https://api.sintaks.dev/v1`, API key Anda, dan ID model dari `GET /v1/models`.

## Sebelum memulai

1. [Buat akun](https://app.sintaks.dev) dan isi saldo organisasi. Request gagal dengan `402 insufficient_quota` jika saldo tidak cukup.
2. Buat API key di bagian **API keys** pada portal. Salin saat ditampilkan (raw key hanya tampil sekali).
3. Pilih model aktif. Daftar model:

   ```bash
   curl https://api.sintaks.dev/v1/models \
     -H "Authorization: Bearer $SINTAKS_API_KEY"
   ```

Jaga kerahasiaan API key — jangan pernah commit ke repository atau konfigurasi bersama.

## Agent CLI

Coding agent baris perintah yang berjalan di terminal:

| Agent | Panduan |
|---|---|
| OpenCode | [Konfigurasi OpenCode](./opencode) |
| Hermes | [Konfigurasi Hermes](./hermes) |
| Claude Code | [Claude Code](../claude-code) |

## Integrasi IDE

Asisten coding di editor/IDE:

- **VS Code** — lihat panduan [VS Code](../vscode).
- **Cursor / JetBrains / asisten IDE lain** — atur provider ke OpenAI-compatible dengan `https://api.sintaks.dev/v1` sebagai base URL dan key Anda sebagai API key.

## Aplikasi produksi via API

Untuk aplikasi yang memanggil API secara langsung (bukan agent), gunakan SDK resmi atau REST API:

- TypeScript/JavaScript: [@sintaksdev/sdk](../sdk-javascript)
- Go: [sintaks-dev-go](../sdk-go)
- SDK apa pun yang kompatibel OpenAI: arahkan `base_url` ke `https://api.sintaks.dev/v1`.

Gateway kompatibel dengan OpenAI, sehingga SDK dan alat yang ada dapat digunakan tanpa adaptor kustom.
