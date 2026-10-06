# Over-the-air update eligibility

For each item headed for an over-the-air update (a code-push, a hot patch, a remotely loaded bundle), decide one of: **update-safe**, **store build required**, or **unclear** — with the reason.

## Store build required
- A new screen, tab or feature, or a feature turned on that the reviewed build did not offer.
- A change to the app's primary purpose or how it is presented.
- New data collection, new tracking, or new sharing of data with a third party.
- New permissions, entitlements, SDKs or native code.
- Changes to purchase flows, prices shown, or what a plan includes.
- Anything that changes the answers in the store's privacy disclosure or age rating.

## Usually update-safe
- Bug fixes that restore reviewed behaviour.
- Copy and translation fixes that do not change claims.
- Performance improvements.
- Content updates of the kind the reviewed build was designed to load.

## Unclear — escalate to the owner
- Feature flags that reveal code present in the reviewed build but hidden at review time.
- Remote configuration that changes paywall behaviour or limits.

Measure each item against the project's own update policy (recorded in the store-review knowledge file) and both stores' rules on downloaded executable code. When the project's policy is stricter, it wins.
