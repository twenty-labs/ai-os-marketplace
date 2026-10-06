---
name: lifecycle-campaign
description: Use when designing, launching or reading a lifecycle campaign — push, email, in-app message, personal offer, discount code, gift or win-back — as cohort, moment, message, kill switch and holdout measurement. NOT for paid ads or messages the product already sends by default.
---

# Lifecycle campaign

A campaign = cohort · moment · message · kill switch · measurement. This skill joins the product's existing parts (push types, in-app messages, offers, discount codes, gifts, referrals) into campaigns with a cohort and a measurement — and it **sends nothing itself**: it writes the design, the owner switches it on.

If the project enabled external skills such as `emails`, `sms`, `churn-prevention` or `offers`, use them for message craft.

## Read what the product already does

Before designing, read the product's scheduled and triggered messages (reminder jobs, default push types, onboarding emails). A "campaign" that duplicates a default message — say, a day-2 reminder the product already sends every evening — is not a campaign; it is a default that is already running. Never message the same person twice about the same thing.

Know the plumbing's limits before promising anything: whether a message can deep-link to a specific screen, whether a message carries a campaign identifier (without it, opens cannot be separated from the default message of the same type), and whether any holdout mechanism exists. Missing plumbing is an issue for the code repository — written into the design as "pending", never pretended.

## The design — `docs/campaigns/YYYY-MM-DD-<slug>.md`

All six sections, or it is not a campaign yet. Template: [campaign design](references/campaign-design.md).

1. **Cohort** — defined with events and properties that really exist in the measurement plan, with its current size.
2. **Moment** — when it sends, counted from which event. One campaign, one moment.
3. **Channel and message** — which channel and message type, the copy in the project's locale, one call to action, the deep link.
4. **Kill switch** — what turns it off within minutes without a build (an active flag, an end date, a remote flag). No kill switch, no launch.
5. **Measurement** — the open event, the target behaviour, and a **holdout** (10–20% of the cohort, assigned by a stable hash of the user id) so the campaign is compared with doing nothing. Without a holdout, compare with the previous 14 days and call it weaker evidence.
6. **Limits** — frequency cap across all message types (for example at most one push per day in total), never upsell paid users on what they have, never send a discount to someone in a trial, never stack a new campaign on a cohort another campaign is running on.

Rank candidate campaigns by what needs no code first.

## launch

The owner switches it on. Record the launch date, the cohort size at launch and the readout date in the design file.

## review — after 14 days

Table: cohort size · sent · opened · target behaviour (treated) · target behaviour (holdout) · difference · sample size. Under about 100 per arm, call it a directional signal. A campaign that does not beat its holdout after two cycles is switched off, with the reason written into the design file.
