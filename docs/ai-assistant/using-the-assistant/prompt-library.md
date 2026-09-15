---
title: Prompt Library
sidebar_position: 7
description: Prompts that work with the Linkiir AI Assistant — grouped by what you are trying to do, with the mode to use for each and the prompts to type.
keywords: [AI prompts, prompt library, HL7, FHIR, X12, Lua, diagnose, build adapter, map formats, document interface, Linkiir AI]
---

# Prompt Library

The assistant is at its best when you point it at something real and ask a specific question. Set the **Mode** so the conversation is allowed to do what you are asking, check the **project scope** names the project you mean, and the rest is just typing.

Everything below is something the assistant can actually do. It reads the live state of your project — workflows, nodes, files, samples, logs, documents, catalogs — and in **Build** it changes files after you approve each change.

Modes are covered in [Modes and Project Scope](modes-and-scope.md); the approval step in [Approvals](approvals.md).

## How to write a good prompt

| Habit | Instead of | Type |
| --- | --- | --- |
| **Name the thing**, or open its page | "why is my interface broken?" | "why is the *Lab Results Inbound* workflow's `Parse ORU` node erroring?" |
| **Say what outcome you want** | "look at this script" | "review this script and list what would break if `OBX-5` is empty" |
| **Give the constraint** | "map these fields" | "map to the receiver's profile in `receiver-spec.pdf` — MRN must carry assigning authority `HOSP-MRN`" |
| **Ask it to read, not assume** | "does `linkiir.hl7.get` take a segment?" | "look up the signature of `linkiir.hl7.get` and show me the exact arguments" |
| **Ask for the evidence** | — | "quote the config field you based that on" |

:::tip[The fastest habit]
Open the node or workflow you actually mean, then ask about **"this node"** or **"this file"**. On a node's scripting page those phrases resolve to what the page names, so you never have to spell out a path.
:::

:::note[Signatures are looked up, not remembered]
The assistant searches the Linkiir Scripting API with a tool rather than recalling it. That makes "confirm the signature of…" a reliable prompt, and "what do you think the arguments are?" a poor one. Ask it to confirm.
:::

## Understand an existing interface

When you inherited something, or you are about to change it and want to know what it touches.

**Mode: Default**

| What you want | Prompt to type |
| --- | --- |
| The shape of a workflow | `what does the Lab Results Inbound workflow do, node by node, and where does a message end up?` |
| What one node is for | `explain this node: what it receives, what it does, and what it sends on` |
| A script walked through | `walk me through this file and tell me which HL7 fields it reads` |
| Where a value comes from | `the receiver gets an empty PID-3 — which node sets it, and from what?` |
| The config in plain terms | `read this node's configuration and its config schema, then explain what each field I have set actually controls` |
| The test data in play | `list this node's test samples and summarise what each one covers` |

## Troubleshoot a failing interface

When something was working and now is not. **Diagnose** works out *why* before proposing anything, and changes nothing.

**Mode: Diagnose**

| What you want | Prompt to type |
| --- | --- |
| Why nothing is arriving | `no ADT messages have reached the EHR since this morning — search the logs for the ADT Inbound workflow and tell me where they stop` |
| An error explained | `this node logged "attempt to index a nil value" — find the log entry and tell me which line of the script it came from` |
| What changed | `show me the working-tree diff for this node's files and tell me whether any of it explains today's failures` |
| A backing-up queue | `read the queue status for the Route to EHR node and tell me whether it is draining` |
| The node's own history | `read the state history for this node over the last day and tell me when it first went unhealthy` |
| A fix proposal to review | `based on what you just read, describe the smallest change that would fix this — do not change anything yet` |

:::note[Diagnose proposes, Build changes]
When you are happy with the diagnosis, switch to **Build** and say `apply the fix you described`. The conversation keeps its context across the switch.
:::

## Work with logs and a specific message

When you have a correlation id from a colleague, a ticket, or the log viewer, and you need to know what happened to that one message.

**Mode: Diagnose**

| What you want | Prompt to type |
| --- | --- |
| Find the message | `search the logs for correlation id 7f3c9a21 and list every entry in order` |
| Read the payload | `read the message payload for that log entry and tell me which segments are present` |
| Trace it across nodes | `follow correlation id 7f3c9a21 through the workflow and tell me which node it last succeeded at` |
| Count a pattern | `search today's logs for "ACK timeout" in this workflow and tell me which node reports it most` |
| Compare good and bad | `find one successful and one failed ORU in today's logs and tell me what differs in the log detail` |

:::caution[Payloads reach the assistant masked]
Clinical message content is redacted before the assistant sees it. It can tell you which segments and fields are present, and where a structure is malformed. It cannot read a patient's name, MRN, or result value back to you — for that, use the log viewer yourself.
:::

## Write and fix Lua

Reviewing costs you nothing, so review in **Default** first and switch to **Build** only when you want the file changed.

**Mode: Default to review, Build to change**

| What you want | Prompt to type |
| --- | --- |
| A review | `review this file for anything that throws on a message with no OBX segment` |
| A signature confirmed | `look up linkiir.hl7.get and linkiir.hl7.set and show me the exact signatures before you use them` |
| An error explained | `explain this error and show me the line that causes it: "bad argument #2 to 'set'"` |
| Better failure handling | `wrap the PID-3 lookup so a missing MRN logs a clear message and routes to the error path instead of throwing` |
| A syntax check before saving | `validate this script without running it` |
| A real test run | `run this script against the ORU-happy-path sample and show me the output and the variables` |
| A closer look at the middle | `run it paused at the line where OBX-5 is read and tell me what is in scope there` |
| A sample for the bad case | `add a test sample called ORU-missing-OBX built from the happy path with the OBX segment removed` |

:::tip[Validate, then run, then save]
Ask for `validate this script` and `run it against <sample>` in the same turn as the edit. You see the change, the syntax check, and the actual output before you approve anything.
:::

## Map between message formats

Field-by-field work: HL7 v2 to FHIR, X12, a mapping sheet someone gave you. Plan the mapping, then build the transform.

**Mode: Plan, then Build**

| What you want | Prompt to type |
| --- | --- |
| The mapping planned | `/map-formats plan a mapping from this ORU^R01 to a FHIR Observation, using the field list in lab-mapping-sheet.xlsx from this project's documents` |
| Positions spelled out | `list which source fields feed the FHIR Patient resource, addressing them by position — PID-5.1, PID-5.2, PID-3[2] and so on` |
| A repeat handled | `PID-3 repeats — write the lookup so it takes the identifier whose assigning authority is HOSP-MRN, not the first one` |
| A code set translated | `translate the sending system's order-status codes to the receiver's using the table in receiver-spec.pdf, and tell me which codes have no target` |
| An X12 segment | `explain what this script reads out of the 837P loop 2300 and whether it handles a missing CLM segment` |
| The transform written | `write the transform for the mapping you just planned, then validate it and run it against the ORU-happy-path sample` |

:::note[Mapping sheets have to be uploaded first]
The assistant searches the content of the project's uploaded documents, and only when that project is in scope. Upload the spec or mapping sheet to the project, then name it in the prompt. See [Project documents](../project-knowledge/documents.md).
:::

## Build a new interface or adapter

Plan it in **Plan** so you can read the steps before anything exists, then switch to **Build**.

**Mode: Plan, then Build**

| What you want | Prompt to type |
| --- | --- |
| A plan to read first | `/build-adapter plan an outbound adapter that posts our ORU results to a vendor REST endpoint with bearer auth — steps only, change nothing` |
| Reuse checked before code | `before we write anything, check the catalogs and this project's node templates for an existing HTTP outbound adapter we could start from` |
| The skeleton created | `create a workflow called Results Outbound with a scripting node called Post to Vendor, from the HTTP Outbound template if one exists` |
| The script written | `write the request body builder in this node, then validate it` |
| A sample and a test | `add a test sample from our standard ORU, then run this node against it and show me the output` |
| Wiring it up | `connect Post to Vendor downstream of Format Result, and show me the workflow when you are done` |
| Ready to commit | `stage the files you changed in this node for commit` |

:::note[Build stops before each change]
Every change arrives as a card you approve or reject before it happens. Nothing is committed by the assistant — staging is as far as it goes, and the commit happens when you approve the commit card. See [Approvals](approvals.md).
:::

## Document an interface

The doc lives beside the node as a `.md` file, so it travels with the code.

**Mode: Build**

| What you want | Prompt to type |
| --- | --- |
| The reference doc | `/document-interface write README.md in this node covering what it receives, what it sends, and the config fields that matter` |
| A diagram of the flow | `include a mermaid flowchart of the message path through this workflow, including the error branch` |
| A sequence of the exchange | `add a mermaid sequenceDiagram of the ORU send and the ACK back from the vendor` |
| A mapping table | `add a field mapping table: source position, target path, and any transformation applied` |
| Failure modes written down | `add a failure modes section based on the error handling actually in this script, with the log message each one produces` |
| The state machine drawn | `add a mermaid stateDiagram-v2 of the retry states this node moves through` |

:::tip[Mermaid renders]
A fenced `mermaid` code block in a node's `.md` file renders as a diagram — `flowchart`, `sequenceDiagram`, `stateDiagram-v2`, `erDiagram`, `classDiagram`, `gantt`, `pie`. Ask for the diagram type you want by name.
:::

## Reuse what already exists

Ask before you write. The assistant prefers an existing catalog template or library over new code, and it can tell you what is on the shelf.

**Mode: Default**

| What you want | Prompt to type |
| --- | --- |
| What is available | `list the catalogs we subscribe to and what templates each one offers` |
| Whether it already exists | `is there already an adapter or template for an SFTP file pickup, in a catalog or in this project?` |
| The project's own building blocks | `list this project's node templates and libraries, and tell me what each is for` |
| Shared code extracted | `three nodes have the same MRN normalisation function — create a library called hl7-utils, move that function into it, and pin this node to it` |
| A library version published | `add the updated normalisation file to hl7-utils and publish a new version` |
| Something installed | `install the HL7 helpers library from the subscribed catalog into this project` |

## Onboarding onto an unfamiliar project

Your first hour on a project someone else built.

**Mode: Default**

| What you want | Prompt to type |
| --- | --- |
| The tour | `give me a tour of this project: its workflows, what each one is for, and how they relate` |
| What is live | `show me this project's status and tell me which workflows and nodes are currently running` |
| The house style | `read three of this project's scripting nodes and tell me what conventions they share — naming, error handling, logging` |
| What is written down | `list this project's documents and tell me what each one covers` |
| The riskiest part | `which node in this project has the most complex script, and what makes it complex?` |
| Where to be careful | `list any uncommitted changes across this project's nodes and show me the diffs` |

## Using the built-in Skills

A Skill is a set of instructions the assistant follows for that request. Four ship with Linkiir.

| Skill | What it is for | Prompt that pairs with it |
| --- | --- | --- |
| `/build-adapter` | Building, extending, or repairing an adapter to an external service | `/build-adapter add retry with backoff to this vendor REST adapter` |
| `/diagnose-fault` | Finding why a node or workflow is failing. Read-only | `/diagnose-fault the Route to EHR node has been unhealthy since 06:00` |
| `/map-formats` | Mapping fields between formats and writing the transform | `/map-formats map this ADT^A08 to our FHIR Patient update` |
| `/document-interface` | Writing the reference doc beside an interface node | `/document-interface document this node for whoever is on call` |

Type `/` in the composer and choose from the picker — that is what attaches the Skill. Typing the name as plain text does not attach anything. See [Attachments and Context](attachments-and-context.md).

Your organisation may add its own Skills, and may replace a built-in with a house version of the same name. See [Organization Skills](../setup/organization-skills.md).

## Prompts that will not work, and what to ask instead

| What you might type | Why it does not work | Ask this instead |
| --- | --- | --- |
| `start the node for me` | Starting and stopping nodes and workflows is yours, not the assistant's | `get this node ready to start and tell me what to check first` — then start it yourself |
| `commit this` | It can stage a path; the commit happens when you approve the commit card | `stage the files you changed for commit` |
| `change the AI budget to 200` | Linkiir settings, users, and roles are not something it manages | Ask an administrator — see [AI Roles and Permissions](../setup/roles-and-permissions.md) |
| `look up the vendor's current API docs` | It has no internet access unless an administrator enabled web search for the model you chose | Upload the vendor spec to the project's documents and name it in the prompt |
| `what did my colleague ask you yesterday?` | Conversations are private to each user | Ask your colleague to share what they found |
| `read the patient name in this message` | Message payloads are masked before the assistant sees them | `tell me which segments and fields are present in that message` — read the value in the log viewer yourself |

## Next

- [Modes and Project Scope](modes-and-scope.md) — which mode lets you do what
- [Approvals](approvals.md) — reviewing a change before it happens
- [Choosing a Model](choosing-a-model.md) — when to override Auto
- [Attachments and Context](attachments-and-context.md) — files, images, and `/` for Skills
- [Project documents](../project-knowledge/documents.md) — so it can answer from your own specs
- [Using the AI Assistant](index.md) — the panel and its controls
