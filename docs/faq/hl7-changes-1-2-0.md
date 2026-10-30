---
title: HL7 v2 Script Changes in Grid 1.2.0
sidebar_label: HL7 v2 Changes in 1.2.0
description: How Grid 1.2.0 reads HL7 v2 messages differently from 1.1.0, and how to update Lua scripts that read or build HL7 v2 with linkiir.data.
keywords: [upgrade, 1.2.0, 1.1.0, HL7 v2, repetitions, segment groups, repeating segments, MSH-9, linkiir.data, migration]
---

# HL7 v2 Script Changes in Grid 1.2.0

From Grid 1.2.0, an HL7 v2 message is read into Lua following its schema more closely. The message text in and out is unchanged. What changes is the path a script uses to reach a field, a segment or a group.

Scripts written for 1.1.0 that read or build HL7 v2 with `linkiir.data` may need updating. There are three changes:

1. [Fields that don't repeat lose their repetition level](#1-fields-that-dont-repeat)
2. [A number on a repeating segment picks the occurrence](#2-repeating-segments)
3. [Segments sit in their groups](#3-segment-groups)

---

## 1. Fields that don't repeat

In 1.1.0, every field had a repetition level, even one that can't repeat. In 1.2.0, a field the schema marks as not repeating holds its components directly:

| Value | 1.1.0 | 1.2.0 |
| --- | --- | --- |
| MSH-9.1, message code | `Msg.MSH[9][1][1]` | `Msg.MSH[9][1]` |
| MSH-9.2, trigger event | `Msg.MSH[9][1][2]` | `Msg.MSH[9][2]` |
| PV1-3.2, room | `Msg.PV1[3][1][2]` | `Msg.PV1[3][2]` |
| PID-3.1, patient ID (repeats) | `Msg.PID[3][1][1]` | `Msg.PID[3][1][1]`, unchanged |
| PID-5.1.1, family name (repeats) | `Msg.PID[5][1][1][1]` | `Msg.PID[5][1][1][1]`, unchanged |

Repeating fields, and fields the schema doesn't define (such as those in a Z-segment), keep the repetition level.

**What to change:** in a field that doesn't repeat, drop the `[1]` straight after the field number.

```lua
-- 1.1.0
local event = Msg.MSH[9][1][2]:value()
local room  = Msg.PV1[3][1][2]:value()
-- 1.2.0
local event = Msg.MSH[9][2]:value()
local room  = Msg.PV1[3][2]:value()
```

Old paths don't always fail on 1.2.0. They can quietly read something else instead:

| Old path on 1.2.0 | Gives |
| --- | --- |
| `Msg.MSH[9][1][2]` | `nil`: subcomponent 2 of MSH-9.1 |
| `Msg.PV1[3][1]` | PV1-3.1 only, where 1.1.0 gave the whole field |
| `Msg.PV1[3][1][1]` | PV1-3.1. It still works, because it reads subcomponent 1 |

Writing works the same way: `Out.MSH[9][2] = 'A01'`.

---

## 2. Repeating segments

In 1.1.0, `Msg.NK1` was the first NK1, so a number after it was a field of that NK1. In 1.2.0, a segment that can repeat where it sits gives all of its occurrences, so a number picks one of them:

| Lua | 1.1.0 | 1.2.0 |
| --- | --- | --- |
| `Msg.NK1[2]` | NK1-2 of the first NK1 | The second NK1 |
| `Msg.NK1[1][2]` | Repetition 2 of NK1-1 | NK1-2 of the first NK1 |
| `#Msg.NK1` | Fields in the first NK1 | How many NK1 segments there are |
| `Msg.NK1:S()`, `Msg.NK1:child(2)` | The first NK1 | The first NK1, unchanged |

Segments that don't repeat, such as PID and PV1, are unaffected: `Msg.PID[3]` is still PID-3.

**What to change:** add the occurrence number before the field number.

```lua
-- 1.1.0
local relation = Msg.NK1[3][1][1]:value()
-- 1.2.0: NK1-3 of the first NK1
local relation = Msg.NK1[1][3][1]:value()

-- Every NK1
for i = 1, #Msg.NK1 do
  local nk1 = Msg.NK1[i]
  print(nk1[2][1][1]:value())
end
```

Assigning to an occurrence (`Msg.NK1[2] = 'x'`) now raises an error. Write to one of its fields instead (`Msg.NK1[2][2] = 'x'`). To add an occurrence, use `Msg:add('NK1')`.

---

## 3. Segment groups

In 1.1.0, every segment sat directly under the message. In 1.2.0, segments sit in the groups of the schema's message definition, and a segment in a group is reached through the group. In an ORU R01:

| Lua | 1.1.0 | 1.2.0 |
| --- | --- | --- |
| `Msg.PID` | The PID | `nil` |
| `Msg.PATIENT_RESULT.PATIENT.PID` | — | The PID |
| `Msg.OBR` | The first OBR | `nil` |
| `Msg.PATIENT_RESULT.ORDER_OBSERVATION[2].OBR` | — | The second order's OBR |

Segments outside any group, such as MSH, are read as before. A message that matches no definition in the schema is read with no groups, as in 1.1.0.

**What to change:** use the group path. To find it, run the script on a sample and right-click the segment in the **Variables** panel to copy its path. For the full rules, including Z-segments, see [Message Data](../api/scripting-api/message-data.md).

---

## Checking a script

1. Search the script for `[1][`. On each field that doesn't repeat, drop the `[1]`.
2. Search for each segment that can repeat (`NK1`, `OBX`, `NTE`, `AL1`, `DG1`, `IN1` and others). Add an occurrence number to each, such as `[1]`.
3. In messages with groups (ORU, ORM, OML and others), replace `Msg.<SEG>` with the group path.
4. Run the script on each sample, and compare the output with what it produced on 1.1.0. See [Testing and Debugging](../interface-development/lua-programming/testing-debugging.md).
5. Commit, and restart the node. The runtime only runs committed code.

The schema decides which fields and segments repeat, and which groups a message has. To check one, open it in the [Schema Editor](../interface-development/schema-editor.md).

## Next

- [Message Data](../api/scripting-api/message-data.md): HL7 v2 fields, groups and occurrences in full
- [Testing and Debugging Lua](../interface-development/lua-programming/testing-debugging.md): Run Test, Debug and samples
