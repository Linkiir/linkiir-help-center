---
title: Code Tables in Lua
description: Translate codes in any node's Lua with a plain Lua code table and the lkcodemap library that Linkiir ships, the same code a Data Map's Code map rules run.
keywords: [code table, lkcodemap, code translation, lookup table, Lua, library, codetables, not found, code map]
---

# Code Tables in Lua

A Data Map node translates codes with [code tables](../interfaces/data-map/code-tables.md) and Code map rules. Any other node with Lua, such as a custom transform, can do the same with **lkcodemap**, the library those rules run.

Outside a Data Map, the table is a plain Lua file you write yourself. The Code tables tab, Find and Fill names are part of the Data Map's Map view only.

---

## 1. Link lkcodemap

lkcodemap ships with the Grid, under the name **Linkiir**.

1. Open the node on the **Scripting** page.
2. In the Explorer, select **Add Library**.
3. On the **Catalog Libraries** tab, find **lkcodemap** (from **Linkiir**) and select **Add**.

If the project already has lkcodemap, for example because it has a Data Map node, it's on the **Project Libraries** tab instead. Link it from there.

The library's files land in the node's `lkcodemap` folder, so `require 'lkcodemap'` finds them with no setup.

---

## 2. Write the table

Add a file for the table under `codetables/`, for example `codetables/labs.lua`. It returns a Lua table:

```lua
return {
  map = {
    ['GLU'] = '2345-7',
    ['NA']  = '2951-2',
  },
  names = {
    ['2345-7'] = 'Glucose [Mass/volume] in Serum or Plasma',
    ['2951-2'] = 'Sodium [Moles/volume] in Serum or Plasma',
  },
}
```

| Key | Holds |
| --- | --- |
| `map` | Each source code and the code it becomes. Required |
| `names` | Each destination code and its name. Optional |

Keep codes and names as strings, quoted, so a code such as `0001` keeps its zeros.

---

## 3. Translate a code

```lua
local codemap = require 'lkcodemap'
local labs = require 'codetables.labs'

local out = codemap.translate({ code = 'GLU', text = 'Glucose' }, { table = labs, notfound = 'keep' })
if out then
   -- out.code is '2345-7', out.name 'Glucose [Mass/volume] in Serum or Plasma'
end
```

The first argument is the code as the message carries it:

| Field | Holds |
| --- | --- |
| `code` | The code. An empty code gives `nil` |
| `text` | Its text, if the message has one |
| `system` | The code system the message names, if any, such as `LN` or `http://loinc.org` |

The second is the options:

| Option | Holds |
| --- | --- |
| `table` | The code table |
| `notfound` | What to do with a code the table doesn't hold: `'keep'` (give the code back as it is), `'value'` (give `default`), `'skip'` (give `nil`), or `'reject'` (raise a `Message rejected: ` error). Without it, `'value'` when `default` is set, else `'skip'` |
| `default` | The value for `notfound = 'value'` |

`translate` gives back `nil`, or a table with `code`, `name` (if known) and `system` (when the table names one). A row with an empty destination code is not found.

A code not found is logged as a warning, once per code, then counted. The code itself appears only in debug logging: in Run Test, or with the node's **Debug Logging** on. With `'reject'`, the error carries no code either, so it is safe in logs.

---

## A lookup table

To add names to codes that are already right, map each code to itself:

```lua
-- codetables/icd10_names.lua
return {
  map   = { ['E11.9'] = 'E11.9', ['I10'] = 'I10' },
  names = {
    ['E11.9'] = 'Type 2 diabetes mellitus without complications',
    ['I10']   = 'Essential (primary) hypertension',
  },
}
```

```lua
local out = codemap.translate({ code = 'E11.9' }, { table = require 'codetables.icd10_names' })
-- out.name == 'Type 2 diabetes mellitus without complications'
```

---

## Naming the systems

A table can name its two code systems, the way a Data Map's tables do:

```lua
return {
  name = 'ACME lab to LOINC',
  from = { name = 'ACME lab codes', hl7 = '99ACME', system = 'http://acme-lab.example.org/codes' },
  to   = { name = 'LOINC', hl7 = 'LN', system = 'http://loinc.org', oid = '2.16.840.1.113883.6.1' },
  map  = { ['GLU'] = '2345-7' },
  to_names = { ['2345-7'] = 'Glucose [Mass/volume] in Serum or Plasma' },
}
```

A side names a system when it gives `hl7`, `system` or `oid`. Then lkcodemap also:

- passes through a code the message already carries in the destination system;
- treats a code from another standard system as not found;
- gives the destination system back in `out.system`, with its HL7 v2 name, URL and OID.

`name` labels the table in the not-found warning. `to_names` is the long form of `names`. A table whose sides name no system reads any code.

---

## Reusing a Data Map's table

A Data Map node keeps its tables in `mapping/codetables/<name>.lua`, in the form above. Copy one into another node's `codetables/` folder to use it there. In the Data Map node, keep editing it in the Code tables tab: the tab rewrites the file.

## Next

- [Code tables in a Data Map](../interfaces/data-map/code-tables.md)
- [Code Sets](code-sets.md): the code sets inside a schema, read with `linkiir.data.codeset`
- [Project Settings: Libraries](../../administration/configurations/project-settings.md#libraries)
