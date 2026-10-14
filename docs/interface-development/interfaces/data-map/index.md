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
2. Open the node's **Scripting** tab. Its `mapping.lua` opens in the **Map** view.
3. Open the map picker, select **New map**, and choose:
   - **Source**: the format and version it reads, and the message it takes (`ADT_A01`, `Patient`, `837P`, a table, a structure).
   - **Target**: the format and version it builds, and the message it builds.
   - **When**: the condition a message must meet for this map to take it. See [Conditions](conditions.md).
4. Add a sample with **+ Sample** at the top of the page, so the board shows real values.
5. Link fields, or select **Auto-map** to add the standard mappings. See [Building a Map](building-maps.md).
6. Run it on a sample. See [Testing and Errors](testing-and-errors.md).

The first map decides the formats the node reads and builds. The node's later maps use the same formats.

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

| File | What it is | Edited by |
| --- | --- | --- |
| `main.lua` | Reads each message, hands it to its map, pushes the result, and applies the two settings above | You, if you need to |
| `datamap.lua` | The list of maps: name, the message each takes, its condition, and the formats | The Map view (or by hand) |
| `maps/<name>.map.lua` | One map's rules, as a Lua table | The Map view (or by hand) |
| `source.json`, `target.json` | The source and target [schemas](../../schema-editor.md) | The Map view and the Schema Editor |
| `mapping.lua`, `maps/<name>.lua` | The code generated from the maps | Generated: don't edit |
| `helpers/*.lua` | Conversion helpers the generated code uses (`hl7.lua`, `fhir.lua`, `convert.lua`, …) | Kept up to date by the Map view |

`main.lua` is the place for anything a map can't express, such as an extra log line or a header on the outgoing message:

```lua
local MsgOut = mapper.map(MsgIn, MsgType)
if MsgOut then
    linkiir.flow.push{ data = MsgOut:S() }
end
```

The generated files say **Do not edit by hand** in their first lines. If one is edited anyway, see [Hand edits to generated code](testing-and-errors.md#hand-edits-to-generated-code).

---

## In this section

| Page | Covers |
| --- | --- |
| [Building a Map](building-maps.md) | The Map view, links, functions, Auto-map, fixed values and custom Lua |
| [Conditions](conditions.md) | Several maps for one message type, and which one takes a message |
| [Formats](formats.md) | What is particular to HL7 v2, FHIR, X12, CDA and C-CDA, database rows, JSON and XML |
| [Testing and Errors](testing-and-errors.md) | Samples, runs, checks, generated code, and committing |
