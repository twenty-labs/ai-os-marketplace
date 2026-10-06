# Conversion audit — <YYYY-MM-DD>

Mode: data | journey. Window: <from → to, plus comparison window> (data mode). Volumes: <active users, payers — absolute>. Status: draft | delivered.

## 1. The one thing

The single decided fix: what, why this one first (expected value over effort, in users per week or revenue per month), and how we will know it worked (event or query, threshold, date).

## 2. Where users are lost

Data mode — the value chain:

| Step | Definition used | Users in → out | vs prior window | Confidence |
| --- | --- | --- | --- | --- |
| first contact → account | | | | |
| account → activation | | | | |
| activation → habit | | | | |
| habit → limit felt | | | | |
| limit → paywall seen | | | | |
| paywall → purchase | | | | |
| purchase → renewal | | | | |

Journey mode — the stations:

| # | Station | Evidence used (code / product / config) | Score 1–5 | One-line reason |
| --- | --- | --- | --- | --- |

Unmeasurable steps, each with the cheapest instrumentation that would light it up. The weakest step, split by at least one segment, and the one-sentence conclusion.

## 3. Findings

Ranked. Per finding:

### F<n> — <short imperative title>
- **Claim:**
- **Evidence:** file and line, table row with the date read, screenshot, or query — never a document or memory
- **Users per week or revenue per month affected:**
- **Confidence:** verified | hypothesis (N=…)
- **Fix shape and effort:**
- **How it will be measured:**

## 4. Bugs, ranked by money

Chain position × users per week × silence. The money path (purchase, restore, renewal, entitlement, grants) covered explicitly, even when clean.

## 5. Deliberate — don't fix

Behaviour that looks wrong but was decided on purpose, with where the decision is recorded.

## 6. What I could not determine

Each blind spot, why, and the cheapest way to remove it.

## 7. Deliberately not recommended

Obvious-looking ideas rejected, each with the reason.

## 8. Sequence and proposed issues

Ordered next steps after the one thing, each with its deciding metric. Proposed issues for the code repository (title, evidence, measurement), awaiting the owner's go-ahead.
