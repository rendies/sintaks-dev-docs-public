---
title: POST /v1/decisions
description: Typed answers (predicate, choice, score) from decision models.
---

Asks a decision model to answer typed questions about a shared input, compatible with the OpenAI Decisions API.

`POST https://api.sintaks.dev/v1/decisions`

Auth: `Authorization: Bearer <api key>`.

## Request body

```json
{
  "model": "typesafe-ai/jev-1.14.0",
  "input": "The package arrived broken. I want my money back.",
  "questions": [
    { "type": "predicate", "name": "refund", "instructions": "Is the customer asking for a refund?" }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `model` | string | yes | A `decision` model from `GET /v1/models`. |
| `input` | string \| array | yes | The shared input the questions are asked against. |
| `questions` | array | yes | Questions (max 64). Each has `type` (`predicate`, `choice`, `score`), `name`, and `instructions`. |

## Response

```json
{
  "model": "typesafe-ai/jev-1.14.0",
  "answers": [
    { "type": "predicate", "name": "refund", "probability": 0.92 }
  ],
  "usage": { "input_tokens": 24, "output_tokens": 3, "total_tokens": 27 }
}
```

| Field | Type | Description |
|---|---|---|
| `model` | string | The serving model. |
| `answers` | array | One answer per question, in question order. |
| `answers[].type` | string | `predicate`, `choice`, or `score`. |
| `answers[].name` | string | Matches the question's `name`. |
| `answers[].probability` | number | Predicate confidence in [0,1]. |
| `answers[].choice` | string | Selected choice (choice questions). |
| `answers[].score` | number | Probability-weighted level index (score questions). |
| `answers[].confidence` | number | Confidence, when the model returns it. |
| `answers[].probabilities` | object | Distribution, when the model returns it. |
| `usage.input_tokens` | integer | Input tokens. |
| `usage.output_tokens` | integer | Output tokens. |
| `usage.total_tokens` | integer | Total tokens. |

## Example

```bash
curl https://api.sintaks.dev/v1/decisions \
  -H "Authorization: Bearer $SINTAKS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe-ai/jev-1.14.0",
    "input": "The package arrived broken. I want my money back.",
    "questions": [
      { "type": "predicate", "name": "refund", "instructions": "Is the customer asking for a refund?" }
    ]
  }'
```
