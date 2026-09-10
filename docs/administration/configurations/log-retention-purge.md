---
title: Log Retention and Purge
---

# Log Retention and Purge

Message history grows until something removes it. Linkiir has two independent retention settings, and they act on two different stores — knowing which is which saves an afternoon.

| Setting | Acts on | Effect of expiry |
| --- | --- | --- |
| **Queue Retention (days)** | Records on the broker's `linkiir.*` topics | The window a node or the Archiver can still replay from. See [Kafka Configuration](kafka-redpanda.md#setting-queue-retention). |
| **Log Retention Days** | Rows in the Log DB — the archive behind the Logs page | How far back message history goes. Purged records are gone, payloads included. |

Both live under **Settings → Logging**, in separate cards.

---

## Configure the purge

**Settings → Logging → Log Retention Purge**. Press **Edit**, change the fields, then **Save**.

| Field | Meaning |
| --- | --- |
| **Log Retention Days** | How many days of log records to keep. `0` means unlimited — nothing is ever purged. Records older than this are deleted by the scheduled purge. |
| **Purge Time** | Time of day the scheduled purge runs, in the server's local time. Defaults to `02:00`. |

A purge runs once a day at **Purge Time**, deletes every record older than *now minus Log Retention Days*, then compacts the archive so the freed space returns to the disk.

Two things worth knowing about the schedule:

- **Setting a retention does not purge immediately.** The first schedule is anchored when the setting is saved, so switching retention on cannot turn into an unannounced multi-million-row delete during a restart. Use **Purge Now** if you want it applied at once.
- **The schedule survives a restart**, and it will not run twice in one day if you change the settings between runs.

Below the fields, the card reports:

| Line | Shows |
| --- | --- |
| **Next purge** | When the next scheduled purge is due, with a countdown — or *Never — retention is unlimited* |
| **Last purge** | When the last run finished, how many records it removed, and how much disk it reclaimed |

While a purge runs, the card says which phase it is in (*Purging* or *Compacting*) and how many records have gone so far. It continues in the background, so you can leave the page.

Failures are reported as two separate lines, because they are two different outcomes: *Last purge failed* means records were not deleted, while *the last purge deleted its records but could not reclaim the disk space* means the rows are gone and only the file size stayed put.

---

## Purge on demand

**Purge Now** applies the saved rule early. It never deletes anything the schedule would have kept — there is no alternate cutoff to choose, and no scope selector.

The confirmation window measures the archive first and reports:

- **Records to delete** and **Records kept**
- **Archived payload freed**
- **Oldest record** and **Newest record deleted**
- **Database on disk** and **Disk space reclaimed** (SQLite only)

That measurement is a full scan of everything past the cutoff. On an archive that has never been purged it takes seconds to a minute; nothing is deleted until you confirm with **Purge records**.

The button is unavailable while retention is unlimited, and while a purge is already running.

:::warning[Purged records cannot be recovered]
A purge deletes the index row, the event detail, and the archived message payload. There is no undo and no recycle bin. Take a database backup before the first purge on an archive you have never purged.
:::

---

## Reclaiming the disk space

Deleting rows frees space inside the database; handing that space back to the filesystem is a second step, and how it happens depends on the backend.

| Backend | What happens | Archiver |
| --- | --- | --- |
| **SQLite, first purge** | The database file is rebuilt compacted. The compacted copy is written before the original is replaced, so this needs free space on the same volume of about 1.15 times the current file size — a 20 GB archive wants roughly 23 GB free. | Stopped for the duration. Nothing is lost — records wait on the queue and are archived when it comes back. |
| **SQLite, later purges** | Freed pages are returned incrementally, a chunk at a time. | Keeps running. |
| **PostgreSQL / MS SQL** | Rows are deleted; reclaiming the storage is left to the database server, which manages its own files. | Keeps running. |

The rebuild is a one-off: it switches the file to incremental reclaim on the way through, so every later purge is the cheap path. The confirmation window tells you in advance which of the three applies, and warns you if there is not enough free disk to rebuild — in that case the purge still runs, and the space it frees is reused by new records instead of returned.

Deletion itself is done in small committed batches with a pause between them, so the Archiver's writes are never queued behind a long run of deletes. Archiving continues throughout on every backend except during a SQLite rebuild.

---

## Choosing a retention

There is no default retention: a fresh installation keeps everything until you decide otherwise.

- Set it from your organisation's record-retention policy, not from disk pressure.
- Message **content** search only reaches messages whose payload is still in the archive. A short retention narrows what "did the message arrive?" can be answered from. See [Log Search and Message History](../logs/index.md).
- Size the volume for the retention you set, plus the headroom the first rebuild needs.
- Purged history is not recoverable from the broker either, unless the records are also still inside the queue retention window — which is normally much shorter.

---

## Permissions

| Action | Needs |
| --- | --- |
| Read the purge schedule, status, and preview | Any signed-in account |
| Change **Log Retention Days** or **Purge Time** | **Logging settings** |
| **Purge Now** | **Logging settings** |

Running a purge is deliberately the same permission as configuring one: it applies the same rule the schedule does, only sooner.

---

## Next

- [Log Archive Database](log-archive-database.md)
- [Log Search and Message History](../logs/index.md)
- [Kafka Configuration](kafka-redpanda.md)
- Web API: `GET /api/settings/logs/purge`, `GET /api/settings/logs/purge/preview`, `POST /api/settings/logs/purge`
