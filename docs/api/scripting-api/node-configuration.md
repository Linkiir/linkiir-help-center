---
title: Node Configuration
---

# Node Configuration

`linkiir.config`

Reads the current node's configuration fields and the project's variables. Password fields and secret variables come back decrypted, and $\{project:name\} references to project variables are filled in. Each table is read once per script and cached.

---

## `linkiir.config.node`

*function*

```lua
linkiir.config.node()
```

Return this node's configuration as a label → value table.

Returns the node's configuration as a table keyed by each field's label. Absent or empty fields read as nil, and the table is cached after the first call. A field whose value references a project variable ($\{project:name\}) comes back with the variable's value filled in; a number or bool field holding a reference comes back as a number or boolean.

**Usage**

```lua
local Cfg = linkiir.config.node()
```

**Returns**

- `table` — flat map of config label → value (string, number, or boolean), references filled in; empty when the node has no config fields.

**Errors**

Raises a Lua error when the node directory is not configured; when node_config.json is missing, unreadable or not valid JSON; when a password field cannot be decrypted; or when a reference cannot be resolved: an unknown variable, a secret variable used outside a password field, or a number or bool field whose variable holds something else. A secret that cannot be decrypted says why: the grid's encryption key isn't available, the stored value isn't encrypted, or it was encrypted with a different key and has to be entered again.

**Example**

```lua
local Cfg = linkiir.config.node()

local Host = Cfg.host          -- "10.0.0.1"
local Port = Cfg.port          -- 2575 (number)
local UseSsl = Cfg.use_ssl     -- true (boolean)
local Password = Cfg.password  -- decrypted plaintext

local Sock, Err = linkiir.link.socket.connect{ host = Host, port = Port }
if not Sock then
  linkiir.log.error('connect failed: ' .. tostring(Err))
  return
end
```

```lua
-- A field set to ${project:api_host} reads as the variable's value.
local Cfg = linkiir.config.node()
linkiir.log.info('sending to ' .. Cfg.host)   -- "api.internal.net"
```

```lua
-- Absent fields are nil, so defaults are a plain 'or'.
local Cfg = linkiir.config.node()
local Timeout = Cfg.timeout_ms or 5000

if Cfg.protocol == 'hl7' then
  linkiir.log.info('Using HL7 profile')
end
```

```lua
-- Cached: the second call does no disk I/O and returns the same table.
local A = linkiir.config.node()
local B = linkiir.config.node()
assert(rawequal(A, B))
```


## `linkiir.config.project`

*function*

```lua
linkiir.config.project()
```

Return the project's variables as a name → value table.

Returns the variables from the project's Variables tab, keyed by name, with secret ones decrypted. Values are strings. A deployed node reads the project's variables as they are when it starts, so a changed variable takes effect when the node restarts; Run Test reads your own copy of the project. The table is cached after the first call.

**Usage**

```lua
local Vars = linkiir.config.project()
```

**Returns**

- `table` — flat map of variable name → value (string); empty when the project has no variables.

**Errors**

Raises a Lua error when the project's variables cannot be read, or when a secret variable cannot be decrypted. The message says why: the grid's encryption key isn't available, the stored value isn't encrypted, or it was encrypted with a different key and has to be entered again on the project's Variables tab.

**Example**

```lua
local Vars = linkiir.config.project()

local Url = 'https://' .. Vars.api_host .. '/v1'
local Token = Vars.api_token   -- a secret, decrypted
```

```lua
-- Values are strings: convert the ones you need as numbers.
local Vars = linkiir.config.project()
local Port = tonumber(Vars.port) or 443
```


## `linkiir.config.resolve`

*function*

```lua
linkiir.config.resolve(text)
```

Fill in $\{project:name\} references in a string.

Returns text with every $\{project:name\} reference replaced by that project variable's value, secret variables decrypted. Write $$\{ for a literal $\{. Text like $\{name\}, with no namespace: before the name, is left exactly as written.

**Usage**

```lua
local Url = linkiir.config.resolve(Text)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | string | Yes | `Text holding ${project:name} references.` |

**Returns**

- `string` — the text with its references filled in.

**Errors**

Raises a Lua error for an unknown project variable, a namespace other than project (for example $\{env:HOME\}), or a secret variable that cannot be decrypted.

**Example**

```lua
local Url = linkiir.config.resolve('https://${project:api_host}:${project:port}/v1')
-- "https://api.internal.net:6661/v1"
```

```lua
-- $${ keeps a literal ${ in the text.
local Tpl = linkiir.config.resolve('$${patient} at ${project:site}')
-- "${patient} at Main Street"
```

