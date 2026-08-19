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


## `linkiir.data.codeset.get`

*function*

```lua
linkiir.data.codeset.get{ schema=, table= }
```

Load a code set from a schema.

Retrieve a code set (Table object) from the given schema by its id. Returns nil when the code set id is not present in the schema — callers can branch without pcall. The schema path resolves relative to the current node directory, the same as linkiir.data.extract.

**Usage**

```lua
linkiir.data.codeset.get{ schema = <string>, table = <string> }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `schema` | string | Yes | Linkiir grammar JSON file containing the code set (e.g. demo.json). |
| `table` | string | Yes | Code set id to look up (e.g. "0001"). |

**Returns**

- `Table` — Table userdata for the code set, or nil if the id is absent from the schema.

**Errors**

Raises a Lua error on failure (trap with pcall).

Codes: `MISSING_PARAMETER`, `SCHEMA_NOT_FOUND`

**Example**

```lua
local codeset = linkiir.data.codeset
local Sex = codeset.get{ schema = 'demo.json', table = '0001' }
if Sex then
  print('Loaded code set 0001 with ' .. #Sex:codes() .. ' codes')
else
  print('Code set 0001 not found in schema')
end

-- Raises on missing parameter or unloadable schema.
local ok, err = pcall(codeset.get, { schema = 'missing.json', table = '0001' })
if not ok then print(err) end
```


## `linkiir.data.codeset.match`

*function*

```lua
linkiir.data.codeset.match(sourceTable, destTable)
```

Map source code values to destination code values by description.

Build a plain Lua table that maps each source code value to the destination code value whose description matches (case-insensitive, whitespace-collapsed). Source codes with no matching description in the destination are omitted — use an 'or default' fallback at the call site to handle gaps. Cross-format mapping is intentionally the developer's job; match provides description-based joining to automate the common case, while developers handle the remaining gaps via fallback values or manual overrides.

**Usage**

```lua
linkiir.data.codeset.match(<Table>, <Table>)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `sourceTable` | Table | Yes | Source code set (Table userdata returned by table.get). |
| `destTable` | Table | Yes | Destination code set (Table userdata returned by table.get). |

**Returns**

- `map` — Plain Lua table keyed by source code values, values are destination code values. Assignable, printable, pairs-able.

**Errors**

Raises a Lua error if either argument is not a Table userdata.

Codes: `TABLE_NOT_FOUND`

**Example**

```lua
local codeset = linkiir.data.codeset
local SourceSex = codeset.get{ schema = 'sourcedemo.json', table = '0001' }
local DestSex   = codeset.get{ schema = 'destdemo.json',   table = '0001' }
local Sex = codeset.match(SourceSex, DestSex)
-- Sex = { F='F', M='M', O='O', U='U' }  (A and N omitted if descriptions differ)

Out.PID[8] = Sex[Msg.PID[8]:value()] or 'U'   -- fallback for unmapped codes
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


## Table methods

### `Table:codes`

*method of `Table`*

```lua
Table:codes()
```

All code values in stored order.

Return an array of all code value strings in the code set, preserving the order defined in the schema (spec order or drag-reordered).

**Usage**

```lua
local codes = T:codes()
```

**Returns**

- `codes` — Array of code value strings.

**Example**

```lua
local codeset = linkiir.data.codeset
local Sex = codeset.get{ schema = 'demo.json', table = '0001' }
for i, code in ipairs(Sex:codes()) do
  print(i, code)   -- 1 F, 2 M, 3 O, ...
end
```


### `Table:pairs`

*method of `Table`*

```lua
Table:pairs()
```

Iterate code/description pairs.

Return an iterator that yields (code, description) pairs in stored order. Suitable for use in a generic for loop.

**Usage**

```lua
for code, desc in T:pairs() do ... end
```

**Returns**

- `iterator` — Iterator yielding (code, desc) string pairs.

**Example**

```lua
local codeset = linkiir.data.codeset
local Sex = codeset.get{ schema = 'demo.json', table = '0001' }
for code, desc in Sex:pairs() do
  print(code .. ' = ' .. desc)   -- F = Female, M = Male, ...
end
```


### `Table:desc`

*method of `Table`*

```lua
Table:desc(code)
```

Look up the description for a code value.

Return the description string for the given code value, or nil if the code is not present in this code set. Builds an internal index on first call for efficient repeated lookups.

**Usage**

```lua
local description = T:desc(<string>)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | string | Yes | Code value to look up (e.g. "F"). |

**Returns**

- `desc` — Description string (e.g. "Female"), or nil if the code is not in the code set.

**Example**

```lua
local codeset = linkiir.data.codeset
local Sex = codeset.get{ schema = 'demo.json', table = '0001' }
print(Sex:desc('F'))    -- "Female"
print(Sex:desc('X'))    -- nil (not in code set)
```

