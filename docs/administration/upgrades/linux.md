---
title: Upgrade on Linux
---

# Upgrade on Linux

Use the same package variant and queue mode as the installed system.

```bash
tar xzf linkiir-1.1.0-linux-x64-redpanda.tar.gz
cd linkiir-1.1.0-linux-x64-redpanda
sudo ./install.sh --queue bundled-redpanda
```

Check the current queue mode before upgrading:

```bash
grep '^mode' /etc/linkiir/config.ini
```

The installer:

- Backs up `/etc/linkiir/` to `/var/lib/linkiir/backups/pre-upgrade-<timestamp>/`.
- Stops Grid and then the bundled queue.
- Aborts if processes do not release within the stop timeout.
- Replaces `/opt/linkiir`.
- Preserves `/etc/linkiir/config.ini`, `/etc/linkiir/linkiir.env`, and `/var/lib/linkiir`.

After upgrade:

```bash
systemctl status linkiir-grid
curl -s http://127.0.0.1:8080/api/health
```
