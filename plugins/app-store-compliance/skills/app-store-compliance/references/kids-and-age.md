# Kids and age

Applies when the app is in the App Store Kids Category or Google Play's Families program, is designed for children, or admits users below the age at which they can consent to data processing themselves. Read the decided age policy in the store-review knowledge file first: target ages, thresholds, and what happens below them. Kids rules are among the strictest in both stores and change often — verify current wording before quoting one.

## Parental gate
- Every outbound link, purchase, permission request, settings change that affects data or the account, and contact or feedback path sits behind a parental gate: a challenge a young child cannot pass by chance or by reading (not a tap-and-hold, not a question a child answers easily).
- Check every path to the target, not only the main one: links in about screens and legal pages, share sheets, rating prompts, deep links into settings, buttons inside loaded content.
- The gate guards the action itself; passing it once does not unlock the whole app for the rest of the session unless the product's policy says so.

## Ads and analytics
- No third-party advertising and no third-party analytics that collect identifiable information or track behaviour in a Kids Category app. On Google Play, any ads or analytics SDK must be allowed under the Families policy.
- No advertising identifier, no device fingerprinting, no tracking-permission prompt.
- First-party analytics, where allowed, is enforced by code, not discipline: an allowlist of events and properties on the client and again on the server; no name, age, birth date, photo, location, free text or anything the child said; the identifier is a random install id that disappears when the data is reset.
- In a general-audience app with an age gate: below the threshold, analytics is off or limited to the allowlist, consent is forced off and the tracking prompt never shows. Check that this holds at launch, at the moment the age is entered, and on a shared device after an older user's session.

## Data minimization
- Collect only what a feature needs, and keep it on the device when the feature works that way. A child's name, age and birth date stay on the device unless the policy says otherwise.
- **Voice and audio**: never store a child's voice recording, on the device or on a server, unless the product's policy explicitly allows it with the required consent. Speech sent to a recognition or scoring service is processing, not storage: check the processor's retention terms and declare it. Transcripts of what a child said are the child's words; keep them out of analytics, logs and crash reports.
- A parent can delete the child's data from inside the app, and deletion really deletes.

## Age gates (COPPA, GDPR-K)
- The gate is neutral: it asks for a birth date or age without revealing the threshold, has no "I am over N" checkbox, and does not invite an immediate retry with a different answer.
- Thresholds: 13 under COPPA (United States); the digital-consent age under GDPR is 13 to 16 depending on the member state. Below the threshold the app either blocks use or runs a verified parental-consent flow — a larger build, not a dialog.
- The gate runs before any analytics consent or tracking, and sends no analytics itself.
- Record the decided thresholds and where the code enforces them in the store-review knowledge file; legal confirms them.

## Store declarations
- Age rating questionnaire answers match the real content, including user-generated content, chat, unrestricted web access and ads.
- App Store Kids Category: the age band chosen matches the content and audience; privacy labels match what the build and its SDKs do.
- Google Play: target audience and content section, Families policy declarations and Data safety match the build.
- The privacy policy has a children's section that matches the implemented behaviour (minimum age, what is not tracked, what stays on the device).

## Severity
- **P0** — a third-party ads or tracking SDK in a Kids Category app; an outbound link or purchase without a parental gate; stored child audio the policy does not allow.
- **P1** — analytics properties not allowlisted; an age gate that reveals its threshold; store declarations that disagree with the build.
