---
title: Interfaces and Core Nodes
---

# Interfaces and Core Nodes

A workflow is built from three kinds of node.

```text
Source  →  Transform  →  Destination
```

## The node palette

In the Workflow Builder, the palette groups node types under three headings. Drag one onto the canvas to add it.

| Group | Node | Triggered by | Script |
| --- | --- | --- | --- |
| **Source** | **HTTP** | An inbound HTTP request on a route | Required |
| **Source** | **LLP** | An inbound HL7 v2 message over MLLP | Only for a custom ACK |
| **Source** | **File/FTP** | A timer, polling a directory or FTP/FTPS/SFTP server | Not used |
| **Source** | **Custom** | A timer | Required |
| **Transform** | **Custom** | An inbound message from an upstream node | Required |
| **Transform** | **Data Map** | An inbound message from an upstream node | Generated from the map |
| **Destination** | **Database** | An inbound message of database rows from an upstream node | Not used |
| **Destination** | **File/FTP** | An inbound message from an upstream node | Not used |
| **Destination** | **LLP** | An inbound message from an upstream node | Not used |

Transport nodes are configured with fields, not code. You write Lua only where the work is genuinely yours: HTTP handling, transformation, and generated or fetched messages. Converting a message from one format to another needn't be code either: a [Data Map node](data-map/index.md) generates it from a map you draw.

:::note[How this documentation names nodes]
The palette shows a group heading and a short name. In running text, naming a node type needs both, so this documentation writes them together — "Source HTTP", "Destination File/FTP". In the Grid you will see **HTTP** under **Source**.
:::

Your project's own [node templates](../../administration/configurations/project-settings.md) appear in the same palette, under the group matching their type. Prebuilt [adapters](../../adapters/index.md) arrive as templates too, so an Epic or S3 node is added the same way as any other and configured with fields.

### Finding things in the palette

| Control | What it does |
| --- | --- |
| **Search** | Filters the palette by node name |
| **All / Project / Catalog** tabs | Narrows to built-in nodes, this project's own templates, or adapters from a subscribed [catalog](../../catalogs/index.md) |
| **Catalog filter** | On the **Catalog** tab, shows or hides individual catalogs when several are subscribed |
| **Drag the palette's edge** | Resizes it, for adapter names too long to read at the default width |

:::caution[Destination Custom]
The palette also offers **Custom** under **Destination**. It has no runtime implementation in this release — a workflow containing one will not run it. Use **Transform Custom** for script-driven delivery instead: a transform node that calls out and never pushes is a destination in every practical sense. See [Custom Scripting Nodes](custom-scripting-nodes.md).
:::

## Choosing a source

| You need to receive | Use |
| --- | --- |
| HL7 v2 over an MLLP socket | Source LLP |
| An HTTP or REST call | Source HTTP |
| Files from a directory | Source File/FTP |
| Files from an FTP, FTPS, or SFTP server | Source File/FTP with **Use FTP** enabled |
| Data you fetch or generate yourself on a schedule | Source Custom |

## Choosing a destination

| You need to deliver | Use |
| --- | --- |
| HL7 v2 over MLLP, with ACK handling | Destination LLP |
| Files to a directory | Destination File/FTP |
| Files to an FTP, FTPS, or SFTP server | Destination File/FTP with **Upload to FTP** enabled |
| Rows into a SQL Server, PostgreSQL, Oracle or SQLite table | [Destination Database](database-node.md) |
| An outbound HTTP call | Transform Custom, calling `linkiir.link.web.post` |
| Email | Transform Custom, calling `linkiir.link.mail.send` |
| Database work beyond writing rows, such as a stored procedure or your own SQL | Transform Custom, calling `linkiir.store` |

The last three are transform nodes rather than dedicated destination types: you make the outbound call from a script. See [Linkiir Scripting API](../../api/scripting-api/index.md).

## Node icons on the canvas

Each built-in node type has its own icon on the canvas, so a workflow reads at a glance.

| Icon | Node |
| --- | --- |
| Globe | Source HTTP |
| Folder with an arrow in | Source File/FTP |
| Folder with an arrow out | Destination File/FTP |
| Angle brackets with dots | Source and Destination LLP |
| Two arrows | Transform Data Map |
| Database | Destination Database |
| Terminal | Source, Transform and Destination Custom, and the Notification Alert node |

An adapter built on one of these node types shows that type's icon. Any other node shows a general source, transform or destination icon.

## The Node Parameters panel

Click a node on the canvas to open **Node Parameters** on the right. The panel shows the node's name and type, then one card for each tab of the node's **Configure** dialog, in the same order. Every node is set up in that dialog. Nothing in the panel is edited in place, and the panel has no **Edit** button.

The buttons stay at the bottom of the panel while the cards scroll:

- **Configure** opens the dialog on its first tab. **Configure** in a node's right-click menu on the canvas does the same.
- A card's title opens the dialog on that card's tab.
- **Edit Script** (**Edit Map** on a Data Map node) opens the node on the Scripting page.

### The Configure dialog

Every node's dialog starts with **General** and ends with **Advanced**. The tabs in between depend on the node:

| Node | Tabs between General and Advanced |
| --- | --- |
| Most nodes | **Parameters** (the fields the node's template defines), **Custom Parameters** |
| LLP | Connection, Messages, Acknowledgments (destination only), Security, Custom Parameters |
| File/FTP | Files, Content (source only), FTP |
| Database | Connection, Tables, Behaviour |

A node with no template-defined fields has no **Parameters** tab: all of its fields are under **Custom Parameters**.

| Tab | Holds |
| --- | --- |
| **General** | The node's **Name** and **Description**. The **Catalog** it follows, for a catalog adapter. **Run from commit**. |
| **Advanced** | **Debug Logging**, **Payload Encryption**, and the node's **Permissions**. Permissions appear only on nodes that run a script. A Database node's **Batching** is here too. |

Inside the dialog:

- Fields are grouped in titled cards. Hover over a field's name to see its description.
- A field appears only when the setting it depends on is on.
- A number field shows its unit, such as `ms`, `sec` or `attempts`, at the end of its input.
- On LLP, File/FTP and Database nodes, the first of the node's own tabs shows where the node listens, reads, writes or sends. It updates as you type.

Saving:

- **Save** writes everything you changed on every tab. The fields are saved first, then the name, description and debug logging, then permissions, then payload encryption, then **Unlink**, then **Run from commit**.
- If one of these is refused, the dialog stays open and says which one and why. Click **Save** again to retry. Anything already saved isn't sent twice.
- **Save** stays unavailable while the node has no name.
- **Cancel** asks before throwing away unsaved changes.
- A node that hasn't been saved to the canvas yet can't be configured. Save the canvas first.

**Run from commit** pins the node to a commit. Saving a new pin reloads the node in the Runtime. Choosing the newest commit means "follow the latest": the node keeps picking up new commits instead of freezing on that one.

On a catalog adapter, choosing a version and **Update** apply as soon as you choose them, not on **Save**. They rewrite the node's files and fields, so they wait until the dialog has no other unsaved changes.

**Unlink** waits for **Save**. Clicking it marks the node to be unlinked, and the button changes to **Keep linked** in case you change your mind. Unlinking leaves the node's files as they are and makes them yours to change.

**Payload Encryption** reaches a running node when it next restarts.

### Who can change what

Each setting has its own permission. Without it, that control is read-only and its hover text names the permission it needs.

| Change | Permission |
| --- | --- |
| A field's value | **Edit config values** |
| Adding, removing or redefining a custom parameter. A catalog version, **Update** or **Unlink**. | **Edit config fields** |
| Name, description, **Debug Logging** | **Edit node details** |
| **Payload Encryption** | **Change payload encryption** |
| **Permissions** | **Edit node permissions** |
| **Run from commit** | **Set run commit** |

With none of them, the button reads **View configuration** and the dialog is read-only. See [Users and Roles](../../administration/configurations/user-roles.md).

### Custom Parameters

The **Custom Parameters** tab holds fields of your own, beyond the node's built-in ones. The tab shows how many there are. File/FTP and Database nodes don't have this tab: a field you added to one of them appears in the dialog's first card, or under **Writing** on a Database node.

- **Values.** Each field is one row, showing its name and type beside its value. Set the value right there. Hover over the name to see its description.
- **Definitions.** The gear on a row opens the field's definition: its name, type, default value and description. While it's open, the value is set there as **Default value**. The type can be `string`, `number`, `bool`, `list`, `password` or `file_path`. For a list, enter its options separated by commas. Click **Done** to close the definition again.
- **Adding a field.** Click **Add parameter**. The new field opens on its definition so you can name it.
- **Removing a field.** Click the bin on its row.
- **Names.** Every field needs a name, and no two fields on the node can share one. **Save** stays unavailable until each name is set and unique.

Beside **Configure**, an LLP node has **Edit Ack**, which opens its `ack.lua`. A Database node has **Edit Schema**, which opens its `schema.json`. Both open on the Scripting page. **Edit Ack** is unavailable until the node uses a custom ACK: **Acknowledgment Mode** set to **Custom** on a source, or **Ack Verification** set to **Custom** on a destination. Only then does the node run `ack.lua`.

## Required fields and when they are checked

Node configuration forms do not mark fields as required, and they let you save an incomplete node. Validation happens when the node **starts**: a missing or invalid value stops the start and names the field.

```text
missing required field: Route Path
invalid required field: Interval (must be > 0)
missing required field: FTP Server (required when Use FTP is enabled)
```

The reference pages below mark the fields each node type needs to start. Everything else has a working default.

This is why **Run Test** followed by starting a single node is the right order when building: the test catches script errors, the start catches configuration errors.

## Fields you can add yourself

Beyond the fields a node type defines, you can add your own to a node's configuration and read them from your script. Useful for values you want configurable without editing code.

Nodes created from a Linkiir-supplied template have their built-in fields locked: you can change a value, but not a label, type, or option list, and you cannot remove or move one. Fields you add yourself remain fully editable.

To reorder fields, use the **Node Config** panel on the Scripting page. Switch it to **Editing**, then drag a field by the grip to the left of its name. To use the keyboard, focus the grip, press Space, move the field with the arrow keys, and press Space again. Locked fields have no grip and keep their order. Fields you added can go above, below, or between them. The new order is saved as soon as you drop the field.

## Editing the canvas

Adding, moving, connecting, and deleting all happen in the Workflow Builder's **Edit** mode. Outside it the canvas is read-only, though you can still select a node to read its parameters and open its script.

Right-click a node for:

| Item | Available |
| --- | --- |
| **Create template** | Always |
| **Edit script** | Always, except on File/FTP and Database nodes, which have no script |
| **Remove upstream connection** | Edit mode |
| **Remove downstream connection** | Edit mode, and not on a destination node |
| **Delete node** | Edit mode |

Right-click a connection, in edit mode, for **Delete connection** — that one line only, rather than everything running into or out of a node.

Each of these asks before it acts, naming what it is about to change: the node by name, or the two nodes a connection joins. Canvas changes stay local until you click **Save**; **Cancel** restores the canvas as it was when you entered edit mode.

The breadcrumb above the canvas switches project and workflow, and creates them too: the project dropdown offers **New project** and the workflow dropdown **New workflow**, each taking a name and description and opening what it creates.

## Reference pages

- [Source Nodes](source-nodes.md)
- [Destination Nodes](destination-nodes.md)
- [Database Node](database-node.md)
- [Custom Scripting Nodes](custom-scripting-nodes.md)

:::note[Conditional fields]
Many fields appear only once the setting they depend on is enabled. The FTP fields on a File/FTP node appear after you turn **Use FTP** on; the TLS fields appear after **Use SSL**. If a field in these pages is not visible, check the setting it depends on.
:::
