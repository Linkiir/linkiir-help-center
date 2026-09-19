---
title: Developer Tools — Release Notes
sidebar_label: Developer Tools
description: "Version history and changelogs for every adapter and library in the Linkiir Developer Tools catalog, with the current version of each."
keywords: [release notes, Developer Tools, versions, changelog, upgrade, lktool]
---

# Developer Tools — Release Notes

Tools for building and testing interfaces, rather than adapters to an external system.

| | |
| --- | --- |
| **Catalog** | [Developer Tools](../adapters/catalogs/devtools.md) |
| **Catalog id** | `lktool` |
| **Repository** | [https://github.com/Linkiir/linkiir-devtools](https://github.com/Linkiir/linkiir-devtools) |
| **Minimum Grid version** | 1.0.0 |

---

## Current versions

### Adapters

| Adapter | Current version | Node type id | Changelog |
| --- | --- | --- | --- |
| [Data Simulator](../adapters/data-simulator.md) | **1.0.0** | `LKTOOL_DATA_SIMULATOR` | [history](#data-simulator) |

### Libraries

None — the content in this catalog is self-contained.

:::tip[Checking what you are on]
Open the node in the Builder: the adapter version it was built from is shown on the node, and **Settings → Catalogs** lists every node whose adapter or library has a newer release. See [how to upgrade](./catalogs.md#upgrading-to-a-newer-version).
:::

---

## Adapter history

### Data Simulator

`LKTOOL_DATA_SIMULATOR` · current **1.0.0** · [configuration](../adapters/data-simulator.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. A source node that emits synthetic messages on each poll interval and pushes them onto the queue, with the message type chosen from a dropdown.
- Message types: HL7 v2.5.1 ADT^A01, C-CDA R2.1 CCD, FHIR R4 Patient, FHIR R4 Observation, X12 5010 270 and 271.
- Configurable interval, messages per interval (capped at 1000), optional queue topic, fixed-seed mode for repeatable runs, and Live Mode for a dry run.
- All output is synthetic, so it carries no PHI.

## Next

- [Linkiir Catalogs Release Notes](./catalogs.md) — every catalog, and how to upgrade
- [Developer Tools](../adapters/catalogs/devtools.md) — what this catalog contains and how to subscribe
