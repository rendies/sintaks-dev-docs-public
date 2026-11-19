---
title: VS Code
description: Use sintaks.dev models in GitHub Copilot Chat with the sintaks.dev VS Code extension.
---

The sintaks.dev extension registers sintaks.dev as a language model provider in VS Code, so models from the sintaks.dev catalog appear in the VS Code model picker. Requests are billed per-request to your organization balance in IDR.

## Before you start

1. Install **VS Code 1.104 or later** with GitHub Copilot Chat available (built into recent VS Code releases; on older versions install the [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extension). The model provider API requires both, and third-party models are only surfaced to individual GitHub Copilot plans.
2. [Create an account](https://app.sintaks.dev) and top up your organization balance. Requests fail with `402 insufficient_quota` if the balance cannot cover them.
3. Create an API key in the portal's **API keys** section. Copy it when it is shown; the raw key is displayed only once.

## Install the extension

Install `sintaks-dev.sintaks-dev-copilot-provider` from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=sintaks-dev.sintaks-dev-copilot-provider), or run:

```bash
code --install-extension sintaks-dev.sintaks-dev-copilot-provider
```

## Add your API key

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run **sintaks.dev: Manage Provider**.
3. Choose **Set API key** and paste your key.

The key is stored in VS Code SecretStorage — the OS keychain — not in settings files, so it is never written to `settings.json` or synced in plaintext.

## Use sintaks.dev models in chat

1. Open the Command Palette and run **Chat: Manage Language Models** — or click the gear icon in the chat model picker.
2. In the Language Models editor, enable **sintaks.dev** models. The extension lists every active chat model from `GET /v1/models`, including context size and IDR input pricing.
3. Select a sintaks.dev model in the model picker and start chatting. Streaming responses, tool calls, and image inputs are supported where the model's capabilities allow.

The model list refreshes when you sign in or run **Refresh models** from the manage command. New models added to the catalog appear automatically — no extension update needed.

## Settings

| Setting | Default | Description |
|---|---|---|
| `sintaks.baseUrl` | `https://api.sintaks.dev/v1` | Gateway base URL. Only change this for a self-hosted or staging gateway. |

## Troubleshooting

- **Invalid API key (401):** Re-run **sintaks.dev: Manage Provider** → **Set API key**. Check the key has not been revoked in the portal.
- **Insufficient credits (402):** Top up the organization balance in the portal.
- **Rate limited (429):** Wait a moment and retry; the gateway limits concurrent requests per key.
- **No sintaks.dev models in the picker:** Confirm the API key is set, then run **Refresh models** from the manage command. Only chat models are listed — embedding and image models are not selectable for chat.
- **Extension not activating:** Confirm VS Code is on 1.104 or later and Copilot Chat is installed and enabled.

Every API response includes an `X-Request-ID`. Include that ID when contacting support about a failed request.
