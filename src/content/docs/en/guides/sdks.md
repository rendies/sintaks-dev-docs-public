---
title: SDKs & libraries
description: Choose an official SDK or use the OpenAI-compatible API.
---

The sintaks.dev API is OpenAI-compatible, so existing clients work out of the box. Two official SDKs are published:

- **TypeScript / JavaScript** — [`@sintaksdev/sdk`](https://www.npmjs.com/package/@sintaksdev/sdk) on npm. See the dedicated [TypeScript/JavaScript SDK guide](./sdk-javascript).
- **Go** — [`github.com/rendies/sintaks-dev-go`](https://github.com/rendies/sintaks-dev-go). See the dedicated [Go SDK guide](./sdk-go).

[![npm version](https://img.shields.io/npm/v/@sintaksdev/sdk?style=flat-square&label=npm)](https://www.npmjs.com/package/@sintaksdev/sdk)
[![npm downloads](https://img.shields.io/npm/dm/@sintaksdev/sdk?style=flat-square&label=npm%20downloads)](https://www.npmjs.com/package/@sintaksdev/sdk)
[![Go version](https://img.shields.io/github/v/tag/rendies/sintaks-dev-go?style=flat-square&label=Go%20SDK)](https://github.com/rendies/sintaks-dev-go)
[![Go reference](https://pkg.go.dev/badge/github.com/rendies/sintaks-dev-go)](https://pkg.go.dev/github.com/rendies/sintaks-dev-go)
[![GitHub stars](https://img.shields.io/github/stars/rendies/sintaks-dev-docs-public?style=flat-square&label=GitHub)](https://github.com/rendies/sintaks-dev-docs-public)

For other languages, use the OpenAI SDK with a custom `base_url`:

| Language | Package | Base URL |
|---|---|---|
| Python | `openai` | `https://api.sintaks.dev/v1` |
| Node.js | `openai` | `https://api.sintaks.dev/v1` |
| Java / others | any OpenAI-compatible SDK | `https://api.sintaks.dev/v1` |

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

Raw HTTP via cURL:

```bash
curl https://api.sintaks.dev/v1/chat/completions \
  -H "Authorization: Bearer sk-..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-5-5",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

Every request requires an API key as a bearer token — see [Authentication](./authentication). For full copy-paste recipes (streaming, embeddings, images, error handling), see [Examples](./examples).
