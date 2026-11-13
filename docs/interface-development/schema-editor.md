---
title: Schema Editor
description: Build and edit the schemas a node reads and writes messages with — HL7 v2, X12, FHIR, CDA and C-CDA, database tables, and your own JSON and XML structures.
keywords: [schema, grammar, schema editor, HL7, X12, FHIR, CDA, C-CDA, JSON, XML, database, matching rules, code sets, copy message, custom message]
---

# Schema Editor

A **schema** describes the messages a node works with: which messages exist, what they are made of, and how to tell them apart. Scripts read and build messages through a schema (`linkiir.data.extract`, `linkiir.data.create`, `linkiir.data.parse`), and a [Data Map node](interfaces/data-map/index.md) maps between a source schema and a destination schema.

A schema is a JSON file in the node, versioned with the rest of the node's files. The **Schema Editor** is the tree view the Scripting tab shows in place of the text editor whenever you open one.

---

## Kinds of schema

| Kind | Describes | Made of | Messages come from |
| --- | --- | --- | --- |
| **HL7 Schema** | HL7 v2 messages | Messages → segments → fields → composites, plus code sets | HL7 v2.1 to v2.8.1 catalogs |
| **X12 Schema** | X12 transaction sets | Transaction sets → loops → segments → elements | X12 4010 and 5010 catalogs (HIPAA healthcare and general EDI) |
| **FHIR Schema** | FHIR resources and Bundles, JSON or XML | Resources → elements → data types | FHIR R4 (4.0.1), R4B (4.3.0) and R5 (5.0.0) catalogs |
| **CDA Schema** | CDA R2 documents, including C-CDA document types | The ClinicalDocument → its classes and data types | CDA R2 and C-CDA 5.0 catalog |
| **DB Schema** | Database tables | Tables → columns | A live database, or built by hand |
| **JSON Schema** | Your own JSON documents | Structures → properties → object types | A sample document, or built by hand |
| **XML Schema** | Your own XML documents | Documents → elements and attributes → element types | A sample document, or built by hand |

The JSON and XML kinds describe documents of your own design, such as an API's request or response, rather than a published standard. They are Linkiir schemas, not JSON Schema or XSD files.

---

## Creating and opening a schema

1. In the Scripting tab, select **New File** at the top of the Explorer, or right-click a folder and select **New file**.
2. Name the file and choose its kind (**HL7 Schema**, **FHIR Schema**, **DB Schema**, and so on).

Opening any schema file shows the Schema Editor. **Code** switches to the file's raw JSON and **Schema** switches back. Edits in either view are saved, committed and diffed like any other file.

A Data Map node keeps its schemas in `source.json` and `destination.json`. In that node, **Source schema** and **Destination schema** sit beside **Map** and **Code**, and **Go to definition** on a row of the Map view opens the editor on the segment, table or field it comes from.

---

## The layout

The left panel lists the schema's parts in sections, with a search box above them. The names follow the kind of schema:

| Kind | Sections |
| --- | --- |
| HL7, X12 | Message Definitions · Segments · Composites · Code Sets |
| FHIR | Message Definitions · Resources · Data Types · Code Sets |
| CDA | Message Definitions · Documents · Types · Code Sets |
| DB | Tables · Code Sets |
| JSON | Structures · Object Types · Code Sets |
| XML | Documents · Element Types · Code Sets |

Selecting an item opens it in the detail panel on the right. Each section's **+** button adds an item. Right-clicking an item offers **Duplicate** and **Delete**.

The **Schema Check** box lists problems that would stop the schema from working, such as a message that refers to a segment that doesn't exist, or a matching rule with an invalid regular expression.

---

## Adding standard messages

For HL7, X12, FHIR and CDA, **+ Message** searches the standard catalogs that ship with Linkiir:

1. Select **+ Message** in **Message Definitions**.
2. Pick the release, for example HL7 v2.5.1, X12 5010 or FHIR R4. X12 and CDA also have a filter: HIPAA Healthcare or General EDI, and CDA R2 or C-CDA Document Types.
3. Search for the message (`ADT^A01`, `837P`, `Patient`, `CCD`) and select it.

The message is copied into the schema together with every segment, data type and, if **Include code sets** is ticked, code set it uses. The new message also gets the matching rules that recognise it. **Blank message** starts an empty definition instead.

The catalogs are served by the Grid, so importing needs no internet access.

### Copying a message from another schema

A message you have already shaped, such as a trading partner's ORU^R01 with its own segments, can be copied from another schema rather than built again:

1. Select **+ Message**, then **From another schema…** at the top.
2. Pick the message. The schemas of the same kind in every project you are on are listed by project and workflow, each folded until you open it or search. **Load a schema file…** reads one from your computer instead.
3. Check **Name here**. A message is known by its name, so to keep both your own ORU^R01 and the standard one, call yours something like `ORU_R01_LAB`. A name the schema already has is replaced only when you agree.

The copy is exact: the message reads just as it did where it came from. Where this schema defines one of its segments, data types or code sets differently, the copy brings its own beside it, such as a second `OBX` or a `CWE_2`, used only by the copied message. The schema's other messages don't change.

The message's [matching rules](#matching-rules) come with it, placed before any rule that matches everything they match and more. When one of the schema's rules can no longer be reached, for example two messages told apart by MSH-9 alone, the copy says so: add a condition on MSH-3 or MSH-21 to tell them apart.

### FHIR

A FHIR schema reads resources in JSON or XML, telling the two apart by the first character. Add each resource type your messages carry, and `Bundle` for Bundles. A FHIR message is recognised by its matching rules, such as `resourceType` equals `Patient`.

### CDA and C-CDA

The CDA catalog holds the base CDA R2 `ClinicalDocument` and the twelve C-CDA 5.0 document types: CCD, Care Plan, Consultation Note, Discharge Summary, History and Physical, Operative Note, Procedure Note, Progress Note, Referral Note, Transfer Summary, Patient Generated Document and Unstructured Document. A C-CDA document type brings the templates, sections and rules C-CDA sets for it. A Data Map node uses these rules to check the documents it builds. See [Data Map formats](interfaces/data-map/formats.md#cda-and-c-cda).

---

## Matching rules

A schema with messages says how to recognise each one. Open a message and select **Rules** to see them. A **rule** lists conditions, and every condition must hold. A message can have several rules, and any one of them is enough. The first message whose rule matches is the one the message is read as.

| Kind | A condition reads | Example |
| --- | --- | --- |
| HL7, X12 | A segment, field and component | `MSH` field 9, component 1, equals `ADT` |
| FHIR, CDA | An element path | `resourceType` equals `Patient`, `templateId.root` equals `2.16.840.1.113883.10.20.22.1.2` |

The operators are **equals**, **starts with** and **matches regex**.

Database, JSON and XML schemas have no messages and no matching rules. A script or Data Map names the table or structure it wants.

---

## How an HL7 v2 schema shapes the message

A script or Data Map reads an HL7 v2 message as a tree, and the schema decides its shape:

- **Rep** on a segment's field: a field that repeats holds its repetitions, each holding components (`PID[3][1][1]`). A field without **Rep** holds its components directly (`MSH[9][2]`).
- A message definition's **Group** rows: when a message fits the definition, each segment sits in its group, so a script reaches it through the group (`Msg.PATIENT_RESULT.PATIENT.PID`).
- **Max** on a segment or group row: one that can repeat, read by name, gives its occurrences (`Msg.NK1[2]` is the second NK1).

Changing these changes the paths a script uses for the messages this schema reads. See [HL7 v2 trees](../api/scripting-api/message-data.md#hl7-v2-trees).

---

## Database tables

A **DB Schema** describes tables: each column's name, type and size, whether it is part of the key, and whether it can be null. **Database** at the top of the left panel picks the dialect, which sets the column types on offer: **SQL Server**, **PostgreSQL**, **Oracle**, **SQLite**, or **Any database** for a table that has to work in all four. Under **Any database**, **In each database** shows what each column becomes in each one.

| To | Do this |
| --- | --- |
| Read tables from an existing database | **Import** in **Tables**. Enter the connection, tick the tables, or type a name, and **Import**: each table's columns and primary key are added. Tables the schema already has are replaced only when you agree, keeping their descriptions and code sets |
| Create a table from the schema | Open the table and select **Export to database…**. A table that already exists is left as it is |

The connection form takes the server settings, or, with **Connect using**, an **ODBC DSN** (SQL Server, PostgreSQL) or a **TNS alias** (Oracle) in their place. Opened from a project's node, its fields take the project's `${project:name}` [variables](../administration/configurations/project-settings.md#variables), filled in when the Grid connects. The connection is used for that request only: it isn't saved in the schema or remembered by the browser. To reuse one, keep it in project variables.

A [Database node](interfaces/database-node.md) keeps its tables in its own `schema.json`. Opened from the node with **Edit Schema**, the editor imports and exports with that node's connection, so you don't enter it again.

Connecting needs the database's driver installed on the Linkiir server. SQL Server needs Microsoft **ODBC Driver 18 for SQL Server**. See [Database Drivers](../administration/configurations/database-drivers.md).

In a script, `linkiir.store.tables{ name = 'patients', schema = 'clinic.json' }` checks each value you set against its column as you set it. See [Database](../api/scripting-api/database.md).

---

## JSON and XML structures

A **JSON Schema** or **XML Schema** describes your own documents:

- A **structure** (JSON) or **document** (XML) is a top-level object or root element.
- Its **properties** or **elements** are its fields. In XML, a field can be an element, an attribute, or the element's text.
- Every nested object or element gets a type of its own, listed under **Object Types** or **Element Types**.
- A field that **repeats** is a JSON array or a repeated XML element.

The quickest start is **Import** in **Structures** or **Documents**. Paste a sample document, optionally name the structure, and the editor builds the structure and its types from it. Types with the same name are merged, and nothing is marked required. Afterwards, check each field's type: a value such as a ZIP code or an ID with only digits is read as a number from a sample and may need to be a string.

Scripts read these documents with `linkiir.data.parse` and write them with `linkiir.data.serialize`:

```lua
local Order = linkiir.data.parse{ schema = 'order.json', data = Data }
-- Plain Lua tables, typed by the schema: numbers are numbers, lists are arrays.
for _, Line in ipairs(Order.lines) do
   Line.total = Line.qty * Line.price
end
linkiir.flow.push{ data = linkiir.data.serialize(Order) }
```

A value of the wrong type raises an error naming where it is (`Order.lines[2].qty: expected an integer, got a string`). `linkiir.data.extract` and `linkiir.data.create` don't read these schemas. See [Message Data](../api/scripting-api/message-data.md).

---

## Related

- [Data Map Nodes](interfaces/data-map/index.md)
- [Code Sets](lua-programming/code-sets.md)
- [Message Data API](../api/scripting-api/message-data.md)
