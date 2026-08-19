---
title: Logging
---

# Logging

`linkiir.log`

Emit structured log events to the workflow event topic. Each call produces a SCRIPT_LOG record at the named level. These are annotations — they never raise, never stop the node, and are independent of Lua's error(). Gated by the node's log_level setting: a call below the threshold is dropped inside the runtime and never reaches the broker.

---

## `linkiir.log.error`

*function*

```lua
linkiir.log.error(message)
```

Emit a SCRIPT_LOG event at ERROR level. Does not stop the node (unlike Lua's error()). This is an annotation, not a fault — it never raises, never halts execution. Gated by the node's log_level setting.

**Usage**

```lua
linkiir.log.error(message)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | Yes | Log message text. |

**Returns**

- nil

**Example**

```lua
linkiir.log.error('Failed to parse inbound HL7: ' .. tostring(Err))
```


## `linkiir.log.warn`

*function*

```lua
linkiir.log.warn(message)
```

Emit a SCRIPT_LOG event at WARN level. This is an annotation, not a fault — it never raises, never halts execution. Gated by the node's log_level setting.

**Usage**

```lua
linkiir.log.warn(message)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | Yes | Log message text. |

**Returns**

- nil

**Example**

```lua
linkiir.log.warn('Missing optional field PID[8], defaulting to Unknown')
```


## `linkiir.log.info`

*function*

```lua
linkiir.log.info(message)
```

Emit a SCRIPT_LOG event at INFO level. This is an annotation, not a fault — it never raises, never halts execution. Gated by the node's log_level setting.

**Usage**

```lua
linkiir.log.info(message)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | Yes | Log message text. |

**Returns**

- nil

**Example**

```lua
linkiir.log.info('Processed ' .. tostring(Count) .. ' segments')
```


## `linkiir.log.debug`

*function*

```lua
linkiir.log.debug(message)
```

Emit a SCRIPT_LOG event at DEBUG level. Dropped by the runtime if the node's log_level is above DEBUG. This is an annotation, not a fault — it never raises, never halts execution. Gated by the node's log_level setting.

**Usage**

```lua
linkiir.log.debug(message)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | Yes | Log message text. |

**Returns**

- nil

**Example**

```lua
linkiir.log.debug('Raw payload length: ' .. tostring(#Data))
```

