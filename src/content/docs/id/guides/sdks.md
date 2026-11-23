---
title: SDK dan pustaka
description: Pilih SDK resmi atau gunakan API yang kompatibel dengan OpenAI.
---

API sintaks.dev kompatibel dengan OpenAI sehingga client yang telah tersedia dapat langsung digunakan. Dua SDK resmi sudah diterbitkan:

- **TypeScript / JavaScript** — [`@sintaksdev/sdk`](https://www.npmjs.com/package/@sintaksdev/sdk) di npm. Lihat panduan khusus [TypeScript/JavaScript SDK](./sdk-javascript).
- **Go** — [`github.com/rendies/sintaks-dev-go`](https://github.com/rendies/sintaks-dev-go). Lihat panduan khusus [Go SDK](./sdk-go).

Untuk bahasa lain, gunakan SDK OpenAI dengan `base_url` kustom:

| Bahasa | Package | Base URL |
|---|---|---|
| Python | `openai` | `https://api.sintaks.dev/v1` |
| Node.js | `openai` | `https://api.sintaks.dev/v1` |
| Java / lainnya | SDK apa pun yang kompatibel OpenAI | `https://api.sintaks.dev/v1` |

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sintaks.dev/v1",
    api_key="sk-...",
)
resp = client.chat.completions.create(
    model="claude-sonnet-5-5",
    messages=[{"role": "user", "content": "Halo!"}],
)
```

HTTP mentah lewat cURL:

```bash
curl https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer sk-..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "messages": [{"role": "user", "content": "Halo!"}]
  }'
```

Setiap request memerlukan API key sebagai bearer token — lihat [Autentikasi](./authentication). Untuk resep copy-paste lengkap (streaming, embeddings, gambar, penanganan error), lihat [Contoh](./examples).
