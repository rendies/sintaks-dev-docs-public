---
title: Changelog
description: User-facing changes to the sintaks.dev API and documentation.
---

## 2026-10-27

- **`POST /v1/embeddings`** — OpenAI-compatible embeddings for text inputs, billed at the model's input-token rate. `input` accepts a string or an array of strings; `encoding_format: "float"` and `dimensions` are supported. See the [examples](/guides/examples/).
- Documentation reorganized: new [Examples](/guides/examples/) and [Troubleshooting](/guides/troubleshooting/) guides, and the quickstart now matches the shipped API surface.

## 2026-10-13

- **Image generation** — `POST /v1/images/generations` is served through the production provider and billed at the model's token rates. Results are hosted and returned as URLs; `response_format: "b64_json"` is rejected.
- **Model catalog** — `GET /v1/models` returns the active catalog; chat models resolve against the catalog and unknown models return `400`.

## 2026-10-04

- **Chat completions** — `POST /v1/chat/completions` with streaming (`stream: true`, SSE), `stream_options.include_usage`, `tools` / `functions` / `tool_choice`, `max_tokens` / `max_completion_tokens`, `temperature`, `top_p`, and `stop`.
- **Error semantics** — OpenAI-compatible error envelope with `400`, `401`, `402`, `429`, and `5xx` mappings; every response carries `X-Request-ID`.
- **API keys** — bearer keys created in the portal, shown once at creation, revoked keys rejected within about a minute.