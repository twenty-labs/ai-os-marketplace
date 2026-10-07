# Privacy rules for events

Product analytics needs behaviour, not identity. Every rule below is enforced in code where the project allows it, not by reviewer discipline.

## Identity
- Identify a user by the product's internal user id after sign-in, never by email, phone or name.
- No advertising identifiers or device identifiers in product events unless the project's consent and store disclosures allow them.
- For products used by children, the distinct id is a random value created on device and reset when the user wipes their data; person profiles, IP capture and geolocation are disabled when the project's policy says so.

## Property values
- Allowed: ids of content the team authored, counts, lengths, durations, scores, booleans, codes from a closed list the team defines.
- Not allowed: anything a user typed, said or uploaded (queries, messages, transcripts, names, topics they wrote), contact details, precise location, health or financial details, raw error messages that may echo user input.
- Strings are truncated to a fixed length; nested objects and lists are dropped, unless the project explicitly allows them.
- Text the team authored (a target sentence from published content) is allowed when it is identical for every user.

## Allowlists
- When the project sanitizes properties through allowlists, a new key is added to each layer (client and server). A key missing from one layer is silently dropped there, which reads as "not instrumented" later.
- The register records each allowed key and why it is safe.

## Consent and age
- Events are emitted only for users whose consent state allows it; the wrapper enforces this, including for person properties.
- Users below the project's tracking age emit nothing behavioural: consent is forced off, the SDK is opted out, and tracking prompts are never shown. The lockout holds on a shared device and on upgrade from an older build.
- An age or consent gate itself emits no events, because it runs before consent exists.
- Changing what is collected may change the store privacy disclosures; flag it to the owner (app-store-compliance decides).
