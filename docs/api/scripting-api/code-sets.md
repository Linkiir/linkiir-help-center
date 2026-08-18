---
title: Code Sets
---

# Code Sets

`linkiir.data.codeset`

Look up and cross-map code sets (also called code tables) embedded in your schema. Use it to translate coded field values between HL7 versions or between source and destination systems that use different code definitions.

---

## `linkiir.data.codeset.get`

*function*

```lua
linkiir.data.codeset.get{ schema=, table= }
```

Load a single code set from a schema file.

Returns a code set object for the given table ID from the grammar file in your node directory. The grammar is loaded once and cached — repeated calls return instantly.

**Usage**

```lua
linkiir.data.codeset.get{ schema = <string>, table = <string> }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `schema` | string | Yes | Schema file in the node directory (e.g. `'sourcedemo.json'`). |
| `table` | string | Yes | HL7 table number or code set ID (e.g. `'0001'`). |

**Returns**

- A code set object — see the methods below.
- `nil` if the table ID is not present in the schema.

**Errors**

Raises a Lua error when:

- A required parameter is missing.
- The schema file cannot be found or parsed.

**Example**

```lua
local codeset = linkiir.data.codeset

local Sex = codeset.get{ schema = 'demo.json', table = '0001' }
if Sex then
   print(Sex:desc('F'))   -- "Female"
end
```

---

## `linkiir.data.codeset.match`

*function*

```lua
linkiir.data.codeset.match(sourceCodeSet, destCodeSet)
```

Build a mapping table between two code sets.

Compares source and destination code sets by description. For each source code whose description matches a destination code, emits `sourceValue → destValue`. Source codes with no match are omitted from the result.

Use the result as a lookup table with an `or` fallback for unmapped codes.

**Usage**

```lua
linkiir.data.codeset.match(sourceCodeSet, destCodeSet)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `sourceCodeSet` | code set | Yes | A code set object returned by `codeset.get`. |
| `destCodeSet` | code set | Yes | A code set object returned by `codeset.get`. |

**Returns**

- A plain Lua table: `{ sourceCode = destCode, ... }`

**Errors**

Raises a Lua error if either argument is not a code set object.

**Example**

```lua
local codeset = linkiir.data.codeset

local SourceSex = codeset.get{ schema = 'source.json', table = '0001' }
local DestSex   = codeset.get{ schema = 'dest.json',   table = '0001' }
local Sex = codeset.match(SourceSex, DestSex)

-- Use the mapping with a fallback for codes that have no equivalent.
Out.PID[8] = Sex[Msg.PID[8]:value()] or 'U'
```

---

## Code set object methods

A code set object is returned by `codeset.get`. It provides read access to the codes and their descriptions.

### `:codes()`

Returns all code values as an array, in schema order.

```lua
local values = Sex:codes()   -- { "F", "M", "O", "U", "A", "N" }
```

### `:pairs()`

Iterates code/description pairs.

```lua
for code, desc in Sex:pairs() do
   print(code, desc)   -- "F"  "Female"
end
```

### `:desc(code)`

Returns the description for a single code, or `nil` if the code is not present.

```lua
print(Sex:desc('F'))   -- "Female"
print(Sex:desc('Z'))   -- nil
```

---

## Typical workflow

Code set mapping works well in two phases:

**Discovery** — Use `codeset.match` during development to generate the mapping automatically. Print the result to see which codes have matches and which do not.

```lua
local codeset = linkiir.data.codeset
local SRC, DST = 'source.json', 'dest.json'

local SourceSex = codeset.get{ schema = SRC, table = '0001' }
local DestSex   = codeset.get{ schema = DST, table = '0001' }
local Sex = codeset.match(SourceSex, DestSex)

for src, dst in pairs(Sex) do
   print(string.format('  %s -> %s', src, dst))
end
```

**Production** — Copy the printed mapping into your script as a hardcoded table, then customize codes that need overrides. The script no longer depends on the schema's code set section at runtime.

```lua
local Sex = {
   ["F"] = "F",
   ["M"] = "M",
   ["O"] = "O",
   ["U"] = "U",
   ["A"] = "U",   -- v2.5 Ambiguous has no v2.3 equivalent
   ["N"] = "U",   -- v2.5 Not applicable has no v2.3 equivalent
}

Out.PID[8] = Sex[Msg.PID[8]:value()] or 'U'
```

This gives you auto-generated baselines during development and full control in production.

---

## Notes

- Code sets live inside the schema JSON file (the `tables` section). They are populated when you add code sets through the Schema Editor.
- `codeset.get` resolves the schema path relative to the node directory, same as `linkiir.data.extract`.
- The grammar file is loaded once per process and cached. Calling `codeset.get` multiple times does not re-read the file.
- `codeset.match` compares descriptions case-insensitively and collapses whitespace. A source code whose description has no match in the destination is omitted, not mapped to nil.

---

## Next

- [Message Data](message-data.md) (`linkiir.data.extract`, `linkiir.data.create`)
- [Demo: HL7 LLP to Scripting to LLP](../../interface-development/sample-code/hl7-llp-scripting-llp.md)
- [Testing and Debugging Lua](../../interface-development/lua-programming/testing-debugging.md)

