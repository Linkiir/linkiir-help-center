---
title: HL7 v2 to FHIR Demo
description: A ready-to-run Linkiir project that converts HL7 v2 to FHIR and back, builds FHIR templates with the FHIR Profiler, validates resources against a FHIR server, and sends FHIR to a server — with the mapping in plain, editable Lua.
keywords: [demo, HL7 v2, FHIR, FHIR validation, FHIR profiling, FHIR profiler, mapping, getting started]
---

# HL7 v2 to FHIR Demo

This project demonstrates how Linkiir Grid can be used to create a **HL7 v2 to FHIR** integration, using schemas and the data map node for graphical mapping. It generates an HL7 v2 admit message and maps it to a FHIR Patient, validates that Patient against a FHIR server, and sends it. Also included is a ready-to-run workflow that reads FHIR from a server and maps it back to HL7 v2.

Import it to learn, hands-on:

- How to **import a Linkiir Grid project** from a zip bundle and **run its workflows**.
- How Linkiir Grid **converts HL7 v2 to FHIR** and **FHIR back to HL7 v2**, with the graphical mapping node, or a traditional coding experience.
- How the **FHIR Validator** checks a resource against a server before it is sent.
- How to **observe message data flowing through the queue** in the logs.

**[Download FHIR_Demo.linkiir.zip](pathname:///downloads/FHIR_Demo.linkiir.zip)** (1.1 MB)

One of two [Demo Projects](demo-project.md). For a tour of the core nodes, see the [Feature Demo](demo-feature.md).

:::info[This demo uses a public FHIR test server]
So it runs the moment you import it, the demo points at `https://hapi.fhir.org/baseR4` — a free public FHIR sandbox — with authentication set to **None**. It is for learning only; send no real patient data to it. Point the nodes at your own FHIR server by changing two settings (see [Point it at your own server](#point-it-at-your-own-server)).
:::

---

## What's inside

The project **FHIR Demo** contains two independent workflows.

| Workflow | Flow | What it shows |
| --- | --- | --- |
| **HL7 v2 to FHIR** | Data Simulator → HL7v2 to FHIR Mapper → FHIR Validator → HAPI FHIR Destination | Map an HL7 v2 admit to a FHIR Patient, validate it, and send it to a FHIR server |
| **FHIR to HL7 v2** | HAPI FHIR Source → FHIR to HL7v2 Mapper → Print HL7v2 Destination | Read a Patient from a FHIR server and map it back to an HL7 v2 message |

---

## Step 1 — Import the project

1. Open the Linkiir Grid in your browser.
2. Go to **Projects**.
3. Click the chevron on **Add Project** and choose **From zip**.
4. Drop [`FHIR_Demo.linkiir.zip`](pathname:///downloads/FHIR_Demo.linkiir.zip) on **Choose a project bundle**, or click to browse for it.
5. Click **Import**.

The project appears as **FHIR Demo** with two workflows. No additional setup is required.

:::note[Outbound HTTPS]
Both workflows call the public HAPI FHIR server over the network. On an air-gapped grid, those two workflows will report connection errors.
:::

---

## Step 2 — Open the mapping view

1. Open the **FHIR Demo** project. On the **Workflows** tab, locate the **HL7 v2 to FHIR** workflow. Select the **hammer** icon to open it in the **workflow builder**.
2. Select the **ADT to FHIR** transform node. Either by right clicking the node, or using the option at the bottom of the node parameters select **edit map**.

The mapping screen is the canvas to create your message transformation. This node has been pre setup to transform an HL7 v2 ADT^A01 into a FHIR R4 message. In the next step, you will define the destination message, and begin the transformation.

---

## Step 3 — Create the message mapping

For this mapping we are creating a **FHIR R4 Patient resource**

1. In the destination panel (right side), select the add resource dropdown. In the dropdown, select the **Patient** resource.
2. Select the **Auto-map** option, located at the top right of the destination panel.
3. Use the **Run Test** on the top toolbar to run the mapping with the sample, and see the final output.
4. Use the **Commit** button to save your changes. You can write a custom commit message, or select **Use the summary** to generate a summary of changes.

This is a good time to select the different mappings, to get a better idea of how each field is mapped, as well as the options available for built in functions and tools.

---

## Step 4 — Run the HL7 v2 to FHIR workflow

Now that we have created and saved the mapping, we can run the workflow end-to-end.

1. Navigate to the monitor tab.
2. In the monitor tab, locate the **HL7 v2 to FHIR** workflow under the **FHIR Demo** project, and select the **Start** button.
3. Right click the **HL7 v2 to FHIR** workflow, and select **Open in logs**. After a few moments, the newly processed data will appear.
4. In the **INFO** log from the **FHIR Validator** node, confirm that it reports no blocking issues.

By selecting the **Related messages** option in the logs, you can see the full end to end trip of the message. Starting from the message generator, mapping from ADT^A01 to FHIR Patient, validation, and sending to the HAPI FHIR server.

:::note[The destination ships safe]
The **HAPI FHIR Destination** has **Live Mode off** by default, so it validates and prepares the write but does not actually `POST` to the shared public server. You still see the full chain run and the Patient reach the destination. Turn **Live Mode on** in the node's config when you want it to write for real — against your own server, not the public sandbox.
:::

---

# FHIR to HL7 v2

Also included in this demo project is a **FHIR to HL7 v2** workflow. This workflow represents the transformation in the opposite direction, and makes use of a traditional **custom scripting** node, rather than the **data map** node.

The **HAPI FHIR Source** polls the server for Patients (two per interval) and pushes each one downstream. The **FHIR to HL7v2 Mapper** turns it into an HL7 v2 `ADT^A08` (update), and the **Print HL7v2 Destination** logs each segment so you can read the result:

```text
HAPI FHIR Source: pushed 2 Patient resource(s).
Print HL7v2: received a transformed HL7 v2 message (154 bytes):
  MSH|^~\&|LINKIIR|LINKIIR GRID|RECEIVER|FACILITY|...|ADT^A08^ADT_A01|...|P|2.5.1
  EVN|A08|...
  PID|1||MRN100001^^^LINKIIR^MR||SMITH^JAMES||19800115|M|||123 OAK AVENUE^^CHICAGO^IL^60601^USA||(312)555-0142
Print HL7v2: printed 3 segment(s).
```

:::tip[Public data is sparse]
Patients on the public HAPI server often lack a name or birth date, so some printed `PID` segments have empty fields. That is the real upstream data, not a mapping error — HL7 v2 to FHIR shows fully populated messages.
:::

---

## Where the mapping lives

Open the node's scripting page to see the files and mapping.

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
| Keeping mapping in a separate, reviewable module | `*_map.lua` beside a thin `main.lua` |
| Reading from a FHIR server on an interval | **HAPI FHIR Source** |
| Building HL7 v2 by position with `linkiir.data.create` | **FHIR to HL7v2 Mapper** → `fhir_to_hl7v2_map.lua` |

---

## Point it at your own server

The same nodes work against any FHIR R4/R5 server. On the FHIR **source** and FHIR **destination** nodes, change two settings:

| Setting | Public demo | Your server |
| --- | --- | --- |
| **FHIR Base URL** | `https://hapi.fhir.org/baseR4` | The endpoint your server provides |
| **Authentication** | `None (public test endpoint)` | `OAuth2 Backend Services` (or Bearer / Basic), then fill the credential fields |

The nodes ship their credential fields empty; enter yours after import. To actually write to your server, also turn **Live Mode on** on the HAPI FHIR Destination. See the [FHIR adapter reference](../adapters/hapi-fhir.md) for every field.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| log connection or timeout errors | The grid can't reach `hapi.fhir.org`, or the server is busy | Check outbound HTTPS; the public server is sometimes slow — the next interval retries |
| Nothing appears in the logs | The workflow is stopped, or a source node's **Live Mode** is off | Start the workflow; confirm the Data Simulator / HAPI FHIR Source show **Live Mode on** |
| HAPI FHIR Destination logs "nothing sent" | **Live Mode is off** (the safe default) | Expected — turn Live Mode on to write to a server you own |
| FHIR to HL7 v2 prints `PID` segments with empty fields | The public Patient had no name/DOB | Expected with public test data; WK2 shows full messages |


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
