---
title: Developer Tools
description: "The Linkiir Developer Tools catalog: a Data Simulator that emits synthetic HL7 v2, C-CDA, FHIR and X12 messages for building and load-testing interfaces. Subscribe from the public repository https://github.com/Linkiir/linkiir-devtools."
keywords: [developer tools, data simulator, test data, HL7 v2, C-CDA, FHIR, X12, load testing, synthetic data]
---

# Developer Tools

Tools for building and testing interfaces: synthetic data generation, and more
to come. These are workflow nodes you build *with*, rather than adapters that
connect to an external system.

| | |
| --- | --- |
| **Repository** | [https://github.com/Linkiir/linkiir-devtools](https://github.com/Linkiir/linkiir-devtools) |
| **Catalog id** | `lktool` |
| **Tools** | 1 |
| **Libraries** | 0 |
| **Publisher** | Linkiir Inc |

:::note
This catalog holds **tools**, not adapters. Because a tool connects to nothing in
particular, it is useful on every grid regardless of which systems you integrate
with — so it lives here rather than in one of the protocol or vendor catalogs.
:::

## Subscribe to this catalog

In Grid, open **Settings → Catalogs** and click **Subscribe to a catalog**.

| Field | Value |
| --- | --- |
| **Repository URL or folder** | `https://github.com/Linkiir/linkiir-devtools` |
| **Branch or tag** | `main` |
| **SSH key** | Leave empty — this is a public repository, cloned anonymously |
| **CA bundle** | Leave empty |

```
https://github.com/Linkiir/linkiir-devtools
```

Full walkthrough: [Subscribing to a Catalog](../../catalogs/subscribing.md).

:::info[Subscribing needs a permission]
Every catalog operation — subscribing, updating and removing — needs the
Administration-tier **Manage catalogs** permission. See
[Users and Roles](../../administration/configurations/user-roles.md).
:::

## Tools in this catalog

| Tool | Node type | Trigger | Version | Node type id | Documentation |
| --- | --- | --- | --- | --- | --- |
| [Data Simulator](../data-simulator.md) | source | interval | 1.0.0 | `LKTOOL_DATA_SIMULATOR` | see page |

### Data Simulator

Emits synthetic messages on every poll interval and pushes them onto the queue,
with the message type chosen from a dropdown. Covers **HL7 v2.5.1 ADT^A01**,
**C-CDA R2.1 CCD**, **FHIR R4 Patient** and **Observation**, and **X12 5010 270
and 271**. Use it to build and load-test an interface before a live feed exists.

`LKTOOL_DATA_SIMULATOR` · source node · no library ·
[Configuration and message types](../data-simulator.md)

All output is synthetic — invented names, addresses, identifiers and payers — so
it carries no PHI and is safe to share.

## Libraries in this catalog

None. The Data Simulator is self-contained, so there is nothing extra to install.

## Next

- [Adapter Catalogs](index.md) — every published Linkiir catalog
- [Developer Tools release notes](../../release-notes/catalogs-devtools.md) — current version and changelog for every item here
- [Using Catalog Content](../../catalogs/using-catalog-content.md) — build a node from a catalog item and keep it updated
- [Interfaces and Core Nodes](../../interface-development/interfaces/index.md)
