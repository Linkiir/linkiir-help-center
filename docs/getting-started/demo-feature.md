---
title: Feature Demo
description: A ready-to-run Linkiir project that generates HL7, sends it over LLP, turns it into database rows with a Data Map, saves them with a Database node, and serves them back through a JSON API.
keywords: [demo, HL7, LLP, SQLite, Data Map, Database node, HTTP API, core nodes, getting started]
---

# Feature Demo

**Linkiir Demo** is a ready-to-run project you import as a zip bundle. It makes HL7 messages, sends them over LLP, turns each one into a database row with a **Data Map** node, saves the rows to SQLite with a **Database** node, and serves the patients back through a web page and JSON API.

Import it to see how projects and workflows fit together, and how the core nodes work.

**[Download Linkiir_Demo.linkiir.zip](pathname:///downloads/Linkiir_Demo.linkiir.zip)** (121 KB)

One of two [Demo Projects](demo-project.md). For a healthcare interoperability example, see the [HL7 v2 to FHIR Demo](demo-hl7v2-fhir.md).

---

## What's inside

Four workflows, numbered in the order a message passes through them:

```text
Step 1               Step 2                Step 3                        Step 4
Generate HL7  ──►  File to LLP  ──LLP──►  Data Map ──► Database  ◄──  Patient Lookup API
 (to files)        (send on)              (HL7 → row)  (SQLite)        (web page + JSON)
```

| Workflow | What it does |
| --- | --- |
| **Step 1: HL7 Message Generator** | Makes a random HL7 ADT message every 10 seconds and writes it to a file |
| **Step 2: HL7 File to LLP** | Reads the files, stamps the sending application, and sends each message over LLP |
| **Step 3: HL7 LLP to Database** | Receives the messages, maps each one to a `Patient` row with a Data Map, and saves it with a Database node |
| **Step 4: Patient Lookup API** | A web page and JSON API that read the patients back |

---

## Import the project

1. Open the Linkiir Grid in your browser.
2. Go to **Projects**.
3. Click the chevron on **Add Project** and choose **From zip**.
4. Drop [`Linkiir_Demo.linkiir.zip`](pathname:///downloads/Linkiir_Demo.linkiir.zip) on **Choose a project bundle**, or click to browse for it.
5. Click **Import**.

The project appears as **Linkiir Demo** with 4 workflows. There is nothing to set up: the folders, the database and its table are created the first time the workflows run.

---

## Start the demo

Click into **Linkiir Demo** and click **Start All**.

That's all. The workflows can start in any order: until Step 3 is listening, Step 2's **Send LLP** node keeps trying to connect, and both Step 3 and Step 4 create the database if it isn't there yet.

---

## See it working

Within about 20 seconds, patients start to arrive. Open the Patient Lookup page:

```text
http://localhost:8081/lookup
```

Each new message adds a patient, and the table fills up. On the page you can:

- search patients by last name
- click **Show All** to see the 100 most recently updated patients
- click **Reset DB** to delete every patient and watch the table fill again

The JSON API answers on the same route:

| URL | Returns |
| --- | --- |
| `http://localhost:8081/lookup?LastName=Smith` | Patients with that last name |
| `http://localhost:8081/lookup?all=1` | The 100 most recently updated patients |

---

## A tour of the workflows

Open any node on the **Scripting** page to see its code or its map. Each node with sample messages can be tried with **Run Test**, without starting anything.

### Step 1: HL7 Message Generator

| Node | Type | What it does |
| --- | --- | --- |
| **Generate HL7** | Custom source | Every 10 seconds, `main.lua` builds a random ADT message: an admit (A01), registration (A04), update (A08) or discharge (A03) |
| **Save to File** | File destination | Writes each message to `demo/messages/` |

`main.lua` is one short function. It builds the message with `linkiir.data.create`, fills fields such as `Msg.PID[8] = 'F'`, and pushes the text on.

### Step 2: HL7 File to LLP

| Node | Type | What it does |
| --- | --- | --- |
| **Read HL7 Files** | File source | Picks up the files in `demo/messages/` and deletes each one once it's read |
| **Stamp Sender** | Custom transform | Sets the sending application and facility (MSH-3 and MSH-4) to `Linkiir Grid` and `Demo Facility` |
| **Send LLP** | LLP destination | Sends each message to `localhost:5145`, where Step 3 listens |

### Step 3: HL7 LLP to Database

| Node | Type | What it does |
| --- | --- | --- |
| **Receive LLP** | LLP source | Listens on port 5145 and acknowledges each message |
| **HL7 to Patient Row** | Data Map | Turns each ADT message into a row for the `Patient` table |
| **Save Patient** | Database destination | Upserts the row into the SQLite database `demo/patient.db` |

**The Data Map.** Open **HL7 to Patient Row** on the Scripting page to see its **Map** view. Each line links an HL7 field to a column:

| HL7 field | Column | How |
| --- | --- | --- |
| PID-3.1 | `Id` | Copied. A message without one is rejected |
| PID-5.2, PID-5.1 | `FirstName`, `LastName` | Copied |
| PID-7 | `BirthDate` | Converted from `19720809` to `1972-08-09` |
| PID-8 | `Gender` | Looked up: `M` becomes `Male`, `F` becomes `Female`, anything else `Unknown` |
| PID-11.3, PID-11.4 | `City`, `State` | Copied |
| MSH-9.2 | `LastEvent` | Copied (`A01`, `A04` or `A08`) |
| (none) | `UpdatedAt` | The current date and time |

The map takes admits, registrations and updates. A discharge (A03) has no map, and the node's **Unknown Messages** setting is **Skip the message**, so the node logs `Skipped ADT_A03: no map takes it` and moves on.

The node has three samples: an admit, an update and a discharge. Pick one and click **Run Test** to see the row the map builds, or that the discharge is skipped.

**The Database node.** Select **Save Patient** and click **Configure** to see its settings: **Database** is `SQLite`, **Database File** is `demo/patient.db`, and **Write Mode** is `Upsert`, so a patient who already has a row is updated rather than added twice. Its **Tables** tab holds the `Patient` table, with `Id` as the primary key.

**Why there is a `create_database.lua`.** A Database node never creates tables by itself. In your own interfaces you create them once, from the **Configure** dialog. So that the demo runs as soon as it's imported, the Data Map node's `create_database.lua` creates `demo/patient.db` and its `Patient` table the first time the node starts.

### Step 4: Patient Lookup API

| Node | Type | What it does |
| --- | --- | --- |
| **Patient API** | HTTP source | Serves the search page and the JSON API on the `lookup` route |

Its code is split across three files: `main.lua` answers each request, `patient_db.lua` runs the SQL queries, and `patient_page.lua` holds the HTML page.

---

## Settings you may want to change

| Setting | Node | Default | Notes |
| --- | --- | --- | --- |
| Remote Port | Step 2: **Send LLP** | `5145` | Must match Step 3's listen port |
| Listen Port | Step 3: **Receive LLP** | `5145` | Change both if the port is in use |
| Route Path | Step 4: **Patient API** | `lookup` | Change it if it collides with another endpoint |
| Interval | Step 1: **Generate HL7** | `10000` ms | Raise it for a quieter demo |
| Interval | Step 2: **Read HL7 Files** | `10000` ms | Keep it close to the generator's |

---

## Reset the demo

- **Clear the patients:** click **Reset DB** on the lookup page. The workflows can keep running, and new messages fill the table again.
- **Start from scratch:** click **Stop All**, delete the `demo/` folder in the grid's working directory, then click **Start All**. The folder, database and table are created again.

---

## What the demo shows

| Technique | Where to see it |
| --- | --- |
| Building an HL7 message in Lua | Step 1: **Generate HL7** → `main.lua` |
| Reading and changing an HL7 message | Step 2: **Stamp Sender** → `main.lua` |
| Sending and receiving over LLP | Step 2: **Send LLP**, Step 3: **Receive LLP** |
| Mapping HL7 to database rows without code | Step 3: **HL7 to Patient Row** → Map view |
| Skipping messages a map doesn't take | Step 3: **HL7 to Patient Row** → **Unknown Messages** |
| Writing rows to a database without code | Step 3: **Save Patient** → **Configure** |
| An HTTP endpoint with a JSON API | Step 4: **Patient API** → `main.lua` |
| Splitting a script into modules with `require` | Step 4: `main.lua`, `patient_db.lua`, `patient_page.lua` |

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| No patients on the lookup page | The workflows haven't run long enough | Wait 20 seconds, then click **Show All** |
| **Send LLP** logs "Connection refused" | Step 3 isn't listening yet | Make sure Step 3 is running. **Send LLP** retries every 10 seconds |
| **Receive LLP** won't start | Port 5145 is in use | Change **Listen Port** on **Receive LLP** and **Remote Port** on **Send LLP** to a free port |
| `demo/messages/` is empty | Step 2 deletes each file once it's read | Nothing to fix. The patients on the lookup page show the messages got through |
| **Save Patient** stopped with "no such table: Patient" | The database was replaced by one without the table | Click **Stop All**, delete the `demo/` folder, and click **Start All** |

---

## Where to go next

| Goal | Read |
| --- | --- |
| Build your own maps | [Data Map Nodes](../interface-development/interfaces/data-map/index.md) |
| Write to your own database | [Database Node](../interface-development/interfaces/database-node.md) |
| Try the healthcare interoperability demo | [HL7 v2 to FHIR Demo](demo-hl7v2-fhir.md) |
| Understand the node types the demo uses | [Interfaces and Core Nodes](../interface-development/interfaces/index.md) |
| Look up the functions the scripts call | [Linkiir Scripting API](../api/scripting-api/index.md) |
| Debug and test scripts the way the demo does | [Testing and Debugging](../interface-development/lua-programming/testing-debugging.md) |
