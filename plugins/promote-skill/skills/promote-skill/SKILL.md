---
name: promote-skill
description: "Use when the owner asks to share a skill with every repository: promote a repo-local skill, a personal skill from a Claude config directory, or an external GitHub skill into the shared registry. Validates it, shows what becomes public, and opens the registry pull request with `ai-os skill promote`. NOT for writing or improving a skill (use skill-coach), for editing a skill that is already in the registry, or for installing a registry skill into a repository."
---

# Promote a skill

Promotion moves a skill into the shared registry through a reviewed pull request. The registry is public, so **the owner confirms before anything is opened**: the content of the skill becomes public with the pull request.

## Steps

1. **Identify the source and the checkout.** The source is one of: a skill folder (`.ai-os/skills/<id>` of this repository, or a personal one under a Claude config directory such as `~/.claude-<account>/skills/<id>`), or a GitHub URL of a skill folder (`https://github.com/<owner>/<repo>/tree/<ref>/<path>`). The ai-os checkout is a clean clone of the registry repository: ask for its path if you do not know it.
2. **Dry run.** Run it and read the whole output:

   ```sh
   ai-os skill promote <source> --ai-os <checkout> --dry-run [--role <id> ...] [--opt-in]
   ```

   - Done when the command reports the plan without errors. Fix every error first: a secret, an internal hostname, a personal path or an email in the skill must be removed; a license outside MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC or CC-BY-4.0 stops an external skill.
   - Roles: promoted skills attach to the roles that need them. Without `--role` the command lists suggested roles; pass the ones the owner picks, or `--opt-in` to leave the skill for repositories to enable by hand.
   - Warnings about the description ("Use when ... NOT for ...") or size are the contribution standard talking: fix them in the source and run the dry run again.
3. **Show the owner** the file list, the roles, the warnings, and this sentence: the content of the skill becomes public. Wait for a clear yes. A silent or ambiguous answer is a no.
4. **Promote.** Run the same command with `--yes` instead of `--dry-run`. The command runs `gh` and `git` as the account named by policy `github-account` (or `--gh-account`); never switch accounts yourself, and stop and tell the owner if the token lookup fails.
5. **Report** the pull request URL and, when the skill came from this repository's `.ai-os/skills`, that the local copy was removed. The skill reaches this repository through the next registry upgrade.

## Rules

- A skill that names a customer, a person, an account or an internal system does not get promoted; ask the owner to generalize it, or keep it in the repository.
- Never promote with `--yes` before a clean dry run of the same arguments.
- One skill per run.
