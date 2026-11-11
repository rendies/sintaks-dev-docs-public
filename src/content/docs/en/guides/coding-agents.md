---
title: Coding agents
description: Connect OpenCode and other coding agents to the sintaks.dev API.
---

This guide is for developers configuring coding agents to call sintaks.dev's public API. It covers OpenCode and the general setup for other agents that support custom OpenAI-compatible providers.

Use sintaks.dev with coding agents that support a custom OpenAI-compatible provider. This guide shows OpenCode; other agents use the same API URL, key, and model ID.

## Before you start

1. [Create an account](https://app.sintaks.dev) and top up your organization balance. Requests can fail with `402 insufficient_quota` if the balance cannot cover them.
2. Create an API key in the portal's **API keys** section. Copy it when it is shown; the raw key is displayed only once.
3. Choose an active model from the catalog. You can list current models with:

   ```bash
   curl https://api.sintaks.dev/v1/models \
     -H "Authorization: Bearer $SINTAKS_API_KEY"
   ```

Keep API keys private. Do not commit them to a repository or put them in project configuration shared with other people.

## OpenCode

OpenCode supports custom providers in `opencode.json`. Configure sintaks.dev as an OpenAI-compatible provider and use a model ID returned by `GET /v1/models`:

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

Set the key in your shell environment before launching OpenCode:

```bash
export SINTAKS_API_KEY="sk-..."
opencode
```

Replace `claude-sonnet-5-5` with any active model ID. If you use a model that needs additional provider options, check the model's requirements in the sintaks.dev catalog and OpenCode's provider documentation.

You can also store provider configuration in the global OpenCode config (`~/.config/opencode/opencode.json`) to make it available across projects. Prefer environment-variable references for secrets; avoid placing raw keys in a checked-in `opencode.json`.

## Other coding agents

For an agent with a custom OpenAI-compatible provider setting, enter:

| Setting | Value |
|---|---|
| Provider type | OpenAI-compatible / custom OpenAI provider |
| Base URL | `https://api.sintaks.dev/v1` |
| API key | Your sintaks.dev API key |
| Model | An active model ID from `GET /v1/models` |

Some agents configure these values with environment variables instead:

```bash
export OPENAI_BASE_URL="https://api.sintaks.dev/v1"
export OPENAI_API_KEY="sk-..."
```

Follow the agent's own instructions for custom providers and model IDs. If it only supports preset providers, look for a custom endpoint or OpenAI-compatible option.

## Troubleshooting

- **`401` / invalid API key:** Check the key and confirm it has not been revoked. Create a new key if the original is unavailable.
- **`402` / insufficient quota:** Add balance to the organization in the portal.
- **Unknown model:** Use an active model ID from `GET /v1/models`; model names are case-sensitive.
- **Connection or provider errors:** Confirm the base URL is exactly `https://api.sintaks.dev/v1` and the agent is configured to use the OpenAI-compatible protocol.

Every API response includes an `X-Request-ID`. Include that ID when contacting support about a failed request.
