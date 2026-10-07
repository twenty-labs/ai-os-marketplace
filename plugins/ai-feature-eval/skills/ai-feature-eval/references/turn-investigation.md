# Investigating one turn or session

Read-only. Goal: attribute the problem to one stage and one provider, with a number.

## 1. Get the data

- The turn's structured log line (session id, turn id, per-stage latency, flags such as truncated), from the log store ai-surface names.
- The ledger rows for the same session: units, cost, estimated or unpriced.
- Today's per-stage baseline (p50, p95) from the metrics endpoint or aggregator, if the project has one.
- Transcript or audio only when ai-surface allows it for debugging, and never copied into an issue or a chat.

## 2. Attribute the stage

| Symptom | Stage | First places to look |
| --- | --- | --- |
| Slow to notice the user stopped | end-of-speech detection | endpointing settings, network to the recognizer |
| Slow final transcript | speech recognition | provider config, reconnects, chunk size |
| Slow first token | model | model choice, prompt size, rate limits, streaming setup |
| Slow first audio byte | text-to-speech | voice and model, connection handshake |
| Stages fast but total slow | orchestration | backpressure, buffering, serial calls that could overlap |
| Errors up, latency normal | provider connection | idle timeouts, half-open sockets, reconnect handling |
| Wrong or odd answer | prompt or context | the exact prompt version, history window, truncation |
| Wrong score | scorer | input format (sample rate, codec), reference text, known scorer limits in ai-surface |
| Cost spike | ledger | unit counts per call, retries, a model switch, unpriced rows |

## 3. Report

```
Stage: <stage>
Provider: <provider or none>
Observed: <field>=<value> (today p50 <value>, baseline <value>)
Likely cause: <one sentence>
Next check: <one concrete command, query or file>
```

A cause you could not confirm is stated as the next check, not as the answer.
