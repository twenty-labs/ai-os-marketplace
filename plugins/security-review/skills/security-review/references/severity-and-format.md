# Severity and output format

```
## Security review: <branch, PR or area>

### Blocker
- <file:line> — <what is wrong> — <scenario: who, steps, what they get> — <fix direction> — confidence: confirmed | suspected (check: <exact check>)

### High
### Medium
### Low

### Reviewed and cleared
- <area or entry point> — <what was checked>

### Out of reach
- <what could not be checked from here and who can check it>

### risk-surface
- <proposed addition> | no durable change
```

## Severity rubric

| Severity | Meaning |
| --- | --- |
| Blocker | Exploitable now by a realistic attacker (any signed-in user, anyone with the public client key, an anonymous caller); or a breach of minors' data, a decided position, or a loosened scrubber. |
| High | Exploitable with a precondition (a leaked id, a second account, a race) or limited in reach. |
| Medium | A missing layer of defence that the next change would turn into an exploit. |
| Low | Hardening; no current path to harm. |

Severity is about consequence; confidence is about evidence. A blocker you suspect but could not confirm is still reported as a blocker, marked suspected, with the exact check that would settle it.

## What not to report

- Style, naming, types and missing tests (unless a test claims to cover a security property it does not).
- Anything risk-surface records as intentional, unless the change breaks its reasoning.
- Generic advice with no path in this code ("consider adding a firewall").
