---
name: aso-ops
description: Use when auditing, changing or reading the results of an App Store or Google Play listing — title, subtitle, keywords, descriptions, screenshots, preview video, listing experiments, ratings prompts. Keeps the live listing and a changelog in the repository. NOT for paid ads (ads-review) or in-app copy.
---

# Store listing operations

The store keeps the numbers (impressions, product page views, conversion to install); the repository keeps **the copy that is live and the reason for every change**. Never change a listing without a changelog line, and never change two things at once on the same store — the result would be unreadable.

This skill has no access to store consoles and never signs in. It edits the repository's copy of the listing and the owner pastes the change into the console. If the project enabled the external `aso` skill, use it for the audit checklist; this skill runs the loop around it.

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

**audit** — If the live listing is not yet in the repository, capture it first: the repository must reflect what runs before anything is proposed. Some fields can be fetched from public pages; others (keywords, subtitle, promotional text, short description, screenshot captions) exist only in the console — ask the owner to copy them and record which fields were hand-copied and when. An empty changelog means "never audited", not "nothing to do". **Mandatory step: put the same field from both stores side by side** — a language or positioning mismatch between stores is a finding that per-store review never sees. A read-only audit is answered in chat; write the file when the owner wants to keep it.

**change** — one field at a time. Edit the live file, add the changelog line with its reason and a readout date at least 14 days out, and hand the new text to the owner to paste. Field rules: [field rules](references/field-rules.md).

**review** — on the readout date, compare conversion to install for the 14 days before and after, split by source (search, browse, referrals). Record the result on the changelog line. A difference under about one percentage point on a few hundred page views is noise — write "not yet readable", not "no effect".

## Experiments

Use the stores' native experiments (Play store listing experiments; App Store product page optimization) — one variable per experiment, logged in `experiments.md`. Custom product pages can be matched to ad keywords or audiences; coordinate with ads-review.

## Ratings

Ask for a rating in the product **after a moment of achievement**, never after an error, at most once per platform-recommended interval. If the product has no prompt, open an issue in the code repository — ratings volume is a ranking factor and social proof.

## Not this skill

Paid ads (ads-review), landing pages (conversion-audit), in-app copy (designer).
