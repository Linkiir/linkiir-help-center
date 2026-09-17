---
title: Linkiir EHR Adapters
description: "Adapters for EHR, EMR and practice-management systems reached over a proprietary API rather than FHIR. Subscribe from the public repository https://github.com/Linkiir/linkiir-ehr-adapters."
keywords: [catalog, EHR, EMR, PointClickCare, practice management, long-term care]
---

# Linkiir EHR Adapters

Adapters for EHR, EMR and practice-management systems reached over a proprietary API rather than FHIR.

| | |
| --- | --- |
| **Repository** | [https://github.com/Linkiir/linkiir-ehr-adapters](https://github.com/Linkiir/linkiir-ehr-adapters) |
| **Catalog id** | `lkehr` |
| **Adapters** | 2 |
| **Libraries** | 1 |
| **Publisher** | Linkiir Inc |

:::note
Adapters whose wire protocol is FHIR are published in [Linkiir FHIR Adapters](fhir.md) instead, because they share the same FHIR client plumbing.
:::

## Subscribe to this catalog

In Grid, open **Settings → Catalogs** and click **Subscribe to a catalog**.

| Field | Value |
| --- | --- |
| **Repository URL or folder** | `https://github.com/Linkiir/linkiir-ehr-adapters` |
| **Branch or tag** | `main` |
| **SSH key** | Leave empty — this is a public repository, cloned anonymously |
| **CA bundle** | Leave empty |

```
https://github.com/Linkiir/linkiir-ehr-adapters
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
| [PCC Connect](../pointclickcare.md) | source | `LKEHR_PCC_CONNECT` | see page |
| [PCC Request](../pointclickcare.md) | transform | `LKEHR_PCC_REQUEST` | see page |

### PCC Connect

Obtain a PointClickCare access token on a timer and prove the connection works.

`LKEHR_PCC_CONNECT` · source node · [Configuration and fields](../pointclickcare.md)

### PCC Request

Make an authenticated PointClickCare request driven by the inbound message.

`LKEHR_PCC_REQUEST` · transform node · [Configuration and fields](../pointclickcare.md)

## Libraries in this catalog

Shared Lua modules the adapters depend on. Grid installs the version an adapter pins automatically when you build a node from it — there is nothing to install by hand.

| Library | Version | What it does |
| --- | --- | --- |
| `pcc_api` | 1.0.0 | PointClickCare client — two-legged OAuth over mutual TLS by default, three-legged authorization-code grant available by configuration. |

:::tip[Library versions are immutable]
A published library version is never changed. A fix ships as a new version, and each node stays pinned to the version it was built against, so updating a catalog cannot disturb a node already running.
:::

## Credentials

Every adapter here ships with its credential fields **empty**, deliberately. Password fields are encrypted with your own grid's key, so a value shipped from the repository could not be decrypted on your machine. Enter yours on the node after you build it, leave **Live Mode** off for the first run, and keep **Verify TLS** on.

## Next

- [Adapter Catalogs](index.md) — every published Linkiir catalog
- [EHR Adapters release notes](../../release-notes/catalogs-ehr.md) — current version and changelog for every item here
- [Using Catalog Content](../../catalogs/using-catalog-content.md) — build a node from an adapter and keep it updated
- [How Adapters Work](../how-adapters-work.md)
