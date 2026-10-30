---
title: Notification Adapters — Release Notes
sidebar_label: Notification Adapters
description: "Version history and changelogs for every adapter and library in the Linkiir Notification Adapters catalog, with the current version of each."
keywords: [release notes, Notification Adapters, versions, changelog, upgrade, lknotif]
---

# Notification Adapters — Release Notes

Chat, SMS, voice, email, paging and webhooks.

| | |
| --- | --- |
| **Catalog** | [Notification Adapters](../adapters/catalogs/notification.md) |
| **Catalog id** | `lknotif` |
| **Repository** | [https://github.com/Linkiir/linkiir-notification-adapters](https://github.com/Linkiir/linkiir-notification-adapters) |
| **Minimum Grid version** | 1.0.0 |

---

## Current versions

### Adapters

| Adapter | Current version | Node type id | Changelog |
| --- | --- | --- | --- |
| [Slack Alert](../adapters/slack.md) | **1.1.0** | `LKNOTIF_SLACK_ALERT` | [history](#slack-alert) |

### Libraries

| Library | Current version | Changelog |
| --- | --- | --- |
| `slack` | **1.1.0** | [history](#slack) |

:::tip[Checking what you are on]
Open the node in the Builder: the adapter version it was built from is shown on the node, and **Settings → Catalogs** lists every node whose adapter or library has a newer release. See [how to upgrade](./catalogs.md#upgrading-to-a-newer-version).
:::

---

## Adapter history

### Slack Alert

`LKNOTIF_SLACK_ALERT` · current **1.1.0** · [configuration](../adapters/slack.md)

#### 1.1.0

_Released 2026-10-29_

- **Live Mode** off now stops the requests in a running node, not only in Run Test. From Grid 1.2.0 a running node makes every request whatever `live` says, so earlier versions send them even with Live Mode off.
- Uses `slack` 1.1.0.
- Requires Grid 1.2.0 or later.

#### 1.0.1

_Released 2026-10-29_

- Requires Grid 1.2.0 or later. Nothing else changed: Live Mode off still does not stop requests in a running node. Use 1.1.0.

#### 1.0.0

_Released 2026-09-17_

- Initial release. Posts an alert to a Slack channel, optionally resolving an email to a user mention, and passes data downstream for chaining.

## Library history

Library versions are immutable: a published version is never edited, and a fix ships as a new version. A node stays pinned to the version it was built against until you move it forward.

### `slack`

current **1.1.0**

#### 1.1.0

_Released 2026-10-29_

- With `live` off, a request made from a running node is no longer sent: the client returns the same simulated result Run Test gives. It checks `linkiir.node.dev()`, so it needs Grid 1.2.0 or later. 1.0.0 remains published for nodes pinned to it.

#### 1.0.0

_Released 2026-09-17_

- Initial release. Channel messages, Block Kit formatting, and user lookup by email.

## Next

- [Linkiir Catalogs Release Notes](./catalogs.md) — every catalog, and how to upgrade
- [Notification Adapters](../adapters/catalogs/notification.md) — what this catalog contains and how to subscribe
