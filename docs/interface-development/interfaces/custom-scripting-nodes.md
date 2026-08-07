---
title: Custom Scripting Nodes
---

# Custom Scripting Nodes

A **Transform Custom** node runs your Lua on each message that reaches it. It is where transformation, validation, filtering, enrichment, and routing happen.

## Fields

A Transform Custom node has no configuration fields of its own. Its Lua script, created with the node, is the only thing it needs to start.

There is no port, path, or interval — the node is driven entirely by the messages arriving from the node connected before it.

You can add your own fields to its configuration and read them from the script, which is the neat way to make a transform configurable without editing code. See [Interfaces and Core Nodes](index.md).

## Entry point

```lua
function main(Data)
   -- Data is the message from the upstream node.
   linkiir.flow.push{ data = Data }
end
```

Whether the node is a pass-through, a filter, or a terminal step is decided by what your script does, not by configuration:

| Your script | The node becomes |
| --- | --- |
| Pushes once per message | A transform in the chain |
| Pushes conditionally | A filter |
| Pushes more than once | A splitter |
| Never pushes, but calls out to HTTP, email, or a database | A destination |

## What these nodes are used for

| Task | Approach |
| --- | --- |
| Parse an HL7 v2 or X12 payload | `linkiir.data.extract` |
| Parse JSON | `linkiir.json.parse` |
| Build a target message | `linkiir.data.create` then `Node:map` |
| Validate required fields | Check values, `error()` on a genuine problem |
| Filter unwanted messages | `return` without pushing |
| Split a batch | Push once per item |
| Route by content | Push on a condition |
| Enrich from an API or database | `linkiir.link.web.get` or `linkiir.store` |
| Deliver over HTTP or email | `linkiir.link.web.post`, `linkiir.link.mail.send` |

## Filtering: return without pushing

Filtering is the absence of a push, not an error:

```lua
function main(Data)
   local Msg, MsgType = linkiir.data.extract{ schema = "adt.json", data = Data, type = "hl7" }

   -- Not a type this interface handles: drop it deliberately.
   if MsgType ~= "ADT" then
      print("Skipping message type " .. tostring(MsgType))
      return
   end

   linkiir.flow.push{ data = Msg:text() }
end
```

Print a line when you drop a message. Otherwise a filtered feed and a broken feed look identical when someone asks why nothing arrived.

## Splitting a batch

```lua
function main(Data)
   local batch = linkiir.json.parse(Data)

   for i = 1, #batch.orders do
      linkiir.flow.push{ data = linkiir.json.serialize(batch.orders[i]) }
   end
end
```

Each push is delivered independently, so a failure downstream affects one item rather than the batch.

JSON is handled by `linkiir.json`, which returns ordinary Lua tables. HL7 v2 and X12 use `linkiir.data`, which returns a navigable node tree. See [Linkiir Scripting API](../../api/scripting-api/index.md).

## Errors versus filtering

Be deliberate about the difference. It decides whether someone gets paged.

| Situation | Do |
| --- | --- |
| Message type this interface ignores | `return` — normal operation |
| Optional field absent | Handle it and continue |
| Required field missing | `error()` — the sender needs to know |
| Malformed payload | `error()` — do not guess at the content |
| Downstream call failed | `error()` — do not report success |

```lua
local mrn = Msg.PID[3][1][1]:value()
if mrn == nil or mrn == "" then
   error("PID-3 patient identifier is missing")
end
```

Keep payload content out of error text; it lands in logs. Name the field, not the value. See [Error Handling and Retry](../error-handling.md).

## Concurrency

A transform node processes one message at a time, which keeps ordering predictable along a connection. Only Source HTTP has a **Worker Count**.

Do not rely on module-level state to carry information between messages. Even where a node is single-threaded today, state that survives between messages makes behaviour depend on history and on restarts.

```lua
-- Fragile: leaks between messages, wrong after a restart
local lastPatient = nil

-- Better: derive what you need from the message you were given
function main(Data)
   local Msg = linkiir.data.extract{ schema = "adt.json", data = Data, type = "hl7" }
   local patient = Msg.PID[3][1][1]:value()
end
```

If you genuinely need state across messages, keep it in a database through `linkiir.store`, where it is durable and visible.

## Keeping scripts maintainable

- Keep `main` short enough to read as a summary of the node's job.
- Move mapping logic into functions, and functions into modules.
- `require` modules by bare name; node-local files take priority, then the project's `common` directory.
- Override a shared module for one node by placing a file of the same name in the node's directory.
- Use a project [library](../../administration/configurations/project-settings.md) when you want a shared module versioned, so a node pins a published version rather than tracking every edit.
- Keep credentials and endpoints in the project's **Variables** and **Credentials** tabs, not in code.

## Testing

Run Test and Debug both run your script against a sample without producing real messages. Keep samples for the malformed and missing-field cases, not just the happy path — see [Testing and Debugging Lua](../lua-programming/testing-debugging.md).

## Next

- [Linkiir Scripting API](../../api/scripting-api/index.md)
- [Sample Code](../sample-code/index.md)
- [Error Handling and Retry](../error-handling.md)
