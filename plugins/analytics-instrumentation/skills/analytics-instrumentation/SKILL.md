---
name: analytics-instrumentation
description: Use when feature work must emit product analytics — registering events and properties before code sends them, naming them, choosing client or server emission, person versus event properties, keeping personal data and minors out, adding a funnel step, coverage tests that fail on unregistered or unemitted events, renaming or retiring an event, or checking after release that a shipped event actually arrives. NOT for answering metric questions, readouts or metric specs (product-analyst), marketing attribution setup, or choosing an analytics vendor.
---

# Analytics instrumentation

Wiring events is feature work: the product analyst specifies what to measure and reads the numbers; this skill makes the code emit them so those numbers can exist. An event that is not registered cannot be found, one with free text in it is a privacy incident, and one renamed silently breaks every chart that crossed the release.

Read `.ai-os/knowledge/metrics-catalog.md` (the metrics these events feed) and `.ai-os/knowledge/measurement-plan.md` (the funnel steps and their events) first. Then find the project's own instrumentation facts: **the event register** (the file or table that lists every event), the analytics wrapper code calls, the coverage tests, the consent and age rules, and the property allowlists. If the knowledge files do not record where these live, find them in the repository, ask the owner what you cannot find, and add a short "Instrumentation" section to metrics-catalog naming each one. If the project has no register yet, propose creating one before the first event ships.

| The ask | Mode |
| --- | --- |
| "instrument this feature", a user-facing change without events | instrument |
| "add a funnel step", a new screen inside an existing flow | funnel |
| "rename / change / remove event X" | change |
| "is event X arriving?", after a release | verify |

## instrument

1. **Register before you emit.** Add a row to the event register — name, source (client or server), every property with its allowed values or unit, the feature or issue, and the funnel step it serves — then add it to the typed event list the wrapper reads. Code never sends a name the register does not hold.
2. **Name it `object_action`**: snake_case, past tense — `lesson_completed`, `paywall_viewed`, `search_performed`. Check the register's retired names; a retired name is never reused for a new meaning.
3. **What to emit per feature**: a view when a key screen opens, the meaningful interactions, the completion or outcome, and failures a user can see. Not every tap.
4. **Properties carry identifiers, counts and closed sets** — content ids, a 0-based rank, a length, a code from a fixed list — never free text a user typed or spoke, names, emails, or raw queries (`query_length`, not the query). snake_case keys. A property with no value is absent, not an empty string.
5. **Personal data and minors.** Follow the project's consent and age rules: no event for a user who has not consented or is below the tracking age, and gates that emit nothing themselves. When the project sanitizes properties through allowlists, add the new key to every one of them — independent layers do not update each other. Before adding any property, ask whether its value could ever contain text a user (or a child, or a parent) entered; if it could, do not add it. Details in [privacy rules](references/privacy-rules.md).
6. **Client or server.** Interactions are emitted by the client. Facts the server owns — money, subscription state, scores, anything a client could spoof or miss because it was not running — are emitted by the server, once. Webhooks are delivered more than once: guard server emission on a stable event id, because the analytics call is not idempotent even when the database write is. An event emitted from both sides is marked in the register.
7. **Person or event property.** A stable attribute of the user (language, plan, acquisition source) is a person property, set where its source of truth is written — overwrite for current state, set-once for cohort labels (a cohort that can be overwritten is not a cohort). Do not copy it onto every event.
8. **Call the project's wrapper, never the vendor SDK.** The wrapper owns initialization, identity, consent, scrubbing and typed names.
9. **Tests.** Coverage tests must fail when an emitted event is unregistered, when a registered event has no emitter, and, where the project has one, when a routed screen emits nothing — a genuinely dead entry goes into the test's retired or exempt list with a reason. Assert on the event and its properties with the project's fake analytics in feature tests. If the project has no coverage test, propose one rather than skipping the rule.

## funnel

Funnels are defined in the register: each step points at exactly one registered event, and steps not yet measurable are listed as such. A new screen placed inside a funnel without an event is a merge blocker, not follow-up work.

## change

**Never rename an event silently.** A rename or a change of meaning is a new event: register it, retire the old row with the reason and the release or date where it stopped (the checkpoint every time-series comparison must cross), and keep the old name reserved. Same for a property whose meaning or unit changes. Tell the product analyst which charts cross the checkpoint.

## verify

After the change ships, check the live analytics tool for each new event: it arrives, from the expected source, with the registered properties and no extras, for distinct real users with internal and test users filtered the way committed dashboards filter them. A zero means never happened, not wired, or broken — say which. Report what you saw with the query and window; a mismatch goes back as a defect.

## Pull request and report

The pull request lists events and properties added, changed or retired, the register diff, funnel steps touched, client or server for each, and the coverage test result. Report the same, plus anything still unverified in the live tool, and update metrics-catalog or measurement-plan when a definition or funnel moved — or say "no durable change".
