# Ads readiness report template

The whole chat reply. Write it in the owner's language; keep identifiers, commands and event names as they are. One line per finding. No paragraphs.

```markdown
## Ads readiness · <app> · <platform> · <market> · <YYYY-MM-DD>

**Verdict: NOT READY | READY FOR TEST | READY TO SCALE.** <one sentence: the single reason>

### Blockers: fix before spending
| # | Area | Problem · evidence | Next action · who |
|---|---|---|---|
| 1 | <area> | <what is wrong> · <file:line or system, value, date> | <exact click path or command> · owner/agent |

### Before scale
| # | Area | Problem · evidence | Next action · who |
|---|---|---|---|

### Passed
- <area>: <the evidence it passed, one line>

### Not verified
- <what> · <why it could not be read> · <cheapest way to verify>

### Next actions
1. <first thing, who, how long>
2. ...
```

Rules:
- At most 5 blockers and 5 before-scale rows. More than that belongs to a conversion audit.
- The verdict sentence names the one thing that decides it, not a summary.
- Every row has evidence and a next action. A row without a next action is not a finding.
- "Passed" is one line per area, so the owner sees what was checked. Areas with nothing to report still appear.
- Out of scope (creatives, budget, ad-account funding) does not appear, unless it breaks measurement.
- After the report: at most three questions in the form `❓ **Qn** – <title>: <body>` followed by `➡️ <recommended answer>`.
