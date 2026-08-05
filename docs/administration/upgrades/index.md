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
