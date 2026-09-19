---
title: FHIR Validator
description: Use the Linkiir FHIR Validator node to check an inbound FHIR resource against a FHIR server's $validate operation and forward it only on a clean pass.
keywords: [FHIR, validation, $validate, OperationOutcome, R4, adapter, transform]
---

# FHIR Validator

A **Transform Custom** node that validates an inbound FHIR resource against a FHIR server's `$validate` operation and forwards it unchanged only when it passes. Anything else stops the node.

Published in the **[Linkiir FHIR Adapters](catalogs/fhir.md)** catalog. Subscribe to that catalog to add this adapter to your grid — see [Adapter Catalogs](catalogs/index.md).

## What it does

The node reads the inbound FHIR JSON, sends it to a FHIR server's `$validate` operation, and looks at the `OperationOutcome` that comes back to decide the verdict:

```text
Receive JSON  →  Validate  →  Pass or Stop
```

- **Valid** (including valid with only warnings or information) → forward the original bytes, unchanged, to the next node.
- **Invalid, or indeterminate** → stop the node with an error and forward nothing.

It **fails closed**. An invalid resource, a timeout, an HTTP error, a malformed response, or a profile the server cannot resolve all stop the node, so a resource that was not cleanly validated never reaches the next node. Stopping is done by raising an error, which hands the failure to Linkiir's own error handling.

The FHIR server is the authority. A `200` response is **not** treated as a pass on its own — the returned `OperationOutcome` decides, because `$validate` can return `200` for a resource that has errors.

The resource type is read from the resource itself, so one node validates Patient, Observation, Encounter, and others without any per-type setting.

### Where it fits

Put it straight after the [FHIR Resource Creator](fhir-resource-creator.md), so only validated resources move on.

```text
FHIR Resource Creator  →  FHIR Validator  →  a FHIR server, a file, or your next node
```

## Set it up

1. Add the **FHIR Validator** node to a workflow, or open the supplied one, and connect the node producing FHIR JSON to its input.
2. Click **Edit** and set **FHIR Server URL** to a FHIR base URL. For synthetic development testing you can use `https://hapi.fhir.org/baseR4`.
3. Optionally set **FHIR Profile** to a profile canonical URL, but only if that profile is installed on the server.
4. Connect the node that should receive the validated resource to its output.
5. **Save**, then send one message through with **Run Test** on the upstream node, and start the nodes.

:::caution[Do not send real patient data to the public server]
`https://hapi.fhir.org/baseR4` is a public development server and a **DEV example only**. In production, leave the server URL unset until an administrator selects a PHI-approved endpoint, and never point it at the public server for real patient data.
:::

## Configuration reference

Two settings, and that is the whole node.

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| **FHIR Server URL** | string | *(empty)* | The FHIR base URL whose `$validate` operation to call, with no trailing resource path. Required |
| **FHIR Profile** | string | *(empty)* | Optional profile canonical URL to validate against. Leave empty to validate against the resource's base definition |

TLS verification is always on and the request timeout is an internal default (15 seconds). Neither is exposed, deliberately — there is no switch to weaken transport security in this catalog.

If a profile is set but the server cannot resolve it, the resource is **not** forwarded. There is no silent fall back to base validation, so a requested profile is either honored or the node stops.

## The samples

The node ships a matched pair you can feed with **Run Test** to see both paths:

| Sample | What happens |
| --- | --- |
| `patient_valid.json` | A realistic Patient with a narrative. The server reports no issues, and the node forwards it |
| `patient_invalid.json` | The same Patient with an element that is not part of the FHIR spec. The server returns an error, and the node stops |

## Verify it worked

- Feeding `patient_valid.json` logs `FHIR Validator: valid, forwarded.` and the downstream node receives the resource unchanged.
- Feeding `patient_invalid.json` stops the node with `FHIR validation failed`, and nothing is forwarded.
- The log line summarizes issues by severity — errors and warnings are listed, and routine information-level notes from the server are reported as a count rather than printed in full.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| `no FHIR Server URL is configured` at run | **FHIR Server URL** is empty | Set a FHIR base URL and try again |
| Every resource stops with a timeout or HTTP error | The server URL is wrong or unreachable | Check the URL is a FHIR base with no trailing resource path, and that the server is reachable from the grid |
| A resource you expected to pass stops on a profile | The **FHIR Profile** is not installed on the server, so it cannot be resolved | Install the profile on the server, or clear the field to validate against the base definition |
| A resource passes elsewhere but fails here | This server enforces a rule or profile the other did not | Confirm the two servers and profiles match; the validating server is the authority |
| The log line is long | The server returned many issues | Only errors and warnings are listed and the line is capped; information-level notes are counted, not printed |

## Next

- [FHIR Resource Creator](fhir-resource-creator.md) — build the resource this node validates
- [FHIR Profiling Tools](fhir-profiling-tools.md) — get a JSON template for any FHIR resource
- [How Adapters Work](how-adapters-work.md)
- [Custom Scripting Nodes](../interface-development/interfaces/custom-scripting-nodes.md)
