---
name: handoff
description: "User-typed: continue from a handoff written by /wrap-up (no argument: pick a thread; list: show threads; <thread>: continue that one)."
disable-model-invocation: true
metadata:
  ai-os-kind: handoff
  ai-os-registry: 3.4.0
---

# /handoff: continue from a handoff

Named `handoff`, not `resume`: Claude Code's built-in `/resume` (session picker) wins over a skill of that name.

Arguments: none (pick or continue), `list`, or a thread name.

## Data

`ai-os handoff list --json` returns the threads of this repository, newest first. Per thread: `thread`, `age` (printed,
e.g. "12 min ago"), `written` (ISO with offset), `goal`, `nextStep`, `account`, `branch`, `current` (matches the current
branch or worktree), `done`, `stale`, `openQuestions`. **Active** = not `done` and not `stale`.

**Age: use the printed `age` (or the first line of `ai-os handoff show`). Never compute an age yourself** from the
header date or the file name: they carry a timezone you would get wrong.

## No argument

1. Take the active threads. None: say so in one line (stale ones: name them, ask before relying on them) and stop.
2. Exactly one: use it and say so in one line ("Continuing `<thread>` (<age>), the only active thread."). Go to
   "Continue".
3. Two or more: ask with the **AskUserQuestion** tool (the native picker), one question, single choice:
   - Options: the up to 4 most recent active threads. The one with `current: true` goes first and its label ends
     with " (Recommended)". When none is `current`, the most recent goes first and is the recommended one.
   - Label: `<thread> · <age>` (add " (Recommended)").
   - Description: goal, next step, account and branch, e.g. `Goal: ... Next: ... Account: team, branch: feat/x`; shorten
     goal and next step to fit.
   - The built-in "Other" lets the user type a thread id (also one not among the options): use that thread.
   More than 4 active threads: say so in the question text and point to `/handoff list`.
4. Continue with the chosen thread.

## `list`

Run `ai-os handoff list` and show its output unchanged in a fenced `text` block at the top level (never inside a list
item), lines at most 80 characters. Stop there.

## `<thread>`

Continue with that thread.

## Continue

1. `ai-os handoff show <thread>` and read it fully. Its first line states when it was written and its age: report
   that age as printed. Verify the state the handoff describes against the repository now (branch, uncommitted
   changes, open PRs). Report differences first.
2. Honour **Do not redo / do not re-ask**: do not repeat those steps or ask those questions again.
3. State the first next step and the open questions, then continue with the first step once the user agrees.

A handoff from another account is normal; nothing here depends on account memory. Stale threads (30 days untouched) are
listed with a warning: confirm with the user before relying on them.
