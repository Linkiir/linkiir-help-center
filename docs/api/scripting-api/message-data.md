---
title: Message Data
---

# Message Data

`linkiir.data`

Parse (extract), build (create), and serialize messages of any supported format (HL7, X12, XML), plus the node-tree interface returned by those calls. XML supports schema-free parsing (schema optional).

---

## `linkiir.data.extract`

*function*

```lua
linkiir.data.extract{ schema=, data=, type= }
```

Parse a wire message into a node tree.

Parse a raw wire message into a Linkiir node tree, identify the matched message definition from the grammar, and return both. The tree is read/write.

**Usage**

```lua
linkiir.data.extract{ schema = <string>, data = <string> [, type = <string>] }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `schema` | string | Yes | Linkiir grammar JSON file (e.g. demo.json). |
| `data` | string | Yes | Raw message text (HL7 v2, X12, XML, or JSON). |
| `type` | string | No | Protocol override: "hl7", "x12", "xml", "json". Defaults to the grammar's protocol. |

**Returns**

- `node` — root of the parsed tree (Linkiir node) — see the Node:* methods in this module.
- `messageType` — grammar message-definition name (e.g. "ADT", "837").

**Errors**

Raises a Lua error on failure (trap with pcall).

Codes: `MISSING_PARAMETER`, `SCHEMA_NOT_FOUND`, `PARSE_ERROR`, `UNSUPPORTED_TYPE`

**Example**

```lua
local Msg, MsgType = linkiir.data.extract{ schema = 'demo.json', data = Data, type = 'hl7' }
print(MsgType)                               -- "ADT"
print(Msg.MSH[9][1]:value(), Msg.PID[3][1][1]:value())

-- Trap failures explicitly.
local ok, msg, mtype = pcall(linkiir.data.extract, { schema = 'demo.json', data = Data })
if not ok then error('extract failed: ' .. tostring(msg)) end
```


## `linkiir.data.create`

*function*

```lua
linkiir.data.create{ schema=, name=, type= }
```

Build an empty message tree for a definition.

Create an empty message tree for a named grammar definition, with all schema segments/groups/fields pre-allocated so they can be populated by assignment or :map.

**Usage**

```lua
linkiir.data.create{ schema = <string>, name = <string> [, type = <string>] }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `schema` | string | Yes | Linkiir grammar JSON file. |
| `name` | string | Yes | Grammar message-definition name (usually the 2nd return of linkiir.data.extract). |
| `type` | string | No | Protocol override; defaults to the grammar's protocol. |

**Returns**

- `node` — root of the empty message tree — see the Node:* methods in this module.

**Errors**

Raises a Lua error on failure.

Codes: `MISSING_PARAMETER`, `SCHEMA_NOT_FOUND`, `MESSAGE_DEFINITION_NOT_FOUND`, `UNSUPPORTED_TYPE`

**Example**

```lua
local Msg, MsgType = linkiir.data.extract{ schema = 'demo.json', data = Data, type = 'hl7' }
local Out = linkiir.data.create{ schema = 'demo.json', name = MsgType, type = 'hl7' }
Out:map(Msg)
Out.PID[5][1][1][1] = Msg.PID[5][1][1][1]:value()
```


## `linkiir.data.serialize`

*function*

```lua
linkiir.data.serialize{ data=node }
```

Serialize a node tree back to wire text.

Serialize a node tree back to its wire representation (HL7 pipe-delimited text, X12 segment stream, etc.). Equivalent to node:text() / node:S().

**Usage**

```lua
linkiir.data.serialize{ data = <node> }   -- or linkiir.data.serialize(<node>)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | node | Yes | The node to serialize (root or subtree). |

**Returns**

- `string` — the serialized wire text.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`

**Example**

```lua
local wire  = linkiir.data.serialize{ data = Out }
local wire2 = Out:text()   -- identical result
```


## Node methods

### `Node:value`

*method of `Node`*

```lua
Node:value()
```

Scalar value of the node.

**Usage**

```lua
local v = N:value()
```

**Returns**

- string

**Example**

```lua
local N = Msg.PID[3][1][1]
local V = N:value()
print(V)
```


### `Node:set`

*method of `Node`*

```lua
Node:set(v)
```

Set the scalar value (chainable).

**Usage**

```lua
N:set('12345')
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `v` | string | Yes | New scalar value. |

**Returns**

- Node (self)

**Example**

```lua
N:set('12345')       -- write a new scalar value
print(N:value())    -- "12345"
```


### `Node:name`

*method of `Node`*

```lua
Node:name()
```

Node/segment name.

**Usage**

```lua
local n = N:name()
```

**Returns**

- string

**Example**

```lua
print(N:name())  -- e.g. "PID"
```


### `Node:text`

*method of `Node`*

```lua
Node:text()
```

Serialize the subtree to wire text.

**Usage**

```lua
local wire = N:text()
```

**Returns**

- string

**Example**

```lua
local Wire = N:text()  -- serialize this subtree back to wire format
```


### `Node:map`

*method of `Node`*

```lua
Node:map(src)
```

Copy matching values from src.

**Usage**

```lua
N:map(src)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `src` | node | Yes | Source node to copy matching values from. |

**Returns**

- Node (self)

**Example**

```lua
local Out = linkiir.data.create{ schema = 'demo.json', name = MsgType }
Out:map(Msg)  -- copy matching values from Msg into Out
```


### `Node:child`

*method of `Node`*

```lua
Node:child(k)
```

Child by name or 1-based index (= Node[k]).

**Usage**

```lua
local child = N:child(k)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `k` | string\|integer | Yes | Child name or 1-based index. |

**Returns**

- Node / nil

**Example**

```lua
local Field = Msg.PID:child(3)  -- same as Msg.PID[3]
```


### `Node:count`

*method of `Node`*

```lua
Node:count()
```

Number of children (= #Node).

**Usage**

```lua
local n = N:count()
```

**Returns**

- integer

**Example**

```lua
print(#Msg.PID)  -- same as Msg.PID:count()
```


### `Node:isNull`

*method of `Node`*

```lua
Node:isNull()
```

True when the node has no data.

**Usage**

```lua
if N:isNull() then ... end
```

**Returns**

- boolean

**Example**

```lua
if Msg.PID[5]:isNull() then
   print('no patient name present')
end
```


### `Node:isLeaf`

*method of `Node`*

```lua
Node:isLeaf()
```

True when the node holds a scalar.

**Usage**

```lua
if N:isLeaf() then ... end
```

**Returns**

- boolean

**Example**

```lua
print(N:isLeaf())  -- true when N holds a scalar value
```


### `Node:type`

*method of `Node`*

```lua
Node:type()
```

Node type code (1..6, 10..13, 99).

**Usage**

```lua
local t = N:type()
```

**Returns**

- integer

**Example**

```lua
print(N:type())  -- node type code
```


### `Node:protocol`

*method of `Node`*

```lua
Node:protocol()
```

Protocol code (101 HL7 … 105 XML).

**Usage**

```lua
local p = N:protocol()
```

**Returns**

- integer

**Example**

```lua
print(Msg:protocol())  -- 101 (HL7), 102 (X12), 105 (XML), ...
```


---

## See also

- [Code Sets](code-sets.md) — look up and cross-map the code tables embedded in your schema.

