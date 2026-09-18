---
title: FHIR Resource Creator
description: "Use the Linkiir FHIR Resource Creator node to turn an inbound JSON message into a clean FHIR R4 Patient or Observation resource."
keywords: [FHIR, R4, Patient, Observation, resource, adapter, transform]
---

# FHIR Resource Creator

A **Transform Custom** node that maps an inbound JSON message onto a FHIR R4
**Patient** or **Observation** resource and pushes it downstream as JSON.

Published in the **[Linkiir FHIR Adapters](catalogs/fhir.md)** catalog. Subscribe
to that catalog to add this adapter to your grid — see
[Adapter Catalogs](catalogs/index.md).

Current version and changelog:
[FHIR Adapters release notes](../release-notes/catalogs-fhir.md).

## What it does

When a message arrives, the node maps its fields onto a FHIR R4 template for the
resource type you selected, removes every field the message did not populate, and
pushes the result. What comes out is a valid resource with no empty scaffolding
left in it.

```text
upstream node  →  FHIR Resource Creator  →  your next node
```

No network calls and no credentials: this is a local transformation, so it runs
the same in DEV as in PROD and has nothing to authenticate.

:::tip[Pair it with the Validator]
The Resource Creator produces syntactically clean JSON, but syntactically clean
is not the same as conformant. To confirm a resource is acceptable to the server
that will store it, send it through the
[FHIR Validator](fhir-validator.md) next.
:::

## Configuration reference

| Field | Default | What it does |
| --- | --- | --- |
| **Resource Type** | `Patient` | Which FHIR resource to build — `Patient` or `Observation`. |
| **Identifier System** | `http://example.org/mrn` | The identifier system stamped on a Patient's identifier when the input carries an `identifier_value` but no `identifier_system` of its own. An `identifier_system` in the input overrides this. Not used for Observation. |
| **On Error** | `Stop` | What to do when the input cannot be mapped. `Stop` logs the error and forwards nothing — a partial or malformed resource is never sent. `Push to error route` forwards the original input to the Error Topic. |
| **Error Topic** | _(empty)_ | The topic to publish the original input to when On Error is `Push to error route`. |

With no configuration the node builds a Patient, exactly as earlier versions did,
so an existing node keeps working unchanged.

## Input fields

### Patient

| Input field | Maps to |
| --- | --- |
| `family`, `given` | `name[0].family`, `name[0].given[0]` |
| `gender` | `gender` (a FHIR code: `male` / `female` / `other` / `unknown`) |
| `birthDate` | `birthDate` (ISO `YYYY-MM-DD`) |
| `phone`, `email` | `telecom[]` |
| `addressLine`, `city`, `state`, `postalCode`, `country` | `address[0]` |
| `identifier_system`, `identifier_value` | `identifier[0]` |
| `active` | `active` |

### Observation

| Input field | Maps to |
| --- | --- |
| `status` | `status` (defaults to `final`) |
| `code`, `codeSystem`, `codeDisplay`, `codeText` | `code.coding[0]` and `code.text` |
| `subjectReference` or `subjectDisplay` | `subject` |
| `effectiveDateTime` | `effectiveDateTime` |
| `value` + `unit` | `valueQuantity` (when `value` is numeric) |
| `valueString` | `valueString` (when there is no numeric value) |

A message that populates no mappable field is reported as an error rather than
producing an all-but-empty resource.

## Correct JSON shapes, even for sparse input

FHIR is strict about which fields are arrays and which are objects. This node
tags every array and object explicitly, so a message that fills in only a couple
of fields still produces `name` as an array of an object and `identifier` as an
array — never an empty array where an object belongs, and never the reverse.
Fields the message did not supply are removed entirely rather than left as empty
structures.

## Set it up

1. Add the **FHIR Resource Creator** node to a workflow from the palette.
2. Set **Resource Type**, and **Identifier System** if you are building
   Patients.
3. Connect the node producing your source data to its input, and the node that
   should receive the resource to its output.
4. Send one message through with **Run Test** on the upstream node, then start
   both nodes.

To change which input fields land where, edit the node's own script — the
mapping lives in the `fhir_resource` library beside it. See
[Custom Scripting Nodes](../interface-development/interfaces/custom-scripting-nodes.md).

## Verify it worked

- The downstream node receives JSON with `resourceType` set to your chosen type.
- Fields your message did not supply are absent from the output, not present and
  null, and not empty arrays or objects.
- Sending the same message twice produces identical output.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| The node reports a mapping error and forwards nothing | The message did not populate any field the resource type expects | Check the field names against the tables above |
| `unsupported Resource Type` | Resource Type is set to something other than Patient or Observation | Choose a supported type |
| Expected fields are missing from the resource | The message did not carry them, so they were stripped | Confirm the upstream node populates them |
| The resource is rejected by a FHIR server | Clean JSON is not the same as conformant FHIR | Put a [FHIR Validator](fhir-validator.md) after this node |

## Next

- [FHIR Validator](fhir-validator.md) — confirm the resource is acceptable before sending it
- [FHIR Profiling Tools](fhir-profiling-tools.md) — get a JSON template or author a profile
- [Custom Scripting Nodes](../interface-development/interfaces/custom-scripting-nodes.md)
