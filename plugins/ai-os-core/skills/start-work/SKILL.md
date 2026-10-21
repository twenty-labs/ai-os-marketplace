---
name: start-work
description: "Use FIRST, before any other tool or skill, whenever the user asks to build, change, fix, release or research something in this repository — even small fixes. Classifies the task, checks prerequisites and shows the plan card (a trivial task: one status line) before work starts."
metadata:
  ai-os-kind: router
  ai-os-registry: 3.1.0
---

# start-work: the router

You are the single entry point for work in this repository (ai-os, ADR-0021). Run the steps below in order, in the
main conversation, before you change anything. Domain skills (for example `paywalls`, `app-store-compliance`) are
ingredients a stage loads; work never starts from one of them. Process skills (`brainstorming`, `writing-plans`,
`systematic-debugging`, `test-driven-development`, `subagent-driven-development`, `verification-before-completion`,
and the like) are stages you run, not entry points: do not invoke them before this skill.

If you were dispatched as a subagent to carry out a specific stage or ticket, you are not the router: do not invoke
`start-work`; do the task you were given.

## Inputs

- `workflows/index.json`, next to this file: the workflows, the change types each takes and the knowledge each
  requires.
- `.ai-os/router.json` in the repository, written by `ai-os sync`: path risk floors, the hook profile, the model per
  tier, the effort ceiling, `models.budget`, the enabled roles and the knowledge each requires, and where each
  knowledge file lives. If it is missing, say so in one line, suggest `ai-os sync`, and go on with no floors and an
  effort ceiling of `medium`.
- A shortcut (`/feature`, `/bugfix`) may preselect the workflow. Then skip the choice in step 4 only.
- No task is too small for this skill: a trivial one gets one status line and no question (step 5). Never start by reading or
  editing instead.

## 1. Classify

Put the task on the axes:

- `changeType`: one of the change types listed in `workflows/index.json` (for example `feature`, `bug`);
- `size`: `trivial`, `small`, `medium` or `large`;
- `risk`: `low`, `medium`, `high` or `critical`;
- `ambiguous`: `true` or `false`. When unsure, `true`.

List the paths the task will likely touch. For every entry of `riskFloors` whose `paths` globs match one of them (and
whose `task` matcher, if present, matches the task), raise the risk to at least its `floor`. Never lower the risk.
Keep the list of floors that applied for the plan card.

## 2. Check prerequisites

Required knowledge: the workflow's `requires.knowledge`, plus the `requiredKnowledge` of each role the task needs
(`roles` in `.ai-os/router.json`). For each slot, read the frontmatter `status` of its file (`knowledge.<slot>.path`).

- A missing file or `status: unknown` is unmet (ADR-0021 amendment 2026-10-20). What it means depends on the risk
  after the floors:
  - **low or medium:** GO. Missing required knowledge becomes the FIRST stage of the plan, `knowledge` (before the
    workflow's own stages): draft each missing slot from the code and docs as `status: draft`, then list the drafted
    slots for the owner to review (a human sets `status: valid`). Do not stop: go on to step 4 and show the plan card
    in the same turn, with the `knowledge` stage as row 1. When nothing is missing, there is no `knowledge` stage.
    A **trivial** task gets no `knowledge` stage and no card: name each unmet slot in the one status line of step 5.
  - **high or critical:** **NO GO**: do not start the workflow until the slots exist. Ask the user, in the question
    format below, to choose: fill the slots now (the role that needs them drafts them, a human sets `status: valid`),
    or run a spike that produces them.
- `draft`, `stale` or `conflicted` never block: GO is allowed; list the slot on the plan card.

## Output formatting (every router message)

Applies to the plan card, the GATE 1 plan summary and a NO GO message. The terminal renders a markdown table only as a
top-level block; a table inside a list item is printed raw with pipes.

- Never put a table inside a list item. A table always starts at column 0, with a blank line before and after it.
- Write numbered items as a bold label on their own line (`**7. Sample in s6**`), not as markdown ordered-list
  syntax, so the numbering survives a table between items.
- Keep tables at 80 characters or less.

## Asking the user (every question)

Every question to the user, NO GO choices included, uses numbered rounds, never prose such as "Two ways forward: (a)
... (b) ...". One round per question, in this shape, each followed by the recommended answer, worded so that "yes"
accepts it:

```text
❓ **Q1** – <title>: <body, with the options inline>
➡️ <recommended answer, as a sentence "yes" accepts>
```

Example:

```text
❓ **Q1** – Missing knowledge: product-strategy is unknown and the risk is high, so there is no GO. Fill it now, or run a spike?
➡️ Fill it now: I draft product-strategy from the code and docs and you review it.
```

## 3. Recall

If the `ai-os` command is available, run `ai-os recall search "<one-line task summary>" --auto` once and use what it
returns (it keeps within the session budget). For a bug, look for a repeat of the same bug first.

When the `ai-os` command is missing (recall, `ai-os usage`, `ai-os doctor`), say so in one line, go on without it, and
suggest running it through `npx -y @twentylabs/ai-os@<pinned> <cmd>`, where `<pinned>` is the `cli` version pinned in
`ai-os.yaml`. Never stop for it.

## 4. Choose the workflow and its plan

Choose the workflow whose `changeTypes` include the task's change type. If none fits, say so in one line and work
without a workflow unless the user picks one. When the change type is `bug` and the risk after the path floors is
`high` or `critical`, propose `hotfix` on the plan card instead of `bugfix` (the user may keep `bugfix`). Then read exactly one plan file:
`workflows/<workflow>/<size>-<risk>-<clear|ambiguous>.json` (after the floors). It lists the stages in order, the
skipped stages, the gates, and per stage: skill or role, ingredient skills (`uses`) and the files to `read`, where
it runs, tier, model, effort, execution, isolation, gate, hooks, tools, subagent counts and the usage label. A stage
with a `role` runs as that role's agent (`subagent_type` = the role id).

Apply the repository's settings from `.ai-os/router.json`:

- model: `models[tier]` replaces the plan's `model`;
- effort: the plan row never shows more than `effort.ceiling`. A stage that carries a `suggestion` (the effort its
  layers asked for above the ceiling, with the reason) or a ticket that carries a `modelSuggestion` (a higher tier the
  budget refused) is a suggestion only: see "Suggestions" in step 6;
- `budget.maxDeepAgents`: while more `deep` subagents would run than allowed, move the lowest-risk ticket to
  `standard`, and list each downgrade on the plan card;
- `execution: parallel` on a ticket stage (one without `script`) only when the task graph has two or more
  independent tickets ready together; otherwise `sequential`;
- every stage's `hooks` must be active in `hookProfile`; if one is not, say so on the plan card.

## 5. Right-size

A trivial task (one file, obvious cause, low risk after the floors) asks nothing: print one line and proceed at once,
inline in this conversation, with no subagents. No plan card, no GATE 1, no waiting for an answer:

`start-work: trivial <changeType>, proceeding inline`

GATE 2 still applies: ask before any commit, push or PR. The plan card and GATE 1 apply from size `small` upward, as
the workflow's plan file says.

## 6. Show the plan card

For every task above trivial, show it, in the grilling format of `references/plan-card.md`, and wait for the answer. "yes" accepts every
recommendation (suggestions excluded); the user may change any item or row first. The approved card is the task's contract.

Suggestions (ADR-0011 amendment 2026-10-20): the plan rows show the capped value. For every stage or ticket whose plan
data has a `suggestion` or `modelSuggestion`, add one grilling question of its own after the card's numbered items,
for example:

`❓ **Q9** – Stage review (security, risk high): suggest effort xhigh because risk high + review stage. Accept? (default stays medium)`
`➡️ No: keep medium.`

`❓ **Q10** – Ticket T3 (architecture): suggest model deep because the budget maxDeepAgents 1 downgraded it. Accept? (default stays standard)`
`➡️ No: keep standard.`

Suggestion questions continue the numbering after the plan-card items (here the card had items 1 to 8). "yes" to a card item
does not accept a separate suggestion question.

Only an explicit "yes" to that question, in this conversation, or when the request pre-approved it by name, raises
that one stage or ticket, for this task only.
Accepting a model suggestion keeps the ticket's effort at the plan's capped value unless an effort suggestion is
also accepted. "yes" to the whole card does not accept suggestions; no answer means the default stays. Never change
`effort.ceiling`, `models.budget` or the manifest to apply a suggestion.

## Pre-authorisation

The user may pre-approve in the request: the plan card's recommendations, effort or model suggestions, GATE 1, GATE 2
(commit, PR, merge: each only if named) and other gated workflow steps. Then still show the plan card (informational),
do not wait, and record each pre-approved item as one line, for example "GATE 1: pre-approved in your request".

- Naming a gate alone approves nothing at GATE 2; name the act (commit, PR, merge).
- Scope: this task only, and only what the request names ("open a PR" does not include merge). Vague phrases such as
  "just do it" are not pre-approval.
- Stop and ask anyway when something unexpected happens (tests fail, the diff or files go beyond the plan, the scope
  changes, a new risk appears). For risk `high` or `critical` the mandatory review still runs and any CRITICAL or HIGH
  finding stops the run.
- Owner-only acts (publishing, store submission, production writes, `asc` approve or release) follow `ownerActs` in
  `ai-os.yaml`. `ask` (the default): the native Claude Code prompt still appears once, for the human to answer; never
  answer it or work around it. `allow`: pre-approval by name in the request suffices (name the act, for example "run
  `asc workflow run release`"). `deny`: never run them; tell the owner the command. The real setup-user run is
  unaffected: it is never unlocked by a prompt and keeps its own confirmation rule.
- Merging may still be blocked by Claude Code's own auto-mode review classifier or permissions. Do not retry: tell the
  user which permission rule in `.claude/settings.local.json` would allow `gh pr merge`.

## 7. Run the stages

- At every stage change, write `.ai-os/state/workflow.json` (git-ignored): `{"workflow": "...", "stage": "...", "ticket": "..."}`.
- A stage's instructions are its skill and its `uses` skills, listed in `read` relative to this skill's directory:
  read those files and follow them (a subagent gets their absolute paths). Do not invoke stage skills through the
  Skill tool, and never call a user-typed shortcut: some stage skills are user-invoked orchestrators.
- `runs: main`: you do the stage here. If its model differs from the session's model, remind the user once:
  "this stage recommends <model>; switch with /model <model> if you want it". The main session cannot switch itself.
- A stage with `script` (the review stage): do not spawn per-ticket agents. Compute the diff and the changed files in
  this conversation (the diff of the work against its base, and the names of the changed files; an empty diff ends the
  stage with "Nothing to review."), then call the Workflow tool on the script (its path is relative to this skill's
  directory) with `{"diff": ..., "language": "<dominant language>", "changedFiles": [...], "spec": "<spec text, if any>", "model":
  "<the plan's model>", "effort": "<the plan's effort>", "label": "<workflow>:<stage>:-"}` (the plan card's model, effort
  and usage label, which the script applies to every reviewer and verifier).
  It runs the reviewers in parallel, deduplicates by evidence and tries every CRITICAL or HIGH finding with an
  adversarial verifier that defaults to refuted. Show `blocking` and `advisory` to the human; `incomplete` or a
  failed script is never an approval.
- `execution: parallel` on a ticket stage (implement): read `references/frontier.md` and follow it.
- **Every Agent call you make passes both `model` and `effort`** from the plan (the stage or ticket row), the
  research and knowledge stages included, next to the usage label. A subagent that gets neither inherits the main
  session's model (often Opus) and effort. For a stage that is not on the card (for example drafting knowledge
  slots), use the role's `tier` (model `models[tier]`) and `effort` from `.ai-os/router.json` `roles.<id>` (effort already capped at `effort.ceiling`).
- `runs: subagent`: one Agent call per ticket (`execution: sequential` in order), with the plan's `model` and
  `effort`, and the label `<workflow>:<stage>:<ticket>` as the call's `description` (ticket id, or `-` when the stage
  has no tickets). Begin every subagent prompt with: "You are dispatched as a subagent for stage <stage>, ticket
  <ticket>. Do not invoke start-work; do this task." Restrict the subagent to the stage's `tools`; `isolation: worktree` gives it its own git worktree.
- **Worktrees stay inside the working directory.** When the work belongs in a separate worktree, call the
  `EnterWorktree` tool (it creates it under `.claude/worktrees/` and switches the session into it) or, if the tool
  is not available, tell the user to start the session in that worktree. Never create a worktree outside the working
  directories and then read or edit there: it triggers "Read outside the working directories" prompts.
- **Gates stay in this conversation.** GATE 1 follows the stage with `gate: plan`, GATE 2 the stage with
  `gate: finish`. Stop there, show the result, and wait for the human's decision. A background run (the Workflow
  tool, a detached agent) covers only the segments between gates. An AI review is input to the human, never the
  approval.
- When a stage finds the task is bigger or riskier than classified, stop and show an updated plan card.
