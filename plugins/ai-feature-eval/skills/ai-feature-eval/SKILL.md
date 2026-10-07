---
name: ai-feature-eval
description: "Use when building, changing or questioning a feature built on a paid AI provider — LLM calls, speech recognition, pronunciation or speech scoring, text-to-speech, realtime voice: recording what each call costs, unit economics per active user, spend caps per user and globally, measuring quality on a held-out corpus (precision, recall, false-alarm rate), changing a prompt or model safely, probing a provider's real responses, latency and fallbacks, logging without personal data, or investigating one bad turn or session. NOT for product analytics events (analytics-instrumentation), pricing the product to users (pricing), a security review of the paid routes (security-review), or deciding whether the feature should exist (product-owner)."
---

# AI feature evaluation

An AI feature has two numbers that nobody sees by default: what it costs per user, and how often it is wrong. Both are measured, never assumed, and both are re-measured whenever the prompt, the model or the provider changes. This skill is the method. The project's facts — providers and models per feature, prices and where the cost ledger lives, spend caps, evaluation corpora and scorers with their known limits, probe scripts, decided positions — live in `.ai-os/knowledge/ai-surface.md`. Read it first. If it is missing or unfilled, explore (provider clients, pricing tables, cost or usage tables, probe and benchmark scripts, environment variable names — never their values) and ask the owner the rest; fill it before changing anything.

Rules in every project:

- **A missing cost means unpriced, not free.** A call with no price is counted and reported as unpriced; any sum that contains one is a lower bound and is labelled so.
- **Quality claims come from a corpus, not anecdotes.** "It sounded right on three tries" is not a result. A number states its corpus, its size and what the corpus cannot represent.
- **Every paid call costs the owner money.** A probe, benchmark or corpus run that calls a paid provider states its expected spend first and waits for a yes. Prefer replaying committed results offline.
- **No personal data in logs, ledgers or committed corpora** — no transcripts, audio or user identifiers beyond an opaque id, unless ai-surface records a consented exception. Minors' audio is never stored.

| The ask | Mode |
| --- | --- |
| "what does this cost?", "per-user economics", a new paid call | cost |
| "cap spend", "someone burned the budget" | caps |
| "is it accurate?", "does the scorer work?" | quality |
| "change the prompt / model / provider" | change |
| "what does the provider actually return?", latency, fallbacks | probe |
| "this turn / session went wrong" | investigate — read-only |

## cost

1. **Ledger every paid call** at the point it is made: feature, provider, model, units (tokens in and out, cached tokens, audio seconds, characters, calls), price version, cost or null, an opaque user and session id. Prices live in one effective-dated table; add a new entry with a later date, never edit a past one. Detail in [cost ledger](references/cost-ledger.md).
2. **Know the ledger's blind spots** and write them into ai-surface: streams cut before usage arrives, best-effort writes that drop rows, cached tokens priced at full rate, audio streamed by the client straight to the provider, account-level minimums and surcharges no row can carry.
3. **Unit economics:** cost per session and per active user per day and month — mean, median and tail (p90, p99, max) — split by feature and call kind, from fully priced sessions only; compare with revenue per user for the tier. Say how many sessions the number rests on.

## caps

Spend is bounded where it is minted. Cap per user and globally, on the server, before the paid call or token is issued; cap the thing that spends (a provider token, a paid call), not a cheap wrapper (a session row). Name what each cap does not stop — a second account, a client streaming directly to the provider, retries that re-mint tokens — and set retry allowances so a flaky connection does not lock a user out. Record every cap, its value and its reason in ai-surface.

## quality

Measure on a **held-out corpus** with the [evaluation protocol](references/evaluation-protocol.md): tune on one set, evaluate on another, report correct, false alarms (the feature accuses a correct user), misses and abstentions, with per-class and per-speaker breakdowns. For a judgement shown to a learner, the false-alarm rate usually matters more than recall; an abstention ("undetermined") can be the designed answer. State what the scorer cannot detect, measured, and record it in ai-surface.

## change

Baseline → change → same corpus → compare. Run the current prompt or model on the corpus and keep its output; make one change; run the same corpus; compare quality, cost per call and latency side by side. A change ships only with that table in the pull request. A change that also moves cost gets a re-run of the unit economics.

## probe

Mocked tests cannot say what a provider really returns. A probe script calls the real API once per case with known input (synthetic audio from a clean TTS voice works: a low score then means the format is wrong, not the speaker), prints the raw response, and saves it so later runs can replay it offline. Measure latency per stage (first token, first audio byte, end of utterance) at p50 and p95, and test each fallback by forcing the failure locally: timeout, error, empty result, rate limit.

## investigate

One bad turn or session, read-only: follow [turn investigation](references/turn-investigation.md) — get the turn's structured log and ledger rows, attribute the problem to one stage and one provider, compare with today's baseline, and name the next concrete check. Never pull a user's transcript or audio beyond what ai-surface allows.

## Report

The numbers with their corpus, sample size and lower-bound labels; the comparison table for a change; caps and what they do not stop; what was not measured. End by updating ai-surface — a price, a cap, a scorer limit, a decided position — or saying "no durable change".
