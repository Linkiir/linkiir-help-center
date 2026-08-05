---
title: Install on Linux
---

# Install on Linux

## Choose native or Docker

Use the native systemd package when the target distribution meets the package glibc requirement. Use Docker when the host is older, lacks systemd, or should remain isolated from bundled dependencies.

### Native requirements

- x64 Linux with systemd.
- Root privileges.
- 4 GB RAM minimum; 8 GB recommended with a bundled broker.
- The current native package is built on Ubuntu 24.04 and requires glibc 2.38 or later.

Check glibc:

```bash
ldd --version | head -1
```

### Native installation

```bash
tar xzf linkiir-1.0.0-linux-x64-redpanda.tar.gz
cd linkiir-1.0.0-linux-x64-redpanda
sudo ./install.sh
```

The installer offers bundled Redpanda, bundled Kafka, or an external broker according to the selected tarball.

Default locations:

| Purpose | Path |
| --- | --- |
| Program files | `/opt/linkiir` |
| Configuration | `/etc/linkiir` |
| Working directory | `/var/lib/linkiir` |
| Main configuration | `/etc/linkiir/config.ini` |
| Master key | `/etc/linkiir/linkiir.env` |

### Docker installation

Install Docker Engine and the Compose plugin, then verify both:

```bash
docker info
docker compose version
```

Install an offline bundle:

```bash
tar xzf linkiir-1.0.0-linux-docker-redpanda-amd64.tar.gz
cd linkiir-1.0.0-linux-docker-redpanda-amd64
./scripts/linkiirctl install
```

## Remote access

Linkiir binds to localhost by default. Change the administrator password first. Then, where approved, update the Docker `.env` or native Grid bind address and restrict the firewall source.

## Verify

Native:

```bash
systemctl status linkiir-grid
curl -s http://127.0.0.1:8080/api/health
```

Docker:

```bash
./scripts/linkiirctl status
./scripts/linkiirctl doctor
```
