---
name: ads-review
description: Use when reviewing or adjusting paid ad channels — whether spend is working, optimizing a channel's keywords, bids, audiences or creatives, reconciling platform numbers with attribution, or moving budget between channels. Changes are proposed first and applied only after approval. NOT for organic content or store listings.
---

# Ads review

The platforms keep the numbers; the repository keeps the decisions and their reasons.

## Hard boundaries

- **The only things this skill may change are settings on an ad platform** — budget, bid, campaign status, keywords and negatives, targeting, schedules — and only **after the owner approves** the specific change. Present findings and proposals with risk and sample size, wait, then act. On a channel with an API tool, the approval is of the change file's dry-run output ([Platform APIs](#platform-apis)). The loop exists to catch wrong conclusions before they become actions.
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
| Spend, cost per result, which keyword ran | the platform API in read-only mode, else the console or export | — |

If attribution is not yet flowing into analytics, say so and stop: no review means anything until that link exists.

## Process

1. **Read the repository before opening a console** — budget file, the channel's campaign registry, changelog, keyword files, the latest review — so you do not reverse a deliberate decision.
2. **Pull live numbers** — through the platform API when the channel has a tool for it ([Platform APIs](#platform-apis)) — for the window since the last significant change, plus an equal window before it.
3. **Reconcile** platform-reported installs with the attribution arbiter. A gap under about 15% is normal; above that, investigate attribution before concluding anything about performance.
4. **Rank findings** by money affected.
5. **Present and wait** for approval, with risk and sample size.
6. **Apply, verify independently** (the after-state the tool re-read, or a reload and the platform's own counter — not the "saved" toast or a "✓"), then record.

## Platform APIs

When a channel has an API tool (recorded in the channel registry's Tooling section), use it rather than the browser: the numbers come back exact and repeatable, and every change becomes a file someone can review.

**Reading.** Pull numbers through a CLI that the tool itself forces into read-only mode, for example a Google Ads CLI run with its `--read-only` flag or environment switch, or the App Store Connect CLI `asc` with `ASC_READ_ONLY=1` for Apple Ads. The wrapper or command sets the switch, not whoever happens to call it, and the CLI refuses writes before they leave the machine. Prefer a read-only API credential for pulls. When the only credential can write, the tool's read-only mode is the only guard, so never run write-capable commands by hand with that credential. The first time you use a tool, check one report against the console and record that the two matched.

**Changing.** Every configuration change is a committed **change file** in the channel's `changes/` folder, never an ad-hoc command:

1. Propose in chat with numbers and risk (steps 4–5 above).
2. Write `changes/YYYY-MM-DD-<slug>.json`: `title`, `reason`, `steps` (the exact payloads to send), and the read calls that show the changed object.
3. **Dry run** (validate-only). The tool prints the exact calls, the payloads and the current state, and writes nothing.
4. **The owner approves that exact output.** Approving the idea is not approving the payload. If the file changes, run the dry run again and get approval again.
5. **Apply** with the tool's explicit flag (for example `--yes`). The tool re-reads the object and saves a result file next to the change, holding the state before, each step's response and the state after. When a step fails, the tool stops; read the partial result before you retry.
6. **Verify the after-state yourself** against what the file intended, not against the tool's "✓".
7. Add the changelog line, update the campaign registry and keyword files if they changed, then commit the change file and the result file together.

One variable per campaign per change. A change file never contains raw-request or auth commands that bypass the tool's guards. Deletions are flagged in the dry run, because most ad platforms cannot undo them.

**Browser fallback.** Open the console only when the API is down or does not expose what you need, and say that you did. Never sign in.

## Decision rules

1. Cheap cost per install is not low quality — check install → signup → activation → paid by source before judging.
2. Raising a bid does not buy users more willing to pay. Change what you optimize for or the intent you target, not the price.
3. One variable at a time; wait at least seven days.
4. No total budget increase while the bottom of the funnel leaks — answer "what is trial-to-paid now?" first. If it is low, the work is a product issue and a growth review.

## Traps

- Before blaming your last change for a drop, check campaign status, end dates and schedules.
- Read the negatives of the right campaign; several lists exist.
- Status indicators in consoles can lag right after a change; the campaign page is the source.
- Some consoles render client-side (Apple Ads among them): page text read right after navigation can be stale. Take a screenshot first to force a render, then read.
- Aggregated "low volume" rows hide a large share of results; a keyword missing from search terms is not proof it did not run.
- A few dozen taps or installs: a ten-point difference is usually inside one standard deviation — call it a directional signal.

## Output

Conclusion in three sentences · channel table (spend, installs, cost per install, trial, paid; exchange rate if converted) · attribution sanity check (self-reported versus arbiter, % gap) · downstream quality · ranked findings · **"not a problem — don't fix"** (mandatory) · proposals awaiting approval, each with reason and risk · the next readout date.

## Recording

Write to the repository **only when something changed on a platform**; a look without changes is answered in chat. Layout and file rules: [channel folders](references/channel-folders.md). When the repository disagrees with the live account, fix the repository to match the account and record why they drifted.
