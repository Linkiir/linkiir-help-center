---
title: Lua Programming
---

# Lua Programming

Node logic is written in Lua. The editor gives you static IntelliSense, schema-aware completion, one-shot Run Test, and breakpoint debugging.

## Every script has one entry point

```lua
local linkiir = require("linkiir")

function main(Data)
   linkiir.flow.push{ data = Data }
end
```

`require("linkiir")` returns one table holding every capability. There is nothing else to import.

`main` has to be a global function named exactly `main` — Linkiir looks it up by name. Declaring it `local` means the node will not start.

## What `Data` contains depends on the node

| Node type | `main` receives |
| --- | --- |
| Source HTTP | The complete raw HTTP request text |
| Source LLP, with a custom ACK | The inbound HL7 v2 message |
| Transform Custom | The message produced by the upstream node |
| Source Custom | Nothing — `main()` is called with no argument |

## The sub-modules

| Sub-module | Use it for |
| --- | --- |
| `linkiir.flow` | Send a message to the next node |
| `linkiir.data` | Parse, build, navigate, and serialize HL7 v2, X12, and XML |
| `linkiir.json` | Parse and build JSON |
| `linkiir.link` | HTTP requests and responses, email, sockets, file transfer |
| `linkiir.codec` | Base64, hex, URI, compression, character-set conversion |
| `linkiir.sec` | Hashing, HMAC, key derivation, ciphers, keys |
| `linkiir.sys` | Identifiers, timing, and filesystem operations |
| `linkiir.store` | Database connections and queries |

Signatures are in [Linkiir Scripting API](linkiir-api.md).

:::note HL7 and JSON use different modules
`linkiir.data` returns a navigable node tree, which suits HL7 v2 and X12. `linkiir.json` returns ordinary Lua tables. Passing `type = "json"` to `linkiir.data.extract` is an error, and the message tells you to use `linkiir.json` instead.
:::

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
local Msg = linkiir.data.extract{ schema = "adt.json", data = Data }
```

The error table always has `code` and `message`. `code` is a stable string you can branch on; `message` is for humans.

`linkiir.flow.push` raises rather than returning an error, because a message you cannot hand onward should stop the script rather than be quietly dropped.

## Migrating existing scripts

If you are bringing scripts from a legacy integration engine, a compatibility adapter provides the older global namespaces on top of the native API:

```lua
require "legacy_adapter"

function main(Data)
   local Msg = hl7.parse{ schema = "adt.json", data = Data }
   queue.push{ data = Msg:S() }
end
```

Load it explicitly with `require "legacy_adapter"`. Without that line, only the `linkiir.*` API exists.

The adapter is a Lua file that travels with a migrated project — in the node's directory, or the project's `common` directory so every node shares one copy.

Use the adapter to get an interface running with minimal edits, then move to the native API as you touch each script. See [Migration Configuration](../../administration/configurations/migration.md) for the mapping.

## Writing scripts that stay maintainable

- Keep `main` short. It should read as a summary of what the node does.
- Put reusable functions in separate `.lua` files and `require` them by bare name. Node-local files take priority, then the project's `common` directory.
- Use a project library when you want a shared module versioned, so a node pins a published version instead of tracking every edit. See [Project Settings](../../administration/configurations/project-settings.md).
- Avoid module-level mutable state. A Source HTTP node with **Worker Count** above `1` runs several script instances, each with its own copy.
- Never hard-code credentials or endpoints; keep them in the project's **Variables** and **Credentials** tabs.
- Handle optional fields explicitly. An absent HL7 field is normal, not exceptional.
- Keep payload contents out of error messages. See [Error Handling](../error-handling.md).

## Next

- [Linkiir Scripting API](linkiir-api.md) — signatures and examples.
- [Testing and Debugging Lua](testing-debugging.md) — Run Test, Debug, and samples.
- [Sample Code](../sample-code/index.md) — complete working interfaces.
