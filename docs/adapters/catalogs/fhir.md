---
title: Linkiir FHIR Adapters
description: "Adapters Linkiir Grid speaks over FHIR: FHIR-native EHR and EMR APIs, and FHIR authoring tools. Subscribe from the public repository https://github.com/Linkiir/linkiir-fhir-adapters."
keywords: [catalog, FHIR, Epic, Cerner, eClinicalWorks, ModMed, Athena, FHIR R4]
---

# Linkiir FHIR Adapters

Adapters Linkiir Grid speaks over FHIR: FHIR-native EHR and EMR APIs, and FHIR authoring tools.

| | |
| --- | --- |
| **Repository** | [https://github.com/Linkiir/linkiir-fhir-adapters](https://github.com/Linkiir/linkiir-fhir-adapters) |
| **Catalog id** | `lkfhir` |
| **Adapters** | 7 |
| **Libraries** | 7 |
| **Publisher** | Linkiir Inc |

## Subscribe to this catalog

In Grid, open **Settings → Catalogs** and click **Subscribe to a catalog**.

| Field | Value |
| --- | --- |
| **Repository URL or folder** | `https://github.com/Linkiir/linkiir-fhir-adapters` |
| **Branch or tag** | `main` |
| **SSH key** | Leave empty — this is a public repository, cloned anonymously |
| **CA bundle** | Leave empty |

```
https://github.com/Linkiir/linkiir-fhir-adapters
```

The catalog is cloned into a staging area and validated before anything is
installed. Once it is in, its adapters appear in the Builder's node palette and
can be filtered by catalog. Full walkthrough:
[Subscribing to a Catalog](../../catalogs/subscribing.md).

:::info[Subscribing needs a permission]
Every catalog operation — subscribing, updating and removing — needs the
Administration-tier **Manage catalogs** permission. See
[Users and Roles](../../administration/configurations/user-roles.md).
:::

## Adapters in this catalog

| Adapter | Node type | Node type id | Documentation |
| --- | --- | --- | --- |
| [Epic FHIR Adapter](../epic.md) | source | `LKFHIR_EPIC_ADAPTER` | see page |
| [Cerner FHIR Adapter](../cerner.md) | source | `LKFHIR_CERNER_FHIR_ADAPTER` | see page |
| [eCW Adapter](../ecw.md) | source | `LKFHIR_ECW_ADAPTER` | see page |
| [ModMed Adapter](../modmed.md) | source | `LKFHIR_MODMED_ADAPTER` | see page |
| [Athena Adapter](../athena.md) | source | `LKFHIR_ATHENA_ADAPTER` | see page |
| [FHIR Resource Creator](../fhir-resource-creator.md) | transform | `LKFHIR_FHIR_RESOURCE_CREATOR` | see page |
| [FHIR Profiling Tools](../fhir-profiling-tools.md) | source | `LKFHIR_FHIR_PROFILING_TOOLS` | see page |

### Epic FHIR Adapter

Poll an Epic FHIR endpoint and push each matching resource downstream.

`LKFHIR_EPIC_ADAPTER` · source node · [Configuration and fields](../epic.md)

### Cerner FHIR Adapter

Poll an Oracle Health / Cerner FHIR endpoint using a registered System Account.

`LKFHIR_CERNER_FHIR_ADAPTER` · source node · [Configuration and fields](../cerner.md)

### eCW Adapter

Poll an eClinicalWorks FHIR endpoint, with its separate authorization server.

`LKFHIR_ECW_ADAPTER` · source node · [Configuration and fields](../ecw.md)

### ModMed Adapter

Poll a ModMed FHIR endpoint with an API key and account credentials.

`LKFHIR_MODMED_ADAPTER` · source node · [Configuration and fields](../modmed.md)

### Athena Adapter

Poll the Athena Health platform for a practice and push each patient found.

`LKFHIR_ATHENA_ADAPTER` · source node · [Configuration and fields](../athena.md)

### FHIR Resource Creator

Turn inbound patient data into a clean FHIR R4 Patient resource. No network calls.

`LKFHIR_FHIR_RESOURCE_CREATOR` · transform node · [Configuration and fields](../fhir-resource-creator.md)

### FHIR Profiling Tools

Browse FHIR resources in a browser and get a JSON template for any of them.

`LKFHIR_FHIR_PROFILING_TOOLS` · source node · [Configuration and fields](../fhir-profiling-tools.md)

## Libraries in this catalog

Shared Lua modules the adapters depend on. Grid installs the version an adapter pins automatically when you build a node from it — there is nothing to install by hand.

| Library | Version | What it does |
| --- | --- | --- |
| `epic_fhir` | 1.0.0 | Epic FHIR client — SMART backend services authentication, search, read, create, update and operations. |
| `cerner_fhir` | 1.0.0 | Cerner FHIR client — SMART backend services authentication with a signed JWT client assertion. |
| `ecw_fhir` | 1.0.0 | eCW FHIR client — JWT client-credentials against a separate token endpoint, plus bulk export helpers. |
| `modmed_fhir` | 1.0.0 | ModMed FHIR client — password and refresh-token authentication with an API key. |
| `athena_health` | 1.0.0 | Athena Health client — client_credentials OAuth for both the proprietary REST API and the FHIR R4 API. |
| `fhir_resource` | 1.0.0 | FHIR Patient resource builder. Maps inbound data onto an R4 Patient template and strips unused fields. No network. |
| `fhir_profiling` | 1.0.0 | FHIR profiling tool. Loads specification profiles from SQLite and generates JSON templates for any resource or type. |

:::tip[Library versions are immutable]
A published library version is never changed. A fix ships as a new version, and each node stays pinned to the version it was built against, so updating a catalog cannot disturb a node already running.
:::

## Credentials

Every adapter here ships with its credential fields **empty**, deliberately. Password fields are encrypted with your own grid's key, so a value shipped from the repository could not be decrypted on your machine. Enter yours on the node after you build it, leave **Live Mode** off for the first run, and keep **Verify TLS** on.

## Next

- [Adapter Catalogs](index.md) — every published Linkiir catalog
- [Using Catalog Content](../../catalogs/using-catalog-content.md) — build a node from an adapter and keep it updated
- [How Adapters Work](../how-adapters-work.md)
