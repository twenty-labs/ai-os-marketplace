---
name: store-console
description: Use when an App Store Connect or Play Console chore comes up — submitting a version together with first-time subscriptions, attaching subscriptions or their group to a review, the Play Data safety form, reading Play Console state (managed publishing, changes not sent for review, target audience), or anything that looks like it needs the console in a browser. Checks the asc and Google Play APIs first and drives a browser only where no API exists. NOT for cutting or uploading a build (release-cut), App Store listing copy (aso-ops) or policy review of the app (app-store-compliance).
---

# Store console

Most console chores have an API. Use it; a browser is the last resort, and in a browser this skill only reads and
saves forms. **Submit for review, Publish and Release are the owner's**, in the console or through a confirmed API
recipe below.

## Rules every recipe keeps

- **API first.** Before any browser step, find the API path in [references/api-first.md](references/api-first.md). Use
  the browser only for a row marked "browser".
- **Dry run by default.** Every write prints its target (app, account, track or package) and the exact change first,
  and writes only with `--apply` plus a confirm flag that names the target (`--confirm-app <id>`,
  `--confirm-package <package>`). Show the dry run to the owner and wait for a yes before adding them.
- **No passwords.** Never read, type or store one. API recipes use the project's asc profile and the Play
  service-account file that `store-console.json` names (never print its path or contents). Browser recipes use a Chrome
  profile in `~/.store-console/<account>` where the human logs in once, 2FA included.
- **A rejected session stops the run** (exit code 2). Ask the human to log in again; never loop or retry.
- **Browser recipes never click Submit for review, Send for review, Publish or Release.** Saving a form is allowed;
  sending it is not.
- Every browser step leaves a screenshot and the page text in the run log folder (`.store-console/runs/`, git-ignored).

## Set up once per project

1. Write `store-console.json` at the repository root; the keys are in [references/config.md](references/config.md).
   Add `.store-console/` to `.gitignore`. The service-account file stays git-ignored.
2. API recipes need `asc` (authenticated with the project's profile) and Node 20 or later. The browser recipe also
   needs Playwright in the project (`pnpm add -D playwright`) and Chrome.
3. Browser login, once per account: `node <skill>/scripts/play-console-read.mjs --login --account <account>`, and the
   human signs in.

`<skill>` is this skill's directory. Run the scripts from the repository root.

## Recipes

| Recipe | Path | Writes |
| --- | --- | --- |
| `asc-review-submit.mjs` | asc API | review submission (with `--apply --confirm-app`) |
| `play-data-safety.mjs` | Android Publisher API; live export from the console | Data safety form (with `--apply --confirm-package`) |
| `play-console-read.mjs` | Playwright, read-only | nothing |

### asc-review-submit — a version plus its pending subscriptions

Use instead of `asc workflow run submit` when the release carries subscriptions waiting for review (first
subscriptions, a new group, a changed subscription), or when a draft submission was started in App Store Connect.

1. `node <skill>/scripts/asc-review-submit.mjs --version <x.y.z> --build <n>` — dry run. It lists the pending group
   and subscription versions and whether it reuses the open draft or creates a submission. With nothing pending and no
   draft, it hands over to `asc workflow run --dry-run submit`.
2. Show the plan; on the owner's yes, re-run with `--apply --confirm-app <app id>`.
3. Done when it prints `Submitted <id>: WAITING_FOR_REVIEW` (or `IN_REVIEW`).

A first subscription is accepted only with its group version in the same submission while the group has no
approved version; the recipe adds both. The version must be staged first (build attached).

### play-data-safety — the Data safety form from a CSV in the repository

The CSV in the repository (`play.dataSafetyCsv`) is the source of truth.

1. `node <skill>/scripts/play-data-safety.mjs check` — known import blockers. Fix them in the CSV.
2. Get the live state: Play Console > App content > Data safety > Export to CSV (the API cannot read the form). Then
   `play-data-safety.mjs diff --live <export.csv>` prints the change table, live to repository.
3. `play-data-safety.mjs upload --live <export.csv>` — dry run with target, blockers and the table. On the owner's
   yes, add `--apply --confirm-package <package>`.
4. Done when the upload prints `Uploaded`; then read `publishing` (next recipe). If the change waits there, sending
   it for review is the owner's.

If the API upload is refused for this app, fall back to the console by hand: Import from CSV, Preview, Save. Never
send for review.

### play-console-read — console state with no API

`node <skill>/scripts/play-console-read.mjs <publishing|target-audience|data-safety|all>` opens each page in the
logged-in profile, saves the text and a screenshot, and prints a short read-out: managed publishing on or off, changes
not sent for review, target age groups, Data safety status. `--list` prints the URLs without opening a browser. A
read-out that says "not found on the page" means read the saved text; the console's wording moved.

## Gotchas

Read [references/gotchas.md](references/gotchas.md) before the first run in a session: web state and API state
disagree, sessions expire overnight, Play account indexes in URLs, and what "Save" means on an app-content form.

## Report

End with: what ran (dry run or applied), the target, the change, where the run log is, and what is left for the
owner (send for review, release).
