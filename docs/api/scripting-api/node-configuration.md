---
title: Node Configuration
---

# Node Configuration

`linkiir.config`

Reads the current node's configuration fields as a single label → value table, with password fields decrypted. The table is read once per script and cached.

---

## `linkiir.config.node`

*function*

```lua
linkiir.config.node()
```

Return this node's configuration as a label → value table.

Returns the node's configuration as a table keyed by each field's label. Absent or empty fields read as nil, and the table is cached after the first call.

**Usage**

```lua
local Cfg = linkiir.config.node()
```

**Returns**

- `table` — flat map of config label → value (string, number, or boolean); empty when the node has no config fields.

**Errors**

Raises a Lua error when the node directory is not configured, when the node's configuration is missing or unreadable, when it is malformed, or when a password field cannot be decrypted (typically a missing or wrong LINKIIR_SECRET_KEY).

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

