---
name: localization
description: Use when user-facing text must work in more than one language — adding or changing copy in the localization files, keeping every locale in key parity and the generated code regenerated, translating codes from layers with no UI context at the point of display, plurals and interpolation, text expansion and scripts that need fonts, server-resolved localized fields, adding a new locale, auditing for hard-coded strings, or, in a language-learning product, separating the taught language from the learner's-language scaffold. NOT for store listings or marketing copy (aso-ops, copywriting), choosing the wording itself (designer), or authoring learning content (content-pack-qa).
---

# Localization

A string that exists in one locale file and not the others ships blank, falls back to the wrong language, or crashes a build — and usually nothing logs it. This skill is the method. The facts — shipped locales and the source locale, where the string files live and their parity rule, the regenerate command, how layers without UI context hand a code to the display layer, and any guard that fails on a hard-coded string — live in the "Localization files" section of `.ai-os/knowledge/stack-conventions.md`. Read it first. If it is missing or unfilled, explore (the locale directories, the localization config, the generated output, a check script, the locale switcher) and ask the owner what exploration cannot answer, then fill it before changing copy. In a language-learning product, also read `content-surface.md` for the taught language and the learner languages.

**Use the project's regenerate command and parity check; never hand-edit generated localization code.** A generated file that was edited is overwritten on the next run, and the fix disappears with it.

| The ask | Mode |
| --- | --- |
| "add / change this text", a feature with new copy | copy |
| "add a language", "support locale X" | new locale — [adding a locale](references/adding-a-locale.md) |
| "review this diff for localization", "find hard-coded strings" | review — [review checklist](references/review-checklist.md) |
| content served by the backend must follow the user's language | server-resolved |
| a new learner language in a product that teaches a language | scaffold |

## Rules that hold in every project

1. **One source locale.** It is the source of truth for which keys exist; every other locale file has exactly its keys. Copy is written there first.
2. **Parity is enforced by a check, not by memory.** Every key added, renamed or removed lands in every locale file in the same change, and a check fails the build when the files disagree. If the project has no such check, propose one rather than skipping the rule.
3. **Regenerate** the generated localization code after every key change and commit what the project commits.
4. **No locale branching in logic.** `if locale == X then "..." else "..."` is the anti-pattern this skill exists to prevent: add a key instead. Logic that branches on locale for formatting goes through the platform's locale-aware formatters.
5. **Translate at the point of display.** Services, errors, controllers and background jobs have no UI context: they expose a code or an enum, and the display layer maps it to a key. When a string must be built outside the UI tree (a notification, a widget extension), resolve the user's chosen locale the way stack-conventions records and read from the same files.
6. **Plurals and interpolation use the message format** the stack supports (ICU-style plural and select rules, named placeholders). Never concatenate fragments, never append an "s", never assume word order — other languages reorder and have more than two plural forms.
7. **The longest shipped language is the layout gate.** Check every new screen in the language with the longest strings and in a large text size; text may grow 30 to 50 percent over the source. A script the bundled font does not cover renders as empty boxes: adding glyph coverage is usually a native change that needs a store build.
8. **Never ship machine-translated copy without a native-speaker review step.** A machine draft is fine as a starting point; the review is recorded in the pull request. Until reviewed, the key falls back to the source locale rather than shipping a guess.
9. **Store and marketing copy are not localization files.** Listings go through aso-ops; tone and claims follow brand-voice.

## copy

1. Add the key to the source locale with a description for translators (where the format supports it): where it appears, the placeholders and their types, any length limit.
2. Add the key to every other locale file — translated and reviewed, or marked for translation by the project's convention. Never leave a locale missing a key to "fix later".
3. Regenerate, read the copy from the generated accessor at the call site, and run the parity check and any hard-coded-string guard.
4. A guard that fires on new copy is fixed with a key, not by widening its allowlist.

## server-resolved

When the server holds localized content (titles, descriptions, notification copy):

- **Resolved fields are additive.** Add a resolved field beside the per-language fields an older client reads; never rename or remove the old ones in the same change, so builds already in users' hands keep working.
- **One fallback chain, in one place.** Resolution (requested locale, then default, then source) lives in one function; a second copy in a query or a client drifts on the first day.
- The client sends the user's *chosen* language on every request, read per request rather than captured once, and refetches locale-scoped data when the language changes.
- **Every cache of localized content carries the locale in its key**, and its eviction can name every locale.
- Copy composed with no request to carry a language (push notifications, emails) reads the language stored on the user's profile — keep the two channels in sync.

## scaffold — language-learning products

**The taught language is never translated.** Only the learner's-language scaffold — instructions, glosses, hints, explanations and the UI — is localized.

- Keep the two apart in data: taught material and its audio are shared across learner languages; the scaffold is keyed separately per learner language, so adding a language is new files, never an edit to every lesson.
- The source learner language stays on the item as the fallback, so an older build meeting new content reads what it always read.
- Without a reviewed translation for a scaffold entry, record and ship nothing for it; never invent one to fill a gap.
- A distractor or hint that survives translation can stop being plausible in the new learner language; watch per-language correctness after launch.

## Report

Keys added, changed or removed and their locales; regenerate, parity check and guard output; translations still awaiting native review; anything that needs a store build (fonts, native locale declarations). End by updating stack-conventions — a new check, guard or trap — or saying "no durable change".
