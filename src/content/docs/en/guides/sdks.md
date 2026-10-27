---
title: SDKs & Libraries
description: Use sintaks.dev from TypeScript, Python, Go, or curl.
---

The sintaks.dev API is OpenAI-compatible, so existing clients work out of the box. Pick your language:

## TypeScript / JavaScript

Our official TypeScript package is available on npm as [`@sintaksdev/sdk`](https://www.npmjs.com/package/@sintaksdev/sdk).

```bash
npm install @sintaksdev/sdk
# or: pnpm add @sintaksdev/sdk
```

```ts
import { Sintaks } from "@sintaksdev/sdk";

const client = new Sintaks({ apiKey: "sk-..." });

const stream = await client.chat.completions.create({
  model: "claude-sonnet-5-5",
  messages: [{ role: "user", content: "Hello!" }],
  stream: true,
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}
```

Or use the official OpenAI package with a different `baseURL`:

```ts
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.sintaks.dev/v1",
  apiKey: "sk-...",
});
```

## Python

Use the official `openai` package and change `base_url`:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sintaks.dev/v1",
    api_key="sk-...",
)

resp = client.chat.completions.create(
    model="claude-sonnet-5-5",
    messages=[{"role": "user", "content": "Hello!"}],
)
```

## Go

Install the official Go SDK:

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
        Messages: []sintaksdev.Message{{Role: "user", Content: "Hello!"}},
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(resp.Choices[0].Message.Content)
}
```

For streaming, use `client.ChatCompletionStream(...)` and iterate over the
returned stream. The SDK uses only the Go standard library.

## cURL

```bash
curl https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer sk-..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

Every request requires an API key as a bearer token. See [Authentication](/en/guides/authentication/) and the [endpoint reference](/en/reference/endpoints/) for details. For full copy-paste recipes (streaming, embeddings, images, error handling, slug and OG-card helpers), see [Examples](/guides/examples/).