# Review checklist

Check what applies; report only applicable findings. Locate each item at the paths the store-review knowledge file records for this stack (native project, cross-platform config, plugin-generated manifests).

## Privacy and data
- Every data type collected, by the app and by each SDK, is declared in the store's privacy disclosure (App Store privacy labels, Google Play Data safety).
- iOS privacy manifest present where the app or its SDKs use required-reason APIs; tracking declared and the tracking-permission prompt shown before any tracking.
- A privacy policy is linked in the listing and reachable in the app.
- No device fingerprinting; identifiers used only as declared.

## Permissions
- Every permission the build requests (including those added by plugins) has a specific purpose string — not "needs camera".
- Permissions are requested in context, after the user understands why, not all at launch.
- Android: only permissions the app uses; sensitive ones (background location, SMS, call log, all-files access, exact alarms, accessibility) have an approved use case and declaration.

## Platform configuration (iOS)
- URL schemes and associated domains point only at domains the product controls, and the flows they open work.
- App Transport Security exceptions are narrow and each has a reason.
- Background modes, push, app groups and keychain access groups are declared only when the build uses them.
- Extensions (widgets, live activities, share and notification extensions) work on their own and use only the data the app declares.

## Purchases and subscriptions
- Digital goods and features are sold through the store's billing system; no links or prompts to pay elsewhere unless a current, applicable entitlement allows it.
- The paywall states price, billing period, renewal, trial length and what happens after the trial.
- Restore purchases is visible and works; entitlements are validated (preferably on the server) and survive reinstall.
- Nothing labelled "free" requires payment for its core function.

## Accounts and sign-in
- If an account is required, the app explains why, and the reviewer has a working demo account or demo mode.
- If accounts can be created, they can be deleted from inside the app, and deletion really deletes (or the retention is explained).
- iOS: offering third-party social sign-in requires an equivalent privacy-preserving option such as Sign in with Apple; token revocation on deletion where applicable.

## Content and safety
- User-generated content has filtering, reporting, blocking, published contact information and an effective removal path.
- After the store has flagged a user-generated-content violation: the requested removal is done, and the reply carries a compliance plan and evidence of improvement. Do not demand an incident plan when nothing was flagged.
- Spam and duplicate apps (App Store 4.3(b)): assess meaningful differentiation only when the shipped experience or listing looks indistinguishable from widely available products, or the app is in a category the store names as saturated; for a live app, weigh evidence of maintenance and improvement. Never infer it from a common purpose or a sparse description, and never invent thresholds. Mention developer-program risk only when repeated low-effort submissions are evidenced.
- Medical, financial, safety and other regulated claims are framed and substantiated.
- Age rating answers match the actual content.
- Messaging features (push, live activities, notifications) are not used for unsolicited promotion without consent and an off switch — judged from the actual triggers, content and destinations, never from API use alone.

## Technical quality
- No crash on launch or on the main paths; network errors and offline states are handled.
- No placeholder screens, dead ends or "coming soon" features in the build under review.
- Minimum OS and target API levels meet the store's current requirements (Google Play enforces a target SDK floor).

## Reviewability
- The core value is reachable without special setup, or the review notes explain the setup.
- Review notes cover: steps to key features, account placeholders, unusual permissions, how to test purchases, any hardware or region dependency.

## Severity
- **P0** — very likely rejection, or the app does not work for the reviewer.
- **P1** — a common rejection reason or serious reviewer friction.
- **P2** — risky pattern or unclear compliance.
- **P3** — polish.
