# Cost ledger

## One row per paid call

| Field | Notes |
| --- | --- |
| feature, call kind | e.g. conversation reply, suggestions, summary, pronunciation score, TTS line |
| provider, model | as billed, not as marketed |
| units | tokens in, tokens out, cached input tokens, audio seconds, characters, calls — whatever the provider bills on, plus volume units worth querying |
| price version | the effective date of the rate used |
| cost | computed from the price table; **null when the model or product has no price** |
| estimated | true when units were inferred (for example tokens from text length) rather than reported by the provider |
| user id, session id, turn id | opaque ids only; no transcript, audio or email |
| created at | server time |

Write the row where the call is made, from the provider's reported usage. Writing best-effort (never blocking the user) is fine, but count write failures somewhere so the loss is visible.

## Price table

- One table, effective-dated, per provider product. Billing shapes differ: per token, per audio second, per character, flat per call by product type. Model each honestly; do not force a flat-per-call price into a per-second rate.
- Never edit a past entry: add one with a later effective date, or history is rewritten.
- Account-level charges (monthly minimums, concurrency surcharges) do not belong on per-call rows; record them in ai-surface and add them in finance reporting.
- Reconcile against the provider's invoice periodically and record the gap.

## Reading it

- Every sum reports `count(*)` and `count(*) where cost is null` beside it. A sum with unpriced rows is a lower bound.
- Averages and percentiles per session use fully priced sessions only, and say how many were excluded.
- Known biases go next to the number: low (streams cut before the usage chunk, dropped writes, client-direct audio), high (cache hits billed at full rate).
- Before and after a change, filter by deploy date; a backfilled column describes today's state, not the state at the time.
