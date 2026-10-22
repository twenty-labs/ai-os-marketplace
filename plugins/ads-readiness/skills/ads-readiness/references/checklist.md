# Ads readiness checklist

Eight areas, in order. For each: the questions, where to read the answer, and traps already paid for. Answer from live systems first, code second, docs last.

## 1. Measurement chain

| Check | Read it in |
| --- | --- |
| The MMP SDK runs in the **store** build (not only debug), with the production key from the release config | SDK init code, release config key names (never values), MMP app status |
| The MMP receives installs and the activation event from real devices | MMP dashboard or API: installs and in-app events for the last 7 days, split organic or non-organic |
| iOS: the ATT prompt is asked once, after any earlier system prompt has closed, and before the first MMP session starts | consent and SDK start code |
| SKAN, or the platform's privacy postbacks, go to the MMP, and a conversion value model exists | Info.plist `NSAdvertisingAttributionReportEndpoint`, MMP SKAN settings |
| The ad network app is linked to the MMP the way the network accepts it now (for example TikTok takes new apps only through SAN) | ad network app list: partner, self-attribution, SKAN allowed |
| Each MMP event maps to **one** distinct partner event, with revenue only where there is revenue | MMP › integration › in-app event postbacks |
| The optimization events the first campaign needs exist on the network and can unlock | ad network optimization-event list and availability |

Traps:
- The activation event mapped to the same partner event as app open. The network can no longer tell users who did something apart from users who opened the app.
- All optimization events show INACTIVE with 0 conversions until the first attributed conversions arrive. The first days can only optimize for installs. Say so; it is not a defect.
- Organic installs are the baseline. Read them before spending so the first paid readout has something to compare with.

## 2. Revenue attribution

| Check | Read it in |
| --- | --- |
| The billing tool has its MMP integration on, with standard event names (`af_start_trial`, `af_subscribe` or the MMP's equivalents) for the first conversion | billing tool › integrations |
| The app hands the billing tool the MMP's install id (for RevenueCat: `collectDeviceIdentifiers()` then `setAppsflyerID`, or the Adjust or Branch equivalent), at launch and after sign-in | purchases code, and a billing customer's attributes |
| Turning the consent or usage-data switch off clears that id | the switch handler |
| Revenue events are mapped to the network with revenue | MMP postback mapping |

Trap: the integration toggle is on but no customer has the MMP id attribute. Every purchase is then silently unattributed. Check a real customer's attributes, not the toggle.

## 3. Billing truth

| Check | Read it in |
| --- | --- |
| Store server notifications (App Store Server Notifications V2, Google RTDN) point at the billing tool | store console; billing tool customer history shows a CANCELLATION or RENEWAL event after one happened |
| The billing tool's webhook to the backend delivers 2xx, and the backend's event table has rows | webhook delivery log; a read-only count on the events table |
| The backend's view of a test subscription (will renew, expiry) matches the billing tool | read-only query on the entitlement row |

Traps:
- A 401 from the backend behind a proxy edge is the backend rejecting the secret, not the host failing. A host failure looks like 502 or 503.
- The header carries `Bearer <secret>` while the environment variable holds only the secret. Changing the variable does nothing until the service is redeployed.
- Fixing either side only affects new events. Resend the failed deliveries, and refresh one test customer (restore purchases) to prove the chain.

## 4. Legal consistency

| Check | Read it in |
| --- | --- |
| The privacy policy names every party that receives data for ads (MMP, billing tool to MMP, ad network) and what each gets, in every market language | the published policy page (fetch it, do not trust the source file) |
| Store privacy labels match: device id, advertising data, purchases, linked or not linked, used for tracking | store console, `PrivacyInfo.xcprivacy` |
| Consent prompts (ATT purpose string) exist in every market language | Info.plist and its localized strings |
| No sentence in the policy contradicts a running flow (for example "subscription data is not used for advertising" once purchases go to the MMP) | policy text compared with areas 1 and 2 |

Trap: the policy source changed but the rendered web page was not rebuilt or deployed. Fetch the live URL.

## 5. Store page (target market)

| Check | Read it in |
| --- | --- |
| The version **live** in the market has the market's language for name, subtitle, description and screenshot captions | public store lookup for the market; store console for the live version |
| Screenshots show the current UI | the live listing |
| Ratings count and average in the market | public lookup API (for example `itunes.apple.com/lookup?id=<id>&country=<cc>`) |
| Price and trial for the market are the decided ones | store console or billing offering |

Traps:
- Screenshots belong to a version. New ones on a draft version reach users only when that version ships. A store page in the wrong language wastes every click.
- An iOS-only app in an Android-heavy market narrows the audience and raises cost per install. Flag the market choice; do not judge the budget.

## 6. First run

| Check | Read it in |
| --- | --- |
| Taps and system prompts from cold launch to the first moment of value | launch and home code; walk it on a device or simulator |
| No more than the essential permission and the tracking prompt before value; other permissions (location, notifications, contacts) come after value | prompt call sites and their triggers |
| Denying the essential permission leaves a way forward (fallback, Settings link) | denied-state UI |
| No forced sign-up or paywall before value | routing on first launch |

Trap: each extra prompt before value drops the activation event, which is the very event the first campaign optimizes and is judged on.

## 7. Retention, virality, monetization

| Check | Read it in |
| --- | --- |
| A new user has a reason to come back on day 1 to 2 (notification, streak, social) once permission is given | notification planner, triggers |
| When the notification permission is asked, and how often | primer rules |
| Invite or referral links survive install (deferred deep link) and land the invitee in the right place | invite page, deep-link handling after first launch |
| A new free user can reach the paywall in early sessions; if not, the first test is an activation test and is read as one | every paywall trigger and its reachability |

## 8. Stability and operations

| Check | Read it in |
| --- | --- |
| Crash-free sessions and users of the live version (aim for 99.5% or more before paid traffic) | crash reporter release view |
| A backend outage cannot block a signed-out new user (version gate fails open, launch does not await the network) | launch code; health endpoint |
| The backend and the app can ship a fix today (deploy works, OTA patch path exists) | deploy status; release tooling |
| Production health endpoint answers fast from the target region | `curl` timing |

Trap: the host cannot deploy right now. A bug found during the test then cannot be fixed. That alone does not block a test, but it blocks scaling.
