---
name: cross-repo-contract-review
description: Use when a change touches something shared across repositories — an API payload, enum, event name, feature flag, deep link or schema — to check the other side exists and the deploy order is safe before a pull request. NOT for general code quality or changes confined to one repository.
---

# Cross-repository contract review

One question: **does this change complete its cross-repository contract, or ship half of one?**

Continuous integration runs per repository and cannot see a sibling; a reviewer reads one diff. The failure is specific and always silent: a value the consumer has never heard of renders with the wrong fallback; a limit the client does not know degrades to a bundled default; a field nobody sends reads as empty forever. Nothing errors. The feature just quietly does something else.

## 1. Find the contracts the diff touches

Read the project's contract documentation if it exists (the flow-map knowledge file says where; a `docs/cross-repo-contracts.md` or similar). Then scan the diff for the usual shapes:

- request or response payloads, DTOs, GraphQL or protobuf schemas;
- enums and closed value sets shared with another side (statuses, plan ids, notification types);
- analytics event and property names — a shared namespace across clients and server;
- feature flags and remote-config keys;
- deep-link routes and push payloads;
- database tables read by another service, and migrations they depend on.

A change that touches none of these needs no contract review; say so in one line.

## 2. For each touched contract, answer in order

1. **Is the other side needed?** A rename of an internal helper needs nothing elsewhere; a new payload field or enum value does. Say which, and why.
2. **Does the other side exist yet?** Look in the sibling repository's trunk, its other branches and worktrees, and its open pull requests. Name what you found, with paths. If the sibling is not checked out locally, say so and name what would settle it.
3. **What is the deploy order?** Usually the producer must be live before the consumer that depends on it ships — the backend before the app build, the schema before the code that reads it. State which side lands first and what happens if the order is reversed ("the app falls back to the bundled default" is an answer; "unknown" is not). If one side ships through a store review, its timing is not under your control — say so.

## 3. Output

```
<contract> — complete | incomplete | one-sided by design
evidence: <one sentence, with paths>
deploy order: <which side first; what happens if reversed>
```

If everything is complete, say so in one line — do not manufacture findings. Do not review code style or anything a per-repository review already covers; this skill exists for the seam between repositories and nothing else.
