---
title: Logging
---

# Logging

`linkiir.log`

Writes log events at a level to the workflow's log, without raising or stopping the node. Calls below the node's log level are dropped.

---

## `linkiir.log.error`

*function*

```lua
linkiir.log.error(message)
```

Emit a SCRIPT_LOG event at ERROR level.

Logs a message at ERROR level. Unlike Lua's error(), it doesn't stop the node.

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

Emit a SCRIPT_LOG event at WARN level.

Logs a message at WARN level, without raising or stopping the node.

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

Emit a SCRIPT_LOG event at INFO level.

Logs a message at INFO level, without raising or stopping the node.

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

Emit a SCRIPT_LOG event at DEBUG level.

Logs a message at DEBUG level, dropped unless the node's log level is DEBUG.

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

