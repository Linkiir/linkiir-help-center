---
title: Building a Map
description: Use the Data Map node's Map view to link source fields to destination fields, convert and normalize values, fill fixed values, add custom Lua, change the schemas, move maps between nodes, and commit.
keywords: [data map, map view, auto-map, rules, functions, code map, normalize, date format, custom Lua, custom.lua, fixed value, export map, import map, undo, commit]
---

# Building a Map

A **map** turns one message type into another: an ADT^A01 into a FHIR Bundle, or a `Patient` resource into an ADT^A28. It is a list of **rules**, and each rule fills one destination field. A node can have as many maps as it needs.

---

## The Map view

Opening a Data Map node on the Scripting page shows the **Map** view. The switch at the right of its toolbar moves between **Map**, **Source schema**, **Destination schema** and **Code**. In the Map view, **Code** opens `custom.lua`, where your own functions live.

| Area | Shows |
| --- | --- |
| **Toolbar** | The map picker, a button reading what the map takes and builds (such as **HL7 ADT_A01 → FHIR Bundle**), the map's condition, **Auto-map**, and the **PreMap** and **PostMap** buttons |
| **Source column**, left | The message the map takes, from `source.json`, with the selected sample's values beside each field |
| **Destination column**, right | The message it builds, from `destination.json` |
| **Links** between the columns | One per rule. Hover over a field to highlight its links. Scrolling over the links scrolls both columns together. The **Undo** and **Redo** buttons sit at the top |
| **Bottom panel** | **Rule**: the selected rule's settings, what it read and wrote on the last run, and the map's problems. **Output**: running the map on a sample |

The toolbar also counts the fields mapped and the destination's required fields that are filled (**required 12/14**). The filter box at the top of each column narrows it, and the filter button limits it to fields that have a value in the sample or are mapped.

**Expand all** and **Collapse all**, at the right of each column's toolbar, open or close the whole column at once. **Collapse all** folds everything back to its top-level rows: segments, resources, loops, tables or sections. **Expand all** opens those top-level rows one level down, so a large message stays readable. Open a row further with its own arrow. Links to a folded field end on the nearest row still showing, such as its segment.

The bottom panel opens when you select a rule or run the map, and closes with its **×** to give the board more room. While it is closed, a **problems** button shows when the map has any, and opens it.

### Source and destination settings

The toolbar button that reads what the map takes and builds opens the map's source and destination settings: the version, the message it takes and builds, how the output starts, and, for CDA, how strictly documents are checked. The node's protocols can't be changed while a map has content.

### Picking a map

The map picker in the toolbar lists the node's maps. With a map selected, its menu offers:

| Action | Does |
| --- | --- |
| **New map** | Opens the **New map** wizard: the message it takes, optional samples, its condition, and what it builds. A new map can start empty or as a copy of an existing map |
| **Condition** | Changes when the map takes a message. See [Conditions](conditions.md) |
| The up and down arrows | For maps that share a message type, change the order they are tried in |
| **Rename** | Renames the map. Its files in `mapping/maps/` are renamed to match |
| **Delete** | Removes the map and its files |
| **Export** | Saves the map as a file, with the samples you choose, to import into another node. See [Moving maps between nodes](#moving-maps-between-nodes) |
| **Import** | Adds a map from another Data Map node, or from a file saved with **Export**. See [Moving maps between nodes](#moving-maps-between-nodes) |

---

## Linking fields

There are three ways to add a rule:

- **Drag** from a source field to a destination field.
- **Click** a source field, then a destination field.
- **Right-click** a row and select **Map to destination…** (or **Map to source…** on a destination row), then click the other end. **Escape** cancels.

The new rule uses the conversion that suits the two fields. For example, an HL7 `XPN` name going into a FHIR `HumanName` uses **Name**. Select the link to change it in the **Rule** tab.

To remove a rule, right-click its link and select **Delete link**, or right-click a field and select **Remove mapping**.

### Rule settings

| Setting | What it does |
| --- | --- |
| **Function** | How the value is converted (see below) |
| **Source**, **Destination** | The two ends, as paths: `PID-5`, `Patient.name[]`, `2010BA/NM1-3`, `patients.mrn` |
| Function options | For example, a code map's codes, a date's **Output format**, or a fixed value |
| **Normalize data** | Clean-up applied to the value before it is written (see below) |
| **When empty** | When the source has no value: **skip the field**, or **reject the message** |
| **Applies to** | In a map that takes several message types, which of them the rule applies to |
| **Note** | Your own comment. It is written into the generated code beside the rule |

---

## Functions

The functions on offer depend on the formats being mapped. The common ones:

| Function | Converts |
| --- | --- |
| **Copy** | The value as it is |
| **Date**, **Date & time** | Between HL7 `DT`/`DTM`, FHIR `date`/`dateTime`, X12 and CDA dates. **Output format** picks how it is written (see below) |
| **Gender** | HL7 table 0001 to and from FHIR administrative-gender |
| **Code map** | Translates codes through a table you fill in, with a default for anything not listed |
| **Identifier**, **Name**, **Address**, **Phone / email** | Whole data types between formats: `CX` ↔ `Identifier`, `XPN` ↔ `HumanName`, `XAD` ↔ `Address`, `XTN` ↔ `ContactPoint` |
| **Coding**, **Coded concept**, **Coded value** | `CE`/`CWE` ↔ `Coding` and `CodeableConcept` |
| **Number**, **Yes / No** | Text to numbers, and `Y`/`N`, `T`/`F` and `1`/`0` to booleans |
| **Set ID** | 1, 2, 3… for a segment made once per item |
| **Custom Lua** | Your own function (see below) |

The **Rule** tab describes the chosen function as it works for the formats in this map.

### Code map

A **Code map** rule shows its codes as a two-column table: the **Code** that arrives and what it **Becomes**. Type in the **+ add a code** row to add one, and use a row's **×** to remove it. When the source field has an HL7 table, a link under the table adds all of that table's codes at once. Anything not in the table gets the rule's default.

### Date output formats

**Output format** on a date or time rule picks how the value is written, such as `YYYY-MM-DD`, `MM/DD/YYYY` or `YYYYMMDDHHmmss`. Each destination format has its own default. **Custom…** takes your own pattern, built from these tokens:

| Token | Gives |
| --- | --- |
| `YYYY`, `YY` | Year: `2026`, `26` |
| `MMMM`, `MMM`, `MM`, `M` | Month: `October`, `Oct`, `10`, `10` |
| `DD`, `D` | Day: `05`, `5` |
| `HH`, `H`, `hh`, `h` | Hour, 24-hour or 12-hour |
| `mm`, `ss`, `SSS` | Minutes, seconds, milliseconds |
| `A`, `a` | `AM`/`PM`, `am`/`pm` |
| `ZZ`, `Z` | Time zone offset: `-0400`, `-04:00` |
| `[text]` | The text as it is, such as `[T]` |

The Map view warns when a pattern is written into a field whose own format it doesn't match, such as a FHIR `date`.

---

## Normalizing values

**Normalize data** on a rule cleans the value before it is written. Tick the steps you need:

| Group | Steps |
| --- | --- |
| Characters | **Remove invisible characters**, **Remove accents** (José to Jose), **Remove punctuation** |
| Keep only | **Digits only**, **Letters only** |
| Spaces | **Remove all spaces**, **Collapse spaces**, **Trim spaces** |
| Case | **lower case**, **UPPER CASE**, **Title Case** |
| Length | **Strip leading zeros**, **Pad with zeros** to a length, **Cut to length** |

The steps always run in a fixed order, whatever order you tick them in, with **Cut to length** last. Steps that contradict each other can't be chosen together. For a database destination, **Cut to length** can't exceed the column's length. On structured values, such as a FHIR identifier or a CDA code, normalizing changes the text but leaves systems, URLs and code system IDs alone.

**+ Add custom normalization** adds your own step, as a function in `custom.lua` that takes the text and returns it cleaned. It runs after the ticked steps:

```lua
function NoDashes(text)
  return (text:gsub('-', ''))
end
```

---

## Values with no source

Right-click a destination field and choose **Set value** to fill it without a source:

| Value | Fills |
| --- | --- |
| **Fixed value** | The same text every time, such as `2.5.1` in MSH-12. In HL7, `^` separates components |
| **Current date/time** | The time the message is mapped, in a format you choose, optionally shifted (`-1d`, `+2h`, `+30min`, `+1mo`, `-1y`) |
| **New UUID** | A new random UUID per message |
| **New control ID** | A new unique ID, such as for MSH-10 (HL7 and X12 destinations) |
| **Custom Lua** | Whatever your function returns |

---

## Auto-map

**Auto-map** in the toolbar adds the standard mappings for the segments, resources or loops in the map. Its badge counts how many it can add. For example, ADT^A01 to FHIR maps PID into a `Patient` and PV1 into an `Encounter`, and fills MSH-7, MSH-9 and MSH-10 when building HL7.

Auto-map only adds rules, and never changes or removes one you made. Review what it adds as you would your own: it maps the standard meaning of a field, and your trading partner may use that field differently.

---

## Building the output

What you set up in the destination column depends on the destination format:

| Destination | You choose |
| --- | --- |
| HL7 v2 | **Output starts as** a **Copy of the input** (change only what differs) or an **Empty message**. Then the segments it holds, each written once or once per item of the input (one `NK1` per contact), and in a copy, the segments to drop |
| FHIR | The Bundle type (**transaction**, **batch**, **collection**) or a **Single resource**, and the resources it holds. A resource can be made once per item, such as one `Observation` per `OBX`, and references between them, such as `Observation.subject` → `Patient`, are filled in for you |
| X12 | The loops it holds, each written once or per item. Envelope control numbers, HL numbering, loop qualifiers and segment counts are filled in when the message is finished |
| CDA, C-CDA | The document type and its sections. What C-CDA fixes for the document is written for you |
| Database | The main table, and the child tables written per item |
| JSON, XML | The structure, and the lists made per item |

See [Formats](formats.md) for each format's paths and particulars.

---

## Changing the schemas from the board

When a message carries something the schema doesn't have, such as a Z-segment field or an extra JSON property, add it without leaving the Map view. Right-click a row in either column:

| Action | Does |
| --- | --- |
| **Add field to …** (or element, column, property) | Opens a form for its name, description and type, and whether it repeats or is required (or, in XML, is an attribute). When the row is part of a data type used in several places, the new part is added everywhere that type is used |
| **Remove field** | Removes it from the schema |
| **Remove segment** | On an HL7 source, removes a segment the map doesn't need. MSH can't be removed |

HL7 v2 and X12 fields are numbered by position, so a new field goes on the end and only the last one can be removed. Nothing is removed while a rule, a segment or resource made per item, or a condition still uses it. The change is saved to `source.json` or `destination.json`, the same file the [Schema Editor](../../schema-editor.md) edits.

---

## Custom Lua

When no function does what you need, use **Custom Lua**: as a rule's function, as a **Set value**, or as a custom step that runs after a segment, resource or loop is built. Your code lives in `custom.lua`, as ordinary Lua functions. The map only stores the function's name.

When you choose Custom Lua, the Rule tab suggests a name, such as `PatientNameGiven`, which you can change. It shows the function's parameters and where it is in `custom.lua`. Once the map is saved, `custom.lua` gets an empty function with that name, and **Edit** opens it there. The Map view never changes a function once it exists.

A rule's function is called for each value and returns what to write, or `nil` to write nothing:

| Parameter | Holds |
| --- | --- |
| `field` | The source of this rule. From HL7 v2, X12, CDA or FHIR it is the parsed field or element, read like the message: from HL7, `field[2]` is its second component. From database rows, JSON or XML it is the plain value. A repeating source is handed over one repetition at a time. With no source, `field` is `nil` |
| `MsgIn` | The whole incoming message |
| `MsgType` | Its type (`ADT_A01`, `Patient`, …) |
| `SegIn`, `ItemIn`, `LoopIn` | In a segment, resource or loop made per item: the item it is made from |

```lua
-- HL7 source: the attending doctor's ID, lower-cased, without a trailing -X.
function AttendingId(field, MsgIn, MsgType)
  return (hl7.part(field, 1):lower():gsub('%-x$', ''))
end
```

`custom.lua` starts with the helpers the map's code uses, such as `hl7`, so your functions can use them too. `hl7.part(field, i, j)` gives component `i` (and subcomponent `j`) as plain text, with HL7 escapes decoded. The functions are global, so one function can serve several rules, and PreMap and PostMap can call them.

A custom step after a segment, resource or loop gets what was built, then `MsgIn`, `MsgType` and, when it is made per item, the item:

```lua
function FinishPV1(segment, MsgIn, MsgType)
  hl7.put(segment, '3.4', 'MAIN')
end
```

---

## Moving maps between nodes

A map built in one Data Map node can be reused in another: in the same project, in another project, or on another Linkiir grid. The map travels with what it needs: the parts of the source and destination schemas it reads and builds, and the functions it calls in `custom.lua`. The receiving node generates the map's code itself, as after any change.

### Exporting a map

1. Select the map in the map picker, then **Export**.
2. Choose the samples to include. Samples of the messages the map takes are ticked to start with; **Select all** and **Select none** change them all at once.
3. Select **Export**. The map is saved as a file named after it, such as `lab_results.linkiir-map.json`.

:::warning[Use test data]
Samples go into the file exactly as they are, so anyone with the file can read them. Include test data only, never real patient data.
:::

**Export** also works on a node you can't edit.

### Importing a map

Select **Import** in the map picker or, in a node with no maps yet, **Import existing map** beside **New map** on the **Create your first map** card. The **Import existing map** window offers two sources:

- **Another Data Map node.** Your projects' Data Map nodes are listed by project, each with what it converts and how many maps it has; select a node to see its maps, then select a map. The search box finds projects, nodes, maps and message types. A node whose formats differ from this one is shown, but its maps can't be picked, and the reason is given. A node that hasn't been opened in the Map view since an update is listed under **can't be read yet**: open it once on the Scripting page to list its maps.
- **A map file.** **Open a map file** takes a file saved with **Export**.

The **Import map** window then shows, before anything changes:

| Section | Shows |
| --- | --- |
| Summary | What the map converts, the messages it takes, and its condition |
| **Map name** | The name it gets in this node. A name already in use gets a number added |
| **This node gains** | The source and destination schema messages and the **Custom Lua functions** the node doesn't have yet. When it already has everything, only the map is added |
| **Add its samples to this node** | For a file with samples: they are added to the node's samples, a name already in use getting a number, such as `Lab result (2)`. Untick it to leave them out |
| **Check before importing** | Anything to look at after importing, such as a function renamed or a schema part this node defines differently |

Select **Import** to add the map. The whole import is one change: one **Undo** takes it back. As with any change, commit the node's files to put it into service.

### What happens to differences

An import never changes what the node already has, since its other maps depend on it:

- **Formats.** A node with no maps takes on the formats of the map imported. Otherwise the map must convert the same kinds of message as the node, such as HL7 v2 to FHIR. A different version, such as HL7 v2 2.3 into a 2.5 node, is allowed and listed under **Check before importing**.
- **Schemas.** Messages, segments and types the node lacks are added. Where the node already defines one differently, the node's own definition stays, and the map's problems show any field it no longer finds.
- **Functions.** A function the node already has, with the same code, is shared. A different function of the same name is added under a new one, such as `LabNote_2`, and the imported map is pointed at it. A function the map calls that wasn't in its original node gets an empty function in `custom.lua` for you to fill in.

An imported map is a copy: later changes to the original don't reach it, and importing the same map again adds a second one. A map taken straight from another node doesn't bring that node's samples. To carry samples, export the map to a file and import the file.

---

## Undo and redo

**Undo** and **Redo**, at the top of the links column, step back and forward through your changes in the Map view: links, rule settings, segments and resources, conditions, schema changes, and adding, importing, renaming or deleting maps. The keyboard works too: <kbd>Ctrl</kbd>+<kbd>Z</kbd> (<kbd>⌘</kbd>+<kbd>Z</kbd> on a Mac) to undo, and <kbd>Ctrl</kbd>+<kbd>Y</kbd> or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> to redo.

The history lasts while the Map view is open. If a file changes outside the Map view, for example after a revert in Source Control, the history is cleared rather than undo something it no longer matches.

---

## Saving and committing

Every change in the Map view is written to the node's files at once: the map's `.map.lua` and its regenerated code. As with any node, the runtime only runs committed code, so **commit** the node's files to put a change into service.

**Commit** at the top of the page opens the commit dialog. While the node has changes that aren't committed yet, the button turns amber and shows how many files have changed. It describes what changed in the terms of the Map view, rather than as a list of files:

- **This node**: changes to the formats and the maps' order.
- **Each map**: links added, removed or changed, segments, resources and loops, and its condition, with **New map**, **Removed** or **Renamed** where that applies.
- **Custom Lua**: functions added, changed or removed in `custom.lua`, `premap.lua`, `postmap.lua` and `main.lua`.

**Use the summary** turns it into the commit message, which you can then edit. When only generated files changed, the dialog lists the files instead. **Revert** sets changes back to the last commit; a new file is deleted.

## Next

- [Conditions](conditions.md)
- [Testing and Errors](testing-and-errors.md)
