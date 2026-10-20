---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea, in frontier rounds with a recommended answer for each question. Use when the user wants to stress-test their thinking, uses any 'grill' trigger phrase, or when a brainstorm or plan card has open decisions to settle.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.

## Shared language

Read `.ai-os/knowledge/glossary.md` first; it names the project's `GLOSSARY.md`. If it is missing or unfilled, fill it from the code and docs you can read, and put only the terms you cannot resolve yourself to the user.

- Word every question in the glossary's terms. When the user uses another word for a settled concept, say so and keep the glossary's word.
- When a question settles what a term means, or introduces a term, update `GLOSSARY.md` in the same round (term, definition, words to avoid) and tell the user in one line.
- When a settled decision is hard to reverse, surprising without its context, and the result of a real trade-off, offer to record it as an ADR (follow the repository's ADR folder and numbering) and link it from the term's glossary row.
