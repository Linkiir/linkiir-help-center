---
title: Upgrade on Windows
---

# Upgrade on Windows

Run the new installer over the existing installation. Do **not** uninstall first.

## Procedure

1. Back up `C:\ProgramData\Linkiir` and verify the backup.
2. Run the new `LinkiirSetup-<version>-x64.exe` as Administrator.
3. On **Existing Installation**, confirm the installed version and queue mode.
4. Select **Keep my current queue configuration** unless the broker must change.
5. Complete the upgrade.
6. Check readiness:

```powershell
Get-Content "C:\ProgramData\Linkiir\logs\installer\readiness.txt"
```

## Installer behavior

The upgrade process:

- Stops `LinkiirGrid`, then bundled `LinkiirKafka`.
- Terminates supervised Runtime and Archiver processes that still hold program files.
- Backs up configuration to `C:\ProgramData\Linkiir\backups\pre-upgrade-<timestamp>`.
- Replaces immutable program files.
- Preserves projects, logs, users, queue data, `config.ini`, and `linkiir.env`.
- Re-registers services and waits for readiness.

## Silent upgrade

```powershell
LinkiirSetup-1.1.0-x64.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART
```

Do not pass queue parameters when the current queue configuration should remain unchanged.
