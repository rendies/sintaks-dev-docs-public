---
title: OpenCode
description: Configure sintaks.dev as an OpenAI-compatible provider in OpenCode.
---

[OpenCode](https://opencode.ai) supports custom OpenAI-compatible providers in `opencode.json`. Configure sintaks.dev as a provider and use a model ID from `GET /v1/models`.

## Configuration

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "sintaks": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "sintaks.dev",
      "options": {
        "baseURL": "https://api.sintaks.dev/v1",
        "apiKey": "{env:SINTAKS_API_KEY}"
      },
      "models": {
        "claude-sonnet-5-5": {
          "name": "Claude Sonnet 5.5"
        }
      }
    }
  },
  "model": "sintaks/claude-sonnet-5-5"
}
```

Set the key in your shell before launching OpenCode:

```bash
export SINTAKS_API_KEY="sk-..."
opencode
```

Replace `claude-sonnet-5-5` with any active model ID. You can store the provider in the global config (`~/.config/opencode/opencode.json`) to make it available across projects. Prefer environment-variable references for secrets.

## Troubleshooting

- **`401` invalid API key** — confirm the key is valid and not revoked; create a new one if needed.
- **`402` insufficient quota** — top up the organization balance.
- **Unknown model** — use an active model ID from `GET /v1/models`; IDs are case-sensitive.
- **Connection errors** — confirm `baseURL` is exactly `https://api.sintaks.dev/v1` and the provider type is OpenAI-compatible.

Every response carries `X-Request-ID`; include it when contacting support about a failed request.
