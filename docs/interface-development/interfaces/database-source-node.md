---
title: Database Source Node
description: Read records out of SQL Server, PostgreSQL, Oracle or SQLite with no script. A status table says which records are ready; the node sends each one downstream as rows by table and marks it as processing.
keywords: [database, source, status table, polling, SQL Server, PostgreSQL, Oracle, SQLite, schema.json, table links, waiting, processing, failed]
---

# Database Source Node

**Source Database** reads records out of a database and sends each one downstream: **SQL Server**, **PostgreSQL**, **Oracle** or **SQLite**. It runs no script. Its connection, its tables and how it finds records are all set in its **Configure** dialog.

```text
Your application  →  status table + data tables  →  Database source  →  Data Map, Database destination, File/FTP, …
```

Another application says which records are ready through a **status table**. The status table has one row per record, holding the record's identifier and a status. The node reads each record whose status is **Waiting** and sends it, then sets it to **Processing**.

---

## How a record moves

| Status | Default | Set by | Means |
| --- | --- | --- | --- |
| **Waiting** | `W` | Your application | The record is ready. The node reads it at its next poll. |
| **Processing** | `P` | The node, once the record is sent | The record is on its way downstream. The node never changes it again. |
| **Failed** | `F` | The node | The record couldn't be read, for example because no table has rows for it. It was never sent, and the node logged why. |

Every poll, the node:

1. finds up to **Records per Poll** records at the Waiting status, in **Order By Column** order (then identifier order), or in no particular order without one;
2. reads each record's row of the status table, and the rows of every other table whose link column holds the record's identifier;
3. sends them downstream as one message;
4. once the message is in the queue, sets the record to the Processing status. It does this only while the record is still Waiting, so a status a downstream node has already set is kept.

A record is sent and marked one at a time, in order. A poll that finds a full **Records per Poll** looks again at once; otherwise the node waits **Interval** before the next poll. The node never runs two polls at once, however many records a poll finds.

**The node sets nothing after Processing.** Whether a record succeeded downstream is for the downstream nodes to say. See [Setting the outcome downstream](#setting-the-outcome-downstream).

**The status column is the only thing the node writes.** It never inserts, deletes, or changes any other column or table.

---

## What a message holds

Each record is sent as **one JSON object of rows by table**, the same shape the [Database destination](database-node.md#what-a-message-must-hold) and a Data Map's database source take. The status table comes first, then the other tables in **Table Links** order. Every table is an array, even with one row or none.

```json
{
  "patient_queue": [{ "mrn": "M100", "status": "W", "seq": 2 }],
  "patients": [{ "mrn": "M100", "name": "Ada Lovelace", "birth_date": "1815-12-10", "balance": 12.50 }],
  "visits": [
    { "visit_id": 1, "patient_mrn": "M100", "admitted": "2026-10-01 08:30:00", "ward": "North" },
    { "visit_id": 2, "patient_mrn": "M100", "admitted": "2026-10-15 14:05:30.25", "ward": "East" }
  ]
}
```

The status table's row shows the Waiting status, as it was when the node read it.

Values come out in one form whatever the database:

| Column type | Sent as | Example |
| --- | --- | --- |
| Whole and decimal numbers | A JSON number, as the database holds it | `42`, `12.50`, `0.5` |
| Floating point | A JSON number | `1.5` |
| Yes/no | `true` or `false` | `true` |
| Date | `YYYY-MM-DD` | `"1815-12-10"` |
| Date and time | `YYYY-MM-DD HH:MM:SS`, with a fraction when there is one, trailing zeros dropped | `"2026-10-15 14:05:30.25"` |
| With a time zone | The date and time, a space, then `+HH:MM` | `"2026-10-23 08:15:00 -05:00"` |
| Time | `HH:MM:SS`, with a fraction when there is one | `"08:15:00"` |
| GUID | Lower case | `"6f9619ff-8b86-d011-b42d-00c04fc964ff"` |
| Binary | Upper-case hex | `"DEADBEEF"` |
| Text, and anything else | A JSON string | `"Doe"` |
| `NULL` | `null` | `null` |

A [Data Map](data-map/index.md) with a database source reads this shape. A Database destination with the same tables writes it as it is, so a source and a destination copy records between databases.

---

## The tables

The node reads only tables described in its own `schema.json`, a [DB Schema](../schema-editor.md#database-tables): the status table, and the tables a record's data is in.

### The status table

| Column | Notes |
| --- | --- |
| **Identifier Column** | Identifies the record. It must be the status table's primary key **on its own** in `schema.json`, so each status update changes one row. |
| **Status Column** | Holds the status. Each status value must fit it: `CHAR(1)` holds `W`, `P` and `F`. |
| **Order By Column** | Optional. Sets the order records are sent in, for example a sequence number or the time a record was made ready. Records are sent in its order, then by identifier. Left blank, they are sent in no particular order: the order the database finds them in. To send them in identifier order, choose the identifier column. |

The status table can hold other columns too. They are sent with the record's row.

### Table links

Every other table needs a **link column**: the column holding the record's identifier. The node sends the rows where it does. For example, `patients` is linked by `mrn`, and `visits`, keyed by `visit_id`, is linked by `patient_mrn`.

The node never guesses a link. A table without one stops the node from starting, and the error names the table. The dialog proposes one for you (see [Record tab](#record-tab)).

Each table is read by the identifier itself. For a table one step further away, such as results keyed by a visit, put a database view that carries the identifier into the schema, or carry the identifier on that table.

### A record with no rows

When none of the other tables has a row for a record, the node can't send it. It sets the record to the Failed status and logs why. **On Error** then decides whether the node stops.

---

## Setting up the node

1. Drag **Database** from **Source** in the palette, connect it to the node it sends to, and **Save** the canvas. The dialog can't open until the node exists, and the node won't start until it sends somewhere.
2. Select the node and click **Configure** in **Node Parameters**.
3. On **Connection**, fill in the database and click **Test connection**. The fields are the [Database destination's](database-node.md#connection-tab).
4. On **Tables**, click **Import tables from the database**, or **Add table from downstream node**, and tick the status table and the tables a record's data is in.
5. On **Record**, choose the status table and its columns, and check each table's link column.
6. Click **Preview next record** to see what the node would send.
7. On **Behaviour**, set how often it polls.
8. Click **Save**, then start the node.

### In the Node Parameters panel

For a Database source, the panel shows a card for each tab of the **Configure** dialog that holds settings:

- **Connection:** the database and where it is.
- **Tables:** the node's tables, the status table marked **(status)**.
- **Record:** the status table and identifier, for example `patient_queue.mrn`, the statuses (`W → P, failed F`) and the order.
- **Behaviour:** how often it polls and how many records at a time, **On error**, **Connection** and reconnecting.

The Record card also says what stops the node from reading records, for example *Choose the status table.*

**Save** in the dialog saves the settings and `schema.json` together. A running node keeps the settings it started with. Restart it to pick up a change.

---

## Tables tab

The tab works as on the [Database destination](database-node.md#tables-tab): **Check tables**, then **Create**, **Alter** or **Drop and remake** after reviewing the SQL, plus **Edit schema**, **Upload schema** and **Download schema**. Changes to tables are made only there, by you, never by the running node.

The differences:

- **Import tables from the database** lists the database's tables with this node's connection. Tick the ones to read; **Import** reads each table's columns, types and primary key into the node's schema. A table the node already has is skipped unless you tick **Overwrite**. Nothing is saved until you press **Save**.
- **Add table from downstream node** takes the place of adding tables from an upstream node, since a source has none. It offers the tables already described by the nodes this one sends to, for example a Data Map's `source.json` that reads database rows, or a Database destination's `schema.json`. Connect the node to them first. Tick the tables to copy; the node gets its own copy, so a later change downstream needs copying again. A table the node already has is skipped unless you tick **Overwrite**.
- The status table is badged **Status table**, and each other table shows its link column, or **No link column**.
- **Check tables** also says when the node would not start with the settings and tables in the dialog, in the node's own words, for example when the identifier column isn't the status table's primary key in `schema.json`.

---

## Record tab

### How a record moves

The tab opens with the statuses drawn with your values: Waiting, sent, then Processing and the outcome set downstream; or Failed for a record that can't be read. Click a status's value to change what it is written as.

| Status | Default | Notes |
| --- | --- | --- |
| **Waiting** | `W` | The status your application sets on a record that is ready. |
| **Processing** | `P` | The status the node sets once it has sent a record. |
| **Failed** | `F` | The status the node sets on a record it couldn't read. |

A blank status is its default. The three must all be different, compared as the database compares them: ignoring case and trailing spaces. Each must fit the status column: text no longer than the column, or a number for a number column.

### Status table

| Field | Default | Notes |
| --- | --- | --- |
| **Status Table** | | One of the node's tables. Choosing one fills **Identifier Column** with its primary key, and **Status Column** with a column named `status`, when it has them. |
| **Identifier Column** | | The status table's primary key, on its own. |
| **Status Column** | | Any other column of the status table. |
| **Order By Column** | None | **None**, or a column of the status table. With **None** the node asks for no order, so records go in whatever order the database returns them. |

**Creating a status table.** If your database doesn't have one yet, choose **New status table...** in **Status Table**. Give the table a name and choose its columns:

- **Identifier column:** the primary key. Name it like the column of the data tables that holds the same value, and the table links are filled in by it.
- **Identifier type:** one of the database's types that can be a primary key, with its length or precision. It starts as the type of the first data table's key; make it match the data tables' link columns.
- **Status column:** text long enough for your status values.
- **Order column** (optional): a whole number your application sets, for example from a sequence, which the records are sent in. Leave it blank to send them in no particular order.

Hover over a field's name for what it is for.

**Add status table** adds it to the node's tables and fills in the fields above. It isn't in the database yet: on the **Tables** tab, click **Check tables**, then create it after reviewing its SQL.

### Table links

One line per table besides the status table, in the order they are sent. Pick each table's link column.

- A table without a link yet gets the column with the same name as the identifier column, ignoring case. It is marked **Proposed** and saved with the node when you press **Save**.
- A warning appears when a link column is the table's own whole primary key and isn't named like the identifier. A table's own key is rarely the column holding another table's identifier, for example `orders.id` when the identifier is `patient_queue.id`.
- Links to tables the node no longer has are listed, and dropped when you save.

### Try it

| Button | What it does |
| --- | --- |
| **Show SQL** | Shows the statements the node runs with the settings in the dialog, unsaved ones included, without connecting: finding waiting records, reading a record's rows from each table, and the two status updates. When the node would not start, it says why instead. |
| **Preview next record** | Reads the next waiting record as the node would, and shows its identifier, the rows each table gave, and the message it would send. **It changes nothing**: the record stays Waiting, and the node still sends it. It says when no record is waiting, or when the record has no rows and the node would set it to Failed. The SQL it ran is listed below. |

---

## Behaviour tab

### Reading

| Field | Default | Range | Notes |
| --- | --- | --- | --- |
| **Interval** | `10000` | 100–86400000 ms | The wait between polls. A poll that finds a full **Records per Poll** looks again at once. |
| **Records per Poll** | `100` | 1–1000 | The most records one poll reads. Each is sent and marked before the next. |
| **On Error** | `Stop the node` | | What happens after a record can't be read: either way it is set to the Failed status and logged. `Stop the node` stops, so nothing more is sent until it is restarted. `Carry on` goes on to the next record. |

### Staying connected

| Field | Default | Notes |
| --- | --- | --- |
| **Connection** | `Keep open` | `Keep open` holds the connection open while the node runs. `Close between polls` closes it once a poll's records are done, before the node waits the **Interval**, and opens it again for the next poll. Polls that run back to back after a full one share a connection. |

Close it when an idle connection costs something: a database that limits connections, a firewall that drops idle ones, or a long **Interval**. The node then signs in again at every poll.

Reconnecting works as on the [Database destination](database-node.md#staying-connected), and opening the connection for a poll follows it too. With reconnecting on, the node starts even when the database can't be reached yet, warns, and tries again at its first poll. A record being worked on when the connection is lost is picked up where it was.

---

## When something goes wrong

| What happened | The record | The node |
| --- | --- | --- |
| The record can't be read: no rows in any table, or the database refuses a query | Set to **Failed** | Logs an ERROR, then stops or carries on, as **On Error** says |
| The record can't be sent to the queue | Stays **Waiting** | Stops. The record is sent when the node is restarted. |
| The record was sent, but its status can't be set to Processing | Stays **Waiting** | Stops, and logs *Possible duplicate* (below). |
| The database can't be reached | Stays as it was | Reconnects as set, then stops |

**Delivery is at least once.** A record is marked Processing only after the queue has it, so a record is never left at Processing unsent. The other side of this: a record sent whose status then can't be set is still Waiting, and is sent again when the node next runs. The node logs that as an ERROR naming the record, so you can find it in the status table:

```text
Possible duplicate: sent the record patient_queue.mrn = 'M100', but couldn't set it to P (…). It is still W, so the node will send it again when it next runs: a duplicate message downstream.
```

This is the only log line above DEBUG that carries a value from your data. Downstream, upserting on a key the message carries, such as the identifier, makes a repeat harmless.

**Run one Database source per status table.** Two nodes reading the same status table would both send a record they find Waiting.

**Records already at Processing** are left alone, including after a restart.

---

## Setting the outcome downstream

The node's part ends at Processing. To record whether a record succeeded, have a downstream node write the status back:

- A **Database destination** with the status table in its schema and **Write Mode** `Upsert` writes a row such as `{"patient_queue": [{"mrn": "M100", "status": "C"}]}` from a Data Map or a Transform Custom node at the end of the workflow.
- A Transform Custom node can update it itself with `linkiir.store`.

Use statuses of your own for the outcome, such as `C` for complete or `E` for error, different from Waiting.

:::caution[Don't send the source's message straight back into the status table]
The message carries the status row as it was read, at Waiting. A Database destination writing that message into the same status table would set the record back to Waiting, and the node would send it again. Write the outcome from a node that sets the status it means, or leave the status table out of the destination's schema.
:::

---

## Monitoring

The node doesn't log the records it sends. It logs what it did with each one. A sent record's lines carry the message's correlation ID, so **Related messages** on the **Logs** page shows them with the message's other records.

| Level | Line | When |
| --- | --- | --- |
| INFO | `Sent a record: 1 row from patients, 2 rows from visits` | A record is sent and marked. |
| DEBUG | `Record <identifier>` and `SQL: SELECT …` | Each record and each statement. Only with **Debug Logging** on. |
| DEBUG | `Record <identifier> is no longer W: skipped` | A record changed by someone else between the poll and the read. |
| DEBUG | `Closed the connection until the next poll` | With **Connection** set to `Close between polls`, before each wait. Only with **Debug Logging** on. |
| ERROR | `Couldn't read a record, set its status to F: …` | A record can't be read. |
| ERROR | `Couldn't send a record, so it is still W: …` | The queue refused the message. |
| ERROR | `Possible duplicate: …` | A sent record couldn't be marked. |
| WARN | Lost the connection, each failed reconnect attempt | The database can't be reached. |
| INFO | `Connected to the … database again after N attempts` | The node is back. |

:::caution[The DEBUG lines contain your data]
With **Debug Logging** on, the logs hold record identifiers and the SQL with them in it. The Logs page's PHI masking doesn't apply to these lines. Turn **Debug Logging** on only while you need it.
:::

The Monitor counts the messages the node sent as usual.

---

## Next

- [Database Node](database-node.md), the destination
- [Source Nodes](source-nodes.md)
- [Data Map formats: database rows](data-map/formats.md#database-rows)
- [Schema Editor: database tables](../schema-editor.md#database-tables)
- [Database Drivers](../../administration/configurations/database-drivers.md)
