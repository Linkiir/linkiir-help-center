---
title: Upgrades
---

# Upgrades

Upgrade in place using the package for the same operating system, architecture, and queue variant unless the release notes explicitly describe a supported conversion.

## Before every upgrade

- Confirm the backup is current and restorable.
- Back up the master encryption key.
- Record the current version and queue mode.
- Review release notes and schema changes.
- Pause production changes and schedule a maintenance window.
- Confirm the queue and Log DB are healthy.
- Export critical projects for an additional logical backup.

Use the operating-system procedure:

- [Windows Upgrade](windows.md)
- [Linux Upgrade](linux.md)
- [macOS Upgrade](macos.md)

## After the upgrade

A release that changes the Log DB's browse indexes rebuilds them on first start. On SQLite the **Logs** page says so while it runs — searching is slow and new records are not archived until it finishes — and it runs once. On PostgreSQL and MS SQL the Archiver creates the new indexes as it starts. Allow for it in the maintenance window on a large log database. See [Log Archive Database](../configurations/log-archive-database.md#browse-indexes-are-rebuilt-after-an-upgrade).
