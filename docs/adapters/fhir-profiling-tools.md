---
title: FHIR Profiling Tools
description: Use the Linkiir FHIR Profiling Tools node to open the FHIR Profile Designer in a browser, choose a resource and its fields, and copy a FHIR JSON template for the FHIR Resource Creator.
keywords: [FHIR, profiling, profile designer, templates, resource types, R4, R5]
---

# FHIR Profiling Tools

A **Source HTTP** node that serves the **FHIR Profile Designer**: a browser page where you choose a FHIR resource, pick the fields you want, and copy a FHIR JSON template with null placeholders ready to paste into a [FHIR Resource Creator](fhir-resource-creator.md).

Published in the **[Linkiir FHIR Adapters](catalogs/fhir.md)** catalog. Subscribe to that catalog to add this adapter to your grid — see [Adapter Catalogs](catalogs/index.md).

## What it does

Open the node's route in a browser and you get the **FHIR Profile Designer**. Choose a **FHIR Version** (R4 4.0.1 or R5 5.0.0) and a **Resource** such as Patient or Observation, then work with two panels:

- **Choose Fields** — the resource's elements as a tree. Required fields are checked and locked so they are always present. Optional fields are yours to select. Search by name, and use **Select All**, **Unselect All**, or **Selected Only** to move quickly.
- **FHIR JSON Preview** — a live FHIR template of what you selected, shown as **JSON** or as a **Tree**. Every selected field appears with a `null` placeholder; unselected optional fields are omitted. **Copy JSON** or **Download** the result.

The template is a mapping aid, not an integration. The `null` values are placeholders: paste the JSON into a Resource Creator, and it replaces each `null` with your mapped data.

No credentials and no outbound calls: the page answers from FHIR specification data held locally.

## The template hands off to the Resource Creator

The Profile Designer and the [FHIR Resource Creator](fhir-resource-creator.md) are built to work together:

```text
Profile Designer  →  copy FHIR JSON template  →  paste into Resource Creator's Template  →  Creator fills the nulls
```

Copy the JSON and paste it into the **Template** field of a Resource Creator node (**Edit → Template**). Required elements are always in the template; optional elements you left unselected are omitted. See [FHIR Resource Creator](fhir-resource-creator.md).

## Set it up

1. Open the **FHIR Profiling Tools** node in the Workflow Builder and click **Edit**.
2. Set **Route Path** to the path you want it served on, and pick the default **FHIR Version**. You can still switch versions in the page itself.
3. **Save** and start the node.
4. Open the route in a browser, on the port configured in **Settings → Http Server**. See [HTTP Server Settings](../administration/configurations/http-server.md).

The first request after a version change builds the profile data it serves, so it takes a little longer than the ones after it.

## Configuration reference

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| **Route Path** | string | `fhir` | URL path this node answers on |
| **Worker Count** | number | `1` | How many requests it handles at once. Raise it only if several people use it together |
| **FHIR Version** | list | `4.0.1` | Default specification version. The Profile Designer can switch between R4 and R5 at request time |
| **Refresh** | bool | `false` | Turn on to rebuild the profile data on the next request, then turn it off |
| **Specifications Path** | string | *(empty)* | Where the specification files live. Empty uses the copy supplied with the node |

:::caution[The page has no authentication]
Like any HTTP source node, this route answers anyone who can reach the port. It serves specification templates rather than patient data, but treat it as an internal tool: keep it on a restricted network and stop the node when you are not using it. See [Security](../administration/security/index.md).
:::

## Verify it worked

- The route returns the Profile Designer, with the FHIR Version and Resource selectors populated.
- Choosing **Patient** lists its fields, with the required ones checked and locked.
- The **FHIR JSON Preview** shows a Patient object whose selected fields are present with `null` values, and **Copy JSON** copies it.
- Switching the theme toggle moves the page between light and dark.

## If it didn't work

| Symptom | Cause | Fix |
| --- | --- | --- |
| The browser cannot reach the route | The node is stopped, or the embedded HTTP server is off | Start the node; check **Use Server** in [HTTP Server Settings](../administration/configurations/http-server.md) |
| `missing required field: Route Path` at start | **Route Path** is empty | Set a path and restart |
| The resource list or field tree is empty | The profile data has not been built for the selected version | Turn **Refresh** on, load the page once, then turn it off |
| A resource is missing from the list | It is not part of the selected **FHIR Version** | Switch the version, or check the resource name |
| Requests are slow under several users | **Worker Count** is `1` | Raise it a little and restart |

## Next

- [FHIR Resource Creator](fhir-resource-creator.md) — fill the template's nulls with your own data
- [FHIR Validator](fhir-validator.md) — check a resource against a FHIR server before you send it
- [How Adapters Work](how-adapters-work.md)
- [Source Nodes](../interface-development/interfaces/source-nodes.md)
