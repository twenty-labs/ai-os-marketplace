---
name: content-pipeline
description: Use when producing or scheduling organic content — short video, social posts, long-form — from hook bank to script to publishing queue to weekly review, with a measurable link per piece. NOT for paid ad creatives (ads-review) or partner outreach (partner-outreach).
---

# Content pipeline

From hook to publishing queue, with a measurable link on every piece. Organic content is the cheapest early channel and the one that reveals **which message** the audience responds to before money is spent amplifying it. So every piece (1) ties to a real feature, (2) carries its own measurable link, and (3) is recorded with its hook and result so the hook bank grows from evidence.

If the project enabled external skills such as `social`, `video` or `content-strategy`, use them for the craft; this skill runs the pipeline.

## Repository layout — `content/`

| Path | What it is |
| --- | --- |
| `hooks.md` | hook bank: hook · angle · feature · platform · results once published |
| `angles.md` | the content angles, each tied to a real feature and why it fits the audience |
| `scripts/YYYY-MM-DD-<slug>.md` | script: hook · body · call to action · caption · tags · link |
| `queue.md` | publishing queue: date · platform · script · link · status |
| `reviews/YYYY-MM-DD.md` | weekly review: top and bottom pieces by views and by attributed signups or installs |

## Angles

Keep three to five angles, each tied to a feature the current release really has, with the reason it resonates with the audience (from the audience file). Before writing, check the release's real capabilities and feature flags, and the brand voice's allowed and forbidden claims: content may promise only what the current build does. Demo footage uses the real product and a demo account, on a build where the feature works — one frame is a promise.

## Weekly loop

1. **ideas** — new hooks into the hook bank, each on one angle. A hook states an outcome or a mistake in the first seconds and does not lead with the product name.
2. **script** — choose a few; write short scripts: hook, one idea, the real product on screen, one call to action. Caption in the project's locale, a handful of relevant tags.
3. **link** — every script gets its own tracking link (deferred deep link or UTM-tagged link with a campaign parameter equal to the slug), placed where the platform allows (bio, pinned comment, description). Never link straight to the store or homepage: the result lands in "organic" and teaches nothing.
4. **queue** — add to `queue.md` at a fixed, sustainable cadence. If a scheduler exists, the queue is its input; its dry run is reviewed before anything publishes.
5. **review** — weekly: views, early retention, link clicks, signups or installs per campaign parameter. Record results in the hook bank. A hook at two times the median or more earns two variants; one under half the median retires its angle for a month.

## Rules

- At least one piece per week sells nothing — a tip that stands on its own.
- "What is this?" comments are buying signals: answer with the tracked link and note them in the review.
- Never publish on the owner's behalf until a scheduler exists and the owner approves each piece.
- Results are reported down to signups or installs, never views alone.
