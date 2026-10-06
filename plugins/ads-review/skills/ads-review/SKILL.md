---
name: ads-review
description: Use when reviewing or adjusting paid ad channels — whether spend is working, optimizing a channel's keywords, bids, audiences or creatives, reconciling platform numbers with attribution, or moving budget between channels. Changes are proposed first and applied only after approval. NOT for organic content or store listings.
---

# Ads review

The platforms keep the numbers; the repository keeps the decisions and their reasons.

## Hard boundaries

- **The only things this skill may change are settings on an ad platform** — budget, bid, campaign status, keywords and negatives, targeting, schedules — and only **after the owner approves** the specific change. Present findings and proposals with risk and sample size, wait, then act. The loop exists to catch wrong conclusions before they become actions.
- **Never edit product code.** When the analysis shows the product must change, open an issue in the code repository with the numbers that led to it, then stop.
- **Never sign in to a platform** or enter credentials. If a console shows a sign-in screen, stop and tell the owner.

## Scope

| Request | Scope |
| --- | --- |
| full review | every channel, the cross-channel layer, downstream quality |
| one channel | optimization inside that channel only |

A single-channel review **never concludes that one channel beats another.** Cross-channel comparison is valid only in a full review, using the attribution arbiter.

## Two layers, two cadences

- **Within a channel — weekly.** Optimize the channel's own unit: keywords for search ads, asset groups for app campaigns, creatives and audiences for social. Use the platform's own numbers here.
- **Across channels — monthly.** Compare cost per acquisition through to trial and paid, using the attribution arbiter from the measurement plan, and decide budget moves. The only layer allowed to say "channel A beats channel B".

## Sources, in order of trust

| Question | Right source | Not this |
| --- | --- | --- |
| Who paid, how much | the payments ledger or billing tool named in the measurement plan | app purchase events (often fire at trial start) |
| Which channel an install or signup came from | the attribution arbiter, joined to analytics | platform-reported installs |
| Spend, cost per result, which keyword ran | the platform console or export | — |

If attribution is not yet flowing into analytics, say so and stop: no review means anything until that link exists.

## Process

1. **Read the repository before opening a console** — budget file, the channel's campaign registry, changelog, keyword files, the latest review — so you do not reverse a deliberate decision.
2. **Pull live numbers** for the window since the last significant change, plus an equal window before it.
3. **Reconcile** platform-reported installs with the attribution arbiter. A gap under about 15% is normal; above that, investigate attribution before concluding anything about performance.
4. **Rank findings** by money affected.
5. **Present and wait** for approval, with risk and sample size.
6. **Apply, verify independently** (reload, the platform's own counter — not the "saved" toast), then record.

## Decision rules

1. Cheap cost per install is not low quality — check install → signup → activation → paid by source before judging.
2. Raising a bid does not buy users more willing to pay. Change what you optimize for or the intent you target, not the price.
3. One variable at a time; wait at least seven days.
4. No total budget increase while the bottom of the funnel leaks — answer "what is trial-to-paid now?" first. If it is low, the work is a product issue and a growth review.

## Traps

- Before blaming your last change for a drop, check campaign status, end dates and schedules.
- Read the negatives of the right campaign; several lists exist.
- Status indicators in consoles can lag right after a change; the campaign page is the source.
- Aggregated "low volume" rows hide a large share of results; a keyword missing from search terms is not proof it did not run.
- A few dozen taps or installs: a ten-point difference is usually inside one standard deviation — call it a directional signal.

## Output

Conclusion in three sentences · channel table (spend, installs, cost per install, trial, paid; exchange rate if converted) · attribution sanity check (self-reported versus arbiter, % gap) · downstream quality · ranked findings · **"not a problem — don't fix"** (mandatory) · proposals awaiting approval, each with reason and risk · the next readout date.

## Recording

Write to the repository **only when something changed on a platform**; a look without changes is answered in chat. Layout and file rules: [channel folders](references/channel-folders.md). When the repository disagrees with the live account, fix the repository to match the account and record why they drifted.
