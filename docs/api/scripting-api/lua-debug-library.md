---
title: Lua Debug Library
---

# Lua Debug Library

`debug`

Standard Lua 5.1 debug library: introspection and instrumentation for the call stack, locals, upvalues, and metatables. debug.traceback is the one function commonly useful in workflow scripts (paired with xpcall to capture where an error occurred); the rest are low-level tools for advanced debugging.

---

## `debug.traceback`

*function*

```lua
debug.traceback([thread,] [message [, level]])
```

Build a traceback string.

Returns a string with a traceback of the call stack, optionally prefixed with message. Commonly used as the message handler passed to xpcall to capture where an error occurred.

**Usage**

```lua
debug.traceback(message)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | No | Text to prefix the traceback with. |
| `level` | integer | No | Stack level to start the traceback at. Default 1 (the caller). |

**Returns**

- string

**Example**

```lua
local Ok, Err = xpcall(RiskyFn, debug.traceback)
if not Ok then print(Err) end
```


## `debug.getinfo`

*function*

```lua
debug.getinfo([thread,] function [, what])
```

Get information about a function or stack level.

Returns a table with information about a function, or about the function running at the given stack level. what selects which fields to fill in ("n" name, "S" source, "l" current line, "u" upvalues, "f" the function itself); default is all of them.

**Usage**

```lua
debug.getinfo(1, 'Sl')
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `function` | function\|integer | Yes | A function value, or a stack level (integer, 0 = current function). |
| `what` | string | No | Field selector string. Default all fields. |

**Returns**

- table of debug info, or nil if the level is out of range

**Example**

```lua
local Info = debug.getinfo(1, 'Sl')
print(Info.source, Info.currentline)
```


## `debug.getlocal`

*function*

```lua
debug.getlocal([thread,] level, index)
```

Read a local variable of a stack frame.

Returns the name and value of the local variable at index in the function at stack level level. Returns nil if there is no local at that index.

**Usage**

```lua
debug.getlocal(1, 1)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `level` | integer | Yes | Stack level (1 = the caller of debug.getlocal). |
| `index` | integer | Yes | 1-based local-variable index. |

**Returns**

- name, value, or nil if index is out of range

**Example**

```lua
local Name, Value = debug.getlocal(1, 1)
```


## `debug.setlocal`

*function*

```lua
debug.setlocal([thread,] level, index, value)
```

Write a local variable of a stack frame.

Sets the value of the local variable at index in the function at stack level level to value. Returns the variable's name, or nil if there is no local at that index.

**Usage**

```lua
debug.setlocal(1, 1, 42)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `level` | integer | Yes | Stack level. |
| `index` | integer | Yes | 1-based local-variable index. |
| `value` | any | Yes | New value. |

**Returns**

- name, or nil if index is out of range

**Example**

```lua
debug.setlocal(1, 1, 42)
```


## `debug.getupvalue`

*function*

```lua
debug.getupvalue(f, index)
```

Read an upvalue of a function.

Returns the name and value of the upvalue at index of function f. Returns nil if there is no upvalue at that index.

**Usage**

```lua
debug.getupvalue(f, 1)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `f` | function | Yes | Function to inspect. |
| `index` | integer | Yes | 1-based upvalue index. |

**Returns**

- name, value, or nil if index is out of range

**Example**

```lua
local Name, Value = debug.getupvalue(SomeFn, 1)
```


## `debug.setupvalue`

*function*

```lua
debug.setupvalue(f, index, value)
```

Write an upvalue of a function.

Sets the value of the upvalue at index of function f to value. Returns the upvalue's name, or nil if there is no upvalue at that index.

**Usage**

```lua
debug.setupvalue(f, 1, 42)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `f` | function | Yes | Function to modify. |
| `index` | integer | Yes | 1-based upvalue index. |
| `value` | any | Yes | New value. |

**Returns**

- name, or nil if index is out of range

**Example**

```lua
debug.setupvalue(SomeFn, 1, 42)
```


## `debug.getmetatable`

*function*

```lua
debug.getmetatable(object)
```

Read a value's metatable, bypassing __metatable.

Returns the metatable of object, or nil if it has none. Unlike getmetatable(), ignores the __metatable field, so it can inspect protected metatables.

**Usage**

```lua
debug.getmetatable(object)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | any | Yes | Value to inspect. |

**Returns**

- table, or nil

**Example**

```lua
local Meta = debug.getmetatable(SomeValue)
```


## `debug.setmetatable`

*function*

```lua
debug.setmetatable(object, table)
```

Set a value's metatable, bypassing __metatable.

Sets the metatable for object to table (which can be nil). Returns object. Unlike setmetatable(), ignores the __metatable field.

**Usage**

```lua
debug.setmetatable(object, meta)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | any | Yes | Value to modify. |
| `table` | table\|nil | Yes | New metatable, or nil to remove it. |

**Returns**

- object

**Example**

```lua
debug.setmetatable(SomeValue, SomeMeta)
```


## `debug.getfenv`

*function*

```lua
debug.getfenv(object)
```

Read a value's environment table.

Returns the environment table of object.

**Usage**

```lua
debug.getfenv(object)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | any | Yes | Value to inspect. |

**Returns**

- table

**Example**

```lua
local Env = debug.getfenv(SomeFn)
```


## `debug.setfenv`

*function*

```lua
debug.setfenv(object, table)
```

Set a value's environment table.

Sets the environment table of object to table. Returns object.

**Usage**

```lua
debug.setfenv(object, table)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `object` | any | Yes | Value to modify. |
| `table` | table | Yes | New environment table. |

**Returns**

- object

**Example**

```lua
debug.setfenv(SomeFn, {})
```


## `debug.gethook`

*function*

```lua
debug.gethook([thread])
```

Read the current debug hook.

Returns the current hook function, hook mask, and hook count set with debug.sethook, or nothing if there is no active hook.

**Usage**

```lua
debug.gethook()
```

**Returns**

- hook, mask, count

**Example**

```lua
local Hook, Mask, Count = debug.gethook()
```


## `debug.sethook`

*function*

```lua
debug.sethook([thread,] hook, mask [, count])
```

Install a debug hook.

Installs hook as a debug hook, called on the events selected by mask ("c" calls, "r" returns, "l" every line), and optionally every count instructions. Call with no arguments to remove the current hook.

**Usage**

```lua
debug.sethook(hook, 'l')
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `hook` | function | Yes | Hook function, called as hook(event, line). |
| `mask` | string | Yes | Combination of "c", "r", "l". |
| `count` | integer | No | Also call the hook every count instructions. |

**Returns**

- none

**Example**

```lua
debug.sethook(function(event, line) print(event, line) end, 'l')
-- ... 
debug.sethook()  -- remove the hook
```


## `debug.getregistry`

*function*

```lua
debug.getregistry()
```

Read the registry table.

Returns the registry table, a predefined table used by C code to store Lua values.

**Usage**

```lua
debug.getregistry()
```

**Returns**

- table

**Example**

```lua
local Registry = debug.getregistry()
```


## `debug.debug`

*function*

```lua
debug.debug()
```

Enter an interactive debug console.

Enters an interactive mode, reading and running Lua commands from stdin until the user types "cont". Not useful in Linkiir workflow scripts, which have no interactive stdin — documented for stdlib completeness only.

**Usage**

```lua
debug.debug()
```

**Returns**

- none

**Example**

```lua
-- Not useful outside an interactive Lua REPL.
-- debug.debug()
```

