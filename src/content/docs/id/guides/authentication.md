---
title: Autentikasi
description: API key mengautentikasi organisasi di gateway; sesi browser digunakan di portal.
---

## API key

Request ke gateway menggunakan bearer API key:

```bash
curl https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer sk-..."
```

- Key mengautentikasi **organisasi**, bukan sesi user.
- Raw key hanya ditampilkan satu kali saat dibuat. Sistem hanya menyimpan hash
  SHA-256-nya.
- Revoke atau rotate key akan diteruskan ke gateway dalam waktu sekitar satu
  menit. Key yang telah direvoke akan menghasilkan `401`.
- Simpan key di server. Jangan pernah memasukkan key ke bundle browser atau
  client app.

## Sesi portal

Portal customer menggunakan hosted auth platform untuk login (verifikasi email,
OTP tanpa password, atau password), kemudian menukarkan sesi tersebut menjadi
JWT berumur pendek yang diterima platform. API key tidak pernah digunakan
untuk login.

## Semantik error

| Status | Arti |
|---|---|
| `401` | API key hilang, salah format, telah direvoke, atau tidak valid. |
| `402` | Autentikasi berhasil, tetapi saldo Rupiah organisasi Anda tidak cukup untuk reservation. Lakukan top up terlebih dahulu. |
| `503` | Request tidak dapat diselesaikan oleh upstream; request yang sama aman untuk di-retry. |
