---
title: Node Configuration
---

# Node Configuration

`linkiir.config`

Read the current node's configuration fields. Values come from the config[] array in the node's node_config.json, flattened into a single label → value table. Password fields are decrypted automatically. The result is cached for the lifetime of the script VM: the first call reads and parses from disk, every later call returns the same table with no I/O.

---

## `linkiir.config.node`

*function*

```lua
linkiir.config.node()
```

Return this node's configuration as a label → value table.

Reads node_config.json from the current node directory and returns a flat table keyed by each config entry's label. Strings, numbers, and booleans map straight across from JSON. Labels that are absent, null, or hold an object or array read as nil. The table is cached per script VM: the file is read once, and every later call returns that same table.

**Usage**

```lua
local Cfg = linkiir.config.node()
```

**Returns**

- `table` — flat map of config label → value (string, number, or boolean); empty when the node has no config fields.

**Errors**

Raises a Lua error when the node directory is not configured, when node_config.json is missing or unreadable, when it is not valid JSON, or when a password field cannot be decrypted (typically a missing or wrong LINKIIR_SECRET_KEY).

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

