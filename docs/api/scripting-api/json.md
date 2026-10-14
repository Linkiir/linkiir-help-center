---
title: JSON
---

# JSON

`linkiir.json`

Parses and serializes JSON as plain Lua values rather than node trees. json.array() and json.object() fix a table's JSON shape.

---

## `linkiir.json.parse`

*function*

```lua
linkiir.json.parse(str)
```

Parse a JSON string into a Lua value.

Parses a JSON string into Lua tables, with JSON null as linkiir.json.null. Raises on invalid JSON.

**Usage**

```lua
local value = linkiir.json.parse(str)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `str` | string | Yes | A valid JSON string. |

**Returns**

- Lua value: table (object/array), string, number, boolean, or json.null.

**Errors**

Raises a Lua error on failure.

Codes: `PARSE_ERROR`

**Example**

```lua
local obj = linkiir.json.parse('{"name":"Alice","age":30}')
print(obj.name)  -- "Alice"
print(obj.age)   -- 30
```


## `linkiir.json.serialize`

*function*

```lua
linkiir.json.serialize(value)
```

Serialize a Lua value to a JSON string.

Serializes a Lua value to JSON, writing tables with keys 1..N as arrays unless tagged with json.array() or json.object(). Raises on circular references, NaN, Infinity, functions and userdata.

**Usage**

```lua
local str = linkiir.json.serialize(value)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | any | Yes | Lua value to serialize (table, string, number, boolean, nil, json.null). |

**Returns**

- A valid JSON string.

**Errors**

Raises a Lua error on failure.

Codes: `CIRCULAR_REFERENCE`, `INVALID_VALUE`

**Example**

```lua
local s = linkiir.json.serialize({name = "Alice", age = 30})
print(s)  -- {"name":"Alice","age":30}
```


## `linkiir.json.array`

*function*

```lua
linkiir.json.array([t])
```

Tag a table so it always serializes as a JSON array.

Tags a table, or a new empty one, so it always serializes as a JSON array, even when empty. Tables from linkiir.json.parse are already tagged.

**Usage**

```lua
local arr = linkiir.json.array()   -- or linkiir.json.array(t)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | No | Existing table to tag. Omit or pass nil to create a new empty table. |

**Returns**

- The tagged table (the same table when one was passed in).

**Errors**

Raises a Lua error if the argument is present and not a table.

Codes: `INVALID_PARAMETER`

**Example**

```lua
local obj = linkiir.json.object()
obj.items = linkiir.json.array()
print(linkiir.json.serialize(obj))  -- {"items":[]}
```


## `linkiir.json.object`

*function*

```lua
linkiir.json.object([t])
```

Tag a table so it always serializes as a JSON object.

Tags a table, or a new empty one, so it always serializes as a JSON object, even when empty. Tables from linkiir.json.parse are already tagged.

**Usage**

```lua
local obj = linkiir.json.object()   -- or linkiir.json.object(t)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | No | Existing table to tag. Omit or pass nil to create a new empty table. |

**Returns**

- The tagged table (the same table when one was passed in).

**Errors**

Raises a Lua error if the argument is present and not a table.

Codes: `INVALID_PARAMETER`

**Example**

```lua
print(linkiir.json.serialize({}))                        -- []
print(linkiir.json.serialize(linkiir.json.object()))     -- {}

local meta = linkiir.json.object{ source = 'lab' }
print(linkiir.json.serialize(meta))  -- {"source":"lab"}
```


## `linkiir.json.null`

*function*

```lua
linkiir.json.null
```

Sentinel representing JSON null.

A sentinel for JSON null that tells a null value (obj.x == json.null) from a missing one (obj.x == nil). Serializes as null.

**Usage**

```lua
if obj.x == linkiir.json.null then print('null') end
```

**Returns**

- The sentinel table (identity-checked via ==).

**Example**

```lua
local obj = linkiir.json.parse('{"x": null}')
assert(obj.x == linkiir.json.null)  -- present but null
assert(obj.y == nil)                -- truly absent
```

