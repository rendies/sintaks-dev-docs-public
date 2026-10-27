---
title: Error
description: Format error gateway dan semantik status code.
---

Error menggunakan envelope yang kompatibel dengan OpenAI:

```json
{
  "error": {
    "message": "insufficient credits",
    "type": "insufficient_quota",
    "param": null,
    "code": "insufficient_quota"
  }
}
```

| Status | Type | Arti | Panduan retry |
|---|---|---|---|
| `400` | `invalid_request_error` | Body request, model, endpoint, parameter, atau tool schema tidak valid. | Perbaiki request; jangan mengulang request yang sama. |
| `401` | `invalid_request_error` | API key hilang, format salah, direvoke, atau tidak valid. | Periksa API key. |
| `402` | `insufficient_quota` | Saldo tidak cukup untuk reservation request. | Lakukan top up saldo organisasi. |
| `408` | `upstream_error` | Provider tidak merespons sebelum gateway timeout. | Retry dengan backoff; periksa usage sebelum mengulang request besar. |
| `429` | `rate_limit_error` | Rate limit provider atau gateway tercapai. | Retry setelah jeda dengan exponential backoff. |
| `499` | `request_canceled` | Client memutuskan koneksi atau membatalkan request. | Retry hanya jika operasi aman untuk diulang. |
| `500` | `server_error` | Terjadi error internal yang tidak terduga di gateway. | Retry dengan backoff dan sertakan `X-Request-ID` saat menghubungi support. |
| `501` | `invalid_request_error` | Capability atau endpoint yang diminta belum diimplementasikan. | Gunakan endpoint atau model yang didukung. |
| `502` | `upstream_error` | Provider menolak request atau mengembalikan error dari sisi provider. | Perbaiki kompatibilitas request/model atau retry jika sesuai. |
| `503` | `upstream_error` | Provider sedang tidak tersedia sementara. | Retry dengan exponential backoff. |
| `504` | `upstream_error` | Request ke provider mengalami timeout. | Retry dengan backoff; periksa usage sebelum mengulang. |

Setiap response membawa `X-Request-ID`. Sertakan ID ini saat melaporkan masalah kepada support. ID yang sama juga digunakan sebagai key dalam usage history dan panggilan provider.

Response provider setelah request diterima tetap dapat menggunakan token dan memengaruhi saldo. Periksa Usage & Audit Log sebelum melakukan retry.
