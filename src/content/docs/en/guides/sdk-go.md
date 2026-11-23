---
title: Go SDK
description: "Use the sintaks-dev-go module: install, reference, samples, and troubleshooting."
---

The official Go client is published at `github.com/rendies/sintaks-dev-go`. It depends only on the Go standard library.

## Install

```bash
go get github.com/rendies/sintaks-dev-go
```

## Quickstart

```go
package main

import (
    "context"
    "fmt"
    "log"
    "os"

    sintaksdev "github.com/rendies/sintaks-dev-go"
)

func main() {
    client := sintaksdev.New(os.Getenv("SINTAKS_API_KEY"))
    resp, err := client.ChatCompletion(context.Background(), sintaksdev.ChatRequest{
        Model:    "claude-sonnet-5-5",
        Messages: []sintaksdev.Message{{Role: "user", Content: "Halo!"}},
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(resp.Content())
}
```

## Reference

| Method | Endpoint |
|---|---|
| `ChatCompletion(ctx, ChatRequest) (*ChatResponse, error)` | `POST /v1/chat/completions` |
| `ChatCompletionStream(ctx, ChatRequest) (*ChatStream, error)` | `POST /v1/chat/completions` (SSE) |
| `Embedding(ctx, EmbeddingRequest) (*EmbeddingResponse, error)` | `POST /v1/embeddings` |
| `GenerateImage(ctx, ImageRequest) (*ImageResponse, error)` | `POST /v1/images/generations` |
| `EditImage(ctx, ImageEditRequest) (*ImageResponse, error)` | `POST /v1/images/edits` (multipart) |
| `Response(ctx, ResponseRequest) (*ResponseResult, error)` | `POST /v1/responses` |

### Client options

| Option | Description |
|---|---|
| `sintaksdev.WithBaseURL(u)` | Override the gateway URL (default `https://api.sintaks.dev`). |
| `sintaksdev.WithHTTPClient(h)` | Supply a custom `*http.Client`. |
| `sintaksdev.WithChatModel(m)` | Default chat model. |
| `sintaksdev.WithImageModel(m)` | Default image model. |
| `sintaksdev.WithEmbeddingModel(m)` | Default embedding model. |

## Samples

### Streaming chat

```go
stream, err := client.ChatCompletionStream(ctx, sintaksdev.ChatRequest{
    Model:    "claude-sonnet-5-5",
    Messages: []sintaksdev.Message{{Role: "user", Content: "Halo!"}},
})
if err != nil {
    log.Fatal(err)
}
defer stream.Close()
for {
    chunk, err := stream.Recv()
    if err == io.EOF { break }
    if err != nil { log.Fatal(err) }
    fmt.Print(chunk.Content())
}
```

### Embeddings

```go
res, err := client.Embedding(ctx, sintaksdev.EmbeddingRequest{
    Input: []string{"Semantic search with sintaks.dev"},
})
if err != nil { log.Fatal(err) }
fmt.Println(len(res.Data[0].Embedding))
```

### Image generation

```go
images, err := client.GenerateImage(ctx, sintaksdev.ImageRequest{
    Prompt: "A futuristic Jakarta skyline at dusk",
})
if err != nil { log.Fatal(err) }
fmt.Println(images.Data[0].URL)
```

### Image edits

```go
edited, err := client.EditImage(ctx, sintaksdev.ImageEditRequest{
    Prompt: "Add a chocolate fountain on the right",
    Images: []sintaksdev.ImageFile{{Filename: "input.png", Content: inputBytes, ContentType: "image/png"}},
    Masks:  []sintaksdev.ImageFile{{Filename: "mask.png", Content: maskBytes, ContentType: "image/png"}},
    Model:  "gpt-image-1",
    Size:   "1024x1024",
})
if err != nil { log.Fatal(err) }
fmt.Println(edited.Data[0].URL)
```

### Responses API

```go
resp, err := client.Response(ctx, sintaksdev.ResponseRequest{
    Input: []byte(`"What is the weather in Jakarta?"`),
})
if err != nil { log.Fatal(err) }
fmt.Println(resp.Output)
```

## Error handling

API errors return an `*APIError`:

```go
if err != nil {
    var apiErr *sintaksdev.APIError
    if errors.As(err, &apiErr) {
        fmt.Println(apiErr.Status, apiErr.Code, apiErr.RequestID)
    }
}
```

| Helper | Meaning |
|---|---|
| `sintaksdev.IsInsufficientMicrocredits(err)` | HTTP 402 — top up the balance. |
| `err.RequestID` | The `X-Request-ID` to quote when contacting support. |

## Troubleshooting

- **`401` invalid API key** — the key is missing or revoked. Create a new key in the portal.
- **Unknown model** — use an active model ID from `GET /v1/models`; IDs are case-sensitive.
- **Streaming hangs** — bound long requests with a context timeout instead of `http.Client.Timeout` (which can interrupt streams).
- **`data[0].URL` empty** — request `response_format: "b64_json"` to get raw bytes instead of a hosted URL.
