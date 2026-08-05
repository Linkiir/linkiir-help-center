---
title: Troubleshooting
---

# Troubleshooting

Start with the health endpoint and platform logs.

```bash
curl -s http://127.0.0.1:8080/api/health
```

A healthy response reports queue, Runtime, and Archiver checks. A short `degraded` state immediately after startup may be normal; a persistent state requires investigation.

## Guides

- [Linkiir Runtime Crashed](runtime-crash.md)
- [Crash Report Collection](crash-report.md)
- [Log Archiver Cannot Reach Queue or Database](log-archiver-connectivity.md)

## First response checklist

1. Record the time and affected environment.
2. Preserve logs before restarting repeatedly.
3. Check disk, memory, and database capacity.
4. Check queue and network connectivity.
5. Determine whether one node, one workflow, Runtime, Archiver, or Grid is affected.
6. Avoid clearing queues or rewinding offsets until the failure is understood.
