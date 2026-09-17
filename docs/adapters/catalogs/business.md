---
title: Linkiir Business Adapters
description: "Enterprise business system adapters: CRM, ERP, ITSM, HR, identity and directory services, and scheduling. Subscribe from the public repository https://github.com/Linkiir/linkiir-business-adapters."
keywords: [catalog, CRM, Salesforce, Dynamics 365, ERP, business systems]
---

# Linkiir Business Adapters

Enterprise business system adapters: CRM, ERP, ITSM, HR, identity and directory services, and scheduling.

| | |
| --- | --- |
| **Repository** | [https://github.com/Linkiir/linkiir-business-adapters](https://github.com/Linkiir/linkiir-business-adapters) |
| **Catalog id** | `lkbz` |
| **Adapters** | 2 |
| **Libraries** | 2 |
| **Publisher** | Linkiir Inc |

## Subscribe to this catalog

In Grid, open **Settings → Catalogs** and click **Subscribe to a catalog**.

| Field | Value |
| --- | --- |
| **Repository URL or folder** | `https://github.com/Linkiir/linkiir-business-adapters` |
| **Branch or tag** | `main` |
| **SSH key** | Leave empty — this is a public repository, cloned anonymously |
| **CA bundle** | Leave empty |

```
https://github.com/Linkiir/linkiir-business-adapters
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
| [Salesforce Adapter](../salesforce.md) | transform | `LKBZ_SALESFORCE_ADAPTER` | see page |
| [Dynamics CRM Adapter](../dynamics-365.md) | source | `LKBZ_DYNAMICS_CRM_ADAPTER` | see page |

### Salesforce Adapter

Query and update Salesforce records over the REST API, driven by the inbound message.

`LKBZ_SALESFORCE_ADAPTER` · transform node · [Configuration and fields](../salesforce.md)

### Dynamics CRM Adapter

Poll Microsoft Dynamics 365 CRM on a schedule with a FetchXML query.

`LKBZ_DYNAMICS_CRM_ADAPTER` · source node · [Configuration and fields](../dynamics-365.md)

## Libraries in this catalog

Shared Lua modules the adapters depend on. Grid installs the version an adapter pins automatically when you build a node from it — there is nothing to install by hand.

| Library | Version | What it does |
| --- | --- | --- |
| `salesforce` | 1.0.0 | Salesforce REST client — OAuth 2.0 client_credentials, with query, modify, batch modify and delete helpers. |
| `dynamics_crm` | 1.0.0 | Microsoft Dynamics 365 client — OAuth against Azure AD, with FetchXML query and generic request helpers. |

:::tip[Library versions are immutable]
A published library version is never changed. A fix ships as a new version, and each node stays pinned to the version it was built against, so updating a catalog cannot disturb a node already running.
:::

## Credentials

Every adapter here ships with its credential fields **empty**, deliberately. Password fields are encrypted with your own grid's key, so a value shipped from the repository could not be decrypted on your machine. Enter yours on the node after you build it, leave **Live Mode** off for the first run, and keep **Verify TLS** on.

## Next

- [Adapter Catalogs](index.md) — every published Linkiir catalog
- [Business Adapters release notes](../../release-notes/catalogs-business.md) — current version and changelog for every item here
- [Using Catalog Content](../../catalogs/using-catalog-content.md) — build a node from an adapter and keep it updated
- [How Adapters Work](../how-adapters-work.md)
