# Integrations

sintaks.dev speaks the OpenAI wire protocol, so any tool that supports a
custom OpenAI-compatible endpoint can use it. The universal pattern is:

```text
Base URL: https://api.sintaks.dev/v1
API key:  sk-... (created in the portal, shown once)
Model:    any active catalog model (GET /v1/models), e.g. claude-sonnet-5-5
```

Top up an IDR balance first — requests fail with `402 insufficient_quota`
until the balance can cover the reservation.

## Connecting an agent platform

Most agent platforms let you set a custom model provider or override the
OpenAI/Anthropic base URL via settings or environment variables. Point them
at sintaks.dev:

```text
OPENAI_BASE_URL=https://api.sintaks.dev/v1
OPENAI_API_KEY=sk-...
```

Examples that work out of the box (or with a one-line base-URL change):

- **Claude Code / CLI agents** — set the model provider to a custom
  OpenAI-compatible endpoint (`ANTHROPIC_BASE_URL`/`ANTHROPIC_AUTH_TOKEN` or
  the tool's custom-provider setting) and select a catalog model.
- **Cursor / editor agents** — add a custom OpenAI-compatible provider in
  settings with the base URL above.
- **Open WebUI / chat frontends** — "OpenAI API" connection type, base URL
  `https://api.sintaks.dev/v1`.
- **LiteLLM** — add sintaks.dev as an `openai`-style provider:
  ```yaml
  model_list:
    - model_name: claude-sonnet-5-5
      litellm_params:
        model: openai/claude-sonnet-5-5
        api_base: https://api.sintaks.dev/v1
        api_key: sk-...
  ```
- **Hermes and other agents** — any platform that accepts a custom OpenAI
  base URL + key works the same way: set `https://api.sintaks.dev/v1` and an
  API key, then pick a catalog model. If the platform only exposes preset
  providers, check for an "OpenAI-compatible" or "custom endpoint" option.

## Connecting an LLM gateway (9router, etc.)

Gateways like 9router front multiple providers behind one router. Add
sintaks.dev as an OpenAI-compatible provider:

1. **Provider / upstream**: type `OpenAI-compatible`, base URL
   `https://api.sintaks.dev/v1`, bearer key = your sintaks.dev API key.
2. **Models**: the gateway catalog models (e.g. `claude-sonnet-5-5`,
   `gpt-5-4`, `qwen3-embedding-0-6b`). `GET /v1/models` returns the current
   list; run a router sync if the gateway caches model lists.
3. **Prefixed model IDs**: sintaks.dev accepts custom-router model IDs such
   as `sintaks-prod/claude-sonnet-5` — the router prefix before `/` is
   stripped for catalog resolution and the original ID is echoed back in the
   response envelope, so router round-trips keep working.

Notes for gateway operators:

- Billing is per-request microcredit settlement; a `402` means the upstream
  sintaks.dev balance is empty — top up before retrying in bulk.
- Streaming (`stream: true`) and `stream_options.include_usage` are
  supported; token usage is returned on the final chunk.
- The catalog changes when the operator adds models from the admin console;
  re-sync router model lists or rely on `GET /v1/models`.

## Embeddings for vector stores

Use the OpenAI-compatible embeddings endpoint with `qwen3-embedding-0-6b`
(1024 dimensions) for RAG pipelines:

```python
embedding = client.embeddings.create(
    model="qwen3-embedding-0-6b",
    input=["serverless postgres"],
)
```

Works with any vector store or RAG framework that accepts an OpenAI
embeddings client (point it at `https://api.sintaks.dev/v1`).

## Health and diagnostics

- `GET https://api.sintaks.dev/healthz` — gateway up (`{"status":"ok"}`).
- `GET /v1/models` — current active catalog.
- Every response carries `X-Request-ID`; quote it when reporting failures.

See [EXAMPLES.md](EXAMPLES.md) for per-language code, and
[docs.sintaks.dev](https://docs.sintaks.dev) for the full API reference,
pricing, and troubleshooting.