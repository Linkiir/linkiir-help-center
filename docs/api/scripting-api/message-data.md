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


## `linkiir.data.ELEMENT`

*field*

```lua
linkiir.data.ELEMENT
```

Node-kind constant selecting an element for Node:append.

A read-only sentinel passed as the `kind` argument to Node:append to append an Element_Node. One of the three mutually distinct node-kind constants (ELEMENT, ATTRIBUTE, TEXT); the element case applies every rule of Node:add.

**Usage**

```lua
N:append(linkiir.data.ELEMENT, 'Item')
```

**Returns**

- node-kind constant (opaque, read-only)

**Example**

```lua
local Item = Order:append(linkiir.data.ELEMENT, 'Item')
```


## `linkiir.data.ATTRIBUTE`

*field*

```lua
linkiir.data.ATTRIBUTE
```

Node-kind constant selecting an attribute for Node:append.

A read-only sentinel passed as the `kind` argument to Node:append to append an Attribute_Node. Creates an empty-valued attribute named by the `name` argument when absent, or leaves an existing attribute (and the child count) unchanged.

**Usage**

```lua
N:append(linkiir.data.ATTRIBUTE, 'id')
```

**Returns**

- node-kind constant (opaque, read-only)

**Example**

```lua
Item:append(linkiir.data.ATTRIBUTE, 'sku')
```


## `linkiir.data.TEXT`

*field*

```lua
linkiir.data.TEXT
```

Node-kind constant selecting a text node for Node:append.

A read-only sentinel passed as the `kind` argument to Node:append to append a #text child carrying the `name` argument as its value.

**Usage**

```lua
N:append(linkiir.data.TEXT, 'Widget')
```

**Returns**

- node-kind constant (opaque, read-only)

**Example**

```lua
Item:append(linkiir.data.TEXT, 'Widget')
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


### `Node:add`

*method of `Node`*

```lua
Node:add(name)
```

Add a child element (XML). Returns the new element.

XML only. Appends a new empty Element_Node named `name` and returns it. The second call with the same name promotes the pair into a repeat group by moving the existing child, so any handle held on it stays valid. If the receiver held Text_Content, that text is first moved into a leading `#text` child so the new element follows it in document order; attributes are left in place. Raises on an absent, nil, non-string, empty or over-long (over 1024 chars) name, on a reserved name (one beginning with `@` or equal to `#text`), and on a receiver that is not an Element_Node.

**Usage**

```lua
local Item = Order:add('Item')
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Element name (1-1024 chars; must not start with '@' or equal '#text'). |

**Returns**

- `node` — the new child Element_Node.

**Example**

```lua
local Order = linkiir.data.create{ name = 'Order', type = 'xml' }
local Item = Order:add('Item')
Item:attr('sku', 'A-100')
Item:set('Widget')
print(linkiir.data.serialize{ data = Order })
-- <Order><Item sku="A-100">Widget</Item></Order>
```


### `Node:attr`

*method of `Node`*

```lua
Node:attr(name [, value])
```

Read or write an attribute (XML).

XML only. With one argument, reads attribute `name` (without the `@` prefix) and returns its value as a string, or nil when the attribute is absent. With two arguments, sets the attribute to `value` (created if absent, overwritten if present) and returns the receiver so calls chain; the element's child count changes only when a new attribute is created. Attributes never affect isLeaf(). Raises on an absent, nil, non-string, empty or invalid attribute name, and on a receiver that is not an Element_Node.

**Usage**

```lua
N:attr('id', '9')   -- write
local v = N:attr('id')  -- read
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Attribute name, without the '@' prefix. |
| `value` | string | No | New attribute value. Omit to read. |

**Returns**

- string or nil on a read; Node (self) on a write

**Example**

```lua
N:attr('id', '9')       -- set @id
print(N:attr('id'))     -- "9"
print(N:attr('missing')) -- nil
```


### `Node:inner`

*method of `Node`*

```lua
Node:inner(xml)
```

Replace element content by parsing an XML fragment (XML).

XML only. Parses `xml` as element content — zero or more top-level elements and character data — and replaces the receiver's element and #text children with the result, leaving the receiver's attributes in place. The fragment is parsed by the same parser used for whole documents, so escaping and structure round-trip identically. An empty string clears the content and keeps attributes without raising. Returns the receiver so calls chain. Raises on a non-string argument, on malformed fragment XML (with the parse position), and on a receiver that is not an Element_Node.

**Usage**

```lua
N:inner('<b>hi</b> there')
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `xml` | string | Yes | XML fragment: top-level elements and/or character data. |

**Returns**

- Node (self)

**Example**

```lua
local Text = Note:add('text')
Text:inner('See <ref value="1"/> for details.')
-- <text>See <ref value="1"/> for details.</text>
```


### `Node:remove`

*method of `Node`*

```lua
Node:remove(key)
```

Remove children by name or 1-based index (XML).

XML only. With a string key, removes every element child (and any repeat group) bearing that name; attributes are left in place. With an integer key, removes the child at that 1-based position in stored order. The tree left behind is what a re-parse of the serialized output would produce: adjacent same-named runs are re-merged and adjacent #text children are coalesced. Any node handle held on a removed child stays allocated until its former tree root is released and reads through it raise a detached-node error. Returns the receiver so calls chain. Raises on a receiver that is not an Element_Node.

**Usage**

```lua
Order:remove('Item')   -- by name
Order:remove(2)         -- by index
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string\|integer | Yes | Child name (removes all matches) or 1-based index (removes one). |

**Returns**

- Node (self)

**Example**

```lua
Order:remove('Item')  -- drop every <Item> child
print(linkiir.data.serialize{ data = Order })
```


### `Node:clear`

*method of `Node`*

```lua
Node:clear()
```

Remove all content, keep attributes (XML).

XML only. Sets Text_Content to empty and drops every non-attribute child (elements, repeat groups and #text nodes), leaving every attribute in place. Returns the receiver so calls chain. Raises on a receiver that is not an Element_Node.

**Usage**

```lua
N:clear()
```

**Returns**

- Node (self)

**Example**

```lua
N:clear()  -- empty the element but keep its attributes
```


### `Node:all`

*method of `Node`*

```lua
Node:all(name)
```

Array of every child element bearing a name (XML).

XML only. Returns a Lua array table holding every Element_Node child named `name`, in document order, spanning every run so the result never depends on how the children are grouped. Returns an empty table when there are none. Reads only; changes nothing. Raises on an absent, nil, non-string or empty-string name, and on a receiver that is not an Element_Node.

**Usage**

```lua
for _, item in ipairs(Order:all('Item')) do ... end
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Element name to collect. |

**Returns**

- table — array of Node, empty when no child matches

**Example**

```lua
for _, Item in ipairs(Order:all('Item')) do
   print(Item:attr('sku'))
end
```


### `Node:el`

*method of `Node`*

```lua
Node:el(name)
```

First child element by name, bypassing method dispatch (XML).

XML only. Returns the first Element_Node child named `name` (or the first run's repeat group when there is more than one), or nil when absent. This is the XML element read path that reaches a child whose name collides with a method name — e.g. `node:el('text')`, `node:el('set')` — where `node.text` / `node.set` would return the method instead. `node:child(name)` and `node:all(name)` also bypass method dispatch. Reads only; changes nothing. Raises on a non-empty-string argument requirement and on a receiver that is not an Element_Node.

**Usage**

```lua
local Text = Section:el('text')
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Element name (non-empty). |

**Returns**

- Node, or nil when absent

**Example**

```lua
-- Section.text would return the :text() method; use :el to reach the child
local Text = Section:el('text')
if Text then print(Text:value()) end
```


### `Node:attrCount`

*method of `Node`*

```lua
Node:attrCount()
```

Number of attributes on the element (XML).

XML only. Returns the number of Attribute_Nodes the element holds, and 0 when it holds none. `childCount()` counts attributes among its total; `attrCount()` lets generic traversal separate them. Reads only; changes nothing. Raises on a receiver that is not an Element_Node.

**Usage**

```lua
local n = N:attrCount()
```

**Returns**

- integer

**Example**

```lua
print(N:attrCount())  -- number of @-attributes on N
```


### `Node:append`

*method of `Node`*

```lua
Node:append(kind, name)
```

Generic typed append: element, attribute or text (XML).

XML only. The generic typed-append path behind node:add and node:attr. `kind` is one of the three module constants linkiir.data.ELEMENT, linkiir.data.ATTRIBUTE and linkiir.data.TEXT. ELEMENT behaves exactly as node:add(name), including the Text_Content-to-#text conversion and the reserved-name errors, and returns the new Element_Node. ATTRIBUTE creates an empty-valued attribute named `name` when absent (or leaves an existing one and the child count unchanged) and returns the Attribute_Node. TEXT appends a new #text child carrying `name` as its value and returns it. Raises on a kind that is not one of the three constants, on an invalid name for the element or attribute kind, and on a receiver that is not an Element_Node.

**Usage**

```lua
N:append(linkiir.data.ELEMENT, 'Item')
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `kind` | table | Yes | linkiir.data.ELEMENT, linkiir.data.ATTRIBUTE or linkiir.data.TEXT. |
| `name` | string | Yes | Element name, attribute name (without '@'), or text content, per kind. |

**Returns**

- `node` — the appended node: the new Element_Node for ELEMENT, the Attribute_Node for ATTRIBUTE, the #text node for TEXT.

**Example**

```lua
local Item = Order:append(linkiir.data.ELEMENT, 'Item')
Item:append(linkiir.data.ATTRIBUTE, 'sku')
Item:append(linkiir.data.TEXT, 'Widget')
-- <Order><Item sku="">Widget</Item></Order>
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

