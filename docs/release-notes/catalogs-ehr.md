---
title: EHR Adapters — Release Notes
sidebar_label: EHR Adapters
description: "Version history and changelogs for every adapter and library in the Linkiir EHR Adapters catalog, with the current version of each."
keywords: [release notes, EHR Adapters, versions, changelog, upgrade, lkehr]
---

# EHR Adapters — Release Notes

EHR, EMR and practice-management systems reached over a proprietary API rather than FHIR.

| | |
| --- | --- |
| **Catalog** | [EHR Adapters](../adapters/catalogs/ehr.md) |
| **Catalog id** | `lkehr` |
| **Repository** | [https://github.com/Linkiir/linkiir-ehr-adapters](https://github.com/Linkiir/linkiir-ehr-adapters) |
| **Minimum Grid version** | 1.0.0 |

---

## Current versions

### Adapters

| Adapter | Current version | Node type id | Changelog |
| --- | --- | --- | --- |
| [PCC Connect](../adapters/pointclickcare.md) | **1.0.0** | `LKEHR_PCC_CONNECT` | [history](#pcc-connect) |
| [PCC Request](../adapters/pointclickcare.md) | **1.0.0** | `LKEHR_PCC_REQUEST` | [history](#pcc-request) |

### Libraries

| Library | Current version | Changelog |
| --- | --- | --- |
| `pcc_api` | **1.0.0** | [history](#pcc_api) |

:::tip[Checking what you are on]
Open the node in the Builder: the adapter version it was built from is shown on the node, and **Settings → Catalogs** lists every node whose adapter or library has a newer release. See [how to upgrade](./catalogs.md#upgrading-to-a-newer-version).
:::

---

## Adapter history

### PCC Connect

`LKEHR_PCC_CONNECT` · current **1.0.0** · [configuration](../adapters/pointclickcare.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Obtains a PointClickCare access token on a timer and reads organisation facilities as a liveness check.

### PCC Request

`LKEHR_PCC_REQUEST` · current **1.0.0** · [configuration](../adapters/pointclickcare.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Makes an authenticated PointClickCare request driven by the inbound message, substituting `{orgUuid}` automatically.

## Library history

Library versions are immutable: a published version is never edited, and a fix ships as a new version. A node stays pinned to the version it was built against until you move it forward.

### `pcc_api`

current **1.0.0**

#### 1.0.0

_Released 2026-09-17_

- Initial release. Two-legged OAuth over mutual TLS by default; the three-legged authorization-code grant is implemented and enabled by configuration.

## Next

- [Linkiir Catalogs Release Notes](./catalogs.md) — every catalog, and how to upgrade
- [EHR Adapters](../adapters/catalogs/ehr.md) — what this catalog contains and how to subscribe
