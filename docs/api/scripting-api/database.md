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
linkiir.store.open{ driver=, name=, user=, password=, … }
```

Open a database connection. Driver constants: linkiir.store.MYSQL, POSTGRES, SQLSERVER, ORACLE, SQLITE, DB2, SYBASE, ODBC.

**Usage**

```lua
local conn, err = linkiir.store.open{ driver=, name=, user=, password=, timeout=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `driver` | constant | Yes | One of the linkiir.store.* driver constants. |
| `name` | string | Yes | DSN / host / database / file, per driver. |
| `user` | string | No | Username. |
| `password` | string | No | Password. |
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
local Conn, Err = linkiir.store.open{ driver = linkiir.store.POSTGRES, name = 'clinicdb',
                               user = 'svc', password = Secret }
if not Conn then error(Err.message) end
```


## Connection methods

### `Connection:query`

*method of `Connection`*

```lua
conn:query{ sql=, params=, live= }
```

SELECT; rows navigable as a node tree.

**Usage**

```lua
local rows, err = conn:query{ sql=, params= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `sql` | string | Yes | SQL query text; use $1, $2, … placeholders for params. |
| `params` | table | No | Positional bind values for the query placeholders. |
| `live` | boolean | No | Default true; false simulates (test mode). |

**Returns**

- result node tree, err

**Example**

```lua
local Rows, Err = Conn:query{ sql = 'select id, name from patient where mrn = $1',
                             params = { Mrn } }
if not Rows then error(Err.message) end
for i = 1, #Rows do
   print(Rows[i].id:value(), Rows[i].name:value())
end
```


### `Connection:execute`

*method of `Connection`*

```lua
conn:execute{ sql=, params=, live= }
```

INSERT/UPDATE/DELETE/DDL.

**Usage**

```lua
local n, err = conn:execute{ sql=, params= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `sql` | string | Yes | SQL statement text; use $1, $2, … placeholders for params. |
| `params` | table | No | Positional bind values for the statement placeholders. |
| `live` | boolean | No | Default true; false simulates (test mode). |

**Returns**

- affected count, err

**Example**

```lua
local Affected, Err = Conn:execute{ sql = 'update patient set active = false where mrn = $1',
                                    params = { Mrn } }
if not Affected then error(Err.message) end
```


### `Connection:merge`

*method of `Connection`*

```lua
conn:merge{ data=<tableTree>, live= }
```

Upsert a table tree from linkiir.data.tables.

**Usage**

```lua
local n, err = conn:merge{ data=<tableTree> }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | node | Yes | A linkiir.data.tables node tree to upsert. |
| `live` | boolean | No | Default true; false simulates. |

**Returns**

- rows merged, err

**Example**

```lua
local Merged, Err = Conn:merge{ data = TableTree }
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
   Conn = linkiir.store.open{ driver = linkiir.store.POSTGRES, name = 'clinicdb' }
end
```


### `Connection:quote`

*method of `Connection`*

```lua
conn:quote(s)
```

Escaping fallback; prefer params.

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
local Escaped = Conn:quote(UserInput)  -- prefer params= over this when possible
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

