---
title: Transport Adapters — Release Notes
sidebar_label: Transport Adapters
description: "Version history and changelogs for every adapter and library in the Linkiir Transport Adapters catalog, with the current version of each."
keywords: [release notes, Transport Adapters, versions, changelog, upgrade, lkflow]
---

# Transport Adapters — Release Notes

Object storage, file transport, and streaming or message brokers.

| | |
| --- | --- |
| **Catalog** | [Transport Adapters](../adapters/catalogs/transport.md) |
| **Catalog id** | `lkflow` |
| **Repository** | [https://github.com/Linkiir/linkiir-transport-adapters](https://github.com/Linkiir/linkiir-transport-adapters) |
| **Minimum Grid version** | 1.0.0 |

---

## Current versions

### Adapters

| Adapter | Current version | Node type id | Changelog |
| --- | --- | --- | --- |
| [S3 Adapter (Source)](../adapters/aws-s3.md) | **1.0.0** | `LKFLOW_S3_SOURCE` | [history](#s3-adapter-source) |
| [S3 Adapter (Destination)](../adapters/aws-s3.md) | **1.0.0** | `LKFLOW_S3_DESTINATION` | [history](#s3-adapter-destination) |

### Libraries

| Library | Current version | Changelog |
| --- | --- | --- |
| `aws_s3` | **1.0.0** | [history](#aws_s3) |

:::tip[Checking what you are on]
Open the node in the Builder: the adapter version it was built from is shown on the node, and **Settings → Catalogs** lists every node whose adapter or library has a newer release. See [how to upgrade](./catalogs.md#upgrading-to-a-newer-version).
:::

---

## Adapter history

### S3 Adapter (Source)

`LKFLOW_S3_SOURCE` · current **1.0.0** · [configuration](../adapters/aws-s3.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Polls an S3 prefix, downloads objects past a minimum age, pushes each downstream and optionally deletes it.

### S3 Adapter (Destination)

`LKFLOW_S3_DESTINATION` · current **1.0.0** · [configuration](../adapters/aws-s3.md)

#### 1.0.0

_Released 2026-09-17_

- Initial release. Uploads each inbound message to S3 as its own object, with a configurable key.

## Library history

Library versions are immutable: a published version is never edited, and a fix ships as a new version. A node stays pinned to the version it was built against until you move it forward.

### `aws_s3`

current **1.0.0**

#### 1.0.0

_Released 2026-09-17_

- Initial release. Signature V4 signing, put/get/head/delete/list, ListObjectsV2 and error XML parsing, retry and backoff. Works against S3-compatible services.

## Next

- [Linkiir Catalogs Release Notes](./catalogs.md) — every catalog, and how to upgrade
- [Transport Adapters](../adapters/catalogs/transport.md) — what this catalog contains and how to subscribe
