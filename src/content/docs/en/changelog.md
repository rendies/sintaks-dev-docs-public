---
title: Changelog
description: User-facing changes to the sintaks.dev API and documentation.
---

## 2026-11-24

- **Async video generation** — new `POST /v1/videos` (create a job), `GET /v1/videos/{id}` (poll status), and `GET /v1/videos/{id}/content` (redirect to the hosted result). See the [Videos reference](/en/reference/videos/).
- **Per-endpoint API reference** — the API reference now has a dedicated page per endpoint with full request and response field tables: [List models](/en/reference/models/), [Chat completions](/en/reference/chat-completions/), [Embeddings](/en/reference/embeddings/), [Image generation](/en/reference/images-generations/), [Image edits](/en/reference/images-edits/), [Responses](/en/reference/responses/), [Decisions](/en/reference/decisions/), and [Messages](/en/reference/messages/).
- **Dedicated SDK guides** — new [TypeScript/JavaScript SDK](/en/guides/sdk-javascript/) and [Go SDK](/en/guides/sdk-go/) pages with install, reference, samples, error handling, and troubleshooting.
- **Coding agents reorganized** — the [Coding agents](/en/guides/coding-agents/) guide is split into CLI agents, IDE integrations, and production apps, with dedicated sub-pages for [OpenCode](/en/guides/coding-agents/opencode/) and [Hermes](/en/guides/coding-agents/hermes/).
- **Top-up steps** — the [top-up guide](/en/guides/top-ups/) is now a step-by-step flow ending with the invoice email.
- **Docs site** — docs.sintaks.dev now serves the default-language content directly at the root (no redirect), the logo links to sintaks.dev, and the header includes Log in / Sign up buttons.

## 2026-11-23

- **`POST /v1/images/edits`** — image-to-image edits (img2img / inpainting) are documented in the API reference, and the JS/Go SDKs expose `client.images.edits` / `EditImage`.

## 2026-11-19

- **`POST /v1/messages`** — Anthropic Messages API-compatible endpoint. Use it from Claude Code (`ANTHROPIC_BASE_URL=https://api.sintaks.dev/v1`), the Anthropic SDKs, or any Anthropic-compatible client. Supports `system` (string or text blocks), streaming (`content_block_*` events), `tools` / `tool_choice`, image input, and `stop_sequences`. See the [Claude Code guide](/en/guides/claude-code/).

## 2026-10-27

- **`POST /v1/responses`** — Decision/response endpoint compatible with the OpenAI Responses API. Accepts `model`, `input`, `instructions`, `max_output_tokens`, `temperature`, and `top_p`. Returns `id`, `object`, `created`, `model`, `choices`, and `usage`. See the [sdk-reference](/en/guides/sdk-reference/) for TypeScript and Go SDK usage.
- **`POST /v1/images/generations`** — (existing) Image generation; results are hosted and returned as URLs.
- Documentation reorganized: new [Examples](/en/guides/examples/) and [Troubleshooting](/en/guides/troubleshooting/) guides, and the quickstart now matches the shipped API surface.

## 2026-10-13

- **Image generation** — `POST /v1/images/generations` is served through the production provider and billed at the model's token rates. Results are hosted and returned as URLs; `response_format: "b64_json"` is rejected.
- **Model catalog** — `GET /v1/models` returns the active catalog; chat models resolve against the catalog and unknown models return `400`.

## 2026-10-13

- **Image generation** — `POST /v1/images/generations` is served through the production provider and billed at the model's token rates. Results are hosted and returned as URLs; `response_format: "b64_json"` is rejected.
- **Model catalog** — `GET /v1/models` returns the active catalog; chat models resolve against the catalog and unknown models return `400`.

## 2026-10-04

- **Chat completions** — `POST /v1/chat/completions` with streaming (`stream: true`, SSE), `stream_options.include_usage`, `tools` / `functions` / `tool_choice`, `max_tokens` / `max_completion_tokens`, `temperature`, `top_p`, and `stop`.
- **Error semantics** — OpenAI-compatible error envelope with `400`, `401`, `402`, `429`, and `5xx` mappings; every response carries `X-Request-ID`.
- **API keys** — bearer keys created in the portal, shown once at creation, revoked keys rejected within about a minute.