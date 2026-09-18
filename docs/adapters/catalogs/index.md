---
title: Adapter Catalogs
description: "Every Linkiir adapter catalog, with the public GitHub repository URL to subscribe to. Adapters are delivered as catalogs and update in place."
keywords: [adapter catalogs, github, subscribe, repository, FHIR, EHR, diagnostics, business, transport, notification, AI]
---

# Adapter Catalogs

Linkiir adapters are delivered as **catalogs** — public git repositories your grid subscribes to. Subscribing adds a catalog's adapters to the node palette and keeps them updatable in place afterwards, without a product upgrade.

Every catalog below is a **public repository, cloned anonymously**. You do not need an SSH key, a token, or a support request to subscribe to one.

Currently published: **17 adapters** and **14 libraries** across **8 catalogs**.

## Catalogs and repository URLs

| Catalog | What it covers | Adapters | Repository to subscribe to |
| --- | --- | --- | --- |
| [Linkiir FHIR Adapters](fhir.md) | Adapters Linkiir Grid speaks over FHIR: FHIR-native EHR and EMR APIs, and FHIR authoring tools | 7 | `https://github.com/Linkiir/linkiir-fhir-adapters` |
| [Linkiir EHR Adapters](ehr.md) | Adapters for EHR, EMR and practice-management systems reached over a proprietary API rather than FHIR | 2 | `https://github.com/Linkiir/linkiir-ehr-adapters` |
| [Linkiir Diagnostics Adapters](diagnostics.md) | Adapters for results and signals arriving from an instrument: laboratories, imaging, and bedside or wearable devices | 2 | `https://github.com/Linkiir/linkiir-diagnostics-adapters` |
| [Linkiir Business Adapters](business.md) | Enterprise business system adapters: CRM, ERP, ITSM, HR, identity and directory services, and scheduling | 2 | `https://github.com/Linkiir/linkiir-business-adapters` |
| [Linkiir Transport Adapters](transport.md) | Adapters for moving bytes and messages: object storage, file transport, and streaming or message brokers | 2 | `https://github.com/Linkiir/linkiir-transport-adapters` |
| [Linkiir Notification Adapters](notification.md) | Adapters that put a message in front of a person: chat, SMS, voice, email, paging and webhooks | 1 | `https://github.com/Linkiir/linkiir-notification-adapters` |
| [Linkiir AI Adapters](ai.md) | Model and AI service adapters: hosted and on-premise LLMs, embeddings, and AI tooling | 1 | `https://github.com/Linkiir/linkiir-ai-adapters` |
| [Developer Tools](devtools.md) | Data simulation and testing tools — not adapters | 1 | `https://github.com/Linkiir/linkiir-devtools` |

## How to subscribe

1. In Grid, open **Settings → Catalogs**.
2. Click **Subscribe to a catalog**.
3. Paste the repository URL from the table above into **Repository URL or folder**.
4. Leave **Branch or tag** as `main`, and leave **SSH key** and **CA bundle** empty.
5. Click **Subscribe**.

Grid clones the repository into a staging area and validates its contents before installing anything. If validation fails, nothing is left behind and the reason is reported. See [Subscribing to a Catalog](../../catalogs/subscribing.md) for the full walkthrough, including how to review an incoming update's diff before applying it.

:::info[Subscribing needs a permission]
Every catalog operation — subscribing, updating and removing — needs the
Administration-tier **Manage catalogs** permission. See
[Users and Roles](../../administration/configurations/user-roles.md).
:::

:::tip[Subscribe to only what you need]
A subscription brings in the whole catalog, so subscribe to the catalogs covering the systems you actually integrate with. You can add more at any time, and removing a catalog leaves nodes you already built in place.
:::

## Which catalog holds which adapter

| Adapter | Catalog | Node type id |
| --- | --- | --- |
| [Athena Adapter](../athena.md) | [Linkiir FHIR Adapters](fhir.md) | `LKFHIR_ATHENA_ADAPTER` |
| [Azure OpenAI Adapter](../azure-openai.md) | [Linkiir AI Adapters](ai.md) | `LKAI_AZURE_OPENAI_ADAPTER` |
| Data Simulator | [Developer Tools](devtools.md) | `LKTOOL_DATA_SIMULATOR` |
| [Cerner FHIR Adapter](../cerner.md) | [Linkiir FHIR Adapters](fhir.md) | `LKFHIR_CERNER_FHIR_ADAPTER` |
| [Dexcom Authorize](../dexcom.md) | [Linkiir Diagnostics Adapters](diagnostics.md) | `LKDX_DEXCOM_AUTHORIZE` |
| [Dexcom Read EGV](../dexcom.md) | [Linkiir Diagnostics Adapters](diagnostics.md) | `LKDX_DEXCOM_READ_EGV` |
| [Dynamics CRM Adapter](../dynamics-365.md) | [Linkiir Business Adapters](business.md) | `LKBZ_DYNAMICS_CRM_ADAPTER` |
| [Epic FHIR Adapter](../epic.md) | [Linkiir FHIR Adapters](fhir.md) | `LKFHIR_EPIC_ADAPTER` |
| [HAPI FHIR / OmniVera Adapter](../hapi-fhir.md) | [Linkiir FHIR Adapters](fhir.md) | `LKFHIR_HAPI_FHIR_ADAPTER` |
| [FHIR Profiling Tools](../fhir-profiling-tools.md) | [Linkiir FHIR Adapters](fhir.md) | `LKFHIR_FHIR_PROFILING_TOOLS` |
| [FHIR Resource Creator](../fhir-resource-creator.md) | [Linkiir FHIR Adapters](fhir.md) | `LKFHIR_FHIR_RESOURCE_CREATOR` |
| [FHIR Validator](../fhir-validator.md) | [Linkiir FHIR Adapters](fhir.md) | `LKFHIR_FHIR_VALIDATOR` |
| [ModMed Adapter](../modmed.md) | [Linkiir FHIR Adapters](fhir.md) | `LKFHIR_MODMED_ADAPTER` |
| [PCC Connect](../pointclickcare.md) | [Linkiir EHR Adapters](ehr.md) | `LKEHR_PCC_CONNECT` |
| [PCC Request](../pointclickcare.md) | [Linkiir EHR Adapters](ehr.md) | `LKEHR_PCC_REQUEST` |
| [S3 Adapter (Destination)](../aws-s3.md) | [Linkiir Transport Adapters](transport.md) | `LKFLOW_S3_DESTINATION` |
| [S3 Adapter (Source)](../aws-s3.md) | [Linkiir Transport Adapters](transport.md) | `LKFLOW_S3_SOURCE` |
| [Salesforce Adapter](../salesforce.md) | [Linkiir Business Adapters](business.md) | `LKBZ_SALESFORCE_ADAPTER` |
| [Slack Alert](../slack.md) | [Linkiir Notification Adapters](notification.md) | `LKNOTIF_SLACK_ALERT` |
| [eCW Adapter](../ecw.md) | [Linkiir FHIR Adapters](fhir.md) | `LKFHIR_ECW_ADAPTER` |

## No route to GitHub?

Catalogs can also be delivered on a mounted share or a removable drive, for installations on a network segment with no outbound access. The result is the same object — same adapters, same immutable library versions. See [Offline Delivery](../../catalogs/offline-delivery.md).

## Next

- [How Adapters Work](../how-adapters-work.md)
- [Using Catalog Content](../../catalogs/using-catalog-content.md)
- [Catalogs](../../catalogs/index.md) — how catalogs work in general
- [Linkiir Catalogs Release Notes](../../release-notes/catalogs.md) — what changed in each catalog
