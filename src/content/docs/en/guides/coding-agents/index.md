---
title: Coding agents
description: Connect coding agents and AI tools to the sintaks.dev API.
---

sintaks.dev exposes the OpenAI-compatible API that coding agents and AI tools can use with a custom provider. Configure your tool with the base URL `https://api.sintaks.dev/v1`, your API key, and a model ID from `GET /v1/models`.

## Before you start

1. [Create an account](https://app.sintaks.dev) and top up your organization balance. Requests fail with `402 insufficient_quota` if the balance cannot cover them.
2. Create an API key in the portal's **API keys** section. Copy it when shown (raw key is shown once).
3. Choose an active model. List models with:

   ```bash
   curl https://api.sintaks.dev/v1/models \
     -H "Authorization: Bearer $SINTAKS_API_KEY"
   ```

Keep API keys private — never commit them to a repository or shared config.

## CLI agents

Command-line coding agents that run in your terminal:

| Agent | Guide |
|---|---|
| OpenCode | [Configure OpenCode](./opencode) |
| Hermes | [Configure Hermes](./hermes) |
| Claude Code | [Claude Code](../claude-code) |

## IDE integrations

Editors and IDE coding assistants:

- **VS Code** — see the [VS Code guide](../vscode).
- **Cursor / JetBrains / other IDE assistants** — set the provider to OpenAI-compatible with `https://api.sintaks.dev/v1` as the base URL and your key as the API key.

## Production apps using the API

For applications that call the API directly (not an agent), use an official SDK or the REST API:

- TypeScript/JavaScript: [@sintaksdev/sdk](../sdk-javascript)
- Go: [sintaks-dev-go](../sdk-go)
- Any OpenAI-compatible SDK: point `base_url` at `https://api.sintaks.dev/v1`.

The gateway is OpenAI-compatible, so existing SDKs and tools work without custom adapters.
