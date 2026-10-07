# Adding a locale

Adding a language is rarely hard work; the risk is forgetting one place, and most of those places fail silently — the user falls back to another language or sees blank text, with no error. Turn this list into the project's own checklist (in stack-conventions) the first time it is used, and prefer a check that fails over a step someone has to remember.

## Decide first

- **Who reviews.** Name the native-speaker reviewer before any translation starts. No reviewer, no launch: machine-translated copy does not ship unreviewed.
- **Status.** If the project has a staged rollout for locales (registered, hidden, beta, live), add the new one hidden and let checks report its gaps as pending rather than failing; make them fail the day it becomes visible to users.
- **Scope.** UI strings only, or server-resolved content, notifications, emails and (in a learning product) the learner's-language scaffold as well. Say which surfaces stay in another language at launch and why.

## Client

- A new locale file with every key of the source locale, translated and reviewed.
- The locale registered wherever the stack lists supported languages (localization config, a language registry or picker, native platform locale declarations).
- **Fonts and scripts.** Does the bundled font cover the script? A missing script renders as empty boxes, and bundling a font is usually a native change that needs a store build and a minimum-version bump.
- Right-to-left scripts: layout mirroring, icons that must or must not flip, text alignment, mixed-direction strings.
- Line height and truncation for tall scripts; layout checked at the longest strings and a large text size.
- Dates, numbers, currency and units through locale-aware formatters. A numeric-only date pattern looks localized and is not.
- Plural and select rules for the language's plural categories (some have one form, some have six).
- Search and sorting: does search normalize this script (case, accents, segmentation for languages without spaces)? Is sorting locale-aware?
- The guard for hard-coded strings: if it only detects the source language's characters, widen it now — once copy is written in a second language first, it slips through.

## Server

- The locale in the server's supported list and its fallback chain.
- Every translation table or localized column has rows for the new locale, or a recorded fallback; a check counts them against the default locale.
- Caches of localized content include the locale in their key; eviction covers the new locale.
- Notification and email templates exist for it, and the stored user language can hold its code.
- Analytics carry the locale as a property so per-language problems are visible.

## Launch and after

- The store listing for the locale through aso-ops (separate from this skill).
- A screenshot pass of key screens in the new locale.
- After launch, compare per-locale signals (errors, completion, in a learning product correct-rate per exercise type): an outlier often means a translation broke meaning, not that users differ.
