---
title: TEST Deployment
---

# TEST Deployment

TEST validates complete connectivity and operational behavior before production.

## Recommended profile

- Separate environment and credentials.
- Production-like queue security and topic configuration.
- PostgreSQL or MS SQL when multi-archiver behavior or production query performance must be tested.
- Representative message volume and failure scenarios.

## Test plan

- Positive and negative payloads.
- Connection timeout and retry behavior.
- Destination rejection and ACK/NACK handling.
- Runtime restart and recovery.
- Log Archiver interruption and catch-up.
- Project export/import.
- Upgrade and rollback.
- Backup and restore.
- Notification rules once implemented.
