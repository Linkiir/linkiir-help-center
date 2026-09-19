---
title: FHIR authoring update
sidebar_label: FHIR authoring update
description: An update to the Linkiir FHIR Adapters catalog — a new FHIR Validator, a simpler FHIR Resource Creator (1.1.0), and a redesigned Profiling Tools Profile Designer (1.1.0).
keywords: [catalog release, FHIR, validator, resource creator, profiling, profile designer]
---

# FHIR authoring update

**Released:** 2026-09-17 · **Catalog:** [FHIR Adapters](../adapters/catalogs/fhir.md)

An update to the **[FHIR Adapters](../adapters/catalogs/fhir.md)** catalog that
makes the FHIR authoring tools simpler to understand and adds validation as a
step of its own. The three authoring pieces — profile a resource, build it,
validate it — now line up end to end:

```text
FHIR Profiling Tools  →  FHIR Resource Creator  →  FHIR Validator
```

Nothing here changes the EHR source adapters (Epic, Cerner, eCW, ModMed,
Athena), and pulling the update cannot change a node you already run — see
[Does this change my running node?](#does-this-change-my-running-node) below.

## New: FHIR Validator

A new **transform** adapter, `LKFHIR_FHIR_VALIDATOR`, that checks a FHIR
resource against a FHIR server's `$validate` operation and forwards it only on a
clean pass.

- **Two settings**: a FHIR Server URL and an optional profile canonical URL.
- **Fails closed**: an invalid resource, a timeout, an HTTP error, a malformed
  response, or a profile the server cannot resolve all stop the node, so nothing
  unvalidated is forwarded.
- **The server is the authority**: an HTTP `200` is not treated as a pass on its
  own — the returned `OperationOutcome` decides.
- **Any resource type**: the type is read from the resource, so one node
  validates Patient, Observation, Encounter and others.

TLS verification is always on and the request timeout is an internal default;
neither is exposed. Full page: [FHIR Validator](../adapters/fhir-validator.md).

## Updated: FHIR Resource Creator → 1.1.0

The Resource Creator now maps inbound data with a small, readable set of
helpers instead of a mapping engine. It adds only the fields the message
carries, so the output has no empty scaffolding and no `null` placeholders, and
`active: false` is preserved rather than dropped. See
[FHIR Resource Creator](../adapters/fhir-resource-creator.md).

## Updated: FHIR Profiling Tools → 1.1.0

The Profiling Tools node now serves the **FHIR Profile Designer**: choose a
resource, pick fields from a tree (required fields locked on, optional fields
selectable, with search and select/clear), and copy a live FHIR JSON template
with `null` placeholders straight into the Resource Creator. Works in R4 and R5,
in light or dark theme. See
[FHIR Profiling Tools](../adapters/fhir-profiling-tools.md).

## Versions in this update

| Item | Type | Version | Node type id |
| --- | --- | --- | --- |
| [FHIR Validator](../adapters/fhir-validator.md) | adapter (transform) | 1.0.0 *(new)* | `LKFHIR_FHIR_VALIDATOR` |
| [FHIR Resource Creator](../adapters/fhir-resource-creator.md) | adapter (transform) | 1.1.0 | `LKFHIR_FHIR_RESOURCE_CREATOR` |
| [FHIR Profiling Tools](../adapters/fhir-profiling-tools.md) | adapter (source) | 1.1.0 | `LKFHIR_FHIR_PROFILING_TOOLS` |
| `fhir_validate` | library | 1.0.0 *(new)* | — |
| `fhir_creator` | library | 1.0.0 *(new)* | — |
| `fhir_profiling` | library | 1.1.0 | — |

The `fhir_resource` library is no longer used by any adapter in the catalog; the
Resource Creator builds its resource with `fhir_creator` instead.

## Does this change my running node?

No. Catalog content is versioned per item, and a running node stays pinned to
the version it was built against, so pulling this update does not disturb it.

- A node built from **FHIR Resource Creator 1.0.0** or **Profiling Tools 1.0.0**
  keeps running on that version until you choose to move it. Grid shows you the
  incoming commit and diff first.
- The new **FHIR Validator** appears in the palette once you pull the update;
  add it where you want it, typically right after the Resource Creator.

See [Using Catalog Content](../catalogs/using-catalog-content.md).

## Next

- [FHIR Adapters catalog](../adapters/catalogs/fhir.md) — the full adapter and library list
- [FHIR Validator](../adapters/fhir-validator.md)
- [Linkiir Catalogs Release Notes](./catalogs.md)
