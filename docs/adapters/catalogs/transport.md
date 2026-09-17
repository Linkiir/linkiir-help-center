---
title: Linkiir Transport Adapters
description: "Adapters for moving bytes and messages: object storage, file transport, and streaming or message brokers. Subscribe from the public repository https://github.com/Linkiir/linkiir-transport-adapters."
keywords: [catalog, S3, object storage, transport, file transfer, brokers]
---

# Linkiir Transport Adapters

Adapters for moving bytes and messages: object storage, file transport, and streaming or message brokers.

| | |
| --- | --- |
| **Repository** | [https://github.com/Linkiir/linkiir-transport-adapters](https://github.com/Linkiir/linkiir-transport-adapters) |
| **Catalog id** | `lkflow` |
| **Adapters** | 2 |
| **Libraries** | 1 |
| **Publisher** | Linkiir Inc |

:::note
Local and network file transfer, FTP, FTPS and SFTP are built into Grid's **File/FTP** source and destination nodes and need no catalog. See [Interfaces and Core Nodes](../../interface-development/interfaces/index.md).
:::

## Subscribe to this catalog

In Grid, open **Settings → Catalogs** and click **Subscribe to a catalog**.

| Field | Value |
| --- | --- |
| **Repository URL or folder** | `https://github.com/Linkiir/linkiir-transport-adapters` |
| **Branch or tag** | `main` |
| **SSH key** | Leave empty — this is a public repository, cloned anonymously |
| **CA bundle** | Leave empty |

```
https://github.com/Linkiir/linkiir-transport-adapters
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
| [S3 Adapter (Source)](../aws-s3.md) | source | `LKFLOW_S3_SOURCE` | see page |
| [S3 Adapter (Destination)](../aws-s3.md) | destination | `LKFLOW_S3_DESTINATION` | see page |

### S3 Adapter (Source)

Poll an S3 prefix, download objects past a minimum age, and optionally delete them.

`LKFLOW_S3_SOURCE` · source node · [Configuration and fields](../aws-s3.md)

### S3 Adapter (Destination)

Upload each inbound message to S3 as its own object, with a configurable key.

`LKFLOW_S3_DESTINATION` · destination node · [Configuration and fields](../aws-s3.md)

## Libraries in this catalog

Shared Lua modules the adapters depend on. Grid installs the version an adapter pins automatically when you build a node from it — there is nothing to install by hand.

| Library | Version | What it does |
| --- | --- | --- |
| `aws_s3` | 1.0.0 | AWS S3 client — Signature V4 signing, put/get/head/delete/list, ListObjectsV2 parsing, retry and backoff. Works against S3-compatible services too. |

:::tip[Library versions are immutable]
A published library version is never changed. A fix ships as a new version, and each node stays pinned to the version it was built against, so updating a catalog cannot disturb a node already running.
:::

## Credentials

Every adapter here ships with its credential fields **empty**, deliberately. Password fields are encrypted with your own grid's key, so a value shipped from the repository could not be decrypted on your machine. Enter yours on the node after you build it, leave **Live Mode** off for the first run, and keep **Verify TLS** on.

## Next

- [Adapter Catalogs](index.md) — every published Linkiir catalog
- [Using Catalog Content](../../catalogs/using-catalog-content.md) — build a node from an adapter and keep it updated
- [How Adapters Work](../how-adapters-work.md)
