---
title: Linkiir Diagnostics Adapters
description: "Adapters for results and signals arriving from an instrument: laboratories, imaging, and bedside or wearable devices. Subscribe from the public repository https://github.com/Linkiir/linkiir-diagnostics-adapters."
keywords: [catalog, diagnostics, devices, CGM, Dexcom, glucose, monitoring]
---

# Linkiir Diagnostics Adapters

Adapters for results and signals arriving from an instrument: laboratories, imaging, and bedside or wearable devices.

| | |
| --- | --- |
| **Repository** | [https://github.com/Linkiir/linkiir-diagnostics-adapters](https://github.com/Linkiir/linkiir-diagnostics-adapters) |
| **Catalog id** | `lkdx` |
| **Adapters** | 2 |
| **Libraries** | 1 |
| **Publisher** | Linkiir Inc |

## Subscribe to this catalog

In Grid, open **Settings → Catalogs** and click **Subscribe to a catalog**.

| Field | Value |
| --- | --- |
| **Repository URL or folder** | `https://github.com/Linkiir/linkiir-diagnostics-adapters` |
| **Branch or tag** | `main` |
| **SSH key** | Leave empty — this is a public repository, cloned anonymously |
| **CA bundle** | Leave empty |

```
https://github.com/Linkiir/linkiir-diagnostics-adapters
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
| [Dexcom Authorize](../dexcom.md) | source | `LKDX_DEXCOM_AUTHORIZE` | see page |
| [Dexcom Read EGV](../dexcom.md) | source | `LKDX_DEXCOM_READ_EGV` | see page |

### Dexcom Authorize

Serve a page that runs Dexcom's user authorization and stores the token pair.

`LKDX_DEXCOM_AUTHORIZE` · source node · [Configuration and fields](../dexcom.md)

### Dexcom Read EGV

Read estimated glucose values on a timer, refreshing the rotating token pair.

`LKDX_DEXCOM_READ_EGV` · source node · [Configuration and fields](../dexcom.md)

## Libraries in this catalog

Shared Lua modules the adapters depend on. Grid installs the version an adapter pins automatically when you build a node from it — there is nothing to install by hand.

| Library | Version | What it does |
| --- | --- | --- |
| `dexcom_cgm` | 1.0.0 | Dexcom CGM client — three-legged OAuth, rotating token refresh, data-range and EGV reads, with a single-row token store. |

:::tip[Library versions are immutable]
A published library version is never changed. A fix ships as a new version, and each node stays pinned to the version it was built against, so updating a catalog cannot disturb a node already running.
:::

## Credentials

Every adapter here ships with its credential fields **empty**, deliberately. Password fields are encrypted with your own grid's key, so a value shipped from the repository could not be decrypted on your machine. Enter yours on the node after you build it, leave **Live Mode** off for the first run, and keep **Verify TLS** on.

## Next

- [Adapter Catalogs](index.md) — every published Linkiir catalog
- [Diagnostics Adapters release notes](../../release-notes/catalogs-diagnostics.md) — current version and changelog for every item here
- [Using Catalog Content](../../catalogs/using-catalog-content.md) — build a node from an adapter and keep it updated
- [How Adapters Work](../how-adapters-work.md)
