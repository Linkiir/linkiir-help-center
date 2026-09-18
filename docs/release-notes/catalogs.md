---
title: Linkiir Catalogs Release Notes
sidebar_label: Linkiir Catalogs Release Notes
description: "Current version and changelog for every Linkiir catalog adapter and library, and how to move a node to a newer version."
keywords: [release notes, catalogs, adapters, libraries, versions, changelog, upgrade]
---

# Linkiir Catalogs Release Notes

Version history for the adapters and libraries published in the Linkiir catalogs. Catalogs are pulled into a running grid over git, so new adapter content reaches you without upgrading Linkiir Grid.

For Grid itself, see [Linkiir Product Release Notes](./product.md).

Release notes are organised **by catalog and by item**, not by date: you already know which adapter you run, and what you need is its current version and what changed. Pick your catalog below.

## Catalogs

| Catalog | Adapters | Libraries | Release notes |
| --- | --- | --- | --- |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | 8 | 8 | [versions and changelogs](./catalogs-fhir.md) |
| [EHR Adapters](../adapters/catalogs/ehr.md) | 2 | 1 | [versions and changelogs](./catalogs-ehr.md) |
| [Diagnostics Adapters](../adapters/catalogs/diagnostics.md) | 2 | 1 | [versions and changelogs](./catalogs-diagnostics.md) |
| [Business Adapters](../adapters/catalogs/business.md) | 2 | 2 | [versions and changelogs](./catalogs-business.md) |
| [Transport Adapters](../adapters/catalogs/transport.md) | 2 | 1 | [versions and changelogs](./catalogs-transport.md) |
| [Notification Adapters](../adapters/catalogs/notification.md) | 1 | 1 | [versions and changelogs](./catalogs-notification.md) |
| [AI Adapters](../adapters/catalogs/ai.md) | 1 | 1 | [versions and changelogs](./catalogs-ai.md) |
| [Developer Tools](../adapters/catalogs/devtools.md) | 1 | 0 | [versions and changelogs](./catalogs-devtools.md) |

**18 adapters** and **15 libraries** across **8 catalogs**.

## Finding the version you are on

Every node built from a catalog adapter records the version it was built from, so nothing has to be worked out by hand.

| To see | Where |
| --- | --- |
| The version a single node is on | Open the node in the Builder. The adapter it follows and the version it was built from are shown on the node. |
| Every node that is behind | **Settings → Catalogs**. After a pull, Grid lists each node whose adapter has a newer release, and each node still on an older library version. |
| What the catalog currently publishes | The **Current versions** table on this catalog's release-notes page, or the catalog's own page. |

## Upgrading to a newer version

A pull moves the catalog's checkout and **nothing else**. That is deliberate: the runtime builds a node from its own files, so new vendor code cannot disturb a running workflow. Taking an update is a separate, explicit step.

1. **Settings → Catalogs → Check for updates.** Grid fetches the tracked ref and shows you the incoming commit and the files it would change.
2. **Pull it.** The catalog's checkout moves forward. Your nodes are untouched.
3. **Adopt the update.** Grid then lists what is now behind, in two groups, because they are applied differently:

| Group | What happens | Applied |
| --- | --- | --- |
| **Adapters** | The node is rebuilt from the newer release of its template — files, configuration fields and library pins together. Your configuration values are kept. | Per node |
| **Libraries** | The node's copy of one library is swapped for a newer version and re-pinned. | Per project, in a single commit |

Choose which nodes move and when. New vendor code going into a live integration is an operator decision, not a side effect of pulling.

:::caution[A running node cannot be updated]
Grid lists a running node but will not move it — stop it first. A node with a run-from-commit pin is also flagged, because an update clears the pin: until then the runtime is materialising the pinned commit whatever the node's files say.
:::

## How versioning works

| | |
| --- | --- |
| **Adapters** | Each adapter carries its own `version`. A change that does not move the version forward is rejected when the catalog is published, so one version always means one specific set of files. |
| **Libraries** | The version *is* the identity. A published library version is never edited; a fix ships as a new version. Several versions can be installed side by side, and each node pins the one it uses. |

The practical consequence: **pulling an update cannot change a node that is already running.** It moves only when you move it.

## Next

- [Adapter Catalogs](../adapters/catalogs/index.md) — repository URLs and how to subscribe
- [Using Catalog Content](../catalogs/using-catalog-content.md) — building nodes from a catalog and keeping them updated
- [Subscribing to a Catalog](../catalogs/subscribing.md) — reviewing an update's diff
