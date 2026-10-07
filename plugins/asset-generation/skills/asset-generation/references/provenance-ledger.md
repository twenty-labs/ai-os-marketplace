# Provenance ledger

A ledger answers three questions without regenerating anything: where did this asset come from, is it still valid for the text or prompt it serves, and what did it cost. Keep it committed beside the assets (one file per asset set is fine), written by the generation script, never by hand.

## One entry per asset

| Field | Why |
| --- | --- |
| Asset key or path | The identity the product references |
| Kind | image, icon, illustration, voice clip, music |
| Input | The exact prompt or spoken text, after templating |
| Style or voice version | The style anchor's version or hash; the voice id and any persona or delivery tags |
| Engine and model | Vendor, model name and version, quality or size setting |
| Input hash | A hash over everything that changes the output (input, voice, tags, engine, model, quality, style version) |
| Output hash and size | Detects a file replaced or corrupted outside the script |
| Date | When it was generated |
| Cost | Actual units billed (characters, images, seconds) and the money amount when known |
| Licence | The tool's commercial-use terms at generation time, or the third-party licence and credit |
| Reviewed | Who approved it and when; empty means not shippable |

Never store an API key, an account id that grants access, or a child's or user's recording in the ledger.

## How scripts use it

- **Plan:** for each wanted asset, compute the input hash. Same hash in the ledger, and the output hash matches the file: skip. Different or missing: plan a generation. Print the plan and its estimate (dry run) before any paid call.
- **Write after success:** an entry is written only after the asset was generated and stored, so a failure is retried on the next run instead of being recorded as done.
- **Never skip on existence alone.** When a stable key is reused for new text, the old file sits at the right path with the wrong content; only the hash comparison catches it.
- **Record-only mode:** when assets already in the store are known to be correct but the ledger is new, record their entries from the current inputs without generating, after the owner confirms they are correct.
- **Force:** regenerating everything regardless of the ledger is an explicit flag with its own estimate and yes.
- **Pruning:** an asset no longer referenced is reported first; deleting it from the store is a separate step with a yes.

## Cost

Record the unit costs and billing quirks found by measurement (whether markup or tags are billed, a minimum charge per request, how retries are billed) in content-surface or design-surface, dated. Compare estimate and actual in every run report; a large gap updates the estimate.
