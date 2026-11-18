// Play Data safety CSV: parse, compare with a live export, and check for import blockers.
// Columns of the Play Console export: Question ID, Response ID, Response value, Answer requirement, Human-friendly label.

/** RFC 4180 rows: quoted fields may hold commas, quotes ("") and newlines. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const s = text.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (quoted) {
      if (ch === '"' && s[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && s[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim()));
}

/** Answers keyed by "question|response". Header row optional; columns found by name, else by position. */
export function answers(text) {
  const rows = parseCsv(text);
  const head = rows[0]?.map((h) => h.toLowerCase()) ?? [];
  const hasHeader = head.some((h) => h.includes("question id"));
  const col = (name, fallback) => {
    const i = head.findIndex((h) => h.includes(name));
    return hasHeader && i >= 0 ? i : fallback;
  };
  const q = col("question id", 0);
  const r = col("response id", 1);
  const v = col("response value", 2);
  const l = col("human-friendly", 4);
  const out = new Map();
  for (const row of hasHeader ? rows.slice(1) : rows) {
    const question = (row[q] ?? "").trim();
    if (!question) continue;
    const response = (row[r] ?? "").trim();
    out.set(`${question}|${response}`, { question, response, value: (row[v] ?? "").trim(), label: (row[l] ?? "").trim() || question });
  }
  return out;
}

/** Rows whose value differs (blank and missing are the same: unanswered). */
export function diffAnswers(live, repo) {
  const keys = [...new Set([...live.keys(), ...repo.keys()])].sort();
  const changes = [];
  for (const k of keys) {
    const a = live.get(k)?.value ?? "";
    const b = repo.get(k)?.value ?? "";
    if (a === b) continue;
    const row = repo.get(k) ?? live.get(k);
    changes.push({ label: row.label, question: row.question, response: row.response, live: a, repo: b });
  }
  return changes;
}

const cell = (s) => (s === "" ? "(unset)" : s.replace(/\|/g, "\\|").replace(/\s+/g, " "));

export function changeTable(changes) {
  if (!changes.length) return "No change: the repository CSV matches the live export.";
  return [
    "| Question | Response | Live | Repository |",
    "| --- | --- | --- | --- |",
    ...changes.map((c) => `| ${cell(c.label)} | ${cell(c.response || c.question)} | ${cell(c.live)} | ${cell(c.repo)} |`),
    "",
    `${changes.length} change(s).`,
  ].join("\n");
}

/** Known import blockers. Each problem is one line. */
export function problems(repo) {
  const out = [];
  const rows = [...repo.values()];
  const accountCreation = rows.some((r) => /ACCOUNT_CREATION/.test(r.question) && r.value.toLowerCase() === "true");
  const outside = rows.find((r) => r.question === "PSL_HAS_OUTSIDE_APP_ACCOUNTS" && r.value !== "");
  if (accountCreation && outside) {
    out.push("PSL_HAS_OUTSIDE_APP_ACCOUNTS must be blank when an account creation method is declared; Play rejects the import otherwise");
  }
  return out;
}
