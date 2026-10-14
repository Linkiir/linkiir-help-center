---
title: Lua OS Library (time/env)
---

# Lua OS Library (time/env)

`os`

Lua 5.1's time, environment, file and process functions. Prefer linkiir.sys.fs and linkiir.link.file over the file and process functions, which bypass logging and can end the worker process.

---

## `os.time`

*function*

```lua
os.time([table])
```

Current time / convert a date table to a timestamp.

With no arguments, returns the current time as a Unix timestamp (seconds since epoch). With a date table (\{year=, month=, day=, hour=, min=, sec=\}), returns the corresponding timestamp.

**Usage**

```lua
os.time()
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `table` | table | No | Date table with year/month/day/hour/min/sec fields. |

**Returns**

- integer (Unix timestamp)

**Example**

```lua
print(os.time())
print(os.time({ year = 2026, month = 1, day = 1 }))
```


## `os.date`

*function*

```lua
os.date([format [, time]])
```

Format a date/time.

Returns a string (or a table, if format starts with "*t") describing the date/time given by time (default now), formatted per strftime-style format (default "%c").

**Usage**

```lua
os.date(format, time)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | string | No | strftime-style format, or "*t"/"!*t" for a date table. Default "%c". |
| `time` | integer | No | Unix timestamp. Default now. |

**Returns**

- string, or table when format is "*t"/"!*t"

**Example**

```lua
print(os.date('%Y-%m-%d %H:%M:%S'))
local T = os.date('*t')
print(T.year, T.month, T.day)
```


## `os.clock`

*function*

```lua
os.clock()
```

CPU time used by the process.

Returns an approximation of the amount of CPU time used by the program, in seconds. Useful for benchmarking script execution.

**Usage**

```lua
os.clock()
```

**Returns**

- number

**Example**

```lua
local Start = os.clock()
-- ... work ...
print('elapsed', os.clock() - Start)
```


## `os.difftime`

*function*

```lua
os.difftime(t2, t1)
```

Difference between two timestamps.

Returns the number of seconds from time t1 to time t2 (both Unix timestamps, as returned by os.time).

**Usage**

```lua
os.difftime(t2, t1)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t2` | integer | Yes | Later timestamp. |
| `t1` | integer | Yes | Earlier timestamp. |

**Returns**

- number (seconds)

**Example**

```lua
local Elapsed = os.difftime(os.time(), StartedAt)
```


## `os.getenv`

*function*

```lua
os.getenv(varname)
```

Read an environment variable.

Returns the value of the process environment variable varname, or nil if it is not set.

**Usage**

```lua
os.getenv(varname)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `varname` | string | Yes | Environment variable name. |

**Returns**

- string, or nil

**Example**

```lua
local ApiKey = os.getenv('LINKIIR_API_KEY')
```


## `os.execute`

*function*

```lua
os.execute([command])
```

Run a shell command.

Runs a command in the system shell and returns its exit status. Discouraged in workflow scripts; use linkiir.sys.fs or linkiir.link.file instead.

**Usage**

```lua
os.execute(command)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `command` | string | No | Shell command line to run. |

**Returns**

- integer exit status (or boolean shell-availability when called with no arguments)

**Example**

```lua
local Status = os.execute('true')
print(Status)  -- 0
```


## `os.remove`

*function*

```lua
os.remove(filename)
```

Delete a file.

Deletes a file, returning true or nil and an error message. A relative path resolves against linkiir.sys.workingDir(), and a path escaping it with .. raises an error.

**Usage**

```lua
os.remove(filename)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `filename` | string | Yes | Path of the file to delete. |

**Returns**

- true on success; nil, errorMessage on failure

**Example**

```lua
local Ok, Err = os.remove('/tmp/scratch.txt')
if not Ok then print(Err) end
```


## `os.rename`

*function*

```lua
os.rename(oldname, newname)
```

Rename/move a file.

Renames or moves a file, returning true or nil and an error message. A relative path resolves against linkiir.sys.workingDir(), and a path escaping it with .. raises an error.

**Usage**

```lua
os.rename(oldname, newname)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `oldname` | string | Yes | Existing path. |
| `newname` | string | Yes | New path. |

**Returns**

- true on success; nil, errorMessage on failure

**Example**

```lua
local Ok, Err = os.rename('/tmp/a.txt', '/tmp/b.txt')
if not Ok then print(Err) end
```


## `os.tmpname`

*function*

```lua
os.tmpname()
```

Generate a temporary file name.

Returns a string with a name that can safely be used as a temporary file. The file must be explicitly opened (e.g. io.open) and removed (os.remove) when done.

**Usage**

```lua
os.tmpname()
```

**Returns**

- string (a filesystem path)

**Example**

```lua
local Path = os.tmpname()
local F = io.open(Path, 'w')
F:write('scratch')
F:close()
os.remove(Path)
```


## `os.exit`

*function*

```lua
os.exit([code [, close]])
```

Terminate the process.

Terminates the host process immediately, with an optional exit code (default success/true) and an optional flag to close the Lua state first. Never call this in a workflow script — it kills the worker process running the script, not just the current script invocation.

**Usage**

```lua
os.exit(code)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | boolean\|integer | No | Exit status. Default true (success). |
| `close` | boolean | No | Whether to close the Lua state before exiting. Default false. |

**Returns**

- does not return

**Example**

```lua
-- Avoid in Linkiir scripts; shown for reference only.
-- os.exit(0)
```

