---
title: Pemecahan masalah
description: Diagnosis error dan kegagalan umum pada API sintaks.dev.
---

## Format error

Setiap error adalah objek JSON dengan `error.message`, `error.type`, `error.param`, dan `error.code`. Matriks status lengkap ada di [referensi error](/id/reference/errors/).

## 401: API key tidak valid

- Key tidak ada, salah format, telah direvoke, atau tidak dikenal.
- Buat key di portal (**API keys**) — key hanya ditampilkan sekali saat dibuat.
- Setelah revoke atau rotate key, tunggu hingga sekitar satu menit agar gateway melihat perubahannya.
- Pastikan key dikirim sebagai `Authorization: Bearer <key>` dan tidak disematkan di bundle browser.

## 402: saldo tidak cukup

- Reservation (estimasi token input ditambah batas output yang diminta) melebihi saldo Anda.
- Lakukan top up di portal; order minimum Rp10.000.
- Permintaan panjang dengan `max_tokens` besar menahan reservation besar. Turunkan `max_tokens` atau `max_completion_tokens` untuk mengurangi reservation.

## 400: permintaan tidak valid

- **Model tidak dikenal** — `model` yang diminta tidak ada di katalog aktif. Panggil `GET /v1/models` untuk melihat daftar terkini.
- **Kapabilitas tidak cocok** — misalnya meminta image generation dari model chat-only, atau parameter yang tidak didukung model. `temperature` diabaikan untuk model reasoning; `response_format` belum didukung.
- **Body salah format** — periksa JSON, role pesan, `tool_call_id` pada pesan ber-role tool, dan skema tool. Permintaan yang ditolak tidak pernah ditagih.

## 429: rate limit

- Batas rate limit provider atau gateway tercapai.
- Ulangi dengan backoff eksponensial dan jitter. Streaming respons panjang ikut terhitung dalam batas yang sama.

## 5xx / 502 / 503: kegagalan upstream

- Gateway atau provider upstream sedang tidak tersedia sementara.
- Ulangi dengan backoff. Periksa [status.sintaks.dev](https://status.sintaks.dev) untuk pengumuman.
- Permintaan yang sudah sampai ke provider tetap dapat membebani usage meski koneksi gagal. Periksa Log Usage & Audit sebelum mengulang.

## Permintaan streaming yang terputus

- Jika client terputus di tengah streaming, model tetap berjalan dan tagihan akhir diestimasi dari output yang sudah dihasilkan.
- Gunakan `stream_options.include_usage: true` saat menyambung kembali jika Anda memerlukan jumlah token yang presisi.

## Masalah image generation

- Image ditahan jika filter konten upstream memblokirnya; permintaan tetap ditagih karena provider tetap menjalankannya.
- Jika mendapat `502 upstream provider returned no image`, model menjawab dengan teks alih-alih memanggil tool gambar. Ulangi prompt yang sama; kegagalan yang berulang biasanya berarti model tidak mendukung image generation.
- Image selalu dikembalikan sebagai URL yang di-host; `response_format: b64_json` ditolak.

## Mendapatkan bantuan

Setiap respons membawa `X-Request-ID`. Sertakan dalam permintaan dukungan — ID ini menjadi kunci riwayat usage Anda dan memungkinkan tim dukungan melacak panggilan provider yang persis. Periksa Log Usage & Audit terlebih dahulu: log tersebut menampilkan tagihan yang diselesaikan, refund, dan status provider untuk setiap permintaan.