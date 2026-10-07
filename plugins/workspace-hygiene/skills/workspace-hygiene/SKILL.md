---
name: workspace-hygiene
description: Use when asked whether the local checkout is clean or in sync, before a release or a new batch of work, after merging several pull requests, or when clones, worktrees and branches have piled up — syncing every clone, listing and safely pruning merged worktrees and branches, checking each trunk against its remote, finding environment keys that drifted from the example files, and spotting agent-config drift (duplicate skill copies, .claude versus .agents) to hand to ai-os doctor and ai-os check. Report first; nothing is removed without the owner's yes. NOT for starting or submitting one issue's worktree (issue-workflow), a release cut (release), or fixing the agent configuration itself (ai-os doctor and ai-os sync).
---

# Workspace hygiene

A checkout drifts quietly: a clone falls behind and a new branch starts from an old trunk, a merged worktree holds a follow-up commit nobody pushed, an environment key exists on one machine and nowhere in the example file, two copies of a skill tell two agents different things. This skill is the checkout-level doctor. The facts — the repositories and their local paths and default branches, the worktree and branch patterns, and the project's own sync and cleanup commands with what each skips — live in `.ai-os/knowledge/repo-conventions.md`. Read it first. If it is missing or unfilled, explore (scripts at the workspace root, `git worktree list`, remotes) and ask the owner what exploration cannot answer, then fill it.

**Use the project's sync and cleanup commands when they exist; never reimplement what they already do.** Where a step has no command, do it by hand with the rules below and say so.

**Report first.** The default run changes nothing but fetched refs. Removing a worktree, deleting a branch or editing an environment file happens only after the report, and only with the owner's yes in this conversation for that list.

| The ask | Mode |
| --- | --- |
| "is the workspace clean?", before a release, after a batch of merges | check |
| "sync everything", "pull all repos" | sync |
| "clean up worktrees / branches" | prune — always after sync and a check report |

## sync

- Every clone the repository table lists, including the workspace repository itself. **Fast-forward only**; never create merge commits or rebase on someone's behalf.
- **Skip, never clobber:** a dirty working tree, a branch with no upstream, a clone with no commits yet, a repository not cloned on this machine. Each skip is reported with its reason and is not an error.
- An error is a fetch or update that should have worked and did not; report it and continue with the others.
- Fetch with pruning, so remote branches deleted after merge stop looking alive.

## check

Report per repository, each finding as `ok`, `warn` or `fail` with a one-line fix:

1. **Trunk state:** the main clone is on its default branch, clean, and neither ahead of nor behind its remote. A main clone parked on a feature branch is a finding.
2. **Worktrees:** every linked worktree with its branch, dirty or clean, locked, and whether its work has landed (below). A worktree may belong to a session that is still running — say so rather than calling it stale.
3. **Branches:** local branches whose work is already in the default branch, and branches with commits on neither the default branch nor their remote.
4. **Orphaned directories:** worktree folders with no git metadata left behind by a removal; report them, never delete them.
5. **Environment keys:** compare the key names in each local environment file with its matching example file (the variant's own example where one exists, the base example otherwise). Keys present locally but missing from the example are undocumented; keys in the example but missing locally explain why a fresh worktree fails to start. **Never print a value.**
6. **Agent configuration:** run `ai-os doctor` (instructions linked, ignore rules hiding agent config, skill copies in `.claude` and `.agents` that diverged, dead symlinks, skill names, English) and, when the repository has adopted AI OS, `ai-os check` (drift between the repository, its lock and the pinned registry). Relay their findings; do not re-check what they check. A skill duplicated by hand across agent directories is fixed by keeping one source in `.ai-os/skills/` and regenerating, not by copying the newer one over.

## prune

Removal needs two separate answers, and every check **fails closed** — an error means skip, never delete:

- **Done:** the work has landed — a merged pull request whose head was this branch, or a closed tracked issue when the conventions tie branches to issues.
- **Safe:** every commit here survives elsewhere — contained in the remote default branch, exactly the commit the pull request merged, or contained in the branch's remote.

A fresh worktree looks safe while nothing has landed; a squash-merged branch looks done while an unpushed follow-up commit sits on it. Only both together allow removal. Squash and rebase merges never make the branch an ancestor of trunk, so "merged" is decided from the pull request, not from ancestry alone.

**Never remove** a worktree that is dirty, locked, on a detached head, parked on the default branch, or outside the managed layouts repo-conventions names; never anything whose status could not be read. When the remote default branch cannot be resolved, skip the whole repository — an empty comparison reads as "fully merged".

Order: sync, check, show the removal list, get the yes, remove the worktree, then delete its branch and **print the commit it pointed at** so a mistake is recoverable. Clear stale worktree metadata afterwards.

## Report

Group by repository: synced or skipped (with reasons), trunk state, worktrees and branches (removable, kept and why), environment keys, and the doctor and check findings — what each costs and its fix. Say what was looked at, so "nothing to prune" is distinguishable from "nothing checked". After a prune, what was removed with each branch's last commit. End by updating repo-conventions — a new skip rule, a cleanup command, a layout — or saying "no durable change".
