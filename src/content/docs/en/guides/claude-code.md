---
title: Claude Code
description: Use sintaks.dev models in Claude Code and other Anthropic-compatible clients via the /v1/messages endpoint.
---

sintaks.dev serves an Anthropic Messages API-compatible endpoint at `POST /v1/messages`, so Claude Code, the Anthropic SDKs, and other Anthropic-compatible clients can use sintaks.dev models directly. Requests are billed per-request to your organization balance in IDR.

## Before you start

1. [Create an account](https://app.sintaks.dev) and top up your organization balance. Requests fail with `402 insufficient_quota` if the balance cannot cover them.
2. Create an API key in the portal's **API keys** section. Copy it when it is shown; the raw key is displayed only once.
3. Choose an active **chat** model from the catalog — Claude Code calls `/v1/messages`, which serves chat models only. Embedding, image, and decision models are not selectable there.

## Claude Code

Point Claude Code at the sintaks.dev gateway with environment variables:

```bash
export ANTHROPIC_BASE_URL="https://api.sintaks.dev/v1"
export ANTHROPIC_AUTH_TOKEN="sk-..."
export ANTHROPIC_MODEL="openai/gpt-6.1-sol"
claude
```

Replace `openai/gpt-6.1-sol` with any active chat model ID from `GET /v1/models`. `ANTHROPIC_AUTH_TOKEN` maps to your sintaks.dev API key; the gateway never sees an Anthropic credential.

Tool calling works: Claude Code's tools arrive as `tool_use`/`tool_result` blocks and are translated to the gateway's tool protocol. Image input and streaming are supported where the selected model's capabilities allow.

## Anthropic SDKs

The official Anthropic SDKs accept a custom `baseURL`. Node.js:

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "https://api.sintaks.dev/v1",
  apiKey: "sk-...",
});

const message = await client.messages.create({
  model: "openai/gpt-6.1-sol",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello" }],
});
```

Python:

```python
from anthropic import Anthropic

client = Anthropic(base_url="https://api.sintaks.dev/v1", api_key="sk-...")

message = client.messages.create(
    model="openai/gpt-6.1-sol",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
)
```

Any Anthropic-compatible client that lets you set the base URL and API key can use the same configuration.

## Notes

- **Model IDs are sintaks.dev catalog IDs**, not Anthropic model names — use the `model` value from `GET /v1/models`.
- `system` may be a string or an array of text blocks; `stream`, `tools`, `tool_choice`, `max_tokens`, `temperature`, `top_p`, and `stop_sequences` are supported.
- Responses use Anthropic message shapes (`msg_…` IDs, `content_block_*` stream events) so clients parse them unchanged.
- Keep API keys private. Do not commit them to a repository or put them in shared project configuration.

## Troubleshooting

- **401 / invalid API key:** check the key and confirm it has not been revoked; create a new one if needed.
- **402 / insufficient quota:** top up the organization balance in the portal.
- **Model not found:** only active chat models are served by `/v1/messages`; use an active chat model ID from `GET /v1/models`.
- **Tool or image failures:** the model's capabilities decide whether tools and image inputs are accepted; pick a model whose catalog capabilities match your use case.

Every API response includes an `X-Request-ID`. Include that ID when contacting support about a failed request.