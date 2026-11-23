---
title: Hermes
description: Konfigurasi sintaks.dev dengan Hermes dan agent CLI kompatibel OpenAI lainnya.
---

Hermes dan agent CLI kompatibel OpenAI lainnya terhubung ke sintaks.dev melalui custom provider. Pengaturannya menggunakan pengaturan provider standar: base URL, API key, dan ID model.

## Konfigurasi

Atur provider ke **OpenAI-compatible** dengan:

| Pengaturan | Nilai |
|---|---|
| Tipe provider | OpenAI-compatible / custom OpenAI provider |
| Base URL | `https://api.sintaks.dev/v1` |
| API key | API key sintaks.dev Anda |
| Model | ID model aktif dari `GET /v1/models` |

Banyak agent juga membaca variabel lingkungan:

```bash
export OPENAI_BASE_URL="https://api.sintaks.dev/v1"
export OPENAI_API_KEY="sk-..."
```

Kemudian luncurkan agent seperti biasa. Jika agent hanya mendukung preset provider, cari opsi endpoint kustom atau OpenAI-compatible di dokumentasinya.

## Pemecahan masalah

- **`401` API key tidak valid** — periksa key dan pastikan belum dicabut.
- **`402` saldo tidak cukup** — tambahkan saldo di portal.
- **Model tidak dikenal** — gunakan ID model aktif dari `GET /v1/models`; model peka huruf besar/kecil.
- **Kesalahan provider/koneksi** — pastikan base URL tepat `https://api.sintaks.dev/v1`.

Sertakan `X-Request-ID` dari request yang gagal saat menghubungi dukungan.
