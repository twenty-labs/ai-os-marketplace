---
name: db-migration
description: Use when a change needs a database schema migration or a data backfill — designing it (expand/contract), writing it re-runnable, reviewing one for locks and data loss, sequencing it with the code deploy, applying it, verifying it landed — or when a migration failed, the migration history is wedged or drifted, or someone asks where a migration stands. NOT for read-only data questions (product-analyst), seed or content data with its own pipeline, or deciding what the feature should be (product-owner).
---

# Database migration

A migration changes a database that running code, other developers and real users depend on, and most of its failures cannot be undone by reverting a commit. This skill is the method. The facts — which database each environment uses and whether developers share one, the migration tool and where files live, how and by whom migrations are applied, verify gates, guards, backfill scripts, recovery runbooks, production access rules and past incidents — live in `.ai-os/knowledge/data-surface.md`. Read it first. If it is missing or unfilled, explore (the migration directory, CI workflows, deploy and container config, package scripts, environment variable names — never their values) and ask the owner what exploration cannot answer, then fill it before writing any migration.

**Use the project's commands and guard scripts; never call the underlying tool around them.** A guard that is bypassed once has stopped guarding.

Three rules hold in every project:

- **Never point a tool that resets, pushes or uses a "shadow" database at anything but a throwaway local database.** Shadow databases are dropped and replayed by design; aimed at a shared or production database, a command that looks like a read-only diff is a schema drop. When data-surface says developers share one database, assume every non-local URL is production.
- **Every write to production needs the owner's explicit yes in this conversation** — applying a migration by hand, running a backfill, resolving history. An approved plan, green CI or a yes on an earlier change is not consent.
- **Never print a connection string or password.** Name where it lives.

| The ask | Mode |
| --- | --- |
| "add a column / table / index", a feature that needs schema | author |
| "review this migration", a migration in a diff | review |
| "apply it", "run the backfill" | apply |
| "deploy fails with a migration error", "history is out of sync" | recover |
| "is migration N applied?", "what is pending?" | status — read-only, report and stop |

## author

1. **Design expand/contract.** Split every change into an additive *expand* step that old and new code both tolerate, and a destructive *contract* step that ships later. Renaming a column is add, dual-write, backfill, switch reads, stop writing, drop — never one statement. **A destructive change never ships in the same deploy as the code that stops using it.** Patterns in [expand and contract](references/expand-contract.md).
2. **Generate from the schema, not from a live database.** Diff the previous committed schema against the edited one, or write the SQL by hand. Diffing against a live database emits drops for everything that drifted. Start from a freshly fetched default branch so the migration is sequenced after everyone else's.
3. **Make it re-runnable.** `IF NOT EXISTS` / `IF EXISTS` guards, a guarded block around type creation, `CREATE OR REPLACE` for functions. Keep only the statements for this change; trim anything the generator added that you did not intend, and say so in the header.
4. **Write the header**: why the change exists, why it is safe on a populated table (locks, rewrite, default), what reads and writes it, and its contract step if one is pending.
5. **Write the verify step** the project uses (a verify script, a status check, a schema-shape test): assert what the migration promises — the column and its type, the index and whether it is partial, the constraint's values, row-level security on — by reading the catalog, not by inserting probe rows that fail for the wrong reason.
6. **Backfills are not schema migrations.** Data movement goes in a separate script: idempotent, batched, resumable from where it stopped, with a dry run that prints counts. A long update inside a migration holds locks and can fail on timing, wedging every later deploy.
7. **One migration per pull request**, and never edit a migration that has been applied anywhere or merged — add a new one.
8. Regenerate any client or types the project derives from the schema (data-surface names the step and what it gets wrong), and run the build.
9. Review your own migration against the [review checklist](references/review-checklist.md) before opening the pull request.

## review

Run the [review checklist](references/review-checklist.md) on the diff. Each finding names the statement, the risk (lock, rewrite, data loss, deploy order, security), and the smallest fix. A clean migration gets one line saying so.

## apply

1. **Deploy order:** migrate (expand) → deploy the code that uses it → run the backfill → verify → later, in its own change, contract. Say the order in the pull request; when more than one repository moves, name which must be live first.
2. Apply through the path data-surface records (CI, container start, a human in an editor). When a human applies, give them the exact files in order and the verify step; do not apply production yourself unless data-surface allows it and the owner says yes.
3. Environment order: local or throwaway → shared development or staging → production. Never production first.
4. **Run the verify step after every apply** and report its output. "Applied" without verification is not done.

## recover

A failed or drifted history blocks every later deploy, including unrelated ones. Follow data-surface's runbook when it has one; otherwise [recovery](references/recovery.md). Diagnose before writing: what the history table says, what the schema actually contains, and why the migration failed. Never record a migration as applied unless you checked statement by statement that it landed; when the schema does not match what the history would claim, stop and propose a restore. Every recovery step against production needs a yes.

## Pull request

The pull request carries: the migration and its verify step; the header's safety argument; the deploy order; the backfill command, its dry-run output and its resume behaviour; the pending contract step as a linked issue (hand off to issue-workflow); and, when the apply is manual, the exact apply instructions per environment.

## Report

What was written or applied, per environment; verify output; anything pending (backfill, contract step, an environment not yet migrated). End by updating data-surface — a new incident, runbook, guard or convention — or saying "no durable change".
