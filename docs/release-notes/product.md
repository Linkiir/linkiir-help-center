---
title: Linkiir Product Release Notes
sidebar_label: Linkiir Product Release Notes
description: Released versions of Linkiir Grid, newest first, with the features, improvements and fixes in each.
keywords: [release notes, Linkiir Grid, versions, upgrade, changelog]
---

# Linkiir Product Release Notes

Released versions of **Linkiir Grid** — the console, runtime, log archiver,
notification service, licensing and platform features. Newest first.

Adapters are released separately and are not covered here; see
[Linkiir Catalogs Release Notes](./catalogs.md).

## Releases

| Version | Date | Highlights |
| --- | --- | --- |
| [v1.0.0](./linkiir-grid-v1.0.0.md) | 2026-08-12 | Initial release — Dashboard, Runtime, Log Archiver, Notification, Licensing, and more |

## Versioning

Linkiir Grid uses [semantic versioning](https://semver.org/)
(`major.minor.patch`):

- **Major** — breaking changes requiring migration
- **Minor** — new features and improvements
- **Patch** — bug fixes to an existing release

## Before you upgrade

- Read the notes for every version between yours and the target, not just the
  newest — migration steps are listed against the release that introduces them.
- Take a backup first. See
  [Backup and Restore](../administration/backup-restore/index.md).
- Follow the upgrade path for your platform in
  [Upgrades](../administration/upgrades/index.md).

:::info[Your adapters are unaffected]
Upgrading Grid does not change the adapters in your projects. Catalog content is
pulled separately and each node stays on the adapter version it was built
against until you choose to move it forward.
:::

---

When contacting Linkiir Support about a specific feature or bug, reference the
**issue number** shown in the release notes (for example, "#11 Linkiir
Packaging"). This lets our team trace your question directly to the relevant
implementation details.
