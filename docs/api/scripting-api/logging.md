---
title: Logging
---

# Logging

`linkiir.log`

Write log entries from node scripts. Entries are published to the workflow's event topic and appear in the Logs view. When notification rules are configured, matching log entries trigger alerts.

---

## `linkiir.log.error`

*function*

```lua
linkiir.log.error(message)
```

Log an error message. Produces a `SCRIPT_LOG` event at level `ERROR`.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | Yes | The error message to log. |

**Example**

```lua
linkiir.log.error("Database connection failed: timeout after 30s")
```

---

## `linkiir.log.warn`

*function*

```lua
linkiir.log.warn(message)
```

Log a warning message. Produces a `SCRIPT_LOG` event at level `WARN`.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | Yes | The warning message to log. |

**Example**

```lua
linkiir.log.warn("Retry attempt 2 of 3 for upstream connection")
```

---

## `linkiir.log.info`

*function*

```lua
linkiir.log.info(message)
```

Log an informational message. Produces a `SCRIPT_LOG` event at level `INFO`.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | Yes | The informational message to log. |

**Example**

```lua
linkiir.log.info("Processed 142 messages in batch")
```

---

## `linkiir.log.debug`

*function*

```lua
linkiir.log.debug(message)
```

Log a debug message. Produces a `SCRIPT_LOG` event at level `DEBUG`. Only emitted when the node's log level is set to DEBUG.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | Yes | The debug message to log. |

**Example**

```lua
linkiir.log.debug("Parsed segment: " .. segment_id)
```

---

## Notes

- Log entries appear in the **Logs** view (searchable by project, workflow, node, and level).
- The notification engine matches log entries against rules in real time. An `ERROR`-level log from `linkiir.log.error()` is the most common way to trigger an alert.
- `print()` also writes to the log, but at `INFO` level with event type `SCRIPT_PRINT` — it is **not** matched by notification rules.
- `error()` (Lua's built-in) raises an exception and stops the script. It only emits an event when `stop_on_error` is enabled on the node. Use `linkiir.log.error()` to report an error without stopping execution.

---

## Next

- [Alerting and Notifications](../../administration/notifications/index.md)
- [Runtime & System](runtime-system.md)
- [Error Handling and Retry](../../interface-development/error-handling.md)
