---
title: Code Tables
description: Translate codes from one code system to another in a Data Map node with code tables and Code map rules - lab codes to LOINC, local diagnosis codes to ICD-10-CM - and fill in code names with lookup tables.
keywords: [data map, code table, code map, lookup table, code translation, LOINC, ICD-10-CM, SNOMED CT, CodeableConcept, CWE, CD, lkcodemap, fill names, crosswalk]
---

# Code Tables

The system that sends a message and the system that receives it often use different codes for the same thing. A lab calls glucose `GLU`. The FHIR server wants the LOINC code `2345-7`.

A **code table** holds that translation: each **source code** and the **destination code** it becomes, with their names. A **Code map** rule applies it to a field. The table lives in the node, holds only the codes the node uses, and is tested, committed and deployed with the maps that use it.

For a short list, such as `F` → `female`, you don't need a table: type the codes into the rule itself. See [Codes in the rule](#codes-in-the-rule).

```text
OBX-3  GLU^Glucose^99ACME  ──[Code map · ACME lab → LOINC]──▶  Observation.code
                                                                 LOINC 2345-7 · Glucose [Mass/volume] in Serum or Plasma
                                                                 + GLU · Glucose (the original)
```

---

## The Code tables tab

Open a Data Map node's **Map** view, then open the tab one of these ways:

- the map menu's **Code tables…**;
- the **Code tables** tab in the bottom panel;
- **Open** on a Code map rule that uses a table.

The tab shows one table at a time. Pick it in **Code Table** at the top. Beside it, the pencil renames the table and the bin deletes it.

| Button | Does |
| --- | --- |
| **New table** | Makes a table. Give it a name and select **Create** |
| **Fill names** | Fills empty names from the code lists. See [Fill names](#fill-names) |
| **Import CSV**, **Export CSV** | Loads rows from a spreadsheet, or saves them to one. See [CSV files](#csv-files) |

A new table's file is `mapping/codetables/<name>.lua`, named from the table's name. Renaming the table keeps the file name. A table can't be deleted while a rule uses it. Every change goes through the Map view's undo and redo, and shows in the commit dialog like a map change.

### Source and destination systems

Above the rows, **Source** and **Destination** name each side's code system. Select the pencil beside one to change it. Pick the kind of system first:

| Kind | Use it for |
| --- | --- |
| **Imported code list** | A system imported in [Settings → Code lists](../../../administration/configurations/code-lists.md), such as LOINC or ICD-10-CM, or a custom list. Find, Fill names and the code checks use it |
| **Schema code set** | A code set from the source schema (for the source side) or the destination schema (for the destination side), such as HL7 table 0001 or FHIR administrative-gender. Its codes become a pick list in the table |
| **Your own codes** | Codes no list holds, such as a lab's local codes. Give a **Name**, the **HL7 v2 name** messages use (`99ACME`), and optionally a **URL (FHIR)** and an **OID (CDA)** |

Only code lists imported on this Grid are offered. If none are, import one in Settings, or use your own codes.

The systems decide how the code is written. A side with an HL7 v2 name, URL or OID gives the destination its system in the form each format needs. A side with none is written without a system.

When a Code map rule picks a table for a destination with a fixed list, such as FHIR `Patient.gender` or an HL7-defined table, the table's destination side is linked to that list, and its destination codes become a pick list.

### Rows

Each row has a **Source code**, **Source name**, **Destination code** and **Destination name**. Edit a cell and press **Enter** or click away to save it.

- **Add code** opens a **New code** panel. Type the codes, or use the search icon beside a code to find it in the code list. Select **Add**, or press **Enter**, then add the next one. **Done** closes the panel.
- The **×** at the end of a row deletes it. Clearing a source code deletes its row too.
- **Search codes or names…** filters the rows. Long tables are shown 25 rows to a page.
- A source code can appear once. A second row with the same code is refused.
- A destination code has one name. Several source codes that map to it share that name, so changing it on one row changes it on all of them.
- A row with no destination code says **no destination code yet**. The rule treats its code as not found.

The footer counts the codes, the rows without a destination code, and any destination codes the code list flags. A destination code that isn't in the list, or isn't active in it, gets a warning mark. Hover over the mark to see why.

### Find

When a side's system is an imported code list, each code cell has a search icon. It opens **Find a source code** or **Find a destination code**: type a code or some words, and select **Search**. Only active codes are listed. Select a result to fill both the code and its name.

Find searches the code list on the Grid. Nothing leaves Linkiir.

### Fill names

**Fill names** fills every empty source name from the source side's code list, and every empty destination name from the destination side's list, in one step. Names you have typed are kept. A code the list doesn't hold stays without a name. The button shows only when at least one side is an imported code list.

### Lookup tables

A **lookup table** has the same system on both sides. It doesn't translate: each code keeps its code and gets the destination name. Use it when the message already has the right code but not its name. For example, an `OBX` with `E11.9^^I10` has no display text, and FHIR wants one.

When both sides are the same, the tab says **Lookup table: each code keeps its code and gets the destination name**. **Add code** fills the destination code with the source code for you. Then **Fill names** adds the names.

Each code gets the table's name for it. A code the table has no name for keeps the message's text. A code the table doesn't hold is not found, and follows the rule's **When not found**.

### Used by

The footer lists every rule that uses the table, by map and fields, such as **ORU to FHIR · OBX-3 → Observation.code**. Select one to open that rule in the **Rule** tab. A table no rule uses says how to apply it.

### Codes not found in a run

After a **Run Test**, the tab lists the codes the run couldn't translate through the shown table, under **Not found in the last Run Test**. Select **Add** to add one to the table, or **Add all** for every one. The new rows have the source code and name, and no destination code yet: fill one in, or the code stays not found.

The **Rule** tab shows the same list for the selected rule, under **Not found in this sample**, with **Add to table**.

### CSV files

**Import CSV** loads rows from a CSV file:

1. Choose the file.
2. Under **Columns**, check which column holds the **Source code**, **Source name**, **Destination code** and **Destination name**.
3. Read **What changes**: new, changed and unchanged rows, duplicate source codes (the last row for each is kept), rows with no destination code, codes that look like Excel dates (fix those in the file first), and destination codes the code list doesn't hold.
4. Choose how to import: **Add and update** keeps the rows the file doesn't mention, **Replace the whole table** keeps only the file's rows.
5. Select **Import**.

Nothing changes until you import. **Export CSV** writes the same four columns, so a reviewer can check the table in a spreadsheet and you can import it back.

:::tip
Spreadsheet programs turn some codes into dates or numbers: LOINC `1-8` becomes "8-Jan", and leading zeros vanish. Format code columns as text before you save the file.
:::

---

## The Code map rule

A **Code map** rule translates the value of its source field. Select a link, set **Function** to **Code map** in the **Rule** tab, then choose where its codes come from under **Codes**.

### Codes in the rule

**In this rule** keeps the codes in the rule itself, as a two-column table: the **Code** that arrives and what it **Becomes**. Type in the **+ add a code** row to add one, and use a row's **×** to remove it. When the source field has an HL7 table, **Add the N codes of table …** adds its codes at once. When the destination has a fixed list, each value is picked from it.

For a coded destination, **Add a coding system** gives the codes a system, so the rule can fill a FHIR Coding or CodeableConcept, an HL7 v2 coded field, or a CDA CD.

### Codes from a code table

**Code table** applies one of the node's code tables. Pick it in the list. The rule shows how many codes it has and its two systems. **Open** shows it in the Code tables tab. If the node has no tables yet, **New code table** opens the tab to make one.

Switching back to **In this rule** brings back the codes you had typed there.

On the board, the link reads **Code map ·** and the table's name.

### When not found

**When not found** says what happens to a code the rule can't translate:

| Choice | What happens | Good for |
| --- | --- | --- |
| **Keep the code as it is** | The source code is written unchanged, with its own system | Lab results, where nothing should be lost. The default for a coded destination |
| **Use a value** | The value you type is written, without a system | A field with a fixed list, such as `unknown` for gender |
| **Skip** | Nothing is written | Optional fields. The default for other destinations |
| **Reject the message** | The message is rejected, and follows the node's **On Error** | Codes that must be right, such as billing codes |

A code not found is logged as a warning that names the table. The code itself appears only in debug logging: in Run Test, or with the node's **Debug Logging** on. Each code is logged the first time it is missed, then counted, with a count line at most every 10 minutes.

### Keep the original code too

For a coded destination, **Keep the original code too** writes the source code beside the translation. It is turned on when you first pick a table for a coded destination. Coded destinations are a FHIR CodeableConcept, an HL7 v2 CE, CWE or CNE field, and a CDA CD, CE, CV or CO.

### What gets written

The rule writes the translated code, its name and its system in the destination's own form:

| Destination | Written |
| --- | --- |
| FHIR `code` | The code |
| FHIR `Coding` | `system`, `code` and `display` |
| FHIR `CodeableConcept` | A coding with `system`, `code` and `display`, then the original coding when it is kept. `text` is the message's text, or else the destination name |
| HL7 v2 `ID` or `IS` | The code |
| HL7 v2 `CE`, `CWE` or `CNE` | `code^name^system`, with the original in components 4 to 6 when it is kept |
| CDA `CD`, `CE`, `CV` or `CO` | `code`, `codeSystem` (an OID) and `displayName`, with the original as a `translation` when it is kept |
| CDA `CS` or a code attribute | The code |
| X12, database columns, JSON and XML values | The code |

The system is a URL for FHIR, an OID for CDA, and the HL7 v2 name (`LN`, `I10`, `99ACME`) for HL7 v2. For example, `OBX|1|NM|GLU^Glucose^99ACME||98` through a table from ACME lab codes to LOINC becomes:

```json
"code": {
  "coding": [
    { "system": "http://loinc.org", "code": "2345-7", "display": "Glucose [Mass/volume] in Serum or Plasma" },
    { "system": "http://acme-lab.example.org/codes", "code": "GLU", "display": "Glucose" }
  ],
  "text": "Glucose"
}
```

### How a code is read

The rule reads the code, its text and its system from the source: components 1 to 3 of an HL7 v2 coded field (with the alternate code in 4 to 6), a FHIR Coding or CodeableConcept, or a CDA CD with its translations. Any other source gives its value as text.

When the table's sides name their systems:

- a code the source already carries in the destination system is used as it is, without looking it up;
- a code from another standard system, such as SNOMED CT through a table from ACME codes to LOINC, is not found;
- a code with a local or missing system, such as `99ACME` or `L`, is read as the source system.

A table whose sides name no system reads any code.

### Checks

The **Validation** list warns about code tables too. For example:

- a rule names a code table that isn't in the node, or can't be read;
- a table has rows without a destination code;
- a value the rule can write isn't in the destination's allowed values;
- a table is very large, which matters because every node that loads it keeps it in memory.

---

## The lkcodemap library

The code that applies a code table at run time is **lkcodemap**, a library Linkiir ships with the Grid. Every Data Map node links it. You'll see it in the node's **Libraries** panel, and its files in the node's `lkcodemap` folder.

A new Data Map node links it when it is made. Opening an older node's Map view links it for you, or moves it to the version the maps need. If that doesn't work, the Map view says **The maps need the lkcodemap library to run**, with **Add lkcodemap** (or **Update lkcodemap**) to try again. Commit the change with the rest of the node.

Any other node can use lkcodemap too, with a code table written as plain Lua. See [Code Tables in Lua](../../lua-programming/code-tables.md).

---

## Where everything is kept

| What | Where | Used |
| --- | --- | --- |
| **Code list**, such as LOINC | On the Grid, in [Settings → Code lists](../../../administration/configurations/code-lists.md) | While building only: search, names and checks. A running node never reads it |
| **Code table** | In the node: `mapping/codetables/<name>.lua` | Loaded once when the node starts, then read from memory |
| **Code map rule** | In the map: `mapping/maps/<name>.map.lua` | Turned into the map's code |
| **lkcodemap** | Linked into the node: the `lkcodemap` folder | Applies the table at run time |

A running node never looks a code up over the network or in a database. Exporting a map, or importing one from another node, takes the code tables it uses along. A table the receiving node already has with the same contents is reused. One with the same name and different contents is added under a new name, and the imported rules point at it. See [Moving maps between nodes](building-maps.md#moving-maps-between-nodes).

---

## Examples

### Local lab codes to LOINC

1. Import LOINC in [Settings → Code lists](../../../administration/configurations/code-lists.md).
2. In the Code tables tab, select **New table** and name it *ACME lab → LOINC*.
3. Set **Source** to **Your own codes**: name *ACME lab codes*, HL7 v2 name `99ACME`.
4. Set **Destination** to **Imported code list** → **LOINC**.
5. Import the lab's spreadsheet with **Import CSV**, or add each code with **Add code** and **Find**.
6. Select the link from `OBX-3` to `Observation.code`, set **Function** to **Code map**, **Codes** to **Code table**, and pick the table.
7. Run a test. Add any code the run didn't find.

### A hospital's diagnosis codes to ICD-10-CM

1. Add the hospital's codes as a [custom code list](../../../administration/configurations/code-lists.md#custom-code-lists), and import ICD-10-CM.
2. Make a table with **Source** set to the custom list and **Destination** set to **ICD-10-CM**.
3. Import the crosswalk with **Import CSV**, or add each row with **Find** on both sides.
4. Apply it with a Code map rule.

### Adding names to ICD-10-CM codes

1. Import ICD-10-CM.
2. Make a table with **ICD-10-CM** on both sides. It is a lookup table.
3. Add the codes you receive, then select **Fill names**.
4. Apply it with a Code map rule, with **When not found** set to **Keep the code as it is**, so a code the table doesn't hold still goes through.
