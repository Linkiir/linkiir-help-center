---
title: JSON
---

# JSON

`linkiir.json`

JSON parse and serialize operating on plain Lua tables. Unlike linkiir.data (which returns LkNode userdata), linkiir.json works with native Lua values.

---

## `linkiir.json.parse`

*function*

```lua
linkiir.json.parse(str)
```

Parse a JSON string into a Lua value.

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

Serialize a Lua value to a JSON string.

Serialize a Lua value to a JSON string. Tables with consecutive integer keys emit as arrays; otherwise as objects. nil and json.null become null. Raises on circular references, NaN/Infinity, or non-serializable types (functions, userdata).

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

