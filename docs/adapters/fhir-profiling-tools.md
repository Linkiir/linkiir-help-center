---
title: FHIR Profiling Tools
description: Use the Linkiir FHIR Profiling Tools node's browser portal to pick a FHIR version (R4 4.0.1 or R5 5.0.0), get a JSON template for any resource, and author profiles.
keywords: [FHIR, profiling, templates, resource types, mapping, R4, R5, profile designer]
---

# FHIR Profiling Tools

A **Source HTTP** node that serves a page listing every FHIR resource and complex type, returns a JSON template for any one of them, and authors constrained profiles with the **Profile Designer**.

Published in the **[Linkiir FHIR Adapters](catalogs/fhir.md)** catalog. Subscribe to that catalog to add this adapter to your grid — see [Adapter Catalogs](catalogs/index.md).

Current version and changelog: [FHIR Adapters release notes](../release-notes/catalogs-fhir.md).

## What it does

Open the node's route in a browser and you get the **Profile Designer** portal: choose a FHIR version, choose a base resource, and see its elements. From there you can copy a resource template to map in the [FHIR Resource Creator](fhir-resource-creator.md), or toggle field constraints to author a profile. It ships two FHIR versions — **R4 (4.0.1)** and **R5 (5.0.0)** — and you switch between them from the portal without restarting the node.

It is a mapping and profiling aid rather than an integration. Use a template to see the exact shape and field names of a resource before you write a mapping, or as the starting point for a test payload.

The portal is a single page; it also exposes a small JSON API that the page itself calls, and that you can call directly. Every data request takes an optional `&version=` (defaulting to the node's configured **FHIR Version**):

| Request | You get |
| --- | --- |
| The route on its own | The Profile Designer portal (HTML) |
| `?action=versions` | The FHIR versions this node ships, and the default (JSON) |
| `?action=resources&version=<v>` | The resource and complex-type name lists for a version (JSON) |
| `?resource=<name>&version=<v>` | That resource's JSON template |
| `?action=elements&base=<Resource>&version=<v>` | The elements of a base resource you can constrain (JSON) |
| `POST ?action=build&version=<v>` | A differential `StructureDefinition` built from a constraint spec (JSON) |
| `POST ?action=import` | An existing `StructureDefinition`, parsed with its editable constraints (JSON) |
| Anything else | A JSON not-found response |

Resource names are not case-sensitive, so `patient` and `Patient` both work.

No credentials and no outbound calls: the node answers from FHIR specification data held locally.

### FHIR versions

The node ships the official HL7 StructureDefinition bundles for each supported release under a `fhir-definitions/` folder, one subfolder per release (`R4_4.0.1/`, `R5_5.0.0/`), each holding `resources.json` and `types.json`. The searchable database for a release is **built on first use** rather than shipped, so the first request against a version you have not used yet takes a little longer while it is prepared; each release keeps its own database, so switching versions never rebuilds another one.

## Profile Designer portal

The browser page is a design-time workspace. Working top to bottom:

1. **FHIR version** and **Base resource** dropdowns. Pick the release you are mapping against and the resource to work from (for example `Patient`).
2. **Profile name** and **Canonical URL** for the profile you are authoring.
3. **Field constraints** — every element of the base resource, each with a **Required** and a **Must-support** toggle. Turn on the ones your profile constrains.
4. **Configuration preview** — a live JSON preview with two tabs, and a **Copy configuration** button that copies whichever tab is showing:
   - **Profile config** — a compact JSON summary of the profile you are authoring (resource type, name, canonical URL, FHIR version, and the required / must-support element lists).
   - **Resource template** — the full JSON skeleton of the base resource, ready to paste into a [FHIR Resource Creator](fhir-resource-creator.md) node as the shape to map into.

Everything the portal shows comes from the node's own API, so the same results are available programmatically:

| Action | Does |
| --- | --- |
| List elements | `?action=elements&base=Patient&version=4.0.1` returns the constrainable elements of the base resource, read from the loaded FHIR specification. |
| Build | `POST ?action=build&version=4.0.1` with a constraint spec returns the generated differential `StructureDefinition`. |
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
2. Set **Route Path** to the path you want it served on. **FHIR Version** sets the portal's default release; you can still switch versions from the portal itself.
3. **Save** and start the node.
4. Open the route in a browser, on the port configured in **Settings → Http Server**. See [HTTP Server Settings](../administration/configurations/http-server.md).

The first request against a version builds the profile database it serves, so it takes a little longer than the ones after it; each shipped version is prepared independently the first time you select it.

## Configuration reference

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| **Route Path** | string | `fhir` | URL path this node answers on |
| **Worker Count** | number | `1` | How many requests it handles at once. Raise it only if several people use it together |
| **FHIR Version** | list | `4.0.1` | Default release the portal opens on (`4.0.1` or `5.0.0`). The portal can switch between shipped versions at request time |
| **Refresh** | bool | `false` | Turn on to rebuild the profile database on the next request, then turn it off |
| **Specifications Path** | string | *(empty)* | A `fhir-definitions` directory with one folder per release (`R4_4.0.1/`, `R5_5.0.0/`) holding `resources.json` and `types.json`. Empty uses the copy supplied with the node |

:::caution[The page has no authentication]
Like any HTTP source node, this route answers anyone who can reach the port. It serves specification templates rather than patient data, but treat it as an internal tool: keep it on a restricted network and stop the node when you are not using it. See [Security](../administration/security/index.md).
:::

## Verify it worked

- The route returns the Profile Designer portal, with a FHIR version dropdown offering **4.0.1** and **5.0.0**.
- Choosing a base resource lists its elements with Required / Must-support toggles, and the Configuration preview updates as you toggle.
- Requesting `Patient` returns a JSON object with `name`, `gender`, `birthDate`, and the rest of the Patient fields, all unset.
- Switching the version dropdown to `5.0.0` and picking `Patient` shows R5's fields (the template differs from R4's).
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
