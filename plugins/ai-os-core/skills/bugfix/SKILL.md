---
name: bugfix
description: "User-typed shortcut: run the bugfix workflow (Fix a reported bug, from root cause and a failing test to a reviewed pull request)."
disable-model-invocation: true
metadata:
  ai-os-kind: shortcut
  ai-os-workflow: bugfix
  ai-os-registry: 3.0.0
---

# /bugfix: Bugfix workflow

The user chose the `bugfix` workflow. Run the `start-work` router with the workflow preselected:

1. Load the `start-work` skill and follow it, with `workflow = bugfix`.
2. Skip its workflow choice (step 4 picks `bugfix`), but still classify size, risk and ambiguity, apply the path risk
   floors, and check prerequisites. A shortcut never lowers risk and never skips a gate.
3. Show the plan card and wait for the answer, as the router does (a trivial task: the one status line of step 5, no wait).

Arguments, if any, describe the task: $ARGUMENTS
