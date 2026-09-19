---
title: Demo Projects
description: Ready-to-run Linkiir projects you import as a zip bundle to learn the platform hands-on — a feature tour of the core nodes, and an HL7 v2 to FHIR integration built on the FHIR adapter catalog.
keywords: [demo, sample project, HL7, FHIR, HAPI, getting started]
---

# Demo Projects

Linkiir ships ready-to-run demo projects you import as a zip bundle. Each one is a complete, working project — import it, start the workflows, and read the node scripts to see how a real interface is built.

| Demo | What you learn | Import bundle |
| --- | --- | --- |
| [Feature Demo](demo-feature.md) | The core nodes end to end: generate HL7, move it over LLP, store it in SQLite, and serve it back as a JSON API | `Linkiir_Demo.linkiir.zip` |
| [HL7 v2 to FHIR Demo](demo-hl7v2-fhir.md) | Converting HL7 v2 to FHIR and back, FHIR profiling, FHIR validation, and reading from and writing to a FHIR server — with the mapping in readable Lua modules | `FHIR_Demo.linkiir.zip` |

Both import the same way (**Projects → Add Project → From zip**) and run against a local grid with no extra setup.

## Which to start with

- New to Linkiir? Start with the **[Feature Demo](demo-feature.md)** — it introduces projects, workflows, and the core node types with a self-contained round trip.
- Working with healthcare interoperability? The **[HL7 v2 to FHIR Demo](demo-hl7v2-fhir.md)** shows the FHIR adapter catalog in action: profiling, validation, a live FHIR server connection, and HL7 v2 ↔ FHIR mapping you can read and edit.

## Where to go next

| Goal | Read |
| --- | --- |
| Understand the node types the demos use | [Interfaces and Core Nodes](../interface-development/interfaces/index.md) |
| Look up the functions the scripts call | [Linkiir Scripting API](../api/scripting-api/index.md) |
| The FHIR adapters the HL7-to-FHIR demo builds on | [Linkiir FHIR Adapters](../adapters/catalogs/fhir.md) |
| Build an interface from scratch | [Create a Project, Workflow, and HTTP Source Node](create-project-workflow.md) |
