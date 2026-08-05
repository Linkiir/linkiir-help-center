---
title: Deployment
---

# Deployment

Use separate Linkiir environments and promote controlled, versioned project packages through the lifecycle.

| Environment | Primary purpose | Typical queue | Typical Log DB |
| --- | --- | --- | --- |
| [DEV](dev.md) | Build and debug interfaces | Bundled Kafka/Redpanda or local queue profile | SQLite |
| [TEST](test.md) | Integration, regression, and customer validation | Bundled or external Kafka/Redpanda | SQLite, PostgreSQL, or MS SQL |
| [PROD](prod.md) | Live healthcare processing | External Kafka/Redpanda | PostgreSQL or MS SQL |
| [HA](ha.md) | Production continuity | Resilient external broker cluster | Shared resilient PostgreSQL/MS SQL |

Use [Import and Export](import-export.md) to move projects without copying environment-specific secrets.
