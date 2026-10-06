# Campaign — <slug>

Status: design | live | stopped (<reason>). Owner: <who switches it on>. Launched: <date>. Readout: <date>.

## 1. Cohort
Definition (events and properties from the measurement plan, with the exact names):
Size today (query and date):
Excluded (paid users, users in trial, users in another running campaign):

## 2. Moment
Sends when, counted from which event, in which timezone:

## 3. Channel and message
Channel and message type:
Copy (project locale), one call to action:
Deep link and where it lands:
Plumbing needed that does not exist yet (with the issue link), or "none":

## 4. Kill switch
What turns it off without a build, and who can flip it:

## 5. Measurement
Open event:
Target behaviour:
Holdout: <percent>, assigned by <hash of user id> — or "pending: <issue>", comparing with the previous 14 days instead:

## 6. Limits
Frequency cap across all messages:
Who never receives it:

## Readout
| Cohort | Sent | Opened | Target (treated) | Target (holdout) | Difference | N per arm |
| --- | --- | --- | --- | --- | --- | --- |

Decision: keep / change one thing / stop — with the reason.
