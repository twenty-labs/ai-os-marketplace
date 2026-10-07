# Localization review checklist

Check what applies to the diff; report only findings that apply, each with the file and line, the risk, and the smallest fix.

## Strings
- No user-facing literal in feature code: every displayed string comes from the generated accessor.
- No locale branching to pick a string (`locale == X ? "..." : "..."`), and no hand-rolled lookup helper or two-language string class beside the project's mechanism.
- Every new key is in every locale file, with the same placeholders; the parity check passed.
- Generated localization code was regenerated, not edited.
- Keys removed from one file were removed from all; renamed keys are not left behind under the old name.
- A guard's allowlist did not grow to let new copy through.

## Layers without UI context
- Services, errors and background work expose a code or enum, not display text.
- The mapping from code to key lives at the display site and covers every value (an unmapped code shows a generic message, never the raw code).
- Strings built outside the UI tree resolve the user's chosen locale, not the device default, when the project distinguishes them.

## Message format
- Plurals and selects use the message format, not concatenation or an appended suffix.
- Placeholders are named and typed; numbers and dates inside messages are formatted for the locale.
- No sentence is assembled from fragments whose order is fixed in code.

## Layout
- The screen was checked at the longest shipped language and a large text size; nothing truncates or overflows that matters.
- No fixed width that only fits the source language; buttons and chips grow or wrap.
- Scripts in shipped locales are covered by the bundled font.

## Server-resolved content
- New resolved fields sit beside the old per-language fields; nothing an older client reads was removed or renamed.
- Resolution goes through the one shared resolver, not a second fallback chain in a query.
- Every new cache of localized content includes the locale in its key.
- New routes that serve localized content accept the locale the way the others do (and a coverage test, if the project has one, lists them).

## Language-learning products
- Taught-language material was not translated or re-recorded per learner language.
- Scaffold text is keyed per learner language, separate from the taught item; the source learner language remains as a fallback on the item.
- No scaffold entry was filled with an unreviewed machine translation.

## Translations
- Machine-drafted translations are marked and have a named native reviewer before release.
- Store or marketing copy in the diff is routed to aso-ops or the copy owner, not reviewed here.
