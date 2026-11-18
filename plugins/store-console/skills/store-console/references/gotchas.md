# Store console gotchas

Collected from live runs. Each one cost a session once.

- **Sessions expire overnight.** `asc web` sessions and the Chrome profile both. The recipes stop with exit code 2;
  ask the human to log in again (`asc web auth login`, `play-console-read.mjs --login`). Never loop on a login page.
- **Apple's web state and API state can disagree.** The web said `MISSING_METADATA` while the API said
  `READY_TO_SUBMIT` for the same subscription. What a review submission accepts follows the API.
- **`asc workflow run submit` creates a new review submission.** It does not reuse a draft started in App Store
  Connect ("Add for Review" on a subscription), so the subscriptions in that draft are left behind.
  `asc-review-submit.mjs` reuses the draft.
- **A first subscription needs its group version** in the same submission while the group has no approved version.
- **An asset in a draft submission cannot be deleted.** Remove the item from the draft, replace the asset, add it back.
- **Play account index in URLs (`/u/2/`)** depends on which Google accounts the browser is signed into. Build URLs
  from the developer id; the recipes do.
- **Play "Save" on an app-content form only queues the change** in Publishing overview. It goes to review with the next
  send for review, which is the owner's. With managed publishing on, even approved changes wait for the owner to
  publish.
- **Data safety import:** when an account creation method is declared, `PSL_HAS_OUTSIDE_APP_ACCOUNTS` must be blank.
- **Play refuses the same versionCode twice**: read `google_play_track_version_codes` before promoting.
