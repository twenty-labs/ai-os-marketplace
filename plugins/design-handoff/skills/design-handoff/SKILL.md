---
name: design-handoff
description: Use when a screen or component is being produced in a design tool (Claude Design, Figma) or handed from design to implementation — onboarding the tool to the product's design system, specifying a new shared component, self-checking against the design system, and writing the developer handoff with every state, token names and interaction notes. NOT for judging an existing screen (designer) or writing the code.
---

# Design handoff

The designer decides what a screen should be; this skill gets it produced in a design tool and into implementation without guesswork. Everything product-specific — the design-system document, token sources, shared components, spacing rhythm, icon set, information architecture, decided norms — is in `.ai-os/knowledge/design-surface.md`. Read it and the documents it points to first. Design from the document, never from memory: values evolve.

## 1. Scope

- One job and **one primary action** per screen. Two competing calls to action: cut one.
- Place it in the product's information architecture as design-surface records it; do not reintroduce a duplication the norms already removed.
- Tracked work has an issue (`issue-workflow`).

## 2. Ground it in the system

- **Tokens only** — color, type, spacing, radius, elevation, motion. No raw values, no off-scale spacing.
- **Reuse shared components.** A new need becomes a real component, never a one-off: variants · sizes · states (default, pressed, disabled, loading, selected) · every theme · accessibility (target size, semantics labels) — added to the component set and its gallery.
- The product's own icon set, when it has one.
- Every theme the product ships (light and dark) from the start, not as an afterthought.

## 3. Produce

**Claude Design** — onboard it to the repository *and* the design-system document, so the system it derives matches the standard rather than drifted code. Prompt from the issue's brief and acceptance criteria, iterate in every theme, and export the Claude Code handoff bundle once approved.

**Figma** — load the Figma plugin's skills before any write (`figma-use` first). Generate screens or the library from the system, map components to code with Code Connect, and read existing frames through design context and screenshots.

Either way, tokens are variables and components a reusable set, so the design source and the design-system document stay in step.

## 4. Self-check before handoff

Not done if any of these hold:

- A raw value where a token exists.
- A missing state: loading (a skeleton where the layout is known), empty, error with retry, disabled.
- A missing theme.
- Targets under the platform minimum, or icon-only controls without labels.
- Wrong presentation semantics: back (push) for drilling deeper, close (modal) for a self-contained task.
- Animation without a reduced-motion fallback.
- No analytics specified for a user-facing screen.
- Any "Decided norms" entry in design-surface broken.

## 5. The handoff spec

- **Screens and states** — every screen in every theme, in every state, not only the happy path.
- **Tokens by name**, not by value.
- **Components** — which shared ones; for a new one, its full spec and gallery entry.
- **Interaction notes** — push or present; sheet, dialog or full screen; gestures, transitions, haptics, reduced motion.
- **Analytics** — the view, key interactions and completion events, registered where the project registers events.
- **Links** — the handoff bundle or frames, and the issue.

The spec goes to `docs/design/<YYYY-MM-DD>-<topic>.md`. Implementation is verified against it later in design QA (designer) and by qa-engineer.
