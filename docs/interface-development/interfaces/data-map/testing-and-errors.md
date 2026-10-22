---
title: Testing a Data Map
description: Run a Data Map node on sample messages, read what each link wrote, fix the problems the Map view reports, and read the generated Lua.
keywords: [data map, testing, samples, run test, output, validation, generated code, mapping/init.lua, regenerate]
---

# Testing and Errors

A Data Map node is tested like any other node: on samples, in its runtime, before it is started. Nothing runs until you run it. The Map view reads samples to show their values, but never executes the map on its own.

---

## Samples

Add samples in the **New map** wizard's **Sample data** step, or at any time with **Samples** at the top of the Scripting page, where they can be read, edited, added or uploaded. A sample is a message as the node would receive it: an HL7 v2 message, a FHIR resource or Bundle, an X12 interchange, a CDA document, a JSON object of rows, or a JSON or XML document.

With a sample selected, the source column shows each field's value from it, and its filter button can hide everything the sample leaves empty. Keep one sample per case the map has to handle: each message type, each condition, and a message with the optional parts missing.

See [Testing and Debugging](../../lua-programming/testing-debugging.md) for samples in general. Use fake identifiers in samples, never real patient data.

---

## Running

The **Output** tab in the bottom panel has **Run on "_sample_"**. It runs the node the way it runs in production: `main.lua` reads the sample, the generated `mapping/init.lua` hands it to the map whose condition it meets, `PreMap` and `PostMap` run around the map, and the map builds the output. The tab then shows:

- which map handled the message, with **Open it** when it isn't the map on the board;
- each message the node pushed, in full;
- the error, if the run failed: for example, a required value with **When empty** set to **reject the message**, or a C-CDA rule the document breaks;
- a warning if `main.lua` pushed nothing.

Selecting a link afterwards shows in the **Rule** tab what that link read from the sample and what ended up in the output at its destination. It warns when the last run failed, or pushed no message or more than one, since then there is no single output to compare.

**Run Test** in the Scripting toolbar runs the same thing, and the debugger works on a Data Map node as on any other, including breakpoints in `custom.lua`, `premap.lua` and `postmap.lua`. See [Testing and Debugging](../../lua-programming/testing-debugging.md).

---

## Problems

The **Rule** tab lists the map's problems under **Validation** as you edit, as errors, warnings and notes, and the tab's badge counts them. Selecting one opens the rule it is about. Examples:

| Problem | Means |
| --- | --- |
| *PID-5 → Patient.nme[]: Patient.nme[] is not in destination.json* | A path names a field the schema doesn't have, usually after a typo or a schema change |
| *Code map needs a source field* | The function converts a value, and the rule has no source |
| *ADT_A01 is taken by both A and B; only A gets it* | Two maps take the same messages, and the first has no condition. See [Conditions](conditions.md) |
| *MSH-9 (Message Type) is required and not mapped* | The destination requires a field no rule fills. The toolbar's **required** count shows how many are filled |
| *Result repeats over OBX, which is not in ADT_A01* | A segment or resource is made per item of something the message doesn't have |
| *PV1-10 → PV1-10: no Lua function is named for it* | A Custom Lua rule has no function name. Give it one in the Rule tab |

Fix the errors before putting the node into service. Warnings and notes are worth reading, but a map can run with them.

---

## The generated code

The Map view writes the Lua for each map to `mapping/maps/<name>.lua`, and the code that dispatches each message to its map to `mapping/init.lua`. It is ordinary Lua using `linkiir.data`: one function per segment, resource or loop, with one line per rule, your notes beside the rules, and a comment on each condition. Your own functions are called by name from `custom.lua`.

The generated files are read-only in the Scripting editor, marked with a lock, and their first lines say **Do not edit by hand**. Make changes in the map, in your functions in `custom.lua`, in `premap.lua` or `postmap.lua`, or in `main.lua`.

### Hand edits to generated code

If a generated file is changed anyway, for example by a merge or by editing it outside Linkiir, the Map view notices and pauses that map so the changes aren't lost:

> mapping/maps/admit.lua has been changed by hand since the Map view generated it. Edits to the Admit map are paused so those changes aren't lost.

**Show the code** opens the file to compare. **Regenerate from the map** replaces it with the code for the map, discarding the hand edits. A hand-edited `mapping/init.lua` pauses every map, and **Regenerate from the maps** restores it.

---

## Putting it into service

The runtime runs committed code. When the map works on every sample, commit the node's changes with **Commit** at the top of the page (see [Saving and committing](building-maps.md#saving-and-committing)), and start or restart the node.

On live traffic, a message that fails follows **On Error**, and one no map takes follows **Unknown Messages**. Both are logged with the reason, such as *ADT_A04 is in the source schema, but no data map takes it*. See [Node settings](index.md#node-settings) and [Log Search and Message History](../../../administration/logs/index.md).
