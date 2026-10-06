---
name: release
description: Use when cutting a release — confirming what ships, preflight, building store binaries, store copy, opt-in submit for review, tagging every repository at the shipped commit — or an over-the-air patch, or answering where a release stands. The go-live step after store approval is app-live. NOT for continuous deploys with no cut, or deciding what goes into a release (product-owner).
---

# Release

A release is cut from a known commit, built once, tagged where it shipped and described honestly. This skill is the method. The mechanics are the project's own commands, recorded in `.ai-os/knowledge/release-surface.md` — what is built and tagged, preflight, build, submit, tag and patch commands, version spaces, store-copy paths, the version gate, lessons from past cuts — with app records and the over-the-air policy in `store-review.md` and the merge method in `repo-conventions.md`. Read them first. If release-surface is unfilled, read the release scripts and the last release's tags and notes, ask the owner for the rest, and fill it before cutting.

**Call the project's tooling; never reimplement a step it already performs.** A step with no tooling is done by hand and reported as such.

A status question ("where is the release?", "was it submitted?") is read-only: report and stop.

## 1. Preconditions

- What ships is agreed: the release's items are done and a changelog source exists.
- Every repository involved is on its default branch, current and clean. Dirty: stop.
- **Preflight every target and stop if any is red.** A real preflight checks what otherwise fails after a build has run: store upload credentials, the over-the-air tool's login and app access, signing. One that only checks local tools is not a preflight.

## 2. Confirm the inputs in one block

- **Version** — when the project has two version spaces (a release train and the app's marketing version and build), say which one you mean and never derive one from the other.
- **Repositories to tag** — default: every one release-surface lists.
- **Targets** — which stores or platforms build. A backend-only release skips the build.
- **Submit for review** — opt-in for this release only; default no. Silence is no.

## 3. Build

- Build from a **throwaway worktree at the default branch's HEAD**, never from the working checkout: builds dirty the tree, and uncommitted work would look shipped while missing from the binary. Refuse on a dirty tree.
- **One build number for every store** in a release.
- Register the build with the over-the-air tool when the project uses one, so later patches can target it.
- Failure: revert the build-number bump, stop and report.
- Success: the bump lands on the default branch through a pull request. **Open it, then ask before merging — no merge without a yes.** Being mid-release is not consent. Merge with the method repo-conventions records.
- When patches are matched by build number, never change the build number in the store console after upload.

## 4. Store copy — part of the release, not a follow-up

Rewrite both for **every store build**, in every shipped locale, at the paths release-surface names:

- **What's New** — benefit-led, no jargon, no commit hashes.
- **Promotional text** (App Store) — one sentence leading with this build's headline, at most 170 characters per locale. It can change without review, but never stays on the previous release's pitch.

No copy supplied: draft both from the merged pull requests and get approval. Shipping the previous release's copy is a mislabelled build.

## 5. Submit for review — only when opted in

Before enabling it, a human confirms what no script can check: the store's privacy answers match the SDKs this build ships; the reviewer account still signs in on this build; QA passed on a real device (`app-store-compliance` audits the rest). Configure **manual release after approval** — auto-submit is never auto-release. A submit minutes after upload fails while the build is still processing; wait until it is processed and re-run — nothing needs cleaning up.

## 6. Tag

Per repository, at the commit that produced the binaries (after the build-number pull request merged): an annotated tag, pushed, with release notes generated from pull requests merged since the previous tag. One version across all repositories of a release, so compare links line up. **Never move or overwrite an existing tag** — stop and ask.

## 7. Version gate at the installable moment

If the project has an in-app update gate, point it at the new build only once the build can actually be installed (beta ready to test, or the store version live) — never at upload. A routine release is silent or notifies; forcing an update is a separate decision (see app-live). The store-live edit belongs to app-live.

## 8. Advance the markers

Move the active-release marker to the next version where release-surface says it lives, and make sure the tracker has that release as an option.

## 9. Report

Build numbers uploaded · review status (not submitted: what a human must still do; submitted: approval still needs the manual release press) · gate status · per repository the release URL and the compare URL · **everything still pending**. While a store version is not live, name app-live as the remaining step. A report that omits a pending step reads as done.

## Over-the-air patches

Only what the over-the-air tool can replace ships as a patch. Asset, native, permission or SDK changes and new user-facing features need a store build (store-review's policy; `app-store-compliance` decides unclear cases). A patch is built from the release's tag with the same environment as the release, goes to a staging track, is verified on a physical device, then promoted. Patches never move the version gate.
