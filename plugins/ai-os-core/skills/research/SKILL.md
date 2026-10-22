---
name: research
description: "User-typed shortcut: run the research workflow (Research a question before building - what already exists in the repository, registries and on GitHub, what to adopt, extend or build - and report with sources)."
disable-model-invocation: true
metadata:
  ai-os-kind: shortcut
  ai-os-workflow: research
  ai-os-registry: 3.3.0
---

# /research: Research workflow

The user chose the `research` workflow. Run the `start-work` router with the workflow preselected:

1. Load the `start-work` skill and follow it, with `workflow = research`.
2. Skip its workflow choice (step 4 picks `research`), but still classify size, risk and ambiguity, apply the path risk
   floors, and check prerequisites. A shortcut never lowers risk and never skips a gate.
3. Show the plan card and wait for the answer, as the router does (a trivial task: the one status line of step 5, no wait).

Arguments, if any, describe the task: $ARGUMENTS
