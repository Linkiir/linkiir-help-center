---
title: Linkiir Runtime Crashed
---

# Linkiir Runtime Crashed

## Symptoms

- `/api/health` reports Runtime as failed or degraded.
- Workflows stop consuming messages.
- Grid remains available but Runtime PID is absent.
- The service supervisor repeatedly restarts Runtime.

## Immediate actions

1. Record the first failure time.
2. Confirm queue messages remain retained.
3. Capture Runtime logs and operating-system events.
4. Check memory, disk, file descriptors, and process limits.
5. Identify the last workflow/node and message correlation ID before the crash.
6. Disable a reproducibly crashing workflow only when necessary to stabilize the platform.
7. Restart Runtime through Grid or the platform service, not by launching the binary manually.

## Platform commands

Windows:

```powershell
Get-Service LinkiirGrid
Restart-Service LinkiirGrid
Get-ChildItem "C:\ProgramData\Linkiir\logs\runtime"
```

Linux:

```bash
systemctl status linkiir-grid
journalctl -u linkiir-grid --since "30 minutes ago"
sudo systemctl restart linkiir-grid
```

Docker:

```bash
./scripts/linkiirctl status
./scripts/linkiirctl logs linkiir-grid
./scripts/linkiirctl restart
```

## Root-cause questions

- Did a specific script or native module trigger the crash?
- Was the input unusually large or malformed?
- Did Runtime exhaust memory or hit a timeout?
- Did a dependency, schema, or shared library change?
- Did the crash begin after an upgrade?

After recovery, verify consumer offsets, queue depth, message ordering, and downstream duplicates before resuming normal traffic.
