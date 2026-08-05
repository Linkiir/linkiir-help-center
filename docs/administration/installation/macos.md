---
title: Install on macOS
---

# Install on macOS

Linkiir on macOS is delivered as an offline Docker bundle.

## Requirements

- macOS 12 Monterey or later.
- Intel or Apple Silicon package matching the Mac architecture.
- Docker Desktop running.
- 4 GB available container memory; 8 GB recommended with bundled Kafka.

Check the architecture:

```bash
uname -m
```

- `arm64`: Apple Silicon bundle.
- `x86_64`: amd64/Intel bundle.

## Install

```bash
unzip linkiir-1.0.0-macos-docker-redpanda-arm64.zip
cd linkiir-1.0.0-macos-docker-redpanda-arm64
./scripts/linkiirctl install
```

The offline bundle loads its images locally and does not require a registry connection.

## Queue variants

| Variant | Intended use |
| --- | --- |
| `redpanda` | Self-contained DEV/TEST without a JVM. |
| `kafka` | Self-contained DEV/TEST using Apache Kafka. |
| `external` | Connect to an organization-managed Kafka or Redpanda cluster. |

For an external cluster, the installer collects the connection details and tests them before starting Linkiir.

## Persistent data

| Docker volume | Purpose |
| --- | --- |
| `linkiir_work` | Projects, workflows, and settings. |
| `linkiir_logs` | Service logs and message Log DB. |
| `linkiir_config` | Rendered configuration. |
| `linkiir_queue` | Bundled broker data. |

## Verify

```bash
./scripts/linkiirctl status
./scripts/linkiirctl doctor
curl -s http://127.0.0.1:8080/api/health
```
