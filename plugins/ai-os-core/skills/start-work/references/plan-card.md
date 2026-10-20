# Plan card (grilling format)

Numbered items. Each item states a recommendation; the user answers by number, or "yes" to accept every item.
Keep it short: one table, at most about eight items.

Formatting rules (the terminal draws a table only as a top-level block):
- Never put a table inside a list item. A table starts at column 0, with a blank line before and after it.
- Write each numbered item as a bold label on its own line (`**3. Stages**`), not as markdown ordered-list syntax,
  so the numbering survives a table between items.

Table rules (the terminal wraps wide tables, so keep them narrow):
- At most 6 short columns: `# | Stage | Runs | Model · effort | Agents | Deep`. Each cell is one or two words (`main`,
  `subagent`, `subagent+wt`, `sonnet · medium`, `1/ticket`); no prose and no parentheses in cells.
- Target total width of 80 characters or less.
- Skill names and explanations go in a numbered note list under the table, keyed by the stage number
  ("1. research: research-and-reuse, compare a swipe-card package with Flutter's Dismissible/Draggable").
- If the table would still exceed about 80 characters, use a vertical list instead, one line per stage:
  `1 research · subagent · sonnet·medium · 1 agent`.
- Keep the questions (`❓ Qn` / `➡️`) after the notes.

```text
Plan card: <one-line task summary>


**1. Classification**
<changeType> · <size> · <risk> (given <risk before floors>; floors: <policy> on <paths>, or none).
Recommended: accept.

**2. Workflow**
<workflow> (<why, one clause>). Recommended: <workflow>.
**3. Stages**

| # | Stage    | Runs        | Model · effort  | Agents   | Deep |
|---|----------|-------------|-----------------|----------|------|
| 1 | plan     | main        | opus · xhigh    | 0        | 0    |
| 2 | research | subagent    | sonnet · medium | 1/ticket | 0    |
| 3 | build    | subagent+wt | sonnet · medium | 1/ticket | 0    |

Notes (skill names and explanations live here, keyed by the stage number):
1. plan: writing-plans, break the task into tickets
2. research: research-and-reuse, compare a swipe-card package with Flutter's Dismissible/Draggable
3. build: subagent-driven-development, one worktree per ticket

Skipped: <stage> (<rule>). Gates: GATE 1 after <stage>, GATE 2 after <stage>.
After planning, the table is per ticket instead of per stage.
Recommended: accept. A stage or ticket with a suggestion keeps the capped value here and gets its own ❓ question
below the card (see step 6 of the router).

**4. Execution**
<sequential | parallel (<n> independent tickets)>. Recommended: <mode>.

**5. Hook profile**
<minimal | standard | strict>; stage hooks not active: <list, or none>.

**6. Model**
main-session stages recommend <model>; you are on <current>. Recommended: /model <model> before <stage>.

**7. Budget**
<n> deep subagents, max <m>; downgraded: <ticket> deep → standard, or none.

**8. Prerequisites**
<slot>: <status>, or all met. Verdict: GO | NO GO (risk high or critical only: fill <slot> now, or run a spike).
Risk low or medium with missing slots: GO, and stage 1 of the table is `knowledge` (draft <slots> as `status: draft`,
owner reviews); the card is shown in the same turn.

Reply "yes" to accept all, or answer by number.
```

Add an estimate from usage history (`ai-os usage`) for this workflow and size when one exists. For a trivial task,
skip the card: step 5 of the router prints one line instead.
