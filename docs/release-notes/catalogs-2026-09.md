---
title: Catalogs — September 2026
sidebar_label: September 2026
description: First public release of the Linkiir adapter catalogs — 17 adapters and 14 libraries published across 7 catalogs, subscribable from public GitHub repositories.
keywords: [catalog release, adapters, September 2026, public catalogs, GitHub]
---

# Catalogs — September 2026

**Released:** 2026-09-17

The first public release of the Linkiir adapter catalogs. Adapters that were
previously supplied on request are now published in public repositories your
grid can subscribe to directly, and they update in place afterwards.

## What changed for you

| Before | Now |
| --- | --- |
| Adapters were requested from Linkiir Support and delivered as a project or a private catalog | Adapters are published in **public repositories** you subscribe to yourself, with no key and no support request |
| An updated adapter meant re-importing and reconfiguring | An update is a **pull**, reviewed as a diff, applied in place, and your node keeps its configuration and wiring |
| Adapters arrived as one bundle | Adapters are grouped into **7 catalogs** by domain, so you subscribe to what you integrate with |

Start here: [Adapter Catalogs](../adapters/catalogs/index.md).

## Catalogs published

| Catalog | Adapters | Libraries | Repository |
| --- | --- | --- | --- |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | 7 | 7 | `https://github.com/Linkiir/linkiir-fhir-adapters` |
| [EHR Adapters](../adapters/catalogs/ehr.md) | 2 | 1 | `https://github.com/Linkiir/linkiir-ehr-adapters` |
| [Diagnostics Adapters](../adapters/catalogs/diagnostics.md) | 2 | 1 | `https://github.com/Linkiir/linkiir-diagnostics-adapters` |
| [Business Adapters](../adapters/catalogs/business.md) | 2 | 2 | `https://github.com/Linkiir/linkiir-business-adapters` |
| [Transport Adapters](../adapters/catalogs/transport.md) | 2 | 1 | `https://github.com/Linkiir/linkiir-transport-adapters` |
| [Notification Adapters](../adapters/catalogs/notification.md) | 1 | 1 | `https://github.com/Linkiir/linkiir-notification-adapters` |
| [AI Adapters](../adapters/catalogs/ai.md) | 1 | 1 | `https://github.com/Linkiir/linkiir-ai-adapters` |

All seven are public and cloned anonymously — no SSH key required.

## Adapters in this release

All adapters ship at version **1.0.0**.

### FHIR Adapters

| Adapter | Node type | Node type id |
| --- | --- | --- |
| [Epic FHIR Adapter](../adapters/epic.md) | source | `LKFHIR_EPIC_ADAPTER` |
| [Cerner FHIR Adapter](../adapters/cerner.md) | source | `LKFHIR_CERNER_FHIR_ADAPTER` |
| [eCW Adapter](../adapters/ecw.md) | source | `LKFHIR_ECW_ADAPTER` |
| [ModMed Adapter](../adapters/modmed.md) | source | `LKFHIR_MODMED_ADAPTER` |
| [Athena Adapter](../adapters/athena.md) | source | `LKFHIR_ATHENA_ADAPTER` |
| [FHIR Resource Creator](../adapters/fhir-resource-creator.md) | transform | `LKFHIR_FHIR_RESOURCE_CREATOR` |
| [FHIR Profiling Tools](../adapters/fhir-profiling-tools.md) | source | `LKFHIR_FHIR_PROFILING_TOOLS` |

Libraries: `epic_fhir`, `cerner_fhir`, `ecw_fhir`, `modmed_fhir`,
`athena_health`, `fhir_resource`, `fhir_profiling` — all 1.0.0.

### EHR Adapters

| Adapter | Node type | Node type id |
| --- | --- | --- |
| [PCC Connect](../adapters/pointclickcare.md) | source | `LKEHR_PCC_CONNECT` |
| [PCC Request](../adapters/pointclickcare.md) | transform | `LKEHR_PCC_REQUEST` |

Library: `pcc_api` 1.0.0.

### Diagnostics Adapters

| Adapter | Node type | Node type id |
| --- | --- | --- |
| [Dexcom Authorize](../adapters/dexcom.md) | source | `LKDX_DEXCOM_AUTHORIZE` |
| [Dexcom Read EGV](../adapters/dexcom.md) | source | `LKDX_DEXCOM_READ_EGV` |

Library: `dexcom_cgm` 1.0.0.

### Business Adapters

| Adapter | Node type | Node type id |
| --- | --- | --- |
| [Salesforce Adapter](../adapters/salesforce.md) | transform | `LKBZ_SALESFORCE_ADAPTER` |
| [Dynamics CRM Adapter](../adapters/dynamics-365.md) | source | `LKBZ_DYNAMICS_CRM_ADAPTER` |

Libraries: `salesforce` 1.0.0, `dynamics_crm` 1.0.0.

### Transport Adapters

| Adapter | Node type | Node type id |
| --- | --- | --- |
| [S3 Adapter (Source)](../adapters/aws-s3.md) | source | `LKFLOW_S3_SOURCE` |
| [S3 Adapter (Destination)](../adapters/aws-s3.md) | destination | `LKFLOW_S3_DESTINATION` |

Library: `aws_s3` 1.0.0.

### Notification Adapters

| Adapter | Node type | Node type id |
| --- | --- | --- |
| [Slack Alert](../adapters/slack.md) | transform | `LKNOTIF_SLACK_ALERT` |

Library: `slack` 1.0.0.

### AI Adapters

| Adapter | Node type | Node type id |
| --- | --- | --- |
| [Azure OpenAI Adapter](../adapters/azure-openai.md) | transform | `LKAI_AZURE_OPENAI_ADAPTER` |

Library: `azure_openai` 1.0.0.

## Upgrading from a privately delivered adapter

If you already have one of these adapters in a project — imported from a project
export or a private catalog — the published version is the same code, but your
existing node is **not** automatically linked to the new catalog.

You have two options:

1. **Leave it as it is.** Your node keeps working exactly as it does now. It
   simply will not offer in-place updates.
2. **Rebuild the node from the catalog.** Subscribe to the catalog, add a new
   node from the adapter, copy your configuration values across, and rewire it.
   From then on the node follows the catalog and updates in place.

There is no migration deadline, and nothing breaks if you do nothing. If you have
many nodes to move, talk to Linkiir Support before you start.

## Requirements

- Linkiir Grid **v1.0.0** or later.
- The Administration-tier **Manage catalogs** permission to subscribe. See
  [Users and Roles](../administration/configurations/user-roles.md).
- Outbound HTTPS to `github.com`. If your grid has no outbound route, use
  [Offline Delivery](../catalogs/offline-delivery.md) instead.

## Next

- [Adapter Catalogs](../adapters/catalogs/index.md) — repository URLs and how to subscribe
- [Subscribing to a Catalog](../catalogs/subscribing.md)
- [Using Catalog Content](../catalogs/using-catalog-content.md)
