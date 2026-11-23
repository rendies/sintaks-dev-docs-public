---
title: SDK Go
description: "Gunakan module sintaks-dev-go: instalasi, referensi, contoh, dan pemecahan masalah."
---

Klien Go resmi diterbitkan di `github.com/rendies/sintaks-dev-go`. Hanya bergantung pada pustaka standar Go.

## Instalasi

```bash
go get github.com/rendies/sintaks-dev-go
```

## Mulai cepat

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

## Referensi

| Method | Endpoint |
|---|---|
| `ChatCompletion(ctx, ChatRequest) (*ChatResponse, error)` | `POST /v1/chat/completions` |
| `ChatCompletionStream(ctx, ChatRequest) (*ChatStream, error)` | `POST /v1/chat/completions` (SSE) |
| `Embedding(ctx, EmbeddingRequest) (*EmbeddingResponse, error)` | `POST /v1/embeddings` |
| `GenerateImage(ctx, ImageRequest) (*ImageResponse, error)` | `POST /v1/images/generations` |
| `EditImage(ctx, ImageEditRequest) (*ImageResponse, error)` | `POST /v1/images/edits` (multipart) |
| `Response(ctx, ResponseRequest) (*ResponseResult, error)` | `POST /v1/responses` |

### Opsi client

| Opsi | Keterangan |
|---|---|
| `sintaksdev.WithBaseURL(u)` | Ganti URL gateway (default `https://api.sintaks.dev`). |
| `sintaksdev.WithHTTPClient(h)` | Berikan `*http.Client` kustom. |
| `sintaksdev.WithChatModel(m)` | Model chat default. |
| `sintaksdev.WithImageModel(m)` | Model gambar default. |
| `sintaksdev.WithEmbeddingModel(m)` | Model embedding default. |

## Contoh

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
    Input: []string{"Pencarian semantik dengan sintaks.dev"},
})
if err != nil { log.Fatal(err) }
fmt.Println(len(res.Data[0].Embedding))
```

### Generate image

```go
images, err := client.GenerateImage(ctx, sintaksdev.ImageRequest{
    Prompt: "Cakrawala Jakarta futuristik saat senja",
})
if err != nil { log.Fatal(err) }
fmt.Println(images.Data[0].URL)
```

### Edit image

```go
edited, err := client.EditImage(ctx, sintaksdev.ImageEditRequest{
    Prompt: "Tambahkan air mancur cokelat di sisi kanan",
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
    Input: []byte(`"Bagaimana cuaca di Jakarta?"`),
})
if err != nil { log.Fatal(err) }
fmt.Println(resp.Output)
```

## Penanganan error

Error API mengembalikan `*APIError`:

```go
if err != nil {
    var apiErr *sintaksdev.APIError
    if errors.As(err, &apiErr) {
        fmt.Println(apiErr.Status, apiErr.Code, apiErr.RequestID)
    }
}
```

| Helper | Makna |
|---|---|
| `sintaksdev.IsInsufficientMicrocredits(err)` | HTTP 402 — top up saldo. |
| `err.RequestID` | `X-Request-ID` untuk dikutip saat menghubungi dukungan. |

## Pemecahan masalah

- **`401` API key tidak valid** — key hilang atau dicabut. Buat key baru di portal.
- **Model tidak dikenal** — gunakan model aktif dari `GET /v1/models`; ID peka huruf besar/kecil.
- **Streaming menggantung** — batasi request panjang dengan timeout context, bukan `http.Client.Timeout` (dapat mengganggu streaming).
- **`data[0].URL` kosong** — minta `response_format: "b64_json"` untuk mendapatkan byte mentah, bukan URL.
