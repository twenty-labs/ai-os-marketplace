---
name: security-review
description: "Use when a diff, branch or area needs a security review — authentication and authorization on every route, token issuance and refresh, purchases and entitlements (server-side receipts, webhook signatures and idempotency, promo, offer, gift and referral replay), file upload, injection, secrets in code, config or logs, personal data and minors' data, row-level security and storage policies, rate limits and cost abuse of paid upstream APIs, admin endpoints. Read-only: findings with file and line, severity and a concrete exploit or failure scenario. NOT for fixing what it finds (the engineer who owns the code), running attacks or scanners against production, general correctness review (code-reviewer), or a migration's lock and data-loss review (db-migration)."
---

# Security review

A security finding is worth reporting when someone can do something they should not — read another user's data, get paid features for free, spend the project's money, take over an account — or when data leaks where it must not go. This skill is the method. The project's facts — which modules are sensitive, the threat notes per area, which data belongs to minors, where secrets live (by name), what has already gone wrong and the positions already decided — live in `.ai-os/knowledge/risk-surface.md`. Read it first. If it is missing or unfilled, explore (route definitions, auth middleware, payment and webhook handlers, upload handlers, policies, logging and error-reporting config, environment variable names — never their values) and ask the owner what exploration cannot answer; propose the filled slot with the report.

Three rules hold in every project:

- **Read-only.** Report; never edit the code under review, never push a fix, never "just tighten" a policy. The owner of the code fixes it.
- **Never attack production.** No exploit attempts, fuzzing, scanners, forged webhooks or load against a live environment. Prove a finding by reading code, config and policies, or with a local or throwaway environment. A production read (a policy listing, an advisor run, a log query) needs the owner's yes in this conversation.
- **Never print a secret.** A leaked key is reported by file, line and variable name, with its value redacted — and flagged for rotation, because once committed it is already out.

| The ask | Mode |
| --- | --- |
| "review this PR / branch / diff for security" | diff |
| "audit auth / payments / uploads", an area with no diff | area |
| "is X exploitable?", one suspicion to confirm or clear | question — answer and stop |

## diff

1. **Map the diff onto risk-surface's areas.** Every touched file that sits in a sensitive area gets that area's full checklist; a diff that touches none still gets the cross-cutting checks (secrets, logging, input reaching a query, a shell or a path).
2. **Read past the keyhole.** A diff shows the handler, not the middleware that guards it, the policy behind the table, or the client that calls it. Read the route registration, the guard, the policy and the caller before judging.
3. **Run the [checklist](references/checklist.md)** for each area in play. Check what applies; report only what applies.
4. **Build the scenario.** Every finding names who the attacker is (anonymous, any signed-in user, a paying user, an admin, a leaked client key), the steps, and what they get. No scenario, no finding — say it as a question instead.
5. **Check decided positions.** Something risk-surface records as intentional is not a finding unless the change breaks the reasoning behind it; then say what changed.

## area

Same checklist, applied to a whole area instead of a diff: enumerate its entry points first (every route, webhook, function, bucket and admin action), then check each. State the entry points you covered and the ones you did not, so "nothing found" has a boundary.

## What to look for first

- **Identity comes from the verified token, never the body, query or path.** A user id, tier, role or price the client sends is a claim, not a fact. Ownership of every resource id in the path is checked against that identity.
- **Money is decided on the server.** Entitlement comes from a server-verified receipt or the store's server notifications, never from a client flag or a closed purchase sheet. Webhooks verify the signature, are idempotent on the provider's event id, and tolerate out-of-order delivery. Promo, offer, gift and referral redemptions are single-use, atomic and cannot target another account.
- **Every paid upstream call is behind identity and a cap.** A route or token endpoint that spends money per call (a model, speech, TTS, realtime voice) checks quota before spending, caps per user and globally, and does not mint long-lived or broadly scoped provider tokens. A cap per user is bypassed by a second account — say whether a global cap exists.
- **Minors' data.** Where risk-surface marks data as belonging to children, collection, storage, analytics and third-party transfer are checked against the stated position (for example: no stored audio, no identifiers in analytics). A breach here is a blocker regardless of exploitability.
- **Logs and error reports.** Request bodies, transcripts, tokens and personal data stay out of logs, analytics and error reports; a change that loosens a scrubber is a blocker.

## Severity

[Severity rubric and output format](references/severity-and-format.md). Blocker: exploitable now by a realistic attacker, or a breach of minors' data or a decided position. High: exploitable with a precondition. Medium: defence in depth missing where the next change would make it exploitable. Low: hardening. State confidence separately from severity; "confirmed by reading X" and "suspected, check Y" are different findings.

## Report

Findings first, most severe first, each with file and line, the scenario, and the direction of a fix in a sentence (not a patch). Then the areas reviewed and cleared — silence must be distinguishable from not looking. Then what was out of reach (a policy only visible in production, a provider console setting). End with proposed additions to risk-surface — a new sensitive module, a decided position, an incident — or "no durable change". Out-of-scope findings worth tracking go to the owner as a list; issue-workflow files them after a yes.
