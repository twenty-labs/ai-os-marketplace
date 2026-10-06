# Channel folders

One folder per paid channel under `ads/`, plus a cross-channel layer. Start a new channel by copying the template folder.

```
ads/
├── BUDGET.md              allocation per channel per period, with the reason for every change
├── reviews/               monthly cross-channel reviews — the only place channels are compared
├── _TEMPLATE-channel/     skeleton for a new channel
└── <channel>/
    ├── README.md          the channel's playbook: unit of optimization, adjustment rules, weekly rhythm
    ├── campaigns.md       campaign registry — rows are never deleted, only their status changes
    ├── changelog.md       every change, newest first, with its reason — including what was deliberately left alone
    ├── data/              weekly exports, named YYYY-MM-DD-<topic>/
    ├── reviews/           weekly in-channel reviews
    ├── keywords/          search channels: keywords.csv, negatives.csv
    └── creatives/         creative channels: briefs and asset references
```

| File | Write when |
| --- | --- |
| `<channel>/changelog.md` | every platform change — date, object, before → after, reason, readout date |
| `<channel>/campaigns.md` | a campaign's status, budget or targeting changes |
| `BUDGET.md` | allocation between channels changes |
| `reviews/YYYY-MM-DD-cross-channel.md` | a full review only |
| `<channel>/data/YYYY-MM-DD-<topic>/` | raw numbers worth comparing later |

Campaign naming: `<market>-<objective>-<detail>` (for example `us-exact-brand`), so exports join cleanly across tools. Work on a branch and open a pull request; prose follows the project's locale, file names and identifiers stay in English.
