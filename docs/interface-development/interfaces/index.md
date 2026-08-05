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
| **Destination** | **File/FTP** | An inbound message from an upstream node | Not used |
| **Destination** | **LLP** | An inbound message from an upstream node | Not used |

Transport nodes are configured with fields, not code. You write Lua only where the work is genuinely yours: HTTP handling, transformation, and generated or fetched messages.

:::note How this documentation names nodes
The palette shows a group heading and a short name. In running text, naming a node type needs both, so this documentation writes them together — "Source HTTP", "Destination File/FTP". In the Studio you will see **HTTP** under **Source**.
:::

Your project's own [node templates](../../administration/configurations/project-settings.md) appear in the same palette, under the group matching their type.

:::caution Destination Custom
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
| An outbound HTTP call | Transform Custom, calling `linkiir.link.web.post` |
| Email | Transform Custom, calling `linkiir.link.mail.send` |
| A database write | Transform Custom, calling `linkiir.store` |

The last three are transform nodes rather than dedicated destination types: you make the outbound call from a script. See [Linkiir Scripting API](../lua-programming/linkiir-api.md).

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

Nodes created from a Linkiir-supplied template have their built-in fields locked: you can change a value, but not a label, type, or option list, and you cannot remove one. Fields you add yourself remain fully editable.

## Reference pages

- [Source Nodes](source-nodes.md)
- [Destination Nodes](destination-nodes.md)
- [Custom Scripting Nodes](custom-scripting-nodes.md)

:::note Conditional fields
Many fields appear only once the setting they depend on is enabled. The FTP fields on a File/FTP node appear after you turn **Use FTP** on; the TLS fields appear after **Use SSL**. If a field in these pages is not visible, check the setting it depends on.
:::
