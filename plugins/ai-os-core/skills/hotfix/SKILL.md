---
name: hotfix
description: "User-typed shortcut: run the hotfix workflow (Fix a high-risk or production-affecting bug with the diagnosis accepted first, a minimal change and a mandatory review)."
disable-model-invocation: true
metadata:
  ai-os-kind: shortcut
  ai-os-workflow: hotfix
  ai-os-registry: 3.5.0
---

# /hotfix: Hotfix workflow

The user chose the `hotfix` workflow. Run the `start-work` router with the workflow preselected:

1. Load the `start-work` skill and follow it, with `workflow = hotfix`.
2. Skip its workflow choice (step 4 picks `hotfix`), but still classify size, risk and ambiguity, apply the path risk
   floors, and check prerequisites. A shortcut never lowers risk and never skips a gate.
3. Show the plan card and wait for the answer, as the router does (a trivial task: the one status line of step 5, no wait).

Arguments, if any, describe the task: $ARGUMENTS
