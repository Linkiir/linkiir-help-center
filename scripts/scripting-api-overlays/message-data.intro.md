---

## HL7 v2 trees

An HL7 v2 message is read into a tree shaped by its schema: the fields each segment definition marks as repeating, and the groups of each message definition. The [Schema Editor](../../interface-development/schema-editor.md) sets both.

### Fields

| Field in the schema | Holds | Read it as |
| --- | --- | --- |
| Not repeating | Its components directly | `Msg.MSH[9][2]`: MSH-9, component 2 (the trigger event) |
| Repeating, or not defined | Its repetitions, each holding components | `Msg.PID[3][1][1]`: PID-3, repetition 1, component 1 |

A component holds its subcomponents, so `Msg.PID[5][1][1][1]` is the first subcomponent of PID-5's family name. A `~` in a field that doesn't repeat is kept as text.

### Segment groups

A message definition can group its segments: an ORU R01 has a PATIENT_RESULT holding a PATIENT and ORDER_OBSERVATIONs, and each ORDER_OBSERVATION holds its OBR and OBSERVATION groups. When a message fits its definition's structure, each segment sits in its group, so a segment in a group is reached through the group's name:

```lua
local Pid = Msg.PATIENT_RESULT.PATIENT.PID      -- Msg.PID is nil: PID is in a group
local Obr2 = Msg.PATIENT_RESULT.ORDER_OBSERVATION[2].OBR
```

A segment the definition doesn't have (a Z-segment) stays in the group it came in. From the first segment that is out of the structure's order, the rest of the message is read without groups, as a plain list under the message. A message no definition matches is read as a plain list too.

### Repeating segments and groups

A segment or group that can repeat where it sits, read by name, gives its occurrences, side by side in the same parent:

| Expression | Means |
| --- | --- |
| `Msg.NK1[2]` | The second NK1 |
| `Msg.NK1[2][2]` | Field NK1-2 of the second NK1 |
| `#Msg.NK1` | How many NK1 segments there are |
| `Msg.NK1:remove(2)` | Removes the second NK1 |
| `Msg.NK1[3]`, read past the last | nil |

Anything else read on it (`Msg.NK1:S()`, `Msg.NK1:count()`, `Msg.NK1:child(2)`) acts on the first NK1. Assigning to an occurrence (`Msg.NK1[2] = 'x'`) raises an error; write to one of its fields instead (`Msg.NK1[2][2] = 'x'`). `Msg:child('NK1')` is the first NK1 itself.

### Building a message

`linkiir.data.create` builds one empty occurrence of each of the definition's groups and segments. Empty ones are left out of the message text. `Node:add` adds a segment to the message or group it belongs in, or another occurrence of a group, which comes with its own empty segments. See `Node:add` below.

The Variables panel in the Scripting tab shows the groups, and right-clicking a row copies the path to it, such as `MsgIn.PATIENT_RESULT.ORDER_OBSERVATION[2].OBR`.
