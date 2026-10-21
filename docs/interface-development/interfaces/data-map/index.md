---
title: Data Map Nodes
description: Convert messages between HL7 v2, FHIR, X12, CDA and C-CDA, database rows, and your own JSON and XML, by drawing the mapping instead of writing it.
keywords: [data map, mapping, graphical map, HL7 to FHIR, FHIR to HL7, X12, CDA, C-CDA, transform, interface engine]
---

# Data Map Nodes

A **Data Map** node converts each message it receives from one format to another. You draw the mapping in the **Map view**: link a source field to a target field, pick how its value is converted, and the node generates readable Lua that does the work.

```text
Source  →  Data Map (HL7 v2 ADT^A01 → FHIR Bundle)  →  Destination
```

It replaces hand-written mapping code for the common cases, without hiding anything. Everything the node runs is ordinary Lua in the node's files, which you can read, test, debug and commit like any other script.

---

## What it converts

A node reads one format and builds one format. Every combination below is supported except FHIR to FHIR:

| Reads | Builds |
| --- | --- |
| HL7 v2 | HL7 v2 |
| FHIR R4, R4B, R5: resources or Bundles, JSON or XML | FHIR R4, R4B, R5: a Bundle or a single resource |
| X12 4010 and 5010 | X12 4010 and 5010 |
| CDA R2 and C-CDA 5.0 | CDA R2 and C-CDA 5.0 |
| Database rows, as JSON | Database rows, as JSON |
| Your own JSON or XML documents | Your own JSON or XML documents |

One node builds one output format: two output formats means two nodes. Within that format, a node can take and build as many message types as you like. For example, ADT^A01, ADT^A08 and ORU^R01 in, each mapped to its own FHIR Bundle.

---

## Adding one

1. In the Workflow Builder, drag **Data Map** from the **Transform** group onto the canvas, and connect it between a source and a destination.
2. Open the node's **Scripting** tab. It opens in the **Map** view, on a **Create your first map** card.
3. Select **+ New map**. A short wizard asks, one step at a time:
   1. **Source message**: the protocol and version it reads, and the message it takes (`ADT_A01`, `Patient`, `837P`, a table, a structure).
   2. **Sample data** (optional): paste or upload one or more samples, so the board shows real values. For JSON and XML, the structure can be read from the first sample.
   3. **Filters**: the condition a message must meet for this map to take it. See [Conditions](conditions.md).
   4. **Target message**: the protocol and version it builds, the message it builds, how the output starts, and the map's name. A later map can start as a copy of an existing one.
4. Link fields, or select **Auto-map** to add the standard mappings. See [Building a Map](building-maps.md).
5. Run it on a sample. See [Testing and Errors](testing-and-errors.md).

The first map decides the formats the node reads and builds. The node's later maps use the same formats. When the first map is ready, the node's files are committed for you, so later changes show as changes against that starting point.

---

## Node settings

Two fields in the node's configuration decide what happens when a message can't be mapped:

| Field | Options | Default |
| --- | --- | --- |
| **On Error** | **Stop the node**: nothing more is processed until it is restarted. **Skip the message**: log the error and carry on with the next | Stop the node |
| **Unknown Messages** | For a message no map takes: **Treat as an error** (then On Error applies), **Skip the message**, or **Pass it through unchanged** | Treat as an error |

A message is unknown when it matches none of the messages in the source schema, or when it matches one but meets none of its maps' conditions.

---

## The node's files

Your own code sits at the top of the node. Everything the Map view manages is in the `mapping` folder.

| File | What it is | Edited by |
| --- | --- | --- |
| `main.lua` | Reads each message, hands it to its map, pushes the result, and applies the two settings above | You, if you need to |
| `custom.lua` | Your own Lua functions, which the maps call by name (see [Custom Lua](building-maps.md#custom-lua)) | You. The Map view only adds an empty function for a name a map uses that isn't there yet |
| `premap.lua` | `PreMap`, which runs on each message just before its map | You |
| `postmap.lua` | `PostMap`, which runs on what the map built | You |
| `source.json`, `target.json` | The source and target [schemas](../../schema-editor.md) | The Map view and the Schema Editor |
| `mapping/datamap.lua` | The list of maps: name, the message each takes, its condition, and the formats | The Map view (or by hand) |
| `mapping/maps/<name>.map.lua` | One map's rules, as a Lua table | The Map view (or by hand) |
| `mapping/init.lua`, `mapping/maps/<name>.lua` | The code generated from the maps | Generated: don't edit |
| `mapping/helpers/*.lua` | Conversion helpers the generated code uses (`hl7v2.lua`, `fhir.lua`, `convert.lua`, `normalize.lua`, …) | Kept up to date by the Map view |

Nodes made before the `mapping` folder existed are moved into it the first time they are opened, and any custom Lua inside their maps is moved into `custom.lua` as named functions. The move shows in Source Control: commit it when you're ready.

### PreMap and PostMap

For anything that applies to every message, rather than to one field, use `premap.lua` and `postmap.lua`. The **PreMap** and **PostMap** buttons in the Map view's toolbar open them.

```lua
-- premap.lua: runs once a map has been found for the message, just before it.
-- Change MsgIn, or return another message to map in its place.
function PreMap(MsgIn, MsgType)
end

-- postmap.lua: runs on what the map built (nil when it built nothing).
-- Change MsgOut, or return another message to send in its place.
function PostMap(MsgOut, MsgIn, MsgType)
end
```

The Map view never changes either file. `main.lua` is still there for anything else, such as an extra log line or a header on the outgoing message.
The generated files say **Do not edit by hand** in their first lines. If one is edited anyway, see [Hand edits to generated code](testing-and-errors.md#hand-edits-to-generated-code).

---

## In this section

| Page | Covers |
| --- | --- |
| [Building a Map](building-maps.md) | The Map view, links, functions, normalizing values, Auto-map, fixed values, custom Lua, schema changes, undo and committing |
| [Conditions](conditions.md) | Several maps for one message type, and which one takes a message |
| [Formats](formats.md) | What is particular to HL7 v2, FHIR, X12, CDA and C-CDA, database rows, JSON and XML |
| [Testing and Errors](testing-and-errors.md) | Samples, runs, checks, generated code, and committing |
