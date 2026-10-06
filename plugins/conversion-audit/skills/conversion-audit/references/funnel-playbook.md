# Funnel playbook

Portable reasoning for a product that converts free users to paying ones. The category- and market-specific half lives in the project's domain-playbook knowledge file; where the two disagree, the domain playbook wins — it was written closer to the ground.

## 1. The value chain, in order

```
first contact → account → activation (first real value delivered)
→ habit (returns unprompted) → limit felt → paywall seen with a reason
→ purchase → renewal
```

- **Fixing a step only helps users who reach it.** Paywall polish is worthless to users who never activated. Find the earliest step losing the most users per week.
- **Activation is delivering the core value once**, not completing signup. Proxies (a session opened, a screen viewed) are named as proxies.
- **Habit precedes monetization.** A user who has not returned unprompted has nothing to lose at a wall; a limit felt before habit converts nobody and churns somebody.
- **Renewal is part of the chain** — the cheapest revenue there is.

## 2. Small-N discipline

- Under about 30 users in a denominator, rates are hypotheses; show absolute counts.
- At small scale one user's week moves weekly lines by double digits; movements inside that band are noise without a mechanism.
- Structural evidence — a trigger that cannot fire, a step with no instrumentation, a price shown wrong — outranks statistics and is decidable at any N. Prefer it.
- Natural experiments (a promotion ending, a forced update) beat A/B tests you lack the volume to run.

## 3. Gating

Per limit:

- Is it hit **while wanting more** (engaged, mid-flow) or **while discovering less** (before value)? The first converts; the second churns.
- Is daily use still possible? A gate that blocks the habit starves the paywall.
- Is the limit legible before it bites? A visible meter converts; a surprise wall enrages.
- **Reach before scarcity** — tightening a gate helps only if users reach it. If few do, the problem is upstream.
- Server-enforced or display-only? A limit only the UI knows about is a suggestion.
- Consider value sampling — tastes of paid value inside the free flow — before a tighter limit. Free is an acquisition strategy, judged by the activated users it feeds the paywall.

## 4. Paywall timing

- Map every trigger: reason, surface, and whether it can fire **before activation** (if it can, that is a bug).
- Strong moments: a limit reached mid-flow, a result worth keeping, progress about to be lost, an evident habit on day 2–3. Weak: app open, end of onboarding, random interstitials.
- **A strong moment with no trigger wired** usually beats any copy change on existing triggers.
- Every surface emits shown and dismissed events, or its conversion rate is fiction.
- Per-reason funnel (impression → call to action → purchase) by users. A reason with impressions and no purchases is mistimed, mispriced or mis-targeted — the split says which.

## 5. Unit economics

Where usage has real marginal cost (AI inference, media, messaging):

- Know the monthly cost of one active free user and which feature drives it; watch the 95th percentile, not the mean.
- The free tier is a cost decision wearing a growth costume — price "more generous free" per user before judging it.
- Anything that grants the expensive resource (referrals, rewards, promotions) competes with its own paid product; check how much is given away versus sold.
- Before touching a price point: does the value metric scale with delivered value; is the debate at the right order of magnitude; is "underpricing" really too few tiers for the spread of willingness to pay?
- Churn ceiling ≈ new users per period ÷ churn rate. If the ceiling is near, the headline belongs to retention, not the paywall.

## 6. Content and supply

When a content-shaped surface underperforms, four diagnoses — only one is answered by producing more:

- **Starvation** — engaged users exhaust what exists. More of the same.
- **Difficulty cliff** — entry works, the next step loses them. Fill the gap, not the end.
- **Wrong audience band** — supply aimed above or below the actual users. Re-aim.
- **Discovery** — the content is fine and unreachable. Surface it.

Count supply from the live store, not the repository: authored and published diverge.

## 7. Bugs by money

Rank by **chain position × users per week × silence**, never by crash volume:

1. The money path first — purchase, restore, renewal, entitlement resolution, discounts, grants. A silent restore failure churns payers who wanted to stay.
2. Then the activation path — a broken first run loses everyone at the top.
3. Silent failures outrank loud ones at equal position.
4. Expired-but-live surfaces (a blocker for a disabled feature, an orphaned route) are bugs even though nothing crashes.

## 8. Segment before you average

Split the weakest step at least once — lifecycle stage, entry path, platform, plan history. A mediocre average is often one healthy segment plus one broken one.

## 9. Qualitative signal

Replays, reviews, support threads and walking the flow yourself carry the most information per minute at small N. Replays show layout and where a thumb went, never content — content questions need events or transcripts within the project's privacy rules.
