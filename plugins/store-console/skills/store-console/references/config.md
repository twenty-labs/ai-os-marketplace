# store-console.json

One file at the repository root (or `--config <file>`). It holds identifiers and paths, never a secret. Only the keys
a recipe uses are required; each recipe names a missing key.

```json
{
  "appStore": {
    "appId": "1234567890",
    "bundleId": "com.example.app",
    "subscriptionGroups": ["Premium"]
  },
  "play": {
    "packageName": "com.example.app",
    "developerId": "1234567890123456789",
    "appId": "4975000000000000000",
    "account": "studio",
    "serviceAccountJson": "secrets/play-service-account.json",
    "dataSafetyCsv": "store/play/data-safety.csv",
    "consolePaths": { "target-audience": "app-content/target-audience-content" }
  },
  "runLogDir": ".store-console/runs"
}
```

| Key | Used by | Meaning |
| --- | --- | --- |
| `appStore.appId` | asc-review-submit | App Store Connect app id. Falls back to `APP_ID` in `.asc/workflow.json`. |
| `appStore.bundleId` | asc-review-submit | Shown in the target line only. |
| `appStore.subscriptionGroups` | asc-review-submit | Optional: only these groups (reference name or id) are scanned for pending versions. Default: all. |
| `play.packageName` | play-data-safety | The Android package; `--confirm-package` must name it. |
| `play.serviceAccountJson` | play-data-safety | Path to the service-account key file (git-ignored). Never printed. The account needs Play Console access to the app. |
| `play.dataSafetyCsv` | play-data-safety | The Data safety CSV in the repository: the source of truth. |
| `play.developerId`, `play.appId` | play-console-read | From the console URL `/console/developers/<developerId>/app/<appId>/`. URLs are built from these, never from `/u/<n>/`. |
| `play.account` | play-console-read | Name of the browser profile: `~/.store-console/<account>`. One per Google account. |
| `play.consolePaths` | play-console-read | Optional: override a page's path when the console moves it. |
| `runLogDir` | browser recipes | Screenshots and page text, one folder per run. Git-ignore it. |
