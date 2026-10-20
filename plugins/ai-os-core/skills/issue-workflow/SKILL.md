---
name: issue-workflow
description: Use for the life of one tracked issue — creating a fully populated issue (from a review, an audit, a plan or a bug found mid-task), starting one (pick, assign, in progress, its own worktree), submitting one (rebase, a pull request that closes it, in review, merge only on a yes), or triaging open issues to owners. Other skills hand off here instead of creating issues themselves. NOT for whether work is worth doing (product-owner) or status reports (project-manager).
---

# Issue workflow

One issue is one shippable unit, from creation to merge. The method is the same in every project; what differs — the tracker and the account it is reached with, board and field identifiers, the repository table, labels, the team roster, the language of bodies, branch and worktree patterns, the merge method, sync and cleanup commands — lives in `.ai-os/knowledge/tracker-surface.md` and `.ai-os/knowledge/repo-conventions.md`. Read both first. If either is missing or unfilled, explore (existing issues, pull requests, `git log`, scripts at the root) and ask the owner what exploration cannot answer, then fill it before writing to the tracker.

Every tracker call runs as the account tracker-surface names, in its per-command form. Never switch the machine's global account. If a write reports a missing scope, name the refresh command and stop; do not work around it.

| The ask | Mode |
| --- | --- |
| "open an issue for X", a hand-off from another skill | create |
| "start issue N", "pick something up" | start |
| "open the PR", "ready for review", "merge it" | submit |
| "triage the backlog", "assign these" | triage |

## create

"Created" means all four are true:

1. The issue exists with a **type label** and the **full body** below.
2. It is on the authoritative board, when the project has one.
3. Every field the board needs (area, priority, release or milestone) is set; status stays in the first column; the assignee is the account that created it unless the conventions say otherwise.
4. It is reported back as `<short>#<number>` with its URL.

Steps:

1. **Resolve the repository** from the tracker-surface repository table — never derive the owner from a folder name. A change that must land in two repositories together is one issue per repository, cross-linked in both bodies.
2. **Confirm in one block**: title (you draft it, in the conventions' title language), one-line scope, type, priority, release. Anything the owner already said counts as given. **Never guess priority.** Release defaults to the active-release marker the conventions name. Wait for a yes.
3. **Create** with the body template; every section present — write "N/A — <why>" rather than dropping one.
4. **Add to the board and set fields.** Resolve field and option identifiers at runtime; identifiers in knowledge are a cache, not the truth. If a needed option does not exist (a new release), say so and stop: creating options is the owner's call.
5. **Verify by the board item id** the add returned, never by issue number: list commands cut the newest items first, and numbers collide across repositories. Report the verified line.

```markdown
## Context
Why this exists, with evidence: file and line, a table of numbers, or a link to the review.

## Scope
- In scope
- Out of scope: what is deliberately not done, and where it goes

## Acceptance criteria
- [ ] A verifiable outcome

## Analytics
Events and properties to emit, registered where the conventions say before they ship — or "N/A — not user-facing".
```

repo-conventions may add sections; keep these four.

## start

1. **Sync** every repository involved (the conventions' sync command, or fetch). A repository not cloned here is reported as skipped, not as an error.
2. **Pick** — skip when the caller already fixed the issue. Otherwise list open issues in three groups, in this order: assigned to me, unassigned, assigned to someone else (with the handle). Filters sort; they never hide. Narrowing to one bucket makes the list read "no work left" while issues sit open. If nothing fits, run **create**.
3. **Guard** — closed, or assigned to someone else: warn and confirm.
4. **Make the issue the source of truth before code.** Thin scope or criteria: update the body and confirm. Independently shippable extra work becomes a new linked issue, not a bigger one. User-facing work lists its analytics events.
5. **Assign yourself** and move the card to in progress (same runtime identifier resolution).
6. **Worktree** — one per issue, off the freshly fetched default branch, at the path and branch pattern repo-conventions records, with an English slug. Never switch the main clone's branch.
7. **Report** repository, issue, branch and worktree path.

## submit

1. Locate the issue's worktree by its branch.
2. **Rebase** on the freshly fetched default branch. Resolve conflicts locally, never in the pull request.
3. **Re-check** the issue is still open and still yours.
4. **Push and open the pull request** from inside the worktree. Title in the conventions' title language; the body links the issue with a closing keyword (`Closes #N`). Changes in a second repository (shared docs) are a second pull request, cross-linked.
5. Move the card to in review.
6. **Report a table**, one row per pull request: PR · repository · title · closes · commits · files (+/−) · checks · URL — pulled from the tracker, not estimated. Below it: stacked pull requests whose base is this branch, and the command to read the diff.
7. **Merge only after the owner says yes in this conversation.** An approved plan, green checks, a merge instruction for an earlier issue and silence are not consent. Never enable auto-merge. On a yes:
   1. Re-check mergeability and checks; fix a red or behind branch first. Merging over red checks needs the owner to accept that risk in so many words.
   2. **Retarget stacked pull requests** to the default branch before this branch is deleted — deleting a base branch closes them.
   3. **Merge with the method repo-conventions records.** Unsure: count merge commits on the default branch before typing the command. Never choose squash or rebase by habit.
   4. **Prove it landed**: fetch, then `git merge-base --is-ancestor <head-sha> origin/<default>`. A "merged" badge is not proof.
   5. **Clean up now**, not at the next start: sync first, then prune worktrees whose work is merged; return the clone to a clean, current default branch and show its status.

## triage

The lead's routing pass. It never starts work.

1. Scope the repositories, sync, and list open issues that need an owner — unassigned by default; re-balance only when asked.
2. **Read each body.** Never route from the title.
3. Route by "Team and routing" in tracker-surface. Resolve the live member list at runtime; for a member not in the table, ask the lead for their leaning instead of guessing. Assign only real members.
4. **A feature that spans layers is one unit with one owner**, chosen by where most of the effort sits. Linked issues already split across layers go to the same owner, so a contract and its consumer move together. Genuinely balanced: ask.
5. **Propose the whole table** — repository · # · title · leaning · assignee · why — and wait for the lead's OK.
6. Apply assignments and correct area and priority. **Leave status in the first column**: the assignee moves it when they start.
7. Report the final table.

## Records

The tracker is the record. When a durable fact changes — a new field or option, a new repository, a new teammate, a new script — update tracker-surface or repo-conventions, or say "no durable change".
