---
title: Catalogs — Data Simulator 1.0.0
sidebar_label: Data Simulator 1.0.0
description: First release of the Linkiir Developer Tools catalog — a Data Simulator that emits synthetic HL7 v2.5.1 ADT, C-CDA R2.1, FHIR R4 and X12 5010 270/271 messages for building and load-testing interfaces.
keywords: [catalog release, data simulator, developer tools, test data, HL7 v2, C-CDA, FHIR, X12]
---

# Catalogs — Data Simulator 1.0.0

**Released:** 2026-09-17

A new catalog, **[Developer Tools](../adapters/catalogs/devtools.md)**, and its
first tool: a **[Data Simulator](../adapters/data-simulator.md)** that generates
synthetic messages so an interface can be built and load-tested before a live
feed exists.

## New catalog

| Catalog | Catalog id | Repository |
| --- | --- | --- |
| [Developer Tools](../adapters/catalogs/devtools.md) | `lktool` | `https://github.com/Linkiir/linkiir-devtools` |

This catalog holds **tools** rather than adapters. An adapter connects a workflow
to an external system; a tool is used while building or testing one and connects
to nothing in particular. Keeping them apart means a grid can take the tools
without subscribing to a protocol or vendor catalog it does not otherwise need.

## New tool

| Tool | Node type | Version | Node type id |
| --- | --- | --- | --- |
| [Data Simulator](../adapters/data-simulator.md) | source | 1.0.0 | `LKTOOL_DATA_SIMULATOR` |

A Source Custom node that emits messages on every poll interval and pushes them
onto the queue, with the message type chosen from a dropdown:

| Message type | Standard |
| --- | --- |
| ADT^A01 (Admit) | HL7 v2.5.1 |
| CCD | C-CDA R2.1 |
| Patient | FHIR R4 |
| Observation (body weight) | FHIR R4 |
| 270 Eligibility Inquiry | X12 5010 (005010X279A1) |
| 271 Eligibility Response | X12 5010 (005010X279A1) |

Configurable interval, messages per interval (capped at 1000), optional queue
topic, a fixed-seed mode for repeatable runs, and Live Mode for a dry run that
generates without queuing.

**No PHI.** Every name, address, identifier and payer is invented. Three fixed
synthetic patients are rotated so repeated messages describe a stable population,
which is what an upsert or patient-match rule needs. Output is safe to share,
commit and attach to a support ticket.

## Getting it

**Settings → Catalogs → Subscribe**, then:

```
https://github.com/Linkiir/linkiir-devtools
```

Public repository, cloned anonymously — no SSH key needed. Requires the
Administration-tier **Manage catalogs** permission.

## Requirements

- Linkiir Grid **v1.0.0** or later.
- No library is installed with this node; it is self-contained.

## Known scope

This first release covers one message type per standard rather than an exhaustive
set. More will be added, and the dropdown grows without changing anything you
have already configured.

A simulator is realistic in shape but is not a recording of a real system. Before
go-live, test against de-identified samples from the actual sending system —
vendor quirks are what a simulator cannot invent.

## Next

- [Data Simulator](../adapters/data-simulator.md) — configuration and common setups
- [Developer Tools](../adapters/catalogs/devtools.md) — the catalog
- [Subscribing to a Catalog](../catalogs/subscribing.md)
