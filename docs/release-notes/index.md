---
title: Release Notes
sidebar_label: Release Notes
sidebar_position: 100
description: Release notes for Linkiir Grid and for the Linkiir adapter catalogs, which are released independently of the product.
keywords: [release notes, versions, changelog, releases, catalogs, adapters]
---

# Release Notes

Linkiir publishes two independent streams of release notes, because the product
and the adapters that run on it ship on separate schedules.

| Stream | Covers | Notes |
| --- | --- | --- |
| [Linkiir Product Release Notes](./product.md) | Linkiir Grid itself — the console, runtime, log archiver, licensing and platform features | Delivered as an installable release you upgrade to |
| [Linkiir Catalogs Release Notes](./catalogs.md) | Adapters and libraries published in the Linkiir catalogs | Delivered over git and pulled into a running grid, with no product upgrade |

## Why two streams

A catalog is pulled at runtime and is not part of the Grid bundle, so a new
adapter can reach your grid without you upgrading Grid, and a Grid upgrade does
not change your adapters. Keeping the two sets of notes apart means the version
you are reading about is always the version of the thing you are about to
change.

- To upgrade Grid, read the [product release notes](./product.md) and
  [Upgrades](../administration/upgrades/index.md).
- To take a newer adapter, read the [catalogs release notes](./catalogs.md) and
  [Subscribing to a Catalog](../catalogs/subscribing.md).

## Versioning

Linkiir Grid uses [semantic versioning](https://semver.org/)
(`major.minor.patch`):

- **Major** — breaking changes requiring migration
- **Minor** — new features and improvements
- **Patch** — bug fixes to an existing release

Catalog content is versioned per item rather than per catalog: each adapter
carries its own version, and each library version is immutable once published.
See [Linkiir Catalogs Release Notes](./catalogs.md).

---

When contacting Linkiir Support about a specific feature or bug, reference the
**issue number** shown in the product release notes (for example,
"#11 Linkiir Packaging"). For a question about an adapter, quote its **node type
id** (for example, `LKFHIR_EPIC_ADAPTER`). Either one lets our team trace your
question straight to the relevant implementation.
