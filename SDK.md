# SDK Reference

Complete reference for the official sintaks.dev SDKs:
[`@sintaksdev/sdk`](https://www.npmjs.com/package/@sintaksdev/sdk) (TypeScript)
and [`sintaks-dev-go`](https://github.com/rendies/sintaks-dev-go) (Go). Both
wrap the OpenAI-compatible gateway at `https://api.sintaks.dev`; see
[EXAMPLES.md](EXAMPLES.md) for quickstart snippets.

Base URL: `https://api.sintaks.dev` (the SDKs append `/v1/...` per request).

---

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
| `client.responses` | `create(params)` | `POST /v1/responses` |
| `client.embeddings` | `create(params)` | `POST /v1/embeddings` |
| `client.images` | `generate(params)` | `POST /v1/images/generations` |
| `client.models` | `list()` | `GET /v1/models` |

### `chat.completions.create`

`ChatCompletionCreateParams` (all optional unless marked):

| Field | Type | Notes |
|---|---|---|
| `model` | `string` | Default `gpt-5-5`. Any active catalog model. |
| `messages` | `ChatMessage[]` | **required** — `{ role: "system"\|"developer"\|"user"\|"assistant"\|"tool", content: string \| {type:"text",text}[] }`. Tool messages require `tool_call_id`; assistant tool-call messages carry `tool_calls`. |
| `stream` | `boolean` | When `true` returns an `AsyncIterable<ChatCompletionChunk>` (SSE) instead of `ChatCompletion`. |
| `stream_options.include_usage` | `boolean` | Sends `include_usage`; the final streamed chunk carries `usage`. |
| `temperature` | `number` | Ignored by reasoning models. |
| `top_p` | `number` | Send `temperature` **or** `top_p`, not both. |
| `max_tokens` | `number` | Output limit (alias: `max_completion_tokens`). |
| `max_completion_tokens` | `number` | Preferred for reasoning models. |
| `stop` | `string \| string[]` | Up to 4 stop sequences. |
| *(any other key)* | `unknown` | Forwarded verbatim (e.g. `reasoning_effort`, `tools`, `tool_choice`, `response_format`). |

Return: `ChatCompletion` (`id`, `created`, `model`, `choices[].message.content`, `finish_reason`, `usage`) or `AsyncIterable<ChatCompletionChunk>` when `stream: true`.

### `responses.create`

`ResponsesCreateParams`:

| Field | Type | Notes |
|---|---|---|
| `input` | `string` | **required** |
| `model` | `string` | Default `gpt-5-5`. |
| `instructions` | `string` | Optional system-style instructions. |
| `max_output_tokens` | `number` | Output limit. |
| `temperature` / `top_p` | `number` | Optional sampling controls. |
| `stream` | `boolean` | Streaming SSE events when `true`. |
| *(any other key)* | `unknown` | Forwarded verbatim (e.g. `tools`, `tool_choice`). |

Return: `ResponsesObject` — `{ id, object: "response", status, model, output, usage }`.

### `embeddings.create`

`EmbeddingCreateParams`:

| Field | Type | Notes |
|---|---|---|
| `input` | `string \| string[]` | **required** — one or more texts; one vector per input, in order. |
| `model` | `string` | Default `qwen3-embedding-0-6b` (1024 dimensions). |
| `encoding_format` | `"float"` | Only `"float"` is supported. |
| `dimensions` | `number` | Optional truncated dimension; provider-dependent. |
| *(any other key)* | `unknown` | Forwarded verbatim. |

Return: `EmbeddingResponse` — `{ object, data: [{ object, index, embedding: number[] }], model, usage? }`.

### `images.generate`

`ImageGenerationParams`:

| Field | Type | Notes |
|---|---|---|
| `prompt` | `string` | **required** |
| `model` | `string` | Default `gpt-5-5` (image-capable). |
| `n` | `number` | Number of images (default 1). |
| `size` | `string` | `"WIDTHxHEIGHT"` or `"auto"` (default `1024x1024`). Unsupported sizes fail upstream and are refunded. |
| *(any other key)* | `unknown` | Forwarded verbatim. |

Return: `ImageGenerationResult` — `{ created, data: [{ url }] }` (hosted URLs).

### `models.list`

Returns `{ object: "list", data: [{ id, object, created, owned_by }] }` — the active catalog.

### Errors

All failures throw `SintaksError`:

| Member | Description |
|---|---|
| `status` | HTTP status (`400`, `401`, `402`, `429`, `5xx`). |
| `type` / `code` | OpenAI error envelope values. |
| `requestId` | Gateway `X-Request-ID` — include it in support requests. |
| `isUnauthorized` | `status === 401` — invalid/revoked key. |
| `isInsufficientCredits` | `status === 402` — top up first. |
| `isRateLimited` | `status === 429`. |
| `isRetryable` | `429`, `503`, or `504`. |

---

## Go SDK (`sintaks-dev-go`)

Standard library only; safe for concurrent use.

### Constructor

```go
client := sintaksdev.New("sk-...", opts...)
```

`Option` functions:

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
    Model       string            // default set from WithChatModel
    Messages    []sintaksdev.Message  // Role: "system"|"user"|"assistant"; Content
    MaxTokens   *int              // use sintaksdev.Ptr(512)
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

See [EXAMPLES.md](EXAMPLES.md) for runnable snippets in every language and
[INTEGRATIONS.md](INTEGRATIONS.md) for agent-platform and gateway setups.