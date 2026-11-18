// Shared helpers for the store-console recipes. Node >= 20, no dependencies.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export const CONFIG_FILE = "store-console.json";

/** Exit codes: 0 done, 1 refused or failed, 2 a human must act first (log in, 2FA). */
export const NEEDS_HUMAN = 2;

export function die(message, code = 1) {
  process.stderr.write(`store-console: ${message}\n`);
  process.exit(code);
}

/** The project's store-console.json (or --config). Missing file: an empty config; recipes say which key they need. */
export function loadConfig(cwd, path) {
  const file = resolve(cwd, path ?? CONFIG_FILE);
  if (!existsSync(file)) {
    if (path) die(`config ${path} not found`);
    return { appStore: {}, play: {} };
  }
  let cfg;
  try {
    cfg = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    die(`${path ?? CONFIG_FILE} is not valid JSON: ${e.message}`);
  }
  return { appStore: {}, play: {}, ...cfg };
}

export function need(value, key) {
  if (value === undefined || value === null || value === "") die(`${CONFIG_FILE}: \`${key}\` is not set`);
  return value;
}

/** APP_ID from the generated `.asc/workflow.json` (JSON with // comment lines). */
export function appIdFromWorkflow(cwd) {
  const file = join(cwd, ".asc/workflow.json");
  if (!existsSync(file)) return undefined;
  return /"APP_ID"\s*:\s*"(\d+)"/.exec(readFileSync(file, "utf8"))?.[1];
}

/** One line that says what a run touches and whether it writes. Printed before anything else. */
export function banner(apply, target) {
  console.log(`${apply ? "APPLY" : "DRY RUN"}: ${target}`);
  if (!apply) console.log("Nothing is written. Re-run with --apply and the confirm flag to make the change.");
}

/** A run log folder for screenshots and read-outs: <runLogDir>/<timestamp>-<recipe>/. */
export function runLog(cwd, cfg, recipe) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dir = resolve(cwd, cfg.runLogDir ?? ".store-console/runs", `${stamp}-${recipe}`);
  mkdirSync(dir, { recursive: true });
  return { dir, write: (name, text) => writeFileSync(join(dir, name), text) };
}

const AUTH_FAILURE = /\b401\b|unauthori[sz]ed|not authenticated|expired|invalid[_ ]grant|login required|session/i;

/** Runs a command; on failure exits, and asks for a human when the failure reads as an expired login. Never retries. */
export function run(cmd, args, { capture = true } = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit" });
  if (r.error) die(`${cmd} could not start: ${r.error.message}`);
  if (r.status !== 0) {
    const text = `${r.stderr ?? ""}${r.stdout ?? ""}`.trim();
    if (AUTH_FAILURE.test(text)) {
      die(`${cmd} ${args.slice(0, 3).join(" ")}: the session or credentials were rejected:\n${text}\nAsk the human to log in again (2FA is theirs), then re-run. Not retrying.`, NEEDS_HUMAN);
    }
    die(`${cmd} ${args.join(" ")} failed:\n${text}`);
  }
  return r.stdout ?? "";
}

/** `asc ... --output json`: the first JSON document (asc may print more after it). */
export function asc(...args) {
  const out = run("asc", [...args, "--output", "json"]).trim();
  if (!out) return {};
  try {
    return firstJson(out);
  } catch {
    die(`asc ${args.join(" ")} printed no JSON:\n${out.slice(0, 400)}`);
  }
}

/** The first complete JSON value at the start of a string. */
function firstJson(text) {
  let depth = 0;
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === "\\") i++;
      else if (ch === '"') inString = false;
    } else if (ch === '"') inString = true;
    else if (ch === "{" || ch === "[") depth++;
    else if ((ch === "}" || ch === "]") && --depth === 0) return JSON.parse(text.slice(0, i + 1));
  }
  return JSON.parse(text);
}

/** `data` of a JSON:API document as a list. */
export function items(doc) {
  const data = doc?.data ?? [];
  return Array.isArray(data) ? data : [data];
}
