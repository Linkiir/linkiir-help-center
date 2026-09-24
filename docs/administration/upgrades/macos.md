---
title: Upgrade on macOS
---

# Upgrade on macOS

:::note
macOS runs as a Docker/container install, which upgrades by recreating the container rather than from the About page. See [Docker installs](index.md#docker-installs) in [Upgrades](index.md) for the overview; this page covers the command-line flow in detail.
:::

Extract the new offline bundle, copy the existing `.env`, and run the new bundle’s install command.

```bash
tar zxf linkiir-1.1.0-linux-docker-kafka-arm64.tar.gz
cd linkiir-1.1.0-linux-docker-kafka-arm64
cp ../linkiir-1.0.0-linux-docker-kafka-arm64/.env .
./scripts/linkiirctl install
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

For rollback, restore the previous image tag and `.env` backup, then run `install` again while the previous image remains available.
