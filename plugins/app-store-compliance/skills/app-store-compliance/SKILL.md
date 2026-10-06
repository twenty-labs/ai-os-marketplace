---
name: app-store-compliance
description: Use before submitting a mobile build to App Store or Google Play review, after a rejection, to check one risk area (purchases, account deletion, permissions, privacy, sign-in), to decide whether a change may ship over the air or needs a store build, or to draft review notes. NOT for store screenshots or fixing findings.
---

# App store compliance

Read the project the way a store reviewer will meet the build, and say what will get it rejected before the store does. A rejection costs a review cycle; a removal costs the app. Every finding points at evidence; what you cannot see is **unverified**, never a violation.

This skill reviews; it never fixes, submits or ships. Findings become recommendations for implementation. Never run release tooling, never submit in a store console, never reply to the reviewer — replies are drafts the owner sends. Never make purchases, real or sandbox, and never print a credential: name where it lives.

## Before you start

Read the store-review knowledge file (`.ai-os/knowledge/store-review.md`) if the project has one: where this stack keeps its platform config, reviewer access, the monetization and deletion seams, the over-the-air update policy, the rejection history and decided positions. Every past rejection is re-checked for regression. If the file is missing or unfilled, explore first (platform config, purchase and deletion handlers, update tooling) and ask the owner for what exploration cannot answer — reviewer account, rejection history, decided positions — then fill it.

Follow each client call across the repository boundary: account deletion and purchase validation are only as compliant as the backend handler behind them, and anything queued for an over-the-air update ships code the reviewer never saw.

Guidelines change. When you can reach the official App Store Review Guidelines and Google Play policy pages, verify current wording before quoting a rule; otherwise say the rule is quoted from memory and unverified.

## Route the ask

| The ask | Job | Output |
| --- | --- | --- |
| "audit before we submit", "will this be rejected?" | 1. Pre-submission audit | the full report below |
| "will this paywall / deletion flow / sign-in pass?" | 2. Targeted check | risk-register rows and detailed findings for that area |
| "we were rejected under X" | 3. Rejection response | cause with evidence, same-area sweep, draft reply |
| "can this ship over the air?" | 4. Update eligibility | per item: update-safe / store build required / unclear |
| "draft the review notes" | 5. Review notes | paste-ready notes |

**Job 3** quotes the store's message verbatim, finds the cause, sweeps the same guideline area for siblings the reviewer will flag next, and records the rejection in the store-review file. **Job 4** follows [update eligibility](references/update-eligibility.md).

## Method — pre-submission audit

1. **Identify the core**: the product's primary purpose, its top three flows, and what using it requires (account, permissions, purchase).
2. **Top rejection risks first** — missing or vague permission purpose strings; undisclosed data collection or tracking; purchase flows without restore or with unclear terms; digital goods sold outside the store's billing; a login wall with no explanation or reviewer path; third-party sign-in without the platform's required alternative; account creation without in-app deletion; claims needing substantiation; placeholder screens and dead ends.
3. **Systematic checklist** — [review checklist](references/review-checklist.md), covering both stores.
4. **Reviewer friction** — demo account or demo mode, review notes, first-run clarity, states that make the app look broken.

## Report shape

1. **Executive summary** — purpose in one line, top three approval risks, top three fast wins.
2. **Risk register** — Priority (P0 blocker, P1 high, P2 medium, P3 low) · Area · Finding · Why review might reject · Evidence · Recommendation · Effort (S/M/L) · Confidence.
3. **Detailed findings** grouped by privacy, permissions, monetization, accounts, content, stability, reviewability — each with what you saw, why it matters, what to change, how to verify.
4. **Reviewer walkthrough** — install and launch, first run, permissions, core feature, purchase and restore, links and legal pages, offline and empty states — each marked succeeds, fails or unverified.
5. **Draft review notes** — steps to key features, account placeholders, unusual permissions explained, how to test purchases.

Evidence for each finding is at least one of: file and line, symbol name, screen or route, a config key, an endpoint. Do not invent features that are not in the code.

## Records

Audits and rejection responses go to `docs/store-review/<YYYY-MM-DD>-<topic>.md`. Chat gets the summary and the P0/P1 rows. Every engagement ends by updating the store-review file (a new rejection, SDK, reviewer account or decided position) or saying "no durable change".
