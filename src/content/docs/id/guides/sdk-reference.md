---
title: Referensi SDK
description: Referensi parameter dan opsi untuk @sintaksdev/sdk dan sintaks-dev-go.
---

Referensi lengkap untuk SDK resmi sintaks.dev:
[`@sintaksdev/sdk`](https://www.npmjs.com/package/@sintaksdev/sdk) (TypeScript)
dan [`sintaks-dev-go`](https://github.com/rendies/sintaks-dev-go) (Go). Keduanya
mengakses gateway kompatibel OpenAI di `https://api.sintaks.dev`; lihat
[panduan contoh](/id/guides/examples/) untuk cuplikan quickstart.

## TypeScript SDK (`@sintaksdev/sdk`)

Tanpa dependensi runtime; memerlukan Node >= 18 (global `fetch`).

### Constructor

```ts
const client = new Sintaks(options);
```

`SintaksOptions`:

| Opsi | Tipe | Default | Deskripsi |
|---|---|---|---|
| `apiKey` | `string` | **wajib** | API key sintaks.dev (dibuat di portal, hanya ditampilkan satu kali). |
| `baseURL` | `string` | `https://api.sintaks.dev` | Origin gateway; `/` di akhir akan dihapus. |
| `fetch` | `typeof fetch` | global `fetch` | Implementasi fetch khusus (untuk tes atau proxy). |
| `headers` | `Record<string, string>` | `{}` | Header tambahan yang dikirim di setiap request. |

### Resource

| Resource | Method | Endpoint |
|---|---|---|
| `client.chat.completions` | `create(params)` | `POST /v1/chat/completions` |
| `client.embeddings` | `create(params)` | `POST /v1/embeddings` |
| `client.images` | `generate(params)` | `POST /v1/images/generations` |
| `client.models` | `list()` | `GET /v1/models` |

### `chat.completions.create`

`ChatCompletionCreateParams`:

| Field | Tipe | Catatan |
|---|---|---|
| `model` | `string` | Default `gpt-5-5`. Gunakan model aktif dari katalog. |
| `messages` | `ChatMessage[]` | **wajib** — `{ role: "system"\|"developer"\|"user"\|"assistant"\|"tool", content: string \| {type:"text",text}[] }`. Pesan tool memerlukan `tool_call_id`; pesan assistant untuk tool menyertakan `tool_calls`. |
| `stream` | `boolean` | Jika `true`, hasilnya `AsyncIterable<ChatCompletionChunk>` (SSE), bukan `ChatCompletion`. |
| `stream_options.include_usage` | `boolean` | Chunk terakhir berisi `usage`. |
| `temperature` | `number` | Diabaikan oleh reasoning model. |
| `top_p` | `number` | Kirim `temperature` **atau** `top_p`, jangan keduanya. |
| `max_tokens` | `number` | Batas output (alias: `max_completion_tokens`). |
| `max_completion_tokens` | `number` | Direkomendasikan untuk reasoning model. |
| `stop` | `string \| string[]` | Maksimal 4 stop sequence. |
| *(key lain)* | `unknown` | Diteruskan tanpa perubahan, misalnya `reasoning_effort`, `tools`, `tool_choice`. |

### `embeddings.create`

| Field | Tipe | Catatan |
|---|---|---|
| `input` | `string \| string[]` | **wajib** — satu vector untuk setiap input, sesuai urutan. |
| `model` | `string` | Default `qwen3-embedding-0-6b` (1024 dimensi). |
| `encoding_format` | `"float"` | Hanya `"float"` yang didukung. |
| `dimensions` | `number` | Pemotongan dimensi opsional; bergantung pada provider. |

Hasil: `{ data: [{ index, embedding: number[] }], model, usage? }`.

### `images.generate`

| Field | Tipe | Catatan |
|---|---|---|
| `prompt` | `string` | **wajib** |
| `model` | `string` | Default `gpt-5-5` (mendukung gambar). |
| `n` | `number` | Jumlah gambar (default 1). |
| `size` | `string` | `"WIDTHxHEIGHT"` atau `"auto"` (default `1024x1024`). |

Hasil: `{ created, data: [{ url }] }` (URL yang di-host). 

### `models.list`

Mengembalikan `{ object: "list", data: [{ id, object, created, owned_by }] }`.

### Error

Semua kegagalan melempar `SintaksError`: `status`, `type`, `code`, `requestId`
(nilai `X-Request-ID` dari gateway), serta `isUnauthorized` (`401`),
`isInsufficientCredits` (`402`), `isRateLimited` (`429`), dan `isRetryable`
(`429`/`503`/`504`).

## Go SDK (`sintaks-dev-go`)

Hanya menggunakan standard library; aman digunakan secara concurrent.

### Constructor

```go
client := sintaksdev.New("sk-...", opts...)
```

| Opsi | Deskripsi |
|---|---|
| `WithBaseURL(u string)` | Origin gateway (default `https://api.sintaks.dev`). |
| `WithHTTPClient(c *http.Client)` | Client khusus. Hindari `http.Client.Timeout` saat streaming; batasi dengan context. |
| `WithChatModel(m string)` | Default chat model (default `gpt-5-5`). |
| `WithImageModel(m string)` | Default image model (default `gpt-5-5`). |
| `WithEmbeddingModel(m string)` | Default embedding model (default `qwen3-embedding-0-6b`). |

### Method

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
    Model       string                 // default dari WithChatModel
    Messages    []sintaksdev.Message   // Role: "system"|"user"|"assistant"; Content
    MaxTokens   *int                   // gunakan sintaksdev.Ptr(512)
    Temperature *float64
    TopP        *float64
    Stop        []string
}
```

Helper `ChatResponse`: `Content()` (pesan dari pilihan pertama) dan `RequestID`
(`X-Request-ID` dari gateway). `ChatCompletionStream` mengembalikan
`*ChatStream` yang harus di-`Close`; chunk terakhir membawa `usage`.

### `ResponseRequest`

```go
sintaksdev.ResponseRequest{
    Model           string   // default dari WithChatModel (gpt-5-5)
    Input           string   // wajib
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
    Model          string   // default dari WithEmbeddingModel (qwen3-embedding-0-6b)
    Input          []string // satu vector untuk setiap input, sesuai urutan
    EncodingFormat string   // "float" (default jika kosong)
    Dimensions     *int     // pemotongan dimensi opsional
}
```

`EmbeddingResponse`: `Data[].Embedding []float64`, `Usage.PromptTokens`, `RequestID`.

### `ImageRequest`

```go
sintaksdev.ImageRequest{
    Prompt string // wajib
    Model  string // default dari WithImageModel (gpt-5-5)
    N      int
    Size   string // "WIDTHxHEIGHT" atau "auto" (default 1024x1024)
}
```

`ImageResponse`: `Data[].URL` (URL yang di-host) dan `RequestID`.

### Error

Respons non-2xx mengembalikan `*APIError` dengan `Status`, `Type`, `Code`, dan
`RequestID` (dari `X-Request-ID`). Request yang ditolak (`400`, `401`, `402`)
tidak dikenakan biaya; `402` berarti saldo tidak cukup untuk reservasi — lakukan top up.

### Helper

```go
sintaksdev.Ptr[T](v T) *T // pointer untuk field opsional
```

---

## Ringkasan default

| | Default |
|---|---|
| Chat model | `gpt-5-5` |
| Image model | `gpt-5-5` |
| Embedding model | `qwen3-embedding-0-6b` (1024 dimensi) |
| Base URL | `https://api.sintaks.dev` |

Lihat [panduan contoh](/id/guides/examples/) untuk cuplikan yang bisa dijalankan
dan [coding agent](/id/guides/coding-agents/) untuk konfigurasi agent.
