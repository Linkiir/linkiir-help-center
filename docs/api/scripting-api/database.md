---
title: Database
---

# Database

`linkiir.store`

Database access, named for what it does (store / retrieve). Connection-object style only; query results are Linkiir node trees (protocol code 103 = DB).

---

## `linkiir.store.open`

*function*

```lua
linkiir.store.open{ driver=, name=, user=, password=, live= }
```

Open a database connection. Pass one of the driver constants (linkiir.store.SQLITE, MYSQL, MARIADB, ORACLE, POSTGRES_ODBC, SQLSERVER_ODBC, ORACLE_ODBC, MYSQL_ODBC) as the driver parameter.

**Usage**

```lua
local conn, err = linkiir.store.open{ driver=, name=, user=, password=, timeout=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `driver` | integer | Yes | One of the linkiir.store.* driver constants (e.g. linkiir.store.SQLITE). These are integer values, not strings. |
| `name` | string | Yes | The DSN, host, database or file, per driver: for ODBC drivers a connection string or DSN name, for SQLITE a file path. A relative SQLite path resolves against linkiir.sys.workingDir(). |
| `user` | string | No | Username. For the ODBC drivers it is added to the connection string as UID unless the string already sets UID. |
| `password` | string | No | Password. For the ODBC drivers it is added to the connection string as PWD unless the string already sets PWD. |
| `timeout` | integer | No | Connect timeout (seconds). |
| `live` | boolean | No | Default true. |

**Returns**

- conn (connection object) on success — see the Connection:* methods in this module.
- nil, err on failure

**Errors**

Returns result, err.

Codes: `DRIVER_NOT_FOUND`, `AUTH_FAILED`, `CONNECT_FAILED`, `TIMEOUT`

**Example**

```lua
local Conn, Err = linkiir.store.open{ driver = linkiir.store.POSTGRES_ODBC, name = 'clinicdb',
                               user = 'svc', password = Secret }
if not Conn then error(Err.message) end
```


## `linkiir.store.tables`

*function*

```lua
linkiir.store.tables{ name=, schema= }
```

Create an empty database table node tree.

Creates an empty table tree to fill with rows (tbl[#tbl+1] = \{ id = 1, name = 'John' \}) and write with Connection:merge. With `schema`, each column is checked against the DB Schema as it's set.

**Usage**

```lua
local tbl = linkiir.store.tables{ name = 'patients' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Table name in the database; with schema, a table of the schema. |
| `schema` | string | No | DB Schema JSON file defining the table (e.g. db.json). |

**Returns**

- `node` — Root node of the database table tree.

**Example**

```lua
local Patients = {
   { id = 1, first_name = 'John', last_name = 'Smith' },
   { id = 2, first_name = 'Jane', last_name = 'Doe' },
}
local Tbl = linkiir.store.tables{ name = 'patients' }
for _, P in ipairs(Patients) do
   Tbl[#Tbl + 1] = P
end
Tbl[1].dob = '1980-04-12'   -- add a column to one row
local Merged, Err = Conn:merge{ data = Tbl, key = 'id' }
if not Merged then error(Err.message) end
```

```lua
-- patients is defined in the node's db.json DB Schema.
local Tbl = linkiir.store.tables{ schema = 'db.json', name = 'patients' }
Tbl[#Tbl + 1] = { id = 1, mrn = 'A1', active = 'true', dob = '1980-04-12' }   -- active is stored as 1
Tbl[1].dob = '1980-02-30'   -- raises: '1980-02-30' is not a date (YYYY-MM-DD)
-- Upserts on the schema's primary key; key = false would INSERT instead.
local Merged, Err = Conn:merge{ data = Tbl }
if not Merged then error(Err.message) end
```


## `linkiir.store.NULL`

*field*

```lua
linkiir.store.NULL
```

Column value that writes SQL NULL.

A column value that writes SQL NULL, since Lua nil can't be stored in a row table. A NULL column in a query result reads as "", and \:isNull() returns true.

**Usage**

```lua
tbl[#tbl+1] = { id = 1, middle_name = linkiir.store.NULL }
```

**Returns**

- `sentinel` — A unique table; compare with ==.


## `linkiir.store.SQLITE`

*field*

```lua
linkiir.store.SQLITE
```

Driver constant (1013).

SQLite, a file-based database whose `name` is the file path. Pass it as `driver` to linkiir.store.open.

**Usage**

```lua
local driver = linkiir.store.SQLITE
```

**Returns**

- `integer` — Constant value 1013.


## `linkiir.store.MYSQL`

*field*

```lua
linkiir.store.MYSQL
```

Driver constant (1001).

MySQL (native connector). Pass as the driver= argument to linkiir.store.open.

**Usage**

```lua
local driver = linkiir.store.MYSQL
```

**Returns**

- `integer` — Constant value 1001.


## `linkiir.store.MARIADB`

*field*

```lua
linkiir.store.MARIADB
```

Driver constant (1014).

MariaDB (native connector). Pass as the driver= argument to linkiir.store.open.

**Usage**

```lua
local driver = linkiir.store.MARIADB
```

**Returns**

- `integer` — Constant value 1014.


## `linkiir.store.ORACLE`

*field*

```lua
linkiir.store.ORACLE
```

Driver constant (1003).

Oracle Database (native OCI). Pass as the driver= argument to linkiir.store.open.

**Usage**

```lua
local driver = linkiir.store.ORACLE
```

**Returns**

- `integer` — Constant value 1003.


## `linkiir.store.POSTGRES_ODBC`

*field*

```lua
linkiir.store.POSTGRES_ODBC
```

Driver constant (1002).

PostgreSQL via ODBC, whose `name` is the connection string or DSN. Pass it as `driver` to linkiir.store.open.

**Usage**

```lua
local driver = linkiir.store.POSTGRES_ODBC
```

**Returns**

- `integer` — Constant value 1002.


## `linkiir.store.SQLSERVER_ODBC`

*field*

```lua
linkiir.store.SQLSERVER_ODBC
```

Driver constant (1006).

Microsoft SQL Server via ODBC. Pass as the driver= argument to linkiir.store.open.

**Usage**

```lua
local driver = linkiir.store.SQLSERVER_ODBC
```

**Returns**

- `integer` — Constant value 1006.


## `linkiir.store.ORACLE_ODBC`

*field*

```lua
linkiir.store.ORACLE_ODBC
```

Driver constant (1012).

Oracle Database via ODBC. Pass as the driver= argument to linkiir.store.open.

**Usage**

```lua
local driver = linkiir.store.ORACLE_ODBC
```

**Returns**

- `integer` — Constant value 1012.


## `linkiir.store.MYSQL_ODBC`

*field*

```lua
linkiir.store.MYSQL_ODBC
```

Driver constant (1015).

MySQL via ODBC (use for remote MySQL when native driver is unavailable). Pass as the driver= argument to linkiir.store.open.

**Usage**

```lua
local driver = linkiir.store.MYSQL_ODBC
```

**Returns**

- `integer` — Constant value 1015.


## Connection methods

### `Connection:query`

*method of `Connection`*

```lua
conn:query{ sql=, live= }
```

SELECT; rows navigable as a node tree.

Runs a SELECT and returns its rows as a node tree: result[1].colname:value(), and #result for the row count. Parameter binding isn't supported, so add values with conn:quote().

**Usage**

```lua
local rows, err = conn:query{ sql= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `sql` | string | Yes | SQL query text. Values must already be interpolated, using conn:quote() to escape them. |
| `live` | boolean | No | Default true; false simulates (test mode). |

**Returns**

- result node tree, err

**Example**

```lua
local Mrn = Conn:quote(Value)
local Rows, Err = Conn:query{ sql = 'select id, name from patient where mrn = ' .. Mrn }
if not Rows then error(Err.message) end
for i = 1, #Rows do
   print(Rows[i].id:value(), Rows[i].name:value())
end
```

:::caution[Build the complete statement in the script]
`sql` reaches the database exactly as written, including any `$1`-style markers, which arrive as literal text. Compose the whole statement in the script, and pass every value that came from a message, a variable, or user input through [`Connection:quote`](#connectionquote) as you build it.
:::


### `Connection:execute`

*method of `Connection`*

```lua
conn:execute{ sql=, live= }
```

INSERT/UPDATE/DELETE/DDL.

Runs an INSERT, UPDATE, DELETE or DDL statement. Parameter binding isn't supported, so add values with conn:quote().

**Usage**

```lua
local n, err = conn:execute{ sql= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `sql` | string | Yes | SQL statement text. Values must already be interpolated, using conn:quote() to escape them. |
| `live` | boolean | No | Default true; false simulates (test mode). |

**Returns**

- affected count, err

**Example**

```lua
local Mrn = Conn:quote(Value)
local Affected, Err = Conn:execute{ sql = 'update patient set active = 0 where mrn = ' .. Mrn }
if not Affected then error(Err.message) end
```

:::caution[Build the complete statement in the script]
As with `conn:query`, `sql` reaches the database exactly as written, and `$1`-style markers arrive as literal text. Compose the whole statement in the script, and pass every value that came from a message, a variable, or user input through [`Connection:quote`](#connectionquote) as you build it.
:::


### `Connection:merge`

*method of `Connection`*

```lua
conn:merge{ data=<tableTree>, key=, live= }
```

Insert or upsert the rows of a linkiir.store.tables tree.

Writes every row of a linkiir.store.tables tree in one transaction. Without `key` each row is inserted; with `key` each row is upserted on those columns.

**Usage**

```lua
local n, err = conn:merge{ data=<tableTree>, key='id' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | node | Yes | A linkiir.store.tables node tree. |
| `key` | string\|table\|false | No | Column name, or list of column names, to match existing rows on. Omit for plain inserts, or for a schema-built table to use the schema's primary key; false for plain inserts into a schema-built table. |
| `live` | boolean | No | Default true; false simulates. |

**Returns**

- number of rows written, or nil and err

**Example**

```lua
local Merged, Err = Conn:merge{ data = TableTree, key = 'id' }
if not Merged then error(Err.message) end
```


### `Connection:begin`

*method of `Connection`*

```lua
conn:begin{ live= }
```

Begin a transaction.

**Usage**

```lua
conn:begin()
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `live` | boolean | No | Default true; false simulates. |

**Returns**

- ok, err

**Example**

```lua
local Ok, Err = Conn:begin()
if not Ok then error(Err.message) end
```


### `Connection:commit`

*method of `Connection`*

```lua
conn:commit{ live= }
```

Commit.

**Usage**

```lua
conn:commit()
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `live` | boolean | No | Default true; false simulates. |

**Returns**

- ok, err

**Example**

```lua
Conn:commit()
```


### `Connection:rollback`

*method of `Connection`*

```lua
conn:rollback{ live= }
```

Roll back.

**Usage**

```lua
conn:rollback()
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `live` | boolean | No | Default true; false simulates. |

**Returns**

- ok, err

**Example**

```lua
Conn:rollback()
```


### `Connection:check`

*method of `Connection`*

```lua
conn:check()
```

Liveness probe.

**Usage**

```lua
if conn:check() then ... end
```

**Returns**

- boolean

**Example**

```lua
if not Conn:check() then
   Conn = linkiir.store.open{ driver = linkiir.store.POSTGRES_ODBC, name = 'clinicdb' }
end
```


### `Connection:quote`

*method of `Connection`*

```lua
conn:quote(s)
```

Quote a string as a SQL literal for the driver in use.

Quotes a string as a SQL literal for the driver in use, as N'...' on SQL Server. Use it on every value that came from a message, a variable or user input.

**Usage**

```lua
local q = conn:quote(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | String to escape. |

**Returns**

- string

**Example**

```lua
local Sql = 'select id from patient where mrn = ' .. Conn:quote(Mrn)
local Rows, Err = Conn:query{ sql = Sql }
```


### `Connection:close`

*method of `Connection`*

```lua
conn:close()
```

Release the connection.

**Usage**

```lua
conn:close()
```

**Returns**

- none

**Example**

```lua
Conn:close()
```

