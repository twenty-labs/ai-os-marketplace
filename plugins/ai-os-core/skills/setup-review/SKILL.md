---
name: setup-review
description: "User-typed: scan this repository and recommend registry roles, skills, plugins and blocks to enable, and home-made tooling to move to the twenty-labs way."
disable-model-invocation: true
metadata:
  ai-os-kind: setup-review
  ai-os-registry: 3.5.0
---

# /setup-review: what else the registry offers this repository

Run when setting up a repository with ai-os, or on one already set up. Recommend what to enable, which home-made
tooling to move to the twenty-labs way, and show what is already fine. Read-only until the owner picks; this skill
never edits product code.

## Steps

1. **Match.** Run `ai-os suggest --json`. Done when you have its `overlaps`, `recommend` and `fine` lists.
2. **Confirm the overlaps.** For each overlap, read the matched files (`evidence`) and the knowledge files it lists
   (`knowledge`). Confirm the tooling really does the job (the script really uploads to App Store Connect) and find
   the sections that teach the old path. Write its migration plan: what to enable (`enable`), what stays (`keep`), which
   knowledge sections change, and the code changes. Drop an overlap that does not hold. If a knowledge file it lists
   already carries a `> Migrating to` note, the migration is in progress: report it as "in progress" with the issue the
   note names, and do not plan, note or open it again. Done when each kept overlap has a plan or is marked in progress.
3. **Confirm the recommendations.** For each `recommend` item, read enough of its evidence to know it holds; drop it
   otherwise. Then look for evidence of how the owner works, which the CLI does not match: specs or PRDs under `docs/`,
   `.github/ISSUE_TEMPLATE`, a tracker in use, roadmap files. Offer `product-owner`, `project-manager` or
   `business-analyst` only with such evidence, and never mark them `(Recommended)`. Skip anything `ai-os.yaml` already
   enables. Done when every item left has evidence you checked.
4. **Report.** Print the report in [the report format](references/report.md). No paragraphs.
5. **Ask.** One `AskUserQuestion` call, multi-select, with one question per section (move to twenty-labs, enable,
   work-style roles): up to four questions, 2 to 4 options each, recommended items first, labelled `(Recommended)`,
   each with its evidence in the description. A section with more than four items is split into several questions;
   a section with a single item gets a second option "not now". Done when the owner has picked (picking nothing ends
   the run).
6. **Apply the picks.**
   - **Enable** a role, skill or plugin: add it to `ai-os.yaml` (`roles`, `skills.include`, `plugins.include`), then
     run `ai-os sync` once for all of them. An `mcp` item goes into `mcp:` (ask the owner for every required param,
     such as Supabase's `projectRef`; never invent a project ref). The `direnv` block is `direnv: true`: after
     `ai-os sync`, run `ai-os envrc` (a dry run) to get the suggested GitHub account, confirm it with the owner in one
     `AskUserQuestion` (suggested first, Recommended), then `ai-os envrc --gh-account <login> --write` and report its
     next steps. The tokens are the owner's to fill: never fill a token, never run `direnv allow`.
   - **A hand-made MCP setup** (a `.mcp.json` written by hand, its own variable names, maybe a committed `.envrc`
     sourcing `.envrc.local`): run `ai-os mcp adopt --json` and, when it lists servers, put the adoption under
     "move to twenty-labs" with each server's renames as evidence. Applying it is `ai-os mcp adopt --write` (with
     `--param <server>.<param>=<value>` for what it asks); never edit the env files by hand and never print a value
     from them. Report its next steps, including the teammates' `ai-os envrc --adopt --write`.
   - **Migrate** (a picked overlap): do not change `ai-os.yaml` for that job. Draft one migration issue: the steps, what stays, and done criteria that include rewriting those knowledge
     sections to the registry's way. For `app-store` the issue lists: add the `appStore` block to `ai-os.yaml` (the
     app id from `fastlane/Appfile` or the iOS config when a numeric id is there, else ask the owner; the asc
     credential profile), `asc metadata pull` from the live store into `appstore/metadata` and drop
     `fastlane/metadata`, switch the script's App Store Connect steps to the asc workflows, and keep what the overlap's
     `keep` lists. For `release-kit` (agent-workspace-kit) the issue lists: `ai-os release from-kit --write`, then
     fix the env names it reports; `ai-os release preflight <env> --mode release`, then `ai-os release cut <env> both` and
     `ai-os release patch <env> <platform> --pick …` as dry runs; rewrite `release-surface` to the `ai-os release`
     commands; remove the kit pieces `from-kit` lists; done after one real patch and one real store cut through ai-os.
   - A second `AskUserQuestion` before opening any issue: open them (Recommended), or keep the drafts in chat.
   - Then, at the top of each knowledge section a migration plan names, add
     `> Migrating to <registry way>, tracked in #<n>. Until it closes, <old path> is still the way.` with the opened
     issue's number, or, when the drafts stay in chat, with
     "tracked in a draft issue (not opened yet)" in place of "tracked in #<n>". Never leave a placeholder in a file.
   Done when `ai-os sync` succeeded and every picked migration has its note and issue (or draft).
7. **Report** in one line what changed: items enabled, issues opened, knowledge files touched.

## Rules

- Nothing changes before the owner's picks; never edits product code: code changes become issues.
- Every item shown has evidence the owner can check (`path` or `path:line`).
- Chat in the owner's language; ids, paths and commands stay as they are.
