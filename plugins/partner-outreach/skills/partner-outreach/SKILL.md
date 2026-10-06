---
name: partner-outreach
description: Use when acquiring users through partners or communities — building a partner list, writing a pitch or follow-up for one partner, seeding a group with gifts or codes, and measuring what each partner brings. NOT for paid ads or mass email campaigns.
---

# Partner outreach

Partners (schools, clubs, agencies, communities, complementary products, creators) can bring users that no paid channel can buy — people who arrive together and are nudged by someone they trust. This skill runs that channel: who to approach, what to say to each, how to seed them, and what each one brings.

It **drafts; the owner sends.** Never send a message, create a gift or code, or contact anyone on the owner's behalf without approval for that specific action. If the project enabled the external `cold-email`, `co-marketing` or `community-marketing` skills, use them for craft.

## Three jobs

| Job | Output | Recorded in |
| --- | --- | --- |
| **list** | prioritized partners with a status each | `outreach/partners.md` — a registry; rows are never deleted |
| **pitch / follow-up** | one message for one partner | `outreach/messages/<slug>-YYYY-MM-DD.md` |
| **seed** | a group given access (gift, code, trial), measured at day 7 and day 30 | `outreach/partners.md` and `outreach/seeds/<slug>.md` |

Build the list from sources the owner provides or public directories — never invent partners or contact details.

## Pitch

1. **Promise what the partner cares about**, not what end users care about — less work for them, results they can show, no cost, no disruption to what they already do.
2. **One call to action** — a short call, or "send me a list of N people to give access to". Never both.
3. **Say only what the product does today.** Check the offer catalog and the brand voice's allowed claims; never promise a dashboard, report or integration that does not exist.
4. **One message per recipient**, addressed to them, in the channel they actually use (email, messaging app, social, phone). No visible templates, no bulk sends.

## Seed a group

1. Create the partner's identifier (code, link, or group) so its users can be told apart — record it in the registry.
2. Prepare the gift or access for each person, tagged with the partner and group so redemptions join back. Check that delivery (email sending, links) works in that environment before creating anything.
3. Give the partner a one-paragraph instruction for their people.
4. **Measure at day 7 and day 30**: given, claimed, linked to the partner, activated, paid — from the ledger and analytics, with the queries saved in the seed file. Add the partner contact's own words; the first few groups are qualitative data worth more than any number.

## Rules

- Status ladder per partner: not contacted → sent → met → seeding → running → stopped (reason). One contact person per partner.
- Follow up after about five working days, at most twice.
- No revenue share or partner-specific discounts until the first groups show real use.
- If measuring a partner requires a product change (a missing property, a code field), open an issue in the code repository before the second seed.
