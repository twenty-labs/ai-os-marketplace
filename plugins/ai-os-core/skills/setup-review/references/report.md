# Report format

The whole report, before the question. One line per item, each with evidence; no paragraphs. Leave out an empty
section, except "Already fine" (it shows what was checked).

```
## Setup review · <repo> · <YYYY-MM-DD>
**Verdict:** <n> to move to twenty-labs · <n> to enable · <n> fine

### Move to twenty-labs
| # | Job | Today · evidence | Registry way | Keep |
|---|---|---|---|---|
| 1 | iOS release to App Store Connect | tool/release.sh:133 altool · fastlane deliver | appStore (asc workflows) | shorebird release, Android supply |

knowledge teaching the old path: .ai-os/knowledge/release-surface.md (sections …)

### Enable
| # | Item | Kind | Evidence | Why |
|---|---|---|---|---|
| 2 | seo-toolkit | plugin | web/index.html | a marketing site needs search visibility |

### Already fine
- release-cut (skill) · shorebird.yaml
```

Rules:
- The verdict line counts; it does not summarize.
- Numbers run across sections so the owner can refer to an item by number.
- Work-style roles (product-owner, project-manager, business-analyst) show the evidence of that way of working.
- At most three follow-up questions after the report, asked with `AskUserQuestion`, recommendation first.
