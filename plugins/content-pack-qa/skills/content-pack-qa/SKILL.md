---
name: content-pack-qa
description: "Use when a batch of learning content — lessons, vocabulary, exercises, missions, placement tests, dialogue, audio or images — must be checked, fixed or shipped: deterministic validation, pedagogical and linguistic review, the fix loop, dry runs before paid synthesis or generation, and importing or backfilling into the live product with verification afterwards. NOT for deciding what to teach (product-owner), testing app behaviour (qa-engineer), or translating interface strings (localization)."
---

# Content pack QA

A content batch is ready when machines have checked everything a machine can check, a reviewer has read what only a reader can judge, the paid steps ran once and on purpose, and the import changed exactly what the diff said and nothing a learner was standing on. This skill is the method. The facts — the content schema and where it lives, the level system, the validator and import commands, the generation pipeline, the import target and host, which builds play which content types, the immutability rules, asset sources and their cost, the known traps — live in `.ai-os/knowledge/content-surface.md`. Read it first. If it is missing or unfilled, explore the content directories, validators, generators and import scripts, ask the owner for what exploration cannot answer (above all: which host an import writes to), and fill it before shipping anything.

**Call the project's validators and scripts; never reimplement one.** A check with no tooling is done by hand and reported as such. A check you cannot run is reported as **unverified**, never as passed.

## Route the ask

| The ask | Steps |
| --- | --- |
| "check this batch", "is it ready?" | 1 → 2 → 3 |
| "voice it", "make the images" | 1 → 4 |
| "import it", "ship this wave", "run the backfill" | 1 → 5 → 6 → 7 |
| "a learner says item X is wrong" | 2 on that item and its siblings, then 3, then 5 if it is live |
| "can we add this new item type?" | 5's compatibility gate only |

## 1. Deterministic validation — before anyone reads anything

Run every validator content-surface lists, in its order, and attach the output with counts. A red validator blocks the batch; there is no reviewer override. Then check that what the validators cover is what you think they cover: when a layer has never been seen to fail, inject one bad item and watch it go red. A gate that silently skips a field is worse than no gate.

The layers, deterministic first — [validation layers](references/validation-layers.md) has the full list:

1. **Shape** — schema conformance, required fields, enum values, natural-key uniqueness.
2. **References** — every id, asset path, audio key and cross-reference resolves; the prerequisite or vocabulary graph is acyclic and ordered.
3. **Level constraints** — every item sits within its level: an example uses only material taught by that point plus the allowed function words; length and difficulty limits hold; a level is an attribute of an item, not its identity.
4. **Duplicates** — within the batch, against sibling batches generated in the same wave, and against what is already live.
5. **Assets present** — every item that needs audio or an image has it, and the file exists where the player will look. In a listening item the audio is the question.
6. **Lookups, not opinions** — readings, romanizations, tone marks, stroke counts, character sets and dictionary glosses are checked against a reference, never against a model.

## 2. Pedagogical and linguistic review

Only after step 1 is green. A model reviewer is advisory: it produces findings, never a verdict that blocks or passes a batch on its own. A human fluent in the taught language signs off on the first batch of any new prompt, type or level. Review the items in [review rubric](references/review-rubric.md): accuracy, level fit, first-language interference, ambiguity (more than one right answer, distractors that are also right), naturalness and register, cultural fit and safety for the audience's age.

State the sample: which items were read in full, which were sampled and how, and what nobody read. "Reviewed" with no sample size is not a review.

## 3. Fix loop

Fix by severity, in the un-imported artifacts only — never in the live store. After every fix, re-run step 1 on the whole batch, not only the edited item: fixes break references. Cap the loop (three rounds is a sensible default); a batch still failing after the cap goes back to generation or to the owner with the residual findings, not into a fourth round of patching. Regenerate only what failed, never items whose ids are already live.

## 4. Paid steps — estimate, dry run, then yes

Speech synthesis, image generation and model batches cost money and often cannot be undone cheaply. Before any of them:

- **Dry run** the tool in its estimate or no-upload mode: how many items, how many can be reused from the provenance ledger, what the rest will cost, which voice, model or engine.
- **Show the estimate and wait for the owner's yes.** A budget set earlier covers that budget, not an open-ended run.
- **Run a small slice first** and listen to or look at it before the full run. One wrong voice across a thousand clips is a thousand clips.
- Never edit a provenance ledger by hand; it decides what is reused and what is re-recorded.
- Assets land **before** the import, so nothing goes live silent or blank.

## 5. Import discipline

Imports usually write to production — a learner-facing database, a content bucket, a served pack. Treat every import and backfill as a production write. [Import checklist](references/import-checklist.md) is the per-run list; the rules:

- **Name the target.** Read where the import script points and say the host, database or bucket out loud. "It uses `.env`" is not an answer.
- **Dry run and diff.** Created, updated and unchanged counts per type, and every update listed with before and after. An update to an item learners have already been served is a stop.
- **Never change content under a learner.** Taught content is immutable once imported: corrections go in as a new version, a new id, or whatever correction path content-surface records — never an overwrite of an id learners are answering. A regenerated live item under the same id is a silent swap: no error, no row-count change, nothing in a log.
- **Compatibility gate.** When the batch uses a type, field or schema version that older app builds cannot render, find out what an old build does with it — falls back, skips it silently, or opens an empty lesson — before importing. Silent skip and empty screen need a gate first: a schema-version check, a minimum-build gate, or holding the content back. Raising a minimum-build gate force-updates learners; that is the owner's call, separately.
- **Order.** Merge, then deploy, then import, whenever the import or the served code reads a new column or field.
- **The owner's explicit yes in this conversation**, given after seeing the target and the diff. Approved plans, green checks, a yes for an earlier run and silence are not consent. A yes covers that run, not follow-on backfills.
- **Idempotent.** A second run changes nothing. If the script is not, say so before running and do not re-run on failure without reading what the first run wrote.
- **Publish separately.** Import as draft where the store allows it; making content live is its own step and its own yes. Where there is no draft state, importing is publishing — assets and verification must be ready first.

## 6. Post-import verification

Read back from the live store what the import wrote: counts against the diff, a sample of items by id, their assets resolving. Then meet the content where a learner does — the served endpoint or a real build — including one older supported build when the batch touched the compatibility gate. Run any sync step that records what is now live, so the next batch cannot re-teach or regenerate it.

## 7. Records

The batch report goes to `docs/content/<YYYY-MM-DD>-<batch>.md`: validator output with counts, review sample and findings by severity, the fix log, paid-step estimate versus actual, the import target, diff and the yes it ran on, and the verification. Chat gets the verdict, counts and everything still pending. Findings that need code become issues through issue-workflow. Every engagement ends by updating content-surface (a new trap, validator, or player-support row) or saying "no durable change".
