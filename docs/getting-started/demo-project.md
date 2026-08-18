---
title: Linkiir Demo Project
---

# Linkiir Demo Project

**Linkiir Demo** is a ready-to-run project you import as a zip bundle. It generates HL7 messages, sends them over LLP, stores the patients in a SQLite database, and serves them back through an HTTP API — a complete round trip built entirely with the native Linkiir scripting API.

Import it to get an understanding of how to create projects and workflows, as well as to get an understanding of how core nodes work.

**[Download Linkiir_Demo.linkiir.zip](pathname:///downloads/Linkiir_Demo.linkiir.zip)** (78 KB)

---

## What's inside

The project contains four workflows.

| Workflow | What it does |
| --- | --- |
| **Step 1: HL7 Message Generator** | Generates random HL7 ADT messages every 10 seconds and writes them to file |
| **Step 2: HL7 File to LLP** | Reads HL7 files, maps message fields, stamps the sending application, and forwards via LLP socket |
| **Step 3: HL7 LLP to Database** | Receives HL7 over LLP, filters for ADT events, extracts patient demographics, and writes them to a SQLite database |
| **Step 4: Patient Lookup API** | An HTTP endpoint that queries the patient database and returns results as JSON, with an interactive web UI |

Together they form a round trip: the generator produces messages, the file workflow sends them over LLP, the database workflow stores them, and the API reads them back.

```text
Step 1  ──file──▶  Step 2  ──LLP:5145──▶  Step 3  ──SQLite──▶  Step 4  ──HTTP:8081──▶  you
```

---

## Import the project

1. Open the Linkiir Studio in your browser.
2. Go to **Projects**.
3. Click the chevron on **Add Project** and choose **From zip**.
4. Drop [`Linkiir_Demo.linkiir.zip`](pathname:///downloads/Linkiir_Demo.linkiir.zip) on **Choose a project bundle**, or click to browse for it.
5. Click **Import**.

The project appears as **Linkiir Demo** with 4 workflows.

No additional setup is required. Everything the project needs is created automatically on first run.

---

## Start the workflows

Click into the project, then start the workflows in this order:

1. **Step 3: HL7 LLP to Database** — starts the LLP listener and creates the database
2. **Step 4: Patient Lookup API** — starts the web endpoint
3. **Step 1: HL7 Message Generator** — begins producing HL7 messages
4. **Step 2: HL7 File to LLP** — reads generated files and sends them to Step 3

Or click **Start All**. The order doesn't matter for correctness, since everything retries automatically — it only affects how many "connection refused" lines you see in the log while the listener comes up.

---

## Try the Patient Lookup API

Once Step 4 is running, open your browser to:

```text
http://localhost:8081/lookup
```

You'll see an interactive page where you can:

- Search patients by last name
- View all records in a table
- Reset the database for a fresh demo

The JSON API is also available:

| URL | Returns |
| --- | --- |
| `http://localhost:8081/lookup?LastName=Smith` | Patients matching that last name |
| `http://localhost:8081/lookup?all=1` | All patients as JSON |

---

## Configuration you may want to change

| Setting | Where | Default | Notes |
| --- | --- | --- | --- |
| LLP port | Step 2: **Send LLP** node config | `localhost:5145` | Must match Step 3's Receive LLP listen port |
| Listen port | Step 3: **Receive LLP** node config | `5145` | Change if the port is in use |
| HTTP route | Step 4: **Patient API** node config | `/lookup` | Change if it conflicts with another endpoint |
| Generator interval | Step 1: **Generate HL7** node config | `10000` ms | Increase for a quieter demo |
| File poll interval | Step 2: **Read HL7 Files** node config | `10000` ms | Match or exceed the generator interval |

---

## Reset the demo

To clear all patient data and start fresh:

1. Stop **Step 3: HL7 LLP to Database**, to release the SQLite lock.
2. Open the Patient Lookup page at `http://localhost:8081/lookup`.
3. Click the red **Reset DB** button.
4. Restart Step 3 and Step 1 to repopulate.

Or simply delete the `demo/` folder and restart all workflows — everything will be recreated.

---

## What the scripts demonstrate

Each row is a technique you can lift into your own interfaces.

| Technique | Where to see it |
| --- | --- |
| HL7 parsing and tree navigation | Step 2: **Map HL7** → `main.lua` |
| Message filtering by type | Step 3: **Filter ADT** → `main.lua` |
| SQLite database access | Step 3: **Write Patient DB** → `main.lua` |
| HTTP request handling + JSON API | Step 4: `main.lua` + `patient_db.lua` |
| Modular Lua with `require` | Step 4: three-file structure |
| Random HL7 message generation | Step 1: `hl7_generator.lua` |
| Self-provisioning (auto-create dirs/db) | `patient_db.lua` — `linkiir.sys.fs.mkdir` + `CREATE TABLE IF NOT EXISTS` |

Open any node in the **Scripting** tab to see the code, set breakpoints, and run tests against sample data.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Patient count stays the same | Step 3 not running, or LLP connection refused | Start Step 3 before Step 2 |
| "Connection refused" in logs | Step 3's LLP listener isn't up yet | Start Step 3, wait a moment, then start Step 2 |
| No files in `demo/messages/` | Files are being deleted after processing (normal) | That's expected — check the patient database for proof of flow |
| Patient API returns empty | No data written yet | Wait for the generator to produce a few messages |
| "Database is locked" | Step 3 and Reset DB running simultaneously | Stop Step 3 before resetting |

---


## Where to go next

| Goal | Read |
| --- | --- |
| Understand the node types the demo uses | [Interfaces and Core Nodes](../interface-development/interfaces/index.md) |
| Look up the functions the scripts call | [Linkiir Scripting API](../api/scripting-api/index.md) |
| Debug and test scripts the way the demo does | [Testing and Debugging](../interface-development/lua-programming/testing-debugging.md) |
| Build the same kind of interface from scratch | [Create a Project, Workflow, and HTTP Source Node](create-project-workflow.md) |
