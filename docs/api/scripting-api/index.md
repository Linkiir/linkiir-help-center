---
title: Linkiir Scripting API
---

# Linkiir Scripting API

Reference for the Lua scripting API available inside Linkiir workflow scripts.

## Modules

| Module | Use it for |
| --- | --- |
| [Script Globals](script-globals.md) (`script.globals`) | Values and functions available in every script without requiring any module: the script's input payload, the current node directory, and stdlib-style helpers for loading modules and debug printing. |
| [Message Data](message-data.md) (`linkiir.data`) | Parses, builds and serializes messages in HL7 v2, X12, FHIR, CDA and XML as node trees. |
| [Message Flow](message-flow.md) (`linkiir.flow`) | Everything about a message's movement through a channel: acknowledge what came in, route/enqueue what goes out. |
| [Connectivity](connectivity.md) (`linkiir.link`) | All connectivity to external systems: web (HTTP), socket (TCP), mail (SMTP) and file (FTP/FTPS/SFTP). |
| [Database](database.md) (`linkiir.store`) | Database access, named for what it does (store / retrieve). |
| [Byte Transforms](byte-transforms.md) (`linkiir.codec`) | Converts bytes to other bytes and back: text encodings, compression and character-set conversion. |
| [JSON](json.md) (`linkiir.json`) | Parses and serializes JSON as plain Lua values rather than node trees. |
| [Security](security.md) (`linkiir.sec`) | Security primitives with modern, explicit parameters. |
| [Runtime & System](runtime-system.md) (`linkiir.sys`) | Runtime helpers and filesystem access. |
| [Logging](logging.md) (`linkiir.log`) | Writes log events at a level to the workflow's log, without raising or stopping the node. |
| [Node Configuration](node-configuration.md) (`linkiir.config`) | Reads the current node's configuration fields and the project's variables. |
| [Lua Table Library](lua-table-library.md) (`table`) | Standard Lua 5.1 table library for building and manipulating array-style tables (insert/remove/sort/concat). |
| [Lua Math Library](lua-math-library.md) (`math`) | Standard Lua 5.1 math library. |
| [Lua OS Library (time/env)](lua-os-library.md) (`os`) | Lua 5.1's time, environment, file and process functions. |
| [Lua IO Library (files/stdio)](lua-io-library.md) (`io`) | Lua 5.1's io library for byte-level reading and writing of local files and the standard streams. |
| [Lua String Library](lua-string-library.md) (`string`) | Lua 5.1's string library, callable as string.fn(s, ...) or s:fn(...). |
| [Lua Debug Library](lua-debug-library.md) (`debug`) | Lua 5.1's debug library for inspecting the call stack, locals, upvalues and metatables. |

---

## Next

- [Testing and Debugging Lua](../../interface-development/lua-programming/testing-debugging.md)
- [Sample Code](../../interface-development/sample-code/index.md)
- [Error Handling and Retry](../../interface-development/error-handling.md)
