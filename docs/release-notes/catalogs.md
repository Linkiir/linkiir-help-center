---
title: Linkiir Catalogs Release Notes
sidebar_label: Linkiir Catalogs Release Notes
description: Release notes for the adapters and libraries published in the Linkiir catalogs, with the current published version of every item.
keywords: [release notes, catalogs, adapters, libraries, versions, changelog]
---

# Linkiir Catalogs Release Notes

Release notes for the adapters and libraries published in the **Linkiir
catalogs**. Catalogs are pulled into a running grid over git, so a new or updated
adapter reaches you without upgrading Linkiir Grid.

For Grid itself, see
[Linkiir Product Release Notes](./product.md).

## How catalog versioning works

Catalog content is versioned per item rather than per catalog, so there is no
single "catalog version" to track.

| | How it is versioned |
| --- | --- |
| **Adapters** | Each adapter carries its own `version`. A change that does not move the version forward is rejected when the catalog is published, so one version always means one specific set of files. |
| **Libraries** | The version *is* the identity. A published library version is never edited; a fix ships as a new version directory. Several versions can be installed side by side, and each node pins the one it uses. |

The practical consequence: **pulling a catalog update cannot change a node that
is already running.** A node moves to a newer adapter or library only when you
choose to move it, and Grid shows you the incoming commit and diff first. See
[Using Catalog Content](../catalogs/using-catalog-content.md).

## Currently published

Every adapter and library available today, by catalog.

| Catalog | Adapter | Version | Node type id |
| --- | --- | --- | --- |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | Epic FHIR Adapter | 1.0.0 | `LKFHIR_EPIC_ADAPTER` |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | Cerner FHIR Adapter | 1.0.0 | `LKFHIR_CERNER_FHIR_ADAPTER` |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | eCW Adapter | 1.0.0 | `LKFHIR_ECW_ADAPTER` |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | ModMed Adapter | 1.0.0 | `LKFHIR_MODMED_ADAPTER` |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | Athena Adapter | 1.0.0 | `LKFHIR_ATHENA_ADAPTER` |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | FHIR Resource Creator | 1.0.0 | `LKFHIR_FHIR_RESOURCE_CREATOR` |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | FHIR Profiling Tools | 1.0.0 | `LKFHIR_FHIR_PROFILING_TOOLS` |
| [EHR Adapters](../adapters/catalogs/ehr.md) | PCC Connect | 1.0.0 | `LKEHR_PCC_CONNECT` |
| [EHR Adapters](../adapters/catalogs/ehr.md) | PCC Request | 1.0.0 | `LKEHR_PCC_REQUEST` |
| [Diagnostics Adapters](../adapters/catalogs/diagnostics.md) | Dexcom Authorize | 1.0.0 | `LKDX_DEXCOM_AUTHORIZE` |
| [Diagnostics Adapters](../adapters/catalogs/diagnostics.md) | Dexcom Read EGV | 1.0.0 | `LKDX_DEXCOM_READ_EGV` |
| [Business Adapters](../adapters/catalogs/business.md) | Salesforce Adapter | 1.0.0 | `LKBZ_SALESFORCE_ADAPTER` |
| [Business Adapters](../adapters/catalogs/business.md) | Dynamics CRM Adapter | 1.0.0 | `LKBZ_DYNAMICS_CRM_ADAPTER` |
| [Transport Adapters](../adapters/catalogs/transport.md) | S3 Adapter (Source) | 1.0.0 | `LKFLOW_S3_SOURCE` |
| [Transport Adapters](../adapters/catalogs/transport.md) | S3 Adapter (Destination) | 1.0.0 | `LKFLOW_S3_DESTINATION` |
| [Notification Adapters](../adapters/catalogs/notification.md) | Slack Alert | 1.0.0 | `LKNOTIF_SLACK_ALERT` |
| [AI Adapters](../adapters/catalogs/ai.md) | Azure OpenAI Adapter | 1.0.0 | `LKAI_AZURE_OPENAI_ADAPTER` |

| Catalog | Library | Version |
| --- | --- | --- |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | `epic_fhir` | 1.0.0 |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | `cerner_fhir` | 1.0.0 |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | `ecw_fhir` | 1.0.0 |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | `modmed_fhir` | 1.0.0 |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | `athena_health` | 1.0.0 |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | `fhir_resource` | 1.0.0 |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | `fhir_profiling` | 1.0.0 |
| [EHR Adapters](../adapters/catalogs/ehr.md) | `pcc_api` | 1.0.0 |
| [Diagnostics Adapters](../adapters/catalogs/diagnostics.md) | `dexcom_cgm` | 1.0.0 |
| [Business Adapters](../adapters/catalogs/business.md) | `salesforce` | 1.0.0 |
| [Business Adapters](../adapters/catalogs/business.md) | `dynamics_crm` | 1.0.0 |
| [Transport Adapters](../adapters/catalogs/transport.md) | `aws_s3` | 1.0.0 |
| [Notification Adapters](../adapters/catalogs/notification.md) | `slack` | 1.0.0 |
| [AI Adapters](../adapters/catalogs/ai.md) | `azure_openai` | 1.0.0 |

## Releases

| Release | Date | Summary |
| --- | --- | --- |
| [September 2026](./catalogs-2026-09.md) | 2026-09-17 | First public catalog release — 17 adapters and 14 libraries across 7 catalogs |

---

For a question about a specific adapter, quote its **node type id** — it
identifies the adapter and the catalog it came from in one string. See
[Support](../support/index.md).
