# Evaluation protocol

## Corpora

- **Two sets with a written boundary:** a tuning set (thresholds, prompts and templates are chosen on it) and an evaluation set (reported, never fitted). Record which design choices were informed by looking at the evaluation set, even when no parameter was fitted to it; that is leakage too.
- **Representative of real users:** real voices across ages, accents and pitch ranges for speech; real inputs for text. Synthetic data (TTS voices, generated prompts) is useful for probes and smoke checks but can misrepresent exactly the hard cases; say so when it is the only set.
- **Labelled:** expected answer per item, plus metadata to slice by (speaker, class, difficulty, recording quality). Exclude noisy recordings by a recorded rule, not after seeing scores.
- **Consent and minors:** only data the project may use; children's recordings only under ai-surface's position, never committed when that position forbids storing them.
- Commit the corpus manifest and the raw provider responses so a report can be regenerated offline with one command, with no network, keys or spend.

## Metrics

| Metric | Meaning |
| --- | --- |
| Correct | the feature's verdict matches the label |
| False alarm | the feature flags a correct input as wrong (accuses the user) |
| Miss | the feature passes an incorrect input |
| Abstention | the feature declines to judge (undetermined) |
| Precision when it speaks | correct / (correct + false alarms) |
| Recall | errors caught / errors present |

Report per class and per speaker or source, not only overall; a scorer that is fine on average can be blind to one class or collapse on one voice. For a pass/fail gate, state the threshold and the share of a defined group that clears it.

## Rules

- Every number in a write-up is printed by the evaluation command; no hand-copied figures.
- State what the scorer cannot detect, with the measurement that shows it. "Not tuned enough" is a claim; show that a scan over thresholds still cannot reach the target before calling a gap structural.
- Compare against a baseline on the same corpus: the current system, the provider's raw score, or a trivial rule.
- A verdict shown to users needs the false-alarm rate first; silence (abstaining) is often cheaper than a wrong accusation.
