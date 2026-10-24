---
name: feature
description: "User-typed shortcut: run the feature workflow (Build a new capability end to end, from the plan card to a reviewed pull request)."
disable-model-invocation: true
metadata:
  ai-os-kind: shortcut
  ai-os-workflow: feature
  ai-os-registry: 3.5.0
---

# /feature: Feature workflow

The user chose the `feature` workflow. Run the `start-work` router with the workflow preselected:

1. Load the `start-work` skill and follow it, with `workflow = feature`.
2. Skip its workflow choice (step 4 picks `feature`), but still classify size, risk and ambiguity, apply the path risk
   floors, and check prerequisites. A shortcut never lowers risk and never skips a gate.
3. Show the plan card and wait for the answer, as the router does (a trivial task: the one status line of step 5, no wait).

Arguments, if any, describe the task: $ARGUMENTS
