---
title: Data Simulator
sidebar_label: Data Simulator
description: Configure the Linkiir Data Simulator to emit synthetic HL7 v2, C-CDA, FHIR or X12 messages on a timer, for building and load-testing an interface before a live feed exists.
keywords: [data simulator, test data, synthetic data, HL7 v2, ADT, C-CDA, CCD, FHIR, X12, 270, 271, load testing]
---

# Data Simulator

A **Source Custom** node that generates synthetic messages on every poll interval
and pushes them onto the queue. Choose the message type from a dropdown.

Published in the **[Developer Tools](catalogs/devtools.md)** catalog. Subscribe to
that catalog to add this node to your grid — see
[Adapter Catalogs](catalogs/index.md).

Current version and changelog: [Developer Tools release notes](../release-notes/catalogs-devtools.md).

## What it does

On each interval the node builds the number of messages you asked for, fills each
one with data from a small pool of synthetic patients, and pushes it downstream.
There is no external system involved and nothing to authenticate against.

```text
Data Simulator  →  your transform  →  your destination
   (interval)
```

Use it to develop an interface before the sending system is available, to
exercise a transform against a known input, or to put measurable load through a
workflow.

## Message types

| Option | Produces |
| --- | --- |
| **HL7 v2.5.1 ADT^A01 (Admit)** | Pipe-delimited admit with `MSH`, `EVN`, `PID`, `NK1`, `PV1`, two `OBX` vitals, `AL1` and `DG1`. Carriage-return segment separators. |
| **C-CDA R2.1 CCD** | Continuity of Care Document with a conformant header (`templateId` extension `2015-08-01`) plus Allergies and Problems sections. |
| **FHIR R4 Patient** | US Core–profiled `Patient` with an `MR` identifier, name, telecom, gender, birth date and address. |
| **FHIR R4 Observation** | Vital-signs `Observation` for body weight (LOINC `29463-7`), referencing the same patient. |
| **X12 5010 270 (Eligibility Inquiry)** | Complete interchange: `ISA`/`GS` envelope, a `005010X279A1` eligibility inquiry, `GE`/`IEA`. |
| **X12 5010 271 (Eligibility Response)** | The matching response for the same member — active coverage, a co-payment and a deductible benefit line. |

More types will be added over time. The dropdown grows; nothing already
configured changes.

## Configuration

| Field | Type | Default | What it does |
| --- | --- | --- | --- |
| **Interval** | number | `10000` | Milliseconds between batches. `10000` is ten seconds. |
| **Message Type** | list | HL7 ADT^A01 | Which message to generate. |
| **Messages Per Interval** | number | `1` | How many messages to emit each interval. Capped at 1000. |
| **Topic** | string | _(empty)_ | Optional queue topic. Leave empty to use the node's configured destination, which is what a normal workflow wants. |
| **Randomize Content** | bool | `true` | On, each message picks a patient at random. Off, patients are used in a fixed rotation. |
| **Random Seed** | number | `0` | `0` varies output on every start. Any other value pins the sequence. |
| **Live Mode** | bool | `true` | When off, messages are generated and counted but never queued. |

## Common setups

### A demo feed

The defaults. One message every ten seconds is enough to watch a workflow work
without filling the log.

### A repeatable test

For a regression test you want identical messages every run:

| Field | Value |
| --- | --- |
| Randomize Content | off |
| Random Seed | `42` (any non-zero value) |

The node then walks its patient list in a fixed order and produces the same
sequence on every start, so a downstream assertion can be exact.

### A load test

Throughput is **Messages Per Interval ÷ Interval**. For roughly 100 messages a
second:

| Field | Value |
| --- | --- |
| Messages Per Interval | `100` |
| Interval | `1000` |

Raise it in steps and watch queue depth on the [Monitor](../administration/logs/index.md)
page. The point is usually to find where your transform becomes the limit, not
the simulator.

### Confirming configuration before producing traffic

Set **Live Mode** off and start the node. It builds messages and logs a count
without queuing anything, so you can confirm the node runs cleanly before it
starts filling a topic.

## No PHI

Every name, address, identifier and payer is invented. Three fixed synthetic
patients are rotated, so repeated messages describe a stable population — an
upsert or patient-match rule needs the same MRN to recur rather than seeing an
endless stream of strangers.

Because the data is synthetic, output is safe to share, commit to a repository,
and attach to a support ticket.

:::caution[A simulator is not a substitute for vendor data]
The messages are realistic in shape and structurally valid, but they are not a
recording of a real system. Before go-live, test against de-identified samples
from the actual sending system. Vendor quirks are precisely what a simulator
cannot invent for you.
:::

## Sample output

A sample of every message type ships in the repository under
[`nodes/data_simulator/samples/`](https://github.com/Linkiir/linkiir-devtools/tree/main/nodes/data_simulator/samples),
so you can see the exact shape before subscribing. The same files are copied into
your node when you build it.

## Adding your own message type

Templates are literal text with `{{TOKEN}}` placeholders rather than
grammar-built messages, so what you read in `samples.lua` is exactly what gets
queued. To add a type, [unlink the node](../catalogs/using-catalog-content.md)
from the catalog to take ownership of its files, then add one entry to
`samples.lua` and one option to the **Message Type** dropdown.

Unlinking stops the node following catalog updates, so if the addition is
generally useful, ask Linkiir to include it instead and you keep the updates.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| `unknown Message Type '...'` in the node log | The **Message Type** value does not match a template. Re-pick it from the dropdown rather than typing it. |
| Nothing arrives downstream | **Live Mode** is off — messages are generated but not queued. |
| `push failed after N of M` | The queue refused a write. Check the broker is running and the topic exists; see [Kafka and Redpanda](../administration/configurations/kafka-redpanda.md). |
| `{{SOMETHING}}` visible in output | A template references a token that does not exist. Unsubstituted tokens are left visible on purpose rather than blanked, so the typo is obvious. |

## Next

- [Developer Tools](catalogs/devtools.md) — the catalog this node comes from
- [Using Catalog Content](../catalogs/using-catalog-content.md)
- [How Adapters Work](how-adapters-work.md)
