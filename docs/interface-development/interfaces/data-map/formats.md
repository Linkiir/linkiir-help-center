---
title: Data Map Formats
description: How the Data Map node reads and builds HL7 v2, FHIR, X12, CDA and C-CDA, database rows, and JSON and XML — paths, lists, and what each format fills in for you.
keywords: [data map, HL7 v2, FHIR, Bundle, X12, loops, CDA, C-CDA, conformance, database rows, JSON, XML, paths]
---

# Formats

Rules, conditions and custom Lua all name fields by **path**. Each format has its own paths, and its own particulars.

| Format | Path examples |
| --- | --- |
| HL7 v2 | `PID-5`, `PID-5.1`, `PV1-3.4`, `PID` (the whole segment) |
| FHIR | `Patient.name[].family`, `Patient.identifier[].value`, `Bundle.timestamp` |
| X12 | `BHT-4`, `2010BA/NM1-3`, `2300/DTP[472]-3`, `2000C/2300/CLM-5.1` |
| CDA | `ClinicalDocument.recordTarget[].patientRole.id[].@root`, `component.structuredBody.component[].section[11450-4]` |
| Database rows | `patients.mrn`, `allergies.code` |
| JSON, XML | `Order.lines[].sku`, `order.@status`, `weight.xmlText` |

`[]` marks a list. A rule from a list into a list maps each item.

---

## HL7 v2

- **Output starts as** a **Copy of the input**, changed only where you map, or as an **Empty message** built from your rules. A copy keeps every segment it doesn't drop.
- A segment can be written **once per item** of the input: one `NK1` per FHIR contact, one `OBX` per JSON result. Rules under it read from that item, and **Set ID** numbers the copies.
- A segment can be made **under** another, such as an OBX under its own OBR. See [Items made inside other items](building-maps.md#items-made-inside-other-items).
- **As a source**, a segment's own group is read by the message structure: an OBX's OBR is the one above it, and an OBR's OBXs are those in its group.
- **As a destination**, a message whose structure has groups is built in them: each OBX goes in an OBSERVATION of its own, and a second OBR starts another ORDER_OBSERVATION.
- Values are kept exactly as received, escapes included, so a copied field writes back unchanged.
- MSH-7, MSH-9, MSH-10 and MSH-12 can be filled by Auto-map, or set with **Current date/time**, a **Fixed value** and **New control ID**.

## FHIR

**As a source**, a map takes one resource type (`Patient`) or a Bundle:

- `Bundle` takes any Bundle. `Bundle^A04` takes only message Bundles whose MessageHeader names that event, by event code or URI.
- **Resources in it** lists the resource types read from the Bundle. `Patient.name` reads the Bundle's first `Patient`.
- A segment can be made once per resource of a type, such as one `AL1` per `AllergyIntolerance`, or per item of a list (`Patient.contact[]`).

**As a destination**, the output is a Bundle (**transaction**, **batch** or **collection**) or a **Single resource**. A resource can be made once per item, such as one `Observation` per `OBX`. References between the resources, such as `subject` → `Patient`, are filled in for you. Made under another, such as a `DiagnosticReport` per `OBR` with its `Observation`s under it, each refers to its own. A list in a resource, such as `contact`, can have one item per input item (**each NK1**).

FHIR to FHIR is not supported. Use a Transform Custom node.

## X12

- Paths name the loops a segment sits in, from the outside in, as deep as needed: `2010BA/NM1-3` is the subscriber name wherever 2010BA appears. A qualifier picks one of several segments with the same name: `DTP[472]-3` is the service date.
- Reading starts at the nearest loop. In a rule made per claim (`2300`), `2010BA/NM1-3` reads that claim's subscriber.
- When building, the envelope (ISA, GS, ST), control numbers, HL numbering, loop qualifiers and segment counts (SE, GE, IEA) are filled in for you.
- X12 4010 and 5010 are both supported, including the HIPAA healthcare transaction sets (270/271, 276/277, 278, 834, 835, 837P/I/D) and general EDI.

## CDA and C-CDA

The destination's document type decides the rules:

| Document type | Rules |
| --- | --- |
| `ClinicalDocument` | Base CDA R2 |
| A C-CDA document type, such as Continuity of Care Document (CCD) | C-CDA 5.0: the document's templates, required sections and entries |

**Sections** are added by name (Problems, Results, Allergies…), and a section's entries can be made per item: one result observation per `OBX`.

What C-CDA fixes is written for you: template IDs, codes, and the parts every document needs, such as a new document ID, the effective time, language and a narrative. A required section with nothing to put in it is written as "No information".

The map's **conformance** setting decides what happens when a built document breaks the rules:

| Setting | A document that breaks a rule is |
| --- | --- |
| **Enforce rules** (default) | Rejected with the rule it breaks, and handled by **On Error** |
| **Warn on rules** | Sent, with a warning logged |
| **No rules check** | Sent without checking |

A map that reads CDA can check its input the same way: **Input unchecked** (default), **Warn on input** or **Enforce on input**.

## Database rows

A Data Map node doesn't connect to a database. Rows travel as JSON, so a source upstream reads them and a node downstream writes them:

```json
{
  "patients": { "mrn": "12345", "family_name": "Doe", "given_name": "Jane" },
  "allergies": [ { "code": "1191", "description": "Aspirin" } ]
}
```

- **As a source**, the message is an object of tables: the map's main table and any child tables, each a row or a list of rows. The node's `main.lua` reads it with `mapper.read`.
- **As a destination**, the map writes a main table row and child tables made once per item, such as one `allergies` row per `AL1`. The main table can be made per item too: one order row per `OBR` writes a row for each order an ORM carries. Each value is checked against its column's type and size.
- **Rows under rows** (a legacy engine's MESSAGE_ID and PARENT_ID, as columns): a table made under another gets its row's key with **Parent's value**. Read back, a table under another names the column holding that key. See [Items made inside other items](building-maps.md#items-made-inside-other-items).
- The tables come from a [DB Schema](../../schema-editor.md#database-tables), which can be imported from a live database. In a new node, the source or destination column offers to open the Schema Editor to set them up.
- **A map reading rows can get its tables in the New map wizard.** When a [Database source](../database-source-node.md) sends to the node (directly, or through nodes such as a filter), **Use tables from** _node_ copies its tables into the source schema, converted to the source schema's database when the two differ. **Import from database…** reads tables from the database: through that Database source's connection when there is one, otherwise through a connection you enter, which can use the project's [variables](../../../administration/configurations/project-settings.md#variables). The tables go into the source schema with the map.

To write the rows, connect a [Database node](../database-node.md). It inserts or upserts them into SQL Server, PostgreSQL, Oracle or SQLite with no script, and **Add table from upstream node** copies the map's destination tables into it. For anything the node doesn't do, use a Transform Custom node that calls `Connection:merge`. See [Database](../../../api/scripting-api/database.md).

### Linked Database nodes

A Data Map and a Database node next to it each keep their own copy of the tables: a Database source's `schema.json` and the Data Map's source schema, or the Data Map's destination schema and a Database destination's `schema.json`. They are **linked** when one sends to the other, directly or through nodes that hold no tables of their own. Tables are matched by name, ignoring case.

Nothing changes one copy because the other changed, unless you say so:

- **In the Map view**, when the map's tables differ from a linked Database node's, a warning above the board names them: *This map's tables differ from those of Patient Feed: patients, allergies.* **Review** lists each table as **Only in** _node_, **Only in this map** or **Differs**, with what differs. Tick the tables to copy and, for one in both, pick **Update this map** or **Update** _node_. Nothing changes until **Apply**. A change to this map is saved with its other edits, uncommitted; a change to the Database node is committed at once.
- **In the Database node's Configure dialog**, saving tables that a linked Data Map also has asks **Update linked Data Maps?**, listing what the save would add, update or remove in each. Tick **Also update** _map_ to copy the changes into it. See [Database Node](../database-node.md#linked-data-maps).

A table ticked **Don't ask again**, in either place, is left out of both from then on. **Review** lists those tables under **Not asked about**, each with **Ask again**. The choice is kept in the Data Map's `linked_tables.json`.

A table copied between schemas for different databases is converted column by column. One with a column that has no type in the other database isn't copied, and says why. Copying tables changes only the schemas: create or alter the tables in the database from the Database node's **Tables** tab, and for a Database source, link a new table from a status table on its **Record** tab before the node reads it.

## JSON and XML

Your own documents, described by a [JSON or XML schema](../../schema-editor.md#json-and-xml-structures). A map takes and builds a **structure**: a JSON object or an XML root element.

- Paths are the names `linkiir.data.parse` gives: `Order.customer.name`, `Order.lines[].sku`. In XML, an attribute is read by its name, or as `@name` when a child element shares it, and an element's text is `xmlText`.
- Values take their schema type: numbers are written as numbers, booleans as `true`/`false`.
- The output can start as a copy of the input when the source and destination are the same format (JSON to JSON, XML to XML).

## Next

- [Testing and Errors](testing-and-errors.md)
