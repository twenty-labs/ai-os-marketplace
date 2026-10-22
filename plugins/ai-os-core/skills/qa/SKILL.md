---
name: qa
description: "User-typed shortcut: run the qa workflow (Verify a built change or a deployed build against what was intended, with browser checks and a SHIP or DO NOT SHIP verdict. Fixes are not made here)."
disable-model-invocation: true
metadata:
  ai-os-kind: shortcut
  ai-os-workflow: qa
  ai-os-registry: 3.3.0
---

# /qa: QA workflow

The user chose the `qa` workflow. Run the `start-work` router with the workflow preselected:

1. Load the `start-work` skill and follow it, with `workflow = qa`.
2. Skip its workflow choice (step 4 picks `qa`), but still classify size, risk and ambiguity, apply the path risk
   floors, and check prerequisites. A shortcut never lowers risk and never skips a gate.
3. Show the plan card and wait for the answer, as the router does (a trivial task: the one status line of step 5, no wait).

Arguments, if any, describe the task: $ARGUMENTS
