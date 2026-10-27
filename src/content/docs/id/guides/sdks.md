---
title: SDK dan pustaka
description: Gunakan sintaks.dev dari TypeScript, Python, Go, atau cURL.
---

API sintaks.dev kompatibel dengan OpenAI sehingga client yang telah tersedia
dapat langsung digunakan. Pilih bahasa pemrograman Anda:

## TypeScript / JavaScript

Package TypeScript resmi kami tersedia di npm sebagai
[`@sintaksdev/sdk`](https://www.npmjs.com/package/@sintaksdev/sdk).

```bash
npm install @sintaksdev/sdk
# atau: pnpm add @sintaksdev/sdk
```

```ts
import { Sintaks } from "@sintaksdev/sdk";

const client = new Sintaks({ apiKey: "sk-..." });

const stream = await client.chat.completions.create({
  model: "claude-sonnet-5-5",
  messages: [{ role: "user", content: "Halo!" }],
  stream: true,
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}
```

Anda juga dapat menggunakan package OpenAI resmi dengan mengganti `baseURL`:

```ts
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.sintaks.dev/v1",
  apiKey: "sk-...",
});
```

## Python

Gunakan package `openai` resmi dengan mengganti `base_url`:

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

## Go

Install SDK Go resmi:

```go
go get github.com/rendies/sintaks-dev-go
```

```go
package main

import (
    "context"
    "fmt"
    "log"

    sintaksdev "github.com/rendies/sintaks-dev-go"
)

func main() {
    client := sintaksdev.New("sk-...")
    resp, err := client.ChatCompletion(context.Background(), sintaksdev.ChatRequest{
        Model:    "claude-sonnet-5-5",
        Messages: []sintaksdev.Message{{Role: "user", Content: "Halo!"}},
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(resp.Choices[0].Message.Content)
}
```

Untuk streaming, gunakan `client.ChatCompletionStream(...)` lalu iterasikan
stream yang dikembalikan. SDK ini hanya menggunakan standard library Go.

## cURL

```bash
curl https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer sk-..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "messages": [{"role": "user", "content": "Halo!"}]
  }'
```

Semua request wajib menggunakan API key sebagai bearer token. Baca
[Autentikasi](/id/guides/authentication/) dan [referensi endpoint](/id/reference/endpoints/)
untuk detail. Untuk resep siap salin lengkap (streaming, embeddings, images,
penanganan error, helper slug dan OG card), lihat [Contoh](/id/guides/examples/).