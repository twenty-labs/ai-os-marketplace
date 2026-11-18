# Checklist from real rejections

Observed rejections, 2026. Each item is a cause that got a build rejected or blocked; run it in a pre-submission audit and after any rejection in the same area. Quote guideline numbers from the current guidelines when you can reach them. Locate each item at the paths the store-review knowledge file records.

## Purchases and codes
- **3.1.1 code entry (iOS).** No typed promo, redeem, referral, gift or license code that unlocks paid features; only Apple offer codes. Check: `grep -riE "promo|redeem|referral|coupon|license" <client source>` and look at every text field that unlocks something. Gate any code UI behind a platform flag so it is hidden on iOS.
- **3.1.2(c) subscription terms.** An auto-renewing subscription shows, on the paywall: plan name, length, price, a Terms of Use (EULA) link and a Privacy Policy link. The same links appear in the App Store Description (or the License Agreement field). Review notes include a screen recording of the purchase flow. Restore Purchases is visible. Account-deletion copy says deleting the account does not cancel the subscription.

## Accounts and sign-in
- **4.8 Sign in with Apple.** Any third-party or social login means Sign in with Apple is offered too, and shown first. Check the auth provider's configuration lists the app's bundle id (or service id) as an accepted Apple Client ID; a missing id fails sign-in only on a real build. Test on a real device, not only the simulator.
- **5.1.1(v) deletion.** In-app account deletion is reachable from settings or profile in a few taps, and deletes server-side data. When Sign in with Apple exists, revoke the Apple token on deletion.
- **2.1 reviewer access.** Every gated feature is reachable by the reviewer: write the path in the review notes, or provide a demo account (or a working anonymous mode). Production backend is up and its migrations applied (probe the health endpoint just before submitting). Limits quoted in the notes (daily caps, quotas) equal the production values.
- **2.1(b) locked content.** Locked, greyed or "coming soon" items say why they are unavailable and do not imply paid content the app does not sell.

## Privacy and tracking
- **5.1.1(iv) / ATT pre-prompt.** An explainer before the system tracking prompt has a single "Continue" button that always opens the system prompt; no accept/decline of its own. The prompt is reachable before sign-in (raise it on first launch), or the reviewer never sees it. The tracking usage string is present, and the App Privacy "Tracking" answer matches the SDKs that track.
- **ITMS-90683 purpose strings.** Every API an SDK references needs a purpose string even if the app never calls it (for example a map SDK that references location). Write the string to say how the app uses it, or that it does not.
- **Privacy manifest.** The app-level manifest is consistent with the App Privacy label. SDK manifests aggregate into the app: a map or analytics SDK's telemetry can declare location or diagnostics data. Disable the telemetry or declare the data. Run the store's validation tool and require it clean.
- **5.1.2(i) third-party AI.** When user content (photos, text, audio) is sent to a third-party AI service, the consent screen names it and appears before the first upload. Consent is reset when the account is deleted.

## User-generated content
- **1.2 UGC.** Report and block are present, content is filtered, and the Terms and the review notes state that reports are acted on within 24 hours. A real moderator account exists in the backend so the claim holds. If user content is not shown to other users, record that as a decided position.

## Listing and metadata
- **Metadata parity.** Repository store copy equals the store console: name, subtitle, category, age rating, privacy and support URLs.
- **Content rights.** Answer "contains third-party content" when the app ships openly licensed (CC, public domain) assets or third-party map data, and keep the attributions.
- **Storefront licences.** Check availability against local licensing: game licences in China mainland; Vietnam requires the online-game licence (G1) for online games. Exclude storefronts you cannot satisfy.
- **EU DSA.** Trader status declared for EU storefronts.
- **1.3 Kids Category.** When the app is in Kids, the questionnaire is answered per binary, and every SDK is checked against it (see [kids and age](kids-and-age.md)).
