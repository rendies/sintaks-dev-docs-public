---
title: SDK Reference
description: Complete parameter and option reference for @sintaksdev/sdk and sintaks-dev-go.
---

Complete reference for the official sintaks.dev SDKs:
[`@sintaksdev/sdk`](https://www.npmjs.com/package/@sintaksdev/sdk) (TypeScript)
and [`sintaks-dev-go`](https://github.com/rendies/sintaks-dev-go) (Go). Both
wrap the OpenAI-compatible gateway at `https://api.sintaks.dev`; see the
[examples guide](/en/guides/examples/) for quickstart snippets.

## TypeScript SDK (`@sintaksdev/sdk`)

Zero runtime dependencies; requires Node >= 18 (global `fetch`).

### Constructor

```ts
const client = new Sintaks(options);
```

`SintaksOptions`:

| Option | Type | Default | Description |
|---|---|---|---|
| `apiKey` | `string` | **required** | sintaks.dev API key (created in the portal, shown once). |
| `baseURL` | `string` | `https://api.sintaks.dev` | Gateway origin; trailing `/` is stripped. |
| `fetch` | `typeof fetch` | global `fetch` | Custom fetch implementation (tests, proxies). |
| `headers` | `Record<string, string>` | `{}` | Extra headers merged into every request. |

### Resources

| Resource | Method | Endpoint |
|---|---|---|
| `client.chat.completions` | `create(params)` | `POST /v1/chat/completions` |
| `client.embeddings` | `create(params)` | `POST /v1/embeddings` |
| `client.images` | `generate(params)` | `POST /v1/images/generations` |
| `client.models` | `list()` | `GET /v1/models` |

### `chat.completions.create`

`ChatCompletionCreateParams`:

| Field | Type | Notes |
|---|---|---|
| `model` | `string` | Default `gpt-5-5`. Any active catalog model. |
| `messages` | `ChatMessage[]` | **required** — `{ role: "system"\|"developer"\|"user"\|"assistant"\|"tool", content: string \| {type:"text",text}[] }`. Tool messages require `tool_call_id`; assistant tool-call messages carry `tool_calls`. |
| `stream` | `boolean` | When `true` returns an `AsyncIterable<ChatCompletionChunk>` (SSE) instead of `ChatCompletion`. |
| `stream_options.include_usage` | `boolean` | The final streamed chunk carries `usage`. |
| `temperature` | `number` | Ignored by reasoning models. |
| `top_p` | `number` | Send `temperature` **or** `top_p`, not both. |
| `max_tokens` | `number` | Output limit (alias: `max_completion_tokens`). |
| `max_completion_tokens` | `number` | Preferred for reasoning models. |
| `stop` | `string \| string[]` | Up to 4 stop sequences. |
| *(any other key)* | `unknown` | Forwarded verbatim (e.g. `reasoning_effort`, `tools`, `tool_choice`). |

### `embeddings.create`

| Field | Type | Notes |
|---|---|---|
| `input` | `string \| string[]` | **required** — one vector per input, in order. |
| `model` | `string` | Default `qwen3-embedding-0-6b` (1024 dimensions). |
| `encoding_format` | `"float"` | Only `"float"` is supported. |
| `dimensions` | `number` | Optional truncated dimension; provider-dependent. |

Return: `{ data: [{ index, embedding: number[] }], model, usage? }`.

### `images.generate`

| Field | Type | Notes |
|---|---|---|
| `prompt` | `string` | **required** |
| `model` | `string` | Default `gpt-5-5` (image-capable). |
| `n` | `number` | Number of images (default 1). |
| `size` | `string` | `"WIDTHxHEIGHT"` or `"auto"` (default `1024x1024`). |

Return: `{ created, data: [{ url }] }` (hosted URLs).

### `models.list`

Returns `{ object: "list", data: [{ id, object, created, owned_by }] }`.

### Errors

All failures throw `SintaksError`: `status`, `type`, `code`, `requestId`
(the gateway `X-Request-ID`), plus `isUnauthorized` (`401`),
`isInsufficientCredits` (`402`), `isRateLimited` (`429`), and `isRetryable`
(`429`/`503`/`504`).

## Go SDK (`sintaks-dev-go`)

Standard library only; safe for concurrent use.

### Constructor

```go
client := sintaksdev.New("sk-...", opts...)
```

| Option | Description |
|---|---|
| `WithBaseURL(u string)` | Gateway origin (default `https://api.sintaks.dev`). |
| `WithHTTPClient(c *http.Client)` | Custom client. Avoid `http.Client.Timeout` with streaming; bound with context. |
| `WithChatModel(m string)` | Default chat model (default `gpt-5-5`). |
| `WithImageModel(m string)` | Default image model (default `gpt-5-5`). |
| `WithEmbeddingModel(m string)` | Default embedding model (default `qwen3-embedding-0-6b`). |

### Methods

| Method | Endpoint |
|---|---|
| `ChatCompletion(ctx, ChatRequest) (*ChatResponse, error)` | `POST /v1/chat/completions` |
| `ChatCompletionStream(ctx, ChatRequest) (*ChatStream, error)` | `POST /v1/chat/completions` (SSE) |
| `GenerateImage(ctx, ImageRequest) (*ImageResponse, error)` | `POST /v1/images/generations` |
| `Response(ctx, ResponseRequest) (*ResponseResult, error)` | `POST /v1/responses` |
| `Embedding(ctx, EmbeddingRequest) (*EmbeddingResponse, error)` | `POST /v1/embeddings` |

### `ChatRequest`

```go
sintaksdev.ChatRequest{
    Model       string                 // default set from WithChatModel
    Messages    []sintaksdev.Message   // Role: "system"|"user"|"assistant"; Content
    MaxTokens   *int                   // use sintaksdev.Ptr(512)
    Temperature *float64
    TopP        *float64
    Stop        []string
}
```

`ChatResponse` helpers: `Content()` (first choice's message) and `RequestID`
(the gateway `X-Request-ID`). `ChatCompletionStream` returns a `*ChatStream`
the caller must `Close`; final chunk carries `usage`.

### `ResponseRequest`

```go
sintaksdev.ResponseRequest{
    Model           string   // default from WithChatModel (gpt-5-5)
    Input           string   // required
    Instructions    string
    MaxOutputTokens *int
    Temperature     *float64
    TopP            *float64
}
```

`ResponseResult`: `Output` (raw JSON), `Usage`, `RequestID`.

### `EmbeddingRequest`

```go
sintaksdev.EmbeddingRequest{
    Model          string   // default from WithEmbeddingModel (qwen3-embedding-0-6b)
    Input          []string // one vector per input, in order
    EncodingFormat string   // "float" (default) when empty
    Dimensions     *int     // optional truncated dimension
}
```

`EmbeddingResponse`: `Data[].Embedding []float64`, `Usage.PromptTokens`, `RequestID`.

### `ImageRequest`

```go
sintaksdev.ImageRequest{
    Prompt string // required
    Model  string // default from WithImageModel (gpt-5-5)
    N      int
    Size   string // "WIDTHxHEIGHT" or "auto" (default 1024x1024)
}
```

`ImageResponse`: `Data[].URL` (hosted) + `RequestID`.

### Errors

Non-2xx responses return `*APIError` with `Status`, `Type`, `Code`, and
`RequestID` (from `X-Request-ID`). Rejected requests (`400`, `401`, `402`) are
never charged; `402` means the balance can't cover the reservation — top up.

### Helpers

```go
sintaksdev.Ptr[T](v T) *T // pointer to a value for optional fields
```

---

## Defaults summary

| | Default |
|---|---|
| Chat model | `gpt-5-5` |
| Image model | `gpt-5-5` |
| Embedding model | `qwen3-embedding-0-6b` (1024 dims) |
| Base URL | `https://api.sintaks.dev` |

See [examples](/en/guides/examples/) for runnable snippets and
[coding agents](/en/guides/coding-agents/) for agent-provider configuration.
