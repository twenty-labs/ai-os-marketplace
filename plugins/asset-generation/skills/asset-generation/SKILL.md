---
name: asset-generation
description: Use when a product or its learning content needs images, illustrations, icons, or text-to-speech and voice audio made with AI generation tools — matching the established style anchor, checking what already exists, estimating cost and dry-running before any paid batch, generating a small slice first, choosing the quality setting and voice, keeping a provenance ledger, regenerating only what changed, reviewing every asset before it ships, and voice, likeness, licensing and child-safety rules. NOT for marketing or ad creatives (image, ad-creative), design tokens and UI specs (design-handoff), or validating the learning content itself (content-pack-qa).
---

# Asset generation

Generated assets are cheap to make once and expensive to make wrong: an off-style image breaks a screen's coherence, a regenerated clip changes a pronunciation learners already heard, and a batch run without an estimate spends money nobody approved. This skill is the method. The facts — the style anchor prompt and reference images, the quality setting, the voices and engines per language, the scripts with their dry-run and estimate commands, unit costs, where the ledgers live and where assets land — live in `.ai-os/knowledge/design-surface.md` (visual style, where app assets live) and `.ai-os/knowledge/content-surface.md` ("Audio and images" for learning content). Read them first. If they are unfilled, explore (the generation scripts, the asset directories, existing ledgers or manifests, the style references) and ask the owner what exploration cannot answer, then fill them before generating anything.

**Use the project's generation scripts; never call a generation API around them.** A one-off call skips the ledger, the reuse check and the style anchor.

**Every paid run needs the owner's explicit yes in this conversation**, given after the estimate is shown. An approved plan, a yes on an earlier batch or "the same as last time" is not consent. Never print an API key — name where it lives.

| The ask | Mode |
| --- | --- |
| "make an image / icon / illustration for X" | image |
| "voice this", "record audio for these lines" | audio |
| text changed, a voice or style changed | regenerate |
| "is this asset still valid?", "what did this cost?" | audit — read the ledger, report and stop |

## The run, in every mode

1. **Check what exists first.** Search the asset directories, the shared stores and the ledger for an asset that already covers the need. Reuse beats regeneration: it saves money and, for audio, keeps one pronunciation per word across the product. No duplicates.
2. **Anchor the style.** Copy the canonical style prompt from design-surface **verbatim** into the generation, with the reference image when the tool accepts one. Never paraphrase it, and never use a superseded style for new work. Prompts state what must not appear (text, logos, outlines) — then verify it, because prompt instructions are not reliable (see review).
3. **Estimate and dry-run.** Print what would be generated — count, prompts or lines, engine, voice, quality setting — and the estimated cost from the unit costs on record. The dry run writes nothing and spends nothing.
4. **Get the yes**, with the estimate in the same message.
5. **Small slice first.** Generate a handful, review them in full, then scale. A batch sized before anyone looked at its first results is not evidence the prompt works.
6. **Lowest acceptable quality.** Use the quality setting design-surface records; raise it only with the owner's agreement and record the decision there.
7. **One request per asset** unless the tool is known to return one distinct result per input: a "generate N" option usually returns N variations of the same prompt, not N different assets.
8. **Record provenance** for every asset as it is written, in the ledger the project keeps — fields in [provenance ledger](references/provenance-ledger.md). An asset enters the ledger only after it was written successfully, so a failure is retried next run.
9. **Review every asset before it ships** with the [review checklist](references/review-checklist.md). Drafts go to an untracked drafts location; only reviewed assets move into the repository.
10. **Land it where the stack needs it.** Assets live in the repository (or the store design-surface names) and are declared wherever the build requires (an asset manifest, a bundle list), never referenced from outside the project. Optimize them with the project's step (format, size).

## image

- Composite exact brand marks, logos and text in a deterministic post-processing step; generators approximate them.
- Fix what a prompt cannot control (cropping, transparency, size variants) in post-processing, recorded in the script, not by retrying until it happens to look right.

## audio

- **The engine follows the language and the length** as content-surface records: some engines vary in length and delivery on very short text, others suit long narration. Do not switch engines for an existing set without regenerating the set.
- One voice per role, recorded; a changed voice is a regeneration of everything that voice spoke, not a mix.
- In a language-learning product, the taught language is recorded once and shared; only the learner's-language scaffold has a version per learner language (localization). Without a reviewed text for a line, record nothing rather than invent it.
- Measure what the vendor bills (characters, tags, minimum charge per request) on a small trial before estimating a large batch.

## regenerate

The ledger decides, not the store. Regenerate exactly the assets whose recorded inputs (text, prompt, voice, engine, style version) no longer match — a file existing at the right path proves nothing when its key was reused for new text. When the store is already correct but the ledger is empty, record it without generating.

## Rights and safety

- **Voice and likeness:** never clone or imitate a real person's voice or face without their written consent on record; no celebrity or public-figure likeness, no living artist's name as a style prompt.
- **Licensing:** record each tool's commercial-use terms and any third-party asset's licence and credit in the ledger.
- **Children's products:** nothing frightening, violent or suggestive; no real-person likeness; never store or train on a child's recorded voice.

## Report

What was generated, reused and skipped, by kind; estimate versus actual cost; review outcome and rejects; where assets landed and what was declared; ledger updated. End by updating design-surface or content-surface — a style decision, a unit cost, a trap — or saying "no durable change".
