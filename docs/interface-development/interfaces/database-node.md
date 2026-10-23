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

Each message the node reads is **one JSON object of rows by table**: each key is a table name, and its value is that table's rows. One row is an object of values by column name. Several rows are an array of those objects.

```json
{
  "patients": { "mrn": "7", "family_name": "Doe", "birth_date": "1980-04-02" },
  "results": [
    { "mrn": "7", "code": "GLU", "value": 5.4, "taken_at": "2026-10-23 08:15:00" },
    { "mrn": "7", "code": "K", "value": 4.1, "taken_at": "2026-10-23 08:15:00" }
  ]
}
```

That message writes one row to `patients` and two rows to `results`, in one transaction.

### The shape

| Part | Must be | Otherwise |
| --- | --- | --- |
| The message | A JSON object | The message is refused: *the message is not database rows*. |
| Each table's rows | An object (one row) or an array of objects (several rows). An empty object or array writes nothing for that table. | Refused: *the rows of a table are an object, or a list of them*. |
| Each row | An object of values by column name | Refused: *a row is an object of values by column*. |
| Each value | Text, a number, `true`/`false`, or `null` | A nested object or array is refused: *a value is text, a number, true/false or null*. |

Every error names the table, the row (counting from 1) and the column, for example *results row 2 column value: "abc" is not a number*.

A message that is refused writes nothing, and **On Error** decides what happens next: stop the node, or skip the message. See [On Error](#writing).

### Tables

- **Table names** must be tables in the node's `schema.json` (see [Tables tab](#tables-tab)), spelled the same way. **Unknown Tables** decides what happens to a table the schema doesn't have: treat the message as an error, or skip that table's rows.
- **Order:** tables are written in the order the message lists them. To write a parent table before its child tables, list it first.
- **A table listed twice** keeps only its first rows.
- **A message with no rows** at all is not an error; the log says *Nothing to write*.

### Columns

- **Column names** must be columns of the table in `schema.json`, with the **same case**. A name that differs only in case is refused with a hint, for example *patients has no column 'MRN' (did you mean 'mrn'?)*. Names may only hold letters, digits and underscores.
- **A column a row leaves out:**
  - with **Upsert**, an existing row keeps the value it has in the database; a new row gets the column's database default, or `NULL`;
  - with **Insert only**, the new row gets the column's database default, or `NULL`. A `NOT NULL` column must be in every row.
- **`null`** writes SQL `NULL`. It is refused for a `NOT NULL` column.
- **Upsert** needs the table's primary key: every row must give each key column a value that isn't `null`. A table with no key in `schema.json` can't be upserted; mark its key columns, or set **Write Mode** to `Insert only`.
- **Rows are written in order.** With **Upsert**, a later row with the same key updates the earlier one. With **Insert only**, the database refuses a duplicate key.

### Values

Each value is checked against its column's type before anything is written. JSON `true` and `false` are written as `1` and `0`, and a number keeps the text it was written with: `5.0` stays `5.0`, so send `5` to a whole-number column. Text works for every type, so `"42"` is as good as `42`.

| Column type | Accepts | Examples |
| --- | --- | --- |
| Text: `VARCHAR`, `CHAR`, `TEXT`, `NVARCHAR`, `VARCHAR2`, `CLOB`, … | Any text, up to the column's length. Oracle `VARCHAR2` and `CHAR` count bytes unless declared in `CHAR`. | `"Doe"` |
| Whole number: `SMALLINT`, `INTEGER`, `INT`, `BIGINT`, `TINYINT`, Oracle `NUMBER(p)` | Digits, with an optional sign, in the type's range | `42`, `"-7"` |
| Decimal: `DECIMAL`, `NUMERIC`, `MONEY`, Oracle `NUMBER(p,s)` | A number with no exponent, with no more digits before the point than the column holds | `5.4`, `"1200.50"` |
| Floating point: `FLOAT`, `REAL`, `DOUBLE PRECISION`, `BINARY_DOUBLE`, … | Any number, exponent allowed | `6.02e23` |
| Yes/no: `BOOLEAN`, `BIT` | `true`, `false`, `1`, `0` (any case, as text too) | `true`, `"0"` |
| Date: `DATE` | `YYYY-MM-DD`, a real calendar day. On Oracle, `DATE` holds a time too, so `YYYY-MM-DD HH:MM:SS` is accepted there. | `"1980-04-02"` |
| Date and time: `TIMESTAMP`, `DATETIME`, `DATETIME2`, `SMALLDATETIME` | `YYYY-MM-DD`, optionally with `HH:MM`, `HH:MM:SS` or `HH:MM:SS.fffffffff`, separated by a space or `T` | `"2026-10-23 08:15:00"`, `"2026-10-23T08:15"` |
| With a time zone: `TIMESTAMPTZ`, `DATETIMEOFFSET`, `TIMESTAMP WITH TIME ZONE` | A date and time followed by `Z`, `+HH:MM` or `+HHMM`. The offset is required. | `"2026-10-23 08:15:00-05:00"`, `"2026-10-23T13:15:00Z"` |
| Time: `TIME` | `HH:MM`, `HH:MM:SS` or `HH:MM:SS.fffffffff` | `"08:15:00"` |
| GUID: `UNIQUEIDENTIFIER`, `UUID` | 8-4-4-4-12 hex digits, optionally in braces | `"6f9619ff-8b86-d011-b42d-00c04fc964ff"` |
| Binary: `BINARY`, `VARBINARY`, `BYTEA`, `RAW`, `BLOB` | Hex digits, an even number of them, optionally starting `0x`, up to the column's length in bytes | `"DEADBEEF"`, `"0x00FF"` |

Any other type takes the value as text. In SQLite, `INTEGER` holds any whole number, and `NUMERIC` any number.

### Where the rows come from

A [Data Map node](data-map/index.md) with a database destination produces exactly this shape, from the same kind of schema.

Any other node can send it too. In a script, build a Lua table and push it as JSON:

```lua
function main(Data)
   local rows = {
      patients = { mrn = "7", family_name = "Doe" },
      results = {
         { mrn = "7", code = "GLU", value = 5.4 },
         { mrn = "7", code = "K", value = 4.1 },
      },
   }
   linkiir.flow.push{ data = linkiir.json.serialize(rows) }
end
```

---

## Setting up the node

1. Drag **Database** from **Destination** in the palette, connect the node that sends it rows, and **Save** the canvas. The dialog can't open until the node exists.
2. Select the node and click **Configure** in **Node Parameters**.
3. On **Connection**, fill in the database and click **Test connection**.
4. On **Tables**, add the tables the node writes. Then click **Check tables**, and create any tables the database doesn't have yet.
5. On **Behaviour**, choose how rows are written.
6. Click **Save**, then start the node.

### In the Node Parameters panel

For a Database node, the panel shows a card for each tab of the **Configure** dialog that holds settings:

- **General:** the description and the commit the node runs.
- **Connection:** the database and where it is, for example `PostgreSQL · db1:5432 / clinic`.
- **Tables:** the node's tables.
- **Behaviour:** **Write mode**, **Unknown tables**, **On error** and reconnecting.
- **Advanced:** debug logging, payload encryption, rows per statement and transactions.

Under the cards are two buttons:

- **Configure** opens the dialog. A card's title opens it on that card's tab. See [The Configure dialog](index.md#the-configure-dialog).
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

## Tables tab

The node writes only tables described in its own `schema.json`, a [DB Schema](../schema-editor.md#database-tables). The tab lists each table with its column count, its primary key, and whether the database has it.

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

**Upsert** matches rows on each table's primary key, so every table needs one. The **Tables** tab and the panel both warn about a table without one. Mark the key columns in the Schema Editor, or set **Write Mode** to **Insert only**.

### Changes made on the Scripting page

**Edit schema** changes `schema.json` on the Scripting page, where changes stay uncommitted until you **Commit**. The node runs the last committed schema. Until you commit, the panel says so and links to **Review and commit**. `schema.json` can't be renamed, moved or deleted, because the node needs it.

### Checking and changing tables in the database

Until you check, each table's **In the database** column says **Not checked**. **Check tables** compares the node's tables with the database and fills it in. It only reads, and nothing is changed.

| Result | Meaning |
| --- | --- |
| **Missing** | The database has no table of that name. |
| **Matches** | The table is there, and it fits. |
| **Differs** | The table is there, but its columns, their types, their `NOT NULL`, or its primary key aren't the schema's. Each difference is listed. |

Types are compared as the database declares them, so `VARCHAR(20)` against a schema's `VARCHAR(40)` differs. SQLite keeps only a column's affinity (`INTEGER`, `REAL`, `TEXT`, `NUMERIC`, `BLOB`), so there `VARCHAR(20)` and `VARCHAR(40)` are the same.

After a check, each row has an **Action**, and you pick one per table:

| Action | Shown for | What it does |
| --- | --- | --- |
| **Create** | A missing table | Creates it from the schema. |
| **Alter** | A table that differs | Changes the table in place to match the schema, keeping its rows. |
| **Drop and remake** | Any table that exists | Drops the table, with every row in it, and creates it again from the schema. |

Tick the actions you want and click **Review SQL**.

#### Altering a table

Ticking **Alter** opens what will change under the table's row:

- **Columns the database doesn't have** are added. If one of them is a database column under another name, pick **Rename *column*, keeping its data** instead of **New column**.
- **Columns only the database has** are kept unless you tick them to drop. Dropping a column deletes the data in it. A kept `NOT NULL` column that the node doesn't write makes its inserts fail, and the dialog says so.
- **Changed to match the schema** lists the types, `NOT NULL` and primary key that will change.
- **Values for the existing rows** appears when the table has rows and a column will be `NOT NULL`: a new required column, or one that allowed empty values. Rows without a value get the one you give, so the database accepts the change. Write dates as `YYYY-MM-DD`, dates and times as `YYYY-MM-DD HH:MM:SS`, and true or false for yes/no columns. **Review SQL** waits until each has a value.

How each database makes the change:

| Database | How |
| --- | --- |
| **SQL Server** | `ALTER TABLE`, with `sp_rename` for renames. A primary key is dropped by the name SQL Server gave it and added again. |
| **PostgreSQL** | `ALTER TABLE`. A type change converts the existing values (`USING column::type`). |
| **Oracle** | `ALTER TABLE ... MODIFY`, `RENAME COLUMN` and `DROP PRIMARY KEY`. |
| **SQLite** | Adds, renames and drops a plain column in place. Any other change rebuilds the table: a new table is created from the schema, the rows are copied into it, the old table is dropped, and the new one takes its name. Indexes and triggers on the old table are not carried over. |

A column becoming `NOT NULL` is filled first (`UPDATE ... WHERE column IS NULL`) and then made `NOT NULL`, on every database.

The node's schema has no default values, so Alter never creates one. Defaults the database's columns already have are kept:

- **SQL Server** won't drop or retype a column that has a default, so the default is removed first. After a type change it is put back under its original name.
- **PostgreSQL** removes a default before a type change and sets it again after.
- **SQLite** declares each column of a rebuilt table with the default it had.
- **Oracle** keeps defaults through every change.

These steps appear in the review like any other. If a default no longer fits a column's new type, putting it back fails, and the table is left as it was.

A row the node inserts without a value for a column gets that column's default, or `NULL` when it has none.

#### Reviewing and running the SQL

Before anything runs, the review shows the exact statements for each ticked table, and the database they run against. To write an alter's SQL, Linkiir reads the table's columns and how many rows it holds; nothing is changed. A table being remade shows its `DROP TABLE` before its `CREATE TABLE`. **Copy SQL** copies them all, for example to run them yourself or hand them to a database administrator. Nothing is run until you click **Execute**; **Cancel** leaves the database as it was.

When you click **Execute**, Linkiir writes the SQL again from the table as it is then. If it no longer matches what you reviewed, because someone changed the table in between, that table isn't run and the dialog asks you to review it again.

On SQL Server, PostgreSQL and SQLite, each table's statements run in one transaction (`BEGIN` … `COMMIT`). If one fails, the table is left exactly as it was. Oracle commits each change to a table as it runs, so if one fails there the changes before it stay made. The review warns about this on Oracle; check the table again to see where it stands.

A table Linkiir can't write SQL for is listed as **Skipped** with the reason, and is not run. For example, the table has no columns, or a value given for existing rows doesn't fit the column.

:::danger[Drop and remake deletes every row; dropping a column deletes its data]
The review names the tables and columns that will be dropped, and **Execute** turns red. It can't be undone. Use them on a development table, never on one holding data you need.
:::

The node never creates, changes or drops a table on its own. Tables change only when you create, alter or remake them here, or in the Schema Editor with **Export to database…**.

Changing the node's tables clears the check, so check again after adding, removing or uploading tables. A check uses the tables as they are in the dialog, unsaved changes included.

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

### Reconnecting

| Field | Default | Notes |
| --- | --- | --- |
| **Attempt to Reconnect** | `Yes, with limit` | `No`, `Yes` or `Yes, with limit`. Applies at start and when the connection is lost. |
| **Reconnect Attempts** | `60` | With `Yes, with limit`, the most attempts before the node stops. |
| **Reconnect Interval** | `10000` | Milliseconds between attempts. |

With reconnecting on, the node starts even when the database can't be reached yet. It warns and keeps trying.

---

## Advanced tab

Besides **Debug Logging**, **Payload Encryption** and **Permissions**, which every node has (see [The Configure dialog](index.md#the-configure-dialog)), a Database node's **Advanced** tab holds **Batching**.

### Batching

| Field | Default | Range | Notes |
| --- | --- | --- | --- |
| **Rows per Statement** | `100` | 1–1000 | Rows of one table sent in one insert or upsert statement. `1` writes each row with its own statement. |
| **Messages per Transaction** | `1` | 1–1000 | Messages committed together in one transaction. |
| **Batch Wait** | `500` | 0–60000 ms | How long to wait for more messages to fill a transaction. Used only when **Messages per Transaction** is above `1`. |

Raise **Rows per Statement** and **Messages per Transaction** for high volumes. Fewer round trips and fewer commits make the node faster, and batching never changes what is written.

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
