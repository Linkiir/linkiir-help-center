---
title: Runtime & System
---

# Runtime & System

`linkiir.sys`

Small runtime helpers and filesystem access in one place. Time/env helpers (os.date, os.time, os.getenv) stay as native Lua.

---

## `linkiir.sys.guid`

*function*

```lua
linkiir.sys.guid()
```

Generate a random UUID.

Generate a random UUID v4.

**Usage**

```lua
local id = linkiir.sys.guid()
```

**Returns**

- GUID string.

**Errors**

Raises a Lua error on failure.

Codes: `RUNTIME_ERROR`

**Example**

```lua
local Id = linkiir.sys.guid()
```


## `linkiir.sys.sleep`

*function*

```lua
linkiir.sys.sleep(ms)
```

Pause the current run.

Pause the current run for the given number of milliseconds.

**Usage**

```lua
linkiir.sys.sleep(ms)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `ms` | integer | Yes | Milliseconds to sleep. |

**Returns**

- none

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`

**Example**

```lua
linkiir.sys.sleep(250)
```


## `linkiir.sys.fs.stat`

*function*

```lua
linkiir.sys.fs.stat(path)
```

Filesystem: stat.

Return metadata (size, mtime, type, mode) for a file or directory.

**Usage**

```lua
linkiir.sys.fs.stat(path)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Filesystem path. |

**Returns**

- `{ size=, mtime=, type=, mode= }, err`

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
for _, p in ipairs(linkiir.sys.fs.list{ path = '/inbound', pattern = '*.hl7' }) do
   local st = linkiir.sys.fs.stat(p)
   print(p, st.size)
end
```


## `linkiir.sys.fs.list`

*function*

```lua
linkiir.sys.fs.list{ path=, pattern='*.hl7' }
```

Filesystem: list.

List files in a directory matching a glob pattern.

**Usage**

```lua
linkiir.sys.fs.list{ path=, pattern='*.hl7' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Directory to list. |
| `pattern` | string | No | Glob pattern, default '*.hl7'. |

**Returns**

- array, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
for _, p in ipairs(linkiir.sys.fs.list{ path = '/inbound', pattern = '*.hl7' }) do
   local st = linkiir.sys.fs.stat(p)
   print(p, st.size)
end
```


## `linkiir.sys.fs.mkdir`

*function*

```lua
linkiir.sys.fs.mkdir(path)
```

Filesystem: mkdir.

Create a directory.

**Usage**

```lua
linkiir.sys.fs.mkdir(path)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Directory path to create. |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.mkdir('/inbound/archive')
if not Ok then error(Err.message) end
```


## `linkiir.sys.fs.rmdir`

*function*

```lua
linkiir.sys.fs.rmdir(path)
```

Filesystem: rmdir.

Remove an empty directory.

**Usage**

```lua
linkiir.sys.fs.rmdir(path)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Directory path to remove (must be empty). |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.rmdir('/inbound/archive')
if not Ok then error(Err.message) end
```


## `linkiir.sys.fs.remove`

*function*

```lua
linkiir.sys.fs.remove(path)
```

Filesystem: remove.

Delete a file.

**Usage**

```lua
linkiir.sys.fs.remove(path)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | File path to delete. |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.remove('/inbound/old.hl7')
if not Ok then error(Err.message) end
```


## `linkiir.sys.fs.access`

*function*

```lua
linkiir.sys.fs.access{ path=, mode='r' }
```

Filesystem: access.

Test whether a file is accessible with the given mode ('r', 'w', 'x').

**Usage**

```lua
linkiir.sys.fs.access{ path=, mode='r' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Filesystem path to test. |
| `mode` | string | No | Access mode to test: 'r', 'w', or 'x'. Default 'r'. |

**Returns**

- boolean

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Readable = linkiir.sys.fs.access{ path = '/inbound/demo.hl7', mode = 'r' }
```


## `linkiir.sys.fs.chmod`

*function*

```lua
linkiir.sys.fs.chmod{ path=, mode=0755 }
```

Filesystem: chmod.

Change a file's permission bits.

**Usage**

```lua
linkiir.sys.fs.chmod{ path=, mode=0755 }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Filesystem path. |
| `mode` | integer | No | Permission bits (octal), default 0755. |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.chmod{ path = '/inbound/demo.hl7', mode = 0755 }
if not Ok then error(Err.message) end
```


## `linkiir.sys.fs.chown`

*function*

```lua
linkiir.sys.fs.chown{ path=, owner=, group= }
```

Filesystem: chown.

Change a file's owner and group.

**Usage**

```lua
linkiir.sys.fs.chown{ path=, owner=, group= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Filesystem path. |
| `owner` | string | Yes | New owner. |
| `group` | string | Yes | New group. |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.chown{ path = '/inbound/demo.hl7', owner = 'linkiir', group = 'linkiir' }
if not Ok then error(Err.message) end
```


## `linkiir.sys.fs.touch`

*function*

```lua
linkiir.sys.fs.touch{ path=, time= }
```

Filesystem: touch.

Create a file if missing, or update its modification time.

**Usage**

```lua
linkiir.sys.fs.touch{ path=, time= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Filesystem path. |
| `time` | integer | No | Modification time (unix epoch); defaults to now. |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.touch{ path = '/inbound/.keep' }
if not Ok then error(Err.message) end
```

