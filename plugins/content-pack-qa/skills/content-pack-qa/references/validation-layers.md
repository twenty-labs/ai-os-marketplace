# Validation layers

Every check here is deterministic: identical input gives an identical verdict, and no model is involved. Locate each check in the project's validators through the content-surface knowledge file; where none exists, run it by hand, report it as manual, and propose a validator through issue-workflow.

## Shape
- The batch parses and matches the content schema, from the schema's single source of truth — never a second copy declared in the generator.
- Required fields present and non-empty; enums hold known values; numbers within their ranges (duration, score, difficulty, level).
- Natural keys unique: no two items share an identity (a headword, a stable item id, a level-plus-topic-plus-part key).
- Every first-language field that must exist for each shipped learner language exists — and the gate really reads it (inject an empty one to prove it).

## References and graph integrity
- Every id an item references exists: words, lessons, assets, audio keys, rubrics, first-language keys, prerequisites.
- The prerequisite or unlock graph is acyclic, and every item is reachable from a start node.
- Ordering is contiguous where the player assumes it (part and lesson numbers with no gaps).
- Content and its served copy agree: when the backend or a pack manifest serves a second copy of the content, the sync step ran and the copies match.

## Level constraints
- Every item's level is one the level system defines and the course supports.
- Example sentences, passages and distractors use only material taught by that point on the path, plus an explicit allow-list of function words. "Taught" binds to a position on the path; "seen again" does not.
- Length limits per level and per item type (words per sentence, items per lesson, the size a session draws from).
- Pools are large enough to draw from: a pool the size of one session makes personalisation an identity function.
- Speaking items stay within what the scorer can actually judge (for example, short phrases where long-sentence recognition is weak; no verdict the scorer is known to get wrong).

## Duplicates
- Within the batch: same prompt, same answer set, or same asset signature.
- Across sibling batches of the same wave, which were generated independently and do not see each other.
- Against live content: an item that re-teaches something already taught, or reuses a live id.
- Asset-driven items are keyed on prompt plus asset content, not on prompt alone, where boilerplate instructions repeat by design.

## Assets present
- Every item whose type needs audio or an image has a reference, and the file exists at the path or bucket the player reads.
- Assets bundled with the app are declared wherever the build requires (an asset manifest); assets served remotely resolve from the live host.
- Audio duration is non-zero and the clip is the item's text, in the right voice and language.
- Provenance recorded for every generated asset (engine, voice or model, input text), so reuse decisions are mechanical.
- Licences recorded for third-party assets.

## Lookups, not opinions
- Readings, romanizations, tone marks and diacritics against a dictionary or transliteration library.
- Character set and script (for example simplified versus traditional) against a reference.
- Stroke counts, radicals, part of speech where a reference exists.
- Wordlist membership and level against the official list for the level system.
A model may draft these; only the lookup decides them.
