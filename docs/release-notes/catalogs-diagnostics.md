---
title: Diagnostics Adapters — Release Notes
sidebar_label: Diagnostics Adapters
description: "Version history and changelogs for every adapter and library in the Linkiir Diagnostics Adapters catalog, with the current version of each."
keywords: [release notes, Diagnostics Adapters, versions, changelog, upgrade, lkdx]
---

# Diagnostics Adapters — Release Notes

Results and signals arriving from an instrument: laboratories, imaging, and devices.

| | |
| --- | --- |
| **Catalog** | [Diagnostics Adapters](../adapters/catalogs/diagnostics.md) |
| **Catalog id** | `lkdx` |
| **Repository** | [https://github.com/Linkiir/linkiir-diagnostics-adapters](https://github.com/Linkiir/linkiir-diagnostics-adapters) |
| **Minimum Grid version** | 1.0.0 |

---

## Current versions

### Adapters

| Adapter | Current version | Node type id | Changelog |
| --- | --- | --- | --- |
| [Dexcom Authorize](../adapters/dexcom.md) | **1.0.0** | `LKDX_DEXCOM_AUTHORIZE` | [history](#dexcom-authorize) |
| [Dexcom Read EGV](../adapters/dexcom.md) | **1.0.0** | `LKDX_DEXCOM_READ_EGV` | [history](#dexcom-read-egv) |

### Libraries

| Library | Current version | Changelog |
| --- | --- | --- |
| `dexcom_cgm` | **1.0.0** | [history](#dexcom_cgm) |

:::tip[Checking what you are on]
Open the node in the Builder: the adapter version it was built from is shown on the node, and **Settings → Catalogs** lists every node whose adapter or library has a newer release. See [how to upgrade](./catalogs.md#upgrading-to-a-newer-version).
:::

---

## Adapter history

### Dexcom Authorize

`LKDX_DEXCOM_AUTHORIZE` · current **1.0.0** · [configuration](../adapters/dexcom.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Serves a page that runs Dexcom's three-legged user authorization and stores the resulting token pair.

### Dexcom Read EGV

`LKDX_DEXCOM_READ_EGV` · current **1.0.0** · [configuration](../adapters/dexcom.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Reads estimated glucose values on a timer, refreshing and persisting the rotating token pair.

## Library history

Library versions are immutable: a published version is never edited, and a fix ships as a new version. A node stays pinned to the version it was built against until you move it forward.

### `dexcom_cgm`

current **1.0.0**

#### 1.0.0

_Released 2026-09-17_

- Initial release. Three-legged OAuth, rotating token refresh, data-range and EGV reads, with a single-row token store.

## Next

- [Linkiir Catalogs Release Notes](./catalogs.md) — every catalog, and how to upgrade
- [Diagnostics Adapters](../adapters/catalogs/diagnostics.md) — what this catalog contains and how to subscribe
