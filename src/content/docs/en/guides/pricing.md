---
title: Pricing and balance
description: How IDR top-ups become balance and how requests are billed.
---

## Balance

Your balance is the IDR you deposit, in rupiah. A top-up through iPaymu (QRIS, virtual accounts, e-wallets) adds to your balance exactly the amount you paid.

You never need to think about the unit behind the scenes: what you see and pay is always Rupiah. Balance never expires.

## Reservation and settlement

Every billable request is metered in two steps:

1. **Reserve** the worst-case cost before calling the provider. If the balance cannot cover it, the request fails with `402` before any provider call.
2. **Settle** the actual cost after the provider reports usage. The difference is refunded (or additionally charged) immediately.

A request that never reaches the provider is fully refunded. A request that failed upstream but consumed usage is billed for what it used and flagged in your usage history.

## Usage history

The **Usage & Audit Log** in the customer portal lists settled requests with token counts, cache savings, refunds, model, pricing version, and provider status, keyed by the gateway request ID.

## Per-token pricing

Token rates are set by your organization's pricing version. The model catalog and rates are visible after signing in to the portal; endpoint documentation lives in the [API reference](/en/reference/endpoints/).