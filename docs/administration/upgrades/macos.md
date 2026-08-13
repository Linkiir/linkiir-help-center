---
title: Upgrade on macOS
---

# Upgrade on macOS

Extract the new offline bundle, copy the existing `.env`, and run the new bundle’s upgrade command.

```bash
unzip linkiir-1.1.0-macos-docker-kafka-arm64.zip
cd linkiir-1.1.0-macos-docker-kafka-arm64
cp ../linkiir-1.0.0-macos-docker-kafka-arm64/.env .
./scripts/linkiirctl upgrade
```

Use the same broker variant and CPU architecture. The upgrade:

- Loads the new image before stopping the current containers.
- Backs up `.env` and the configuration volume.
- Recreates containers.
- Preserves data volumes.
- Waits for health.

Verify:

```bash
./scripts/linkiirctl status
./scripts/linkiirctl doctor
```

For rollback, restore the previous image tag and `.env` backup, then run `upgrade` again while the previous image remains available.
