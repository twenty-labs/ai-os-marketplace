---
name: app-live
description: Use when a store build has been approved, released or rolled out and what tracks the live version must catch up — the release record, the release tag, the branch that mirrors what users run, the in-app update gate — or to check whether the live store build and those records agree. Runs after release, often days later. NOT for cutting or uploading the build (release).
---

# App is live

`release` uploads a build. This skill runs when the store actually serves it: approved and released, or a staged rollout at 100%. The days between those moments are where the last production edits get forgotten — and an update gate left behind means installed apps never learn the new build exists.

`.ai-os/knowledge/release-surface.md` lists which of these apply here and the command for each:

| Target | Why it moves now and not at the cut |
| --- | --- |
| The release record (for example a release note: live date per platform) | Only now do users have the build. |
| The release tag, pushed | It is the baseline for over-the-air patches. |
| A branch that mirrors what users run ← merge the **release tag** | It mirrors the stores, not the trunk. |
| The in-app update gate (latest build, mode, changelog, store link) | The only way installed apps learn the build exists. |
| The project's other post-release commands | Whatever else this project moves at go-live. |

**Use the project's go-live command when release-surface names one** — it is where the guards live; never hand-edit what it owns. Without one, apply the rules below by hand and print every record before and after.

## Report first, always

Read-only, no confirmation needed:

- Was the release ever cut — is its tag on every repository?
- What each storefront the product sells in actually serves, from the public lookup; consoles lag.
- The gate as it stands, and **which environment host** it lives on.
- How far the mirror branch is behind the tag, and how far the trunk is ahead of it.
- The exact change that would be written.

A status question is answered with the report and stops. Applying needs an instruction from the owner in the same turn.

## Apply

- **One platform per run** — stores go live at different times; re-run for the other one later.
- Dry run first whenever unsure: the gate is production and the only undo is writing the old values back.
- Show the host before every production write. After it, re-read the live endpoint and report what an installed app now receives, not what was sent.
- Merge the **tag**, never the trunk, into the mirror branch — the trunk is ahead of the shipped build. The mirror moves only when every platform is live.

## Refuse

| Refusal | Why |
| --- | --- |
| The latest or minimum build would go backwards | Almost always a mistyped version. |
| A minimum build above the build going live | Blocks everyone, with nothing to update to. |
| Forcing while any storefront still serves the old version | Strands users. |
| Forcing without the owner's explicit word that phased release is off or the rollout is at 100% | No script can check it; never assume it on their behalf. |
| Notify or force with a changelog not written for this version | The last release's notes on this one is a mislabelled build. |
| A store link that is still a beta link or a placeholder | The update button leads nowhere. |
| The release tag is missing | Going live ahead of the cut — use release. |
| Creating the first gate record for a platform | Deliberate; apps should fail open without one. |

## Forcing is a separate decision

A forced update puts a blocking screen in front of every user below the gate, immediately. It is never part of a routine go-live, and needs all three: live in every storefront; phased release off, confirmed by the owner; the real store link. Phased release plus force is the worst outcome available: the store offers the update to a few percent while everyone else is blocked with nothing to download.

## Boundaries

- Over-the-air patches never touch the gate; it describes store builds only.
- Two version spaces (release train and marketing version) — say which one you mean; the owner usually means what the store shows.
- Re-running converges: identical values write identical values.

## Then

Report what is still open: the other platform, the active-release marker (should already point at the next release), and tracker cards still in review for work this build shipped.
