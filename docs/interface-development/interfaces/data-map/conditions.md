---
title: Data Map Conditions
description: Give each Data Map map a condition, so several maps can share a message type and each message goes to the one it is meant for.
keywords: [data map, conditions, when, routing, filter, multiple maps, custom Lua]
---

# Conditions

Every map has a **condition**: what a message must meet for the map to take it. Conditions let several maps share a message type. For example, inpatient admissions can be mapped one way and outpatient admissions another, both from ADT^A01.

The toolbar shows the condition of the map on the board, such as `PV1-2 is I and PID-3 has a value`. Clicking it opens the condition for editing.

---

## How a map is chosen

For each message, the node:

1. Works out its type from the source schema (`ADT_A01`, `Patient`, `837P`, a table or a structure).
2. Tries the maps that take that type, **in their order**, and gives the message to the first whose condition it meets.
3. If it meets none of them, handles the message as the node's **Unknown Messages** setting says: an error, skip it, or pass it through unchanged. See [Node settings](index.md#node-settings).

The order matters when conditions overlap. In the map picker, the up and down arrows on a map move it earlier or later among the maps that share its message type. Put the narrowest condition first.

A map without a condition takes every message of its type, so maps after it never get one. The Map view reports this as a problem until you give the first map a condition or move it down. Maps made before conditions existed have none until you add one.

---

## Writing a condition

A condition is built from one or more checks. Each check reads a value from the message and compares it:

| Comparison | Met when the value |
| --- | --- |
| **is** | Equals the text given |
| **is not** | Is anything other than the text given, including empty |
| **is one of** | Equals one of a comma-separated list: `A01, A04, A08` |
| **has a value** | Is not empty |
| **is empty** | Is empty or absent |

Pick the field from the list, which shows each field's name and its value in the sample, and by default only fields the sample has a value in. You can also type a path. The value is read with the same paths as rules:

| Source | Example path |
| --- | --- |
| HL7 v2 | `PV1-2`, `PID-3.4` (a field with components compares its first, unless the path names one) |
| FHIR | `Patient.gender`, `Patient.identifier.value` |
| X12 | `2000B/2010BA/NM1-9` |
| CDA | `ClinicalDocument.code.@code` |
| Database rows | `patients.status` |
| JSON, XML | `Order.status`, `order.@status` |

Values compare exactly as written, so `i` doesn't match `I`.

### Several checks

**Add condition** adds another check. With more than one, choose whether a message must meet **all of these** or **any of these**. Each check can be removed with its **×** button.

```text
Meets  all of these
       PV1-2  is  I
  and  PID-3  has a value
```

### Custom Lua

For anything a comparison can't express, change a check from **A value in the message** to **Custom Lua**. The code gets the message as `MsgIn` and its type as `MsgType`, and returns `true` when the map should take the message:

```lua
-- A CCD needs at least one result for its Results section.
return MsgIn.OBX ~= nil
```

Custom Lua can be combined with ordinary checks under **all** or **any**.

---

## Adding a condition from the board

Right-click a field in the source column and select **Use this map only when…**. The condition opens with a check on that field already added, beside any checks the map has.

---

## Every new map needs a condition

The **New map** wizard asks for the condition in its **Filters** step, after the message the map takes, and won't create the map without one. If a map should take every message of its type, give it a condition every message meets, such as `MSH-9 has a value`.

---

## In the map files

Conditions are saved in `mapping/datamap.lua`, beside each map:

```lua
{
  name = 'Inpatient admits',
  file = 'mapping/maps/inpatient.map.lua',
  messages = { 'ADT_A01' },
  when = { all = { { from = 'PV1-2', op = 'is', value = 'I' }, { from = 'PID-3', op = 'has_value' } } },
},
```

The generated `mapping/init.lua` turns each condition into a small Lua function with a comment saying what it checks, so the order and outcome can be read and debugged like any other code.

## Next

- [Testing and Errors](testing-and-errors.md)
