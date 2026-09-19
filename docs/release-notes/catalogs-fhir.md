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
| [HAPI FHIR / OmniVera Adapter](../adapters/hapi-fhir.md) | **1.0.0** | `LKFHIR_HAPI_FHIR_ADAPTER` | [history](#hapi-fhir--omnivera-adapter) |
| [Epic FHIR Adapter](../adapters/epic.md) | **1.0.0** | `LKFHIR_EPIC_ADAPTER` | [history](#epic-fhir-adapter) |
| [Cerner FHIR Adapter](../adapters/cerner.md) | **1.0.0** | `LKFHIR_CERNER_FHIR_ADAPTER` | [history](#cerner-fhir-adapter) |
| [eCW Adapter](../adapters/ecw.md) | **1.0.0** | `LKFHIR_ECW_ADAPTER` | [history](#ecw-adapter) |
| [ModMed Adapter](../adapters/modmed.md) | **1.0.0** | `LKFHIR_MODMED_ADAPTER` | [history](#modmed-adapter) |
| [Athena Adapter](../adapters/athena.md) | **1.0.0** | `LKFHIR_ATHENA_ADAPTER` | [history](#athena-adapter) |
| [FHIR Resource Creator](../adapters/fhir-resource-creator.md) | **1.1.0** | `LKFHIR_FHIR_RESOURCE_CREATOR` | [history](#fhir-resource-creator) |
| [FHIR Validator](../adapters/fhir-validator.md) | **1.0.0** | `LKFHIR_FHIR_VALIDATOR` | [history](#fhir-validator) |
| [FHIR Profiling Tools](../adapters/fhir-profiling-tools.md) | **1.1.0** | `LKFHIR_FHIR_PROFILING_TOOLS` | [history](#fhir-profiling-tools) |

### Libraries

| Library | Current version | Changelog |
| --- | --- | --- |
| `hapi_fhir` | **1.0.0** | [history](#hapi_fhir) |
| `epic_fhir` | **1.0.0** | [history](#epic_fhir) |
| `cerner_fhir` | **1.0.0** | [history](#cerner_fhir) |
| `ecw_fhir` | **1.0.0** | [history](#ecw_fhir) |
| `modmed_fhir` | **1.0.0** | [history](#modmed_fhir) |
| `athena_health` | **1.0.0** | [history](#athena_health) |
| `fhir_creator` | **1.0.0** | [history](#fhir_creator) |
| `fhir_validate` | **1.0.0** | [history](#fhir_validate) |
| `fhir_profiling` | **1.1.0** | [history](#fhir_profiling) |

:::tip[Checking what you are on]
Open the node in the Builder: the adapter version it was built from is shown on the node, and **Settings → Catalogs** lists every node whose adapter or library has a newer release. See [how to upgrade](./catalogs.md#upgrading-to-a-newer-version).
:::

---

## Adapter history

### HAPI FHIR / OmniVera Adapter

`LKFHIR_HAPI_FHIR_ADAPTER` · current **1.0.0** · [configuration](../adapters/hapi-fhir.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Polls a HAPI FHIR or Smile OmniVera endpoint on an interval and pushes each returned resource downstream as JSON.
- FHIR R4 (4.0.1) and R5 (5.0.0), selected by the FHIR Base URL and negotiated with the `fhirVersion` media-type parameter.
- Four authentication modes: none for an open test endpoint, OAuth2 Backend Services for a production OmniVera deployment, a static bearer token, and basic auth.
- OAuth2 discovers the token endpoint from `.well-known/smart-configuration` when no Token URL is configured.
- Reads the server's CapabilityStatement once per start and warns when the release it reports differs from the configured FHIR Version.
- Follows search-result Bundle paging up to Max Pages, and pushes what it collected even when a later page fails.

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

`LKFHIR_FHIR_RESOURCE_CREATOR` · current **1.1.0** · [configuration](../adapters/fhir-resource-creator.md)

#### 1.1.0

_Released 2026-09-18_

- Rebuilt on the new `fhir_creator` helper library with a small, readable mapping in the node script, replacing the previous mapping engine. It adds only the fields the message carries, so the output has no empty scaffolding and no `null` placeholders, and `active: false` is preserved rather than dropped.
- No configuration fields — the mapping lives in the node script, and a template from the Profile Designer is the field reference.

#### 1.0.0

_Released 2026-09-17_

- Initial release. Maps inbound patient data onto a FHIR R4 Patient resource and strips unused fields. No network calls.

### FHIR Validator

`LKFHIR_FHIR_VALIDATOR` · current **1.0.0** · [configuration](../adapters/fhir-validator.md)

#### 1.0.0

_Released 2026-09-18_

- Initial release. Validates an inbound FHIR resource against a FHIR server's `$validate` operation and forwards it only when it validates.
- Two settings — a FHIR Server URL and an optional profile canonical URL. TLS verification and the request timeout are internal defaults.
- Strict tri-state verdict — valid, invalid, unknown — and fails closed: a timeout, an HTTP error, a malformed response, or an unresolvable profile all yield unknown, never a false verdict. HTTP 200 is not treated as the verdict (the OperationOutcome is).
- The resource is sent byte-for-byte and forwarded unchanged on valid; anything short of a clean pass stops the node.

### FHIR Profiling Tools

`LKFHIR_FHIR_PROFILING_TOOLS` · current **1.1.0** · [configuration](../adapters/fhir-profiling-tools.md)

#### 1.1.0

_Released 2026-09-18_

- Added the **Profile Designer**: lists a base resource's constrainable elements, compiles a constraint spec into a differential `StructureDefinition`, and imports an existing one while preserving it whole. The output is a differential, not a snapshot, and is not a conformance check.
- The existing resource-template and browser UI are unchanged.

#### 1.0.0

_Released 2026-09-17_

- Initial release. Serves a browser UI listing FHIR resources and types, and returns a JSON template for any of them.

## Library history

Library versions are immutable: a published version is never edited, and a fix ships as a new version. A node stays pinned to the version it was built against until you move it forward.

### `hapi_fhir`

current **1.0.0**

#### 1.0.0

_Released 2026-09-17_

- Initial release. HAPI FHIR and Smile OmniVera client. Takes the FHIR base URL whole rather than assembling a path, so it reaches the public sandbox, a self-hosted `hapi-fhir-jpaserver`, and an OmniVera deployment unchanged.
- Read and write: `search`, `searchAll` with Bundle paging, `read`, `create`, `update`, `delete`, `transaction`, `operation`, `capabilities`, `serverVersion` and `authenticate`.
- `transactionBundle()` builds an all-or-nothing Bundle, so an HL7 v2 message that maps to several resources lands completely or not at all.
- Token caching with an expiry skew, keyed per credential and endpoint.

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

### `fhir_creator`

current **1.0.0**

#### 1.0.0

_Released 2026-09-18_

- Initial release. Helpers for hand-building a FHIR resource in a node script: start a resource and append name, identifier, telecom and address, adding only populated fields, then serialize to JSON. Absent, empty and null inputs are omitted by construction, so the output needs no null cleanup. No network or authentication.

### `fhir_validate`

current **1.0.0**

#### 1.0.0

_Released 2026-09-18_

- Initial release. Remote FHIR `$validate` client. Returns a strict valid / invalid / unknown verdict and fails closed. Detects an unresolvable profile by OperationOutcome issue code, not by matching diagnostic text. Sends the resource byte-for-byte. Designed to be called from an adapter before it sends.

### `fhir_profiling`

current **1.1.0**

#### 1.1.0

_Released 2026-09-18_

- Added profile authoring: `baseElements`, `buildProfile` (differential `StructureDefinition`), and `importProfile` (preserves an imported definition whole), and powers the Profile Designer. 1.0.0 remains published for nodes pinned to it.

#### 1.0.0

_Released 2026-09-17_

- Initial release. Loads FHIR specification profiles from SQLite and generates JSON templates.

## Next

- [Linkiir Catalogs Release Notes](./catalogs.md) — every catalog, and how to upgrade
- [FHIR Adapters](../adapters/catalogs/fhir.md) — what this catalog contains and how to subscribe
