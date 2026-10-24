---
name: wrap-up
description: "User-typed: close the session. Reports state, proposes follow-ups and writes a handoff another account can continue (--quick: state and handoff only; --done: close the thread)."
disable-model-invocation: true
metadata:
  ai-os-kind: wrap-up
  ai-os-registry: 3.5.0
---

# /wrap-up: close the session

Read-only until the user approves. Closes any session, workflow or not. The handoff is account-independent: another
Claude account on this machine continues from it. Never write it into the repository, never into `.ai-os/knowledge/`.

Arguments: `--quick` runs steps 1 and 6 only. `--done` closes the thread (see "Done"). A word is the thread name;
default thread: the issue number from the branch name, else the branch, else a short slug.

## Steps

1. **State**, per touched repository and worktree: `git status`, unpushed commits, open PRs (`gh pr list --head <branch>`),
   stray worktrees and branches, running agents and background tasks.
2. **Work items**: update the active issue, create missing issues, draft follow-ups. Do not create without the user's yes.
3. **Decisions and knowledge**: decisions that belong in an ADR or the decision log, knowledge slots as `draft`, GLOSSARY.
   Run `ai-os handoff memory`: it lists facts that live only in an account's memory (not in the shared store). Propose
   exporting each to the repository (knowledge slot, ADR or issue); the user decides.
4. **Learn**: retro, skill-coach, `ai-os skill promote`, permissions suggestions, when the session earned them. When the
   session ran a repeatable multi-step process no existing skill covers, propose `/skill-from-session`.
5. **Usage**: `ai-os usage --since 1d --repo .` for the session.
6. **Handoff** (below).

Output: a short report, then numbered proposed actions in grilling format (one line each, a recommended answer).
"yes" runs all of them.

## Handoff

Write markdown with these sections, in this order, each self-contained (a reader has not seen this conversation):

1. `## Goal`
2. `## State`
3. `## Decisions`
4. `## Do not redo / do not re-ask`
5. `## Next steps`
6. `## Open questions`
7. `## Uncommitted changes`
8. `## Sources`

- Decisions: one line and a link each (ADR, issue, PR, commit). Link instead of inlining.
- **Do not redo / do not re-ask** is the most important section: what was tried and rejected, what the user already
  answered, what is verified and needs no re-check.
- Next steps: ordered, the first one concrete enough to start without questions.
- At most about 150 lines.

Save it with `ai-os handoff write <thread> --file <draft.md> --account <label> --model <id> --branch <branch> --session <id>`
(the header carries date, an ISO `Written` timestamp with offset, account, model, branch and session id). A new write in the thread supersedes
the previous one; three versions are kept. Mirror a short summary and the path as a comment on the active issue.

## Completion check (the handoff is not done until it passes)

Start a fresh subagent with no context (Agent tool, no inherited conversation) and this prompt:

> You have no context. Read ONLY the handoff below. Answer in three parts: (1) the next step you would take, exactly; (2) the information you are missing to take it; (3) every question you would have to ask the user again. Do not read any other file and do not use any tool except to read this one file: <path to latest.md>.

It must state the next step, the missing information and what it would re-ask. If the next step is not the one you
meant, information is missing, or it would re-ask something already answered, fix the handoff and run the check again
with a new subagent. Report the result to the user.

## Done (`--done`)

The thread is finished: issue closed, PR merged, branch deleted, or the user says so. Before closing, verify the
durable content of the handoff is already in an ADR, an issue or a knowledge slot (list where each item went; propose
what is missing). Then `ai-os handoff done <thread>` and `ai-os handoff prune --thread <thread>`. A thread with open
questions needs the user's explicit yes (`--yes`).
