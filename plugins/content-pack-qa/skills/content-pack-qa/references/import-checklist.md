# Import checklist

One run, one checklist. Copy it into the batch report and tick it as you go.

## Before
- [ ] Every validator green on the final artifacts, output attached.
- [ ] Review findings at S1 and S2 closed.
- [ ] Assets generated, uploaded and resolving — before the import, not after.
- [ ] Target named: the host, database, bucket or pack the script writes to, read from its configuration, said out loud.
- [ ] What is live read back first: ids already imported, their versions, their publication state.
- [ ] Dry run: created, updated, unchanged and deleted counts per type; every update listed with before and after.
- [ ] No update or delete touches an item learners have already been served; if one does, stop and choose the correction path content-surface records.
- [ ] Collection- or course-level fields the import will overwrite are unchanged or intended (a package that omits a field may null it).
- [ ] Compatibility: every type, field and schema version in the batch is playable on every supported build, or a gate is in place; old-build behaviour stated (falls back, skips silently, opens empty).
- [ ] Order: the code that reads any new column or field is merged and deployed.
- [ ] The script is idempotent, or the plan says how a partial run is resumed.
- [ ] The owner said yes in this conversation, after seeing the target and the diff.

## During
- [ ] Draft first where the store has a draft state; publishing is a separate step and a separate yes.
- [ ] Watch the run's own output; stop on the first unexpected count.

## After
- [ ] Counts in the live store match the diff.
- [ ] A sample of items read back by id, assets resolving.
- [ ] Content met where a learner meets it: the served endpoint or a real build, and one older supported build when compatibility was in play.
- [ ] The "what is live" record synced, so the next batch cannot re-teach or regenerate these items.
- [ ] Batch report written; content-surface updated or "no durable change".
