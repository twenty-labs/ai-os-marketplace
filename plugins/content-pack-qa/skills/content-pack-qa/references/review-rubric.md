# Review rubric

The judgement layer, run only on a batch that passed every validation layer. A model reviewer emits findings; it never edits content and never passes or blocks a batch by itself. A human fluent in the taught language signs off on the first batch of any new prompt, item type or level, and on any S1 finding.

## Per item

- **Accuracy** — the target-language text is correct; the translation or gloss means what the item teaches; the answer key is right; explanations (grammar, pronunciation, mouth position) are true.
- **Level fit** — vocabulary, grammar and sentence length match the level; nothing assumes a skill the learner has not met (reading a script they have not learned, a tense not yet taught).
- **First-language interference** — false friends, calques and patterns from the learner's first language that would make a wrong answer look right or a right answer look wrong; places where a first-language cognate helps and the item could lean on it.
- **Ambiguity** — exactly one right answer; distractors truly wrong, not merely less common; a listening item answerable from the audio alone; a prompt that does not give its answer away.
- **Naturalness and register** — something a native speaker would say in that situation; no literary, archaic, news or classical register in a beginner item; consistent formality.
- **Cultural fit and safety** — appropriate for the audience's age and culture; no stereotypes; names, places and situations that the audience recognises; nothing that turns on a sensitive topic by accident.
- **Audio and image** — the clip says the text, clearly, in the intended voice; the image shows what the item claims and nothing that contradicts it.

## Severity

- **S1** — teaches something wrong or marks a right answer wrong; unsafe or offensive for the audience.
- **S2** — above level, ambiguous, or unnatural enough that a learner copies a mistake.
- **S3** — awkward but correct; weak distractor; minor register drift.
- **S4** — style and consistency.

S1 and S2 block the batch; S3 and S4 are logged and fixed in the loop when cheap.

## Sampling

Read in full: the first batch of any new prompt, type or level; every item with an S1 or S2 finding and its siblings; anything a learner reported. Otherwise sample by stratum — every level, every item type, every generator — and state the sample size and what was not read.
