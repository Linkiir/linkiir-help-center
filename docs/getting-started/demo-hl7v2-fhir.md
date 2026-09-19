---
title: HL7 v2 to FHIR Demo
description: A ready-to-run Linkiir project that converts HL7 v2 to FHIR and back, profiles and validates FHIR resources, and reads from and writes to a FHIR server — with the mapping in plain, editable Lua modules.
keywords: [demo, HL7 v2, FHIR, FHIR validation, FHIR profiling, mapping, getting started]
---

# HL7 v2 to FHIR Demo

A ready-to-run project that shows how Linkiir moves between **HL7 v2 and FHIR** in both directions, using the [Linkiir FHIR Adapters](../adapters/catalogs/fhir.md). It generates an HL7 v2 admit message, maps it to a FHIR Patient, validates the Patient against a FHIR server, and writes it back — then, separately, reads FHIR from the server and maps it to HL7 v2.

Import it to learn, hands-on:

- How Linkiir **converts HL7 v2 to FHIR** and **FHIR back to HL7 v2**, with the field-by-field mapping kept in its own readable Lua module.
- How the **FHIR Profiling Tools** build a FHIR JSON template.
- How the **FHIR Validator** checks a resource against a server before it is sent.
- How Linkiir **connects to a FHIR server** to read and write resources.

**[Download FHIR_Demo.linkiir.zip](pathname:///downloads/FHIR_Demo.linkiir.zip)** (770 KB)

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
| **WK2 HL7 v2 to FHIR** | Data Simulator → HL7v2 to FHIR Mapper → FHIR Validator → HAPI FHIR Destination | Map an HL7 v2 admit to a FHIR Patient, validate it, and write it to the FHIR server |
| **WK3 FHIR to HL7 v2** | HAPI FHIR Source → FHIR to HL7v2 Mapper → Print HL7v2 Destination | Read a Patient from the FHIR server and map it back to an HL7 v2 message |

Every node is self-contained — the project carries its own copy of the FHIR library code, so it imports and runs on a closed grid with no catalog subscription required.

---

## Import the project

1. Open the Linkiir Grid in your browser.
2. Go to **Projects**.
3. Click the chevron on **Add Project** and choose **From zip**.
4. Drop [`FHIR_Demo.linkiir.zip`](pathname:///downloads/FHIR_Demo.linkiir.zip) on **Choose a project bundle**, or click to browse for it.
5. Click **Import**.

The project appears as **FHIR Demo** with three workflows. No additional setup is required.

:::note[Outbound HTTPS]
WK2 and WK3 call the FHIR server over the network. On an air-gapped grid, those two workflows will report connection errors — WK1 (the Profiler) runs fully offline. Point WK2/WK3 at a reachable FHIR server to run them.
:::

---

## WK1 — FHIR Profiler

A single **FHIR Profiling Tools** node that serves a browser page. Start the workflow, then open the node's route (default `fhir-profiler`) on the HTTP server port:

```text
http://localhost:8081/fhir-profiler
```

Choose a FHIR version (R4 or R5) and a resource such as Patient, pick the fields you want (required ones are checked and locked), and the page shows a live FHIR JSON template with `null` placeholders. Copy it as the starting point for a mapping — it is the shape the Resource Creator and the mappers in this demo fill in.

See [FHIR Profiling Tools](../adapters/fhir-profiling-tools.md) for the full node reference.

---

## WK2 — HL7 v2 to FHIR

Start the workflow. Every interval the **Data Simulator** emits a synthetic HL7 v2.5.1 `ADT^A01` (admit), and the chain runs:

1. **HL7v2 to FHIR Mapper** parses the HL7 message and builds a FHIR R4 Patient — MRN, name, gender (normalized from the HL7 code), birth date, phone, and address.
2. **FHIR Validator** posts the Patient to the server's `$validate` operation and only forwards it if the server reports no errors.
3. **HAPI FHIR Destination** fetches an existing Patient from the server, applies the mapped address to it, and `PUT`s it back — demonstrating a real FHIR write.

Watch the node logs to follow one message through:

```text
HL7v2->FHIR: mapped ADT to FHIR Patient (MRN ..., city DENVER), forwarding to the validator.
FHIR Validator: valid, forwarded. no blocking issues (1 informational note)
HAPI FHIR Destination: fetched existing Patient/1628 from https://hapi.fhir.org/baseR4 to update.
HAPI FHIR Destination: PUT Patient/1628 succeeded - address city set to DENVER. Linkiir wrote to https://hapi.fhir.org/baseR4.
```

### Where the mapping lives

The HL7-to-FHIR translation is deliberately kept in its own module, separate from the node glue, so you can read and change it on its own:

| File | Role |
| --- | --- |
| **HL7v2 to FHIR Mapper → `hl7v2_to_fhir_map.lua`** | The field-by-field mapping (`toPatient`): HL7 PID → FHIR Patient. Edit this to change what maps where. |
| **HL7v2 to FHIR Mapper → `main.lua`** | Node glue: receive the message, call the mapper, forward the result. |
| **HAPI FHIR Destination → `main.lua`** | Reads the server connection from its own config and writes with the `hapi_fhir` library. |

Open any node's **Scripting** tab to read the code, set breakpoints, and run tests against the sample messages.

---

## WK3 — FHIR to HL7 v2

Start the workflow. The **HAPI FHIR Source** polls the server for Patients and pushes each one downstream; the **FHIR to HL7v2 Mapper** turns it into an HL7 v2 `ADT^A08` (update), and the **Print HL7v2 Destination** logs each segment so you can read the result:

```text
FHIR->HL7v2: mapped Patient/2358 to an HL7 v2 ADT^A08, forwarding to the printer.
Print HL7v2: received a transformed HL7 v2 message (194 bytes):
  MSH|^~\&|LINKIIR|LINKIIR GRID|RECEIVER|FACILITY|...|ADT^A08^ADT_A01|...|P|2.5.1
  EVN|A08|...
  PID|1||...^^^LINKIIR^MR||Doe^Jane||19800515|F|||123 Main St^^Springfield^IL^62704^USA||555-0123
```

### Where the mapping lives

| File | Role |
| --- | --- |
| **FHIR to HL7v2 Mapper → `fhir_to_hl7v2_map.lua`** | The reverse mapping (`toADT`): FHIR Patient → HL7 v2 MSH/EVN/PID. |
| **FHIR to HL7v2 Mapper → `main.lua`** | Node glue: parse the FHIR JSON, call the mapper, forward the HL7. |
| **Print HL7v2 Destination → `main.lua`** | Splits the message on segment boundaries and logs each segment. |

:::tip[Public data is sparse]
Patients on the public HAPI server often lack a name or birth date, so some printed `PID` segments have empty fields. That is the real upstream data, not a mapping error — WK2 (simulator-sourced) shows fully populated messages.
:::

---

## What the scripts demonstrate

Each row is a technique you can lift into your own interfaces.

| Technique | Where to see it |
| --- | --- |
| HL7 v2 parsing (segments, fields, components) | WK2: **HL7v2 to FHIR Mapper** → `hl7v2_to_fhir_map.lua` |
| Building a FHIR resource from mapped data | WK2: **HL7v2 to FHIR Mapper** → `hl7v2_to_fhir_map.lua` |
| Keeping mapping in a separate, reviewable module | Both mappers: `*_map.lua` beside a thin `main.lua` |
| Validating FHIR against a server before sending | WK2: **FHIR Validator** |
| Writing to a FHIR server (read, modify, `PUT`) | WK2: **HAPI FHIR Destination** → `main.lua` |
| Reading from a FHIR server on an interval | WK3: **HAPI FHIR Source** |
| Mapping FHIR back to HL7 v2 | WK3: **FHIR to HL7v2 Mapper** → `fhir_to_hl7v2_map.lua` |
| Cross-platform line-ending handling (CR/LF/CRLF) | Both mappers and the printer normalize newlines before parsing |
| Building a FHIR JSON template | WK1: **FHIR Profiling Tools** browser page |

---

## Point it at your own server

The same nodes work against any FHIR R4/R5 server. On the FHIR **source** (WK3) and FHIR **destination** (WK2) nodes, change two settings:

| Setting | Public demo | Your server |
| --- | --- | --- |
| **FHIR Base URL** | `https://hapi.fhir.org/baseR4` | The endpoint your server provides |
| **Authentication** | `None (public test endpoint)` | `OAuth2 Backend Services` (or Bearer / Basic), then fill the credential fields |

The nodes ship their credential fields empty; enter yours after import. See the [FHIR adapter reference](../adapters/hapi-fhir.md) for every field.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| WK2/WK3 log connection or timeout errors | The grid can't reach `hapi.fhir.org`, or the server is busy | Check outbound HTTPS; the public server is sometimes slow — the next interval retries |
| FHIR Validator stops the message | The server reported a real error on the resource | Read the node log; the summary lists the issues by severity |
| A profile always fails validation | The profile isn't installed on the server | Clear the **FHIR Profile** field, or use a server that has it |
| WK3 prints `PID` segments with empty name fields | The public Patient had no name/DOB | Expected with public test data; WK2 shows full messages |
| The Profiler page won't load | The node is stopped, or the embedded HTTP server is off | Start WK1; check the HTTP server is enabled |

---

## Where to go next

| Goal | Read |
| --- | --- |
| The FHIR adapters this demo builds on | [Linkiir FHIR Adapters](../adapters/catalogs/fhir.md) |
| The validation node in depth | [FHIR Validator](../adapters/fhir-validator.md) |
| The profiling node in depth | [FHIR Profiling Tools](../adapters/fhir-profiling-tools.md) |
| The read/write FHIR client | [HAPI FHIR Adapter](../adapters/hapi-fhir.md) |
| The core-nodes tour | [Feature Demo](demo-feature.md) |
