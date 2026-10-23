---
title: Database Node
description: Write the database rows each message carries into SQL Server, PostgreSQL, Oracle or SQLite, with no script — set up the connection, the tables, and how rows are written.
keywords: [database, destination, SQL Server, PostgreSQL, Oracle, SQLite, upsert, insert, schema.json, tables, batching, reconnect]
---

# Database Node

**Destination Database** writes the rows each message carries into a database: **SQL Server**, **PostgreSQL**, **Oracle** or **SQLite**. It runs no script. Its connection, its tables and how it writes are all set in its **Configure** dialog.

```text
Source  →  Data Map (database destination)  →  Database
```

The node doesn't have to follow a Data Map. Any node that sends rows in the form below works: a Transform Custom node that builds them, or another source.

---

## What a message must hold

A message is a JSON object of rows by table. One row is an object. Several rows are an array of objects:

```json
{
  "patients": [{ "mrn": "7", "family_name": "Doe", "birth_date": "1980-04-02" }],
  "results": [
    { "mrn": "7", "code": "GLU", "value": 5.4 },
    { "mrn": "7", "code": "K", "value": 4.1 }
  ]
}
```

- **Values** can be text, numbers, `true`/`false` or `null`. `true` and `false` are written as `1` and `0`, and `null` as SQL `NULL`.
- **Table order:** tables are written in the order the message lists them. To write a parent table before its child tables, list it first.
- **Table names** must be in the node's tables, which are described in its `schema.json` (see [Schema tab](#schema-tab)). **Unknown Tables** decides what happens to a table the schema doesn't have.

A [Data Map node](data-map/index.md) with a database destination produces exactly this. In a script, build the table and push it as JSON:

```lua
function main(Data)
   local rows = { patients = { { mrn = "7", family_name = "Doe" } } }
   linkiir.flow.push{ data = linkiir.json.serialize(rows) }
end
```

---

## Setting up the node

1. Drag **Database** from **Destination** in the palette, connect the node that sends it rows, and **Save** the canvas. The dialog can't open until the node exists.
2. Select the node and click **Configure** in **Node Parameters**.
3. On **Connection**, fill in the database and click **Test connection**.
4. On **Schema**, add the tables the node writes.
5. On **Database**, click **Check tables**, and create any tables the database doesn't have yet.
6. On **Behaviour**, choose how rows are written.
7. Click **Save**, then start the node.

### In the Node Parameters panel

For a Database node, the panel shows a summary instead of the field list:

- the database and where it is, for example `PostgreSQL · db1:5432 / clinic`;
- **Write mode**, **Unknown tables** and **On error**;
- the node's tables.

Under the summary are two buttons:

- **Configure** opens the dialog. You don't need the panel's **Edit** first. While the panel itself is in edit mode, **Configure** waits until you save or cancel that edit, so the two can't save over each other.
- **Edit Schema** opens the node's `schema.json` on the Scripting page.

The panel also warns when:

- a table has no primary key and **Write Mode** is **Upsert**;
- `schema.json` has changes that haven't been committed.

Without the **Edit config values** permission, the button reads **View configuration** and the dialog is read-only. See [Users and Roles](../../administration/configurations/user-roles.md).

### Saving

**Save** in the dialog saves the node's settings and its `schema.json` together, and commits `schema.json`. There's no separate canvas save for it. **Cancel** asks before throwing away unsaved changes.

A running node keeps the settings it started with. Restart it to pick up a change.

---

## Connection tab

The fields shown depend on **Database**.

| Field | Shown for | Notes |
| --- | --- | --- |
| **Database** | All | `SQL Server` (default), `PostgreSQL`, `Oracle` or `SQLite`. |
| **Server** | SQL Server, PostgreSQL, Oracle | Host name or address. |
| **Port** | SQL Server, PostgreSQL, Oracle | Left blank, the usual port is used: `1433`, `5432` or `1521`. For a SQL Server named instance, SQL Server Browser finds it. |
| **Instance** | SQL Server | A named instance such as `SQLEXPRESS`. Blank for the default instance. |
| **Database Name** | SQL Server, PostgreSQL | Blank uses the login's default database. |
| **Service Name** | Oracle | For example `FREEPDB1`. |
| **Database File** | SQLite | Relative to the Grid's working directory, or a full path. |
| **Authentication** | SQL Server | `SQL Server login` (default), `Windows (integrated)`, `Microsoft Entra ID password` or `Microsoft Entra ID integrated`. The integrated choices log in as the account Linkiir runs under, and hide **User** and **Password**. |
| **User**, **Password** | SQL Server, PostgreSQL, Oracle | The password is stored encrypted. |
| **Encryption** | SQL Server | `Mandatory` (default), `Optional` or `Strict (TDS 8.0)`. |
| **Trust Server Certificate** | SQL Server | Off by default. Turn it on only for a server with a self-signed certificate. |
| **SSL Mode** | PostgreSQL | `Disable`, `Allow`, `Prefer` (default), `Require`, `Verify CA` or `Verify full`. |
| **Search Path** | PostgreSQL | The schema the tables are in. Blank uses the server's search path, usually `public`. |
| **Protocol** | Oracle | `TCP` (default), or `TCPS (TLS)`. |
| **Connect Timeout** | PostgreSQL, Oracle | Seconds. Blank uses the driver's default. |

**Test connection** connects with the values in the dialog, saved or not, and says whether it worked. A password that's already saved is used without being shown again.

Each Database node has its own connection. Two nodes writing to the same database each hold their own settings. Put shared values such as the password in the project's **Variables** tab flagged **Secret**. See [Project Settings](../../administration/configurations/project-settings.md).

The database's driver must be installed on the machine that runs Linkiir. SQL Server needs Microsoft **ODBC Driver 18 for SQL Server**, and PostgreSQL needs psqlODBC. See [Database Drivers](../../administration/configurations/database-drivers.md).

---

## Schema tab

The node writes only tables described in its own `schema.json`, a [DB Schema](../schema-editor.md#database-tables). The tab lists each table with its column count and primary key.

The schema is the node's own copy. Copying tables from another node doesn't link the two, so a later change to that node's schema doesn't reach this one.

| To | Use |
| --- | --- |
| Copy tables from a node that sends to this one | **Add from an upstream node**. It lists the tables of every node upstream that holds a database schema, such as a Data Map's destination. Tick the tables and **Copy**. A table the node already has is marked **Already in this node**. |
| Build or change tables by hand, or read them from the database | **Edit schema**, or **Create schema** when there are none. It opens the Schema Editor on the Scripting page. **Import** there reads tables from the database with this node's connection. |
| Use a schema file you already have | **Upload schema**, or **Replace schema** when the node has tables. The file must be a DB Schema (`"protocol": "db"`). |
| Keep a copy | **Download schema**. |
| Stop writing a table | The remove button on its row. This removes it from the node's tables only. The table in the database is left as it is. |

### Which database a schema is for

A DB Schema is for one database, or for **Any database**. The node refuses to start when its schema is for a different database than **Database** says. Tables can't be copied between schemas for different databases, except into a node that has no tables yet, which takes the copied schema's database.

### Primary keys

**Upsert** matches rows on each table's primary key, so every table needs one. The **Schema** tab and the panel both warn about a table without one. Mark the key columns in the Schema Editor, or set **Write Mode** to **Insert only**.

### Changes made on the Scripting page

**Edit schema** changes `schema.json` on the Scripting page, where changes stay uncommitted until you **Commit**. The node runs the last committed schema. Until you commit, the panel says so and links to **Review and commit**. `schema.json` can't be renamed, moved or deleted, because the node needs it.

---

## Database tab

**Check tables** compares the node's tables with the database. It only reads, and nothing is changed.

| Result | Meaning |
| --- | --- |
| **Missing** | The database has no table of that name. |
| **Matches** | The table is there, and it fits. |
| **Differs** | The table is there, but the database lacks a column the node writes, has a `NOT NULL` column the node doesn't fill, or has a different primary key. Each difference is listed. |

To create a missing table, tick **Create** and click **Create tables**. Only the ticked tables are created.

To remake a table that exists, tick **Drop and remake**. This drops the table and creates it again from the schema.

:::danger[Drop and remake deletes every row in the table]
Linkiir lists the tables it will drop and asks you to confirm before it does anything. It can't be undone. Use it on a development table, never on one holding data you need.
:::

The node never creates, changes or drops a table on its own. Tables change only when you create them here, or in the Schema Editor with **Export to database…**.

---

## Behaviour tab

### Writing

| Field | Default | Options |
| --- | --- | --- |
| **Write Mode** | `Insert only` | `Insert only` adds every row as a new one. `Upsert` updates the row with the same primary key, or inserts it when there is none. |
| **Unknown Tables** | `Treat as an error` | `Treat as an error` handles the message as **On Error** says. `Skip the table` skips that table's rows and writes the rest. |
| **On Error** | `Stop the node` | `Stop the node` stops processing until the node is restarted. `Skip the message` logs the error and carries on with the next message. |

With **Upsert**, a column that a row leaves out keeps the value it already has in the database.

**Rows are never deleted.** Neither write mode removes rows, including child rows that a later message no longer includes.

### Batching

| Field | Default | Range | Notes |
| --- | --- | --- | --- |
| **Rows per Statement** | `100` | 1–1000 | Rows of one table sent in one insert or upsert statement. `1` writes each row with its own statement. |
| **Messages per Transaction** | `1` | 1–1000 | Messages committed together in one transaction. |
| **Batch Wait** | `500` | 0–60000 ms | How long to wait for more messages to fill a transaction. Used only when **Messages per Transaction** is above `1`. |

Raise **Rows per Statement** and **Messages per Transaction** for high volumes. Fewer round trips and fewer commits make the node faster, and batching never changes what is written.

### Reconnecting

| Field | Default | Notes |
| --- | --- | --- |
| **Attempt to Reconnect** | `Yes, with limit` | `No`, `Yes` or `Yes, with limit`. Applies at start and when the connection is lost. |
| **Reconnect Attempts** | `60` | With `Yes, with limit`, the most attempts before the node stops. |
| **Reconnect Interval** | `10000` | Milliseconds between attempts. |

With reconnecting on, the node starts even when the database can't be reached yet. It warns and keeps trying.

---

## How messages are written

**Each message is written whole or not at all.** All of a message's tables go in one transaction. If any row fails, nothing from that message is written.

**When batching**, if a transaction of several messages fails, the messages are written again one at a time. Each message is still whole or nothing, and **On Error** applies only to the message that failed.

**Rows are checked before anything is written.** The check fails, and the message is handled as **On Error** says, when:

- a row names a column the table doesn't have;
- a value doesn't fit its column's type or length;
- a `NOT NULL` column has no value. With **Insert only**, a row must give every `NOT NULL` column.

**When the database can't be reached**, the node stops after the reconnect attempts run out, whatever **On Error** says. A message is never skipped because the database was down. Unwritten messages wait in the queue until the node is restarted.

**Delivery is at least once**, so after an interruption a message can be written twice. **Upsert** on a key from the message, such as a message control ID or an MRN, makes a repeat harmless. With **Insert only**, a repeat adds a second row.

---

## Monitoring

The node doesn't log the messages it writes. It logs what it did with each one. Every line carries the correlation ID of the message it is about, so **Related messages** on the **Logs** page shows the lines with that message's other records: the source message, the Data Map's output, then the Database node's lines.

| Level | Line | When |
| --- | --- | --- |
| INFO | `Wrote 1 row to patients, 3 rows to results` | A message is written. `Nothing to write: the message has no rows` for one with no rows. |
| DEBUG | `SQL: INSERT INTO …` | Each statement the node runs, in a line of its own. Only with **Debug Logging** on. |
| WARN | `Skipped the rows for <table>: …` | **Unknown Tables** is `Skip the table`. |
| ERROR | The database's own message | A message can't be written. With **On Error** set to `Skip the message`, it reads `Skipped a message: …`. |
| WARN | Lost the connection, each failed reconnect attempt | The database can't be reached. |
| INFO | `Connected to the … database again after N attempts` | The node is back. |

With **Messages per Transaction** above `1`, one statement can write the rows of several messages. Its SQL line then begins `SQL, in one transaction with N messages:` and appears under each of those messages.

:::caution[The SQL lines contain the values written]
Each statement includes the values it writes, so with **Debug Logging** on, the logs hold the data the node wrote. The Logs page's PHI masking doesn't apply to these lines. Turn **Debug Logging** on only while you need it, and only where the people who can read the logs may see that data.
:::

The Monitor counts the messages each node received and sent as usual.

---

## Next

- [Destination Nodes](destination-nodes.md)
- [Data Map formats: database rows](data-map/formats.md#database-rows)
- [Schema Editor: database tables](../schema-editor.md#database-tables)
- [Database Drivers](../../administration/configurations/database-drivers.md)
