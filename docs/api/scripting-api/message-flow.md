---
title: Message Flow
---

# Message Flow

`linkiir.flow`

Everything about a message's movement through a channel: acknowledge what came in, route/enqueue what goes out.

---

## `linkiir.flow.push`

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


## `linkiir.flow.configure`

*function*

```lua
linkiir.flow.configure{ bootstrap=, project=, workflow=, node=, topic= }
```

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


## `linkiir.flow.topic`

*function*

```lua
linkiir.flow.topic()
```

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

