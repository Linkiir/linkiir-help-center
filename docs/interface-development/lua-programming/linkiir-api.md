---
title: Linkiir Scripting API
---

# Linkiir Scripting API

Reference for the calls available in a Linkiir node script.

```lua
local linkiir = require("linkiir")
```

`linkiir` is also available as a global without the `require`, but writing the `require` makes the dependency explicit and is the better habit.

Most functions take a single table argument, so arguments are named at the call site:

```lua
linkiir.link.web.get{ url = "https://example.com", timeout = 15 }
```

:::tip Use the editor as the authoritative reference
The script editor's IntelliSense and hover documentation reflect the API in your installed release. When this page and your editor disagree, the editor is right.
:::

## The sub-modules

| Sub-module | Use it for |
| --- | --- |
| [`linkiir.flow`](#linkiirflow--send-to-the-next-node) | Send a message to the next node |
| [`linkiir.data`](#linkiirdata--hl7-v2-x12-and-xml) | Parse and build HL7 v2, X12, and XML |
| [`linkiir.json`](#linkiirjson--json) | Parse and build JSON |
| [`linkiir.link`](#linkiirlinkweb--http) | HTTP, email, sockets, file transfer |
| [`linkiir.codec`](#linkiircodec--encoding-and-compression) | Base64, hex, URI, compression, character sets |
| [`linkiir.sec`](#linkiirsec--hashing-and-cryptography) | Hashing, HMAC, key derivation, ciphers, keys |
| [`linkiir.sys`](#linkiirsys--identifiers-timing-and-files) | Identifiers, timing, filesystem |
| [`linkiir.store`](#linkiirstore--databases) | Database connections and queries |

---

## The entry point

```lua
local linkiir = require("linkiir")

function main(Data)
   linkiir.flow.push{ data = Data }
end
```

`main` must be a **global** function named exactly `main` — Linkiir looks it up by name. A script that does not define it fails to start with `script does not define main()`.

| Node type | `main` receives |
| --- | --- |
| Source HTTP | The complete raw HTTP request text |
| Source LLP, with a custom ACK | The inbound HL7 v2 message |
| Transform Custom | The message produced by the upstream node |
| Source Custom | Nothing — `main()` is called with no argument |

The argument is passed positionally, so the parameter name is yours to choose. `Data` is the convention.

Whatever string `main` returns becomes the node's output. For an HTTP node this is a fallback response body when you never call `respond`; elsewhere you normally push instead of returning.

---

## Two error conventions

Which one applies depends on what the function does. Mixing them up is the most common source of confusing script failures.

| Kind of function | On failure | How you handle it |
| --- | --- | --- |
| Transforms — `linkiir.data`, `linkiir.json`, `linkiir.codec`, `linkiir.sec` | Raises a Lua error | Let it stop the script, or wrap in `pcall` |
| I/O — `linkiir.link`, `linkiir.store` | Returns `nil` plus an error table | Check the first return value |

```lua
-- I/O: check the result
local resp, err = linkiir.link.web.get{ url = Url }
if not resp then
   error("fetch failed: " .. err.message)
end

-- Transform: raises on bad input
local Msg = linkiir.data.extract{ schema = "adt.json", data = Data, type = "hl7" }
```

The error table always has `code` and `message`. `code` is a stable string you can branch on; `message` is for humans.

`linkiir.flow.push` raises rather than returning an error, because a message you cannot hand onward should stop the script rather than be quietly dropped.

---

## `linkiir.flow` — send to the next node

### `linkiir.flow.push`

```lua
linkiir.flow.push{ data = <string> [, key = <string>] [, topic = <string>] [, live = <boolean>] }
   → messageId

linkiir.flow.push(<string>)   -- positional shorthand
```

| Parameter | Notes |
| --- | --- |
| `data` | Required. The message payload. |
| `key` | Optional correlation or routing key. Generated when omitted. |
| `topic` | Optional explicit target. Omit it — the workflow connection resolves the destination. |
| `live` | Defaults to `true`. `false` validates without sending. |

Returns a message ID. **Raises** on failure, so a delivery problem stops the script rather than passing silently.

```lua
local id = linkiir.flow.push{ data = Out:text(), key = PatientId }
```

Destination comes from the workflow you drew, not from the script. Re-wiring a workflow needs no script change.

| Behaviour | Detail |
| --- | --- |
| Blocks until accepted | Provides natural back-pressure; a slow queue slows the script rather than building an unbounded backlog |
| Non-live in Run Test and Debug | Returns the placeholder ID `0-0-0` and sends nothing |
| Multiple calls allowed | Push several messages from one inbound message; each is delivered separately |
| No downstream node | The message is retained and delivered when you connect one |

### `linkiir.flow.topic`

```lua
linkiir.flow.topic()   → string or nil
```

Returns the output destination currently resolved for this node. Occasionally useful when debugging a wiring problem. You do not need it in normal scripts.

### `linkiir.flow.configure`

```lua
linkiir.flow.configure{ bootstrap =, project =, workflow =, node =, topic = }
```

Sets the flow context explicitly. Linkiir sets this for you when it runs a node — you should not need to call it. It exists for scripts run outside a node.

---

## `linkiir.data` — HL7 v2, X12, and XML

Parses and builds structured messages as a navigable tree. These functions **raise** on invalid input.

:::note JSON is a separate module
`linkiir.data` handles HL7 v2, X12, and XML. For JSON use [`linkiir.json`](#linkiirjson--json) — passing `type = "json"` to `linkiir.data.extract` is an error and tells you so.
:::

### `linkiir.data.extract`

```lua
linkiir.data.extract{ schema = <string>, data = <string> [, type = <string>] }
   → node, messageType
```

Parses a message into a navigable tree. `type` is `"hl7"`, `"x12"`, or `"xml"`, and defaults to the schema's protocol.

```lua
local Msg, MsgType = linkiir.data.extract{ schema = "adt.json", data = Data, type = "hl7" }
```

Schema files live in the node's own directory, so a bare filename resolves without a path.

For XML, **omit `schema`** — XML is parsed schema-free, and supplying a schema is an error:

```lua
local Doc = linkiir.data.extract{ data = Data, type = "xml" }
```

### `linkiir.data.create`

```lua
linkiir.data.create{ schema = <string>, name = <string> [, type = <string>] }
   → node
```

Builds an empty message of the named type, with schema fields pre-allocated. For XML, omit `schema` and supply `name` — you get a bare root element.

### `linkiir.data.serialize`

```lua
linkiir.data.serialize{ data = <node> }   → string
linkiir.data.serialize(<node>)            → string
```

Serializes a tree back to wire text. `Node:text()` does the same thing.

### Node methods

| Method | Returns | Purpose |
| --- | --- | --- |
| `Node:value()` | string | The scalar value |
| `Node:set(v)` | self | Set the value; chainable |
| `Node:name()` | string | Node or segment name |
| `Node:text()` | string | Serialize this subtree |
| `Node:map(src)` | self | Copy matching values from another tree |
| `Node:child(k)` | node or nil | Child by name or index |
| `Node:count()` | integer | Number of children |
| `Node:isNull()` | boolean | No data present |
| `Node:isLeaf()` | boolean | Scalar, no children |
| `Node:type()` | integer | The node's structural kind |
| `Node:protocol()` | integer | The tree's protocol |

### Navigating a tree

| Expression | Meaning |
| --- | --- |
| `Msg.PID` | Child by name |
| `Msg[3]` | Child by index |
| `Msg.PID[5] = "value"` | Set a child value |
| `#Msg` | Child count |
| `tostring(Msg)` | Serialize |

HL7 v2 nests segment → field → repeat → component → sub-component:

```lua
local familyName = Msg.PID[5][1][1][1]:value()
```

X12 nests interchange → group → transaction set → loop → segment → element:

```lua
local name = Msg.IE.FG[1].TS[1]["1000A"].NM1[3][1]:value()
```

:::note Assigning to a node that does not exist
For HL7 and X12, assignment only works where the schema allocated the node — assigning to a missing one raises an error. XML trees are schema-free, so assigning to a new name creates it. This is why an HL7 mapping starts from `linkiir.data.create`, which pre-allocates the structure.
:::

### Copying a message and changing one field

```lua
local linkiir = require("linkiir")

function main(Data)
   local MsgIn, MsgType = linkiir.data.extract{ schema = "adt.json", data = Data, type = "hl7" }

   if MsgType ~= "ADT" then
      return   -- not our message type; produce nothing
   end

   local MsgOut = linkiir.data.create{ schema = "adt.json", name = MsgType, type = "hl7" }
   MsgOut:map(MsgIn)

   local family = MsgIn.PID[5][1][1][1]:value()
   MsgOut.PID[5][1][1][1] = string.upper(family or "")

   linkiir.flow.push{ data = MsgOut:text() }
end
```

`map` copies everything that matches, so you only write the fields you are actually changing.

---

## `linkiir.json` — JSON

```lua
linkiir.json.parse(<string>)      → Lua value
linkiir.json.serialize(<value>)   → string
linkiir.json.null                 -- sentinel for JSON null
```

Raises on invalid input.

Unlike `linkiir.data`, this returns ordinary Lua tables, so you navigate with normal Lua syntax and `#` for array length:

```lua
local linkiir = require("linkiir")

function main(Data)
   local body = linkiir.json.parse(Data)

   for i = 1, #body.orders do
      local order = body.orders[i]
      linkiir.flow.push{ data = linkiir.json.serialize(order) }
   end
end
```

`linkiir.json.null` distinguishes a JSON `null` from an absent key, which plain `nil` cannot. Compare against it when the difference matters:

```lua
if body.discharged == linkiir.json.null then
   -- present, explicitly null
elseif body.discharged == nil then
   -- absent
end
```

---

## `linkiir.link.web` — HTTP

I/O functions: they return `result, err` rather than raising.

### Outbound requests

```lua
linkiir.link.web.get{ url =, params =, headers =, timeout =, verifyTls =, live = }
linkiir.link.web.post{ url =, body =, headers =, params =, auth =, timeout =, verifyTls =, live = }
-- also: put, patch, delete, head, options
   → resp, err
```

| Parameter | Notes |
| --- | --- |
| `url` | Required. Absolute URL. |
| `params` | Query parameters appended to the URL. |
| `headers` | Header name → value. |
| `body` | Request body, for POST/PUT/PATCH. |
| `auth` | `{ type = 'basic' \| 'bearer', user =, password =, token = }` |
| `timeout` | Seconds. Default `30`. |
| `verifyTls` | Default `true`. Leave it on. |
| `live` | Default `true`. `false` simulates without network I/O, returning `{ code = 0, body = "", headers = {}, simulated = true }`. |

On success `resp` is `{ code, body, headers }`. On failure `err.code` is one of `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `UNSUPPORTED`.

```lua
local resp, err = linkiir.link.web.post{
   url = "https://api.example.com/orders",
   body = linkiir.data.serialize{ data = Out },
   headers = { ["Content-Type"] = "application/json" },
   auth = { type = "bearer", token = Token },
}
if not resp then error(err.message) end
if resp.code >= 400 then error("receiver returned " .. resp.code) end
```

Check both: `resp` being present means the request completed, not that the receiver accepted it.

### Parsing an inbound request

```lua
linkiir.link.web.request{ data = <raw HTTP request text> }   → req, err
```

| Field | Contains |
| --- | --- |
| `method` | `GET`, `POST`, and so on |
| `path` | Request path, without the query string |
| `rawQuery` | Raw query string |
| `version` | For example `HTTP/1.1` |
| `headers` | Header name → value |
| `query` | Decoded query parameters |
| `form` | Decoded form fields, for form-encoded bodies |
| `params` | `query` and `form` merged, `form` winning |
| `cookies` | Decoded cookies |
| `body` | Raw request body |

### Sending a response

```lua
linkiir.link.web.respond{ code = 200, body =, headers =, contentType = }
```

`Content-Length` is added for you. Used in a Source HTTP node, this sends the response to the caller.

If you never call it, whatever string `main` returns becomes a `200` response body. Calling it explicitly is clearer and lets you set the status code.

---

## `linkiir.link.mail` — email

```lua
linkiir.link.mail.send{ server =, from =, to =, header =, body =
                        [, username =, password =, timeout =, use_ssl =, verifyTls =, live = ] }
   → true, err
```

| Parameter | Notes |
| --- | --- |
| `server` | Required. SMTP URL such as `smtp://host:587`, or a hostname. |
| `from` | Required. Envelope sender. |
| `to` | Required. Array of recipient addresses. |
| `header` | Singular. Headers as key/value pairs: `Subject`, `From`, `To`, `Date`. |
| `body` | Message body text. |
| `username`, `password` | SMTP authentication. |
| `timeout` | Seconds. Default `15`. |
| `use_ssl` | `"yes"` to require TLS, `"try"` for STARTTLS if offered, `""` for none. |
| `verifyTls` | Default `true`. |

Error codes: `INVALID_SERVER`, `MISSING_PARAM`, `CONNECT_FAILED`, `AUTH_FAILED`, `TLS_ERROR`, `TIMEOUT`, `SEND_FAILED`, `UNSUPPORTED`.

```lua
local ok, err = linkiir.link.mail.send{
   server = "smtp://mail.example.com:587",
   from   = "alerts@example.com",
   to     = { "oncall@example.com" },
   header = { Subject = "Interface Alert", From = "alerts@example.com" },
   body   = "The ADT feed has stopped.",
   use_ssl = "try",
}
if not ok then error(err.message) end
```

Note `header` is singular and `use_ssl` uses an underscore, unlike the camel-cased parameters elsewhere.

Never put patient data in an email body or subject.

---

## `linkiir.link.socket` — raw TCP

```lua
linkiir.link.socket.connect{ host =, port = [, timeout = ] }   → sock, err
sock:send(<string>)
sock:recv()
sock:close()
```

Use it for protocols with no dedicated node type. Always `close()`, including on the error path.

---

## `linkiir.link.file` — file transfer

```lua
linkiir.link.file.open{ scheme = 'sftp', host =, user =
                        [, port =, password =, key =, timeout =, verifyTls =, live = ] }
   → conn, err

conn:get(...)      conn:put(...)      conn:list(...)
conn:delete(...)   conn:rename(...)   conn:close()
```

For scheduled transfers, prefer a File/FTP node — it handles reconnection, processed-file handling, and temporary names for you. Use this API for transfers that need custom logic.

---

## `linkiir.codec` — encoding and compression

Single string argument, returns a string, **raises** on invalid input.

```lua
linkiir.codec.base64.encode(s)      linkiir.codec.base64.decode(s)
linkiir.codec.hex.encode(s)         linkiir.codec.hex.decode(s)
linkiir.codec.uri.encode(s)         linkiir.codec.uri.decode(s)
linkiir.codec.html.encode(s)
linkiir.codec.uu.encode(s)          linkiir.codec.uu.decode(s)

linkiir.codec.gzip.compress(s)      linkiir.codec.gzip.decompress(s)
linkiir.codec.bzip2.compress(s)     linkiir.codec.bzip2.decompress(s)
linkiir.codec.zip.compress(s)       linkiir.codec.zip.decompress(s)
```

`html` has `encode` only — there is no `html.decode`.

### Character sets

These take **positional** arguments, unlike the rest of the API:

```lua
linkiir.codec.charset.convert(data, from, to)   → string
linkiir.codec.charset.supported(encoding)       → boolean
linkiir.codec.charset.list()                    → array of encoding names
linkiir.codec.charset.aliases(encoding)         → array of aliases
```

`to` accepts `//TRANSLIT` and `//IGNORE` suffixes.

```lua
local utf8Text = linkiir.codec.charset.convert(Data, "ISO-8859-1", "UTF-8")
```

Available encodings come from the host platform. Check with `supported()` before relying on an unusual one, and be aware the answer can differ between your workstation and a server.

For whole-message encoding, prefer the node's **Message Encoding** or **Input File Encoding** field over converting in script.

---

## `linkiir.sec` — hashing and cryptography

Raises on invalid input.

```lua
linkiir.sec.hash(...)      linkiir.sec.hmac(...)
linkiir.sec.pbkdf2(...)    linkiir.sec.info(...)

linkiir.sec.cipher.encrypt(...)   linkiir.sec.cipher.decrypt(...)
linkiir.sec.key.sign(...)         linkiir.sec.key.verify(...)
linkiir.sec.key.encrypt(...)      linkiir.sec.key.decrypt(...)
```

Use `hash` and `hmac` for message fingerprints, idempotency keys, and signature verification against a partner's contract.

:::caution Check signatures in the editor before relying on these
The exact parameters for each call vary by algorithm. Use the editor's IntelliSense for the shapes your release accepts, and test against a known-good vector before putting a cryptographic call into a live interface.

Do not build your own message-payload encryption scheme on top of these without a key-management plan — where you store keys, how you rotate them, and how an archived message is decrypted for replay. See [Security](../../administration/security/index.md).
:::

---

## `linkiir.sys` — identifiers, timing, and files

```lua
linkiir.sys.guid(bits)   → hex string
linkiir.sys.sleep(ms)
```

`bits` must be at least `128` and divisible by `8`. The result has `bits / 8 * 2` hex characters, so `guid(128)` returns 32 characters.

```lua
local id = linkiir.sys.guid(128)
```

Use `sleep` sparingly. It holds the worker, so in a Source HTTP node it delays real requests. Prefer a Source Custom node's **Interval** for scheduling.

Standard Lua `os.date`, `os.time`, and `os.clock` are available directly.

### `linkiir.sys.fs` — filesystem

```lua
linkiir.sys.fs.stat(path)     linkiir.sys.fs.list(path)
linkiir.sys.fs.access(path)   linkiir.sys.fs.touch(path)
linkiir.sys.fs.mkdir(path)    linkiir.sys.fs.rmdir(path)
linkiir.sys.fs.remove(path)
```

On Linux and macOS, `linkiir.sys.fs.chmod` and `linkiir.sys.fs.chown` are also available. They are not present on Windows, so a script using them is not portable across platforms.

For routine file work, use File/FTP nodes instead. They give you polling, minimum file age, processed-file handling, temporary names, and reconnection — all of which you would otherwise write yourself. Reach for `sys.fs` for the cases a node cannot express, such as checking a marker file exists before processing.

Paths are resolved on the Linkiir server, with the permissions of the service account.

---

## `linkiir.store` — databases

```lua
linkiir.store.open{ driver =, name =, user =, password = [, live = ] }   → conn, err

conn:query{ sql = }      → node tree, err
conn:execute{ sql = }    → affectedRows, err
conn:begin()   conn:commit()   conn:rollback()
conn:quote(s)  conn:check()    conn:close()
```

### Driver constants

```lua
linkiir.store.SQLITE        linkiir.store.POSTGRES
linkiir.store.MY_SQL        linkiir.store.MY_SQL_ODBC
linkiir.store.MARIA_DB      linkiir.store.SQL_SERVER
linkiir.store.ORACLE        linkiir.store.ORACLE_OCI
linkiir.store.ORACLE_ODBC
```

Note `MY_SQL`, with the underscore — there is no `MYSQL`.

### Reading results

`conn:query` returns a node tree, not a Lua table: `ResultSet → Row → Column`. Navigate it the same way as a message tree.

```lua
local conn, err = linkiir.store.open{
   driver = linkiir.store.POSTGRES,
   name = "clinical", user = "linkiir_svc", password = Secret,
}
if not conn then error(err.message) end

local rows, qerr = conn:query{ sql = "select mrn, dob from patient where id = 42" }
if not rows then
   conn:close()
   error(qerr.message)
end

for i = 1, #rows do
   local mrn = rows[i].mrn:value()
end

conn:close()
```

### Building a result set to write

```lua
linkiir.store.tables{ name = <table name> }   → node tree
conn:merge{ data = <node tree> [, live = ] }  → rowsMerged, err
```

`store.tables` gives you an empty table node named after the target table. Add rows and columns, then pass it to `conn:merge`.

### Practices

**Close the connection on every path**, including errors. A connection leaked on the error path is the failure that shows up under load, not in testing.

**Do not build SQL by concatenating message content.** That is how a malformed message becomes a SQL injection. Use `conn:quote` for values you must inline, and constrain what reaches the query.

**Keep credentials in the project's Credentials tab**, flagged **Secret**, not in the script. See [Project Settings](../../administration/configurations/project-settings.md).

**Opening a connection per message is expensive.** For high volumes, consider whether the enrichment belongs in the interface at all, or whether the data can be cached or pushed to you instead.

:::note Driver availability depends on your platform
The constants above are all defined, but a given driver only works if its client library or ODBC driver is present on the host. Test the connection on the machine the interface will run on, not only on your workstation.
:::

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

Write new scripts against the native API. Use the adapter to get existing scripts running, then migrate them as you touch each one — see [Migrating Existing Interfaces](../../administration/configurations/migration.md).

---

## Next

- [Testing and Debugging Lua](testing-debugging.md)
- [Sample Code](../sample-code/index.md)
- [Error Handling and Retry](../error-handling.md)
