# House style for a skill's output

Every report a packaged skill produces follows these rules. Its `references/report-template.md` writes them down for
that skill.

- A header line (what, subject, date), then the **verdict in one sentence** naming the single deciding reason, not a
  summary.
- Tables with **one line per finding**: the problem, its evidence (`file:line`, or a live read with system, value and
  date), and the next action naming who does it.
- Hard caps (for example at most five blockers); the overflow moves to a lower section instead of growing the top one.
- A "passed" section, one line per area checked, and a "not verified" section with the cheapest way to verify, so the
  reader sees what was covered.
- At most three follow-up questions, asked with `AskUserQuestion` when the runtime has it, recommendation first.
- No preamble, no paragraphs. Written in the owner's language; identifiers, commands and event names stay as they are.
