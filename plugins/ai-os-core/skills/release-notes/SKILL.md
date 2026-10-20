---
name: release-notes
description: Use when drafting release notes and store copy (What's New) for a release from the changelog fragments of the pull requests merged since the last tag, in the project's notes language. The cut itself is release-cut. NOT for the changelog of a library, or for deciding what goes into a release.
---

# Release notes

Release notes say what changed for the people who use the product, in their language. The source is the changelog fragments (`.changes/<id>.md`, one user-facing line each), not commit subjects.

## 1. Read the inventory

Run `ai-os release status`. It lists merged work since the last release tag in three groups: user-facing (fragments of type feature or bug), internal (chore, spike, decision) and unfragmented (no fragment).

- **Unfragmented work is not shipped silently.** For each item, read its pull request and write a fragment with `ai-os change add --type <type> --text "<one line>"`, or confirm with the owner that it is internal. Fragments are read from the release anchor repository: in a multi-repo workspace run `ai-os change add` inside the anchor (`cd <anchor>`) and commit it there. Then run status again.
- A fragment line that is jargon, names a file or a function, or describes the implementation instead of the benefit is rewritten before it reaches the notes.

## 2. Draft

Run `ai-os release notes --version <version>`. It prints the notes and the store copy; `--out <dir>` writes `notes.md` and `store-copy.txt` as drafts. Nothing is cut, tagged or uploaded.

The notes language is `release.notesLanguage` in `ai-os.yaml` (default English). The command carries the fragment lines verbatim and sets the headings in that language. **You rewrite every line into that language**: natural, benefit-led, one sentence, no commit hashes, no ticket numbers. Registry and repository content stays English; only the notes and the store copy follow the notes language.

## 3. Check the store copy

- What's New: user-facing lines only, at most 4000 characters, most important first.
- Promotional text (App Store): one sentence leading with this release's headline, at most 170 characters.
- Every shipped locale the project's release-surface lists has copy. A missing locale is reported, not silently left on the previous release's text.

Show the draft to the owner and hand over to `release-cut`.
