# Migration review checklist

Check what applies; report only applicable findings. Statements and lock behaviour below are described for PostgreSQL; translate them for another engine and say you did.

## Data loss and reversibility
- No `DROP`, destructive `ALTER ... TYPE`, or `TRUNCATE` in the same change as the code that stops using the object.
- Nothing the generator added that the author did not intend (drops of drifted objects, constraint rewrites, timestamp type changes).
- A migration that has been applied anywhere or merged is not edited; a fix is a new migration.
- A destructive step names its backup or point-in-time restore posture.

## Re-runnability
- Every create and drop is guarded (`IF NOT EXISTS`, `IF EXISTS`, a guarded block around type creation, `CREATE OR REPLACE`).
- Running the file twice against an already migrated database succeeds and changes nothing.
- The migration does not depend on data that differs per environment, and does not fail on a timing condition (rows created while it runs).

## Locks and long-running operations
- Adding a column with a volatile default, or changing a column's type, rewrites the table: flag it on any large table.
- Adding `NOT NULL` to an existing column scans the table under a strong lock; on a large table, add a validated check first or do it after a backfill.
- Indexes on populated tables are built concurrently where the engine supports it. A concurrent build cannot run inside a transaction: check how the tool wraps migrations, and that a failed concurrent build leaves an invalid index that must be dropped before retrying.
- Foreign keys and check constraints on large tables are added unvalidated, then validated separately.
- No large data update inside the schema migration; it belongs in a backfill.
- A lock timeout or statement timeout is set when the project's convention calls for one.

## Types and values
- Adding a value to a native enumerated type: check whether the engine version allows it inside a transaction, and that readers tolerate the value before writers emit it.
- When the project prefers lookup tables or check constraints over native enums, the migration follows that.
- Timestamps use the project's timezone convention; an existing timezone-aware column is never narrowed.

## Security
- Row-level security is enabled on every new table that a client-facing key can reach, with policies for each operation that key needs — and, when only the server touches the table, enabled with no policy.
- Functions that bypass row-level security do so only when they must, with a fixed search path.
- Grants are no wider than the existing pattern.
- No secret, real user data or personal data in the migration or its comments.

## Fit with the code
- The application code works against both the old and the new schema during the deploy.
- Generated clients or types are regenerated, and known mis-inferences of the generator are corrected (for example a partial unique index read as a plain unique).
- Indexes match actual read patterns; none are added speculatively.
- Old app builds still in users' hands keep working.

## Verification
- A verify step asserts each promise of the migration from the catalog.
- The pull request states the deploy order and the apply instructions.
