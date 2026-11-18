# API first: which path does each console chore take?

Check this table before opening a browser. "Browser" rows are the only ones a browser recipe should touch.

| Task | Path | Notes |
| --- | --- | --- |
| Attach first-time subscriptions to a review | **API**: `asc review items-add --item-type subscriptionVersions` and `subscriptionGroupVersions`, then `asc review submissions-submit`; recipe `asc-review-submit.mjs` | A first subscription must go with its **group version** while the group has no approved version. `asc web review subscriptions attach-group` can refuse when the web state says `MISSING_METADATA` while the API says `READY_TO_SUBMIT`. |
| Replace a subscription review screenshot | **API**: `asc subscriptions review screenshots delete` / `create` | "You cannot delete this asset" while the subscription sits in a draft review submission: remove it from the draft first (`asc review items-remove`; check the exact command with `asc review --help`), replace, add it back. |
| Subscription promotional image | **API**: `asc subscriptions versions images upload --version-id` | 1024×1024 RGB PNG. It mattered for readiness in live testing. |
| App Privacy (Apple) | **asc web**: `asc web privacy pull` → edit JSON → `plan` → `apply` → `publish --confirm` | Needs an Apple web session (`asc web auth login`; 2FA is the human's). |
| Data safety (Play) | **API**: Android Publisher `applications.dataSafety` takes the CSV; recipe `play-data-safety.mjs` | The live form has no API read: export it from the console. When an account creation method is declared, `PSL_HAS_OUTSIDE_APP_ACCOUNTS` must be blank or the import fails. |
| Play internal test build without touching the listing | **fastlane supply** `--track internal --release_status completed --skip_upload_metadata true --skip_upload_images true --skip_upload_screenshots true` | |
| Promote a tested build to production | **fastlane supply** `--track internal --track_promote_to production --version_code <n>` after `fastlane run google_play_track_version_codes` | Play refuses the same versionCode twice. Promotion is a release: the owner's call. |
| Play subscription price and listing | **API**: Android Publisher `monetization.subscriptions.patch` (`updateMask=listings,basePlans`, `regionsVersion.version=2022/02`) | Service-account file. |
| Play Families / target audience declarations | **Browser**: read with `play-console-read.mjs target-audience` | No API. Changing the declaration is done by the human in the console. |
| IARC content rating questionnaire | **Browser**, by the human | No API. |
| Play Publishing overview: managed publishing, changes not sent | **Browser**: read with `play-console-read.mjs publishing` | Sending changes for review is the owner's. |
| App Store Connect page whose web state differs from the API | **Browser**, read only | Trust the API for what a submission accepts; the page explains why the web refuses. |

When a row says API and the command fails in a way that looks like a missing feature, check the tool's `--help` and
release notes before falling back to the browser, and record what you found in the project's release knowledge.
