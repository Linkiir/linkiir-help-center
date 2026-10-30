---
title: Business Adapters — Release Notes
sidebar_label: Business Adapters
description: "Version history and changelogs for every adapter and library in the Linkiir Business Adapters catalog, with the current version of each."
keywords: [release notes, Business Adapters, versions, changelog, upgrade, lkbz]
---

# Business Adapters — Release Notes

CRM, ERP, ITSM, HR, identity and directory services, and scheduling.

| | |
| --- | --- |
| **Catalog** | [Business Adapters](../adapters/catalogs/business.md) |
| **Catalog id** | `lkbz` |
| **Repository** | [https://github.com/Linkiir/linkiir-business-adapters](https://github.com/Linkiir/linkiir-business-adapters) |
| **Minimum Grid version** | 1.0.0 |

---

## Current versions

### Adapters

| Adapter | Current version | Node type id | Changelog |
| --- | --- | --- | --- |
| [Salesforce Adapter](../adapters/salesforce.md) | **1.1.0** | `LKBZ_SALESFORCE_ADAPTER` | [history](#salesforce-adapter) |
| [Dynamics CRM Adapter](../adapters/dynamics-365.md) | **1.1.0** | `LKBZ_DYNAMICS_CRM_ADAPTER` | [history](#dynamics-crm-adapter) |

### Libraries

| Library | Current version | Changelog |
| --- | --- | --- |
| `salesforce` | **1.1.0** | [history](#salesforce) |
| `dynamics_crm` | **1.1.0** | [history](#dynamics_crm) |

:::tip[Checking what you are on]
Open the node in the Builder: the adapter version it was built from is shown on the node, and **Settings → Catalogs** lists every node whose adapter or library has a newer release. See [how to upgrade](./catalogs.md#upgrading-to-a-newer-version).
:::

---

## Adapter history

### Salesforce Adapter

`LKBZ_SALESFORCE_ADAPTER` · current **1.1.0** · [configuration](../adapters/salesforce.md)

#### 1.1.0

_Released 2026-10-29_

- **Live Mode** off now stops the requests in a running node, not only in Run Test. From Grid 1.2.0 a running node makes every request whatever `live` says, so earlier versions send them even with Live Mode off.
- Uses `salesforce` 1.1.0.
- Requires Grid 1.2.0 or later.

#### 1.0.1

_Released 2026-10-29_

- Requires Grid 1.2.0 or later. Nothing else changed: Live Mode off still does not stop requests in a running node. Use 1.1.0.

#### 1.0.0

_Released 2026-09-17_

- Initial release. Queries and updates Salesforce records over the REST API, driven by the inbound message.

### Dynamics CRM Adapter

`LKBZ_DYNAMICS_CRM_ADAPTER` · current **1.1.0** · [configuration](../adapters/dynamics-365.md)

#### 1.1.0

_Released 2026-10-29_

- **Live Mode** off now stops the requests in a running node, not only in Run Test. From Grid 1.2.0 a running node makes every request whatever `live` says, so earlier versions send them even with Live Mode off.
- Uses `dynamics_crm` 1.1.0.
- Requires Grid 1.2.0 or later.

#### 1.0.1

_Released 2026-10-29_

- Requires Grid 1.2.0 or later. Nothing else changed: Live Mode off still does not stop requests in a running node. Use 1.1.0.

#### 1.0.0

_Released 2026-09-17_

- Initial release. Polls Microsoft Dynamics 365 CRM on an interval with a FetchXML query.

## Library history

Library versions are immutable: a published version is never edited, and a fix ships as a new version. A node stays pinned to the version it was built against until you move it forward.

### `salesforce`

current **1.1.0**

#### 1.1.0

_Released 2026-10-29_

- With `live` off, a request made from a running node is no longer sent: the client returns the same simulated result Run Test gives. It checks `linkiir.node.dev()`, so it needs Grid 1.2.0 or later. 1.0.0 remains published for nodes pinned to it.

#### 1.0.0

_Released 2026-09-17_

- Initial release. OAuth 2.0 client_credentials, with query, modify, batch modify, delete and custom request helpers.

### `dynamics_crm`

current **1.1.0**

#### 1.1.0

_Released 2026-10-29_

- With `live` off, a request made from a running node is no longer sent: the client returns the same simulated result Run Test gives. It checks `linkiir.node.dev()`, so it needs Grid 1.2.0 or later. 1.0.0 remains published for nodes pinned to it.

#### 1.0.0

_Released 2026-09-17_

- Initial release. OAuth against Azure AD, with FetchXML query and generic request helpers.

## Next

- [Linkiir Catalogs Release Notes](./catalogs.md) — every catalog, and how to upgrade
- [Business Adapters](../adapters/catalogs/business.md) — what this catalog contains and how to subscribe
