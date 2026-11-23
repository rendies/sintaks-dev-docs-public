---
title: TypeScript / JavaScript SDK (npm)
description: "Use the @sintaksdev/sdk npm package: install, reference, samples, and troubleshooting."
---

The official TypeScript/JavaScript SDK is published on npm as [`@sintaksdev/sdk`](https://www.npmjs.com/package/@sintaksdev/sdk). It has zero runtime dependencies and requires Node >= 18 (global `fetch`).

## Install

```bash
npm install @sintaksdev/sdk
# or
pnpm add @sintaksdev/sdk
# or
yarn add @sintaksdev/sdk
```

## Quickstart

```ts
import { Sintaks } from "@sintaksdev/sdk";

const client = new Sintaks({ apiKey: "sk-..." });

const resp = await client.chat.completions.create({
  model: "claude-sonnet-5-5",
  messages: [{ role: "user", content: "Halo!" }],
});
console.log(resp.choices[0]?.message?.content);
```

## Reference

| Resource | Method | Endpoint |
|---|---|---|
| `client.chat.completions` | `create(params)` | `POST /v1/chat/completions` |
| `client.embeddings` | `create(params)` | `POST /v1/embeddings` |
| `client.images` | `generate(params)` | `POST /v1/images/generations` |
| `client.images` | `edits(params)` | `POST /v1/images/edits` (multipart) |
| `client.responses` | `create(params)` | `POST /v1/responses` |
| `client.models` | `list()` | `GET /v1/models` |

### Constructor options

| Option | Type | Default | Description |
|---|---|---|
| `apiKey` | string | — | Required. Your sintaks.dev API key. |
| `baseURL` | string | `https://api.sintaks.dev` | Override for other environments. |
| `fetch` | function | global `fetch` | Custom fetch implementation (tests, proxies). |
| `headers` | object | `{}` | Extra headers merged into every request. |

### Model defaults

`model` defaults to `gpt-5-5` for chat and images, and `qwen3-embedding-0-6b` for embeddings when omitted.

## Samples

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

### Image generation

```ts
const images = await client.images.generate({
  prompt: "A futuristic Jakarta skyline at dusk",
});
console.log(images.data[0]?.url);
```

### Image edits (multipart)

```ts
import { readFile } from "node:fs/promises";

const edited = await client.images.edits({
  prompt: "Add a chocolate fountain on the right",
  image: await readFile("input.png"),
  mask: await readFile("mask.png"), // optional, for inpainting
  model: "gpt-image-1",
  size: "1024x1024",
});
console.log(edited.data[0]?.url);
```

`image`/`mask` accept a `File`, `Blob`, `Uint8Array`, `ArrayBuffer`, or string.

### Embeddings

```ts
const embedding = await client.embeddings.create({
  input: ["Serverless Postgres with sintaks.dev"],
});
console.log(embedding.data[0].embedding.length); // 1024
```

### Responses API

```ts
const resp = await client.responses.create({
  input: "What is the weather in Jakarta?",
});
console.log(resp.output);
```

### List models

```ts
const models = await client.models.list();
console.log(models.data.map((m) => m.id));
```

## Error handling

Failed requests throw a `SintaksError` with the HTTP status and an error envelope:

```ts
try {
  await client.chat.completions.create({ messages: [] });
} catch (err) {
  if (err.isInsufficientCredits) {
    console.error("insufficient balance, top up first");
  } else {
    console.error(err.status, err.message, err.requestId);
  }
}
```

| Helper | Meaning |
|---|---|
| `err.isInsufficientCredits` | HTTP 402 — top up the balance. |
| `err.isRateLimited` | HTTP 429 — retry with backoff. |
| `err.isRetryable` | True for 5xx/429 server or upstream errors. |
| `err.requestId` | The `X-Request-ID` to quote when contacting support. |

## Troubleshooting

- **`401` invalid API key** — the key is missing, malformed, or revoked. Create a new key in the portal.
- **`404`/unknown model** — use an active model ID from `client.models.list()` or `GET /v1/models`; IDs are case-sensitive.
- **`"model" is not a valid JSON string` / confusing type errors** — ensure `messages[].content` is a string or an array of typed parts.
- **Node < 18** — `fetch` is not global. Upgrade to Node 18+ or pass a `fetch` implementation.
- **CORS in the browser** — the gateway is intended for server-side use; keep your API key out of browser code.
