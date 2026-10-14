---
title: Building a Map
description: Use the Data Map node's Map view to link source fields to target fields, convert values, fill fixed values, and add custom Lua.
keywords: [data map, map view, auto-map, rules, functions, code lookup, custom Lua, fixed value]
---

# Building a Map

A **map** turns one message type into another: an ADT^A01 into a FHIR Bundle, or a `Patient` resource into an ADT^A28. It is a list of **rules**, and each rule fills one target field. A node can have as many maps as it needs.

---

## The Map view

Opening a Data Map node's `mapping.lua` shows the **Map** view. The buttons above the editor switch between **Map**, **Source schema**, **Target schema** and **Code**.

| Area | Shows |
| --- | --- |
| **Toolbar** | The map on the board, what it reads (**Source**) and builds (**Target**), and its condition (**When**) |
| **Source column**, left | The message the map takes, from `source.json`, with the selected sample's values beside each field |
| **Target column**, right | The message it builds, from `target.json` |
| **Links** between the columns | One per rule. Hover over a field to highlight its links |
| **Bottom panel** | **Rule**: the selected rule's settings. **Output**: the last run and the map's problems |

The toolbar also counts the fields mapped and the target's required fields that are filled (**required 12/14**). The filter box at the top of each column narrows it, and the filter button limits it to fields that have a value in the sample or are mapped.

### Picking a map

The map picker in the toolbar lists the node's maps. With a map selected, its menu offers:

| Action | Does |
| --- | --- |
| **New map** | Adds a map: the message it takes, the message it builds, and its condition |
| **Condition** | Changes when the map takes a message. See [Conditions](conditions.md) |
| The up and down arrows | For maps that share a message type, change the order they are tried in |
| **Rename** | Renames the map. Its files in `maps/` are renamed to match |
| **Delete** | Removes the map and its files |

---

## Linking fields

There are three ways to add a rule:

- **Drag** from a source field to a target field.
- **Click** a source field, then a target field.
- **Right-click** a row and select **Map to target…** (or **Map to source…** on a target row), then click the other end. **Escape** cancels.

The new rule uses the conversion that suits the two fields. For example, an HL7 `XPN` name going into a FHIR `HumanName` uses **Name**. Select the link to change it in the **Rule** tab.

To remove a rule, right-click its link and select **Delete link**, or right-click a field and select **Remove mapping**.

### Rule settings

| Setting | What it does |
| --- | --- |
| **Function** | How the value is converted (see below) |
| **Source**, **Target** | The two ends, as paths: `PID-5`, `Patient.name[]`, `2010BA/NM1-3`, `patients.mrn` |
| Function options | For example, a code lookup's table, a date's format, or a fixed value |
| **When empty** | When the source has no value: **skip the field**, or **reject the message** |
| **Applies to** | In a map that takes several message types, which of them the rule applies to |
| **Note** | Your own comment. It is written into the generated code above the rule |

---

## Functions

The functions on offer depend on the formats being mapped. The common ones:

| Function | Converts |
| --- | --- |
| **Copy** | The value as it is |
| **Date**, **Date & time** | Between HL7 `DT`/`DTM`, FHIR `date`/`dateTime`, X12 and CDA dates |
| **Gender** | HL7 table 0001 to and from FHIR administrative-gender |
| **Code lookup** | Translates codes through a table you fill in, with a default for anything not listed |
| **Identifier**, **Name**, **Address**, **Phone / email** | Whole data types between formats: `CX` ↔ `Identifier`, `XPN` ↔ `HumanName`, `XAD` ↔ `Address`, `XTN` ↔ `ContactPoint` |
| **Coding**, **Coded concept**, **Coded value** | `CE`/`CWE` ↔ `Coding` and `CodeableConcept` |
| **Number**, **Yes / No** | Text to numbers, and `Y`/`N`, `T`/`F` and `1`/`0` to booleans |
| **Set ID** | 1, 2, 3… for a segment made once per item |
| **Custom Lua** | Your own code (see below) |

The **Rule** tab describes the chosen function as it works for the formats in this map.

---

## Values with no source

Right-click a target field and choose **Set value** to fill it without a source:

| Value | Fills |
| --- | --- |
| **Fixed value** | The same text every time, such as `2.5.1` in MSH-12. In HL7, `^` separates components |
| **Current date/time** | The time the message is mapped, in a format you choose, optionally shifted (`-1d`, `+2h`, `+30min`, `+1mo`, `-1y`) |
| **New UUID** | A new random UUID per message |
| **New control ID** | A new unique ID, such as for MSH-10 (HL7 and X12 targets) |
| **Custom Lua** | Whatever your code returns |

---

## Auto-map

**Auto-map** in the toolbar adds the standard mappings for the segments, resources or loops in the map. Its badge counts how many it can add. For example, ADT^A01 to FHIR maps PID into a `Patient` and PV1 into an `Encounter`, and fills MSH-7, MSH-9 and MSH-10 when building HL7.

Auto-map only adds rules, and never changes or removes one you made. Review what it adds as you would your own: it maps the standard meaning of a field, and your trading partner may use that field differently.

---

## Building the output

What you set up in the target column depends on the target format:

| Target | You choose |
| --- | --- |
| HL7 v2 | **Output starts as** a **Copy of the input** (change only what differs) or an **Empty message**. Then the segments it holds, each written once or once per item of the input (one `NK1` per contact), and in a copy, the segments to drop |
| FHIR | The Bundle type (**transaction**, **batch**, **collection**) or a **Single resource**, and the resources it holds. A resource can be made once per item, such as one `Observation` per `OBX`, and references between them, such as `Observation.subject` → `Patient`, are filled in for you |
| X12 | The loops it holds, each written once or per item. Envelope control numbers, HL numbering, loop qualifiers and segment counts are filled in when the message is finished |
| CDA, C-CDA | The document type and its sections. What C-CDA fixes for the document is written for you |
| Database | The main table, and the child tables written per item |
| JSON, XML | The structure, and the lists made per item |

See [Formats](formats.md) for each format's paths and particulars.

---

## Custom Lua

When no function does what you need, use **Custom Lua**: as a rule's function, as a **Set value**, or as a custom step that runs after a segment or resource is built. The editor explains what the code receives, and completes the names as you type:

| Name | Holds |
| --- | --- |
| `field` | The source of this rule. From HL7 v2, X12, CDA or FHIR it is the parsed field or element, read like the message: `field:value()`, or `field[2]:value()` for its second component. From database rows, JSON or XML it is the plain value. A repeating source is handed over one repetition at a time. With no source, `field` is `nil` |
| `MsgIn` | The whole incoming message |
| `MsgType` | Its type (`ADT_A01`, `Patient`, …) |
| `SegIn`, `ItemIn`, `LoopIn` | In a segment, resource or loop made per item: the item it is made from |

```lua
-- HL7 source: the attending doctor's ID, lower-cased, without a trailing -X.
return (field:value():lower():gsub('%-x$', ''))
```

Typing `MsgIn.` lists what the message holds: HL7 segments, JSON or XML members, or database tables. Hovering over a name shows what it is.

Custom Lua is part of the map, so it is saved in `maps/<name>.map.lua` and generated into the map's code like any other rule.

---

## Saving and committing

Every change in the Map view is written to the node's files at once: the map's `.map.lua` and its regenerated code. As with any node, the runtime only runs committed code, so **commit** the node's files to put a change into service.

## Next

- [Conditions](conditions.md)
- [Testing and Errors](testing-and-errors.md)
