---
title: Linkiir Scripting API
---

# Linkiir Scripting API

Reference for the Lua scripting API available inside Linkiir workflow scripts.

## Modules

| Module | Use it for |
| --- | --- |
| [Script Globals](script-globals.md) (`script.globals`) | Values and functions available in every script without requiring any module: the script's input payload, the current node directory, and stdlib-style helpers for loading modules and debug printing. |
| [Message Data](message-data.md) (`linkiir.data`) | Parse (extract), build (create), and serialize messages of any supported format (HL7, X12, XML), plus the node-tree interface returned by those calls. |
| [Message Flow](message-flow.md) (`linkiir.flow`) | Everything about a message's movement through a channel: acknowledge what came in, route/enqueue what goes out. |
| [Connectivity](connectivity.md) (`linkiir.link`) | All connectivity to external systems, named for the heart of Linkiir. |
| [Database](database.md) (`linkiir.store`) | Database access, named for what it does (store / retrieve). |
| [Byte Transforms](byte-transforms.md) (`linkiir.codec`) | Everything that turns bytes into other bytes and back: text encodings, compression, and character-set conversion. |
| [JSON](json.md) (`linkiir.json`) | JSON parse and serialize operating on plain Lua tables. |
| [Security](security.md) (`linkiir.sec`) | Security primitives with modern, explicit parameters. |
| [Logging](logging.md) (`linkiir.log`) | Write log entries (error, warn, info, debug) that appear in the Logs view and trigger notification rules. |
| [Runtime & System](runtime-system.md) (`linkiir.sys`) | Small runtime helpers and filesystem access in one place. |
| [Lua Table Library](lua-table-library.md) (`table`) | Standard Lua 5.1 table library for building and manipulating array-style tables (insert/remove/sort/concat). |
| [Lua Math Library](lua-math-library.md) (`math`) | Standard Lua 5.1 math library. |
| [Lua OS Library (time/env)](lua-os-library.md) (`os`) | Time and environment functions from the standard Lua 5.1 os library. |
| [Lua String Library](lua-string-library.md) (`string`) | Standard Lua 5.1 string library. |

---

## Next

- [Testing and Debugging Lua](../../interface-development/lua-programming/testing-debugging.md)
- [Sample Code](../../interface-development/sample-code/index.md)
- [Error Handling and Retry](../../interface-development/error-handling.md)
