---
title: Lua OS Library (time/env)
---

# Lua OS Library (time/env)

`os`

Time and environment functions from the standard Lua 5.1 os library. File and process functions (os.execute, os.remove, os.rename, os.tmpname, os.exit) are intentionally not used in Linkiir scripts — use linkiir.sys.fs for local filesystem work and linkiir.link.file for remote transfer instead.

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

