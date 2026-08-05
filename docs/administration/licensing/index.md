---
title: Licensing
---

# Licensing

A Linkiir license is a signed code you apply to one installation. It sets how much that installation may run and until when.

Everything happens in one place: **Settings → License**.

## The three values you will handle

| Value | Looks like | What it is |
| --- | --- | --- |
| **License ID** | `LK-XXXXX-XXXXX-XXXXX-XXXXX-C` | This installation's identity. Linkiir generates it. You send it to your vendor. |
| **License Code** | `LK1.eyJ...` | What the vendor sends back. You paste it in to license the installation. |
| **Migration Code** | `MG1-XXXX-XXXX-XXXX-XXXX-C` | Produced only when you are moving a license to a different installation. |

The first two are all you need for a normal activation. See [License ID and License Code](license-id-code.md).

## What a license controls

| Control | Effect |
| --- | --- |
| **Active Workflows** | How many workflows may run at the same time. Starting one beyond the limit is refused. |
| **Nodes per Workflow** | The largest number of nodes a single workflow may contain. |
| **Expiration Date** | When the license lapses, followed by a grace period. |

See [Capacity and Expiry](capacity-and-expiry.md) for how each behaves when you reach it.

A license does not restrict which node types you can use, how many projects or users you create, or which broker or database you connect to.

## License states

The **License** tab shows the current state as a badge.

| State | Badge | Meaning |
| --- | --- | --- |
| Valid | *(none)* | Licensed and in date |
| Expiring | **Expiring Soon** | Within 30 days of the expiration date |
| Grace | **Grace Period** | Past expiry, inside the grace window |
| Expired | — | Past the grace window. Workflows drain and stop. |
| Missing | **No License** | No license applied. The default for a fresh install. |
| Migrating | **Migration In Progress** | You have declared a migration to another installation |

An unlicensed installation still lets you sign in, build projects, and write scripts. What it will not do is run workflows.

## Getting licensed

1. Install Linkiir.
2. Open **Settings → License**. It shows **No License** and your **License ID**.
3. Copy the License ID and send it to your vendor.
4. Paste the returned **License Code** into the **License Code** box, or use **Upload .lic**.
5. Click **Apply**.

The page switches to showing your license type, expiry, and capacity. No restart is needed.

Full detail in [License ID and License Code](license-id-code.md).

## In this section

| Page | Covers |
| --- | --- |
| [License Types](license-types.md) | Professional, Enterprise, and how trials work |
| [License ID and License Code](license-id-code.md) | Activating, replacing, and managing a license by environment variable |
| [Capacity and Expiry](capacity-and-expiry.md) | Running out of workflow capacity, and what happens at expiry |
| [License Transfer](license-transfer.md) | Moving a license to a replacement installation |

## What licensing does not cover

A license is per installation and independent of your content. Moving to a new server means getting a new license **and** moving your projects — they are separate steps.

| Concern | See |
| --- | --- |
| Moving projects between installations | [Import and Export](../deployment/import-export.md) |
| Protecting an installation | [Backup and Restore](../backup-restore/index.md) |
| Users and access | [Users and Roles](../configurations/user-roles.md) |
