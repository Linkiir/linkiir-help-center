---
title: Linkiir Scripting API
---

# Linkiir Scripting API

Reference for the Lua scripting API available inside Linkiir workflow scripts.

---

## Script Globals

`script.globals`

Values and functions available in every script without requiring any module: the script's input payload, the current node directory, and stdlib-style helpers for loading modules and debug printing.

---

### `Data`

*field*

```lua
Data
```

The inbound message/request payload.

The inbound message/request payload passed to `main(Data)`. For Source HTTP nodes this is the raw HTTP request text; for Transform/LLP nodes it is the message body.

**Usage**

```lua
local raw = Data
```

**Returns**

- `string` — the raw inbound payload.

**Example**

```lua
local Raw = Data
print(#Raw)
```


### `__node_dir`

*field*

```lua
__node_dir
```

Filesystem path to the current node directory.

Filesystem path to the current node directory. Set by the runtime before script execution. Used to resolve relative schema paths.

**Usage**

```lua
local schemaPath = __node_dir .. '/demo.json'
```

**Returns**

- `string` — absolute path to the node directory.

**Example**

```lua
local SchemaPath = __node_dir .. '/demo.json'
local Msg = linkiir.data.extract{ schema = SchemaPath, data = Data }
```


### `require`

*function*

```lua
require(modname)
```

Load a Lua module.

Loads a Lua module. Search path: node dir (including any linked library dependencies, staged there at run time) then system defaults.

**Usage**

```lua
local mod = require "modname"
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `modname` | string | Yes | Module name (e.g. "legacy_adapter"). |

**Returns**

- module table

**Errors**

Raises a Lua error when the module cannot be found.

**Example**

```lua
local Adapter = require('legacy_adapter')
Adapter.transform(Data)
```


### `print`

*function*

```lua
print(...)
```

Print values to stdout.

Prints values to stdout, prefixed with the node ID.

**Usage**

```lua
print(Msg:name(), Msg:count())
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | any | No | Values to print (variadic). |

**Returns**

- nil

**Example**

```lua
print('processing', linkiir.sys.guid())
```


### `trace`

*function*

```lua
trace(...)
```

Pretty-print values to stdout.

Pretty-prints values to stdout (legacy debug trace). Recursively expands tables.

**Usage**

```lua
trace(SomeTable)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | any | No | Values to pretty-print (variadic). |

**Returns**

- nil

**Example**

```lua
trace({ id = 1, items = { 'a', 'b' } })
```


### `type`

*function*

```lua
type(v)
```

Type name of a value.

Returns the type of its only argument, coded as a string: "nil", "boolean", "number", "string", "table", "function", "thread", or "userdata".

**Usage**

```lua
type(v)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `v` | any | Yes | Value to inspect. |

**Returns**

- string

**Example**

```lua
print(type(Data))     -- "string"
print(type(nil))      -- "nil"
print(type({}))       -- "table"
```


### `tostring`

*function*

```lua
tostring(v)
```

Convert a value to a printable string.

Receives a value of any type and converts it to a string in a reasonable format.

**Usage**

```lua
tostring(v)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `v` | any | Yes | Value to convert. |

**Returns**

- string

**Example**

```lua
print(tostring(42))     -- "42"
print(tostring(nil))    -- "nil"
```


### `tonumber`

*function*

```lua
tonumber(e [, base])
```

Convert a value to a number.

Tries to convert its argument to a number. If the argument is already a number or a string convertible to a number, returns that number; otherwise returns nil. An optional base (2-36) interprets e as an integer in that base.

**Usage**

```lua
tonumber(e, base)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `e` | any | Yes | Value to convert. |
| `base` | integer | No | Numeric base (2-36) for string conversion. |

**Returns**

- number, or nil if the conversion fails

**Example**

```lua
print(tonumber('42'))      -- 42
print(tonumber('2A', 16)) -- 42
print(tonumber('abc'))    -- nil
```


### `pairs`

*function*

```lua
pairs(t)
```

Iterate all key/value pairs of a table.

Returns three values (next, t, nil) so that a generic for loop iterates over all key/value pairs of table t, in an undefined order.

**Usage**

```lua
for k, v in pairs(t) do ... end
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table to iterate. |

**Returns**

- next, t, nil (for use in a generic for loop)

**Example**

```lua
local Headers = { ['Content-Type'] = 'text/plain', ['X-Id'] = '123' }
for k, v in pairs(Headers) do
   print(k, v)
end
```


### `ipairs`

*function*

```lua
ipairs(t)
```

Iterate the array part of a table in order.

Returns three values so that a generic for loop iterates over the pairs (1, t[1]), (2, t[2]), ..., up to the first nil value.

**Usage**

```lua
for i, v in ipairs(t) do ... end
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table (array) to iterate. |

**Returns**

- iterator function, t, 0 (for use in a generic for loop)

**Example**

```lua
local Files = linkiir.sys.fs.list{ path = '/inbound' }
for i, f in ipairs(Files) do
   print(i, f)
end
```


### `next`

*function*

```lua
next(t [, k])
```

Low-level table iterator.

Returns the next key/value pair after key k in table t, in an undefined order; returns nil when there are no more. Called with k = nil (or omitted) returns the first pair. Underlies pairs().

**Usage**

```lua
next(t, k)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table to iterate. |
| `k` | any | No | Previous key; omit to get the first pair. |

**Returns**

- nextKey, nextValue, or nil when exhausted

**Example**

```lua
local k, v = next(Headers)
while k do
   print(k, v)
   k, v = next(Headers, k)
end
```


### `select`

*function*

```lua
select(index, ...)
```

Count or pick from a variadic argument list.

If index is the string "#", returns the total number of extra arguments. Otherwise returns all arguments from index onward.

**Usage**

```lua
select(index, ...)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `index` | integer\|string | Yes | 1-based position, or "#" for the count. |
| `...` | any | No | Variadic arguments. |

**Returns**

- the selected arguments, or a count when index is "#"

**Example**

```lua
local function Count(...)
   return select('#', ...)
end
print(Count('a', 'b', 'c'))  -- 3
print(select(2, 'a', 'b', 'c'))  -- "b"  "c"
```


### `error`

*function*

```lua
error(message [, level])
```

Raise a Lua error.

Terminates the last protected function called (or the whole script) and returns message as the error object. level controls where position info is added (1 = the caller of error, the default).

**Usage**

```lua
error(message, level)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | any | Yes | Error value, usually a string. |
| `level` | integer | No | Position-info level. Default 1. |

**Returns**

- does not return

**Example**

```lua
if not Resp then error('request failed') end
```


### `assert`

*function*

```lua
assert(v [, message])
```

Raise an error if v is falsy.

If v is false or nil, calls error(message), using "assertion failed!" as a default message. Otherwise returns all its arguments.

**Usage**

```lua
assert(v, message)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `v` | any | Yes | Value to check. |
| `message` | any | No | Error value used when v is falsy. |

**Returns**

- v, ... (all arguments, unchanged, when v is truthy)

**Example**

```lua
local Mrn = assert(Msg.PID[3][1][1]:value(), 'missing MRN')
```


### `pcall`

*function*

```lua
pcall(f, ...)
```

Call a function in protected mode.

Calls f with the given arguments in protected mode: any error inside f is caught instead of propagating. Returns true plus f's results on success, or false plus the error object on failure.

**Usage**

```lua
local ok, result = pcall(f, ...)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `f` | function | Yes | Function to call. |
| `...` | any | No | Arguments to pass to f. |

**Returns**

- true, results... on success
- false, errorObject on failure

**Example**

```lua
local Ok, Msg, MsgType = pcall(linkiir.data.extract, { schema = 'demo.json', data = Data })
if not Ok then error('extract failed: ' .. tostring(Msg)) end
```


### `xpcall`

*function*

```lua
xpcall(f, msgh)
```

Call a function in protected mode with a message handler.

Like pcall, but calls the message handler msgh in the context of the error, before the stack unwinds — useful for attaching a traceback.

**Usage**

```lua
local ok, result = xpcall(f, msgh)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `f` | function | Yes | Function to call (no arguments). |
| `msgh` | function | Yes | Message handler, called with the error object. |

**Returns**

- true, results... on success
- false, handlerResult on failure

**Example**

```lua
local Ok, Err = xpcall(function() return riskyStep() end, debug.traceback)
if not Ok then print(Err) end
```


### `unpack`

*function*

```lua
unpack(list [, i [, j]])
```

Expand a table into multiple return values.

Returns the elements from the given table list, from list[i] to list[j]. Defaults are i = 1 and j = #list.

**Usage**

```lua
unpack(list, i, j)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `list` | table | Yes | Table (array) to expand. |
| `i` | integer | No | Start index. Default 1. |
| `j` | integer | No | End index. Default #list. |

**Returns**

- the unpacked values

**Example**

```lua
local Args = { 'a', 'b', 'c' }
print(unpack(Args))  -- "a"  "b"  "c"
```


### `rawequal`

*function*

```lua
rawequal(v1, v2)
```

Compare two values without metamethods.

Checks whether v1 is equal to v2, without invoking the __eq metamethod.

**Usage**

```lua
rawequal(v1, v2)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `v1` | any | Yes | First value. |
| `v2` | any | Yes | Second value. |

**Returns**

- boolean

**Example**

```lua
print(rawequal(1, 1))  -- true
```


### `rawget`

*function*

```lua
rawget(t, k)
```

Read a table field without metamethods.

Gets the real value of t[k], without invoking the __index metamethod.

**Usage**

```lua
rawget(t, k)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table to read. |
| `k` | any | Yes | Key to read. |

**Returns**

- the raw value

**Example**

```lua
print(rawget(SomeTable, 'id'))
```


### `rawset`

*function*

```lua
rawset(t, k, v)
```

Write a table field without metamethods.

Sets the real value of t[k] to v, without invoking the __newindex metamethod. Returns t.

**Usage**

```lua
rawset(t, k, v)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table to modify. |
| `k` | any | Yes | Key to set. |
| `v` | any | Yes | Value to set. |

**Returns**

- t

**Example**

```lua
rawset(SomeTable, 'id', 42)
```


### `setmetatable`

*function*

```lua
setmetatable(t, metatable)
```

Attach a metatable to a table.

Sets the metatable for table t. Returns t.

**Usage**

```lua
setmetatable(t, metatable)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table to modify. |
| `metatable` | table\|nil | Yes | New metatable, or nil to remove it. |

**Returns**

- t

**Example**

```lua
local Vector = setmetatable({ x = 1, y = 2 }, VectorMeta)
```


### `getmetatable`

*function*

```lua
getmetatable(t)
```

Read a table's metatable.

Returns the metatable of t, or nil if it has none (or the metatable's __metatable field, if that is set).

**Usage**

```lua
getmetatable(t)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | any | Yes | Value to inspect. |

**Returns**

- table, or nil

**Example**

```lua
local Meta = getmetatable(Vector)
```


### `collectgarbage`

*function*

```lua
collectgarbage([opt [, arg]])
```

Control the garbage collector.

Runs garbage-collector actions. With no arguments, performs a full collection cycle. opt selects the action (e.g. "collect", "count", "step").

**Usage**

```lua
collectgarbage(opt, arg)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `opt` | string | No | Action name. Default "collect". |
| `arg` | any | No | Argument for the selected action. |

**Returns**

- depends on opt (e.g. current memory use in Kbytes for "count")

**Example**

```lua
collectgarbage()               -- full collection cycle
print(collectgarbage('count'))  -- current memory use, in Kbytes
```


### `_VERSION`

*field*

```lua
_VERSION
```

The running Lua version string.

A global variable (not a function) holding a string with the running Lua version, e.g. "Lua 5.1".

**Usage**

```lua
print(_VERSION)
```

**Returns**

- string

**Example**

```lua
print(_VERSION)  -- "Lua 5.1"
```


---

## Message Data

`linkiir.data`

Parse (extract), build (create), and serialize messages of any supported format (HL7, X12, XML), plus the node-tree interface returned by those calls. XML supports schema-free parsing (schema optional).

---

### `linkiir.data.extract`

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


### `linkiir.data.create`

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


### `linkiir.data.serialize`

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


### Node methods

#### `Node:value`

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


#### `Node:set`

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


#### `Node:name`

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


#### `Node:text`

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


#### `Node:map`

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


#### `Node:child`

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


#### `Node:count`

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


#### `Node:isNull`

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


#### `Node:isLeaf`

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


#### `Node:type`

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


#### `Node:protocol`

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

## Message Flow

`linkiir.flow`

Everything about a message's movement through a channel: acknowledge what came in, route/enqueue what goes out.

---

### `linkiir.flow.push`

*function*

```lua
linkiir.flow.push{ data=, topic=, metadata=, live= }
```

Enqueue / route a message downstream.

Enqueue/route a message to the next Linkiir node/topic and return its trace id.

**Usage**

```lua
linkiir.flow.push{ data = <string> [, topic=] [, metadata=] [, live=] }   -- or linkiir.flow.push(<string>)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Message payload. |
| `topic` | string | No | Target topic/node; defaults to the configured destination. |
| `metadata` | table | No | Key/value headers stored with the message. |
| `live` | boolean | No | Default true; false simulates (test mode). |

**Returns**

- `messageId (string)` — Linkiir trace id assigned at enqueue.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `CONTEXT_UNAVAILABLE`, `QUEUE_WRITE_FAILED`

**Example**

```lua
local MessageId = linkiir.flow.push{ data = Out:text(), topic = 'adt.out' }
```


### `linkiir.flow.configure`

*function*

```lua
linkiir.flow.configure{ bootstrap=, project=, workflow=, node=, topic= }
```

Configure the flow context (node identity and Kafka settings).

Configure the flow context (node identity and Kafka settings). Non-empty fields override the current value; empty fields are left unchanged. Context is also initialized from environment variables (LINKIIR_KAFKA_BOOTSTRAP, LINKIIR_PROJECT_ID, LINKIIR_WORKFLOW_ID, LINKIIR_NODE_ID, LINKIIR_OUTPUT_TOPIC).

**Usage**

```lua
linkiir.flow.configure{ project = <string> [, workflow=] [, node=] [, bootstrap=] [, topic=] }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `bootstrap` | string | No | Kafka bootstrap servers. |
| `project` | string | No | Project ID. |
| `workflow` | string | No | Workflow ID. |
| `node` | string | No | Node ID. |
| `topic` | string | No | Explicit output topic (overrides derived). |

**Example**

```lua
linkiir.flow.configure{ project = "ADT", workflow = "InboundHL7", node = "Transform1" }
```


### `linkiir.flow.topic`

*function*

```lua
linkiir.flow.topic()
```

Return the resolved output topic name (or nil if unresolvable).

Return the resolved output topic name (or nil if unresolvable). Resolution order: explicit topic from configure() \> LINKIIR_OUTPUT_TOPIC env \> derived "linkiir.node.\<project\>.\<workflow\>.\<node\>".

**Usage**

```lua
linkiir.flow.topic()
```

**Returns**

- `topic` — Resolved topic name (string), or nil if unresolvable.

**Example**

```lua
print(linkiir.flow.topic())  -- "linkiir.node.ADT.InboundHL7.Transform1"
```


---

## Connectivity

`linkiir.link`

All connectivity to external systems, named for the heart of Linkiir. Sub-areas: web (HTTP), socket (TCP), mail (SMTP), file (FTP/FTPS/SFTP). All calls return result, err.

---

### `linkiir.link.web.get`

*function*

```lua
linkiir.link.web.get{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP GET request.

**Usage**

```lua
linkiir.link.web.get{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.get{ url = 'https://fhir.example.com/Patient/123' }
if not Resp then error(Err.message) end
print(Resp.code, Resp.body)
```


### `linkiir.link.web.post`

*function*

```lua
linkiir.link.web.post{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP POST request.

Perform an outbound HTTP POST request, sending `body` as the request payload.

**Usage**

```lua
linkiir.link.web.post{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.post{
   url     = 'https://fhir.example.com/Patient',
   headers = { ['Content-Type'] = 'application/fhir+json' },
   body    = linkiir.data.serialize{ data = Out },
   auth    = { type = 'bearer', token = Token },
}
if not Resp then error(Err.message) end
print(Resp.code, Resp.body)
```


### `linkiir.link.web.put`

*function*

```lua
linkiir.link.web.put{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP PUT request.

Perform an outbound HTTP PUT request, sending `body` as the request payload.

**Usage**

```lua
linkiir.link.web.put{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.put{
   url  = 'https://fhir.example.com/Patient/123',
   body = linkiir.data.serialize{ data = Out },
}
if not Resp then error(Err.message) end
```


### `linkiir.link.web.patch`

*function*

```lua
linkiir.link.web.patch{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP PATCH request.

Perform an outbound HTTP PATCH request, sending `body` as the request payload.

**Usage**

```lua
linkiir.link.web.patch{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.patch{
   url  = 'https://fhir.example.com/Patient/123',
   body = linkiir.json.serialize{ active = false },
}
if not Resp then error(Err.message) end
```


### `linkiir.link.web.delete`

*function*

```lua
linkiir.link.web.delete{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP DELETE request.

**Usage**

```lua
linkiir.link.web.delete{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.delete{ url = 'https://fhir.example.com/Patient/123' }
if not Resp then error(Err.message) end
```


### `linkiir.link.web.head`

*function*

```lua
linkiir.link.web.head{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP HEAD request.

Perform an outbound HTTP HEAD request; the response has no body.

**Usage**

```lua
linkiir.link.web.head{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.head{ url = 'https://fhir.example.com/Patient/123' }
if not Resp then error(Err.message) end
print(Resp.code)
```


### `linkiir.link.web.options`

*function*

```lua
linkiir.link.web.options{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP OPTIONS request.

**Usage**

```lua
linkiir.link.web.options{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.options{ url = 'https://fhir.example.com/Patient/123' }
if not Resp then error(Err.message) end
print(Resp.headers['Allow'])
```


### `linkiir.link.web.request`

*function*

```lua
linkiir.link.web.request()
```

Read the inbound HTTP request (From-HTTP context).

In an inbound HTTP context, returns the parsed inbound request.

**Usage**

```lua
local Req = linkiir.link.web.request()
```

**Returns**

- `{ method=, path=, headers=, params=, body= }` — the parsed inbound request.

**Errors**

Raises a Lua error on failure.

Codes: `CONTEXT_UNAVAILABLE`

**Example**

```lua
local Req = linkiir.link.web.request()
```


### `linkiir.link.web.respond`

*function*

```lua
linkiir.link.web.respond{ code=, body=, headers= }
```

Send the HTTP response (From-HTTP context).

In an inbound HTTP context, sends the HTTP response for the current request.

**Usage**

```lua
linkiir.link.web.respond{ code=, body=, headers= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | integer | Yes | HTTP status code. |
| `body` | string | No | Response body. |
| `headers` | table | No | Response headers. |

**Returns**

- ok, err

**Errors**

respond() returns ok, err.

Codes: `CONTEXT_UNAVAILABLE`, `IO_ERROR`

**Example**

```lua
linkiir.link.web.respond{ code = 200, body = '{"status":"ok"}',
                    headers = { ['Content-Type'] = 'application/json' } }
```


### `linkiir.link.socket.connect`

*function*

```lua
linkiir.link.socket.connect{ host=, port=, timeout= }
```

Open a raw TCP socket.

Open a raw TCP socket for custom LLP/TCP clients.

**Usage**

```lua
local sock, err = linkiir.link.socket.connect{ host=, port=, timeout= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `host` | string | Yes | Target host. |
| `port` | integer | Yes | Target port. |
| `timeout` | integer | No | Connect timeout (seconds). |

**Returns**

- sock (socket object) on success — see the Socket:* methods in this module.
- nil, err on failure

**Errors**

Returns result, err.

Codes: `CONNECT_FAILED`, `TIMEOUT`, `IO_ERROR`

**Example**

```lua
local Sock, Err = linkiir.link.socket.connect{ host = '10.0.0.5', port = 5001, timeout = 5 }
if not Sock then error(Err.message) end
Sock:send(Msg:text())
local Reply = Sock:recv()
Sock:close()
```


### `linkiir.link.mail.send`

*function*

```lua
linkiir.link.mail.send{ server=, from=, to=, header=, body=, … }
```

Send an email over SMTP.

Send email through SMTP via libcurl. Returns ok, err following the I/O convention.

**Usage**

```lua
linkiir.link.mail.send{ server=, from=, to=, header=, body=, username=, password=, use_ssl=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `server` | string | Yes | SMTP URL (smtp://host:port) or plain hostname. |
| `from` | string | Yes | Envelope sender address (MAIL FROM). |
| `to` | table | Yes | Array of recipient addresses (RCPT TO). |
| `header` | table | No | Email headers as key/value pairs (Subject, From, To, Date). |
| `body` | string | No | Email body text. |
| `username` | string | No | SMTP auth username. |
| `password` | string | No | SMTP auth password. |
| `use_ssl` | string | No | 'yes' (require TLS), 'try' (STARTTLS if available), or '' (none). |
| `timeout` | integer | No | Seconds (default 15). |
| `verifyTls` | boolean | No | TLS verification, default true. |
| `live` | boolean | No | Default true; false simulates. |

**Returns**

- true on success
- nil, err on failure

**Errors**

Returns ok, err.

Codes: `INVALID_SERVER`, `MISSING_PARAM`, `AUTH_FAILED`, `CONNECT_FAILED`, `TLS_ERROR`, `TIMEOUT`, `SEND_FAILED`

**Example**

```lua
local ok, err = linkiir.link.mail.send{
   server   = 'smtp://mail.example.com:587',
   from     = 'alerts@example.com',
   to       = { 'oncall@example.com', 'admin@example.com' },
   header   = { From = 'alerts@example.com', To = 'oncall@example.com',
                Subject = 'Interface Alert', Date = os.date() },
   body     = 'The ADT feed has stopped.',
   username = 'alerts@example.com', password = Secret,
   use_ssl  = 'try',
}
if not ok then error(err.message) end
```


### `linkiir.link.file.open`

*function*

```lua
linkiir.link.file.open{ scheme='ftp'|'ftps'|'sftp', host=, … }
```

File transfer over FTP / FTPS / SFTP.

Unified file transfer with a scheme selector, instead of three near-identical modules (net.ftp / net.ftps / net.sftp).

**Usage**

```lua
local conn, err = linkiir.link.file.open{ scheme=, host=, port=, user=, password=, key=, timeout= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `scheme` | string | Yes | 'ftp' \| 'ftps' \| 'sftp'. |
| `host` | string | Yes | Server host. |
| `user` | string | No | Username. |
| `password` | string | No | Password. |
| `key` | string | No | Private key (SFTP). |
| `port` | integer | No | Server port. |
| `timeout` | integer | No | Connect timeout. |

**Returns**

- conn (connection object) on success — see the FileConnection:* methods in this module.
- nil, err on failure

**Errors**

Returns result, err.

Codes: `AUTH_FAILED`, `CONNECT_FAILED`, `NOT_FOUND`, `IO_ERROR`

**Example**

```lua
local Conn, Err = linkiir.link.file.open{ scheme = 'sftp', host = 'sftp.lab.example.com',
                                   user = 'feed', key = KeyPem }
if not Conn then error(Err.message) end
Conn:put{ ['local'] = '/tmp/out.hl7', remote = '/inbound/out.hl7' }
Conn:close()
```


### Socket methods

#### `Socket:send`

*method of `Socket`*

```lua
sock:send(data [, startByte [, endByte]])
```

Send bytes over the socket.

**Usage**

```lua
local n, err = sock:send(data)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Bytes to send. |
| `startByte` | integer | No | 1-based start offset into data; defaults to the beginning. |
| `endByte` | integer | No | 1-based end offset into data; defaults to the end. |

**Returns**

- bytesSent, err

**Example**

```lua
local Sent, Err = Sock:send(Msg:text())
if not Sent then error(Err.message) end
```


#### `Socket:recv`

*method of `Socket`*

```lua
sock:recv([maxBytes])
```

Receive data (nil when closed).

**Usage**

```lua
local data, err = sock:recv()
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `maxBytes` | integer | No | Maximum bytes to read; defaults to a runtime buffer size. |

**Returns**

- data, err

**Example**

```lua
local Reply, Err = Sock:recv()
if Reply == nil then print('connection closed') end
```


#### `Socket:close`

*method of `Socket`*

```lua
sock:close()
```

Close the socket.

**Usage**

```lua
sock:close()
```

**Returns**

- none

**Example**

```lua
Sock:close()
```


### FileConnection methods

#### `FileConnection:get`

*method of `FileConnection`*

```lua
conn:get{ remote=, local= }
```

Download a file.

**Usage**

```lua
local ok, err = conn:get{ remote=, local= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `remote` | string | Yes | Remote file path to download. |
| `local` | string | Yes | Local destination path. |

**Returns**

- ok, err

**Example**

```lua
local Ok, Err = Conn:get{ remote = '/inbound/out.hl7', ['local'] = '/tmp/out.hl7' }
if not Ok then error(Err.message) end
```


#### `FileConnection:put`

*method of `FileConnection`*

```lua
conn:put{ local=, remote= }
```

Upload a file.

**Usage**

```lua
local ok, err = conn:put{ local=, remote= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `local` | string | Yes | Local file path to upload. |
| `remote` | string | Yes | Remote destination path. |

**Returns**

- ok, err

**Example**

```lua
Conn:put{ ['local'] = '/tmp/out.hl7', remote = '/inbound/out.hl7' }
```


#### `FileConnection:list`

*method of `FileConnection`*

```lua
conn:list{ path= }
```

List a directory.

**Usage**

```lua
local files, err = conn:list{ path= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Remote directory to list. |

**Returns**

- array, err

**Example**

```lua
local Files, Err = Conn:list{ path = '/inbound' }
if not Files then error(Err.message) end
for _, f in ipairs(Files) do print(f) end
```


#### `FileConnection:delete`

*method of `FileConnection`*

```lua
conn:delete{ path= }
```

Delete a file.

**Usage**

```lua
local ok, err = conn:delete{ path= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Remote file path to delete. |

**Returns**

- ok, err

**Example**

```lua
local Ok, Err = Conn:delete{ path = '/inbound/old.hl7' }
if not Ok then error(Err.message) end
```


#### `FileConnection:rename`

*method of `FileConnection`*

```lua
conn:rename{ from=, to= }
```

Rename/move a file.

**Usage**

```lua
local ok, err = conn:rename{ from=, to= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `from` | string | Yes | Current remote path. |
| `to` | string | Yes | New remote path. |

**Returns**

- ok, err

**Example**

```lua
Conn:rename{ from = '/inbound/tmp', to = '/inbound/out.hl7' }
```


#### `FileConnection:close`

*method of `FileConnection`*

```lua
conn:close()
```

Close the connection.

**Usage**

```lua
conn:close()
```

**Returns**

- none

**Example**

```lua
Conn:close()
```


---

## Database

`linkiir.store`

Database access, named for what it does (store / retrieve). Connection-object style only; query results are Linkiir node trees (protocol code 103 = DB).

---

### `linkiir.store.open`

*function*

```lua
linkiir.store.open{ driver=, name=, user=, password=, … }
```

Open a database connection.

Open a database connection. Driver constants: linkiir.store.MYSQL, POSTGRES, SQLSERVER, ORACLE, SQLITE, DB2, SYBASE, ODBC.

**Usage**

```lua
local conn, err = linkiir.store.open{ driver=, name=, user=, password=, timeout=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `driver` | constant | Yes | One of the linkiir.store.* driver constants. |
| `name` | string | Yes | DSN / host / database / file, per driver. |
| `user` | string | No | Username. |
| `password` | string | No | Password. |
| `timeout` | integer | No | Connect timeout (seconds). |
| `live` | boolean | No | Default true. |

**Returns**

- conn (connection object) on success — see the Connection:* methods in this module.
- nil, err on failure

**Errors**

Returns result, err.

Codes: `DRIVER_NOT_FOUND`, `AUTH_FAILED`, `CONNECT_FAILED`, `TIMEOUT`

**Example**

```lua
local Conn, Err = linkiir.store.open{ driver = linkiir.store.POSTGRES, name = 'clinicdb',
                               user = 'svc', password = Secret }
if not Conn then error(Err.message) end
```


### Connection methods

#### `Connection:query`

*method of `Connection`*

```lua
conn:query{ sql=, params=, live= }
```

SELECT; rows navigable as a node tree.

**Usage**

```lua
local rows, err = conn:query{ sql=, params= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `sql` | string | Yes | SQL query text; use $1, $2, … placeholders for params. |
| `params` | table | No | Positional bind values for the query placeholders. |
| `live` | boolean | No | Default true; false simulates (test mode). |

**Returns**

- result node tree, err

**Example**

```lua
local Rows, Err = Conn:query{ sql = 'select id, name from patient where mrn = $1',
                             params = { Mrn } }
if not Rows then error(Err.message) end
for i = 1, #Rows do
   print(Rows[i].id:value(), Rows[i].name:value())
end
```


#### `Connection:execute`

*method of `Connection`*

```lua
conn:execute{ sql=, params=, live= }
```

INSERT/UPDATE/DELETE/DDL.

**Usage**

```lua
local n, err = conn:execute{ sql=, params= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `sql` | string | Yes | SQL statement text; use $1, $2, … placeholders for params. |
| `params` | table | No | Positional bind values for the statement placeholders. |
| `live` | boolean | No | Default true; false simulates (test mode). |

**Returns**

- affected count, err

**Example**

```lua
local Affected, Err = Conn:execute{ sql = 'update patient set active = false where mrn = $1',
                                    params = { Mrn } }
if not Affected then error(Err.message) end
```


#### `Connection:merge`

*method of `Connection`*

```lua
conn:merge{ data=<tableTree>, live= }
```

Upsert a table tree from linkiir.data.tables.

**Usage**

```lua
local n, err = conn:merge{ data=<tableTree> }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | node | Yes | A linkiir.data.tables node tree to upsert. |
| `live` | boolean | No | Default true; false simulates. |

**Returns**

- rows merged, err

**Example**

```lua
local Merged, Err = Conn:merge{ data = TableTree }
if not Merged then error(Err.message) end
```


#### `Connection:begin`

*method of `Connection`*

```lua
conn:begin{ live= }
```

Begin a transaction.

**Usage**

```lua
conn:begin()
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `live` | boolean | No | Default true; false simulates. |

**Returns**

- ok, err

**Example**

```lua
local Ok, Err = Conn:begin()
if not Ok then error(Err.message) end
```


#### `Connection:commit`

*method of `Connection`*

```lua
conn:commit{ live= }
```

Commit.

**Usage**

```lua
conn:commit()
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `live` | boolean | No | Default true; false simulates. |

**Returns**

- ok, err

**Example**

```lua
Conn:commit()
```


#### `Connection:rollback`

*method of `Connection`*

```lua
conn:rollback{ live= }
```

Roll back.

**Usage**

```lua
conn:rollback()
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `live` | boolean | No | Default true; false simulates. |

**Returns**

- ok, err

**Example**

```lua
Conn:rollback()
```


#### `Connection:check`

*method of `Connection`*

```lua
conn:check()
```

Liveness probe.

**Usage**

```lua
if conn:check() then ... end
```

**Returns**

- boolean

**Example**

```lua
if not Conn:check() then
   Conn = linkiir.store.open{ driver = linkiir.store.POSTGRES, name = 'clinicdb' }
end
```


#### `Connection:quote`

*method of `Connection`*

```lua
conn:quote(s)
```

Escaping fallback; prefer params.

**Usage**

```lua
local q = conn:quote(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | String to escape. |

**Returns**

- string

**Example**

```lua
local Escaped = Conn:quote(UserInput)  -- prefer params= over this when possible
```


#### `Connection:close`

*method of `Connection`*

```lua
conn:close()
```

Release the connection.

**Usage**

```lua
conn:close()
```

**Returns**

- none

**Example**

```lua
Conn:close()
```


---

## Byte Transforms

`linkiir.codec`

Everything that turns bytes into other bytes and back: text encodings, compression, and character-set conversion. Consistent verbs: encode/decode, compress/decompress. Pure functions (raise on error).

---

### `linkiir.codec.base64.encode`

*function*

```lua
linkiir.codec.base64.encode(s)
```

Encode using base64.

Encode arbitrary bytes as a base64 string.

**Usage**

```lua
linkiir.codec.base64.encode(s)   -- or linkiir.codec.base64.encode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local B64 = linkiir.codec.base64.encode(Pdf)
local Raw = linkiir.codec.base64.decode(B64)
```


### `linkiir.codec.base64.decode`

*function*

```lua
linkiir.codec.base64.decode(s)
```

Decode using base64.

Decode a base64-encoded string back to raw bytes.

**Usage**

```lua
linkiir.codec.base64.decode(s)   -- or linkiir.codec.base64.decode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local B64 = linkiir.codec.base64.encode(Pdf)
local Raw = linkiir.codec.base64.decode(B64)
```


### `linkiir.codec.hex.encode`

*function*

```lua
linkiir.codec.hex.encode(s)
```

Encode using hex.

Encode arbitrary bytes as a lowercase hex string.

**Usage**

```lua
linkiir.codec.hex.encode(s)   -- or linkiir.codec.hex.encode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Hex = linkiir.codec.hex.encode(Pdf)
local Raw = linkiir.codec.hex.decode(Hex)
```


### `linkiir.codec.hex.decode`

*function*

```lua
linkiir.codec.hex.decode(s)
```

Decode using hex.

Decode a hex-encoded string back to raw bytes.

**Usage**

```lua
linkiir.codec.hex.decode(s)   -- or linkiir.codec.hex.decode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Hex = linkiir.codec.hex.encode(Pdf)
local Raw = linkiir.codec.hex.decode(Hex)
```


### `linkiir.codec.uri.encode`

*function*

```lua
linkiir.codec.uri.encode(s)
```

Encode using uri.

Percent-encode a string for safe use in a URI.

**Usage**

```lua
linkiir.codec.uri.encode(s)   -- or linkiir.codec.uri.encode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Enc = linkiir.codec.uri.encode('a b&c')
local Dec = linkiir.codec.uri.decode(Enc)
```


### `linkiir.codec.uri.decode`

*function*

```lua
linkiir.codec.uri.decode(s)
```

Decode using uri.

Decode a percent-encoded URI string.

**Usage**

```lua
linkiir.codec.uri.decode(s)   -- or linkiir.codec.uri.decode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Enc = linkiir.codec.uri.encode('a b&c')
local Dec = linkiir.codec.uri.decode(Enc)
```


### `linkiir.codec.html.encode`

*function*

```lua
linkiir.codec.html.encode(s)
```

Encode using html.

Escape HTML-significant characters (\<, \>, &, ", ') in a string.

**Usage**

```lua
linkiir.codec.html.encode(s)   -- or linkiir.codec.html.encode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Esc = linkiir.codec.html.encode('<b>Tom & Jerry</b>')
```


### `linkiir.codec.uu.encode`

*function*

```lua
linkiir.codec.uu.encode(s)
```

Encode using uu.

Encode arbitrary bytes using uuencoding.

**Usage**

```lua
linkiir.codec.uu.encode(s)   -- or linkiir.codec.uu.encode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Uu  = linkiir.codec.uu.encode(Pdf)
local Raw = linkiir.codec.uu.decode(Uu)
```


### `linkiir.codec.uu.decode`

*function*

```lua
linkiir.codec.uu.decode(s)
```

Decode using uu.

Decode a uuencoded string back to raw bytes.

**Usage**

```lua
linkiir.codec.uu.decode(s)   -- or linkiir.codec.uu.decode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Uu  = linkiir.codec.uu.encode(Pdf)
local Raw = linkiir.codec.uu.decode(Uu)
```


### `linkiir.codec.gzip.compress`

*function*

```lua
linkiir.codec.gzip.compress(s)
```

Compress using gzip.

Compress a string payload using gzip.

**Usage**

```lua
linkiir.codec.gzip.compress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.gzip.compress(Payload)
local Raw   = linkiir.codec.gzip.decompress(Small)
```


### `linkiir.codec.gzip.decompress`

*function*

```lua
linkiir.codec.gzip.decompress(s)
```

Decompress using gzip.

Decompress a gzip-compressed string payload.

**Usage**

```lua
linkiir.codec.gzip.decompress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.gzip.compress(Payload)
local Raw   = linkiir.codec.gzip.decompress(Small)
```


### `linkiir.codec.bzip2.compress`

*function*

```lua
linkiir.codec.bzip2.compress(s)
```

Compress using bzip2.

Compress a string payload using bzip2.

**Usage**

```lua
linkiir.codec.bzip2.compress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.bzip2.compress(Payload)
local Raw   = linkiir.codec.bzip2.decompress(Small)
```


### `linkiir.codec.bzip2.decompress`

*function*

```lua
linkiir.codec.bzip2.decompress(s)
```

Decompress using bzip2.

Decompress a bzip2-compressed string payload.

**Usage**

```lua
linkiir.codec.bzip2.decompress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.bzip2.compress(Payload)
local Raw   = linkiir.codec.bzip2.decompress(Small)
```


### `linkiir.codec.zip.compress`

*function*

```lua
linkiir.codec.zip.compress(s)
```

Compress using zip.

Compress a string payload using zip.

**Usage**

```lua
linkiir.codec.zip.compress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.zip.compress(Payload)
local Raw   = linkiir.codec.zip.decompress(Small)
```


### `linkiir.codec.zip.decompress`

*function*

```lua
linkiir.codec.zip.decompress(s)
```

Decompress using zip.

Decompress a zip-compressed string payload.

**Usage**

```lua
linkiir.codec.zip.decompress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.zip.compress(Payload)
local Raw   = linkiir.codec.zip.decompress(Small)
```


### `linkiir.codec.charset.convert`

*function*

```lua
linkiir.codec.charset.convert{ data=, from=, to= }
```

Character-set conversion.

Convert between character sets.

**Usage**

```lua
local out, err = linkiir.codec.charset.convert{ data=, from='cp1252', to='utf-8' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Bytes to convert. |
| `from` | string | Yes | Source encoding (e.g. 'cp1252'). |
| `to` | string | Yes | Target encoding (e.g. 'utf-8'). |

**Returns**

- converted string on success
- nil, err on failure

**Errors**

Returns result, err.

Codes: `UNSUPPORTED_ENCODING`, `CONVERT_ERROR`

**Example**

```lua
local Utf8, Err = linkiir.codec.charset.convert{ data = Legacy, from = 'iso-8859-1', to = 'utf-8' }
```


### `linkiir.codec.charset.list`

*function*

```lua
linkiir.codec.charset.list()
```

List known encodings.

Return the list of character-set names supported by linkiir.codec.charset.convert.

**Usage**

```lua
local result = linkiir.codec.charset.list()
```

**Returns**

- `array` — List known encodings.

**Errors**

Returns result, err.

Codes: `UNSUPPORTED_ENCODING`, `CONVERT_ERROR`

**Example**

```lua
local Result = linkiir.codec.charset.list()
```


### `linkiir.codec.charset.supported`

*function*

```lua
linkiir.codec.charset.supported(name)
```

Test whether an encoding is supported.

Test whether the given character-set name is supported by linkiir.codec.charset.convert.

**Usage**

```lua
local result = linkiir.codec.charset.supported(name)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Encoding name to test. |

**Returns**

- `boolean` — Test whether an encoding is supported.

**Errors**

Returns result, err.

Codes: `UNSUPPORTED_ENCODING`, `CONVERT_ERROR`

**Example**

```lua
local Result = linkiir.codec.charset.supported(name)
```


### `linkiir.codec.charset.aliases`

*function*

```lua
linkiir.codec.charset.aliases(name)
```

Aliases for an encoding.

Return the known aliases for a supported character-set name.

**Usage**

```lua
local result = linkiir.codec.charset.aliases(name)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Encoding name. |

**Returns**

- `array` — Aliases for an encoding.

**Errors**

Returns result, err.

Codes: `UNSUPPORTED_ENCODING`, `CONVERT_ERROR`

**Example**

```lua
local Result = linkiir.codec.charset.aliases(name)
```


---

## JSON

`linkiir.json`

JSON parse and serialize operating on plain Lua tables. Unlike linkiir.data (which returns LkNode userdata), linkiir.json works with native Lua values.

---

### `linkiir.json.parse`

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


### `linkiir.json.serialize`

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


### `linkiir.json.null`

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


---

## Security

`linkiir.sec`

Security primitives with modern, explicit parameters. Grouped into hash (digests/MAC/KDF), cipher (symmetric AES) and key (asymmetric RSA).

---

### `linkiir.sec.hash`

*function*

```lua
linkiir.sec.hash{ algorithm='sha256', data=, hex=true }
```

Compute a digest string.

Compute a one-way digest (e.g. sha256, sha1, md5) of the given data.

**Usage**

```lua
linkiir.sec.hash{ algorithm='sha256', data=, hex=true }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `algorithm` | string | No | Hash algorithm, default 'sha256' (e.g. 'sha1', 'sha256', 'sha512', 'md5'). |
| `data` | string | Yes | Data to hash. |
| `hex` | boolean | No | Return a hex-encoded string when true (default); raw bytes otherwise. |

**Returns**

- `digest string` — the computed value.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `UNSUPPORTED`

**Example**

```lua
local Digest = linkiir.sec.hash{ algorithm = 'sha256', data = Payload, hex = true }
local Mac    = linkiir.sec.hmac{ algorithm = 'sha256', key = Key, data = Payload }
```


### `linkiir.sec.hmac`

*function*

```lua
linkiir.sec.hmac{ algorithm='sha256', key=, data=, hex=true }
```

Compute a MAC string.

Compute a keyed message authentication code (HMAC) over the given data.

**Usage**

```lua
linkiir.sec.hmac{ algorithm='sha256', key=, data=, hex=true }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `algorithm` | string | No | Hash algorithm, default 'sha256'. |
| `key` | string | Yes | HMAC key. |
| `data` | string | Yes | Data to authenticate. |
| `hex` | boolean | No | Return a hex-encoded string when true (default); raw bytes otherwise. |

**Returns**

- `MAC string` — the computed value.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `UNSUPPORTED`

**Example**

```lua
local Digest = linkiir.sec.hash{ algorithm = 'sha256', data = Payload, hex = true }
local Mac    = linkiir.sec.hmac{ algorithm = 'sha256', key = Key, data = Payload }
```


### `linkiir.sec.pbkdf2`

*function*

```lua
linkiir.sec.pbkdf2{ password=, salt=, iterations=, length=, algorithm='sha256' }
```

Compute a derived key.

Derive a key from a password using PBKDF2.

**Usage**

```lua
linkiir.sec.pbkdf2{ password=, salt=, iterations=, length=, algorithm='sha256' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `password` | string | Yes | Password to derive from. |
| `salt` | string | Yes | Random salt bytes. |
| `iterations` | integer | Yes | Iteration count. |
| `length` | integer | Yes | Desired derived-key length in bytes. |
| `algorithm` | string | No | Hash algorithm, default 'sha256'. |

**Returns**

- `derived key` — the computed value.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `UNSUPPORTED`

**Example**

```lua
local Key = linkiir.sec.pbkdf2{ password = Password, salt = Salt,
                          iterations = 100000, length = 32, algorithm = 'sha256' }
```


### `linkiir.sec.cipher.encrypt`

*function*

```lua
linkiir.sec.cipher.encrypt{ key=, iv=, mode=, data= }
```

AES encryption.

Encrypt data using AES with the given key, IV, and mode.

**Usage**

```lua
local cipher, err = linkiir.sec.cipher.encrypt{ key=, iv=, mode='gcm', data=, aad= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | Key bytes. |
| `iv` | string | Yes | Initialization vector bytes. |
| `data` | string | Yes | Plaintext (encrypt) or ciphertext (decrypt). |
| `mode` | string | No | 'gcm' (default), 'cbc', 'ctr'. |
| `aad` | string | No | Additional authenticated data (AEAD modes). |

**Returns**

- cipher/plain string on success
- nil, err on failure

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `BAD_TAG`, `CIPHER_ERROR`

**Example**

```lua
local Cipher, Err = linkiir.sec.cipher.encrypt{ key = Key, iv = Iv, mode = 'gcm', data = Plain }
local Plain,  Err2 = linkiir.sec.cipher.decrypt{ key = Key, iv = Iv, mode = 'gcm', data = Cipher }
```


### `linkiir.sec.cipher.decrypt`

*function*

```lua
linkiir.sec.cipher.decrypt{ key=, iv=, mode=, data= }
```

AES decryption.

Decrypt AES-encrypted data using the given key, IV, and mode.

**Usage**

```lua
local plain, err = linkiir.sec.cipher.decrypt{ key=, iv=, mode='gcm', data=, aad= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | Key bytes. |
| `iv` | string | Yes | Initialization vector bytes. |
| `data` | string | Yes | Plaintext (encrypt) or ciphertext (decrypt). |
| `mode` | string | No | 'gcm' (default), 'cbc', 'ctr'. |
| `aad` | string | No | Additional authenticated data (AEAD modes). |

**Returns**

- cipher/plain string on success
- nil, err on failure

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `BAD_TAG`, `CIPHER_ERROR`

**Example**

```lua
local Cipher, Err = linkiir.sec.cipher.encrypt{ key = Key, iv = Iv, mode = 'gcm', data = Plain }
local Plain,  Err2 = linkiir.sec.cipher.decrypt{ key = Key, iv = Iv, mode = 'gcm', data = Cipher }
```


### `linkiir.sec.key.encrypt`

*function*

```lua
linkiir.sec.key.encrypt{ key=<pem>, data=, padding='oaep' }
```

RSA encrypt.

RSA-encrypt data with the given key.

**Usage**

```lua
linkiir.sec.key.encrypt{ key=<pem>, data=, padding='oaep' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | PEM-encoded public key. |
| `data` | string | Yes | Plaintext to encrypt. |
| `padding` | string | No | Padding scheme, default 'oaep'. |

**Returns**

- Result (see usage).

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `VERIFY_FAILED`, `CIPHER_ERROR`

**Example**

```lua
local Cipher, Err = linkiir.sec.key.encrypt{ key = PubKey, data = Payload }
if not Cipher then error(Err.message) end
```


### `linkiir.sec.key.decrypt`

*function*

```lua
linkiir.sec.key.decrypt{ key=<pem>, data=, padding='oaep' }
```

RSA decrypt.

RSA-decrypt data with the given key.

**Usage**

```lua
linkiir.sec.key.decrypt{ key=<pem>, data=, padding='oaep' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | PEM-encoded private key. |
| `data` | string | Yes | Ciphertext to decrypt. |
| `padding` | string | No | Padding scheme, default 'oaep'. |

**Returns**

- Result (see usage).

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `VERIFY_FAILED`, `CIPHER_ERROR`

**Example**

```lua
local Plain, Err = linkiir.sec.key.decrypt{ key = PrivKey, data = Cipher }
if not Plain then error(Err.message) end
```


### `linkiir.sec.key.sign`

*function*

```lua
linkiir.sec.key.sign{ key=<privPem>, data=, algorithm='sha256' }
```

RSA sign.

Sign data with an RSA private key.

**Usage**

```lua
linkiir.sec.key.sign{ key=<privPem>, data=, algorithm='sha256' } → signature
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | PEM-encoded private key. |
| `data` | string | Yes | Data to sign. |
| `algorithm` | string | No | Hash algorithm, default 'sha256'. |

**Returns**

- signature

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `VERIFY_FAILED`, `CIPHER_ERROR`

**Example**

```lua
local Sig = linkiir.sec.key.sign{ key = PrivKey, data = Payload, algorithm = 'sha256' }
local Ok  = linkiir.sec.key.verify{ key = PubKey, data = Payload, signature = Sig }
```


### `linkiir.sec.key.verify`

*function*

```lua
linkiir.sec.key.verify{ key=<pubPem>, data=, signature= }
```

RSA verify.

Verify an RSA signature against data using the public key.

**Usage**

```lua
linkiir.sec.key.verify{ key=<pubPem>, data=, signature= } → boolean
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | PEM-encoded public key. |
| `data` | string | Yes | Original data. |
| `signature` | string | Yes | Signature to verify. |

**Returns**

- boolean

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `VERIFY_FAILED`, `CIPHER_ERROR`

**Example**

```lua
local Sig = linkiir.sec.key.sign{ key = PrivKey, data = Payload, algorithm = 'sha256' }
local Ok  = linkiir.sec.key.verify{ key = PubKey, data = Payload, signature = Sig }
```


### `linkiir.sec.info`

*function*

```lua
linkiir.sec.info()
```

Available algorithms & library metadata.

Return crypto library metadata.

**Usage**

```lua
local info = linkiir.sec.info()
```

**Returns**

- `{ version=, ciphers={...}, digests={...} }`

**Errors**

Raises a Lua error on failure.

Codes: `RUNTIME_ERROR`

**Example**

```lua
local Info = linkiir.sec.info()
print(Info.version)
```


---

## Runtime & System

`linkiir.sys`

Small runtime helpers and filesystem access in one place. Time/env helpers (os.date, os.time, os.getenv) stay as native Lua.

---

### `linkiir.sys.guid`

*function*

```lua
linkiir.sys.guid()
```

Generate a random UUID.

Generate a random UUID v4.

**Usage**

```lua
local id = linkiir.sys.guid()
```

**Returns**

- GUID string.

**Errors**

Raises a Lua error on failure.

Codes: `RUNTIME_ERROR`

**Example**

```lua
local Id = linkiir.sys.guid()
```


### `linkiir.sys.sleep`

*function*

```lua
linkiir.sys.sleep(ms)
```

Pause the current run.

Pause the current run for the given number of milliseconds.

**Usage**

```lua
linkiir.sys.sleep(ms)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `ms` | integer | Yes | Milliseconds to sleep. |

**Returns**

- none

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`

**Example**

```lua
linkiir.sys.sleep(250)
```


### `linkiir.sys.fs.stat`

*function*

```lua
linkiir.sys.fs.stat(path)
```

Filesystem: stat.

Return metadata (size, mtime, type, mode) for a file or directory.

**Usage**

```lua
linkiir.sys.fs.stat(path)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Filesystem path. |

**Returns**

- `{ size=, mtime=, type=, mode= }, err`

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
for _, p in ipairs(linkiir.sys.fs.list{ path = '/inbound', pattern = '*.hl7' }) do
   local st = linkiir.sys.fs.stat(p)
   print(p, st.size)
end
```


### `linkiir.sys.fs.list`

*function*

```lua
linkiir.sys.fs.list{ path=, pattern='*.hl7' }
```

Filesystem: list.

List files in a directory matching a glob pattern.

**Usage**

```lua
linkiir.sys.fs.list{ path=, pattern='*.hl7' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Directory to list. |
| `pattern` | string | No | Glob pattern, default '*.hl7'. |

**Returns**

- array, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
for _, p in ipairs(linkiir.sys.fs.list{ path = '/inbound', pattern = '*.hl7' }) do
   local st = linkiir.sys.fs.stat(p)
   print(p, st.size)
end
```


### `linkiir.sys.fs.mkdir`

*function*

```lua
linkiir.sys.fs.mkdir(path)
```

Filesystem: mkdir.

Create a directory.

**Usage**

```lua
linkiir.sys.fs.mkdir(path)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Directory path to create. |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.mkdir('/inbound/archive')
if not Ok then error(Err.message) end
```


### `linkiir.sys.fs.rmdir`

*function*

```lua
linkiir.sys.fs.rmdir(path)
```

Filesystem: rmdir.

Remove an empty directory.

**Usage**

```lua
linkiir.sys.fs.rmdir(path)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Directory path to remove (must be empty). |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.rmdir('/inbound/archive')
if not Ok then error(Err.message) end
```


### `linkiir.sys.fs.remove`

*function*

```lua
linkiir.sys.fs.remove(path)
```

Filesystem: remove.

Delete a file.

**Usage**

```lua
linkiir.sys.fs.remove(path)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | File path to delete. |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.remove('/inbound/old.hl7')
if not Ok then error(Err.message) end
```


### `linkiir.sys.fs.access`

*function*

```lua
linkiir.sys.fs.access{ path=, mode='r' }
```

Filesystem: access.

Test whether a file is accessible with the given mode ('r', 'w', 'x').

**Usage**

```lua
linkiir.sys.fs.access{ path=, mode='r' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Filesystem path to test. |
| `mode` | string | No | Access mode to test: 'r', 'w', or 'x'. Default 'r'. |

**Returns**

- boolean

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Readable = linkiir.sys.fs.access{ path = '/inbound/demo.hl7', mode = 'r' }
```


### `linkiir.sys.fs.chmod`

*function*

```lua
linkiir.sys.fs.chmod{ path=, mode=0755 }
```

Filesystem: chmod.

Change a file's permission bits.

**Usage**

```lua
linkiir.sys.fs.chmod{ path=, mode=0755 }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Filesystem path. |
| `mode` | integer | No | Permission bits (octal), default 0755. |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.chmod{ path = '/inbound/demo.hl7', mode = 0755 }
if not Ok then error(Err.message) end
```


### `linkiir.sys.fs.chown`

*function*

```lua
linkiir.sys.fs.chown{ path=, owner=, group= }
```

Filesystem: chown.

Change a file's owner and group.

**Usage**

```lua
linkiir.sys.fs.chown{ path=, owner=, group= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Filesystem path. |
| `owner` | string | Yes | New owner. |
| `group` | string | Yes | New group. |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.chown{ path = '/inbound/demo.hl7', owner = 'linkiir', group = 'linkiir' }
if not Ok then error(Err.message) end
```


### `linkiir.sys.fs.touch`

*function*

```lua
linkiir.sys.fs.touch{ path=, time= }
```

Filesystem: touch.

Create a file if missing, or update its modification time.

**Usage**

```lua
linkiir.sys.fs.touch{ path=, time= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Filesystem path. |
| `time` | integer | No | Modification time (unix epoch); defaults to now. |

**Returns**

- ok, err

**Errors**

Returns result, err.

Codes: `NOT_FOUND`, `PERMISSION_DENIED`, `IO_ERROR`

**Example**

```lua
local Ok, Err = linkiir.sys.fs.touch{ path = '/inbound/.keep' }
if not Ok then error(Err.message) end
```


---

## Lua Table Library

`table`

Standard Lua 5.1 table library for building and manipulating array-style tables (insert/remove/sort/concat). Node trees returned by linkiir.data are their own object type, not plain tables — use the Node:* methods for those.

---

### `table.insert`

*function*

```lua
table.insert(t, [pos,] value)
```

Insert an element into a table.

Inserts value at position pos in table t, shifting up subsequent elements. pos defaults to #t + 1 (append to the end).

**Usage**

```lua
table.insert(t, pos, value)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table to modify. |
| `pos` | integer | No | 1-based insert position. Default #t + 1. |
| `value` | any | Yes | Value to insert. |

**Returns**

- none (mutates t)

**Example**

```lua
local Items = { 'a', 'b' }
table.insert(Items, 'c')      -- { 'a', 'b', 'c' }
table.insert(Items, 1, 'z')   -- { 'z', 'a', 'b', 'c' }
```


### `table.remove`

*function*

```lua
table.remove(t [, pos])
```

Remove an element from a table.

Removes from table t the element at position pos, shifting down subsequent elements, and returns the removed value. pos defaults to #t (remove the last element).

**Usage**

```lua
table.remove(t, pos)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table to modify. |
| `pos` | integer | No | 1-based position to remove. Default #t. |

**Returns**

- the removed value

**Example**

```lua
local Items = { 'a', 'b', 'c' }
local Last = table.remove(Items)     -- "c";  Items = { 'a', 'b' }
local First = table.remove(Items, 1) -- "a";  Items = { 'b' }
```


### `table.concat`

*function*

```lua
table.concat(t [, sep [, i [, j]]])
```

Join array elements into a string.

Returns t[i] .. sep .. t[i+1] .. sep .. ... .. t[j]. sep defaults to the empty string; i defaults to 1; j defaults to #t.

**Usage**

```lua
table.concat(t, sep, i, j)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table (array) of strings/numbers. |
| `sep` | string | No | Separator. Default "". |
| `i` | integer | No | Start index. Default 1. |
| `j` | integer | No | End index. Default #t. |

**Returns**

- string

**Example**

```lua
local Ids = { '1', '2', '3' }
print(table.concat(Ids, ','))  -- "1,2,3"
```


### `table.sort`

*function*

```lua
table.sort(t [, comp])
```

Sort a table's array part in place.

Sorts the elements of table t (the array part) in place, from t[1] to t[#t]. comp is an optional less-than comparator function; the default is the standard `\<` operator.

**Usage**

```lua
table.sort(t, comp)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table (array) to sort. |
| `comp` | function | No | Comparator: function(a, b) returning true when a should come before b. |

**Returns**

- none (mutates t)

**Example**

```lua
local Nums = { 3, 1, 2 }
table.sort(Nums)
print(table.concat(Nums, ','))  -- "1,2,3"

table.sort(Nums, function(a, b) return a > b end)  -- descending
```


### `table.maxn`

*function*

```lua
table.maxn(t)
```

Largest positive numeric key in a table.

Returns the largest positive numerical index of table t, or 0 if t has no positive numerical indices. Useful for arrays with holes, where #t is undefined.

**Usage**

```lua
table.maxn(t)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table to inspect. |

**Returns**

- integer

**Example**

```lua
local Sparse = { [1] = 'a', [5] = 'b' }
print(table.maxn(Sparse))  -- 5
```


---

## Lua Math Library

`math`

Standard Lua 5.1 math library.

---

### `math.pi`

*field*

```lua
math.pi
```

The value of pi.

**Usage**

```lua
math.pi
```

**Returns**

- number

**Example**

```lua
print(math.pi)  -- 3.1415926535898
```


### `math.huge`

*field*

```lua
math.huge
```

A value larger than any other numeric value.

A value larger than or equal to any other numeric value (floating-point infinity).

**Usage**

```lua
math.huge
```

**Returns**

- number

**Example**

```lua
print(math.huge)  -- inf
```


### `math.abs`

*function*

```lua
math.abs(x)
```

Absolute value.

Returns the absolute value of x.

**Usage**

```lua
math.abs(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.abs(-5))  -- 5
```


### `math.ceil`

*function*

```lua
math.ceil(x)
```

Round up to an integer.

Returns the smallest integer larger than or equal to x.

**Usage**

```lua
math.ceil(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- integer

**Example**

```lua
print(math.ceil(4.1))  -- 5
```


### `math.floor`

*function*

```lua
math.floor(x)
```

Round down to an integer.

Returns the largest integer smaller than or equal to x.

**Usage**

```lua
math.floor(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- integer

**Example**

```lua
print(math.floor(4.9))  -- 4
```


### `math.sqrt`

*function*

```lua
math.sqrt(x)
```

Square root.

Returns the square root of x.

**Usage**

```lua
math.sqrt(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.sqrt(16))  -- 4
```


### `math.pow`

*function*

```lua
math.pow(x, y)
```

Exponentiation.

Returns x raised to the power y. Equivalent to the `x^y` operator.

**Usage**

```lua
math.pow(x, y)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Base. |
| `y` | number | Yes | Exponent. |

**Returns**

- number

**Example**

```lua
print(math.pow(2, 10))  -- 1024
```


### `math.exp`

*function*

```lua
math.exp(x)
```

e raised to a power.

Returns the value e^x.

**Usage**

```lua
math.exp(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Exponent. |

**Returns**

- number

**Example**

```lua
print(math.exp(1))  -- 2.718281828459
```


### `math.log`

*function*

```lua
math.log(x)
```

Natural logarithm.

Returns the natural logarithm of x.

**Usage**

```lua
math.log(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.log(math.exp(1)))  -- 1
```


### `math.log10`

*function*

```lua
math.log10(x)
```

Base-10 logarithm.

Returns the base-10 logarithm of x.

**Usage**

```lua
math.log10(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.log10(100))  -- 2
```


### `math.fmod`

*function*

```lua
math.fmod(x, y)
```

Remainder of x/y.

Returns the remainder of the division of x by y that rounds the quotient towards zero.

**Usage**

```lua
math.fmod(x, y)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Dividend. |
| `y` | number | Yes | Divisor. |

**Returns**

- number

**Example**

```lua
print(math.fmod(7, 3))   -- 1
print(math.fmod(-7, 3))  -- -1
```


### `math.modf`

*function*

```lua
math.modf(x)
```

Split a number into integral and fractional parts.

Returns the integral part of x and the fractional part of x; both have the same sign as x.

**Usage**

```lua
local ip, fp = math.modf(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- integralPart, fractionalPart

**Example**

```lua
local Ip, Fp = math.modf(3.75)
print(Ip, Fp)  -- 3  0.75
```


### `math.max`

*function*

```lua
math.max(x, ...)
```

Largest of the given numbers.

Returns the argument with the maximum value, among a list of one or more numbers.

**Usage**

```lua
math.max(x, ...)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | number | Yes | One or more numbers. |

**Returns**

- number

**Example**

```lua
print(math.max(3, 7, 2))  -- 7
```


### `math.min`

*function*

```lua
math.min(x, ...)
```

Smallest of the given numbers.

Returns the argument with the minimum value, among a list of one or more numbers.

**Usage**

```lua
math.min(x, ...)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | number | Yes | One or more numbers. |

**Returns**

- number

**Example**

```lua
print(math.min(3, 7, 2))  -- 2
```


### `math.random`

*function*

```lua
math.random([m [, n]])
```

Pseudo-random number.

With no arguments, returns a float in [0, 1). With one integer argument m, returns an integer in [1, m]. With two integer arguments m, n, returns an integer in [m, n].

**Usage**

```lua
math.random(m, n)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `m` | integer | No | Lower bound (or upper bound when n is omitted). |
| `n` | integer | No | Upper bound. |

**Returns**

- number

**Example**

```lua
print(math.random())        -- e.g. 0.6046602879796
print(math.random(6))       -- integer in [1, 6]
print(math.random(10, 20))  -- integer in [10, 20]
```


### `math.randomseed`

*function*

```lua
math.randomseed(x)
```

Seed the pseudo-random generator.

Sets x as the seed for the pseudo-random generator used by math.random.

**Usage**

```lua
math.randomseed(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Seed value. |

**Returns**

- none

**Example**

```lua
math.randomseed(os.time())
```


### `math.sin`

*function*

```lua
math.sin(x)
```

Sine.

Returns the sine of x (radians).

**Usage**

```lua
math.sin(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Angle in radians. |

**Returns**

- number

**Example**

```lua
print(math.sin(0))  -- 0
```


### `math.cos`

*function*

```lua
math.cos(x)
```

Cosine.

Returns the cosine of x (radians).

**Usage**

```lua
math.cos(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Angle in radians. |

**Returns**

- number

**Example**

```lua
print(math.cos(0))  -- 1
```


### `math.tan`

*function*

```lua
math.tan(x)
```

Tangent.

Returns the tangent of x (radians).

**Usage**

```lua
math.tan(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Angle in radians. |

**Returns**

- number

**Example**

```lua
print(math.tan(0))  -- 0
```


### `math.asin`

*function*

```lua
math.asin(x)
```

Arc sine.

Returns the arc sine of x (in radians).

**Usage**

```lua
math.asin(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.asin(1))  -- 1.5707963267949
```


### `math.acos`

*function*

```lua
math.acos(x)
```

Arc cosine.

Returns the arc cosine of x (in radians).

**Usage**

```lua
math.acos(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.acos(1))  -- 0
```


### `math.atan`

*function*

```lua
math.atan(x)
```

Arc tangent.

Returns the arc tangent of x (in radians).

**Usage**

```lua
math.atan(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.atan(1))  -- 0.78539816339745
```


### `math.atan2`

*function*

```lua
math.atan2(y, x)
```

Arc tangent of y/x.

Returns the arc tangent of y/x (in radians), using the signs of both arguments to determine the quadrant.

**Usage**

```lua
math.atan2(y, x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `y` | number | Yes | Numerator. |
| `x` | number | Yes | Denominator. |

**Returns**

- number

**Example**

```lua
print(math.atan2(1, 1))  -- 0.78539816339745
```


### `math.deg`

*function*

```lua
math.deg(x)
```

Radians to degrees.

Converts angle x from radians to degrees.

**Usage**

```lua
math.deg(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Angle in radians. |

**Returns**

- number

**Example**

```lua
print(math.deg(math.pi))  -- 180
```


### `math.rad`

*function*

```lua
math.rad(x)
```

Degrees to radians.

Converts angle x from degrees to radians.

**Usage**

```lua
math.rad(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Angle in degrees. |

**Returns**

- number

**Example**

```lua
print(math.rad(180))  -- 3.1415926535898
```


---

## Lua OS Library (time/env)

`os`

Time and environment functions from the standard Lua 5.1 os library. File and process functions (os.execute, os.remove, os.rename, os.tmpname, os.exit) are intentionally not used in Linkiir scripts — use linkiir.sys.fs for local filesystem work and linkiir.link.file for remote transfer instead.

---

### `os.time`

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


### `os.date`

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


### `os.clock`

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


### `os.difftime`

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


### `os.getenv`

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


---

## Lua String Library

`string`

Standard Lua 5.1 string library. Available as both `string.fn(s, ...)` and object-style `s:fn(...)`, since every string has a metatable pointing back to this table. Pattern-matching functions (find, match, gmatch, gsub) use Lua patterns, not full regular expressions.

---

### `string.byte`

*function*

```lua
string.byte(s [, i [, j]])
```

Numeric byte codes of characters s[i..j].

Returns the internal numeric codes of the characters s[i], s[i+1], ..., s[j]. The default for i is 1; the default for j is i.

**Usage**

```lua
string.byte(s, i, j)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `i` | integer | No | Start index (1-based, negative counts from the end). Default 1. |
| `j` | integer | No | End index. Default i. |

**Returns**

- one integer per byte in range i..j

**Example**

```lua
print(string.byte('A'))        -- 65
print(('ABC'):byte(1, 3))      -- 65 66 67
```


### `string.char`

*function*

```lua
string.char(...)
```

Build a string from numeric byte codes.

Receives zero or more integers and returns a string with a character for each code.

**Usage**

```lua
string.char(...)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | integer | No | Byte codes (variadic). |

**Returns**

- string

**Example**

```lua
print(string.char(65, 66, 67))  -- "ABC"
```


### `string.find`

*function*

```lua
string.find(s, pattern [, init [, plain]])
```

Find the first match of a pattern in a string.

Looks for the first match of pattern in s, starting search at position init. Returns the start and end indices of the match, plus any captures. Returns nil if no match. If plain is true, pattern is matched as a literal substring (no Lua pattern special characters).

**Usage**

```lua
string.find(s, pattern, init, plain)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `pattern` | string | Yes | Lua pattern (or literal text when plain=true). |
| `init` | integer | No | 1-based start index (negative counts from the end). Default 1. |
| `plain` | boolean | No | When true, disables pattern matching and does a plain substring search. |

**Returns**

- start, end [, captures...] on match; nil on no match

**Example**

```lua
local S, E = string.find('hello world', 'wor')
print(S, E)  -- 7  9

local S2, E2, Cap = string.find('MRN:12345', '(%d+)')
print(Cap)   -- "12345"
```


### `string.format`

*function*

```lua
string.format(formatstring, ...)
```

printf-style string formatting.

Returns a formatted version of its variable number of arguments following the description given in formatstring, which follows the rules of the C `printf`.

**Usage**

```lua
string.format(formatstring, ...)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `formatstring` | string | Yes | printf-style format string (%d, %s, %f, %x, %q, ...). |
| `...` | any | No | Values to format (variadic). |

**Returns**

- string

**Example**

```lua
print(string.format('%s = %05d', 'count', 42))  -- "count = 00042"
```


### `string.gmatch`

*function*

```lua
string.gmatch(s, pattern)
```

Iterator over all pattern matches.

Returns an iterator function that, each time it is called, returns the next captures from pattern over string s. If pattern has no captures, the whole match is returned each time.

**Usage**

```lua
for cap1, cap2 in string.gmatch(s, pattern) do ... end
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `pattern` | string | Yes | Lua pattern. |

**Returns**

- iterator function, for use in a generic for loop

**Example**

```lua
for word in string.gmatch('one two three', '%a+') do
   print(word)
end
-- one
-- two
-- three
```


### `string.gsub`

*function*

```lua
string.gsub(s, pattern, repl [, n])
```

Global substitution by pattern.

Returns a copy of s in which all (or, if n is given, at most n) occurrences of pattern have been replaced by repl. repl may be a string (with %1..%9 capture references and %0 for the whole match), a table (indexed by the first capture), or a function (called with the captures; its result replaces the match, or the match is kept unchanged if it returns nil/false).

**Usage**

```lua
string.gsub(s, pattern, repl, n)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `pattern` | string | Yes | Lua pattern. |
| `repl` | string\|table\|function | Yes | Replacement string, capture-indexed table, or replacement function. |
| `n` | integer | No | Maximum number of substitutions; default is unlimited. |

**Returns**

- `string` — the resulting string.
- `count` — number of substitutions made.

**Example**

```lua
local Out, N = string.gsub('hello world', 'o', '0')
print(Out, N)  -- "hell0 w0rld"  2

local Wire = ('ADT^A01|20260101'):gsub('%^', '-')
print(Wire)    -- "ADT-A01|20260101"

local Redacted = string.gsub('SSN: 123-45-6789', '%d', '#')
print(Redacted)  -- "SSN: ###-##-####"
```


### `string.len`

*function*

```lua
string.len(s)
```

Length of a string (= #s).

Receives a string and returns its length. Equivalent to the `#` operator on a string.

**Usage**

```lua
string.len(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |

**Returns**

- integer

**Example**

```lua
print(string.len('hello'))  -- 5
print(#'hello')             -- 5
```


### `string.lower`

*function*

```lua
string.lower(s)
```

Lowercase copy of a string.

Receives a string and returns a copy of it with all uppercase letters changed to lowercase; other characters are unchanged.

**Usage**

```lua
string.lower(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |

**Returns**

- string

**Example**

```lua
print(string.lower('HELLO'))  -- "hello"
```


### `string.match`

*function*

```lua
string.match(s, pattern [, init])
```

Return the first match's captures (or the whole match).

Looks for the first match of pattern in s, starting at position init, and returns the captures from the pattern, or the whole match if the pattern specifies no captures. Returns nil on no match.

**Usage**

```lua
string.match(s, pattern, init)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `pattern` | string | Yes | Lua pattern. |
| `init` | integer | No | 1-based start index (negative counts from the end). Default 1. |

**Returns**

- captures... (or the whole match); nil on no match

**Example**

```lua
local Mrn = string.match('MRN:12345', 'MRN:(%d+)')
print(Mrn)  -- "12345"
```


### `string.rep`

*function*

```lua
string.rep(s, n [, sep])
```

Repeat a string n times.

Returns a string that is the concatenation of n copies of s, optionally separated by sep between each pair.

**Usage**

```lua
string.rep(s, n, sep)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | String to repeat. |
| `n` | integer | Yes | Number of copies. |
| `sep` | string | No | Separator inserted between copies. |

**Returns**

- string

**Example**

```lua
print(string.rep('ab', 3))       -- "ababab"
print(string.rep('ab', 3, '-'))  -- "ab-ab-ab"
```


### `string.reverse`

*function*

```lua
string.reverse(s)
```

Reverse a string.

Returns a string that is the string s reversed.

**Usage**

```lua
string.reverse(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |

**Returns**

- string

**Example**

```lua
print(string.reverse('hello'))  -- "olleh"
```


### `string.sub`

*function*

```lua
string.sub(s, i [, j])
```

Substring s[i..j].

Returns the substring of s that starts at i and continues until j; i and j can be negative, counting from the end of the string. The default for j is -1 (the end of the string).

**Usage**

```lua
string.sub(s, i, j)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `i` | integer | Yes | Start index (1-based, negative counts from the end). |
| `j` | integer | No | End index. Default -1 (end of string). |

**Returns**

- string

**Example**

```lua
print(string.sub('hello world', 1, 5))  -- "hello"
print(string.sub('hello world', -5))    -- "world"
```


### `string.upper`

*function*

```lua
string.upper(s)
```

Uppercase copy of a string.

Receives a string and returns a copy of it with all lowercase letters changed to uppercase; other characters are unchanged.

**Usage**

```lua
string.upper(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |

**Returns**

- string

**Example**

```lua
print(string.upper('hello'))  -- "HELLO"
```


---

## Not available

Do not write scripts against these.

| Call | Instead |
| --- | --- |
| `linkiir.flow.ack` | Use Source LLP **Acknowledgment Mode**, with a custom ACK script if needed |

---

## Legacy compatibility names

Names such as `hl7.parse`, `json.parse`, `queue.push`, `net.http.get`, and `db.connect` are **not** part of the Linkiir API. They come from a compatibility adapter, and exist only after:

```lua
require "legacy_adapter"
```

The adapter is a Lua file that ships with a migrated project, in the node's directory or the project's `common` directory. Without that `require`, only the `linkiir.*` API exists.

| Legacy name | Linkiir equivalent |
| --- | --- |
| `hl7.parse{ vmd =, data = }` | `linkiir.data.extract{ schema =, data =, type = 'hl7' }` |
| `hl7.message{ vmd =, name = }` | `linkiir.data.create{ schema =, name =, type = 'hl7' }` |
| `x12.parse` / `xml.parse` | `linkiir.data.extract{ ..., type = 'x12' \| 'xml' }` |
| `json.parse` | `linkiir.json.parse` |
| `json.serialize{ data = }` | `linkiir.json.serialize` |
| `queue.push` | `linkiir.flow.push` |
| `net.http.get` / `post` / … | `linkiir.link.web.get` / `post` / … |
| `net.http.parseRequest` | `linkiir.link.web.request` |
| `net.http.respond` | `linkiir.link.web.respond` |
| `net.smtp.send` | `linkiir.link.mail.send` |
| `db.connect` | `linkiir.store.open` |
| `filter.base64.enc` / `dec` | `linkiir.codec.base64.encode` / `decode` |
| `util.guid` | `linkiir.sys.guid` |

Node methods also answer to their legacy names, so migrated mapping code keeps working unchanged:

| Legacy method | Native |
| --- | --- |
| `Node:nodeValue()` | `Node:value()` |
| `Node:setNodeValue(v)` | `Node:set(v)` |
| `Node:nodeName()` | `Node:name()` |
| `Node:S()` / `Node:serialize()` | `Node:text()` |
| `Node:mapTree(src)` | `Node:map(src)` |
| `Node:childCount()` | `Node:count()` |
| `Node:nodeType()` | `Node:type()` |

Write new scripts against the native API. Use the adapter to get existing scripts running, then migrate them as you touch each one — see [Migrating Existing Interfaces](../administration/configurations/migration.md).

---

## Next

- [Testing and Debugging Lua](../interface-development/lua-programming/testing-debugging.md)
- [Sample Code](../interface-development/sample-code/index.md)
- [Error Handling and Retry](../interface-development/error-handling.md)
