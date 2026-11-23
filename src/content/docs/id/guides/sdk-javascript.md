---
title: SDK TypeScript / JavaScript (npm)
description: "Gunakan package @sintaksdev/sdk: instalasi, referensi, contoh, dan pemecahan masalah."
---

SDK TypeScript/JavaScript resmi diterbitkan di npm sebagai [`@sintaksdev/sdk`](https://www.npmjs.com/package/@sintaksdev/sdk). Tidak memiliki dependensi runtime dan memerlukan Node >= 18 (`fetch` global).

## Instalasi

```bash
npm install @sintaksdev/sdk
# atau
pnpm add @sintaksdev/sdk
# atau
yarn add @sintaksdev/sdk
```

## Mulai cepat

```ts
import { Sintaks } from "@sintaksdev/sdk";

const client = new Sintaks({ apiKey: "sk-..." });

const resp = await client.chat.completions.create({
  model: "claude-sonnet-5-5",
  messages: [{ role: "user", content: "Halo!" }],
});
console.log(resp.choices[0]?.message?.content);
```

## Referensi

| Resource | Method | Endpoint |
|---|---|---|
| `client.chat.completions` | `create(params)` | `POST /v1/chat/completions` |
| `client.embeddings` | `create(params)` | `POST /v1/embeddings` |
| `client.images` | `generate(params)` | `POST /v1/images/generations` |
| `client.images` | `edits(params)` | `POST /v1/images/edits` (multipart) |
| `client.responses` | `create(params)` | `POST /v1/responses` |
| `client.models` | `list()` | `GET /v1/models` |

### Opsi konstruktor

| Opsi | Tipe | Default | Keterangan |
|---|---|---|
| `apiKey` | string | — | Wajib. API key sintaks.dev Anda. |
| `baseURL` | string | `https://api.sintaks.dev` | Ganti untuk lingkungan lain. |
| `fetch` | function | `fetch` global | Implementasi fetch kustom (test, proxy). |
| `headers` | object | `{}` | Header tambahan yang digabung ke setiap request. |

### Default model

`model` default ke `gpt-5-5` untuk chat dan gambar, serta `qwen3-embedding-0-6b` untuk embeddings saat dihilangkan.

## Contoh

### Streaming chat

```ts
const stream = await client.chat.completions.create({
  model: "claude-sonnet-5-5",
  messages: [{ role: "user", content: "Halo!" }],
  stream: true,
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}
```

### Chat completions

```ts
const resp = await client.chat.completions.create({
  messages: [{ role: "user", content: "Halo!" }],
});
console.log(resp.choices[0]?.message?.content);
```

### Generate image

```ts
const images = await client.images.generate({
  prompt: "Cakrawala Jakarta futuristik saat senja",
});
console.log(images.data[0]?.url);
```

### Edit image (multipart)

```ts
import { readFile } from "node:fs/promises";

const edited = await client.images.edits({
  prompt: "Tambahkan air mancur cokelat di sisi kanan",
  image: await readFile("input.png"),
  mask: await readFile("mask.png"), // opsional, untuk inpainting
  model: "gpt-image-1",
  size: "1024x1024",
});
console.log(edited.data[0]?.url);
```

`image`/`mask` menerima `File`, `Blob`, `Uint8Array`, `ArrayBuffer`, atau string.

### Embeddings

```ts
const embedding = await client.embeddings.create({
  input: ["Pencarian semantik dengan sintaks.dev"],
});
console.log(embedding.data[0].embedding.length); // 1024
```

### Responses API

```ts
const resp = await client.responses.create({
  input: "Bagaimana cuaca di Jakarta?",
});
console.log(resp.output);
```

### Daftar model

```ts
const models = await client.models.list();
console.log(models.data.map((m) => m.id));
```

## Penanganan error

Request yang gagal melempar `SintaksError` dengan status HTTP dan envelope error:

```ts
try {
  await client.chat.completions.create({ messages: [] });
} catch (err) {
  if (err.isInsufficientCredits) {
    console.error("saldo tidak cukup, top up dulu");
  } else {
    console.error(err.status, err.message, err.requestId);
  }
}
```

| Helper | Makna |
|---|---|
| `err.isInsufficientCredits` | HTTP 402 — top up saldo. |
| `err.isRateLimited` | HTTP 429 — coba lagi dengan backoff. |
| `err.isRetryable` | True untuk error 5xx/429 server atau upstream. |
| `err.requestId` | `X-Request-ID` untuk dikutip saat menghubungi dukungan. |

## Pemecahan masalah

- **`401` API key tidak valid** — key hilang, salah format, atau dicabut. Buat key baru di portal.
- **`404`/model tidak dikenal** — gunakan model aktif dari `client.models.list()` atau `GET /v1/models`; ID peka huruf besar/kecil.
- **Kesalahan tipe** — pastikan `messages[].content` berupa string atau array bagian bertipe.
- **Node < 18** — `fetch` tidak global. Upgrade ke Node 18+ atau berikan implementasi `fetch`.
- **CORS di browser** — gateway ditujukan untuk penggunaan sisi server; jangan taruh API key di kode browser.
