# Examples

How to call sintaks.dev from any language or OpenAI SDK. Base URL:
`https://api.sintaks.dev` (append `/v1` per request or SDK base URL).
Every endpoint except `GET /healthz` requires a bearer API key.

```bash
export SINTAKS_API_KEY=sk-...
```

The API is OpenAI-compatible: any OpenAI SDK works by pointing it at
`https://api.sintaks.dev/v1` and using a sintaks.dev key.

## cURL

```bash
# Chat
curl -sS https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "messages": [{"role": "user", "content": "What is an API gateway?"}],
    "max_tokens": 512
  }'

# Embeddings
curl -sS https://api.sintaks.dev/v1/embeddings \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-embedding-0-6b",
    "input": ["serverless postgres", "vector search"]
  }'

# Images (returns hosted URLs)
curl -sS https://api.sintaks.dev/v1/images/generations \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "prompt": "warm flat illustration of a restaurant table with a QR code menu",
    "size": "1024x1024"
  }'
```

Streaming chat uses SSE: lines arrive as `data: <json>\n\n`, terminated by
`data: [DONE]`. Send `"stream": true` and `"stream_options": {"include_usage": true}`
to receive token usage on the final chunk.

## TypeScript / JavaScript

Official package: [`@sintaksdev/sdk`](https://www.npmjs.com/package/@sintaksdev/sdk)

```bash
npm install @sintaksdev/sdk
```

```ts
import { Sintaks } from "@sintaksdev/sdk";

const client = new Sintaks({ apiKey: process.env.SINTAKS_API_KEY });

// Chat (streaming)
const stream = await client.chat.completions.create({
  model: "claude-sonnet-5-5",
  messages: [{ role: "user", content: "Count to three." }],
  stream: true,
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}

// Embeddings
const embedding = await client.embeddings.create({
  model: "qwen3-embedding-0-6b",
  input: ["serverless postgres"],
});
console.log(embedding.data[0].embedding.length); // 1024

// Images
const image = await client.images.generate({
  model: "claude-sonnet-5-5",
  prompt: "warm flat illustration of a restaurant table with a QR code menu",
  size: "1024x1024",
});
console.log(image.data[0].url);
```

Or the official `openai` package:

```ts
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.SINTAKS_API_KEY,
  baseURL: "https://api.sintaks.dev/v1",
});
```

## Python

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sintaks.dev/v1",
    api_key="sk-...",
)

resp = client.chat.completions.create(
    model="claude-sonnet-5-5",
    messages=[{"role": "user", "content": "What is an API gateway?"}],
)
print(resp.choices[0].message.content)

embedding = client.embeddings.create(
    model="qwen3-embedding-0-6b",
    input=["serverless postgres"],
)
print(len(embedding.data[0].embedding))  # 1024

image = client.images.generate(
    model="claude-sonnet-5-5",
    prompt="warm flat illustration of a restaurant table with a QR code menu",
    size="1024x1024",
)
print(image.data[0].url)
```

## Go

Official SDK: [`github.com/rendies/sintaks-dev-go`](https://github.com/rendies/sintaks-dev-go) (standard library only)

```bash
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
    ctx := context.Background()

    resp, err := client.ChatCompletion(ctx, sintaksdev.ChatRequest{
        Model:    "claude-sonnet-5-5",
        Messages: []sintaksdev.Message{{Role: sintaksdev.RoleUser, Content: "Hello!"}},
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(resp.Content())

    emb, err := client.Embedding(ctx, sintaksdev.EmbeddingRequest{
        Input: []string{"serverless postgres"},
    })
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(len(emb.Data[0].Embedding)) // 1024
}
```

For streaming use `client.ChatCompletionStream(...)` and iterate the returned
stream.

## Java

```xml
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java</artifactId>
  <version>4.75.1</version>
</dependency>
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

OpenAIClient client = OpenAIOkHttpClient.builder()
    .apiKey(System.getenv("SINTAKS_API_KEY"))
    .baseUrl("https://api.sintaks.dev/v1")
    .build();

var completion = client.chat().completions().create(
    ChatCompletionCreateParams.builder()
        .model("claude-sonnet-5-5")
        .addUserMessage("What is an API gateway?")
        .maxTokens(512)
        .build());
System.out.println(completion.choices().get(0).message().content().orElse(""));
```

Or with `java.net.http.HttpClient` — see the full
[examples guide](https://docs.sintaks.dev/en/guides/examples/) for raw HTTP in
Java, JavaScript, and TypeScript.

## PHP

```bash
composer require openai-php/client
```

```php
<?php
require 'vendor/autoload.php';

$client = OpenAI::factory()
    ->withApiKey(getenv('SINTAKS_API_KEY'))
    ->withBaseUri('https://api.sintaks.dev/v1')
    ->make();

$result = $client->chat()->create([
    'model' => 'claude-sonnet-5-5',
    'messages' => [
        ['role' => 'user', 'content' => 'What is an API gateway?'],
    ],
]);

echo $result->choices[0]->message->content;
```

## C++

Any HTTP library works; the example uses libcurl:

```cpp
#include <curl/curl.h>
#include <string>

int main() {
    curl_global_init(CURL_GLOBAL_DEFAULT);
    CURL* curl = curl_easy_init();

    struct curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, "Authorization: Bearer sk-...");
    headers = curl_slist_append(headers, "Content-Type: application/json");

    const std::string body = R"({
      "model": "claude-sonnet-5-5",
      "messages": [{"role": "user", "content": "What is an API gateway?"}]
    })";

    curl_easy_setopt(curl, CURLOPT_URL, "https://api.sintaks.dev/v1/chat/completions");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
    curl_easy_perform(curl);

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
    curl_global_cleanup();
}
```

## C#

```csharp
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "sk-...");

var payload = """
{
  "model": "claude-sonnet-5-5",
  "messages": [{"role": "user", "content": "What is an API gateway?"}]
}
""";

var res = await client.PostAsync("https://api.sintaks.dev/v1/chat/completions",
    new StringContent(payload, Encoding.UTF8, "application/json"));
Console.WriteLine(await res.Content.ReadAsStringAsync());
```

## Rust

```rust
use reqwest::Client;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();
    let res = client.post("https://api.sintaks.dev/v1/chat/completions")
        .bearer_auth("sk-...")
        .json(&serde_json::json!({
            "model": "claude-sonnet-5-5",
            "messages": [{"role": "user", "content": "What is an API gateway?"}]
        }))
        .send()
        .await?;
    println!("{}", res.text().await?);
    Ok(())
}
```

## Dart

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

final res = await http.post(
  Uri.parse("https://api.sintaks.dev/v1/chat/completions"),
  headers: {
    "Authorization": "Bearer sk-...",
    "Content-Type": "application/json",
  },
  body: jsonEncode({
    "model": "claude-sonnet-5-5",
    "messages": [{"role": "user", "content": "What is an API gateway?"}],
  }),
);
print(res.body);
```

The portal overview page offers a searchable language picker with ready-to-copy
snippets for every language above (Node.js/TypeScript via `@sintaksdev/sdk`,
Go via `sintaks-dev-go`, Python, Java, PHP, C++, C#, Rust, Dart, and cURL)
across chat, embeddings, and image endpoints.

## Errors

Errors use the OpenAI envelope (`error.message`, `error.type`, `error.code`).
Key statuses:

| Status | Meaning |
|---|---|
| `400` | Invalid request/model/parameter; nothing is charged |
| `401` | Missing, malformed, revoked, or invalid API key |
| `402` | Balance cannot cover the reservation — top up first |
| `429` | Rate limited — retry with backoff |
| `5xx` | Gateway/provider failure — retry with backoff |

Every response carries `X-Request-ID` — include it in support requests; it
keys your usage history and the provider call.