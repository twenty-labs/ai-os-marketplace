# Expand and contract

Every step below must be safe with both the previous and the next version of the code running, because during a deploy both are. The contract step ships in a later change, after the code that stopped using the old shape is live everywhere — including old mobile builds still calling an old API.

| Change | Expand (now) | Contract (later, its own change) |
| --- | --- | --- |
| Add a column | Nullable, or with a constant default the database can add without rewriting the table | Add `NOT NULL` once a backfill has filled every row and all writers set it |
| Rename a column or table | Add the new one; write both; backfill; switch reads | Stop writing the old one; drop it |
| Change a type | Add a new column of the new type; dual-write; backfill; switch reads | Drop the old column |
| Drop a column or table | Stop reading and writing it in code; ship that | Drop it, after a backup when the data has any value |
| Add a constraint | Add it unvalidated where the database allows, or check existing rows first | Validate it |
| Add a value to an enumerated type | Add the value; ship readers that tolerate it before writers that emit it | — |
| Remove a value from an enumerated type | Stop writing it; migrate rows off it | Recreate the type or the check without it |
| Split or merge tables | New table plus dual-write; backfill | Remove the old path |

## Readers that meet values they do not know

Clients that filter unknown values silently and clients that crash on them behave in opposite ways. Before a writer emits a new value, check what every reader — including shipped app builds — does with it.

## Backfill scripts

- Idempotent: running twice changes nothing the second time.
- Batched by key range, with a small batch size and a pause, so it never holds a long lock or saturates the database.
- Resumable: it records or derives where it stopped and continues from there.
- A dry run prints how many rows would change and a sample, and changes nothing.
- It never guesses: a row it cannot classify is skipped and reported, not forced.
- It reports counts at the end: changed, skipped, failed.
