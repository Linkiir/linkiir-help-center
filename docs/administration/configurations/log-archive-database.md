---
title: 'Log Archive Database: PostgreSQL or MS SQL'
---

# Log Archive Database: PostgreSQL or MS SQL

The Log Archiver persists message indexes, payload archives, event details, offsets, and instance health to a SQL database.

## Supported production choices

| Area | PostgreSQL | Microsoft SQL Server |
| --- | --- | --- |
| Multi-archiver writes | Supported | Supported |
| Idempotent insert pattern | `ON CONFLICT DO NOTHING` | `MERGE` or equivalent guarded insert |
| Typical fit | Linux/cloud/open-source database standard | Microsoft enterprise database standard |
| Operational tooling | PostgreSQL ecosystem | SQL Server/SSMS ecosystem |

Both are valid. Choose the database your organization can back up, monitor, patch, tune, and support reliably.

## Do not use SQLite for multiple Archivers

SQLite is the default single-machine DEV profile and should have exactly one writer. PostgreSQL and MS SQL support multiple Archiver instances in the same consumer group.

## Configuration process

1. Create an empty database, for example `linkiir_logs`.
2. Create a least-privilege Log Archiver database user.
3. Open **Settings → Logs**.
4. Select PostgreSQL or MS SQL.
5. Enter host, port, database, user, and password.
6. Set the Archiver instance count.
7. Test the connection.
8. Restart all Archiver instances.
9. Verify tables, indexes, heartbeats, assigned partitions, and recent events.

The Archiver creates or upgrades its schema according to the release. Store the database password encrypted through Linkiir settings or an approved secrets integration.
