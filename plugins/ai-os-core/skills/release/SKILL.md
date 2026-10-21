---
name: release
description: "User-typed shortcut: run the release workflow (Take merged work to a release - inventory since the last tag, release notes and store copy from changelog fragments, the cut behind the owner's approval, then close the milestone, record lessons and update the roadmap)."
disable-model-invocation: true
metadata:
  ai-os-kind: shortcut
  ai-os-workflow: release
  ai-os-registry: 3.1.0
---

# /release: Release workflow

The user chose the `release` workflow. Run the `start-work` router with the workflow preselected:

1. Load the `start-work` skill and follow it, with `workflow = release`.
2. Skip its workflow choice (step 4 picks `release`), but still classify size, risk and ambiguity, apply the path risk
   floors, and check prerequisites. A shortcut never lowers risk and never skips a gate.
3. Show the plan card and wait for the answer, as the router does (a trivial task: the one status line of step 5, no wait).

Arguments, if any, describe the task: $ARGUMENTS
