---
name: skill-from-session
description: "User-typed: package a workflow from this session into a registry skill or command and open the twenty-labs pull request after your yes."
disable-model-invocation: true
metadata:
  ai-os-kind: skill-from-session
  ai-os-registry: 3.5.0
---

# /skill-from-session: package this session's workflow for every repository

The owner ran a process in this session, found it worth keeping, and typed this. Turn that process into a generic
registry skill or command and open the pull request on twenty-labs/ai-os, through `ai-os skill promote` and only after
the owner's yes. One skill per run. Never edit product code.

Argument: an optional hint at which process to package ("the ads check"). Without one, take the main multi-step
process of the session; if there are two, ask which (in the step 7 question).

## Steps

1. **Distill.** Reread the session (the conversation in context; the transcript file if it was compacted): the goal,
   the steps that worked, what was checked and where, traps hit (wrong turns that cost time or money), and the output
   the owner found useful. Drop dead ends that taught nothing. Done when you can state the process as numbered steps,
   each with where its evidence comes from.
2. **Checkout.** The ai-os checkout is the path the owner gave; else `ai-os-checkout` under the cache directory
   (`$AI_OS_CACHE_DIR`, else `$XDG_CACHE_HOME/ai-os`, else `~/.cache/ai-os`): clone
   `https://github.com/twenty-labs/ai-os` there, or fetch and reset it to `origin/main` when it exists. Stop and ask
   only if that fails. Done when the checkout is clean on `origin/main`; later steps read the registry from it.
3. **Generalize.** Registry content is public. Replace every project fact (file paths and names, numbers, app, account,
   customer, internal system names) with a `<placeholder>` or a pointer to a knowledge slot (the checkout's
   `packages/registry/knowledge-slots/` lists them). A fact with no matching slot stays a `<placeholder>` and goes in
   the summary as `Needs slot`. Vendor and tool names used as examples are fine. Done when you have a list of what you
   removed.
4. **Neighbours.** Run `ai-os list skills` and read the descriptions and bodies of the closest one or two. If an
   existing skill already does most of this, stop here: show the overlap and hand the distilled material to
   `skill-coach`, which changes registry skills upstream. Do not promote. Otherwise note where the boundary lies and
   point to the neighbour for the part it owns instead of copying it. Done when the closest neighbour is named.
5. **Shape.** Write the folder to `.ai-os/skills/<id>/` in this repository: `SKILL.md`, `references/` for detail only
   some runs need, and `skill.yaml` with narrow `capabilities` and `requiredKnowledge` for the slots it reads. Follow
   the checkout's `writing-for-agents` skill and `docs/contributing/skills.md`. Every report the skill produces uses a
   `references/report-template.md` that follows [the house style](references/house-style.md). Name it
   `<domain>-<activity>` (`ads-readiness`, `conversion-audit`), never verb-first. Start as a command; step 7 may change
   it. Done when the folder exists.
   - **Command** (user-invoked): `disable-model-invocation: true` under `spec.runtime.claude` and
     `allow_implicit_invocation: false` under `spec.runtime.codex.openaiYaml.policy`; the description is one
     human-facing line.
   - **Skill** (model-invoked): description "Use when … NOT for …", under 600 characters, the NOT-for clause naming the
     real neighbour.
6. **First dry run.** It checks the folder and suggests roles:

   ```sh
   ai-os skill promote .ai-os/skills/<id> --ai-os <checkout> --opt-in --dry-run
   ```

   Fix every error and warning in the folder and rerun until clean. A `project-fact` error names a file and line:
   rewrite it, never work around the check. Done when it passes and you have its suggested roles.
7. **Ask.** One `AskUserQuestion` call, recommendation first and labelled `(Recommended)`, skipping a question whose
   answer is obvious:
   - kind: **command** recommended for a multi-step process the owner starts on purpose; **skill** when the agent must
     reach it on its own;
   - name: the recommended id plus one or two alternatives;
   - roles to attach (the first dry run's suggestions), or opt-in.
   Apply the answers to the folder. Done when kind, name and roles are settled.
8. **Dry run** with the answers: `ai-os skill promote .ai-os/skills/<id> --ai-os <checkout> --dry-run --role <id>
   [--role <id> ...]` (or `--opt-in`). Done when it passes with `project facts: pass`, or `partial` shown to the owner
   in the summary.
9. **Summary, then the last question.** Print the block in [the summary format](references/summary.md), then ask with
   `AskUserQuestion`: "Open the public pull request on twenty-labs/ai-os?" Options: **open it** (Recommended when the
   dry run is clean), **keep it local only** (the skill stays in `.ai-os/skills/` and works in this repository),
   **cancel** (delete the folder). Anything but "open it" is a no.
10. **Promote.** Only on "open it". Write two temporary files: a changeset (`"@twentylabs/ai-os-registry": minor`, one
    line on what the skill does) and a pull request body that fills every section of the checkout's
    `.github/pull_request_template.md` (Summary, Evidence with the dry-run tail, the judgment checklist ticked only
    where true, Merge danger, Shared-file edits, Knowledge impact): no empty section. Both are public and both are
    scanned for project facts: say where the process came from in generic words. Leave the `gh account` line out of
    the evidence. Then run step 8's command with `--yes --changeset-file <file> --body-file <file>` instead of
    `--dry-run`. It runs `gh` as the policy `github-account`; never switch accounts. Done when it prints the pull
    request URL.
11. **Report** in one line: the pull request URL, and that the repo-local copy was removed.

## Rules

- Nothing public before the owner's "open it". Never `--yes` without a clean dry run of the same arguments.
- A skill that still names a customer, a person, an account or an internal system is not promoted.
- Chat output is short: the summary block and the questions, no paragraphs. Write chat in the owner's language; the
  skill itself is English (registry validate rejects other languages).
