---
title: FHIR Adapters — Release Notes
sidebar_label: FHIR Adapters
description: "Version history and changelogs for every adapter and library in the Linkiir FHIR Adapters catalog, with the current version of each."
keywords: [release notes, FHIR Adapters, versions, changelog, upgrade, lkfhir]
---

# FHIR Adapters — Release Notes

FHIR-native EHR and EMR APIs, and FHIR authoring tools.

| | |
| --- | --- |
| **Catalog** | [FHIR Adapters](../adapters/catalogs/fhir.md) |
| **Catalog id** | `lkfhir` |
| **Repository** | [https://github.com/Linkiir/linkiir-fhir-adapters](https://github.com/Linkiir/linkiir-fhir-adapters) |
| **Minimum Grid version** | 1.0.0 |

---

## Current versions

### Adapters

| Adapter | Current version | Node type id | Changelog |
| --- | --- | --- | --- |
| [Epic FHIR Adapter](../adapters/epic.md) | **1.0.0** | `LKFHIR_EPIC_ADAPTER` | [history](#epic-fhir-adapter) |
| [Cerner FHIR Adapter](../adapters/cerner.md) | **1.0.0** | `LKFHIR_CERNER_FHIR_ADAPTER` | [history](#cerner-fhir-adapter) |
| [eCW Adapter](../adapters/ecw.md) | **1.0.0** | `LKFHIR_ECW_ADAPTER` | [history](#ecw-adapter) |
| [ModMed Adapter](../adapters/modmed.md) | **1.0.0** | `LKFHIR_MODMED_ADAPTER` | [history](#modmed-adapter) |
| [Athena Adapter](../adapters/athena.md) | **1.0.0** | `LKFHIR_ATHENA_ADAPTER` | [history](#athena-adapter) |
| [FHIR Resource Creator](../adapters/fhir-resource-creator.md) | **1.0.0** | `LKFHIR_FHIR_RESOURCE_CREATOR` | [history](#fhir-resource-creator) |
| [FHIR Profiling Tools](../adapters/fhir-profiling-tools.md) | **1.0.0** | `LKFHIR_FHIR_PROFILING_TOOLS` | [history](#fhir-profiling-tools) |

### Libraries

| Library | Current version | Changelog |
| --- | --- | --- |
| `epic_fhir` | **1.0.0** | [history](#epic_fhir) |
| `cerner_fhir` | **1.0.0** | [history](#cerner_fhir) |
| `ecw_fhir` | **1.0.0** | [history](#ecw_fhir) |
| `modmed_fhir` | **1.0.0** | [history](#modmed_fhir) |
| `athena_health` | **1.0.0** | [history](#athena_health) |
| `fhir_resource` | **1.0.0** | [history](#fhir_resource) |
| `fhir_profiling` | **1.0.0** | [history](#fhir_profiling) |

:::tip[Checking what you are on]
Open the node in the Builder: the adapter version it was built from is shown on the node, and **Settings → Catalogs** lists every node whose adapter or library has a newer release. See [how to upgrade](./catalogs.md#upgrading-to-a-newer-version).
:::

---

## Adapter history

### Epic FHIR Adapter

`LKFHIR_EPIC_ADAPTER` · current **1.0.0** · [configuration](../adapters/epic.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Polls an Epic FHIR endpoint on an interval using SMART backend services authentication and pushes each returned resource downstream as JSON.

### Cerner FHIR Adapter

`LKFHIR_CERNER_FHIR_ADAPTER` · current **1.0.0** · [configuration](../adapters/cerner.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Polls an Oracle Health / Cerner FHIR endpoint using a signed JWT client assertion.

### eCW Adapter

`LKFHIR_ECW_ADAPTER` · current **1.0.0** · [configuration](../adapters/ecw.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Polls an eClinicalWorks FHIR endpoint, authenticating against its separate token endpoint.

### ModMed Adapter

`LKFHIR_MODMED_ADAPTER` · current **1.0.0** · [configuration](../adapters/modmed.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Polls a ModMed FHIR endpoint using password and refresh-token authentication with an API key.

### Athena Adapter

`LKFHIR_ATHENA_ADAPTER` · current **1.0.0** · [configuration](../adapters/athena.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Polls Athena Health for a practice, supporting both the proprietary REST API and the FHIR R4 API.

### FHIR Resource Creator

`LKFHIR_FHIR_RESOURCE_CREATOR` · current **1.0.0** · [configuration](../adapters/fhir-resource-creator.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Maps inbound patient data onto a FHIR R4 Patient resource and strips unused fields. No network calls.

### FHIR Profiling Tools

`LKFHIR_FHIR_PROFILING_TOOLS` · current **1.0.0** · [configuration](../adapters/fhir-profiling-tools.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Serves a browser UI listing FHIR resources and types, and returns a JSON template for any of them.

## Library history

Library versions are immutable: a published version is never edited, and a fix ships as a new version. A node stays pinned to the version it was built against until you move it forward.

### `epic_fhir`

current **1.0.0**

#### 1.0.0

_Released 2026-09-17_

- Initial release. SMART backend services authentication, with search, read, create, update and operation helpers.

### `cerner_fhir`

current **1.0.0**

#### 1.0.0

_Released 2026-09-17_

- Initial release. SMART backend services authentication with a `kid`-headed JWT client assertion.

### `ecw_fhir`

current **1.0.0**

#### 1.0.0

_Released 2026-09-17_

- Initial release. JWT client-credentials against a separate token endpoint, plus bulk export helpers.

### `modmed_fhir`

current **1.0.0**

#### 1.0.0

_Released 2026-09-17_

- Initial release. Password and refresh-token authentication with an API key.

### `athena_health`

current **1.0.0**

#### 1.0.0

_Released 2026-09-17_

- Initial release. client_credentials OAuth for both the proprietary REST API and the FHIR R4 API.

### `fhir_resource`

current **1.0.0**

#### 1.0.0

_Released 2026-09-17_

- Initial release. Builds a FHIR R4 Patient from inbound data. No network or authentication.

### `fhir_profiling`

current **1.0.0**

#### 1.0.0

_Released 2026-09-17_

- Initial release. Loads FHIR specification profiles from SQLite and generates JSON templates.

## Next

- [Linkiir Catalogs Release Notes](./catalogs.md) — every catalog, and how to upgrade
- [FHIR Adapters](../adapters/catalogs/fhir.md) — what this catalog contains and how to subscribe
