---
name: aso-ops
description: Use when auditing, changing or reading the results of an App Store or Google Play listing — title, subtitle, keywords, descriptions, screenshots, preview video, listing experiments, ratings prompts. Keeps the live listing and a changelog in the repository. NOT for paid ads (ads-review) or in-app copy.
---

# Store listing operations

The store keeps the numbers (impressions, product page views, conversion to install); the repository keeps **the copy that is live and the reason for every change**. Never change a listing without a changelog line, and never change two things at once on the same store — the result would be unreadable.

This skill never signs in to a store console. It edits the repository's copy of the listing and the owner pastes the change into the console. When the project has an App Store Connect API key (recorded in the channel registry's Tooling section), it may **read** the listing through the API in read-only mode; writes still go through the owner, unless the project has set up a change-file flow like the one in ads-review — a committed file, a dry run, the owner's approval of that exact output for that file, apply, re-read and verify. If the project enabled the external `aso` skill, use it for the audit checklist; this skill runs the loop around it.

## Repository layout — `aso/`

| Path | What it is |
| --- | --- |
| `appstore/<locale>.md` | title, subtitle, keywords, promotional text, description — **as live** |
| `play/<locale>.md` | title, short description, full description — **as live** |
| `screenshots/README.md` | order, caption and reason for each screenshot; sources in the assets folder |
| `changelog.md` | date · store · field · before → after · reason · readout date |
| `experiments.md` | listing experiments: hypothesis, variable, start date, result |
| `audits/ASO_YYYY-MM-DD.md` | dated audits |

## Three modes

**audit** — If the live listing is not yet in the repository, capture it first: the repository must reflect what runs before anything is proposed. Some fields can be fetched from public pages; others (keywords, subtitle, promotional text, short description, screenshot captions) exist only in the console.

- **With an App Store Connect API key**, read the console-only fields through the API with a CLI in read-only mode, for example the App Store Connect CLI `asc` with `ASC_READ_ONLY=1` and a keyword audit command (`asc metadata keywords audit --app <app id> --version <live version>`). Record the command, the version read and the date in the audit, so it can be re-run. When the live fields differ from the repository, the live listing wins and the drift is a finding; if the app's release tooling pushes listing metadata from the code repository, the next release will overwrite a console edit, so say which copy is the source. Keyword audits split words on spaces: in languages written without them (Thai, Japanese, Chinese) check duplicates against the title and subtitle by eye.
- **Without a key**, ask the owner to copy those fields and record which fields were hand-copied and when. Public sources return only part of a listing — never report a capture as complete when it is not:

| Source | Returns | Does not return |
| --- | --- | --- |
| App Store lookup API (`itunes.apple.com/lookup?id=<app id>&country=<cc>`) | title, description, version, rating count, screenshot count, age rating | subtitle, keywords, promotional text, screenshot captions — console only |
| Google Play listing page (static HTML) | title, full description | short description, rating, download count — rendered by script |

An empty changelog means "never audited", not "nothing to do". **Mandatory step: put the same field from both stores side by side** — a language or positioning mismatch between stores is a finding that per-store review never sees. A read-only audit is answered in chat; write the file when the owner wants to keep it.

**change** — one field at a time. Edit the live file, add the changelog line with its reason and a readout date at least 14 days out, and hand the new text to the owner to paste (or, where the change-file flow is set up, write the change file and wait for approval of its dry run). Field rules: [field rules](references/field-rules.md).

**review** — on the readout date, compare conversion to install for the 14 days before and after, split by source (search, browse, referrals). Record the result on the changelog line. A difference under about one percentage point on a few hundred page views is noise — write "not yet readable", not "no effect".

## Experiments

Use the stores' native experiments (Play store listing experiments; App Store product page optimization) — one variable per experiment, logged in `experiments.md`. Custom product pages can be matched to ad keywords or audiences; coordinate with ads-review.

## Ratings

Ask for a rating in the product **after a moment of achievement**, never after an error, at most once per platform-recommended interval. If the product has no prompt, open an issue in the code repository — ratings volume is a ranking factor and social proof.

## Not this skill

Paid ads (ads-review), landing pages (conversion-audit), in-app copy (designer).
