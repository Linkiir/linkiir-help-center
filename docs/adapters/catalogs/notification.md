---
title: Linkiir Notification Adapters
description: "Adapters that put a message in front of a person: chat, SMS, voice, email, paging and webhooks. Subscribe from the public repository https://github.com/Linkiir/linkiir-notification-adapters."
keywords: [catalog, notifications, Slack, alerting, messaging]
---

# Linkiir Notification Adapters

Adapters that put a message in front of a person: chat, SMS, voice, email, paging and webhooks.

| | |
| --- | --- |
| **Repository** | [https://github.com/Linkiir/linkiir-notification-adapters](https://github.com/Linkiir/linkiir-notification-adapters) |
| **Catalog id** | `lknotif` |
| **Adapters** | 1 |
| **Libraries** | 1 |
| **Publisher** | Linkiir Inc |

## Subscribe to this catalog

In Grid, open **Settings → Catalogs** and click **Subscribe to a catalog**.

| Field | Value |
| --- | --- |
| **Repository URL or folder** | `https://github.com/Linkiir/linkiir-notification-adapters` |
| **Branch or tag** | `main` |
| **SSH key** | Leave empty — this is a public repository, cloned anonymously |
| **CA bundle** | Leave empty |

```
https://github.com/Linkiir/linkiir-notification-adapters
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
| [Slack Alert](../slack.md) | transform | `LKNOTIF_SLACK_ALERT` | see page |

### Slack Alert

Post an alert into a Slack channel, optionally resolving an email to a user mention. Passes data downstream.

`LKNOTIF_SLACK_ALERT` · transform node · [Configuration and fields](../slack.md)

## Libraries in this catalog

Shared Lua modules the adapters depend on. Grid installs the version an adapter pins automatically when you build a node from it — there is nothing to install by hand.

| Library | Version | What it does |
| --- | --- | --- |
| `slack` | 1.0.0 | Slack messaging client — channel messages, Block Kit formatting, and user lookup by email. |

:::tip[Library versions are immutable]
A published library version is never changed. A fix ships as a new version, and each node stays pinned to the version it was built against, so updating a catalog cannot disturb a node already running.
:::

## Credentials

Every adapter here ships with its credential fields **empty**, deliberately. Password fields are encrypted with your own grid's key, so a value shipped from the repository could not be decrypted on your machine. Enter yours on the node after you build it, leave **Live Mode** off for the first run, and keep **Verify TLS** on.

## Next

- [Adapter Catalogs](index.md) — every published Linkiir catalog
- [Using Catalog Content](../../catalogs/using-catalog-content.md) — build a node from an adapter and keep it updated
- [How Adapters Work](../how-adapters-work.md)
