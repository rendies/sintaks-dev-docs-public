---
title: Examples
description: Copy-paste examples for curl, JavaScript, TypeScript, and Java against the sintaks.dev gateway.
---

Base URL: `https://api.sintaks.dev` (the `/v1` path is appended per request or SDK base URL). Every endpoint except `GET /healthz` requires a bearer API key.

```bash
export SINTAKS_API_KEY=sk-...
```

Models in the examples are real catalog entries: `claude-sonnet-5-5` for chat, `qwen3-embedding-0-6b` for embeddings. Call `GET /v1/models` for the current list.

## cURL

### Health check

```bash
curl -sS https://api.sintaks.dev/healthz
# {"status":"ok"}
```

### List available models

```bash
curl -sS https://api.sintaks.dev/v1/models \
  -H "Authorization: Bearer $SINTAKS_API_KEY"
```

### Chat completion (non-streaming)

```bash
curl -sS https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is an API gateway?"}
    ],
    "max_tokens": 512,
    "temperature": 0.7
  }'
```

Notes:

- `model` must be an active catalog model; unknown models return `400`.
- `max_completion_tokens` is also accepted. When neither is sent the gateway sends `max_tokens: 4096` upstream so the billing reservation always covers the reply.
- Send `temperature` **or** `top_p`, not both. Reasoning models ignore `temperature`.
- `stop` accepts a string or an array (max 4 entries). `tools` / `functions` and `tool_choice` are supported and relayed to the provider; streamed and non-streamed responses carry `tool_calls` like OpenAI.

### Chat completion (streaming, SSE)

```bash
curl -sN https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "stream": true,
    "stream_options": {"include_usage": true},
    "messages": [{"role": "user", "content": "Count to three."}]
  }'
```

- Lines arrive as `data: <json>\n\n`, terminated by `data: [DONE]`.
- The usage chunk (empty `choices`, `usage` present) is only sent when `stream_options.include_usage` is true.
- If the client disconnects mid-stream the model keeps running and the final charge is estimated from what was already produced.

### Embeddings

```bash
curl -sS https://api.sintaks.dev/v1/embeddings \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-embedding-0-6b",
    "input": ["serverless postgres", "vector search"],
    "encoding_format": "float"
  }'
```

- `input` is a string or an array of strings; the response returns one `embedding` per input, in request order.
- Embeddings are billed at the model's input-token rate; `usage.prompt_tokens` is reported.

### Image generation

```bash
curl -sS https://api.sintaks.dev/v1/images/generations \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "prompt": "warm flat illustration of a restaurant table with a QR code menu",
    "n": 1,
    "size": "1024x1024"
  }'
```

- `size` is `WIDTHxHEIGHT` or `auto`. Use a size the model supports (for example `1024x1024`); unsupported sizes fail upstream and are refunded.
- `n` runs `n` parallel model calls; you receive and pay for only the images that came back.
- `response_format` must be `"url"` or omitted; `"b64_json"` returns `400` — images are always hosted URLs.
- Image generation is billed with the model's token rates; see [pricing](/guides/pricing/) and the portal model catalog.

### Errors

```bash
# Missing or unknown key
curl -si https://api.sintaks.dev/v1/chat/completions -d '{}'
# HTTP/2 401
# {"error":{"message":"invalid API key","type":"invalid_request_error","code":"invalid_api_key"}}

# Insufficient balance
# HTTP/2 402
# {"error":{"message":"insufficient credits","type":"insufficient_quota","code":"insufficient_quota"}}
```

Every response includes `X-Request-ID`; quote it when asking for a refund or reporting a failure that was still charged. Local validation failures (400/401/402) are never charged.

## JavaScript

Runs in Node.js 18+ and browsers. Two approaches: plain `fetch` (no dependencies) and the official `openai` npm package.

### Plain fetch

```js
const BASE_URL = "https://api.sintaks.dev";

const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.SINTAKS_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-5-5",
    messages: [{ role: "user", content: "What is an API gateway?" }],
    max_tokens: 512,
  }),
});

if (!res.ok) {
  const { error } = await res.json();
  // res.status: 401 invalid_api_key, 402 insufficient_quota, 400 bad request
  // res.headers.get("x-request-id") — quote it for refunds/support
  throw new Error(`${res.status} ${error?.type}: ${error?.message} (request_id ${res.headers.get("x-request-id")})`);
}

const completion = await res.json();
console.log(completion.choices[0].message.content);
console.log(completion.usage); // {prompt_tokens, completion_tokens, total_tokens}
```

Streaming (SSE over `res.body`):

```js
const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.SINTAKS_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-5-5",
    stream: true,
    stream_options: { include_usage: true },
    messages: [{ role: "user", content: "Count to three." }],
  }),
});

const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
let buffer = "";
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += value;
  // SSE events are separated by a blank line.
  const events = buffer.split("\n\n");
  buffer = events.pop(); // keep the incomplete tail
  for (const evt of events) {
    const data = evt.replace(/^data: /, "");
    if (data === "[DONE]") continue;
    const chunk = JSON.parse(data);
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) process.stdout.write(delta);
    if (chunk.usage) console.log("\nusage:", chunk.usage);
  }
}
```

Embeddings:

```js
const res = await fetch(`${BASE_URL}/v1/embeddings`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.SINTAKS_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "qwen3-embedding-0-6b",
    input: ["serverless postgres", "vector search"],
  }),
});
const { data } = await res.json();
console.log(data[0].embedding.length); // 1024
```

Image generation:

```js
const res = await fetch(`${BASE_URL}/v1/images/generations`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.SINTAKS_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-5-5",
    prompt: "warm flat illustration of a restaurant table with a QR code menu",
    n: 1,
    size: "1024x1024",
  }),
});
const { data } = await res.json();
console.log(data[0].url); // public hosted URL
```

### Official `openai` npm package

```bash
npm install openai
```

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.SINTAKS_API_KEY,
  baseURL: "https://api.sintaks.dev/v1",
});

// Non-streaming
const completion = await client.chat.completions.create({
  model: "claude-sonnet-5-5",
  messages: [{ role: "user", content: "What is an API gateway?" }],
  max_tokens: 512,
});
console.log(completion.choices[0].message.content);

// Streaming — same SSE the gateway emits
const stream = await client.chat.completions.create({
  model: "claude-sonnet-5-5",
  stream: true,
  stream_options: { include_usage: true },
  messages: [{ role: "user", content: "Count to three." }],
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
  if (chunk.usage) console.log("\nusage:", chunk.usage);
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

Errors surface as `APIError` with `status`, `code`, `type`, and `requestID` (read from `X-Request-ID` — quote it for refunds):

```js
import { APIError } from "openai";

try {
  await client.chat.completions.create({ model: "claude-sonnet-5-5", messages: [] });
} catch (err) {
  if (err instanceof APIError) {
    console.error(err.status, err.code, err.message, err.requestID);
    // 401 → bad key; 402 → insufficient_quota, top up
  } else {
    throw err;
  }
}
```

## TypeScript

The official `openai` package ships its own types, so the quickest typed client is the npm SDK pointed at sintaks.dev:

```bash
npm install openai
```

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.SINTAKS_API_KEY,
  baseURL: "https://api.sintaks.dev/v1",
});

const completion = await client.chat.completions.create({
  model: "claude-sonnet-5-5",
  messages: [{ role: "user", content: "What is an API gateway?" }],
  max_tokens: 512,
});
const text: string = completion.choices[0].message.content ?? "";

const stream = await client.chat.completions.create({
  model: "claude-sonnet-5-5",
  stream: true,
  stream_options: { include_usage: true },
  messages: [{ role: "user", content: "Count to three." }],
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}
```

The gateway's wire format is documented in the [OpenAPI spec](/openapi.yaml). A typed `fetch` wrapper with error handling:

```ts
interface ErrorResponse {
  error: { message: string; type: string; code?: string };
}

export class SintaksError extends Error {
  constructor(
    public readonly status: number,
    public readonly type: string,
    public readonly requestID: string | null,
    message: string,
  ) {
    super(message);
  }
  get isInsufficientCredits() { return this.status === 402; }
  get isUnauthorized() { return this.status === 401; }
}

export async function chatCompletion(
  req: { model: string; messages: { role: string; content: string }[]; max_tokens?: number },
  apiKey = process.env.SINTAKS_API_KEY!,
  baseURL = "https://api.sintaks.dev",
) {
  const res = await fetch(`${baseURL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = (await res.json()) as ErrorResponse;
    throw new SintaksError(res.status, body.error.type, res.headers.get("x-request-id"), body.error.message);
  }
  return res.json();
}
```

## Java

Two approaches: `java.net.http.HttpClient` (JDK 17+, plus a JSON library — Jackson shown) and the official OpenAI Java SDK (`com.openai:openai-java`).

### `java.net.http.HttpClient`

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpClient http = HttpClient.newHttpClient();
ObjectMapper json = new ObjectMapper();
String baseUrl = "https://api.sintaks.dev";
String apiKey = System.getenv("SINTAKS_API_KEY");

// Non-streaming chat
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create(baseUrl + "/v1/chat/completions"))
    .header("Authorization", "Bearer " + apiKey)
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("""
        {
          "model": "claude-sonnet-5-5",
          "messages": [{"role": "user", "content": "What is an API gateway?"}],
          "max_tokens": 512
        }
        """))
    .build();

HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
String requestId = res.headers().firstValue("x-request-id").orElse(null);
if (res.statusCode() != 200) {
    JsonNode err = json.readTree(res.body()).path("error");
    // 401 invalid_api_key, 402 insufficient_quota, 400 bad request
    throw new IllegalStateException(
        res.statusCode() + " " + err.path("type").asText() + ": "
        + err.path("message").asText() + " (request_id " + requestId + ")");
}
JsonNode completion = json.readTree(res.body());
System.out.println(completion.at("/choices/0/message/content").asText());
```

Streaming — read the SSE body as lines:

```java
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create(baseUrl + "/v1/chat/completions"))
    .header("Authorization", "Bearer " + apiKey)
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("""
        {
          "model": "claude-sonnet-5-5",
          "stream": true,
          "stream_options": {"include_usage": true},
          "messages": [{"role": "user", "content": "Count to three."}]
        }
        """))
    .build();

http.send(req, HttpResponse.BodyHandlers.ofLines()).body().forEach(line -> {
    if (!line.startsWith("data: ") || line.equals("data: [DONE]")) return;
    try {
        JsonNode chunk = json.readTree(line.substring(6));
        String delta = chunk.at("/choices/0/delta/content").asText("");
        if (!delta.isEmpty()) System.out.print(delta);
        if (chunk.has("usage")) System.out.println("\nusage: " + chunk.get("usage"));
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
});
```

Embeddings and images:

```java
// Embeddings
HttpResponse<String> emb = http.send(
    HttpRequest.newBuilder()
        .uri(URI.create(baseUrl + "/v1/embeddings"))
        .header("Authorization", "Bearer " + apiKey)
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("""
            {
              "model": "qwen3-embedding-0-6b",
              "input": ["serverless postgres"]
            }
            """))
        .build(),
    HttpResponse.BodyHandlers.ofString());
System.out.println(json.readTree(emb.body()).at("/data/0/embedding").size()); // 1024

// Image generation
HttpResponse<String> img = http.send(
    HttpRequest.newBuilder()
        .uri(URI.create(baseUrl + "/v1/images/generations"))
        .header("Authorization", "Bearer " + apiKey)
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString("""
            {
              "model": "claude-sonnet-5-5",
              "prompt": "warm flat illustration of a restaurant table with a QR code menu",
              "n": 1,
              "size": "1024x1024"
            }
            """))
        .build(),
    HttpResponse.BodyHandlers.ofString());
String url = json.readTree(img.body()).at("/data/0/url").asText();
```

### Official OpenAI Java SDK

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
import com.openai.errors.OpenAIServiceException;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.images.ImageGenerateParams;

OpenAIClient client = OpenAIOkHttpClient.builder()
    .apiKey(System.getenv("SINTAKS_API_KEY"))
    .baseUrl("https://api.sintaks.dev/v1")
    .build();

// Non-streaming
var completion = client.chat().completions().create(
    ChatCompletionCreateParams.builder()
        .model("claude-sonnet-5-5")
        .addUserMessage("What is an API gateway?")
        .maxTokens(512)
        .build());
System.out.println(completion.choices().get(0).message().content().orElse(""));

// Streaming
try (var stream = client.chat().completions().createStreaming(
        ChatCompletionCreateParams.builder()
            .model("claude-sonnet-5-5")
            .addUserMessage("Count to three.")
            .build())) {
    stream.stream().forEach(chunk ->
        chunk.choices().stream().findFirst()
            .flatMap(c -> c.delta().content())
            .ifPresent(System.out::print));
}

// Images
var image = client.images().generate(
    ImageGenerateParams.builder()
        .model("claude-sonnet-5-5")
        .prompt("warm flat illustration of a restaurant table with a QR code menu")
        .n(1)
        .size(ImageGenerateParams.Size.of("1024x1024"))
        .build());
System.out.println(image.data().orElseThrow().get(0).url().orElseThrow());
```

Errors throw `OpenAIServiceException` with `statusCode()`, `code()`, `type()`, and `headers()` — `X-Request-ID` is in `headers().values("x-request-id")`:

```java
try {
    client.chat().completions().create(params);
} catch (OpenAIServiceException e) {
    // 401 → bad key; 402 → insufficient_quota, top up
    System.err.println(e.statusCode() + " " + e.type().orElse("") + ": " + e.getMessage()
        + " (request_id " + e.headers().values("x-request-id") + ")");
}
```

## Recipes: slug + OG card

The slug and Open Graph card recipes below mirror the Go SDK's `GenerateSlug` / `GenerateOGCard` — same prompts and same slug cleanup.

### JavaScript / TypeScript

```js
const SLUG_SYSTEM_PROMPT =
  "You write SEO-friendly URL slugs. Reply with exactly one slug and nothing else: " +
  "lowercase ASCII letters, digits and hyphens only, no spaces, quotes or explanation. " +
  "Keep the most important keywords in the language of the title and drop filler words where it stays readable.";

// Mirrors sintaksdev.Slugify: lowercase, fold Latin accents, hyphenate,
// truncate at a word boundary.
export function slugify(s, maxLen = 60) {
  let out = s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (out.length > maxLen) {
    const cut = out.lastIndexOf("-", maxLen);
    out = out.slice(0, cut > 0 ? cut : maxLen);
  }
  return out;
}

export async function generateSlug(client, { title, description, maxLength = 60 }) {
  let prompt = `Title: ${title.slice(0, 150)}`;
  if (description) prompt += `\nDescription: ${description.slice(0, 300)}`;
  prompt += `\nMaximum length: ${maxLength} characters`;

  const res = await client.chat.completions.create({
    model: "claude-sonnet-5-5",
    messages: [
      { role: "system", content: SLUG_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    max_tokens: 32,
    temperature: 0.2,
  });
  return slugify(res.choices[0].message.content, maxLength) || slugify(title, maxLength);
}

export function ogCardPrompt(title, description, style) {
  style ||= "clean, modern, professional, soft vibrant gradients";
  let p = `Background artwork for a social media link preview card about: ${title.slice(0, 150)}.`;
  if (description) p += ` Context: ${description.slice(0, 300)}.`;
  p += ` Style: ${style.slice(0, 150)}.`;
  p += " Wide composition with calm negative space for a headline overlay. No text, no letters, no logos, no watermarks.";
  return p;
}

export async function generateOGCard(client, { title, description, style }) {
  const image = await client.images.generate({
    model: "claude-sonnet-5-5",
    prompt: ogCardPrompt(title, description, style),
    n: 1,
    size: "1024x1024",
  });
  return image.data[0].url;
}
```

### Java

```java
static final String SLUG_SYSTEM_PROMPT =
    "You write SEO-friendly URL slugs. Reply with exactly one slug and nothing else: "
    + "lowercase ASCII letters, digits and hyphens only, no spaces, quotes or explanation. "
    + "Keep the most important keywords in the language of the title and drop filler words where it stays readable.";

// Mirrors sintaksdev.Slugify: lowercase, fold Latin accents, hyphenate,
// truncate at a word boundary.
static String slugify(String s, int maxLen) {
    String out = Normalizer.normalize(s, Normalizer.Form.NFD)
        .replaceAll("\\p{M}", "")
        .toLowerCase(Locale.ROOT)
        .replaceAll("[^a-z0-9]+", "-")
        .replaceAll("^-+|-+$", "");
    if (out.length() > maxLen) {
        int cut = out.lastIndexOf('-', maxLen);
        out = out.substring(0, cut > 0 ? cut : maxLen);
    }
    return out;
}

static String generateSlug(OpenAIClient client, String title, String description, int maxLength) {
    String prompt = "Title: " + (title.length() > 150 ? title.substring(0, 150) : title);
    if (description != null && !description.isBlank())
        prompt += "\nDescription: " + (description.length() > 300 ? description.substring(0, 300) : description);
    prompt += "\nMaximum length: " + maxLength + " characters";

    var res = client.chat().completions().create(
        ChatCompletionCreateParams.builder()
            .model("claude-sonnet-5-5")
            .addSystemMessage(SLUG_SYSTEM_PROMPT)
            .addUserMessage(prompt)
            .maxTokens(32)
            .temperature(0.2)
            .build());
    String reply = res.choices().get(0).message().content().orElse("");
    String slug = slugify(reply, maxLength);
    return slug.isEmpty() ? slugify(title, maxLength) : slug;
}

static String ogCardPrompt(String title, String description, String style) {
    if (style == null || style.isBlank())
        style = "clean, modern, professional, soft vibrant gradients";
    String p = "Background artwork for a social media link preview card about: "
        + (title.length() > 150 ? title.substring(0, 150) : title) + ".";
    if (description != null && !description.isBlank())
        p += " Context: " + (description.length() > 300 ? description.substring(0, 300) : description) + ".";
    p += " Style: " + (style.length() > 150 ? style.substring(0, 150) : style) + ".";
    return p + " Wide composition with calm negative space for a headline overlay."
        + " No text, no letters, no logos, no watermarks.";
}

static String generateOGCard(OpenAIClient client, String title, String description, String style) {
    var image = client.images().generate(
        ImageGenerateParams.builder()
            .model("claude-sonnet-5-5")
            .prompt(ogCardPrompt(title, description, style))
            .n(1)
            .size(ImageGenerateParams.Size.of("1024x1024"))
            .build());
    return image.data().orElseThrow().get(0).url().orElseThrow();
}
```