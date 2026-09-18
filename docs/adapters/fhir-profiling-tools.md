---
title: FHIR Profiling Tools
description: Use the Linkiir FHIR Profiling Tools node to browse FHIR resources and types in a browser and get a JSON template for any of them.
keywords: [FHIR, profiling, templates, resource types, mapping]
---

# FHIR Profiling Tools

A **Source HTTP** node that serves a page listing every FHIR resource and complex type, returns a JSON template for any one of them, and authors constrained profiles with the **Profile Designer**.

Published in the **[Linkiir FHIR Adapters](catalogs/fhir.md)** catalog. Subscribe to that catalog to add this adapter to your grid — see [Adapter Catalogs](catalogs/index.md).

Current version and changelog: [FHIR Adapters release notes](../release-notes/catalogs-fhir.md).

## What it does

Open the node's route in a browser and you get two lists: FHIR resources such as Patient and Encounter, and complex types such as HumanName and Address. Click any entry and you get its JSON template.

It is a mapping aid rather than an integration. Use a template to see the exact shape and field names of a resource before you write a mapping, or as the starting point for a test payload.

| Request | You get |
| --- | --- |
| The route on its own | The browser page, with every resource and type as a link, and the Profile Designer |
| The route with a resource name | That resource's JSON template |
| `?action=elements&base=<Resource>` | The elements of a base resource you can constrain (JSON) |
| `POST ?action=build` | A differential `StructureDefinition` built from a constraint spec (JSON) |
| `POST ?action=import` | An existing `StructureDefinition`, parsed with its editable constraints (JSON) |
| Anything else | A JSON not-found response |

Resource names are not case-sensitive, so `patient` and `Patient` both work.

No credentials and no outbound calls: the node answers from FHIR specification data held locally.

## Profile Designer

Beyond generating a template of a resource, the node authors a **profile** — a
FHIR `StructureDefinition` that constrains a base resource. Pick a base
(for example `Patient`), tighten cardinalities on the elements it offers, and the
node compiles your choices into a differential StructureDefinition.

| Action | Does |
| --- | --- |
| List elements | `?action=elements&base=Patient` returns the constrainable elements of the base resource, read from the loaded FHIR specification. |
| Build | `POST ?action=build` with a constraint spec returns the generated differential `StructureDefinition`. |
| Import | `POST ?action=import` with an existing StructureDefinition returns it parsed, with its differential constraints surfaced as editable — and the whole resource preserved so nothing this tool does not model is lost. |

A constraint spec looks like:

```json
{
  "canonicalUrl": "https://example.org/fhir/StructureDefinition/LabPatient",
  "businessVersion": "1.0.0",
  "name": "LabPatient",
  "baseResource": "Patient",
  "status": "draft",
  "constraints": [
    { "path": "Patient.identifier", "min": 1 },
    { "path": "Patient.name", "min": 1, "mustSupport": true }
  ]
}
```

:::caution[It produces a differential, not a finished profile]
The Profile Designer emits a **differential** — the list of elements your profile
changes. That is a genuine FHIR StructureDefinition, but it is deliberately
**not** a snapshot (the fully-resolved element list), and building one is **not**
a conformance check. To confirm a profile is well-formed, validate it with the
[FHIR Validator](fhir-validator.md) or a server that supports
`StructureDefinition/$validate`.
:::

## Set it up

1. Open the **FHIR Profiling Tools** node in the Workflow Builder and click **Edit**.
2. Set **Route Path** to the path you want it served on, and pick the **FHIR Version** you are mapping against.
3. **Save** and start the node.
4. Open the route in a browser, on the port configured in **Settings → Http Server**. See [HTTP Server Settings](../administration/configurations/http-server.md).

The first request after a version change builds the profile data it serves, so it takes a little longer than the ones after it.

## Configuration reference

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| **Route Path** | string | `fhir` | URL path this node answers on |
| **Worker Count** | number | `1` | How many requests it handles at once. Raise it only if several people use it together |
| **FHIR Version** | list | `4.0.1` | Specification version to serve templates for |
| **Refresh** | bool | `false` | Turn on to rebuild the profile data on the next request, then turn it off |
| **Specifications Path** | string | *(empty)* | Where the specification files live. Empty uses the copy supplied with the node |

:::caution[The page has no authentication]
Like any HTTP source node, this route answers anyone who can reach the port. It serves specification templates rather than patient data, but treat it as an internal tool: keep it on a restricted network and stop the node when you are not using it. See [Security](../administration/security/index.md).
:::

## Verify it worked

- The route returns the page, listing resources and types.
- Requesting `Patient` returns a JSON object with `name`, `gender`, `birthDate`, and the rest of the Patient fields, all unset.
- An unknown name returns a not-found response rather than an empty body.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| The browser cannot reach the route | The node is stopped, or the embedded HTTP server is off | Start the node; check **Use Server** in [HTTP Server Settings](../administration/configurations/http-server.md) |
| `missing required field: Route Path` at start | **Route Path** is empty | Set a path and restart |
| The page loads but lists nothing | The profile data has not been built for the selected version | Turn **Refresh** on, load the page once, then turn it off |
| A resource returns not-found | The name is not a resource or type in the selected **FHIR Version** | Check the spelling against the list on the page |
| Requests are slow under several users | **Worker Count** is `1` | Raise it a little and restart |

## Next

- [FHIR Resource Creator](fhir-resource-creator.md) — build a Patient or Observation resource from your own data
- [FHIR Validator](fhir-validator.md) — validate a resource, or a profile you authored here
- [How Adapters Work](how-adapters-work.md)
- [Source Nodes](../interface-development/interfaces/source-nodes.md)
