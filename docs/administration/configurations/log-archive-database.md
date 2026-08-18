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

## Browse indexes are rebuilt after an upgrade

The **Logs** page reads newest-first and filters by project, level, record class, and event type. The indexes that make those reads a seek rather than a scan carry all of those columns, so a release that changes their shape has to rebuild them — an index cannot be redefined in place under the same name.

### SQLite

The Grid checks the index definitions at startup and rebuilds any that no longer match. On a database with a lot of records that is around a minute of work, so it runs on a background thread: the Grid serves requests throughout, and the **Logs** page shows what is happening.

| Banner | Meaning |
| --- | --- |
| *Optimising the log index* | The rebuild is running, with the current phase and elapsed time. Searching and filtering are slow until it finishes. |
| *Log index ready* | Done. The page refreshes itself, so the rows on screen come back through the new index. |
| *The log index could not be rebuilt* | Logs are still readable, but queries stay slow. The reason is in the Grid's runtime log. |

Two things to expect while it runs:

- **New records are not archived yet.** Building an index holds SQLite's write lock, so the Archiver is started only once the rebuild finishes. Nothing is lost — records wait on their Kafka topics and are written when it connects.
- **It runs once**, after the upgrade that changed the definitions. A normal restart finds the indexes already correct and does nothing.

### PostgreSQL and MS SQL

The Archiver creates the new indexes itself when it starts, so there is no Grid-side rebuild to wait behind and no banner. On a large existing database, plan for the index creation to take time and to load the server while it runs — treat it as part of the upgrade window.

The superseded `idx_log_event_time` index is left in place rather than dropped for you. It is redundant once `idx_log_time_id` exists; drop it by hand if you would rather not carry the write cost.
