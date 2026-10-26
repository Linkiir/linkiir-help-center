---
title: Subscribing to a Catalog
description: Install Linkiir's catalogs from a list, or add any published catalog by URL or folder; see when an update is waiting, review what it changes, and pull it.
keywords: [catalog, subscribe, install, Linkiir catalogs, pull, update, adapters, validation, diff]
---

# Subscribing to a Catalog

Subscribing installs a publisher's catalog on this grid, so its adapters appear in the node palette and its libraries can be installed into projects.

Catalogs are managed in **Settings → Catalogs**. Everything on this page needs the **Manage catalogs** permission.

## Install Linkiir's catalogs

Linkiir publishes its adapters as catalogs, and the grid can list them for you,
so there is no repository URL to look up.

1. Open **Settings → Catalogs**.
2. Click **Install Linkiir catalogs**. With no catalogs installed yet, this is the
   main button in the middle of the tab. Once you have some, it is the
   **Linkiir catalogs** button at the top.
3. Tick the catalogs this grid needs. They are grouped by area — Healthcare,
   Business systems, Transport and messaging, AI and Developer tools — and the
   link next to each name opens its page in this help center.
4. Click **Install**.

Catalogs are installed one at a time, each with the same checks as any other
subscription (see [What validation refuses](#what-validation-refuses)). If one
fails, the reason is shown against it and the rest still install. Close the
picker whenever you are done; you can come back and add more at any time.

In the list:

| Shown | Meaning |
| --- | --- |
| **Installed** | That catalog is already on this grid, including one imported from a folder. It cannot be ticked again. |
| **Requires Grid *x*** | The catalog needs a newer version of Linkiir Grid. Upgrade the grid to install it. |
| **Failed** | The install did not complete. The reason is shown underneath, and nothing of that catalog was left behind. |

### Where the list comes from

The grid downloads the list from `https://download.linkiir.com/catalogs/catalogs.json`
when you open the picker, and at no other time. The request goes through the
same proxy as software update checks, if one is configured, and carries only
the grid's version and platform.

The list is signed by Linkiir, and the grid checks that signature before using
any of it. Two further checks apply whatever the list says:

- Every catalog in it must come from Linkiir's own repositories on GitHub
  (`https://github.com/Linkiir/…`). Any other entry is ignored.
- The repository that is cloned must declare the catalog it was listed as. If it
  declares a different one, nothing is installed.

### If the list cannot be downloaded

A grid with no route to `download.linkiir.com` shows an error in the picker.
Subscribe by repository URL instead (below), using the addresses in this table,
or bring the catalogs in on a drive — see [Offline delivery](offline-delivery.md).

| Catalog | Repository URL |
| --- | --- |
| [FHIR Adapters](../adapters/catalogs/fhir.md) | `https://github.com/Linkiir/linkiir-fhir-adapters` |
| [EHR Adapters](../adapters/catalogs/ehr.md) | `https://github.com/Linkiir/linkiir-ehr-adapters` |
| [Diagnostics Adapters](../adapters/catalogs/diagnostics.md) | `https://github.com/Linkiir/linkiir-diagnostics-adapters` |
| [Business Adapters](../adapters/catalogs/business.md) | `https://github.com/Linkiir/linkiir-business-adapters` |
| [Transport Adapters](../adapters/catalogs/transport.md) | `https://github.com/Linkiir/linkiir-transport-adapters` |
| [Notification Adapters](../adapters/catalogs/notification.md) | `https://github.com/Linkiir/linkiir-notification-adapters` |
| [AI Adapters](../adapters/catalogs/ai.md) | `https://github.com/Linkiir/linkiir-ai-adapters` |
| [Developer Tools](../adapters/catalogs/devtools.md) | `https://github.com/Linkiir/linkiir-devtools` |

These repositories are public, so leave the SSH key empty. See
[Adapter Catalogs](../adapters/catalogs/index.md) for what each one contains.

## Add a catalog by URL or folder

Use this for any catalog that is not in Linkiir's list — your own, or another
publisher's — or for a Linkiir catalog on a grid that cannot download the list.

Click **Subscribe to a catalog** and fill in:

| Field | What it is |
| --- | --- |
| **Repository URL or folder** | An `https://` URL, an SSH URL, or the absolute path of a folder on this server holding an exported catalog |
| **Branch or tag** | The ref to track. Defaults to `main`. |
| **SSH key** | Private key for an SSH repository, as a path on this server. A browse button is provided, so the path does not have to be typed from memory. Leave empty to use the admin user's key. |
| **CA bundle** | Only for a self-hosted HTTPS repository whose certificate this host does not already trust. |

Catalogs are installed under their repository's own name — there is nothing to choose.

The catalog is cloned into a staging area and validated before anything is installed. If validation fails, nothing is left behind — no directory and no registry entry — and the reason is reported.

### What validation refuses

Validation is not a sandbox. A catalog is ordinary Lua that will run on your grid, and deciding whether to trust its publisher is your call. What these checks do is narrower: refuse content that would break the grid or misrepresent itself, whoever published it.

| Refused | Why |
| --- | --- |
| No catalog manifest at the repository root | It is not a Linkiir catalog |
| A manifest this version cannot read | The catalog uses a newer format than this grid supports |
| Unsafe, too deeply nested, or Windows-reserved paths | The content could not be checked out safely on every platform |
| Symbolic links and git submodules | Both can point outside the catalog |
| A node type identifier already in use on this grid | Identifiers must not collide with another catalog's, or with the ones the Runtime handles specially |
| A password field shipped with a value | A catalog must never carry a secret. An encrypted one would not decrypt on a subscriber's grid anyway. |
| An empty repository, or more files than the grid accepts | Nothing to install, or implausibly large |

A catalog that declares a version for an adapter can never drop it later, and an update that changes a versioned adapter without moving its version forward is refused. That rule is what makes a version, rather than a commit hash, the thing a node can be pinned to.

## Seeing that an update is waiting

A background check fetches each catalog on a schedule and caches the answer, so the Catalogs tab can show which catalogs are behind without stalling on the network. It runs shortly after the grid starts, on an interval after that, and again whenever you open the Catalogs tab.

The fetch is strictly read-only. Nothing is ever applied on its own — pulling an update stays a decision somebody makes.

## Review and pull an update

Open the catalog and choose to view the update. You see the incoming commit and a diff of what it changes, grouped as **What changed** with the publisher's release notes alongside.

Review it before applying. A pull replaces the checkout, so this is the point at which a force-pushed or compromised upstream is visible — afterwards there would be nothing left to compare against.

Click **Pull** to apply. What happens next depends on whether this grid can write to the catalog:

- **A read-only subscription** is reset onto the incoming commit. There is nothing local to lose.
- **A catalog this grid can publish to** may hold unpublished work, so its own commits are replayed on top of the incoming ones. Only a genuine conflict stops it.

Pulling a catalog updates the catalog itself. It does not touch the nodes built from it — those are updated per node, which is a separate and deliberate decision. See [Using catalog content](using-catalog-content.md).

## Remove a catalog

**Remove this catalog from the grid** deletes the checkout and its registry entry. Nodes already built from its adapters keep working: their files live in the project, not in the catalog. What they lose is the ability to be updated from it.
