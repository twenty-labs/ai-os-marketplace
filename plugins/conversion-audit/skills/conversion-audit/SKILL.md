---
name: conversion-audit
description: Use when auditing why a product does not convert — users not activating or paying, what to limit or gate, when the paywall should fire, which bugs cost money — or walking the journey before launch or ads. Produces a ranked, read-only diagnosis with one decided fix. NOT for a single metric question or building the fix.
---

# Conversion audit

Find where the product loses users and money, decide what to do about it, and defend each recommendation with evidence. The value is the diagnosis: this skill never writes product code, not even a throwaway script. The only file it creates is the report. Production is read-only — query, never write, and never print a secret.

## Pick the mode

| Situation | Mode | Evidence |
| --- | --- | --- |
| Real users pass through the funnel (roughly 50+ per step in the window) | **Data mode** — walk the value chain with numbers | code, data, users' own signals |
| No users yet, before launch or ads, or a flow just changed | **Journey mode** — walk the stations as a new user | code, the running product, external config |

Most audits of a young product are journey mode with a little data. Say which mode you are in and why.

## Before anything: priors

Read the prior-findings and domain-playbook knowledge files if the project has them, the most recent previous audit (beat its baselines instead of rediscovering them), and what shipped lately — usually what moved the numbers. A decision recorded with its reason goes under "deliberate — don't fix", not under findings.

## Scope the ask

| The ask | Lead with | But still do |
| --- | --- | --- |
| "how do we get people to pay" | gating and paywall placement | the value chain — the answer is usually upstream |
| "when should the paywall show" | trigger reachability and timing | check nothing fires before activation |
| "which limits should change" | gating design | read prior findings on gating first |
| "which bugs matter" | bug triage by money | rank by chain position, not crash volume |
| "audit the product" | the whole chain | everything |

Push back on exactly one framing: optimizing the paywall when users never reach it. Say so in a sentence, then deliver the requested analysis anyway, plus the upstream finding.

## Data mode

1. **Ground truth from code and live config** — what each plan actually gets (live tables, not constants), every paywall trigger and whether it is reachable, what is enforced on the server versus only displayed, what is deliberately disabled.
2. **The numbers** — users not events, test accounts filtered, dual-emitted events swept before any total, zeros checked against never-fired lists, small-N rates labeled hypotheses.
3. **Walk the value chain** ([funnel playbook](references/funnel-playbook.md) §1). Report both readings of "weakest": the step losing the most users absolutely and the step with the lowest pass-through. Name the steps you cannot measure — a blind spot is a finding, often the cheapest. Split the weakest step by at least one segment.
4. **Interrogate each dimension** — gating, paywall timing, content or supply, bugs by money (playbook §3–§7). Parallel subagents are fine if each is briefed read-only, counts users, and returns claim · evidence · users per week · confidence.
5. **Users' own signals** — replays (watched by humans), support threads, reviews, and walking the flow yourself as a new free user. Two independent signals on one screen is a finding; one is a hypothesis.

## Journey mode

Walk every station in [the journey stations](references/journey-stations.md), from the store listing to the first renewal, as a new user. Every station gets a row in the report, including stations where nothing was found. Use all three evidence sources at each station: **code** (file and line), **the running product** (a screenshot per station), and **external config** (store listing, billing offerings, remote config). A station missing a source is capped at 3 of 5 and marked unconfirmed; if the product cannot be run, say "code only" for that station rather than skipping it silently.

At every station also check measurement: an event the project's analytics plan lists that does not fire, or fires without the property needed to segment it, is a finding — it would leave that step blind once users arrive.

## Decide

Rank by expected value over effort, value in users per week or revenue per month, not adjectives. **Pick one top recommendation** — twelve unranked ideas is a way of making no decision — and state how you will know it worked. Fill "deliberately not recommended": rejecting obvious-looking ideas with reasons is what makes the rest credible. If the honest conclusion is "instrument X first", say that; never invent a finding to look useful.

## Write it up

Use [the report template](references/report-template.md), saved as `docs/audits/<YYYY-MM-DD>-conversion-audit.md` (or the project's reviews folder if it has one). Chat gets the one thing, the weakest step and the finding count. Each product change becomes a proposed issue for the code repository, with its evidence and how it will be measured — opened only after the owner agrees. Correct prior findings where this audit proved them wrong.

## The quality bar

| Weak | Strong |
| --- | --- |
| Percentages with no denominator | "37% (3 of 8) — hypothesis, small N" |
| A limit quoted from a document | The live row, with the date read |
| Twelve findings, unranked | One decided fix, the rest sequenced, the deciding metric named |
| Silent about what could not be measured | A blind-spots section with the cheapest fix for each |
| An average | The weakest step split by segment |

The subtlest failure is mistaking measurable for important. The instrumented parts of the funnel are the parts someone already thought about; the biggest leaks usually live in the unmeasured steps.
