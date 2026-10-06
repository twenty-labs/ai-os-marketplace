---
name: growth-review
description: Use when the product has real users and the question is why they drop off, do not activate, do not pay or churn — reading funnels, cohorts, retention and session replays, or checking unit economics before spending more. NOT when there is no data yet (conversion-audit) or for ad platform decisions (ads-review).
---

# Growth review

Real behaviour, real funnels, issues backed by numbers. Read, never change: no product code, no analytics flags, no experiments started without the owner's approval. The output is a report and proposed issues for the code repository, each carrying its table of numbers.

**No data, stop.** Under roughly 50 users through the step in question, every rate is noise. Say "not enough sample" and switch to the conversion-audit skill, which reads the journey instead of the numbers.

## Funnels are defined, not invented

Use the funnels, event names and person properties the project's measurement plan (or analytics documentation) defines, with their exact step order. Respect the dates it marks as "do not compare across" — an event whose meaning changed in a release cannot be trended through that release. If no funnel is defined for the question, define it in the report first and propose adding it to the measurement plan.

Typical funnels to have defined: activation (first open → first value), account creation (before or after first value), core loop (unit → next unit), feature adoption (start → complete per feature), revenue (limit → paywall → tap → purchase), retention (message → open → return; day 1, day 7).

## Segment before concluding

An aggregate rate hides everything. Always break down by the registered segmentation properties — onboarding path, stated goal, plan, acquisition source, app version (to separate behaviour changes by release).

## Process

1. Read the measurement plan and the latest review in the repository.
2. Pick one funnel. Pull per-step numbers for about 30 days, segmented. Record the sample size at every step.
3. Find the **step that loses the most people** — by people lost, not by percentage.
4. Watch at least five session replays at that step before forming a hypothesis (humans watch replays; describe what was seen, not what you guess). Numbers say where; replays say why.
5. Read the code behind that screen so each hypothesis rests on what really exists.
6. Propose: one hypothesis per issue, with the numbers table, the segment, replay references, and how the fix will be measured after shipping. If the project enabled external skills such as `onboarding`, `paywalls`, `churn-prevention` or `ab-testing`, use them to shape the proposal.

## Unit economics — quarterly, or before any spend increase

Ad reviews look at acquisition cost; someone has to look at the variable cost of serving a user. Where usage has marginal cost (AI calls, media processing, messaging), compute per month and per cohort (free versus paid): the cost of serving an active user, revenue net of store fees, estimated lifetime value from renewal rates, and acquisition cost from the cross-channel ads review. End with one sentence: **is lifetime value greater than acquisition plus serving cost, and by what margin?** If free users cost more than expected, the lever is limits or caching — a product issue — not a price increase.

## Output

Conclusion in three sentences with sample sizes · funnel table by step × segment · the biggest loss and what the replays showed · findings ranked by people lost · **"not a problem — don't fix"** (behaviour that looks wrong but is understood) · proposed issues awaiting approval. Save reports that outlive the conversation as `docs/reviews/YYYY-MM-DD-growth.md`.

## Traps

- Events that count only when the app is open (a "notification received" event is not the number sent).
- Same event name, different meaning across a release.
- A paywall-viewed event is not a user who wants to buy — read its trigger property before computing rates.
- Retention is computed by install date, not calendar date.
