# Security review checklist

Check what applies to the area in play; report only applicable findings. Examples name common stacks; translate for the project's own and say you did.

## Authentication and token issuance
- Every route that is not deliberately public has a guard; a new route is checked at registration, not only in its handler. Public routes are listed in risk-surface.
- Token verification pins the algorithm (never `none`, never a symmetric algorithm where an asymmetric one is expected), and checks issuer, audience and expiry.
- Long-lived connections (websockets, streams) authenticate on connect and close on failure before processing any frame.
- Refresh and session issuance: refresh tokens rotate, revoked sessions stop working, and a password or email change invalidates what it should.
- Short-lived tokens minted for a third-party provider are per user, short-lived, narrowly scoped, and issued only after the quota check.
- Authorization data is read from fields the user cannot edit (server-set claims or a table), never from user-editable metadata.

## Authorization and ownership
- Every resource id in a path, query or body is checked against the caller's identity before it is read, written or used to build a storage path.
- Tier, role, price, quota and duration values come from the server; a client-supplied value is ignored or clamped.
- Admin endpoints sit behind a role check on the server, not a hidden screen; admin actions are logged with who did them.

## Purchases and entitlements
- Receipts are validated server-side with the store or the payment provider; entitlement is never granted from a client signal alone.
- Webhooks: signature verified over the raw body, idempotent on the provider's event id, safe under retries and out-of-order delivery, and a refund or revocation is handled.
- Promo codes, offers, gifts and referral rewards: single-use where they should be, redeemed atomically (the grant and its history in one transaction), cannot be replayed, cannot credit an account the caller does not own, and fail closed on a malformed code.
- Expiry and countdowns are server-backed; the server rejects what the client still shows as valid.
- A failed or cancelled purchase leaves no partial unlock.

## File upload
- Size limit enforced on the server; content type checked against an allowlist from the bytes, not trusted from the header.
- The storage path is built from server-known ids, never from a client filename; no traversal into another user's folder.
- Storage buckets: public only when deliberately public; signed URLs short-lived; bucket policies match the access model.

## Injection
- No user input concatenated into SQL, a shell command, a file path, a template, a regular expression or an LLM system prompt that also carries privileged instructions.
- Redirects and outbound links go through one allowlisted seam; server-side fetches of user-supplied URLs are restricted.

## Secrets
- No key, token, password or connection string in code, config, fixtures, migrations, comments or logs. A client bundle never contains a server or service key (watch build-time variables that are shipped to the browser or app).
- A newly required secret is named in the example env file with a placeholder, never a value.

## Personal data and minors
- Logs, analytics events and error reports carry no request bodies, transcripts, audio, emails or tokens; scrubbers are not loosened.
- Data marked as minors' in risk-surface follows the recorded position on collection, retention, third-party transfer and analytics.
- Deletion requests actually delete, including copies in storage and derived tables.

## Row-level security and storage policies
- Row-level security is enabled on every table a client-facing key can reach, with a policy per operation the client needs; server-only tables are enabled with no policy.
- Views and privileged functions that bypass row-level security do so deliberately, check the caller's identity inside, have a fixed search path, and are not executable by public roles by default.
- A write through a client-facing key has policy coverage; a write through the service key re-implements the ownership check in code.

## Rate limits and cost abuse
- Every route that calls a paid upstream API has a per-user limit and a global ceiling, checked before the call.
- Retries cannot multiply spend (a client retry loop that re-mints tokens or re-runs a paid call each time).
- A second account resets per-user caps: say whether that matters at this price.
- Unauthenticated endpoints that send email or SMS, or call a paid API, are rate-limited per caller and globally.
