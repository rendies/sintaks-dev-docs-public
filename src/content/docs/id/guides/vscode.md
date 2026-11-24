---
title: VS Code
description: Gunakan model sintaks.dev di GitHub Copilot Chat lewat ekstensi VS Code sintaks.dev.
---

Ekstensi sintaks.dev mendaftarkan sintaks.dev sebagai language model provider di VS Code, sehingga model dari katalog sintaks.dev muncul di pemilih model VS Code. Setiap permintaan ditagih per-request ke saldo organisasi Anda dalam IDR.

[![VS Code extension](https://img.shields.io/badge/VS%20Code-v1.0.0-blue?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=sintaks-dev.sintaks-dev-copilot-provider)
[![Install](https://img.shields.io/badge/Install-Marketplace-blue?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=sintaks-dev.sintaks-dev-copilot-provider)

## Sebelum mulai

1. Pasang **VS Code 1.104 atau lebih baru** dengan GitHub Copilot Chat tersedia (bawaan pada rilis VS Code terbaru; pada versi lama pasang ekstensi [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)). API model provider memerlukan keduanya, dan model pihak ketiga hanya muncul untuk paket GitHub Copilot individual.
2. [Buat akun](https://app.sintaks.dev) dan isi saldo organisasi. Permintaan gagal dengan `402 insufficient_quota` jika saldo tidak mencukupi.
3. Buat API key di bagian **API keys** pada portal. Salin saat ditampilkan; key mentah hanya muncul satu kali.

## Pasang ekstensi

Pasang `sintaks-dev.sintaks-dev-copilot-provider` dari [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=sintaks-dev.sintaks-dev-copilot-provider), atau jalankan:

```bash
code --install-extension sintaks-dev.sintaks-dev-copilot-provider
```

## Tambahkan API key

1. Buka Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Jalankan **sintaks.dev: Manage Provider**.
3. Pilih **Set API key** lalu tempel key Anda.

Key disimpan di VS Code SecretStorage — keychain sistem operasi — bukan di file pengaturan, sehingga tidak pernah ditulis ke `settings.json` atau tersinkron sebagai teks biasa.

## Pakai model sintaks.dev di chat

1. Buka Command Palette lalu jalankan **Chat: Manage Language Models** — atau klik ikon gear di pemilih model chat.
2. Di editor Language Models, aktifkan model **sintaks.dev**. Ekstensi menampilkan semua model chat aktif dari `GET /v1/models`, lengkap dengan ukuran konteks dan harga input dalam IDR.
3. Pilih model sintaks.dev di pemilih model dan mulai chat. Respons streaming, tool calls, dan input gambar didukung sesuai kemampuan tiap model.

Daftar model diperbarui saat Anda masuk atau menjalankan **Refresh models** dari perintah manage. Model baru yang ditambahkan ke katalog muncul otomatis — tanpa perlu memperbarui ekstensi.

## Pengaturan

| Pengaturan | Default | Deskripsi |
|---|---|---|
| `sintaks.baseUrl` | `https://api.sintaks.dev/v1` | URL dasar gateway. Ubah hanya untuk gateway self-hosted atau staging. |

## Pemecahan masalah

- **API key tidak valid (401):** Jalankan ulang **sintaks.dev: Manage Provider** → **Set API key**. Pastikan key belum dicabut di portal.
- **Kredit tidak cukup (402):** Isi ulang saldo organisasi di portal.
- **Rate limit (429):** Tunggu sebentar lalu coba lagi; gateway membatasi permintaan bersamaan per key.
- **Model sintaks.dev tidak muncul di pemilih:** Pastikan API key sudah diisi, lalu jalankan **Refresh models** dari perintah manage. Hanya model chat yang ditampilkan — model embedding dan gambar tidak bisa dipilih untuk chat.
- **Ekstensi tidak aktif:** Pastikan VS Code versi 1.104 atau lebih baru dan Copilot Chat terpasang dan aktif.

Setiap respons API menyertakan `X-Request-ID`. Sertakan ID tersebut saat menghubungi dukungan tentang permintaan yang gagal.
