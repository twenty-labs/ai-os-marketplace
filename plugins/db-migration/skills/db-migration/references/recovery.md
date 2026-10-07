# Recovering a migration history

Use data-surface's runbook when it has one. This is the general method for a migrator that keeps a history table (most ORM migrators and plain-SQL runners do). Every step against production needs the owner's yes; run diagnostics first, and print what you will change before changing it.

## Diagnose before touching anything

1. **What the history says** — the migrator's status command: applied, pending, failed, and migrations recorded in the database with no file in the repository.
2. **What the schema is** — compare the live schema with the committed schema (model and table counts, the newest migration's objects, spot-checked columns and indexes). Read-only.
3. **Why it failed** — the migration's own error, from the deploy log or the history table's log column. A data error, a lock or timing failure, and a logic error each need a different fix.

## Failure modes

**A migration is marked failed and every later deploy refuses to run.**
If the migrator wraps each migration in a transaction and this migration did not open its own or use a statement that cannot run in one, nothing partial landed. Mark it rolled back (it did not apply — that is the truth), fix the cause in a new commit, redeploy. Redeploying an unchanged migration fails again. Mark it applied only after checking statement by statement that its effects are present.

**History is missing on a populated schema** (the migrator refuses because the schema is not empty).
Baseline: mark each migration applied without running it — correct only when the schema already matches what the files would build. If it does not match, stop: baselining would record a lie. Restore from backup instead.

**History and files disagree** (migrations in the database with no file, or files whose effect differs from the live table).
Never generate a migration by diffing against the live database while this is true; it will emit drops. Diff schema to schema. Decide which side is right before changing anything: sometimes the model should be corrected to describe the table that exists, with no SQL at all. Reconciling drift is its own change, never folded into a feature.

**A concurrent index build failed.**
It leaves an invalid index. Drop it, then rebuild.

**The migration ran on the wrong database.**
Stop all further commands against it. Report exactly what ran and when, and hand the owner the point-in-time restore option before anything else.

## Afterwards

Status is clean and a deploy reports nothing pending. Record the incident in data-surface (date, what ran, what was lost or blocked, the recovery, the guard added) and propose a guard — a wrapper that refuses the command, with a test — when the cause was a command a person or agent could run again.
