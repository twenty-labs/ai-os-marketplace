#!/usr/bin/env node
// play-data-safety: the Data safety form as a CSV in the app repository (the source of truth), compared with the live
// form and uploaded through the Android Publisher API (applications.dataSafety).
//
//   check                                   import blockers in the repository CSV (read-only)
//   diff   --live <export.csv>              change table: live export -> repository CSV (read-only)
//   upload [--live <export.csv>]            dry run: target, blockers and the change table
//   upload --apply --confirm-package <pkg>  writes the CSV to Play. Then read Publishing overview
//                                           (play-console-read.mjs publishing): when the change waits there,
//                                           sending it for review stays with the owner.
//
// The live export comes from Play Console (App content > Data safety > Export to CSV); the API has no read for it.
// Options: --csv <path> (default play.dataSafetyCsv), --config <file>.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { banner, die, loadConfig, need } from "./lib/common.mjs";
import { answers, changeTable, diffAnswers, problems } from "./lib/data-safety.mjs";
import { accessToken, publisher } from "./lib/google.mjs";

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    csv: { type: "string" },
    live: { type: "string" },
    config: { type: "string" },
    apply: { type: "boolean", default: false },
    "confirm-package": { type: "string" },
  },
});
const command = positionals[0];
if (!["check", "diff", "upload"].includes(command)) die("usage: play-data-safety.mjs check | diff --live <export.csv> | upload [--apply --confirm-package <pkg>]");

const cwd = process.cwd();
const cfg = loadConfig(cwd, o.config);
const csvPath = o.csv ?? need(cfg.play.dataSafetyCsv, "play.dataSafetyCsv");
const read = (p) => {
  try {
    return readFileSync(resolve(cwd, p), "utf8");
  } catch {
    die(`cannot read ${p}`);
  }
};
const csvText = read(csvPath);
const repo = answers(csvText);
const blockers = problems(repo);

if (command === "check") {
  for (const b of blockers) console.log(`problem: ${b}`);
  console.log(blockers.length ? `${csvPath}: ${blockers.length} problem(s)` : `${csvPath}: ${repo.size} answer(s), no known import blocker`);
  process.exit(blockers.length ? 1 : 0);
}

if (command === "diff") {
  if (!o.live) die("diff needs --live <export.csv> (Play Console > App content > Data safety > Export to CSV)");
  console.log(changeTable(diffAnswers(answers(read(o.live)), repo)));
  process.exit(0);
}

// upload
const pkg = need(cfg.play.packageName, "play.packageName");
if (o.apply && o["confirm-package"] !== pkg) die(`refusing to write the Data safety form without confirmation: add --confirm-package ${pkg}`);
banner(o.apply, `Data safety form of package ${pkg} from ${csvPath} (service account from store-console.json)`);
if (o.live) console.log(changeTable(diffAnswers(answers(read(o.live)), repo)));
else console.log("No --live export given: the change against the live form is not shown.");
if (blockers.length) {
  for (const b of blockers) console.log(`problem: ${b}`);
  die("fix the problems above before uploading");
}
if (!o.apply) process.exit(0);

const token = await accessToken(resolve(cwd, need(cfg.play.serviceAccountJson, "play.serviceAccountJson")));
await publisher(token, "POST", `applications/${encodeURIComponent(pkg)}/dataSafety`, { safetyLabels: csvText });
console.log(`Uploaded ${repo.size} answer(s) to ${pkg}. Next: read Publishing overview (play-console-read.mjs publishing); if the change waits there, sending it for review is the owner's.`);
