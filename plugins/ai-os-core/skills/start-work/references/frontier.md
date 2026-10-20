# Frontier execution (parallel implement stage)

Use this only when the plan card picked `execution: parallel` and the task graph has two or more independent tickets
ready together. Otherwise run the tickets one by one. Talk to subagents through context pointers (spec, tickets,
notes, commits), not copies.

1. **Integration branch.** Create one branch for the whole task from the current base. Every ticket lands there; nothing
   goes to the base branch before GATE 2.
2. **Frontier.** The tickets form a graph with blocking relations. The frontier is every open ticket whose blockers are
   all merged. Work only the frontier.
3. **Implementer per ready ticket.** One Agent call per frontier ticket (each prompt states it is dispatched for that
   ticket and must not invoke `start-work`; the merger prompts say the same), in the background, labelled
   `<workflow>:implement:<ticket>`, with the plan's `model` and `effort`, in its own git worktree
   (`isolation: worktree`) on its own branch. Each implementer confirms its worktree is based on the integration
   branch (reset onto it if not), builds the ticket test-first, merges the integration tip into its branch, then
   reports done.
4. **Merger subagent.** When an implementer reports, one merger subagent merges that branch into the integration
   branch (labelled `<workflow>:merge:<ticket>`), runs the tests, and reports conflicts instead of guessing. Merges
   run one at a time.
5. **Recompute the frontier** after each merge and start implementers for the tickets it unblocked.
6. **When every ticket is merged,** run the review stage on the integration branch, then remove every implementer
   worktree. Gates stay in the main conversation.
