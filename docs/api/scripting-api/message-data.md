---
title: Message Data
---

# Message Data

`linkiir.data`

Parses, builds and serializes messages in HL7 v2, X12, FHIR, CDA and XML as node trees. Documents of a plain JSON or XML schema are read into Lua tables with parse and written back with serialize.

---

## `linkiir.data.extract`

*function*

```lua
linkiir.data.extract{ schema=, data=, type= }
```

Parse a wire message into a node tree.

Parses a raw message into a read/write node tree and returns it with the message definition the schema matched. For documents of a plain JSON or XML schema, use linkiir.data.parse.

**Usage**

```lua
linkiir.data.extract{ schema = <string>, data = <string> [, type = <string>] }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `schema` | string | Yes | Linkiir grammar JSON file (e.g. demo.json). |
| `data` | string | Yes | Raw message text (HL7 v2, X12, FHIR JSON or XML, CDA, or XML). |
| `type` | string | No | Protocol override: "hl7", "x12", "fhir", "cda" or "xml" (schema-free), defaulting to the schema's protocol. |

**Returns**

- `node` — root of the parsed tree (Linkiir node) — see the Node:* methods in this module.
- `messageType` — grammar message-definition name (e.g. "ADT", "837", "Patient", "ContinuityofCareDocumentCCD"), or "unknown" when no match rule or message definition identifies the message.

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

```lua
-- FHIR (JSON or XML). 'name' is also a node method, so use :child.
local Pat, ResType = linkiir.data.extract{ schema = 'fhir.json', data = Data }
print(ResType)                                 -- "Patient"
print(Pat:child('name')[1].family:value())     -- "Chalmers"
Pat.active = true                              -- written as a JSON boolean

-- CDA: an XML tree, typed by its templateId.
local Doc, DocType = linkiir.data.extract{ schema = 'cda.json', data = Data }
print(DocType)                                 -- "ContinuityofCareDocumentCCD"
print(Doc.code:attr('code'))                   -- "34133-9"
```


## `linkiir.data.parse`

*function*

```lua
linkiir.data.parse{ schema=, data=, name= }
```

Read a JSON or XML document into plain Lua tables, typed by its schema.

Reads a JSON or XML document into plain Lua tables, typed by a plain JSON or XML schema from the Schema Editor. Repeating properties are always arrays, and JSON null is linkiir.json.null.

**Usage**

```lua
linkiir.data.parse{ schema = <string>, data = <string> [, name = <string>] }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `schema` | string | Yes | A plain JSON or XML schema file (protocol "json" or "xml"). Message schemas (HL7, X12, FHIR, CDA) raise; use linkiir.data.extract for those. |
| `data` | string | Yes | The JSON or XML document text. |
| `name` | string | No | The structure to read it as. Defaults to the schema's only structure; otherwise, for JSON, the one whose properties best match the document (raises when two match equally) and, for XML, the one named after the root element. |

**Returns**

- `table` — the document as plain Lua tables (an array of them when the JSON document is an array of the structure's objects).
- `structureName` — the name of the structure it was read as (for XML, the root element name).

**Errors**

Raises a Lua error on failure (trap with pcall).

Codes: `MISSING_PARAMETER`, `SCHEMA_NOT_FOUND`, `PARSE_ERROR`, `INVALID_VALUE`, `UNSUPPORTED_TYPE`

**Example**

```lua
-- demo_order.json: an Order with a customer and repeating items.
local Order = linkiir.data.parse{ schema = 'demo_order.json', data = Data }
local Total = 0
for _, Item in ipairs(Order.items) do
   Total = Total + Item.quantity * Item.unitPrice   -- already numbers
end
Order.total = Total
Order.tags[#Order.tags + 1] = 'priced'
local Json = linkiir.data.serialize(Order)
```

```lua
-- demo_patient.json: <patient id="MRN-1" active="true"> with <name> and <observation unit="kg">54.5</observation>
local Patient, Root = linkiir.data.parse{ schema = 'demo_patient.json', data = Data }
print(Root)                          -- "patient"
print(Patient.id, Patient.active)    -- MRN-1   true
print(Patient.name[1].family)        -- repeating elements are arrays
print(Patient.observation[1].unit, Patient.observation[1].xmlText)   -- kg   54.5
local Xml = linkiir.data.serialize(Patient)
```


## `linkiir.data.create`

*function*

```lua
linkiir.data.create{ schema=, name=, type=, format= }
```

Build an empty message tree for a definition.

Creates an empty message tree for a schema's message definition, ready to fill by assignment. FHIR and CDA messages come with their root and fixed values already set.

**Usage**

```lua
linkiir.data.create{ schema = <string>, name = <string> [, type = <string>] [, format = <string>] }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `schema` | string | Yes | Linkiir grammar JSON file. |
| `name` | string | Yes | Grammar message-definition name (usually the 2nd return of linkiir.data.extract). |
| `type` | string | No | Protocol override; defaults to the grammar's protocol. |
| `format` | string | No | FHIR only: "json" (default) or "xml". Raises for any other type. |

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

```lua
local Pat = linkiir.data.create{ schema = 'fhir.json', name = 'Patient' }
Pat.gender = 'female'
Pat:add('name').family = 'Doe'
print(Pat:S())  -- {"resourceType":"Patient","gender":"female","name":[{"family":"Doe"}]}

local Doc = linkiir.data.create{ schema = 'cda.json', name = 'DischargeSummary' }
print(Doc.templateId:attr('root'))  -- "2.16.840.1.113883.10.20.22.1.8"
```


## `linkiir.data.serialize`

*function*

```lua
linkiir.data.serialize{ data=node|table, schema=, name= }
```

Serialize a node tree, or a plain JSON/XML table, back to text.

Serializes a node tree back to message text, or a plain JSON or XML table to compact JSON or XML. A table built by hand needs `schema`, and `name` when the schema has more than one structure.

**Usage**

```lua
linkiir.data.serialize{ data = <node|table> [, schema = <string>] [, name = <string>] }   -- or linkiir.data.serialize(<node|table>)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | node\|table | Yes | The node to serialize (root or subtree), or a plain Lua table following a JSON or XML schema. |
| `schema` | string | No | Plain tables only: the JSON or XML schema the table follows. Not needed for a table linkiir.data.parse returned. |
| `name` | string | No | Plain tables only: the structure to write it as (for XML, the root element). Defaults to the schema's only structure. |

**Returns**

- `string` — the serialized wire text.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `SCHEMA_NOT_FOUND`, `INVALID_VALUE`

**Example**

```lua
local wire  = linkiir.data.serialize{ data = Out }
local wire2 = Out:text()   -- identical result
```

```lua
-- A new document from a table built by hand.
local Ack = linkiir.data.serialize{
   schema = 'demo_order.json', name = 'Order',
   data = { orderId = 'WEB-1', status = 'received', items = {} },
}
-- {"orderId":"WEB-1","status":"received","items":[]}
```


## `linkiir.data.unescape`

*function*

```lua
linkiir.data.unescape(value [, node])
```

Decode HL7 escape sequences in a value.

Decodes the HL7 v2 escape sequences in a value, using the delimiters the message declares. Node values keep the text as received, so call this when a script needs the decoded text.

**Usage**

```lua
linkiir.data.unescape(<string|node> [, <node>])
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | string\|node | Yes | The text to decode, or an HL7 node whose value is decoded. nil returns nil. |
| `node` | node | No | Any node of the HL7 message whose delimiters apply. |

**Returns**

- `string` — the decoded text.

**Errors**

Raises a Lua error when the node is not an HL7 node.

Codes: `INVALID_PARAMETER`

**Example**

```lua
local Msg = linkiir.data.extract{ schema = 'demo.json', data = Data }
local family = linkiir.data.unescape(Msg.PID[5][1][1])   -- O'BRIEN\T\SMITH -> O'BRIEN&SMITH
```


## `linkiir.data.escape`

*function*

```lua
linkiir.data.escape(text [, node])
```

Encode a value as HL7 escape sequences, for writing into a message.

Encodes HL7 delimiters in text as escape sequences, the opposite of linkiir.data.unescape. Escape any value that may contain ^ ~ & before assigning it to an HL7 field.

**Usage**

```lua
linkiir.data.escape(<string> [, <node>])
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | string | Yes | The text to encode. nil returns nil. |
| `node` | node | No | Any node of the HL7 message the text is written into. |

**Returns**

- `string` — the encoded text.

**Errors**

Raises a Lua error when the node is not an HL7 node.

Codes: `INVALID_PARAMETER`

**Example**

```lua
local Out = linkiir.data.create{ schema = 'demo.json', name = 'ADT', type = 'hl7' }
Out.PID[11][1][1] = linkiir.data.escape('1 MAIN ST ^ REAR', Out)
print(Out.PID:text())   -- PID|||||||||||1 MAIN ST \S\ REAR
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

Returns the code set with the given id from a schema, or nil if the schema has none. The schema path resolves against the node directory.

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

Builds a table mapping each source code to the destination code with the same description, ignoring case and spacing. Codes with no match are left out, so use an `or` default for gaps.

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

Sets the node's value and returns the node. On HL7 v2, text containing ~ ^ & is split into parts, as when a message is parsed.

**Usage**

```lua
N:set('12345')
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `v` | string\|number\|boolean | Yes | New scalar value. |

**Returns**

- Node (self)

**Example**

```lua
N:set('12345')       -- write a new scalar value
print(N:value())    -- "12345"
```

```lua
local Out = linkiir.data.create{ schema = 'demo.json', name = 'ADT', type = 'hl7' }
Out.PID[5][1][1] = 'DOE'
Out.PID[5][1][4] = 'JR'      -- components 2-3 are made, empty
Out.PID[3][2] = 'X1'          -- a second repetition
print(Out.PID:text())         -- PID|||~X1||DOE^^^JR
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

Child by name or 1-based index (= Node[k]). Bypasses method dispatch, so it reaches an element whose name matches a node method — common in FHIR (Patient.name, Bundle.type, Quantity.value).

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
local Names = Pat:child('name')   -- Pat.name would return the :name() method
```


### `Node:parent`

*method of `Node`*

```lua
Node:parent()
```

The node holding this one; nil for the root.

The node holding this one, or nil for a tree's root. On an X12 tree it climbs from a segment to its loop instance, then to the container a repeating loop's instances sit in, and so on up to the message.

**Usage**

```lua
local Loop = Seg:parent()
```

**Returns**

- Node, or nil for the root

**Example**

```lua
-- X12: the subscriber loop a claim belongs to
local Subscriber = Claim:parent():parent()   -- 2300 instance -> 2300 container -> 2000B instance
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

Protocol code: 101 HL7, 102 X12, 103 DB, 104 JSON (FHIR JSON), 105 XML (XML, FHIR XML and CDA).

**Usage**

```lua
local p = N:protocol()
```

**Returns**

- integer

**Example**

```lua
print(Msg:protocol())  -- 101 (HL7), 102 (X12), 104 (FHIR JSON), 105 (XML, FHIR XML, CDA)
```


### `Node:add`

*method of `Node`*

```lua
Node:add(name [, after | before])
```

Add a child element (XML, FHIR JSON), a segment (HL7 v2), or a segment or loop (X12). Returns it.

Appends a new empty child element named `name` and returns it; on XML, `before` places it before a given child. On HL7 v2 and X12 it inserts a segment (or X12 loop) where the structure puts it, or after `after`.

**Usage**

```lua
local Item = Order:add('Item')
local Realm = Doc:add('realmCode', Doc.typeId)   -- XML, before typeId
local Obx = Msg:add('OBX', PrevObx)   -- HL7 v2
local Claim = Subscriber:add('2300')   -- X12
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Element name (1-1024 chars; must not start with '@' or equal '#text'). |
| `after` | node | No | HL7 v2 and X12: the segment to insert after, defaulting to where the structure puts it. XML: a child to insert before instead. |

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

```lua
-- HL7 v2: an OBX and its note for each result
local Out = linkiir.data.create{ schema = 'demo.json', name = 'Lab', type = 'hl7' }
local Prev = Out.OBX
Prev[1] = '1'
for i = 2, 3 do
  local Nte = Out:add('NTE', Prev)
  Nte[3] = 'note ' .. (i - 1)
  Prev = Out:add('OBX', Nte)
  Prev[1] = tostring(i)
end
-- ... OBX|1 / NTE|||note 1 / OBX|2 / NTE|||note 2 / OBX|3
```


### `Node:attr`

*method of `Node`*

```lua
Node:attr(name [, value])
```

Read or write an attribute (XML).

Reads attribute `name`, or with a `value` sets it and returns the receiver. XML only, including FHIR XML and CDA.

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

Replaces an element's content with a parsed XML fragment, keeping its attributes, and returns the receiver. XML only, including FHIR XML and CDA.

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

Remove children by name or 1-based index (XML, FHIR JSON), segments and repetitions (HL7 v2), or segments and loops (X12).

Removes the children with a given name, or the child at a 1-based index, and returns the receiver. On HL7 v2 it removes segments or repetitions, and on X12 segments or loops.

**Usage**

```lua
Order:remove('Item')   -- by name
Order:remove(2)         -- by index
Msg:remove('EVN')       -- HL7 v2: a segment
Msg.PID[3]:remove(2)    -- HL7 v2: a repetition
Subscriber['2300']:remove(1)   -- X12: a loop instance
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

```lua
-- HL7 v2: drop the event segment and every ID but the first
Msg:remove('EVN')
for r = Msg.PID[3]:count(), 2, -1 do Msg.PID[3]:remove(r) end
Msg.PID[19] = ''   -- blank the SSN
```


### `Node:clear`

*method of `Node`*

```lua
Node:clear()
```

Remove all content, keep attributes (XML, FHIR JSON).

Removes all of an element's content but keeps its attributes, and returns the receiver. XML and FHIR JSON.

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

Array of every child element bearing a name (XML, FHIR JSON).

Returns an array of every child element named `name` in document order, or an empty table. XML and FHIR JSON.

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

First child element by name, bypassing method dispatch (XML, FHIR JSON).

Returns the first child element named `name`, or nil, even when the name matches a method such as `text`. XML and FHIR JSON.

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

Number of attributes on the element (XML, FHIR JSON).

Returns the number of attributes on the element; always 0 on FHIR JSON. XML and FHIR JSON.

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

Generic typed append: element, attribute or text (XML, FHIR JSON).

Appends a child of the given kind (linkiir.data.ELEMENT, ATTRIBUTE or TEXT) and returns it. XML and FHIR JSON.

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

