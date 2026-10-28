---
title: HL7 v2 to FHIR Demo
description: A ready-to-run Linkiir project that maps HL7 v2 to a FHIR Patient with the graphical Data Map node, validates it against a FHIR server and sends it on, plus a scripted FHIR to HL7 v2 workflow that reads from a FHIR server.
keywords: [demo, HL7 v2, FHIR, data map, mapping, auto-map, FHIR validation, HAPI FHIR, getting started]
---

# HL7 v2 to FHIR Demo

This project shows how to build an **HL7 v2 to FHIR** integration in Linkiir Grid, using schemas and the [Data Map node](../interface-development/interfaces/data-map/index.md) for graphical mapping. A simulator generates an HL7 v2 admit message. You map it to a FHIR Patient, validate the Patient against a FHIR server, and send it on. The project also includes a ready-to-run workflow that reads FHIR from a server and maps it back to HL7 v2 in Lua.

Import it to learn, hands-on:

- How to **import a Linkiir Grid project** from a zip bundle and **run its workflows**.
- How Linkiir Grid **converts HL7 v2 to FHIR** with the graphical Data Map node, and **FHIR back to HL7 v2** with a custom scripting node.
- How the **FHIR Validator** checks a resource against a server before it is sent.
- How to **follow a message through the workflow** in the logs.

**[Download FHIR_Demo.linkiir.zip](pathname:///downloads/FHIR_Demo.linkiir.zip)** (1.1 MB)

This is one of two [Demo Projects](demo-project.md). For a tour of the core nodes, see the [Feature Demo](demo-feature.md).

:::info[This demo uses a public FHIR test server]
So that it runs as soon as you import it, the demo points at `https://hapi.fhir.org/baseR4`, a free public FHIR sandbox, with authentication set to **None**. It is for learning only, so never send real patient data to it. To use your own FHIR server, see [Point it at your own server](#point-it-at-your-own-server).
:::

---

## What's inside

The project **FHIR Demo** contains two independent workflows.

| Workflow | Flow | What it shows |
| --- | --- | --- |
| **HL7v2 to FHIR** | [Data Simulator (HL7 ADT)](../adapters/data-simulator.md) → **ADT to FHIR** ([Data Map](../interface-development/interfaces/data-map/index.md)) → [FHIR Validator](../adapters/fhir-validator.md) → [HAPI FHIR Destination](../adapters/hapi-fhir.md) | Map an HL7 v2 admit to a FHIR Patient, validate it, and send it to a FHIR server. You build the map yourself in Steps 2 and 3 |
| **FHIR to HL7v2** | [HAPI FHIR Source](../adapters/hapi-fhir.md) → **FHIR to HL7v2 Mapper** ([Transform Custom](../interface-development/interfaces/custom-scripting-nodes.md)) → **Print HL7v2 Destination** | Read a Patient from a FHIR server and map it back to an HL7 v2 message in Lua. Ready to run as shipped |

Both source nodes ship with **Live Mode on** and a **60-second interval**. Once a workflow is started, it handles a new message every minute without further action.

---

## Step 1 — Import the project

1. Open the Linkiir Grid in your browser.
2. Go to **Projects**.
3. Click the chevron on **Add Project** and choose **From zip**.
4. Drop [`FHIR_Demo.linkiir.zip`](pathname:///downloads/FHIR_Demo.linkiir.zip) on **Choose a project bundle**, or click to browse for it.
5. Click **Import**.

The project appears as **FHIR Demo** with two workflows. No other setup is needed. For name collisions and refused imports, see [Import and Export Projects](../administration/deployment/import-export.md#import-a-project-from-a-bundle).

:::note[Outbound HTTPS]
Both workflows call the public HAPI FHIR server over the network. On an air-gapped grid, both workflows report connection errors.
:::

---

## Step 2 — Open the Map view

1. Open the **FHIR Demo** project. On the **Workflows** tab, find the **HL7v2 to FHIR** workflow and select the **hammer** icon to open it in the **Workflow Builder**.
2. Select the **ADT to FHIR** node. Right-click it and choose **Edit map**, or select **Edit Map** at the bottom of the node's settings.

This opens the [Map view](../interface-development/interfaces/data-map/building-maps.md#the-map-view), the board where you build the message transformation. The node is already set up to take an HL7 v2.5.1 `ADT^A01` and build a FHIR R4 resource. A sample admit message, `ADT_A01.txt`, is loaded, so the source column on the left shows real values beside each field. The destination column on the right is empty until you fill it in the next step.

---

## Step 3 — Build the map

In this step you build a **FHIR R4 Patient** resource from the admit message.

1. In the destination column (right), open the **Add resource…** dropdown and select **Patient**.
2. Select [**Auto-map**](../interface-development/interfaces/data-map/building-maps.md#auto-map) at the top right of the destination column. It links the `PID` fields to the Patient: identifier, name, gender, birth date, address and phone. It also adds a [narrative](../interface-development/interfaces/data-map/building-maps.md#narrative).
3. Select **Run Test** on the toolbar to run the map on the sample and see the FHIR Patient it builds. See [Testing a Data Map](../interface-development/interfaces/data-map/testing-and-errors.md#running).
4. Select **Commit** to save your changes. Type a commit message, or select **Use the summary** to fill one in from the changes you made. See [Saving and committing](../interface-development/interfaces/data-map/building-maps.md#saving-and-committing).

:::warning[Commit before you run the workflow]
The runtime runs only committed code. Until you commit the map, the running workflow does not use it. The **ADT to FHIR** node then skips each message as rejected (its **On Error** setting is **Skip the message**) and nothing reaches the validator.
:::

Now select a few of the links between the columns to see how each field is mapped. The **Rule** tab shows each rule's settings, the [functions](../interface-development/interfaces/data-map/building-maps.md#functions) and [normalizing steps](../interface-development/interfaces/data-map/building-maps.md#normalizing-values) you can add, and what the rule read and wrote on the last run. For more on what a Data Map converts between, see [Data Map Formats](../interface-development/interfaces/data-map/formats.md#fhir).

---

## Step 4 — Run the HL7v2 to FHIR workflow

With the map built and committed, run the workflow end to end.

1. Open the [**Monitor**](../administration/monitor/index.md) page.
2. Find the **HL7v2 to FHIR** workflow under the **FHIR Demo** project and select **Start**.
3. Right-click the **HL7v2 to FHIR** workflow and select **Open in logs**. The first message appears within a minute.
4. In the **FHIR Validator** node's **INFO** entry, confirm that it reports no blocking issues.

A message leaves log lines like these:

```text
Data Simulator: simulated 1 x HL7 v2.5.1 ADT^A01 (Admit)
FHIR Validator: valid, forwarded. no blocking issues (1 informational note)
HAPI FHIR Destination: Live Mode is off, nothing sent. Turn Live Mode on to POST to https://hapi.fhir.org/baseR4.
```

To see the message's whole journey, open one of its log entries and select [**Related messages**](../administration/logs/index.md#related-messages). It shows each stop in order: the simulator generates the `ADT^A01`, **ADT to FHIR** maps it to a FHIR Patient, the validator checks it, and the destination receives it.

:::note[The destination is safe by default]
The **HAPI FHIR Destination** ships with **Live Mode off**. It prepares the write but does not `POST` to the shared public server. The full chain still runs and the Patient reaches the destination. To write for real, turn **Live Mode on** in the node's settings, and point it at your own server rather than the public sandbox.
:::

---

## Step 5 — Run the FHIR to HL7v2 workflow

The second workflow converts in the opposite direction. It uses a traditional [custom scripting](../interface-development/interfaces/custom-scripting-nodes.md) node, rather than a Data Map node, so you can compare the two approaches.

The **HAPI FHIR Source** polls the server for two Patients each interval and pushes each one downstream. The **FHIR to HL7v2 Mapper** turns each Patient into an HL7 v2 `ADT^A08` (update). The **Print HL7v2 Destination** logs each segment so you can read the result.

1. On the **Monitor** page, start the **FHIR to HL7v2** workflow.
2. Right-click it and select **Open in logs**.

The log shows the printed messages:

```text
HAPI FHIR Source: pushed 2 Patient resource(s).
Print HL7v2: received a transformed HL7 v2 message (154 bytes):
  MSH|^~\&|LINKIIR|LINKIIR GRID|RECEIVER|FACILITY|...|ADT^A08^ADT_A01|...|P|2.5.1
  EVN|A08|...
  PID|1||MRN100001^^^LINKIIR^MR||SMITH^JAMES||19800115|M|||123 OAK AVENUE^^CHICAGO^IL^60601^USA||(312)555-0142
Print HL7v2: printed 3 segment(s).
```

:::tip[Public data is sparse]
Patients on the public HAPI server often have no name or birth date, so some printed `PID` segments have empty fields. That comes from the real upstream data and is not a mapping error. The **HL7v2 to FHIR** workflow, fed by the simulator, always produces fully populated messages.
:::

---

## Where the mapping lives

Open a node with **Open in scripting**, or from the Workflow Builder, to see its files. [Testing and Debugging](../interface-development/lua-programming/testing-debugging.md) covers running the scripts on their samples and setting breakpoints.

| File | Role |
| --- | --- |
| **ADT to FHIR → `mapping/maps/adt_a01_fhir.map.lua`** | The map you built in Step 3, as a Lua table. The Map view reads and rewrites it. |
| **ADT to FHIR → `mapping/maps/adt_a01_fhir.lua`** | The readable Lua code generated from the map. See [The generated code](../interface-development/interfaces/data-map/testing-and-errors.md#the-generated-code). |
| **ADT to FHIR → `custom.lua`, `premap.lua`, `postmap.lua`** | Places for your own Lua that the map calls, or that runs before and after it. See [The node's files](../interface-development/interfaces/data-map/index.md#the-nodes-files). |
| **FHIR to HL7v2 Mapper → `fhir_to_hl7v2_map.lua`** | The hand-written reverse mapping (`mapToHL7`): FHIR Patient → HL7 v2 `MSH`, `EVN` and `PID`, built with `linkiir.data.create` and filled by position. |
| **FHIR to HL7v2 Mapper → `main.lua`** | Node glue: parses the FHIR JSON, calls the mapper, and forwards the HL7. |
| **Print HL7v2 Destination → `main.lua`** | Splits the message on segment boundaries and logs each segment. |

### Techniques to reuse

| Technique | Where to see it |
| --- | --- |
| Graphical HL7 v2 → FHIR mapping, with Auto-map | **ADT to FHIR** Map view |
| Validating FHIR against a server before sending | **FHIR Validator** |
| Sending a resource to a FHIR server (`POST`) | **HAPI FHIR Destination** |
| Reading from a FHIR server on an interval | **HAPI FHIR Source** |
| Keeping hand-written mapping in its own module beside a thin `main.lua` | **FHIR to HL7v2 Mapper** |
| Building HL7 v2 by position with `linkiir.data.create` | **FHIR to HL7v2 Mapper** → `fhir_to_hl7v2_map.lua` |

---

## Point it at your own server

The same nodes work against any FHIR R4 or R5 server. Change these settings on the three FHIR nodes: **HAPI FHIR Source**, **FHIR Validator** and **HAPI FHIR Destination**.

| Setting | Public demo | Your server |
| --- | --- | --- |
| **FHIR Base URL** (**FHIR Server URL** on the FHIR Validator) | `https://hapi.fhir.org/baseR4` | Your server's FHIR base URL |
| **Authentication** (HAPI FHIR Source and Destination) | `None (public test endpoint)` | `OAuth2 Backend Services` (or Bearer or Basic), then fill in the credential fields |

The nodes ship with empty credential fields, so enter your own after import. To write to your server, also turn **Live Mode on** on the HAPI FHIR Destination. See the [HAPI FHIR Adapter](../adapters/hapi-fhir.md) and [FHIR Validator](../adapters/fhir-validator.md) references for every field.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Connection or timeout errors in the log | The grid can't reach `hapi.fhir.org`, or the server is busy | Check outbound HTTPS. The public server is sometimes slow, and the next interval retries |
| Nothing appears in the logs | The workflow is stopped, or a source node's **Live Mode** is off | Start the workflow, and check that **Data Simulator (HL7 ADT)** and **HAPI FHIR Source** show **Live Mode on** |
| **ADT to FHIR** logs `Message rejected` and nothing reaches the validator | The map isn't built, or isn't committed yet | Finish [Step 3](#step-3--build-the-map) and **Commit** |
| Map changes don't show up in the running workflow | The changes are saved but not committed | **Commit** the node's files. The runtime runs only committed code |
| **FHIR Validator** stops the message | The server reported a real error on the resource | Read the node's log entry, which lists the issues by severity. Check the map's output with **Run Test** |
| HAPI FHIR Destination logs "nothing sent" | **Live Mode is off** (the safe default) | Expected. Turn Live Mode on only to write to a server you own |
| **FHIR to HL7v2** prints `PID` segments with empty fields | The public Patient had no name or birth date | Expected with public test data. **HL7v2 to FHIR** produces fully populated messages |

For general problems, see [Troubleshooting](../administration/troubleshooting/index.md).

---

## Where to go next

| Goal | Read |
| --- | --- |
| Building your own Data Map nodes | [Data Map Nodes](../interface-development/interfaces/data-map/index.md) and [Building a Map](../interface-development/interfaces/data-map/building-maps.md) |
| Sending different messages to different maps | [Conditions](../interface-development/interfaces/data-map/conditions.md) |
| Changing or adding schemas | [Schema Editor](../interface-development/schema-editor.md) |
| Writing mappings in Lua instead | [Custom Scripting Nodes](../interface-development/interfaces/custom-scripting-nodes.md) |
| The FHIR adapters this demo builds on | [Linkiir FHIR Adapters](../adapters/catalogs/fhir.md) |
| Building FHIR resource templates | [FHIR Profiling Tools](../adapters/fhir-profiling-tools.md) |
| Starting, stopping and watching workflows | [Monitoring Workflows](../administration/monitor/index.md) |
| Searching logs and message history | [Log Search and Message History](../administration/logs/index.md) |
| The core-nodes tour | [Feature Demo](demo-feature.md) |
