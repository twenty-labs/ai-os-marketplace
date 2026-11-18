#!/usr/bin/env node
// asc-review-submit: submit an App Store version for review together with its pending subscriptions.
//
// `asc workflow run submit` creates a new review submission holding only the app version. That is enough for a plain
// update, but not for an app's first auto-renewable subscriptions: Apple reviews them only inside the same submission
// as a new app version, and only together with their subscription group version while the group has no approved
// version. A draft submission started in App Store Connect is not picked up either. This recipe:
//   1. finds the version on the platform (it must be staged: build attached);
//   2. collects every subscription group version and subscription version in PREPARE_FOR_SUBMISSION or READY_TO_SUBMIT;
//   3. with none pending and no open draft, hands over to `asc workflow run submit` (the normal path);
//   4. otherwise reuses the open draft (READY_FOR_REVIEW) or creates a submission, adds the version and every pending
//      item (`--if-exists skip`), and submits it.
// Dry run by default. A real run needs --apply and --confirm-app <app id>, naming the app the config resolves to.
//
// Usage: node asc-review-submit.mjs --version 1.4.0 --build 21 [--platform IOS] [--config store-console.json]
//        [--apply --confirm-app <app id>]
import { parseArgs } from "node:util";
import { appIdFromWorkflow, asc, banner, die, items, loadConfig, run } from "./lib/common.mjs";

const PENDING = new Set(["PREPARE_FOR_SUBMISSION", "READY_TO_SUBMIT"]);
const SUBMITTED = new Set(["WAITING_FOR_REVIEW", "IN_REVIEW"]);

const { values: o } = parseArgs({
  options: {
    version: { type: "string" },
    build: { type: "string" },
    platform: { type: "string", default: "IOS" },
    config: { type: "string" },
    apply: { type: "boolean", default: false },
    "confirm-app": { type: "string" },
  },
});
if (!o.version || !o.build) die("--version and --build are required");

const cwd = process.cwd();
const cfg = loadConfig(cwd, o.config);
const app = cfg.appStore.appId ?? appIdFromWorkflow(cwd);
if (!app) die("no App Store app id: set appStore.appId in store-console.json or generate .asc/workflow.json");
if (o.apply && o["confirm-app"] !== String(app)) {
  die(`refusing to submit without confirmation: add --confirm-app ${app} to submit app ${app}${cfg.appStore.bundleId ? ` (${cfg.appStore.bundleId})` : ""} for review`);
}

banner(o.apply, `submit for review: app ${app}${cfg.appStore.bundleId ? ` (${cfg.appStore.bundleId})` : ""}, platform ${o.platform}, version ${o.version} build ${o.build}`);

const version = items(asc("versions", "list", "--app", app, "--platform", o.platform, "--version", o.version)).find(
  (v) => v.attributes?.versionString === o.version,
);
if (!version) die(`no App Store version ${o.version} on ${o.platform}: stage it first (asc workflow run stage)`);

const groupFilter = cfg.appStore.subscriptionGroups;
const pending = [];
for (const group of items(asc("subscriptions", "groups", "list", "--app", app))) {
  const name = group.attributes?.referenceName ?? group.id;
  if (Array.isArray(groupFilter) && groupFilter.length && !groupFilter.includes(name) && !groupFilter.includes(group.id)) continue;
  for (const gv of items(asc("subscriptions", "groups", "versions", "list", "--group-id", group.id))) {
    if (PENDING.has(gv.attributes?.state)) pending.push({ type: "subscriptionGroupVersions", id: gv.id, label: `group ${name}` });
  }
  for (const sub of items(asc("subscriptions", "list", "--group-id", group.id))) {
    const pid = sub.attributes?.productId ?? sub.id;
    for (const sv of items(asc("subscriptions", "versions", "list", "--subscription-id", sub.id))) {
      if (PENDING.has(sv.attributes?.state)) pending.push({ type: "subscriptionVersions", id: sv.id, label: `subscription ${pid}` });
    }
  }
}

const draft = items(asc("review", "submissions-list", "--app", app)).find(
  (s) => s.attributes?.state === "READY_FOR_REVIEW" && [undefined, null, o.platform].includes(s.attributes?.platform),
)?.id;

if (!pending.length && !draft) {
  console.log("No pending in-app items and no open draft: handing over to `asc workflow run submit`.");
  run("asc", ["workflow", "run", ...(o.apply ? [] : ["--dry-run"]), "submit", `VERSION:${o.version}`, `BUILD_NUMBER:${o.build}`], { capture: false });
  process.exit(0);
}

console.log(`Version ${o.version} (${version.id}) with ${pending.length} pending in-app item(s):`);
for (const p of pending) console.log(`  - ${p.label} (${p.id})`);
console.log(`Submission: ${draft ? `reuse draft ${draft}` : "create a new one"}`);
if (!o.apply) {
  console.log("[dry run] nothing added or submitted.");
  process.exit(0);
}

const submission = draft ?? items(asc("review", "submissions-create", "--app", app, "--platform", o.platform))[0]?.id;
if (!submission) die("asc did not return the new review submission's id");
for (const it of [{ type: "appStoreVersions", id: version.id }, ...pending]) {
  asc("review", "items-add", "--submission", submission, "--item-type", it.type, "--item-id", it.id, "--if-exists", "skip");
}
const state = items(asc("review", "submissions-submit", "--id", submission, "--confirm"))[0]?.attributes?.state;
console.log(`Submitted ${submission}: ${state}`);
if (!SUBMITTED.has(state)) die(`unexpected submission state ${state}; check App Store Connect before anything else`);
