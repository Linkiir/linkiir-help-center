---
title: HL7 v2 to FHIR Demo
description: A ready-to-run Linkiir project that converts HL7 v2 to FHIR and back, builds FHIR templates with the FHIR Profiler, validates resources against a FHIR server, and sends FHIR to a server — with the mapping in plain, editable Lua.
keywords: [demo, HL7 v2, FHIR, FHIR validation, FHIR profiling, FHIR profiler, mapping, getting started]
---

# HL7 v2 to FHIR Demo

A ready-to-run project that shows how Linkiir moves between **HL7 v2 and FHIR** in both directions, using the [Linkiir FHIR Adapters](../adapters/catalogs/fhir.md). It generates an HL7 v2 admit message and maps it to a FHIR Patient, validates that Patient against a FHIR server, and sends it on — then, separately, reads FHIR from a server and maps it back to HL7 v2.

Import it to learn, hands-on:

- How to **import a Linkiir project** from a zip bundle and **run its workflows**.
- How Linkiir **converts HL7 v2 to FHIR** and **FHIR back to HL7 v2**, with the field-by-field mapping kept in readable Lua.
- How the **FHIR Profiler** builds a FHIR JSON template, and how to **paste that template into a mapper** to drive the mapping.
- How the **FHIR Validator** checks a resource against a server before it is sent.
- How to **observe message data flowing through the queue** in the logs.

**[Download FHIR_Demo.linkiir.zip](pathname:///downloads/FHIR_Demo.linkiir.zip)** (1.1 MB)

One of two [Demo Projects](demo-project.md). For a tour of the core nodes, see the [Feature Demo](demo-feature.md).

:::info[This demo uses a public FHIR test server]
So it runs the moment you import it, the demo points at `https://hapi.fhir.org/baseR4` — a free public FHIR sandbox — with authentication set to **None**. It is for learning only; send no real patient data to it. Point the nodes at your own FHIR server by changing two settings (see [Point it at your own server](#point-it-at-your-own-server)).
:::

---

## What's inside

The project **FHIR Demo** contains three independent workflows.

| Workflow | Flow | What it shows |
| --- | --- | --- |
| **WK1 FHIR Profiler** | FHIR Profiling Tools (browser page) | Build a FHIR JSON template for any resource, with required fields locked and optional fields selectable |
| **WK2 HL7 v2 to FHIR** | Data Simulator → HL7v2 to FHIR Mapper → FHIR Validator → HAPI FHIR Destination | Map an HL7 v2 admit to a FHIR Patient, validate it, and send it to a FHIR server |
| **WK3 FHIR to HL7 v2** | HAPI FHIR Source → FHIR to HL7v2 Mapper → Print HL7v2 Destination | Read a Patient from a FHIR server and map it back to an HL7 v2 message |

Every node is self-contained — the project carries its own copy of the FHIR library code, so it imports and runs on a closed grid with no catalog subscription required.

---

## Step 1 — Import the project

1. Open the Linkiir Grid in your browser.
2. Go to **Projects**.
3. Click the chevron on **Add Project** and choose **From zip**.
4. Drop [`FHIR_Demo.linkiir.zip`](pathname:///downloads/FHIR_Demo.linkiir.zip) on **Choose a project bundle**, or click to browse for it.
5. Click **Import**.

The project appears as **FHIR Demo** with three workflows (WK1, WK2, WK3). No additional setup is required.

:::note[Outbound HTTPS]
WK2 and WK3 call the FHIR server over the network. On an air-gapped grid, those two workflows will report connection errors — WK1 (the Profiler) runs fully offline. Point WK2/WK3 at a reachable FHIR server to run them.
:::

---

## Step 2 — Run the workflows

Open the **FHIR Demo** project. On the **Workflows** tab you will see WK1, WK2, and WK3, each with a start control on its row. Start each one you want to try (or use **Start All**):

| Workflow | Start it to… | After starting |
| --- | --- | --- |
| **WK1 FHIR Profiler** | Serve the FHIR Profiler browser page | Open `http://localhost:8081/fhir-profiler` (see [Step 3](#step-3--use-the-fhir-profiler)) |
| **WK2 HL7 v2 to FHIR** | Generate HL7, map to FHIR, validate | Watch messages flow in the logs every minute (see [Step 5](#step-5--observe-message-data-in-the-logs)) |
| **WK3 FHIR to HL7 v2** | Read FHIR, map back to HL7 v2 | Watch the printed HL7 segments in the logs |

Both source nodes ship with **Live Mode on** and a **60-second interval**, so once a workflow is running it produces a message every minute with no further action. A node's state turns to **Running** on its row; a red **Errored** state means a node hit a problem — open it and read the log.

---

## Step 3 — Use the FHIR Profiler

The **FHIR Profiler** (WK1) is a browser tool that builds a blank FHIR JSON template for any resource. It is where the WK2 mapping template comes from.

1. Start **WK1 FHIR Profiler** on the Workflows tab.
2. Open the Profiler page on the HTTP server port:

   ```text
   http://localhost:8081/fhir-profiler
   ```

3. Choose a **FHIR version** (R4 or R5) and a **resource** such as `Patient`.
4. Select the fields you want. Required fields are checked and locked; optional fields (name, telecom, address, …) you can toggle on.
5. The page shows a live **FHIR JSON template** with `null` placeholders — the exact shape of the resource, every chosen field present and empty.
6. Click **Copy** to put that JSON on your clipboard.

See [FHIR Profiling Tools](../adapters/fhir-profiling-tools.md) for the full node reference.

---

## Step 4 — Paste the template into the WK2 mapper

The WK2 **HL7v2 to FHIR Mapper** does not build the FHIR Patient by hand. It starts from the Profiler's JSON template, fills in the fields it reads from the HL7 message, and drops the rest. The template lives in its own file so you can replace it with your own Profiler output.

1. Open **WK2 HL7 v2 to FHIR → HL7v2 to FHIR Mapper**, then its **Scripting** tab.
2. Open **`fhir_patient_template.lua`**. It holds the Profiler's JSON, pasted in as-is between `[==[` and `]==]`:

   ```lua
   local jsonStr = [==[
   {
     "resourceType": "Patient",
     "name": [ { "family": null, "given": [ null ], ... } ],
     "gender": null,
     "birthDate": null,
     ...
   }
   ]==]
   return jsonStr
   ```

3. To change the shape of the Patient, generate a new template in the FHIR Profiler ([Step 3](#step-3--use-the-fhir-profiler)), **Copy** it, and **paste it between the `[==[` and `]==]`** markers, replacing the JSON there. Save.
4. The mapper reads it with one line — `local fhir = linkiir.json.parse(require 'fhir_patient_template')` — then sets the fields it has and prunes the rest.

:::tip[Why a template]
Starting from a Profiler template means the FHIR structure is correct by construction — you only write the field assignments, not the nesting. Add a field to the template and it is ready for the mapper to fill; remove one and it disappears from the output.
:::

---

## Step 5 — Observe message data in the logs

With WK2 or WK3 running, open **Logs** (the **Log Search and Message History** page). Each node writes an entry as it handles a message, so you can watch one message move through the queue from node to node. Filter by the project or a node to follow a single workflow.

See [Log Search and Message History](../administration/logs/index.md) for filtering, message history, and queue counts.

### WK2 — HL7 v2 to FHIR, in the logs

Every interval the **Data Simulator** emits a synthetic HL7 v2.5.1 `ADT^A01` (admit) onto the queue, and the chain runs node by node:

1. **HL7v2 to FHIR Mapper** reads the HL7 `PID` segment and fills the FHIR template — identifier (MRN), name, gender (normalized from the HL7 code), birth date, phone, and address.
2. **FHIR Validator** posts the Patient to the server's `$validate` operation and only forwards it when the server reports no errors.
3. **HAPI FHIR Destination** sends the validated Patient to the FHIR server with a `POST`.

A single message produces log lines like:

```text
Data Simulator: simulated 1 x HL7 v2.5.1 ADT^A01 (Admit)
FHIR Validator: valid, forwarded. no blocking issues (1 informational note)
HAPI FHIR Destination: Live Mode is off, nothing sent. Turn Live Mode on to POST to https://hapi.fhir.org/baseR4.
```

:::note[The destination ships safe]
The **HAPI FHIR Destination** has **Live Mode off** by default, so it validates and prepares the write but does not actually `POST` to the shared public server. You still see the full chain run and the Patient reach the destination. Turn **Live Mode on** in the node's config when you want it to write for real — against your own server, not the public sandbox.
:::

### WK3 — FHIR to HL7 v2, in the logs

The **HAPI FHIR Source** polls the server for Patients (two per interval) and pushes each one downstream. The **FHIR to HL7v2 Mapper** turns it into an HL7 v2 `ADT^A08` (update), and the **Print HL7v2 Destination** logs each segment so you can read the result:

```text
HAPI FHIR Source: pushed 2 Patient resource(s).
Print HL7v2: received a transformed HL7 v2 message (154 bytes):
  MSH|^~\&|LINKIIR|LINKIIR GRID|RECEIVER|FACILITY|...|ADT^A08^ADT_A01|...|P|2.5.1
  EVN|A08|...
  PID|1||MRN100001^^^LINKIIR^MR||SMITH^JAMES||19800115|M|||123 OAK AVENUE^^CHICAGO^IL^60601^USA||(312)555-0142
Print HL7v2: printed 3 segment(s).
```

Reading WK2's log then WK3's log side by side shows the full round trip: an HL7 admit becomes a FHIR Patient, and a FHIR Patient becomes an HL7 update.

:::tip[Public data is sparse]
Patients on the public HAPI server often lack a name or birth date, so some printed `PID` segments have empty fields. That is the real upstream data, not a mapping error — WK2 (simulator-sourced) shows fully populated messages.
:::

---

## Where the mapping lives

Both directions keep the field-by-field translation in its own module, separate from the node glue, so you can read and change the mapping on its own. Open any node's **Scripting** tab to read the code, set breakpoints, and run tests against the sample messages.

### WK2 — HL7 v2 to FHIR

| File | Role |
| --- | --- |
| **HL7v2 to FHIR Mapper → `hl7v2_to_fhir_map.lua`** | The field-by-field mapping (`toPatient`): read the HL7 `PID` by position, fill the template, prune unset fields. Edit this to change what maps where. |
| **HL7v2 to FHIR Mapper → `fhir_patient_template.lua`** | The blank FHIR Patient from the FHIR Profiler. Replace it to change the output shape ([Step 4](#step-4--paste-the-template-into-the-wk2-mapper)). |
| **HL7v2 to FHIR Mapper → `main.lua`** | Node glue: receive the message, call the mapper, forward the JSON. |
| **HAPI FHIR Destination → `main.lua`** | Receives the validated Patient and `POST`s it to the server with the `hapi_fhir` library. |

Values are read straight off the parsed message by position, the same way the Scripting tree viewer shows it — the patient's surname, for example, is `Msg.PID[5][1][1][1]`.

### WK3 — FHIR to HL7 v2

| File | Role |
| --- | --- |
| **FHIR to HL7v2 Mapper → `fhir_to_hl7v2_map.lua`** | The reverse mapping (`toADT`): FHIR Patient → HL7 v2 `MSH`/`EVN`/`PID`, built with `linkiir.data.create` and written by position. |
| **FHIR to HL7v2 Mapper → `main.lua`** | Node glue: parse the FHIR JSON, call the mapper, forward the HL7. |
| **Print HL7v2 Destination → `main.lua`** | Splits the message on segment boundaries and logs each segment. |

---

## What the scripts demonstrate

Each row is a technique you can lift into your own interfaces.

| Technique | Where to see it |
| --- | --- |
| Reading HL7 v2 by position (segment → field → component) | WK2: **HL7v2 to FHIR Mapper** → `hl7v2_to_fhir_map.lua` |
| Starting a FHIR resource from a Profiler template | WK2: **`fhir_patient_template.lua`** + `linkiir.json.parse` |
| Keeping mapping in a separate, reviewable module | Both mappers: `*_map.lua` beside a thin `main.lua` |
| Validating FHIR against a server before sending | WK2: **FHIR Validator** |
| Sending a resource to a FHIR server (`POST`) | WK2: **HAPI FHIR Destination** → `main.lua` |
| Reading from a FHIR server on an interval | WK3: **HAPI FHIR Source** |
| Building HL7 v2 by position with `linkiir.data.create` | WK3: **FHIR to HL7v2 Mapper** → `fhir_to_hl7v2_map.lua` |
| Building a FHIR JSON template | WK1: **FHIR Profiler** browser page |

---

## Point it at your own server

The same nodes work against any FHIR R4/R5 server. On the FHIR **source** (WK3) and FHIR **destination** (WK2) nodes, change two settings:

| Setting | Public demo | Your server |
| --- | --- | --- |
| **FHIR Base URL** | `https://hapi.fhir.org/baseR4` | The endpoint your server provides |
| **Authentication** | `None (public test endpoint)` | `OAuth2 Backend Services` (or Bearer / Basic), then fill the credential fields |

The nodes ship their credential fields empty; enter yours after import. To actually write to your server, also turn **Live Mode on** on the HAPI FHIR Destination. See the [FHIR adapter reference](../adapters/hapi-fhir.md) for every field.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| WK2/WK3 log connection or timeout errors | The grid can't reach `hapi.fhir.org`, or the server is busy | Check outbound HTTPS; the public server is sometimes slow — the next interval retries |
| Nothing appears in the logs | The workflow is stopped, or a source node's **Live Mode** is off | Start the workflow; confirm the Data Simulator / HAPI FHIR Source show **Live Mode on** |
| HAPI FHIR Destination logs "nothing sent" | **Live Mode is off** (the safe default) | Expected — turn Live Mode on to write to a server you own |
| FHIR Validator stops the message | The server reported a real error on the resource | Read the node log; the summary lists the issues by severity |
| WK3 prints `PID` segments with empty fields | The public Patient had no name/DOB | Expected with public test data; WK2 shows full messages |
| The Profiler page won't load | WK1 is stopped, or the embedded HTTP server is off | Start WK1; check the HTTP server is enabled |

---

## Where to go next

| Goal | Read |
| --- | --- |
| The FHIR adapters this demo builds on | [Linkiir FHIR Adapters](../adapters/catalogs/fhir.md) |
| The profiling node in depth | [FHIR Profiling Tools](../adapters/fhir-profiling-tools.md) |
| The validation node in depth | [FHIR Validator](../adapters/fhir-validator.md) |
| The read/write FHIR client | [HAPI FHIR Adapter](../adapters/hapi-fhir.md) |
| Searching logs and message history | [Log Search and Message History](../administration/logs/index.md) |
| The core-nodes tour | [Feature Demo](demo-feature.md) |
