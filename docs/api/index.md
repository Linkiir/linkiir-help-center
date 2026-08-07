---
title: API
---

# API

Two ways to work with Linkiir programmatically.

| API | Use it for |
| --- | --- |
| [Scripting API](scripting-api/index.md) | The `linkiir.*` Lua calls available inside a node script — parsing messages, pushing to the next node, HTTP/SMTP/socket/file I/O, encoding, crypto, databases. |
| [Web API](web-api/linkiir-api) | The HTTP endpoints the Linkiir server itself exposes — projects, workflows, nodes, libraries, settings, and everything else the UI talks to. |

The Scripting API runs inside a node, on messages flowing through a workflow. The Web API runs against the Linkiir server itself, for automating project and server administration from outside it.
