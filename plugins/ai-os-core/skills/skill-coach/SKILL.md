---
name: skill-coach
description: Use when an agent skill or role got something wrong and the lesson should stick — it quoted a stale fact, used a wrong method, skipped its own rule, or routed badly — and the owner wants it fixed so it does not recur ("this skill is wrong", "update the skill", "learn from this", "don't do that again"), or when a work session surfaced a fact a knowledge file should carry. Classifies the failure, fixes it at the right layer (project knowledge, a project skill, or the shared registry upstream) with the smallest change, and logs the lesson. NOT for writing a brand-new skill, a one-off mistake that will not recur, or fixing the product work the skill was doing.
---

# Skill coach

Skills and roles are a team; mistakes are tuition, and the tuition is wasted unless the lesson lands in the right place. **Every edit traces to an observed failure, lands at the right layer, and is the smallest change that prevents recurrence.** A skill that grows a rule per incident dies of bloat; a skill that never learns repeats itself.

## Where things live in an AI OS repository

| Layer | Holds | Owned by | How it changes |
| --- | --- | --- | --- |
| Knowledge | Dated facts about this product, market, data, release surface — `.ai-os/knowledge/<slot>.md` | The project | Edit the file; set `status: draft` so a human reviews it and sets `valid` |
| Project skill or role | Method that only fits this repository — `.ai-os/skills/<id>/`, `.ai-os/roles/<id>` | The project | Edit, show the diff, get the owner's yes |
| Shared skill or role | Method shared by every repository — installed as a plugin from the registry marketplace; read-only here | The AI OS registry | Never edit the installed copy. Propose the change upstream (registry repository) as an issue or pull request; it ships in a later registry version and reaches this repo through `ai-os upgrade` |
| Instructions | Repository rules — `AGENTS.md` outside the `ai-os:` blocks | The project | Edit with the owner's yes. Text inside `ai-os:` blocks is generated: change `ai-os.yaml` or the registry instead |

Layers are defined by **content**, not file location: a dated fact is knowledge wherever it sits; a process, output shape, rule or routing seam is method. Run `ai-os explain <id>` to see where a skill or role comes from before deciding who owns it.

## Classify before touching anything

| The failure was… | Signs | The fix |
| --- | --- | --- |
| **Stale or wrong knowledge** | A fact was wrong: a price, a metric source, a command, a competitor claim, a flow detail | Correct the knowledge file, dated, `status: draft`. No approval needed beyond the normal review of the file |
| **Wrong method** | The process itself misled: a missing step, a missing output slot, a wrong quality bar, a bad routing seam in a description | Project skill: edit with the owner's yes. Shared skill: write the upstream proposal; mitigate locally only at the knowledge layer meanwhile |
| **Right rule, not followed** | The rule exists and the run broke it anyway | Do NOT add the rule again. Strengthen enforcement: move the rule to where it is read at the moment of violation, add a red-flag line, or turn it into a policy or permission (a method change, with approval) |
| **Not the skill's fault** | One-off circumstance, a personal preference, a task outside the skill's scope | No skill edit. Preference → the agent's memory or `AGENTS.md`; scope gap → maybe a description edit (method); one-off → nothing |

When a failure is two types at once (a stale fact and a missing verify step), fix both as two labelled changes.

## Process

1. **Capture the evidence.** Quote the wrong output, the owner's correction or the incident. **No observed failure, no edit** — "this might help someday" is how skills bloat.
2. **Classify** with the table and say the classification out loud before editing.
3. **Locate the layer and the owner** (`ai-os explain`, the table above).
4. **Write the smallest edit that prevents recurrence.** Search the skill for the topic first: a duplicated rule in new words is bloat, a contradicting one is a bug. For knowledge:
   - verify the new fact live before writing it — replacing one unchecked number with another is not a fix;
   - prefer a lookup (where to read the value, which command prints it) over a value for anything volatile;
   - date it.
5. **Get approval for method changes.** Show the diff (project) or the proposal text (upstream) and wait for the owner's yes. Knowledge corrections go in directly, as `draft`.
6. **Log it.** One line in `.ai-os/knowledge/prior-findings.md` under "Skill lessons": date, skill, failure type, what changed and where (file, or the upstream issue or pull request).

## Red flags — stop

- Editing a file under `.claude/plugins`, a plugin cache, or inside an `ai-os:` block: it is generated and the next sync or upgrade erases it.
- Adding a rule the skill already has.
- A method edit with no quoted failure behind it.
- Writing a "fixed" fact you did not verify.
- Putting a product fact into a shared skill or role: shared content stays generic; facts belong in the project's knowledge.
