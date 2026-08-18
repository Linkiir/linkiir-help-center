---
title: JSON
---

# JSON

`linkiir.json`

JSON parse and serialize operating on plain Lua tables. Unlike linkiir.data, which returns the node-tree interface, linkiir.json works with native Lua values. json.array() and json.object() tag a table so its JSON shape is explicit rather than inferred.

---

## `linkiir.json.parse`

*function*

```lua
linkiir.json.parse(str)
```

Parse a JSON string into a Lua value. Objects become tables with string keys; arrays become tables with integer keys 1..N. JSON null becomes linkiir.json.null. Raises on invalid JSON.

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

Serialize a Lua value to a JSON string. Tables with consecutive integer keys emit as arrays; otherwise as objects, unless the table was tagged with linkiir.json.array() or linkiir.json.object(). nil and json.null become null. Raises on circular references, NaN/Infinity, or non-serializable types (functions, userdata).

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

Mark a Lua table as a JSON array. Called with no argument (or nil) it creates and tags a new empty table; called with a table it tags that table in place and returns it. The tag overrides the usual shape heuristic, so a tagged table emits as [ ... ] even when empty or when it holds string keys (array serialization walks integer keys 1..N and ignores the rest). Tables returned by linkiir.json.parse are already tagged, so an empty array survives a parse/serialize round-trip.

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

Mark a Lua table as a JSON object. Called with no argument (or nil) it creates and tags a new empty table; called with a table it tags that table in place and returns it. The tag overrides the usual shape heuristic: an untagged empty table serializes as [], while a tagged one serializes as \{\}. A tagged table holding a sequence emits its integer keys as the object keys "1", "2", ... Tables returned by linkiir.json.parse are already tagged.

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

A unique sentinel table that represents JSON null. Distinguishes 'key is null' (obj.x == json.null) from 'key is absent' (obj.x == nil). Serializes as null.

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

