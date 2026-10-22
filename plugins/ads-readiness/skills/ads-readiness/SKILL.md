---
name: ads-readiness
description: "Check whether an app is ready for paid acquisition before the first campaign, a new market or more spend: measurement, revenue attribution, billing, legal, store page, first run, stability. Read-only; returns a verdict, blockers and next actions."
disable-model-invocation: true
---

# Ads readiness

One question: **if paid installs started today, would the app convert them and would we be able to see it?** The answer is a verdict, at most five blockers, and the next action for each. Everything is read-only: query platforms, never change them, never print a secret.

## Out of scope

Creatives, ad budget, ad-account balance and campaign settings are the owner's call and belong to `ads-review`; a full new-user journey walk with screenshots belongs to `conversion-audit`. Do not list them as blockers. Mention one only when it makes the measurement wrong (for example, an ad account shared between apps without a naming rule).

## Inputs

- **Target**: app, platform (iOS, Android, web), first market, first ad network. Ask once if missing; default to what the project's channel-registry or measurement-plan knowledge says.
- **Priors**: the prior-findings, measurement-plan, channel-registry, offer-catalog and store-review knowledge files if they exist, and the last ads readiness report (`docs/audits/` or the project's reviews folder). Beat earlier findings rather than rediscover them; a decision recorded with its reason is "deliberate", not a finding.

## Rules of evidence

- **Live beats docs.** A setup document says what someone intended. Read the platform: MMP events received, ad network app and optimization events, billing customers and events, store listing of the version that is live now, backend health. Write the date you read it.
- Every finding cites `file:line` or a live read (system, object, value, date). No evidence, no finding: put it under "Not verified" with the cheapest way to verify.
- Read production; never write it. A fix that touches a platform becomes a next action for the owner, with the exact click path or command.
- Count users, not events, and filter test accounts. Small numbers are labeled: "3 of 8, small N".

## The audit

Walk the eight areas in [the checklist](references/checklist.md), in order. Each area ends in pass, blocker, before-scale or not verified. The checklist holds the questions and the traps that have already cost money. In short:

1. **Measurement chain**: MMP SDK live in the store build, consent prompt order, SKAN or the platform's privacy postbacks, ad network linked to the MMP, events mapped one-to-one, optimization events able to unlock.
2. **Revenue attribution**: purchases reach the MMP with revenue. This needs the billing tool's integration plus the app handing it the MMP id, and the id cleared when consent is off.
3. **Billing truth**: cancellations, renewals and refunds reach the billing tool (store server notifications) and the backend (webhook delivers 2xx).
4. **Legal consistency**: the privacy policy, store privacy labels and consent copy describe the data flows that actually run, in every market language.
5. **Store page**: the version live in the target market shows the market's language and screenshots; ratings count; price is right.
6. **First run**: taps and system prompts before the first moment of value; no stacked permissions; denial has a way forward; no forced sign-up.
7. **Retention, virality, monetization**: a reason to return on day 1 to 2; invites survive install; the paywall is reachable by a new user, or the test is declared an activation test.
8. **Stability and operations**: crash-free rate of the live version, a backend outage cannot block a new user, the backend and app can ship a fix today.

Subagents are fine for the code walk of areas 6 to 8 (read-only, return claim · file:line · risk). Do the live reads yourself so the dates and values are first-hand.

## Verdict

| Verdict | When |
| --- | --- |
| **NOT READY** | any blocker in areas 1 to 5. Money would be spent blind, or sent to a page or flow that loses it. |
| **READY FOR TEST** | areas 1 to 5 pass; open items in 6 to 8 are known and the test can measure them. |
| **READY TO SCALE** | everything passes, revenue is attributed, and a first readout exists. |

A blocker is something that wastes spend or makes the result unreadable **in the first test**. Everything else goes under "Before scale". At most five blockers; if there are more, the top five by money lost and the rest under "Before scale".

## Output

Use [the report template](references/report-template.md). It is the whole chat reply: no preamble, no paragraphs, one line per finding, each with evidence and a next action naming who does it (owner, agent) and the command or click path. Save it as `docs/audits/<YYYY-MM-DD>-ads-readiness.md` (or in the project's reviews folder) only when the owner asks, or when the project keeps audits there.

After the report, ask at most three questions, each with the recommended answer, for the next actions that need the owner's yes (a platform change, a code change, an issue). Code fixes become issues in the code repository, opened only after the owner agrees.

## Quality bar

| Weak | Strong |
| --- | --- |
| "Attribution is set up" (from a doc) | "MMP, last 6 days: 8 installs, 0 non-organic; activation event 5 users" |
| "Consider improving onboarding" | "3 system prompts before the first value moment (`onboarding_screen.dart:120`). Move location after the third use." |
| Twelve findings, unranked | Five blockers in money order, the rest under "Before scale" |
| Creatives and budget listed as blockers | Kept out, per scope |
| Silent about what could not be read | "Not verified: crash-free rate. Sentry not connected; owner reads it in Releases." |
