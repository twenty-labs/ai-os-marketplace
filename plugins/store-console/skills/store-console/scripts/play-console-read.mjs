#!/usr/bin/env node
// play-console-read: read Play Console pages that have no API, in a real Chrome window. Read-only: it navigates and
// reads text; it never clicks, types or saves. Each page's text and a full-page screenshot go to the run log folder.
//
//   node play-console-read.mjs <page...|all> [--account <name>] [--config <file>] [--list] [--headless]
//   node play-console-read.mjs --login [--account <name>]
//
// Pages: publishing (managed publishing on/off, changes not sent for review), target-audience (Families / target
// audience and content), data-safety (the Data safety summary).
// The browser profile lives in ~/.store-console/<account>; the human logs in there once with --login (2FA included).
// URLs use the developer id, never a /u/<n>/ account index, which depends on the browser's signed-in accounts.
// Playwright resolves from the project (pnpm add -D playwright) or from STORE_CONSOLE_NODE_MODULES.
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { die, loadConfig, need, NEEDS_HUMAN, runLog } from "./lib/common.mjs";

/** Default paths under /console/developers/<developer>/app/<app>/; override per page with play.consolePaths. */
const PAGES = {
  publishing: "publishing",
  "target-audience": "app-content/target-audience-content",
  "data-safety": "app-content/data-privacy-security",
};

/** Read-outs taken from the page text; the full text is always saved beside them. */
const SIGNALS = {
  publishing: [
    ["managed publishing", /managed publishing is (on|off)/i],
    ["changes not sent for review", /(changes? (?:not yet sent|ready to send) for review|send \d+ changes? for review)/i],
    ["changes in review", /(changes? in review)/i],
  ],
  "target-audience": [["target age groups", /target age(?: groups?)?[^\n]*\n([^\n]+)/i]],
  "data-safety": [["status", /(not started|in progress|completed|action required)/i]],
};

const { values: o, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    account: { type: "string" },
    config: { type: "string" },
    list: { type: "boolean", default: false },
    login: { type: "boolean", default: false },
    headless: { type: "boolean", default: false },
  },
});

const cwd = process.cwd();
const cfg = loadConfig(cwd, o.config);
const pages = positionals.includes("all") ? Object.keys(PAGES) : positionals;
for (const p of pages) if (!(p in PAGES)) die(`unknown page "${p}"; pages: ${Object.keys(PAGES).join(", ")}, all`);
if (!pages.length && !o.login) die(`name a page (${Object.keys(PAGES).join(", ")}, all) or --login`);

const account = o.account ?? need(cfg.play.account, "play.account");
if (!/^[\w.-]+$/.test(account)) die("the account name may hold letters, digits, dot, dash and underscore only");
const profile = join(homedir(), ".store-console", account);
const developer = need(cfg.play.developerId, "play.developerId");
const appId = need(cfg.play.appId, "play.appId");
const url = (page) => `https://play.google.com/console/developers/${developer}/app/${appId}/${(cfg.play.consolePaths ?? {})[page] ?? PAGES[page]}`;

if (o.list) {
  console.log(`Browser profile: ~/.store-console/${account}`);
  for (const p of pages) console.log(`${p}: ${url(p)}`);
  process.exit(0);
}

async function playwright() {
  const roots = [cwd, process.env.STORE_CONSOLE_NODE_MODULES].filter(Boolean);
  for (const root of roots) {
    try {
      const resolved = createRequire(join(root, "package.json")).resolve("playwright");
      return await import(pathToFileURL(resolved).href);
    } catch {
      // try the next root
    }
  }
  die("Playwright is not installed: run `pnpm add -D playwright` in the project (or set STORE_CONSOLE_NODE_MODULES to a node_modules that has it). Chrome itself must be installed.");
}

const { chromium } = await playwright();
const context = await chromium.launchPersistentContext(profile, { channel: "chrome", headless: o.headless && !o.login, viewport: { width: 1440, height: 1000 } });
const page = context.pages()[0] ?? (await context.newPage());
const loggedOut = () => new URL(page.url()).hostname.startsWith("accounts.google.");

if (o.login) {
  await page.goto(`https://play.google.com/console/developers/${developer}`);
  console.log(`Log in to Play Console as ${account} in the opened window (2FA is yours), then close the window.`);
  await new Promise((done) => context.on("close", done));
  process.exit(0);
}

const log = runLog(cwd, cfg, "play-console-read");
const report = [];
let needsLogin = false;
try {
  for (const p of pages) {
    await page.goto(url(p), { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
    await page.screenshot({ path: join(log.dir, `${p}.png`), fullPage: true });
    if (loggedOut()) {
      needsLogin = true;
      break;
    }
    const main = page.getByRole("main");
    const text = (await main.count()) ? await main.first().innerText() : await page.locator("body").innerText();
    log.write(`${p}.txt`, text);
    report.push(`## ${p}`, url(p));
    for (const [name, re] of SIGNALS[p]) report.push(`- ${name}: ${re.exec(text)?.[1] ?? "not found on the page (read the saved text)"}`);
    report.push("");
  }
} finally {
  await context.close();
}
if (needsLogin) {
  die(`not logged in to Play Console in ~/.store-console/${account}. Ask the human to run play-console-read.mjs --login --account ${account}, then re-run. Not retrying.`, NEEDS_HUMAN);
}
log.write("report.md", report.join("\n"));
console.log(report.join("\n"));
console.log(`Run log: ${log.dir}`);
